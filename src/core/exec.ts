/* eslint-disable @typescript-eslint/promise-function-async */
import { spawn, SpawnOptions } from 'child_process'

/**
 * Execute a command.
 * @param command command name
 * @param args command arguments
 * @param options command options
 */
export default (command: string, args: string[], options: SpawnOptions): Promise<void> => new Promise((resolve, reject) => {
  spawn(command, args, options)
    .on('error', reject)
    .on('exit', code => {
      if (code === 0) return resolve()
      reject(new Error(`Failed to execute ${command} command.`))
    })
})
