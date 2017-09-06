// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
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

    return app.douban.find('search', this.data.page++, this.data.size, this.data.search)
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

  handleSearch (e) {
    if (!e.detail.value) return
    this.setData({ movies: [], page: 1 })
    this.setData({ subtitle: '加载中...', hasMore: true, loading: true, search: e.detail.value })

    this.loadMore()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    this.setData({ movies: [], page: 1 })
    this.loadMore()
      .then(() => app.wechat.original.stopPullDownRefresh())
  },

  onReachBottom () {
    this.loadMore()
  }
})
