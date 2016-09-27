// 拿到全局应用程序实例
const app = getApp()
// Douban API 操作
const douban = require('../../libraries/douban.js')

// 创建一个页面对象用于控制页面的逻辑
Page({
  data: {
    title: '',
    type: 'in_theaters',
    subtitle: '加载中...',
    loading: true,
    movies: []
  },

  // 页面加载
  onLoad (params) {
    this.data.title = params.title || this.data.title

    // 类型： in_theaters  coming_soon  us_box
    this.data.type = params.type || this.data.type

    douban.find(this.data.type)
      .then(d => this.setData({ subtitle: d.title, movies: d.subjects, loading: false }))
      .catch(e => {
        this.setData({ subtitle: '获取数据异常', movies: [], loading: false })
        console.error(e)
      })
  },

  // 页面准备完成
  onReady () {
    wx.setNavigationBarTitle({ title: this.data.title + ' « 电影 « 豆瓣' })
  }
})
