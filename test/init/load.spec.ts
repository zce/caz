import load from '../../src/init/load'

test('unit:init:load', async () => {
  expect(typeof load).toBe('function')
})
