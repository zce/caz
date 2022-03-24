import os from 'os'
import fs from 'fs'
import path from 'path'
import AdmZip from 'adm-zip'

/**
 * Checks whether something exists on given path.
 * @param input input path
 */
export const exists = async (input: string): Promise<false | 'file' | 'dir' | 'other'> => {
  try {
    const stat = await fs.promises.stat(input)
    /* istanbul ignore else */
    if (stat.isDirectory()) {
      return 'dir'
    } else if (stat.isFile()) {
      return 'file'
    } else {
      return 'other'
    }
  } catch (err) {
    /* istanbul ignore if */
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw err
    }
    return false
  }
}

/**
 * Check input is a file.
 * @param input input path
 */
export const isFile = async (input: string): Promise<boolean> => {
  const result = await exists(input)
  return result === 'file'
}

/**
 * Check input is a file.
 * @param input input path
 */
export const isDirectory = async (input: string): Promise<boolean> => {
  const result = await exists(input)
  return result === 'dir'
}

/**
 * Check input is empty.
 * @param input input path
 */
export const isEmpty = async (input: string): Promise<boolean> => {
  const files = await fs.promises.readdir(input)
  return files.length === 0
}

/**
 * Make directory recursive.
 * require node >= v10.12
 * @param input input path
 * @param options recursive by default
 */
export const mkdir = async (input: string, options?: fs.MakeDirectoryOptions): Promise<void> => {
  await fs.promises.mkdir(input, { recursive: true, ...options })
}

/**
 * Remove input dir or file. recursive when dir
 * require node >= v14.14.0
 * @param input input path
 * @param options recursive & force by default
 * @todo https://github.com/sindresorhus/trash
 */
export const remove = async (input: string, options?: fs.RmOptions): Promise<void> => {
  await fs.promises.rm(input, { recursive: true, force: true, ...options })
}

/**
 * Read file as a buffer.
 * @param input file name
 */
export const read = async (input: string): Promise<Buffer> => {
  return await fs.promises.readFile(input)
}

/**
 * Write file with mkdir recursive.
 * @param input file name
 * @param contents file contents
 */
export const write = async (input: string, contents: string | Uint8Array): Promise<void> => {
  await mkdir(path.dirname(input))
  return await fs.promises.writeFile(input, contents)
}

/**
 * Detect buffer is binary.
 * @param input buffer
 */
export const isBinary = (input: Uint8Array): boolean => {
  // Detect encoding
  // 65533 is the unknown char
  // 8 and below are control chars (e.g. backspace, null, eof, etc)
  return input.some(item => item === 65533 || item <= 8)
}

/**
 * Tildify absolute path.
 * @param input absolute path
 * @see https://github.com/sindresorhus/tildify
 */
export const tildify = (input: string): string => {
  const home = os.homedir()

  // https://github.com/sindresorhus/tildify/issues/3
  input = path.normalize(input) + path.sep

  if (input.indexOf(home) === 0) {
    input = input.replace(home + path.sep, `~${path.sep}`)
  }

  return input.slice(0, -1)
}

/**
 * Untildify tilde path.
 * @param input tilde path
 * @see https://github.com/sindresorhus/untildify
 */
export const untildify = (input: string): string => {
  const home = os.homedir()

  input = input.replace(/^~(?=$|\/|\\)/, home)

  return path.normalize(input)
}

/**
 * Extract zip file.
 * @param input input path or stream
 * @param output output path
 * @param strip strip output path
 * @see https://github.com/shinnn/node-strip-dirs
 */
export const extract = async (input: string, output: string, strip = 0): Promise<void> => await new Promise(resolve => {
  const zip = new AdmZip(input)

  strip === 0 || zip.getEntries().forEach(entry => {
    const items = entry.entryName.split(/\/|\\/)
    const start = Math.min(strip, items.length - 1)
    const stripped = items.slice(start).join('/')
    entry.entryName = stripped === '' ? entry.entryName : stripped
  })

  // https://github.com/cthackers/adm-zip/issues/389
  // https://github.com/cthackers/adm-zip/issues/407#issuecomment-990086783
  // keep original file permissions
  zip.extractAllToAsync(output, true, true, err => {
    /* istanbul ignore if */
    if (err != null) throw err
    resolve()
  })
})
