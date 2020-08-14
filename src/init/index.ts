import { Ware } from '../core'
import { Options, Context, Template } from './types'

import confirm from './confirm'
import resolve from './resolve'
import load from './load'
import inquire from './inquire'
import setup from './setup'
import prepare from './prepare'
import rename from './rename'
import render from './render'
import emit from './emit'
import install from './install'
import init from './init'
import complete from './complete'

// TODO: require lazy ??

const creator = new Ware<Context>()

creator.use(confirm)
creator.use(resolve)
creator.use(load)
creator.use(inquire)
creator.use(setup)
creator.use(prepare)
creator.use(rename)
creator.use(render)
creator.use(emit)
creator.use(install)
creator.use(init)
creator.use(complete)

export default async (template: string, project: string = '.', options: Options = {}): Promise<void> => {
  // required arguments
  if (template == null || template === '') {
    throw new Error('Missing required argument: `template`.')
  }

  // create context
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

  // running creator
  await creator.run(context)
}

export { Options, Context, Template }
