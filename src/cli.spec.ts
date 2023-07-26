import { vi, test, expect } from 'vitest'

const mockArgv = (...args: string[]): () => void => {
  const original = process.argv
  process.argv = original.slice(0, 2).concat(...args)
  return () => { process.argv = original }
}

test('unit:cli:help', async () => {
  const restore = mockArgv('--help')
  const log = vi.spyOn(console, 'log')
  await import('./cli')
  expect(log).toHaveBeenCalledTimes(1)
  expect(log.mock.calls[0][0]).toContain('$ caz <template> [project]')
  log.mockRestore()
  restore()
})
