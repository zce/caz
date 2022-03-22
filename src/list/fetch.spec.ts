import fetch from './fetch'

test('unit:fetch:empty', async () => {
  const results = await fetch('ghost')
  expect(results).toEqual([])
})

test('unit:fetch:list', async () => {
  const results = await fetch('caz-templates')
  expect(results.length).toBeTruthy()
})

test('unit:fetch:error', async () => {
  expect.hasAssertions()
  try {
    await fetch('fakkkkkkkkkkker')
  } catch (e) {
    expect((e as Error).message).toBe('Failed to fetch list from remote: Unexpected response: Not Found.')
  }
})
