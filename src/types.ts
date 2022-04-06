import prompts from 'prompts'

export interface Options {
  /**
   * Force mode, overwrite if the target exists.
   * @default false
   */
  force?: boolean
  /**
   * Offline mode, try to use an offline template.
   * @default false
   */
  offline?: boolean
  /**
   * cli options to override prompts
   */
  [key: string]: unknown
}

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
  prompts?: prompts.PromptObject | prompts.PromptObject[]
  /**
   * Template file filters.
   */
  filters?: Record<string, (answers: Record<string, unknown>) => boolean>
  /**
   * Template engine helpers.
   */
  helpers?: Record<string, unknown>
  /**
   * Auto install dependencies.
   */
  install?: false | 'npm' | 'yarn' | 'pnpm'
  /**
   * Auto init git repository.
   */
  init?: boolean
  /**
   * Template setup hook, execute after template loaded & inquire completed.
   */
  setup?: (ctx: Context) => Promise<void>
  /**
   * Template prepare hook, execute after template files prepare, before rename & render.
   */
  prepare?: (ctx: Context) => Promise<void>
  /**
   * Template emit hook, execute after all files emit to the destination.
   */
  emit?: (ctx: Context) => Promise<void>
  /**
   * Template all completed.
   */
  complete?: ((ctx: Context) => string | Promise<string> | Promise<void>) | string
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
   * File contents (buffer)
   */
  contents: Buffer
}

/**
 * Creator context.
 */
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
   * More options, most of the cases come from CLI..
   */
  readonly options: Options
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
  readonly answers: Record<string, unknown>
  /**
   * Template files.
   */
  readonly files: File[]
}
