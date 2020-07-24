import { Ware } from '../common'
import { Context } from './types'
import confirm from './confirm'
import resolve from './resolve'
import load from './load'
import inquire from './inquire'
import prepare from './prepare'
import rename from './rename'
import template from './template'
import emit from './emit'
import complete from './complete'

export interface InitOptions extends Dictionary<unknown> {
  /**
   * Offline mode, try to use an offline template.
   * @default false
   */
  offline?: boolean
}

const creator = new Ware<Context>()

// TODO:
// - require lazy
// - lifecycle hooks
// - npm install && git init
creator.use(confirm)
creator.use(resolve)
creator.use(load)
creator.use(inquire)
creator.use(prepare)
creator.use(rename)
creator.use(template)
creator.use(emit)
creator.use(complete)

// creator.use(ctx => console.log(ctx))

export default async (template: string, project: string = '.', options: InitOptions = {}): Promise<void> => {
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

  try {
    await creator.run(context)
  } catch (e) {
    console.error(e)
  }
}
