// Douban API 操作
const douban = require('../../libraries/douban.js')

Page({
  data: {
    movies: [],
    loading: true
  },

  onLoad () {
    douban.find('coming_soon', 1, 3)
      .then(d => this.setData({ movies: d.subjects, loading: false }))
      .catch(e => {
        console.error(e)
        this.setData({ movies: [], loading: false })
      })
  },

  start () {
    // TODO: 访问历史的问题
    wx.redirectTo({ url: '../board/board' })
  }
})
