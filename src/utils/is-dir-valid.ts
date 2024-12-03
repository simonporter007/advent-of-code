import { readdir } from 'node:fs/promises'

export async function isDirValid(path: string) {
  try {
    await readdir(path)
    return true
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return false
  }
}
