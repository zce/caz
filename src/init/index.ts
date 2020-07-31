import { Ware } from '../core'
import { Options, Context, Template } from './types'

import confirm from './confirm'
import resolve from './resolve'
import load from './load'
import cache from './cache'
import setup from './setup'
import inquire from './inquire'
import prepare from './prepare'
import rename from './rename'
import render from './render'
import emit from './emit'
import install from './install'
import init from './init'
import complete from './complete'

// TODO:
// - require lazy
// - all lifecycle hooks

const creator = new Ware<Context>()

creator.use(confirm)
creator.use(resolve)
creator.use(load)
creator.use(cache)
creator.use(setup)
creator.use(inquire)
creator.use(prepare)
creator.use(rename)
creator.use(render)
creator.use(emit)
creator.use(install)
creator.use(init)
creator.use(complete)

// creator.use(ctx => console.log(ctx))

export default async (template: string, project: string = '.', options: Options = {}): Promise<void> => {
  // required arguments
  if (template == null || template === '') {
    throw new Error('Missing required argument: `template`.')
  }

  const context = {
    template,
    project,
    options,
    src: '',
    dest: '',
    config: Object.create(null),
    answers: Object.create(null),
    files: []
  }

  await creator.run(context)
}

export { Options, Context, Template }
