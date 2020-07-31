import fetch from '../../src/list/fetch'

test('unit:fetch', async () => {
  expect(typeof fetch).toBe('function')
})

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
    expect(e.message).toBe('Failed to fetch list from remote: Unexpected response: Not Found.')
  }
})
