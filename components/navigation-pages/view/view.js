var components = [
  'progress', 'toast', 'scroll-view', 'text', 'view', 'mask', 'icon', 'spinner', 'swiper', 'slide-tab'
]
var pageData = {}
for(var i = 0; i < components.length; ++i) {
  (function (index) {
    pageData[components[index]] = function(e) {
      var url = '../../component-pages/wx-' + components[index] + '/wx-' + components[index]
      wx.navigateTo({url: url})
    }
  })(i)
}
Page(pageData)
