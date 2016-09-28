// Douban API 操作
const douban = require('../../libraries/douban.js')

Page({
  data: {
    boards: [
      { key: 'in_theaters', name: '正在热映' },
      { key: 'coming_soon', name: '即将上映' },
      { key: 'top250', name: 'T0P250' },
      // { key: 'weekly', name: '口碑榜' },
      { key: 'us_box', name: '北美票房榜' },
      // { key: 'new_movies', name: '新片榜' }
    ],
    movies: [],
    loading: true
  },

  onLoad () {
    douban.find('in_theaters', 1, 5)
      .then(d => this.setData({ movies: d.subjects, loading: false }))
      .catch(e => {
        console.error(e)
        this.setData({ movies: [], loading: false })
      })
  },
})





