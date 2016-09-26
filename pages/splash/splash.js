// 拿到全局应用程序实例
const app = getApp()

const API_URL = 'https://api.douban.com/v2/movie/in_theaters?count=3'

Page({
  data: {
    list: [],
    loading: true
  },

  onLoad () {
    app.fetchApi(API_URL, (err, data) => {
      //更新数据
      this.setData({ list: data.subjects, loading: false })
    })
  },

  start () {
    wx.navigateTo({ url: '../board/board' })
  }
})
