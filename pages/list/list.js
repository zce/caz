// 拿到全局应用程序实例
const app = getApp()

const API_URL = 'https://api.douban.com/v2/movie/'

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
    console.log(params)
    this.data.title = params.title || this.data.title

    // 类型： in_theaters  coming_soon  us_box
    this.data.type = params.type || this.data.type

    //调用应用实例的方法获取全局数据
    app.fetchApi(API_URL + this.data.type, (err, data) => {
      //更新数据
      this.setData({ subtitle: data.title, movies: data.subjects, loading: false })
    })
  },

  // 页面准备完成
  onReady () {
    wx.setNavigationBarTitle({ title: this.data.title + ' « 电影 « 豆瓣' })
  }
})
