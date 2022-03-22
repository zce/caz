import list from '.'

test('unit:list:default', async () => {
  const log = jest.spyOn(console, 'log').mockImplementation()
  await list()
  expect(log.mock.calls[0][0]).toBe('Available official\'s templates:')
  log.mockRestore()
})

test('unit:list:owner', async () => {
  const log = jest.spyOn(console, 'log').mockImplementation()
  await list('zce')
  expect(log.mock.calls[0][0]).toBe('Available zce\'s templates:')
  log.mockRestore()
})

test('unit:list:json', async () => {
  const log = jest.spyOn(console, 'log').mockImplementation()
  await list(undefined, { json: true })
  expect(log.mock.calls[0][0]).toMatch(/^\[.+\]$/)
  log.mockRestore()
})

test('unit:list:short', async () => {
  const log = jest.spyOn(console, 'log').mockImplementation()
  await list(undefined, { short: true })
  expect(log.mock.calls[0][0]).toMatch(/^→\s.+$/)
  log.mockRestore()
})

test('unit:list:short-owner', async () => {
  const log = jest.spyOn(console, 'log').mockImplementation()
  await list('zce', { short: true })
  expect(log.mock.calls[0][0]).toMatch(/^→\s.+$/)
  log.mockRestore()
})

test('unit:list:empty', async () => {
  const log = jest.spyOn(console, 'log').mockImplementation()
  await list('ghost')
  expect(log.mock.calls[0][0]).toBe('No available templates.')
  log.mockRestore()
})
