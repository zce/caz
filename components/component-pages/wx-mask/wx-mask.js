var pageData = {}
var maskNum = 4
pageData.data = {}
for(var i = 1; i <= maskNum; ++i) {
  pageData.data[`hidden${i}`] = true;

  (function(index) {
    pageData[`tap${index}`] = function(e) {
      var obj = {}
      obj[`hidden${index}`] = false
      this.setData(obj)
    }
    pageData[`mask${index}`] = function(e) {
      var obj = {}
      obj[`hidden${index}`] = true 
      this.setData(obj)
    }
  })(i);
}
Page(pageData)
