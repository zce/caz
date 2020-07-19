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
