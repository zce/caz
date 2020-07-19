export interface InitOptions {
  offline: boolean
}

export default async (template: string, project: string = '.', options: InitOptions) => {
  console.log('========== Init ==========')
  console.log(template)
  console.log(project)
  console.log(options)
}
