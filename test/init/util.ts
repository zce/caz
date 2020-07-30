import os from 'os'
import fs from 'fs'
import path from 'path'
import { Context, Template } from '../../src'

export const createContext = (context?: Partial<Context>, config?: Partial<Template>): Context => ({
  template: 'faker',
  project: 'faker',
  options: {},
  src: path.join(__dirname, '../fixtures'),
  dest: path.join(__dirname, '../.temp'),
  config: { name: 'faker', ...config },
  answers: {},
  files: [],
  ...context
})

export const createTempDir = async (): Promise<string> => {
  return await fs.promises.mkdtemp(path.join(os.tmpdir(), 'caz-test-'))
}
