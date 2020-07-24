/**
 * Global types & Module declarations
 * - Global types for ease of use
 * - Module declarations in order to reduce the devDependencies that need to be installed
 */

declare interface Dictionary <T> {
  [key: string]: T
}

/**
 * PackageJson type
 * for import package.js as ESM without having to participate in compilation
 */
// https://www.typescriptlang.org/docs/handbook/modules.html
declare module '*/package.json' {
  // interface PackageJson extends Record<string, unknown> {
  //   name: string
  //   version: string
  //   description: string
  //   keywords: string[]
  //   homepage: string
  //   bugs: { url?: string, email?: string }
  //   repository: { type?: 'git' | 'svn', url?: string }
  //   license: string
  //   author: string | { name?: string, email?: string, url?: string }
  //   main: string
  //   types: string
  //   bin: string | Record<string, string>
  //   files: string[]
  //   scripts: Record<string, string>
  //   dependencies: Record<string, string>
  //   devDependencies: Record<string, string>
  //   engines: { node?: string, npm?: string, yarn?: string }
  //   publishConfig: { access?: 'public' | 'restricted', tag?: string, yarn?: string }
  // }
  // const pkg: PackageJson
  // export default pkg

  export const name: string
  export const version: string
  export const description: string
  export const keywords: string[]
  export const homepage: string
  export const bugs: { url?: string, email?: string }
  export const repository: { type?: 'git' | 'svn', url?: string }
  export const license: string
  export const author: string | { name?: string, email?: string, url?: string }
  export const main: string
  export const types: string
  export const bin: string | Record<string, string>
  export const files: string[]
  export const scripts: Record<string, string>
  export const dependencies: Record<string, string>
  export const devDependencies: Record<string, string>
  export const engines: { node?: string, npm?: string, yarn?: string }
  export const publishConfig: { access?: 'public' | 'restricted', tag?: string, yarn?: string }
}

// // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/ini/index.d.ts
// declare module 'ini' {
//   interface EncodeOptions {
//     section: string
//     whitespace: boolean
//   }
//   export function decode (str: string): {
//     [key: string]: any
//   }
//   export function parse (str: string): {
//     [key: string]: any
//   }
//   export function encode (object: any, options?: EncodeOptions | string): string
//   export function stringify (object: any, options?: EncodeOptions | string): string
//   export function safe (val: string): string
//   export function unsafe (val: string): string
// }

// // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/prompts/index.d.ts
// declare module 'prompts' {
//   export = prompts

//   import { Readable, Writable } from 'stream'

//   function prompts<T extends string = string> (
//     questions: prompts.PromptObject<T> | Array<prompts.PromptObject<T>>,
//     options?: prompts.Options
//   ): Promise<prompts.Answers<T>>

//   namespace prompts {
//     // Circular reference from prompts
//     const prompt: any

//     function inject (arr: readonly any[]): void

//     namespace inject {
//       const prototype: {}
//     }

//     function override (obj: { [key: string]: any }): void

//     namespace override {
//       const prototype: {}
//     }

//     namespace prompts {
//       function autocomplete (args: PromptObject): any

//       function confirm (args: PromptObject): void

//       function date (args: PromptObject): any

//       function invisible (args: PromptObject): any

//       function list (args: PromptObject): any

//       function multiselect (args: PromptObject): any

//       function number (args: PromptObject): void

//       function password (args: PromptObject): any

//       function select (args: PromptObject): void

//       function text (args: PromptObject): void

//       function toggle (args: PromptObject): void
//     }

//     // Based upon: https://github.com/terkelg/prompts/blob/d7d2c37a0009e3235b2e88a7d5cdbb114ac271b2/lib/elements/select.js#L29
//     interface Choice {
//       title: string
//       value: any
//       disabled?: boolean
//       selected?: boolean
//       description?: string
//     }

//     interface Options {
//       onSubmit?: (prompt: PromptObject, answer: any, answers: any[]) => void
//       onCancel?: (prompt: PromptObject, answers: any) => void
//     }

//     interface PromptObject<T extends string = string> {
//       type: PromptType | Falsy | PrevCaller<T, PromptType | Falsy>
//       name: ValueOrFunc<T>
//       message?: ValueOrFunc<string>
//       initial?: string | number | boolean | Date
//       style?: string
//       format?: PrevCaller<T, void>
//       validate?: PrevCaller<T, boolean | string | Promise<boolean | string>>
//       onState?: PrevCaller<T, void>
//       min?: number
//       max?: number
//       float?: boolean
//       round?: number
//       increment?: number
//       separator?: string
//       active?: string
//       inactive?: string
//       choices?: Choice[]
//       hint?: string
//       suggest?: ((input: any, choices: Choice[]) => Promise<any>)
//       limit?: number
//       mask?: string
//       stdout?: Writable
//       stdin?: Readable
//     }

//     type Answers<T extends string = string> = { [id in T]: any }

//     type PrevCaller<T extends string, R = T> = (
//       prev: any,
//       values: Answers<T>,
//       prompt: PromptObject
//     ) => R

//     type Falsy = false | null | undefined

//     type PromptType = 'text' | 'password' | 'invisible' | 'number' | 'confirm' | 'list' | 'toggle' | 'select' | 'multiselect' | 'autocomplete' | 'date' | 'autocompleteMultiselect'

//     type ValueOrFunc<T extends string> = T | PrevCaller<T>
//   }
// }

// // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/validate-npm-package-name/index.d.ts
// declare module 'validate-npm-package-name' {
//   namespace validate {
//     let scopedPackagePattern: RegExp

//     interface Result {
//       errors?: string[]
//       validForNewPackages: boolean
//       validForOldPackages: boolean
//       warnings?: string[]
//     }
//   }

//   function validate (name: string): validate.Result

//   export = validate
// }

// // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/semver/index.d.ts

// declare module 'semver' {
//   export function valid (
//     version: string,
//     optionsOrLoose?: any,
//   ): string | null
// }
