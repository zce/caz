import os from 'os'
import path from 'path'
import config from '../../src/core/config'

let mockHomedir: jest.SpyInstance

beforeEach(() => {
  mockHomedir = jest.spyOn(os, 'homedir').mockImplementation(() => path.join(__dirname, '../../test/fixtures'))
})

afterEach(() => {
  mockHomedir.mockRestore()
})

test('unit:core:config', async () => {
  expect(config.registry).toBe('https://github.com/{owner}/{name}/archive/{branch}.zip')
  expect(config.official).toBe('caz-templates')
  expect(config.branch).toBe('master')
})

test('unit:core:config:npm', async () => {
  expect(config.npm?.['init-author-name']).toBe('zce')
})

test('unit:core:config:git', async () => {
  expect(config.git?.user?.name).toBe('zce')
})

test('unit:core:config:paths', async () => {
  expect(config.paths.data).toBeTruthy()
  expect(config.paths.config).toBeTruthy()
  expect(config.paths.cache).toBeTruthy()
  expect(config.paths.log).toBeTruthy()
  expect(config.paths.temp).toBeTruthy()
})

test('unit:core:config:ini', async () => {
  const result1 = config.ini(path.join(__dirname, '../fixtures/.npmrc'))
  expect(result1?.['init-author-name']).toBe('zce')
  const result2 = config.ini('fakkkkkkker.ini')
  expect(result2).toBe(undefined)
})
