const URI = 'https://api.map.baidu.com'
const fetch = require('./fetch')

function fetchApi (type, params) {
  return fetch(URI, type, params)
}

/**
 * 根据经纬度获取城市
 * @param  {Number} latitude   经度
 * @param  {Number} longitude  纬度
 * @return {Promise}       包含抓取任务的Promise
 */
function getCityName (latitude = 39.90403, longitude = 116.407526) {
  const params = { location: `${latitude},${longitude}`, output: 'json', ak: 'B61195334f65b9e4d02ae75d24fa2c53' }
  return fetchApi('geocoder/v2/', params)
    .then(res => res.data.result.addressComponent.city)
}

module.exports = { getCityName }
