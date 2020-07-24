/** @type {import('../../../src/init/types').Options} */
module.exports = {
  name: 'features',
  version: '0.1.0',
  source: 'templates',
  metadata: { date: new Date() },
  prompts: [
    {
      type: 'text',
      name: 'name',
      message: 'Project name',
      initial: 'my-project'
    },
    {
      type: 'text',
      name: 'version',
      message: 'Project version',
      initial: '0.1.0'
    },
    {
      type: 'text',
      name: 'description',
      message: 'Project description',
      initial: 'Awesome project'
    },
    {
      type: 'multiselect',
      name: 'features',
      message: 'Project description',
      instructions: false,
      choices: [
        { title: 'Foo', value: 'foo', selected: true },
        { title: 'Bar', value: 'bar', selected: true },
      ]
    }
  ],
  filters: {
    'foo.txt': a => a.features.includes('foo'),
    'bar.txt': a => a.features.includes('bar'),
    '**/*.js': a => a.features.includes('bar')
  }
}
