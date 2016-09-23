var initData = 'this is first line\nthis is second line'
Page({
  data: {
    text: initData
  },
  extraLine: [],
  add: function(e) {
    this.extraLine.push('other line')
    this.setData({
      text: initData + '\n' + this.extraLine.join('\n')
    })
  },
  remove: function(e) {
    if (this.extraLine.length > 0) {
      this.extraLine.pop()
      this.setData({
        text: initData + '\n' + this.extraLine.join('\n')
      })
    }
  }
})
