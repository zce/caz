import { Ware } from './ware'

test('unit:core:ware', async () => {
  type State = Record<string, number>
  const order: number[] = []

  const app = new Ware<State>()

  app.use(async state => {
    expect(state.a).toBe(1)
    state.b = 2
    order.push(1)
  })

  app.use(async state => {
    expect(state.b).toBe(2)
    order.push(2)
    // break chain
    throw new Error('break')
  })

  app.use(async () => {
    // never call
    order.push(3)
  })

  try {
    await app.run({ a: 1 })
  } catch (e) {
    expect((e as Error).message).toEqual('break')
  }

  expect(order).toEqual([1, 2])
})
