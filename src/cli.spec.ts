const mockedInit = jest.fn().mockImplementation()
const mockedList = jest.fn().mockImplementation()

const mockArgv = (...args: string[]): () => void => {
  const original = process.argv
  process.argv = original.slice(0, 2).concat(...args)
  return () => { process.argv = original }
}

beforeEach(async () => {
  jest.resetAllMocks()
  jest.resetModules()
  jest.mock('.', () => ({ __esModule: true, default: mockedInit, list: mockedList }))
})

afterAll(async () => {
  jest.clearAllMocks()
})

test('unit:cli:init', async () => {
  const restore = mockArgv('template', 'project', '--force', '--offline', '--foo', 'bar')
  await import('./cli')
  expect(mockedInit).toHaveBeenCalled()
  expect(mockedInit.mock.calls[0][0]).toBe('template')
  expect(mockedInit.mock.calls[0][1]).toBe('project')
  expect(mockedInit.mock.calls[0][2]).toEqual({ '--': [], f: true, force: true, o: true, offline: true, foo: 'bar' })
  restore()
})

test('unit:cli:list', async () => {
  const restore = mockArgv('list', 'zce', '--json', '--short')
  await import('./cli')
  expect(mockedList).toHaveBeenCalled()
  expect(mockedList.mock.calls[0][0]).toBe('zce')
  expect(mockedList.mock.calls[0][1]).toEqual({ '--': [], j: true, json: true, s: true, short: true })
  restore()
})

test('unit:cli:help', async () => {
  const restore = mockArgv('--help')
  const log = jest.spyOn(console, 'log').mockImplementation()
  await import('./cli')
  expect(log).toHaveBeenCalledTimes(1)
  expect(log.mock.calls[0][0]).toContain('$ caz <template> [project]')
  log.mockRestore()
  restore()
})

// // TODO: error
// // https://github.com/facebook/jest/issues/5620
// test('unit:cli:error', async () => {
//   const error = jest.spyOn(console, 'error').mockImplementation()
//   const exit = jest.spyOn(process, 'exit').mockImplementation()
//   const restore = mockArgv()
//   await import('./cli')
//   expect(error).toHaveBeenCalled()
//   expect(exit).toHaveBeenCalled()
//   restore()
// })
