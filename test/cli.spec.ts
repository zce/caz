// import * as caz from '../src'

// let init: jest.SpyInstance
// let list: jest.SpyInstance

// jest.mock('../src')

// beforeEach(async () => {
//   init = jest.spyOn(caz, 'default').mockImplementation()
//   list = jest.spyOn(caz, 'list').mockImplementation()
// })

// afterEach(async () => {
//   init.mockRestore()
//   list.mockRestore()
// })

// const mockArgv = (args: string[]) => {
//   const original = process.argv
//   process.argv = [original[0], require.resolve('../bin/caz'), ...args]
//   return () => {
//     process.argv = original
//   }
// }

// // TODO: other cases
// test('unit:cli:init', async () => {
//   const restore = mockArgv(['template', 'project', '--force', '--offline'])
//   require('../src/cli')
//   expect(init).toHaveBeenCalled()
//   expect(init.mock.calls[0][0]).toBe('template')
//   expect(init.mock.calls[0][1]).toBe('project')
//   expect(init.mock.calls[0][2]).toEqual({
//     '--': [],
//     f: true,
//     force: true,
//     o: true,
//     offline: true
//   })
//   restore()
// })

// test('unit:cli:list', async () => {
//   const restore = mockArgv(['list', 'zce', '--cache', '--json', '--short'])
//   jest.resetModules()
//   require('../src/cli')
//   expect(list).toHaveBeenCalled()
//   expect(list.mock.calls[0][0]).toBe('list')
//   expect(list.mock.calls[0][1]).toBe('zce')
//   expect(list.mock.calls[0][2]).toEqual({
//     '--': [],
//     c: true,
//     cache: true,
//     j: true,
//     json: true,
//     s: true,
//     short: true
//   })
//   restore()
// })
