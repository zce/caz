import path from 'path'
import prompts, { PromptObject } from 'prompts'
import { config } from './core'
import { context } from '../test/helpers'
import inquire, { validater, processor } from './inquire'

test('unit:inquire:validater:name', async () => {
  expect(validater.name('foo')).toBe(true)
  expect(validater.name('foo-bar')).toBe(true)
  expect(validater.name('foo_bar')).toBe(true)
  expect(validater.name('@foo/bar')).toBe(true)
  expect(validater.name('c a z')).toBe('name can only contain URL-friendly characters')
  expect(validater.name('CAZ')).toBe('name can no longer contain capital letters')
  expect(validater.name('Caz')).toBe('name can no longer contain capital letters')
})

test('unit:inquire:validater:version', async () => {
  expect(validater.version('0.1.0')).toBe(true)
  expect(validater.version('0.1')).toBe('The `0.1` is not a semantic version.')
  expect(validater.version('0')).toBe('The `0` is not a semantic version.')
})

test('unit:inquire:validater:email', async () => {
  expect(validater.email('w@zce.me')).toBe(true)
  expect(validater.email('foo')).toBe('The `foo` is not a email address.')
  expect(validater.email('w@zce')).toBe('The `w@zce` is not a email address.')
})

test('unit:inquire:validater:url', async () => {
  expect(validater.url('http://zce.me')).toBe(true)
  expect(validater.url('https://zce.me')).toBe(true)
  expect(validater.url('foo')).toBe('The `foo` is not a url address.')
  expect(validater.url('ftp://zce.me')).toBe('The `ftp://zce.me` is not a url address.')
})

test('unit:inquire:processor:name', async () => {
  const ctx = context({ dest: __dirname })
  const fn = processor(ctx)

  const prompt1: PromptObject = { name: 'name', type: 'text' }
  fn(prompt1)
  expect(prompt1.validate).toBe(validater.name)
  expect(prompt1.initial).toBe(path.basename(__dirname))

  const prompt2: PromptObject = { name: 'name', type: 'text', initial: 'foo' }
  fn(prompt2)
  expect(prompt2.validate).toBe(validater.name)
  expect(prompt2.initial).toBe('foo')

  const validate3 = jest.fn()
  const prompt3: PromptObject = { name: 'name', type: 'text', validate: validate3 }
  fn(prompt3)
  expect(prompt3.validate).toBe(validate3)
})

test('unit:inquire:processor:version', async () => {
  const ctx = context({})
  const fn = processor(ctx)

  const prompt0: PromptObject = { name: 'version', type: 'text', initial: '3.2.1' }
  fn(prompt0)
  expect(prompt0.validate).toBe(validater.version)
  expect(prompt0.initial).toBe('3.2.1')

  const mockConfig = jest.spyOn(config, 'npm', 'get').mockReturnValue({ 'init-version': '1.2.3' })

  const prompt1: PromptObject = { name: 'version', type: 'text' }
  fn(prompt1)
  expect(prompt1.initial).toBe('1.2.3')

  const validate2 = jest.fn()
  const prompt2: PromptObject = { name: 'version', type: 'text', validate: validate2 }
  fn(prompt2)
  expect(prompt2.validate).toBe(validate2)

  jest.spyOn(config, 'npm', 'get').mockReturnValue({})
  const prompt3: PromptObject = { name: 'version', type: 'text' }
  fn(prompt3)
  expect(prompt3.initial).toBe('0.1.0')

  jest.spyOn(config, 'npm', 'get').mockReturnValue(undefined)
  const prompt4: PromptObject = { name: 'version', type: 'text' }
  fn(prompt4)
  expect(prompt4.initial).toBe('0.1.0')

  mockConfig.mockRestore()
})

test('unit:inquire:processor:author', async () => {
  const ctx = context({})
  const fn = processor(ctx)

  const prompt0: PromptObject = { name: 'author', type: 'text', initial: 'zce' }
  fn(prompt0)
  expect(prompt0.initial).toBe('zce')

  const mockConfig = jest.spyOn(config, 'npm', 'get').mockReturnValue({ 'init-author-name': 'faker-npm' })

  const prompt1: PromptObject = { name: 'author', type: 'text' }
  fn(prompt1)
  expect(prompt1.initial).toBe('faker-npm')

  jest.spyOn(config, 'npm', 'get').mockReturnValue({})
  jest.spyOn(config, 'git', 'get').mockReturnValue({ user: { name: 'faker-git' } })
  const prompt2: PromptObject = { name: 'author', type: 'text' }
  fn(prompt2)
  expect(prompt2.initial).toBe('faker-git')

  jest.spyOn(config, 'npm', 'get').mockReturnValue(undefined)
  jest.spyOn(config, 'git', 'get').mockReturnValue({ user: { name: 'faker-git' } })
  const prompt3: PromptObject = { name: 'author', type: 'text' }
  fn(prompt3)
  expect(prompt3.initial).toBe('faker-git')

  jest.spyOn(config, 'git', 'get').mockReturnValue({})
  const prompt4: PromptObject = { name: 'author', type: 'text' }
  fn(prompt4)
  expect(prompt4.initial).toBe(undefined)

  jest.spyOn(config, 'git', 'get').mockReturnValue(undefined)
  const prompt5: PromptObject = { name: 'author', type: 'text' }
  fn(prompt5)
  expect(prompt5.initial).toBe(undefined)

  mockConfig.mockRestore()
})

test('unit:inquire:processor:email', async () => {
  const ctx = context({})
  const fn = processor(ctx)

  const prompt0: PromptObject = { name: 'email', type: 'text', initial: 'w@zce.me' }
  fn(prompt0)
  expect(prompt0.initial).toBe('w@zce.me')

  const mockConfig = jest.spyOn(config, 'npm', 'get').mockReturnValue({ 'init-author-email': 'npm@faker.com' })

  const prompt1: PromptObject = { name: 'email', type: 'text' }
  fn(prompt1)
  expect(prompt1.validate).toBe(validater.email)
  expect(prompt1.initial).toBe('npm@faker.com')

  jest.spyOn(config, 'npm', 'get').mockReturnValue({})
  jest.spyOn(config, 'git', 'get').mockReturnValue({ user: { email: 'git@faker.com' } })
  const prompt2: PromptObject = { name: 'email', type: 'text' }
  fn(prompt2)
  expect(prompt2.initial).toBe('git@faker.com')

  jest.spyOn(config, 'npm', 'get').mockReturnValue(undefined)
  jest.spyOn(config, 'git', 'get').mockReturnValue({ user: { email: 'git@faker.com' } })
  const prompt3: PromptObject = { name: 'email', type: 'text' }
  fn(prompt3)
  expect(prompt3.initial).toBe('git@faker.com')

  jest.spyOn(config, 'git', 'get').mockReturnValue({})
  const prompt4: PromptObject = { name: 'email', type: 'text' }
  fn(prompt4)
  expect(prompt4.initial).toBe(undefined)

  jest.spyOn(config, 'git', 'get').mockReturnValue(undefined)
  const prompt5: PromptObject = { name: 'email', type: 'text' }
  fn(prompt5)
  expect(prompt5.initial).toBe(undefined)

  const validate6 = jest.fn()
  const prompt6: PromptObject = { name: 'email', type: 'text', validate: validate6 }
  fn(prompt6)
  expect(prompt6.validate).toBe(validate6)

  mockConfig.mockRestore()
})

test('unit:inquire:processor:url', async () => {
  const ctx = context({})
  const fn = processor(ctx)

  const prompt0: PromptObject = { name: 'url', type: 'text', initial: 'https://zce.me' }
  fn(prompt0)
  expect(prompt0.initial).toBe('https://zce.me')

  const mockConfig = jest.spyOn(config, 'npm', 'get').mockReturnValue({ 'init-author-url': 'https://npm.faker.com' })

  const prompt1: PromptObject = { name: 'url', type: 'text' }
  fn(prompt1)
  expect(prompt1.validate).toBe(validater.url)
  expect(prompt1.initial).toBe('https://npm.faker.com')

  jest.spyOn(config, 'npm', 'get').mockReturnValue({})
  jest.spyOn(config, 'git', 'get').mockReturnValue({ user: { url: 'https://git.faker.com' } })
  const prompt2: PromptObject = { name: 'url', type: 'text' }
  fn(prompt2)
  expect(prompt2.initial).toBe('https://git.faker.com')

  jest.spyOn(config, 'npm', 'get').mockReturnValue(undefined)
  jest.spyOn(config, 'git', 'get').mockReturnValue({ user: { url: 'https://git.faker.com' } })
  const prompt3: PromptObject = { name: 'url', type: 'text' }
  fn(prompt3)
  expect(prompt3.initial).toBe('https://git.faker.com')

  jest.spyOn(config, 'git', 'get').mockReturnValue({})
  const prompt4: PromptObject = { name: 'url', type: 'text' }
  fn(prompt4)
  expect(prompt4.initial).toBe(undefined)

  jest.spyOn(config, 'git', 'get').mockReturnValue(undefined)
  const prompt5: PromptObject = { name: 'url', type: 'text' }
  fn(prompt5)
  expect(prompt5.initial).toBe(undefined)

  const validate6 = jest.fn()
  const prompt6: PromptObject = { name: 'url', type: 'text', validate: validate6 }
  fn(prompt6)
  expect(prompt6.validate).toBe(validate6)

  mockConfig.mockRestore()
})

test('unit:inquire:default', async () => {
  const clear = jest.spyOn(console, 'clear').mockImplementation()
  const ctx = context({ dest: __dirname })
  prompts.inject(['foo'])
  await inquire(ctx)
  expect(clear).toBeCalledTimes(1)
  expect(ctx.config.prompts).toEqual([{ name: 'name', type: 'text', message: 'Project name', initial: path.basename(__dirname), validate: validater.name }])
  expect(ctx.answers).toEqual({ name: 'foo' })
  clear.mockRestore()
})

test('unit:inquire:custom', async () => {
  const clear = jest.spyOn(console, 'clear').mockImplementation()
  const ctx = context({}, {
    prompts: [
      { name: 'foo', type: 'text', message: 'foo' },
      { name: 'bar', type: 'text', message: 'bar' }
    ]
  })
  prompts.inject(['zce', 'caz'])
  await inquire(ctx)
  expect(clear).toBeCalledTimes(1)
  expect(ctx.answers).toEqual({ foo: 'zce', bar: 'caz' })
  clear.mockRestore()
})

test('unit:inquire:override', async () => {
  const clear = jest.spyOn(console, 'clear').mockImplementation()
  const ctx = context({}, {
    prompts: [
      { name: 'foo', type: 'text', message: 'foo' },
      { name: 'bar', type: 'text', message: 'bar' }
    ]
  })
  // options for override
  Object.assign(ctx.options, { foo: 'zce', bar: 'caz' })
  await inquire(ctx)
  expect(clear).toBeCalledTimes(1)
  expect(ctx.answers).toEqual({ foo: 'zce', bar: 'caz' })
  clear.mockRestore()
})
