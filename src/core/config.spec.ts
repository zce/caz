import os from 'os'
import { fixture } from '../../test/helpers'
import config from './config'

const mockHomedir = (): jest.SpyInstance => {
  return jest.spyOn(os, 'homedir').mockImplementation(() => fixture(''))
}

test('unit:core:config', async () => {
  expect(config.registry).toBe('https://github.com/{owner}/{name}/archive/refs/heads/{branch}.zip')
  expect(config.official).toBe('caz-templates')
  expect(config.branch).toBe('master')
  expect(config.proxy).toBe(undefined)
  expect(config.commitMessage).toBe('feat: initial commit')
})

test('unit:core:config:custom', async () => {
  const homedir = mockHomedir()
  jest.resetModules()
  const { default: conf } = await import('./config')
  expect(conf.registry).toBe('https://gitlab.com/{owner}/{name}/archive/refs/heads/{branch}.zip')
  expect(conf.official).toBe('faker')
  expect(conf.branch).toBe('dev')
  expect(conf.proxy).toBe('socks://127.0.0.1:1080')
  expect(conf.commitMessage).toBe('feat: initial commit')
  homedir.mockRestore()
})

test('unit:core:config:env', async () => {
  jest.resetModules()
  process.env.ALL_PROXY = 'socks://127.0.0.1:11111'
  expect((await import('./config')).default.proxy).toBe('socks://127.0.0.1:11111')

  jest.resetModules()
  process.env.HTTPS_PROXY = 'socks://127.0.0.1:22222'
  expect((await import('./config')).default.proxy).toBe('socks://127.0.0.1:22222')

  jest.resetModules()
  process.env.https_proxy = 'socks://127.0.0.1:22222'
  expect((await import('./config')).default.proxy).toBe('socks://127.0.0.1:22222')

  jest.resetModules()
  process.env.HTTP_PROXY = 'socks://127.0.0.1:22222'
  expect((await import('./config')).default.proxy).toBe('socks://127.0.0.1:22222')

  jest.resetModules()
  process.env.http_proxy = 'socks://127.0.0.1:22222'
  expect((await import('./config')).default.proxy).toBe('socks://127.0.0.1:22222')

  jest.resetModules()
  process.env.NO_PROXY = '1'
  expect((await import('./config')).default.proxy).toBe(undefined)
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
  const result1 = config.ini(fixture('.npmrc'))
  expect(result1?.['init-author-name']).toBe('zce')
  const result2 = config.ini('fakkkkkkker.ini')
  expect(result2).toBe(undefined)
})
