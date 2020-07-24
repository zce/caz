import { Stats } from 'fs'
import { PromptObject, Answers } from 'prompts'

// @typescript-eslint/no-invalid-void-type
// export type HookFunction = (ctx: Context) => void | string | Promise<void | string>

/**
 * Hook function.
 */
export type HookFunction = (ctx: Context) => any

/**
 * Template config.
 */
export interface Template {
  /**
   * Template name.
   */
  name: string
  /**
   * Template version.
   */
  version?: string
  /**
   * Template source dirname.
   */
  source?: string
  /**
   * Template metadata.
   */
  metadata?: Record<string, unknown>
  /**
   * Template prompts.
   */
  prompts?: PromptObject | PromptObject[]
  /**
   * Template file filters.
   */
  filters?: Record<string, (answers: Answers<string>) => boolean>
  /**
   * Template engine helpers.
   */
  helpers?: Record<string, unknown>
  /**
   * Template hooks plugin.
   * @todo all hooks
   */
  plugin?: HookFunction
  /**
   * Template all completed.
   */
  complete?: HookFunction | string
}

/**
 * File info.
 */
export interface File {
  /**
   * File full path
   */
  path: string
  /**
   * File stat
   */
  stats?: Stats
  /**
   * File contents (buffer)
   */
  contents: Buffer
}

export interface Context {
  /**
   * Template name.
   * e.g.
   * - offlical short name: `nm`
   * - offlical short name with branch: `nm#master`
   * - custom full name: `zce/nm`
   * - custom full name with branch: `zce/nm#master`
   * - local directory path: `~/templates/nm`
   * - full url: `https://github.com/zce/nm/archive/master.zip`
   */
  readonly template: string
  /**
   * Project name, which is also the project directory.
   */
  readonly project: string
  /**
   * More options.
   */
  readonly options: Dictionary<any> & { offline?: boolean }
  /**
   * The source directory where the template (absolute).
   */
  src: string
  /**
   * Generated result output destination directory (absolute).
   */
  dest: string
  /**
   * Template config.
   */
  readonly config: Template
  /**
   * Template prompts answers.
   */
  readonly answers: Answers<string>
  /**
   * Template files.
   */
  readonly files: File[]
}
