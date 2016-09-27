const API_URL = 'https://api.douban.com/v2/movie'

function fetchApi (type, params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_URL}/${type}`,
      data: Object.assign({}, params),
      header: { 'Content-Type': 'application/json' },
      success: resolve,
      fail: reject
    })
  })
}

module.exports = {
  find (type, page = 1, count = 20, search = '') {
    const params = { start: (page - 1) * count, count: count }
    return fetchApi(type, search ? Object.assign(params, { q: search }) : params)
      .then(res => res.data)
  },

  findOne (id) {
    return fetchApi('subject/' + id)
      .then(res => res.data)
  }
}


// class Douban {
//   // 不支持
//   // static API_URL = 'https://api.douban.com/v2/movie/'

//   constructor (title, movies) {
//     this.title = title
//     this.movies = movies
//   }
// }
