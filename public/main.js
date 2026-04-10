/* global Vue */
;(async () => {
  const { createApp, ref, onMounted, nextTick } = Vue

  // 使用者頭像/暱稱索引
  const gravatar = {
    hirakujira: { name: 'DK',      avatar: 'bf73e08d8bc1db95b62f02d50f8a03e9' },
    cloverdefa: { name: 'DAST',    avatar: '8cf3d8725d034584f237753022279119' },
    bill85101:   { name: '魔王',    avatar: '9e202866b38b7255f282beb005576731' },
    Shawn_N:     { name: '賽瑞福',  avatar: '34624582cd585ba65e5b5368c84cb1a2' }
  }

  // 讀取 saying.txt；格式：username,內容;
  const txt = await (await fetch('public/saying.txt')).text()
  const sayings = txt.split(';').map(s => s.trim()).filter(Boolean)

  const App = {
    setup () {
      const selfUname = ref('cloverdefa')
      const sayingsRef = ref(sayings)
      const messages = ref([])

      function addRandomMessage () {
        const entry = sayingsRef.value[Math.floor(Math.random() * sayingsRef.value.length)]
        if (!entry) return
        const parts = entry.split(',')
        const uname = parts[0]
        const msg = parts.slice(1).join(',')
        const info = gravatar[uname] || { name: uname, avatar: '00000000000000000000000000000000' }

        messages.value.push({
          uname,
          name: info.name,
          avatar: `https://www.gravatar.com/avatar/${info.avatar}`,
          text: msg.trim(),
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
        return diff < 60_000 ? '剛剛' : Math.floor(diff / 60_000) + 'm'
      }

      onMounted(() => {
        addRandomMessage()
        setInterval(addRandomMessage, 10000)
      })

      return { selfUname, messages, addRandomMessage, relativeTime }
    }
  }

  createApp(App).mount('#app')
})()

