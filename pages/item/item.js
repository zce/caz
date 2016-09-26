// 拿到全局应用程序实例
const app = getApp()

const API_URL = 'https://api.douban.com/v2/movie/subject/';

// 创建一个页面对象用于控制页面的逻辑
Page({
  data: {
    title: '',
    loading: true,
    movie: {}
  },

  onLoad (params) {
    app.fetchApi(API_URL + params.id, (err, data) => {
      this.setData({ title: data.title, movie: data, loading: false })
      wx.setNavigationBarTitle({ title: this.data.title + ' « 电影 « 豆瓣' })
    })
  },

  onReady () {
    wx.setNavigationBarTitle({ title: this.data.title + ' « 电影 « 豆瓣' })
  }
})
