import { join } from 'node:path'

export const CONFIG_FILE = Bun.env.CONFIG_FILE ?? '.aoc.json'
export const PROJECT_ROOT = join(import.meta.dir, '..')
export const TESTS_DIR = join('__tests__')
export const MOCKS_DIR = join(TESTS_DIR, '__mocks__')
export const DEFAULT_PERFORMANCE_RUNS = 50
