import { parseLines, readInput } from '@/utils/file-io'
import { isStringNum, NUMBER_REGEX } from '@/utils/numbers'

type NumberPosition = {
  colEnd: number
  colStart: number
  rowStart: number
  rowEnd: number
  row: number
  value: number
}

type GearPosition = { gearRow: number; gearCol: number }

function findNumbersWithPositions({
  line,
  lines,
  row,
}: {
  line: string
  lines: string[]
  row: number
}) {
  const numbers: NumberPosition[] = []
  let match

  while ((match = NUMBER_REGEX.exec(line)) !== null) {
    numbers.push({
      colEnd: Math.min(line.length - 1, match.index + match[0].length),
      colStart: Math.max(0, match.index - 1),
      row,
      rowEnd: Math.min(lines.length - 1, row + 1),
      rowStart: Math.max(0, row - 1),
      value: parseInt(match[0], 10),
    })
  }

  return numbers
}

function hasAdjacentSymbol({
  lines,
  num,
}: {
  num: NumberPosition
  lines: string[]
}) {
  const { colEnd, colStart, rowEnd, rowStart } = num

  for (let y = rowStart; y <= rowEnd; y++) {
    for (let x = colStart; x <= colEnd; x++) {
      if (!isStringNum(lines[y][x]) && lines[y][x] !== '.') {
        return true
      }
    }
  }

  return false
}

export function part1(input: string) {
  const lines = parseLines(input)
  let validNumbers = 0

  for (let row = 0; row <= lines?.length - 1; row++) {
    const numbers = findNumbersWithPositions({ line: lines[row], lines, row })
    numbers.forEach((num) => {
      if (hasAdjacentSymbol({ lines, num })) {
        validNumbers += num?.value
      }
    })
  }

  return validNumbers
}

function hasAdjacentGears({
  lines,
  num,
}: {
  num: NumberPosition
  lines: string[]
}) {
  const { colEnd, colStart, rowEnd, rowStart } = num

  for (let y = rowStart; y <= rowEnd; y++) {
    for (let x = colStart; x <= colEnd; x++) {
      if (!isStringNum(lines[y][x]) && lines[y][x] === '*') {
        return [x, y]
      }
    }
  }

  return false
}

function findNumbersWithGears({
  lines,
  numbers,
}: {
  lines: string[]
  numbers: NumberPosition[]
}) {
  const gearNumbers: (NumberPosition & GearPosition)[] = []

  for (let i = 0; i < numbers.length; i++) {
    const gearLocation = hasAdjacentGears({
      lines,
      num: numbers[i],
    })
    if (gearLocation) {
      const [gearCol, gearRow] = gearLocation
      gearNumbers.push({
        ...numbers[i],
        gearCol,
        gearRow,
      })
    }
  }

  return gearNumbers
}

export function part2(input: string) {
  const lines = parseLines(input)
  const numbers: NumberPosition[] = []
  const gearCache: GearPosition[] = []
  let gearRatio = 0

  for (let row = 0; row <= lines?.length - 1; row++) {
    const foundNumbers = findNumbersWithPositions({
      line: lines[row],
      lines,
      row,
    })
    numbers.push(...foundNumbers)
  }

  const gearNumbers = findNumbersWithGears({ lines, numbers })

  for (let gear = 0; gear < gearNumbers?.length; gear++) {
    const { gearCol, gearRow } = gearNumbers[gear]

    if (
      gearCache?.some(
        (cachedGear) =>
          cachedGear?.gearCol === gearCol && cachedGear?.gearRow === gearRow,
      )
    )
      continue

    const matchedGearNumbers = gearNumbers.filter(
      (gear) => gear?.gearCol === gearCol && gear?.gearRow === gearRow,
    )
    if (matchedGearNumbers?.length === 2) {
      const [numberOne, numberTwo] = matchedGearNumbers
      gearCache.push({ gearCol, gearRow })
      gearRatio += numberOne?.value * numberTwo?.value
    }
  }

  return gearRatio
}

if (Bun.env.debug === 'true') {
  async function debug() {
    const input = await readInput({ day: 'day03', year: 2023 })
    part1(input)
    part2(input)
  }
  debug()
}
