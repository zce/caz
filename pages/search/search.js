// 拿到全局应用程序实例
const app = getApp()

const API_URL = 'https://api.douban.com/v2/movie/search'

// 创建一个页面对象用于控制页面的逻辑
Page({
  data: {
    title: '请在此输入搜索内容',
    movies: [],
    loading: false,
  },

  search (e) {
    if (!e.detail.value) return
    this.setData({ title: '加载中...', loading: true })
    //调用应用实例的方法获取全局数据
    app.fetchApi(API_URL + '?q=' + e.detail.value, (err, data) => {
      //更新数据
      this.setData({ title: data.title, movies: data.subjects, loading: false })
    })
  },

  onLoad () {

  }
})
