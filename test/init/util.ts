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
