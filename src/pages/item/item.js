// 获取全局应用程序实例对象
const app = getApp()

// 创建页面实例对象
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    loading: true,
    movie: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad (params) {
    app.douban.findOne(params.id)
      .then(d => {
        this.setData({ title: d.title, movie: d, loading: false })
        wx.setNavigationBarTitle({ title: d.title + ' « 电影 « 豆瓣' })
      })
      .catch(e => {
        this.setData({ title: '获取数据异常', movie: {}, loading: false })
        console.error(e)
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {
    wx.setNavigationBarTitle({ title: this.data.title + ' « 电影 « 豆瓣' })
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
  },

  onShareAppMessage () {
    return {
      title: '自定义分享标题',
      desc: '自定义分享描述',
      path: '/pages/item?id=' + this.data.id
    }
  }
})
