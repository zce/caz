import mwa from '../src'

const app = mwa<Record<string, number>>()

app.use(async (state, next) => {
  console.log('mw1 start: ', state)
  state.a = 1
  await next()
  console.log('mw1 end: ', state)
})

app.use(async (state, next) => {
  console.log('mw2 start: ', state)
  state.b = 1
  await next()
  console.log('mw2 end: ', state)
})

app.run({}).then(() => console.log('all completed'))
