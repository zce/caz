// 拿到全局应用程序实例
const app = getApp()
// Douban API 操作
const douban = require('../../libraries/douban.js')

// 创建一个页面对象用于控制页面的逻辑
Page({
  data: {
    page: 1,
    size: 20,
    subtitle: '请在此输入搜索内容',
    movies: [],
    search: '',
    loading: false,
    hasMore: false
  },

  loadMore () {
    if (!this.data.hasMore) return

    this.setData({ subtitle: '加载中...', loading: true })
    douban.find('search', this.data.page++, this.data.size, this.data.search)
      .then(d => {
        if (d.subjects.length) {
          this.setData({ subtitle: d.title, movies: this.data.movies.concat(d.subjects), loading: false })
        } else {
          this.setData({ hasMore: false, loading: false })
        }
      })
      .catch(e => {
        this.setData({ subtitle: '获取数据异常', loading: false })
        console.error(e)
      })
  },

  search (e) {
    if (!e.detail.value) return
    this.setData({ subtitle: '加载中...', hasMore: true, loading: true, search: e.detail.value })
    douban.find('search', this.data.page++, this.data.size, this.data.search)
      .then(d => {
        if (d.subjects.length) {
          this.setData({ subtitle: d.title, movies: d.subjects, loading: false })
        } else {
          this.setData({ hasMore: false, loading: false })
        }
      })
      .catch(e => {
        this.setData({ subtitle: '获取数据异常', movies: [], loading: false })
        console.error(e)
      })
  }
})
