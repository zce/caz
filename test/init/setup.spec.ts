import setup from '../../src/init/setup'

test('unit:init:setup', async () => {
  expect(typeof setup).toBe('function')
})
