import { getPoints, rotate180, rotate45, rotate90 } from '@/utils/arrays'
import { parseLines, readInput } from '@/utils/file-io'
//import { join } from "node:path";
//import { MOCKS_DIR } from "@/constants";

const XMAS_REGEX = /XMAS/g
const A_REGEX = /A/g

function findXmas(lines: string[]) {
  let instances = 0
  let match

  for (let i = 0; i < lines.length; i++) {
    while ((match = XMAS_REGEX.exec(lines[i])) !== null) {
      instances += 1
    }
  }

  return instances
}

export function part1(input: string) {
  let lines = parseLines(input)
  let instances = 0

  for (let deg = 0; deg < 360; deg += 90) {
    instances += findXmas(lines)
    instances += findXmas(rotate45(lines))
    lines = rotate90(lines)
  }

  return instances
}

export function part2(input: string) {
  const lines = parseLines(input)
  let instances = 0

  for (let row = 1; row < lines.length - 1; row++) {
    let line = ''
    let match
    for (let col = 1; col < lines[row].length - 1; col++) {
      line += lines[row][col]
    }

    while ((match = A_REGEX.exec(line)) !== null) {
      const points = getPoints({ lines, col: match?.index + 1, row })
      if (
        ((points.topLeft === 'S' && points.bottomRight === 'M') ||
          (points.topLeft === 'M' && points.bottomRight === 'S')) &&
        ((points.topRight === 'S' && points.bottomLeft === 'M') ||
          (points.topRight === 'M' && points.bottomLeft === 'S'))
      ) {
        instances += 1
      }
    }
  }

  return instances
}

if (Bun.env.debug === 'true') {
  async function debug() {
    const input = await readInput({
      day: 'day04',
      //inputFilePath: join(MOCKS_DIR, "input.part1.example.txt"),
      //inputFilePath: join(MOCKS_DIR, "input.part2.example.txt"),
      year: 2024,
    })
    part1(input)
    part2(input)
  }
  debug()
}
