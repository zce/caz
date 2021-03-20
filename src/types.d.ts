/**
 * PackageJson declaration type.
 * for import package.js as ESM without having to participate in compilation
 */
declare module '*/package.json' {
  export const name: string
  export const version: string
}
