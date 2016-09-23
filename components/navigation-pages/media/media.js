var components = [
  'image', 'audio', 'video'
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