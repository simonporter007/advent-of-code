import { join } from 'node:path'
import { describe, expect, test } from 'vitest'
import { part1, part2 } from '@/2025/day02/solution'
import { MOCKS_DIR } from '@/constants'
import { readInput } from '@/utils/file-io'

describe('2025/day02 >', async () => {
  test('part1 > example', async () => {
    const input = await readInput({
      day: 'day02',
      inputFilePath: join(MOCKS_DIR, 'input.part1.example.txt'),
      year: 2025,
    })
    expect(part1(input)).toEqual(1227775554)
  })
  test('part1 > large range', async () => {
    const input = await readInput({
      day: 'day02',
      inputFilePath: join(MOCKS_DIR, 'input.large.range.txt'),
      year: 2025,
    })
    expect(part1(input)).toEqual(434434)
  })
  test('part1 > min length', async () => {
    const input = await readInput({
      day: 'day02',
      inputFilePath: join(MOCKS_DIR, 'input.min.length.txt'),
      year: 2025,
    })
    expect(part1(input)).toEqual(11)
  })

  test('part2 > example', async () => {
    const input = await readInput({
      day: 'day02',
      inputFilePath: join(MOCKS_DIR, 'input.part2.example.txt'),
      year: 2025,
    })
    expect(part2(input)).toEqual(4174379265)
  })

  test('part2 > large range', async () => {
    const input = await readInput({
      day: 'day02',
      inputFilePath: join(MOCKS_DIR, 'input.large.range.txt'),
      year: 2025,
    })
    expect(part2(input)).toEqual(434434)
  })
})
