import caz, { list } from '../src'

test('<test-title>', async () => {
  expect(typeof caz).toBe('function')
  expect(typeof list).toBe('function')
})
