import os from 'os'
import fs from 'fs'
import path from 'path'
import * as file from '../../src/core/file'

const tempPrefix = path.join(os.tmpdir(), 'caz-test-')

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

  const temp2 = await fs.promises.mkdtemp(tempPrefix)
  const empty2 = await file.isEmpty(temp2)
  expect(empty2).toBe(true)
  await fs.promises.rmdir(temp2)
})

test('unit:core:file:mkdir', async () => {
  // relative (cwd) path recursive
  const root1 = 'test/.temp'
  const target1 = `${root1}/${Date.now()}/caz/mkdir/1`
  await file.mkdir(target1)
  expect(fs.existsSync(target1)).toBe(true)

  // absolute path recursive
  const root2 = tempPrefix + Date.now().toString() + '2'
  const target2 = `${root2}/caz/mkdir/2`
  await file.mkdir(target2)
  expect(fs.existsSync(target2)).toBe(true)

  // mode options
  const root3 = tempPrefix + Date.now().toString() + '3'
  await file.mkdir(root3, { mode: 0o755, recursive: false })
  const stat3 = await fs.promises.stat(root3)
  expect(stat3.mode).toBe(process.platform === 'win32' ? 16822 : 16877)

  // cleanup require node > v12.10
  await fs.promises.rmdir(root1, { recursive: true })
  await fs.promises.rmdir(root2, { recursive: true })
  await fs.promises.rmdir(root3, { recursive: true })
})

test('unit:core:file:remove', async () => {
  const temp = await fs.promises.mkdtemp(tempPrefix)

  // remove not exists
  const target1 = path.join(temp, 'caz-remove-1')
  await file.remove(target1)
  const exists1 = fs.existsSync(target1)
  expect(exists1).toBe(false)

  // remove a file
  const target2 = path.join(temp, 'caz-remove-2')
  await fs.promises.writeFile(target2, '')
  await file.remove(target2)
  const exists2 = fs.existsSync(target2)
  expect(exists2).toBe(false)

  // remove a dir
  const target3 = path.join(temp, 'caz-remove-3')
  await fs.promises.mkdir(target3)
  await file.remove(target3)
  const exists3 = fs.existsSync(target3)
  expect(exists3).toBe(false)

  // remove a dir recursive
  const target4 = path.join(temp, 'caz-remove-4')
  await fs.promises.mkdir(target4 + '/subdir/foo/bar', { recursive: true })
  await file.remove(target4)
  const exists4 = fs.existsSync(target4)
  expect(exists4).toBe(false)

  await fs.promises.rmdir(temp)
})

test('unit:core:file:read', async () => {
  const filename = path.join(path.join(__dirname, '../fixtures/.npmrc'))
  const buffer = await file.read(filename)
  const contents = buffer.toString().trim()
  expect(contents).toBe('init-author-name = zce')
})

test('unit:core:file:write', async () => {
  const dirname = path.join(__dirname, '../.temp')
  const filename = path.join(dirname, 'temp.txt')
  await file.write(filename, 'hello zce')
  const contents = await fs.promises.readFile(filename, 'utf8')
  expect(contents).toBe('hello zce')
  await fs.promises.rmdir(dirname, { recursive: true })
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
  const result6 = file.untildify('/untildify')
  expect(result6).toBe('/untildify')
})

test('unit:core:file:extract:zip', async () => {
  const temp = await fs.promises.mkdtemp(tempPrefix)

  await file.extract(path.join(__dirname, '../fixtures/archive.zip'), temp)

  const stats1 = fs.statSync(path.join(temp, 'archive'))
  expect(stats1.isDirectory()).toBe(true)

  const stats2 = fs.statSync(path.join(temp, 'archive/LICENSE'))
  expect(stats2.isFile()).toBe(true)

  const stats3 = fs.statSync(path.join(temp, 'archive/README.md'))
  expect(stats3.isFile()).toBe(true)

  await fs.promises.rmdir(temp, { recursive: true })
})

test('unit:core:file:extract:strip', async () => {
  const temp = await fs.promises.mkdtemp(tempPrefix)

  await file.extract(path.join(__dirname, '../fixtures/archive.zip'), temp, 1)

  const stats1 = fs.statSync(path.join(temp, 'LICENSE'))
  expect(stats1.isFile()).toBe(true)

  const stats2 = fs.statSync(path.join(temp, 'README.md'))
  expect(stats2.isFile()).toBe(true)

  await fs.promises.rmdir(temp, { recursive: true })
})
