// ref: https://github.com/zce/mwa

/* eslint-disable @typescript-eslint/promise-function-async */
export type Middleware<S> = (state: S) => Promise<void> | void

/**
 * Middleware Async.
 * @template S state type
 */
export class Ware<S> {
  private readonly middlewares: Array<Middleware<S>> = []

  /**
   * Use the given middleware.
   * @param middleware middleware func
   */
  use (middleware: Middleware<S>): Ware<S> {
    this.middlewares.push(middleware)
    return this
  }

  // /**
  //  * Use the given middleware.
  //  * @param middleware middleware func
  //  */
  // use (middleware: Middleware<S> | Array<Middleware<S>>): Ware<S> {
  //   if (typeof middleware === 'function') {
  //     this.middlewares.push(middleware)
  //   } else {
  //     this.middlewares.push(...middleware)
  //   }
  //   return this
  // }

  /**
   * Run all middlewares.
   * @param state initial state
   */
  run (state: S): Promise<void> {
    return this.middlewares.reduce(
      (prev, current) => prev.then(() => current(state)),
      Promise.resolve()
    )
  }
}
