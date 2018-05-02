// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    boards: [
      { key: 'in_theaters' },
      { key: 'coming_soon' },
      { key: 'new_movies' },
      { key: 'top250' },
      // { key: 'weekly' },
      // { key: 'us_box' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    wx.showLoading({ title: '拼命加载中...' })

    const tasks = this.data.boards.map(board => {
      return app.douban.find(board.key, 1, 8)
        .then(d => {
          board.title = d.title
          board.movies = d.subjects
          return board
        })
    })

    Promise.all(tasks).then(boards => {
      this.setData({ boards: boards, loading: false })
      wx.hideLoading()
    })
  }
})
