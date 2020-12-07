import exec from '../../src/core/exec'

test('unit:core:exec:normal', async () => {
  await exec('node', ['--version'], { stdio: 'ignore' })
})

test('unit:core:exec:error', async () => {
  try {
    await exec('zceeczzce', [], {})
  } catch (e) {
    expect(e.message).toBe('spawn zceeczzce ENOENT')
  }
})

test('unit:core:exec:fail', async () => {
  try {
    await exec('node', ['-zce'], {})
  } catch (e) {
    expect(e.message).toBe('Failed to execute node command.')
  }
})
