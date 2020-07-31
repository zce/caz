import caz from '../src'

;(async () => {
  const template = 'nm'
  const project = 'test/.temp/my-project'
  const options = {
    force: false,
    offline: false
  }

  await caz(template, project, options)

  // Scaffolding...
})().catch(console.error)
