import { Stats } from 'fs'
import { PromptObject, Answers } from 'prompts'
import { Middleware } from '../common'

export interface File {
  path: string
  stats: Stats
  contents: Buffer
}

// @typescript-eslint/no-invalid-void-type
// export type CompleteFunction = (ctx: Context) => void | string | Promise<void | string>
export type CompleteFunction = (ctx: Context) => any

export interface Options {
  name: string
  version?: string
  source?: string
  metadata?: Record<string, unknown>
  prompts?: PromptObject | PromptObject[]
  filters?: Record<string, (answers: Answers) => boolean>
  helpers?: Record<string, unknown>
  plugin?: Middleware<Context>
  complete?: CompleteFunction | string
}

export interface Context {
  template: string
  project: string
  offline: boolean
  url: string
  src: string
  dest: string
  options: Options
  answers: any
  files: { [filename: string]: File }
}
