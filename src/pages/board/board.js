// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    boards: [
      { key: 'in_theaters', name: '正在热映' },
      { key: 'coming_soon', name: '即将上映' },
      { key: 'top250', name: 'TOP250' },
      // { key: 'weekly', name: '口碑榜' },
      // { key: 'new_movies', name: '新片榜' },
      { key: 'us_box', name: '北美票房榜' }
    ],
    movies: [],
    loading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad () {
    app.douban.find('in_theaters', 1, 5)
      .then(d => this.setData({ movies: d.subjects, loading: false }))
      .catch(e => {
        console.error(e)
        this.setData({ loading: false })
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    // TODO: onReady
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    // TODO: onShow
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {
    // TODO: onHide
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {
    // TODO: onUnload
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    // TODO: onPullDownRefresh
  }
})
