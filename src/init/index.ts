import path from 'path'
import { Ware } from '../common'
import { Context } from './types'
import confirm from './confirm'
import resolve from './resolve'
import load from './load'
import plugin from './plugin'
import inquire from './inquire'
import complete from './complete'

export interface InitOptions {
  offline?: boolean
}

const creator = new Ware<Context>()

creator.use(confirm)
creator.use(resolve)
creator.use(load)
creator.use(plugin)
creator.use(inquire)

creator.use(complete)

creator.use(ctx => console.log(ctx))

export default async (template: string, project: string = '.', options: InitOptions = {}): Promise<void> => {
  // // required arguments
  // if (template == null || template === '') {
  //   throw new Error('Missing required argument: `template`.')
  // }

  const context = {
    template,
    project,
    offline: options.offline ?? false,
    url: '',
    src: '',
    dest: path.resolve(project),
    options: { name: '' },
    answers: {},
    files: {}
  }

  try {
    await creator.run(context)
  } catch (e) {
    console.error(e)
  }
}
