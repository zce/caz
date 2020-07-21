export interface ListOptions {
  json: boolean
  short: boolean
}

export default async (owner: string = 'zce-templates', options: ListOptions = { json: false, short: false }): Promise<void> => {
  console.log('========== list ==========')
  console.log(owner)
  console.log(options)
}
