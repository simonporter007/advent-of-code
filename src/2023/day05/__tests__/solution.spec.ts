import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { part1, part2 } from '@/2023/day05/solution'
import { MOCKS_DIR } from '@/constants'
import { readInput } from '@/utils/file-io'

describe('2023/day05 >', async () => {
  test('part1 > example', async () => {
    const input = await readInput({
      day: 'day05',
      inputFilePath: join(MOCKS_DIR, 'input.part1.example.txt'),
      year: 2023,
    })
    expect(part1(input)).toEqual(35)
  })

  test('part2 > example', async () => {
    const input = await readInput({
      day: 'day05',
      inputFilePath: join(MOCKS_DIR, 'input.part2.example.txt'),
      year: 2023,
    })
    expect(part2(input)).toEqual(46)
  })
})