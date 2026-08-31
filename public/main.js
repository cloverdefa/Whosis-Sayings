/* global Vue */

;(async () => {
  const { createApp, ref, onMounted, onUnmounted, nextTick } = Vue

  // 使用者帳號、顯示名稱與頭像檔名對照表
  const gravatar = {
    cloverdefa: { name: 'DAST', avatar: 'cloverdefa' },
    dk: { name: 'DK', avatar: 'dk' },
    samwumobile: { name: '魔王', avatar: 'samwumobile' },
    sin: { name: '賽瑞福', avatar: 'sin' }
  }

  // saying.txt 中出現未知使用者時使用的預設頭像
  const DEFAULT_AVATAR_FILE = 'default'

  // 統一產生 public/icons 下的頭像路徑
  function avatarUrl (fileName) {
    return `public/icons/${fileName}.webp`
  }

  // 僅允許顯示基本格式標籤，避免 saying.txt 內容插入危險 HTML
  const ALLOWED_TAGS = new Set(['B', 'STRONG', 'I', 'EM', 'DEL', 'BR'])

  /**
   * 過濾訊息中的 HTML。
   *
   * 僅保留 ALLOWED_TAGS 中的標籤，並移除所有 HTML 屬性，
   * 例如 onclick、style、href 等，降低 v-html 顯示內容的風險。
   */
  function sanitizeHtml (html) {
    const doc = new DOMParser().parseFromString(html, 'text/html')

    const clean = (node) => {
      ;[...node.childNodes].forEach((child) => {
        // 非 HTML Element 節點（例如純文字）不需處理
        if (child.nodeType !== 1) return

        // 不允許的標籤轉換為純文字，保留原本的文字內容
        if (!ALLOWED_TAGS.has(child.tagName)) {
          child.replaceWith(document.createTextNode(child.textContent))
          return
        }

        // 移除允許標籤上的所有屬性
        ;[...child.attributes].forEach((attr) => child.removeAttribute(attr.name))

        // 遞迴處理巢狀標籤
        clean(child)
      })
    }

    clean(doc.body)
    return doc.body.innerHTML
  }

  /**
   * 載入 public/saying.txt。
   *
   * 檔案格式以分號（;）分隔多筆資料，
   * 每筆資料預期格式：
   *   username,message
   */
  async function loadSayings () {
    try {
      const res = await fetch('public/saying.txt')

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const txt = await res.text()

      return txt
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean)
    } catch (err) {
      console.error('讀取 saying.txt 失敗：', err)
      return []
    }
  }

  // Vue App 建立前先完成靜態訊息資料載入
  const sayings = await loadSayings()

  const App = {
    setup () {
      // 目前登入／代表使用者帳號
      const selfUname = ref('cloverdefa')

      // 所有可供隨機顯示的語錄
      const sayingsRef = ref(sayings)

      // 目前畫面上的訊息列表
      const messages = ref([])

      // Vue v-for 使用的唯一訊息 ID
      let nextId = 1

      // 保存定時新增訊息的 interval ID，供元件卸載時清除
      let timerId = null

      /**
       * 從 saying.txt 隨機挑選一筆資料並加入訊息列表。
       */
      function addRandomMessage () {
        if (!sayingsRef.value.length) return

        const entry =
          sayingsRef.value[
            Math.floor(Math.random() * sayingsRef.value.length)
          ]

        if (!entry) return

        // 第一個逗號前為使用者帳號，其餘內容皆視為訊息，
        // 因此訊息本身可以包含逗號。
        const parts = entry.split(',')
        const uname = parts[0]
        const msg = parts.slice(1).join(',').trim()

        if (!msg) return

        // 未在使用者對照表中的帳號使用預設頭像
        const info =
          gravatar[uname] || {
            name: uname,
            avatar: DEFAULT_AVATAR_FILE
          }

        messages.value.push({
          id: nextId++,
          uname,
          name: info.name,
          avatar: avatarUrl(info.avatar),
          text: sanitizeHtml(msg),
          ts: Date.now()
        })

        // 限制 DOM 中最多保留 30 則訊息
        if (messages.value.length > 30) {
          messages.value.shift()
        }

        // 等 Vue 完成 DOM 更新後再捲動到最新訊息
        nextTick(() => {
          const box = document.getElementById('app')

          if (box) {
            box.scrollTop = box.scrollHeight
          }
        })
      }

      /**
       * 將時間戳記轉換為簡易相對時間。
       */
      function relativeTime (t) {
        const diff = Date.now() - t

        if (diff < 60_000) return '剛剛'

        return Math.floor(diff / 60_000) + 'm'
      }

      onMounted(() => {
        // 元件載入時立即顯示第一則訊息
        addRandomMessage()

        // 之後每 10 秒新增一則隨機訊息
        timerId = setInterval(addRandomMessage, 10000)
      })

      onUnmounted(() => {
        // 避免元件卸載後仍持續執行計時器
        if (timerId) clearInterval(timerId)
      })

      return {
        selfUname,
        messages,
        addRandomMessage,
        relativeTime
      }
    }
  }

  // 建立並掛載 Vue 應用程式
  createApp(App).mount('#app')
})()
