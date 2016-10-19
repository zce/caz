const URI = 'https://api.douban.com/v2/movie'

/**
 * 抓取豆瓣电影特定类型的API
 * https://developers.douban.com/wiki/?title=movie_v2
 * @param  {String} type   类型，例如：'coming_soon'
 * @param  {Objece} params 参数
 * @return {Promise}       包含抓取任务的Promise
 */
function fetchApi (type, params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${URI}/${type}`,
      data: Object.assign({}, params),
      header: { 'Content-Type': 'application/json' },
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 获取列表类型的数据
 * @param  {String} type   类型，例如：'coming_soon'
 * @param  {Number} page   页码
 * @param  {Number} count  页条数
 * @param  {String} search 搜索关键词
 * @return {Promise}       包含抓取任务的Promise
 */
function find (type, page = 1, count = 20, search = '') {
  const params = { start: (page - 1) * count, count: count }
  return fetchApi(type, search ? Object.assign(params, { q: search }) : params)
    .then(res => res.data)
}

/**
 * 获取单条类型的数据
 * @param  {Number} id     电影ID
 * @return {Promise}       包含抓取任务的Promise
 */
function findOne (id) {
  return fetchApi('subject/' + id)
    .then(res => res.data)
}

module.exports = { find, findOne }
