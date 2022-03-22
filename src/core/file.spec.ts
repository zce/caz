import os from 'os'
import fs from 'fs'
import path from 'path'
import { fixture, exists, mktmpdir, destory } from '../../test/helpers'
import * as file from './file'

test('unit:core:file:exists', async () => {
  const result1 = await file.exists(__dirname)
  expect(result1).toBe('dir')

  const result2 = await file.exists(__filename)
  expect(result2).toBe('file')

  const result3 = await file.exists('caz' + Date.now().toString())
  expect(result3).toBe(false)

  // other (symlink) test
  // https://github.com/nodejs/node/issues/18518
})

test('unit:core:file:isFile', async () => {
  const result1 = await file.isFile(__filename)
  expect(result1).toBe(true)

  const result2 = await file.isFile(__dirname)
  expect(result2).toBe(false)
})

test('unit:core:file:isDirectory', async () => {
  const result1 = await file.isDirectory(__filename)
  expect(result1).toBe(false)

  const result2 = await file.isDirectory(__dirname)
  expect(result2).toBe(true)
})

test('unit:core:file:isEmpty', async () => {
  const empty1 = await file.isEmpty(__dirname)
  expect(empty1).toBe(false)

  const temp2 = await mktmpdir()
  const empty2 = await file.isEmpty(temp2)
  expect(empty2).toBe(true)

  await destory(temp2)
})

test('unit:core:file:mkdir', async () => {
  const temp = 'test/.temp'

  // relative (cwd) path recursive
  const target1 = `${temp}/1/${Date.now()}/caz/mkdir/1`
  await file.mkdir(target1)
  expect(await exists(target1)).toBe(true)

  // absolute path recursive
  const root2 = await mktmpdir()
  const target2 = `${root2}/caz/mkdir/2`
  await file.mkdir(target2)
  expect(await exists(target2)).toBe(true)

  // mode options (recursive false dependency case 1)
  const target3 = temp + '/3'
  await file.mkdir(target3, { mode: 0o755, recursive: false })
  const stat3 = await fs.promises.stat(target3)
  if (process.platform !== 'win32') {
    expect(stat3.mode & 0o777).toBe(0o755)
  }

  await destory(temp, root2)
})

test('unit:core:file:remove', async () => {
  const temp = await mktmpdir()

  // remove not exists
  const target1 = path.join(temp, 'caz-remove-1')
  await file.remove(target1)
  expect(await exists(target1)).toBe(false)

  // remove a file
  const target2 = path.join(temp, 'caz-remove-2')
  await fs.promises.writeFile(target2, '')
  await file.remove(target2)
  expect(await exists(target2)).toBe(false)

  // remove a dir
  const target3 = path.join(temp, 'caz-remove-3')
  await fs.promises.mkdir(target3)
  await file.remove(target3)
  expect(await exists(target3)).toBe(false)

  // remove a dir recursive
  const target4 = path.join(temp, 'caz-remove-4')
  await fs.promises.mkdir(target4 + '/subdir/foo/bar', { recursive: true })
  await file.remove(target4)
  expect(await exists(target4)).toBe(false)

  await destory(temp)
})

test('unit:core:file:read', async () => {
  const filename = path.join(fixture('.npmrc'))
  const buffer = await file.read(filename)
  const contents = buffer.toString().trim()
  expect(contents).toBe('init-author-name = zce')
})

test('unit:core:file:write', async () => {
  const temp = await mktmpdir()
  const filename = path.join(temp, 'temp.txt')
  await file.write(filename, 'hello zce')
  const contents = await fs.promises.readFile(filename, 'utf8')
  expect(contents).toBe('hello zce')

  await destory(temp)
})

test('unit:core:file:isBinary', async () => {
  const buffer1 = await fs.promises.readFile(fixture('archive.zip'))
  expect(file.isBinary(buffer1)).toBe(true)
  const buffer2 = await fs.promises.readFile(fixture('.cazrc'))
  expect(file.isBinary(buffer2)).toBe(false)
})

test('unit:core:file:tildify', async () => {
  const home = os.homedir()

  // home dir
  const result1 = file.tildify(home)
  expect(result1).toBe('~')

  // home sub dir
  const result2 = file.tildify(path.join(home, 'tildify'))
  expect(result2).toBe(path.join('~', 'tildify'))

  // ensure only a fully matching path is replaced
  const result3 = file.tildify(`${home}foo/tildify`)
  expect(result3).toBe(`${home}foo${path.sep}tildify`)

  // only tildify when home is at the start of a path
  const result4 = file.tildify(path.join('tildify', home))
  expect(result4).toBe(path.join('tildify', home))

  // ignore relative paths
  const result5 = file.tildify('tildify')
  expect(result5).toBe('tildify')

  // ignore not home sub dir
  const result6 = file.tildify('/tildify')
  expect(result6).toBe(path.sep + 'tildify')
})

test('unit:core:file:untildify', async () => {
  const home = os.homedir()

  // home dir
  const result1 = file.untildify('~')
  expect(result1).toBe(home)

  // home sub dir
  const result2 = file.untildify(path.join('~', 'untildify'))
  expect(result2).toBe(path.join(home, 'untildify'))

  // ensure only a fully matching path is replaced
  const result3 = file.untildify(`${home}foo${path.sep}untildify`)
  expect(result3).toBe(`${home}foo${path.sep}untildify`)

  // only untildify when home is at the start of a path
  const result4 = file.untildify(path.join('untildify', home))
  expect(result4).toBe(path.join('untildify', home))

  // ignore relative paths
  const result5 = file.untildify('untildify')
  expect(result5).toBe('untildify')

  // ignore not home sub dir
  const result6 = file.untildify(__dirname)
  expect(result6).toBe(__dirname)
})

test('unit:core:file:extract:zip', async () => {
  const temp = await mktmpdir()

  await file.extract(fixture('archive.zip'), temp)

  const dir = path.join(temp, 'archive')
  expect(await exists(dir)).toBe(true)

  const file1 = path.join(dir, 'LICENSE')
  expect(await exists(file1)).toBe(true)
  const stat1 = await fs.promises.stat(file1)
  if (process.platform !== 'win32') {
    expect(stat1.mode & 0o777).toBe(0o644)
  }

  const file2 = path.join(dir, 'README.md')
  expect(await exists(file2)).toBe(true)
  const stat2 = await fs.promises.stat(file2)
  if (process.platform !== 'win32') {
    expect(stat2.mode & 0o777).toBe(0o755)
  }

  await destory(temp)
})

test('unit:core:file:extract:error', async () => {
  const temp = await mktmpdir()
  expect.hasAssertions()
  try {
    await file.extract(fixture('error.zip'), temp)
  } catch (e) {
    expect((e as Error).message).toBe('Invalid or unsupported zip format. No END header found')
  }

  await destory(temp)
})

test('unit:core:file:extract:strip', async () => {
  const temp = await mktmpdir()

  await file.extract(fixture('archive.zip'), temp, 1)

  expect(await exists(path.join(temp, 'LICENSE'))).toBe(true)
  expect(await exists(path.join(temp, 'README.md'))).toBe(true)

  await destory(temp)
})

test('unit:core:file:extract:strip-max', async () => {
  const temp = await mktmpdir()

  await file.extract(fixture('archive.zip'), temp, 10)

  expect(await exists(path.join(temp, 'LICENSE'))).toBe(true)
  expect(await exists(path.join(temp, 'README.md'))).toBe(true)

  await destory(temp)
})
