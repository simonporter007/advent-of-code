import { parseLines, readInput } from '@/utils/file-io'
//import { join } from "node:path";
//import { MOCKS_DIR } from "@/constants";

const FIND_MUL_REGEX = new RegExp(/mul\((?<x>\d{1,3}),(?<y>\d{1,3})\)/g)
const FIND_SEGMENTS_WITH_EXPRESSIONS = new RegExp(
  /^(.*?)don't\(\)|do\(\)(.*?)don't\(\)|do\(\)(.*?)(?!:don't\(\))$/g,
)

export function part1(input: string) {
  const lines = parseLines(input)
  let total = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const matches = line.matchAll(FIND_MUL_REGEX)

    if (!matches) {
      continue
    }

    for (const match of matches) {
      if (match?.groups?.x && match?.groups?.y) {
        total += parseInt(match?.groups?.x, 10) * parseInt(match?.groups?.y, 10)
      }
    }
  }

  return total
}

export function part2(input: string) {
  const lines = parseLines(input).join('')
  let total = 0

  const matches = lines.matchAll(FIND_SEGMENTS_WITH_EXPRESSIONS)

  if (!matches) {
    throw new Error('Something way off, no matches at all!')
  }

  for (const match of matches) {
    for (let x = 1; x < match.length; x++) {
      if (match[x]) {
        let mulMatch
        while ((mulMatch = FIND_MUL_REGEX.exec(match[x])) !== null) {
          if (mulMatch?.groups?.x && mulMatch?.groups?.y) {
            total +=
              parseInt(mulMatch?.groups?.x, 10) *
              parseInt(mulMatch?.groups?.y, 10)
          }
        }
      }
    }
  }

  return total
}

if (Bun.env.debug === 'true') {
  async function debug() {
    const input = await readInput({
      day: 'day03',
      //inputFilePath: join(MOCKS_DIR, "input.part1.example.txt"),
      //inputFilePath: join(MOCKS_DIR, "input.part2.example.txt"),
      year: 2024,
    })
    part1(input)
    part2(input)
  }
  debug()
}
