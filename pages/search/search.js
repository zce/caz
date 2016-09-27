// 拿到全局应用程序实例
const app = getApp()
// Douban API 操作
const douban = require('../../libraries/douban.js')

// 创建一个页面对象用于控制页面的逻辑
Page({
  data: {
    subtitle: '请在此输入搜索内容',
    movies: [],
    loading: false,
  },

  search (e) {
    if (!e.detail.value) return
    this.setData({ subtitle: '加载中...', loading: true })
    douban.find('search', 1, 20, e.detail.value)
      .then(d => this.setData({ subtitle: d.title, movies: d.subjects, loading: false }))
      .catch(e => {
        this.setData({ subtitle: '获取数据异常', movies: [], loading: false })
        console.error(e)
      })
  }
})
