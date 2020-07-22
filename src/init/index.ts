import path, { resolve } from 'path'
import { Ware } from '../common'
import { Context } from './types'
import confirm from './confirm'

export interface InitOptions {
  offline?: boolean
}

const creator = new Ware<Context>()

creator.use(confirm)

const delay = (t: number) => new Promise(resolve => setTimeout(resolve, t))

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

  await delay(1000)

  throw new Error('123')

  try {
    await creator.run(context)
  } catch (e) {
    console.error(e)
  }
}
