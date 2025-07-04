/* global Vue */
;(async () => {
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

  new Vue({
    el: '#app',
    data: {
      sayings,          // 原始句庫
      messages: []      // 聊天訊息陣列
    },
    methods: {
      // 新增一則隨機訊息
      addRandomMessage () {
        const [uname, msg] = this.sayings[Math.floor(Math.random() * this.sayings.length)].split(',')
        const info = gravatar[uname] || { name: uname, avatar: '00000000000000000000000000000000' }

        this.messages.push({
          uname,
          name: info.name,
          avatar: `https://www.gravatar.com/avatar/${info.avatar}`,
          text:  msg.trim(),
          ts:    Date.now()
        })

        // 只保留最近 30 則
        if (this.messages.length > 30) this.messages.shift()

        // 下一個 tick 後捲到底
        this.$nextTick(() => {
          const box = this.$el
          box.scrollTop = box.scrollHeight
        })
      },
      // 簡易「幾分鐘前」字串
      relativeTime (t) {
        const diff = Date.now() - t
        return diff < 60_000 ? '剛剛' : Math.floor(diff / 60_000) + 'm'
      }
    },
    created () {
      // 立即顯示第一則，之後每 5 秒新增
      this.addRandomMessage()
      setInterval(this.addRandomMessage, 5000)
    }
  })
})()

