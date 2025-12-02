import { join } from 'node:path'
import { MOCKS_DIR } from '@/constants'
import { parseLines, readInput } from '@/utils/file-io'
import { half } from '@/utils/strings'

export function part1(input: string) {
  const lines = parseLines(input)
  const matches = lines[0].matchAll(/(\d+)-(\d+)/g)
  let total = 0

  for (const match of matches) {
    const [, min, max] = match

    if (min.length % 2 !== 0 && max.length % 2 !== 0) {
      // both numbers have odd lengths, skip
      continue
    }

    const [minStart] = half(min)
    const minNum = Number(min)
    const maxNum = Number(max)

    let startingNum = Number(minStart)

    while (Number(`${startingNum}${startingNum}`) <= maxNum) {
      const potentialDuplicate = Number(`${startingNum}${startingNum}`)

      if (`${startingNum}${startingNum}`.length % 2 !== 0) {
        // skip odd lengths as they can't be duplicate numbers
        startingNum += 1
        continue
      }

      // Also check for middle numbers using minStart/minEnd and maxStart/maxEnd
      if (minNum <= potentialDuplicate && potentialDuplicate <= maxNum) {
        total += potentialDuplicate
      }

      startingNum = Number(`${startingNum + 1}`)
    }
  }

  return total
}

export function part2(input: string) {
  const lines = parseLines(input)
  const matches = lines[0].matchAll(/(\d+)-(\d+)/g)
  let total = 0

  for (const match of matches) {
    const [, min, max] = match
    for (const idx in Array.from<string>({
      length: Number(max) - Number(min) + 1,
    })) {
      // 0 indexed, so +1 length
      const nextNum = Number(idx) + Number(min)
      const strNum = nextNum.toString()

      // all digits the same OR repeated groups of digits
      if (strNum.match(/^(\d+)\1+$/)) {
        total += nextNum
      }
    }
  }

  return total
}

if (Bun.env.debug === 'true') {
  async function debug() {
    const input = await readInput({
      day: 'day02',
      // inputFilePath: join(MOCKS_DIR, 'input.part1.example.txt'),
      inputFilePath: join(MOCKS_DIR, 'input.part2.example.txt'),
      // inputFilePath: 'input.txt',
      year: 2025,
    })
    part1(input)
    part2(input)
  }
  debug()
}
