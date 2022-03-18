/**
 * PackageJson declaration type.
 * for import package.js as ESM without having to participate in compilation
 * declarations.d.ts
 */
declare module '*/package.json' {
  export const name: string
  export const version: string
}

// References:
// https://github.com/egoist/tsup/issues/14
// https://github.com/egoist/tsup/issues/367
declare module 'prompts' {
  import { Readable, Writable } from 'stream'

  function prompts<T extends string = string> (questions: PromptObject<T> | Array<PromptObject<T>>, options?: Options): Promise<Answers<T>>

  function inject (arr: readonly any[]): void

  function override (obj: { [key: string]: any }): void

  // namespace prompts {
  //   function autocomplete(args: PromptObject): any

  //   function confirm(args: PromptObject): void

  //   function date(args: PromptObject): any

  //   function invisible(args: PromptObject): any

  //   function list(args: PromptObject): any

  //   function multiselect(args: PromptObject): any

  //   function number(args: PromptObject): void

  //   function password(args: PromptObject): any

  //   function select(args: PromptObject): void

  //   function text(args: PromptObject): void

  //   function toggle(args: PromptObject): void
  // }

  // Based upon: https://github.com/terkelg/prompts/blob/d7d2c37a0009e3235b2e88a7d5cdbb114ac271b2/lib/elements/select.js#L29
  interface Choice {
    title: string
    value?: any
    disabled?: boolean | undefined
    selected?: boolean | undefined
    description?: string | undefined
  }

  interface Options {
    onSubmit?: ((prompt: PromptObject, answer: any, answers: any[]) => void) | undefined
    onCancel?: ((prompt: PromptObject, answers: any) => void) | undefined
  }

  interface PromptObject<T extends string = string> {
    type: PromptType | Falsy | PrevCaller<T, PromptType | Falsy>
    name: ValueOrFunc<T>
    message?: ValueOrFunc<string> | undefined
    initial?: | InitialReturnValue | PrevCaller<T, InitialReturnValue | Promise<InitialReturnValue>> | undefined
    style?: string | PrevCaller<T, string | Falsy> | undefined
    format?: PrevCaller<T, void> | undefined
    validate?: PrevCaller<T, boolean | string | Promise<boolean | string>> | undefined
    onState?: PrevCaller<T, void> | undefined
    min?: number | PrevCaller<T, number | Falsy> | undefined
    max?: number | PrevCaller<T, number | Falsy> | undefined
    float?: boolean | PrevCaller<T, boolean | Falsy> | undefined
    round?: number | PrevCaller<T, number | Falsy> | undefined
    instructions?: string | boolean | undefined
    increment?: number | PrevCaller<T, number | Falsy> | undefined
    separator?: string | PrevCaller<T, string | Falsy> | undefined
    active?: string | PrevCaller<T, string | Falsy> | undefined
    inactive?: string | PrevCaller<T, string | Falsy> | undefined
    choices?: Choice[] | PrevCaller<T, Choice[] | Falsy> | undefined
    hint?: string | PrevCaller<T, string | Falsy> | undefined
    warn?: string | PrevCaller<T, string | Falsy> | undefined
    suggest?: ((input: any, choices: Choice[]) => Promise<any>) | undefined
    limit?: number | PrevCaller<T, number | Falsy> | undefined
    mask?: string | PrevCaller<T, string | Falsy> | undefined
    stdout?: Writable | undefined
    stdin?: Readable | undefined
  }

  type Answers<T extends string> = { [id in T]: any }

  type PrevCaller<T extends string, R = T> = (prev: any, values: Answers<T>, prompt: PromptObject) => R

  type Falsy = false | null | undefined

  type PromptType = 'text' | 'password' | 'invisible' | 'number' | 'confirm' | 'list' | 'toggle' | 'select' | 'multiselect' | 'autocomplete' | 'date' | 'autocompleteMultiselect'

  type ValueOrFunc<T extends string> = T | PrevCaller<T>

  type InitialReturnValue = string | number | boolean | Date
}
