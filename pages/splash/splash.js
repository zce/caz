// 拿到全局应用程序实例
const app = getApp()
// Douban API 操作
const douban = require('../../libraries/douban.js')

Page({
  data: {
    list: [],
    loading: true
  },

  onLoad () {
    douban.find('in_theaters', 1, 3)
      .then(d => {
        this.setData({ movies: d.subjects, loading: false })
      })
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
