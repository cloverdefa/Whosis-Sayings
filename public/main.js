/* global Vue */
;(async () => {
  const { createApp, ref, onMounted, onUnmounted, nextTick } = Vue

  // 使用者頭像/暱稱索引
  const gravatar = {
    hirakujira: { name: 'DK', avatar: 'bf73e08d8bc1db95b62f02d50f8a03e9' },
    cloverdefa: { name: 'DAST', avatar: '8cf3d8725d034584f237753022279119' },
    bill85101: { name: '魔王', avatar: '9e202866b38b7255f282beb005576731' },
    Shawn_N: { name: '賽瑞福', avatar: '34624582cd585ba65e5b5368c84cb1a2' }
  }

  const DEFAULT_AVATAR_HASH = '00000000000000000000000000000000'

  // 修正：Gravatar 網址補上尺寸與預設圖參數，避免抓不到圖時顯示過小/破圖
  function gravatarUrl (hash) {
    return `https://www.gravatar.com/avatar/${hash}?s=96&d=identicon`
  }

  // 修正：訊息內容原本用 v-html 直接注入未經清洗的文字，是明顯的 XSS 風險。
  // 這裡改用白名單清洗，只保留 b/strong/i/em/del/br，其餘標籤一律轉成純文字，
  // 並移除所有屬性（避免 onerror= 之類的事件注入）。
  const ALLOWED_TAGS = new Set(['B', 'STRONG', 'I', 'EM', 'DEL', 'BR'])
  function sanitizeHtml (html) {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const clean = (node) => {
      ;[...node.childNodes].forEach((child) => {
        if (child.nodeType !== 1) return
        if (!ALLOWED_TAGS.has(child.tagName)) {
          child.replaceWith(document.createTextNode(child.textContent))
          return
        }
        ;[...child.attributes].forEach((attr) => child.removeAttribute(attr.name))
        clean(child)
      })
    }
    clean(doc.body)
    return doc.body.innerHTML
  }

  // 修正：fetch 只有網路層失敗才會 reject，HTTP 錯誤（如 404）不會，
  // 必須自己檢查 response.ok，否則會把錯誤頁的 HTML 當成語錄內容。
  async function loadSayings () {
    try {
      const res = await fetch('public/saying.txt')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const txt = await res.text()
      return txt.split(';').map((s) => s.trim()).filter(Boolean)
    } catch (err) {
      console.error('讀取 saying.txt 失敗：', err)
      return []
    }
  }

  const sayings = await loadSayings()

  const App = {
    setup () {
      const selfUname = ref('cloverdefa')
      const sayingsRef = ref(sayings)
      const messages = ref([])

      // 修正：原本用陣列 index 當 v-for 的 :key，
      // 但 addRandomMessage() 會 shift() 移除最舊訊息，
      // index 當 key 會讓 Vue 認錯節點、造成內容/頭像錯位。
      // 改用遞增的唯一 id 當 key。
      let nextId = 1

      let timerId = null

      function addRandomMessage () {
        if (!sayingsRef.value.length) return
        const entry = sayingsRef.value[Math.floor(Math.random() * sayingsRef.value.length)]
        if (!entry) return

        const parts = entry.split(',')
        const uname = parts[0]
        const msg = parts.slice(1).join(',').trim()
        if (!msg) return

        const info = gravatar[uname] || { name: uname, avatar: DEFAULT_AVATAR_HASH }

        messages.value.push({
          id: nextId++,
          uname,
          name: info.name,
          avatar: gravatarUrl(info.avatar),
          text: sanitizeHtml(msg),
          ts: Date.now()
        })

        // 最多顯示 30 則
        if (messages.value.length > 30) messages.value.shift()

        // 自動捲到最底部
        nextTick(() => {
          const box = document.getElementById('app')
          if (box) box.scrollTop = box.scrollHeight
        })
      }

      function relativeTime (t) {
        const diff = Date.now() - t
        if (diff < 60_000) return '剛剛'
        return Math.floor(diff / 60_000) + 'm'
      }

      onMounted(() => {
        addRandomMessage()
        timerId = setInterval(addRandomMessage, 10000)
      })

      // 修正：原本沒有在卸載時清除 interval，補上避免潛在的記憶體洩漏
      onUnmounted(() => {
        if (timerId) clearInterval(timerId)
      })

      return { selfUname, messages, addRandomMessage, relativeTime }
    }
  }

  createApp(App).mount('#app')
})()


