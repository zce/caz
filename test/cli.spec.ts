let mockedInit: jest.SpyInstance
let mockedList: jest.SpyInstance

const mockArgv = (args: string[]): () => void => {
  const original = process.argv
  process.argv = [original[0], require.resolve('../bin/caz'), ...args]
  return () => {
    process.argv = original
  }
}

beforeEach(async () => {
  jest.resetModules()
  mockedInit = jest.fn().mockImplementation()
  mockedList = jest.fn().mockImplementation()
  jest.mock('../src', () => ({
    __esModule: true,
    default: mockedInit,
    list: mockedList
  }))
})

afterAll(async () => {
  jest.clearAllMocks()
})

test('unit:cli:init', async () => {
  const restore = mockArgv(['template', 'project', '--force', '--offline'])
  await import('../src/cli')
  expect(mockedInit).toHaveBeenCalled()
  expect(mockedInit.mock.calls[0][0]).toBe('template')
  expect(mockedInit.mock.calls[0][1]).toBe('project')
  expect(mockedInit.mock.calls[0][2]).toEqual({
    '--': [],
    f: true,
    force: true,
    o: true,
    offline: true
  })
  restore()
})

test('unit:cli:list', async () => {
  const restore = mockArgv(['list', 'zce', '--json', '--short'])
  await import('../src/cli')
  expect(mockedList).toHaveBeenCalled()
  expect(mockedList.mock.calls[0][0]).toBe('zce')
  expect(mockedList.mock.calls[0][1]).toEqual({
    '--': [],
    j: true,
    json: true,
    s: true,
    short: true
  })
  restore()
})

test('unit:cli:help', async () => {
  const restore = mockArgv(['--help'])
  const log = jest.spyOn(console, 'log').mockImplementation()
  await import('../src/cli')
  expect(log).toHaveBeenCalledTimes(1)
  expect(log.mock.calls[0][0]).toContain('$ caz <template> [project]')
  restore()
})

// // TODO: error
// // https://github.com/facebook/jest/issues/5620
// test('unit:cli:error', async () => {
//   const error = jest.spyOn(console, 'error').mockImplementation()
//   const exit = jest.spyOn(process, 'exit').mockImplementation()
//   const restore = mockArgv([])
//   await import('../src/cli')
//   expect(error).toHaveBeenCalled()
//   expect(exit).toHaveBeenCalled()
//   restore()
// })
