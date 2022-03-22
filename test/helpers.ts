import os from 'os'
import fs from 'fs'
import path from 'path'
import { Context, Template } from '../src'

/**
 * Get a fixture file path.
 * @param target relative path
 * @returns absolute path
 */
export const fixture = (target: string): string => {
  return path.join(__dirname, 'fixtures', target)
}

/**
 * Check input path exists.
 * @param input input path
 * @returns true if input is exists
 */
export const exists = async (input: string): Promise<boolean> => {
  return await fs.promises.access(input).then(() => true).catch(() => false)
}

/**
 * Create a temporary directory.
 * @returns temp directory path
 */
export const mktmpdir = async (): Promise<string> => {
  return await fs.promises.mkdtemp(path.join(os.tmpdir(), 'caz-test-'))
}

/**
 * Force deletion of specified directory.
 * @param target destory target
 */
export const destory = async (...target: string[]): Promise<void> => {
  for (const item of target) {
    // cleanup require node >= v14.14.0
    await fs.promises.rm(item, { recursive: true, force: true })
  }
}

// /**
//  * Local mock zip download function
//  * @returns mock download function
//  */
// export const download = async () => {
//   const file = fixture('archive.zip')
//   const target = path.join(await mktmpdir(), 'archive.zip')
//   await fs.promises.copyFile(file, target)
//   return target
// }

/**
 * Create a context.
 * @param context additional context options
 * @param config additional config options
 * @returns a context object
 */
export const context = (context?: Partial<Context>, config?: Partial<Template>): Context => ({
  template: 'faker',
  project: 'faker',
  options: {},
  src: path.join(__dirname, 'fixtures'),
  dest: path.join(__dirname, '.temp'),
  config: { name: 'faker', ...config },
  answers: {},
  files: [],
  ...context
})
