export interface InitOptions {
  offline: boolean
}

export default async (template: string, project: string = '.', options: InitOptions = { offline: false }): Promise<void> => {
  console.log('========== Init ==========')
  console.log(template)
  console.log(project)
  console.log(options)
}
