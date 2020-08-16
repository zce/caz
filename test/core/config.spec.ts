import os from 'os'
import path from 'path'
import config from '../../src/core/config'

const mockHomedir = (): jest.SpyInstance => {
  return jest.spyOn(os, 'homedir').mockImplementation(() => path.join(__dirname, '../../test/fixtures'))
}

test('unit:core:config', async () => {
  expect(config.registry).toBe('https://github.com/{owner}/{name}/archive/{branch}.zip')
  expect(config.official).toBe('caz-templates')
  expect(config.branch).toBe('master')
  expect(config.commitMessage).toBe('feat: initial commit')
})

test('unit:core:config:custom', async () => {
  const homedir = mockHomedir()
  jest.resetModules()
  const { default: conf } = await import('../../src/core/config')
  expect(conf.registry).toBe('https://gitlab.com/{owner}/{name}/archive/{branch}.zip')
  expect(conf.official).toBe('faker')
  expect(conf.branch).toBe('dev')
  expect(conf.commitMessage).toBe('feat: initial commit')
  homedir.mockRestore()
})

test('unit:core:config:npm', async () => {
  const homedir = mockHomedir()
  expect(config.npm?.['init-author-name']).toBe('zce')
  homedir.mockRestore()
})

test('unit:core:config:git', async () => {
  const homedir = mockHomedir()
  expect(config.git?.user?.name).toBe('zce')
  homedir.mockRestore()
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
