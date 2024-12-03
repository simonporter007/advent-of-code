import { parseLines, readInput } from '@/utils/file-io'
import { findFirstNumber, findLastNumber, stringNumbers } from '@/utils/numbers'

export function part1(input: string) {
  const lines = parseLines(input)
  let total = 0

  for (const line of lines) {
    const firstDigit = findFirstNumber(line)
    const lastDigit = findLastNumber(line)
    total += Number(`${firstDigit}${lastDigit}`)
  }

  return total
}

export function part2(input: string) {
  const lines = parseLines(input)
  let total = 0

  for (const line of lines) {
    let firstIdx: number | undefined = undefined
    let firstNumber = 0
    let lastIdx: number | undefined = undefined
    let lastNumber = 0
    Object.entries(stringNumbers).forEach(([word, num]) => {
      const firstNumberIdx = line?.match(new RegExp(`(${num})`))?.index
      const lastNumberIdx = line.match(
        new RegExp(`(${num})(?!.*${num})`),
      )?.index
      if (typeof firstNumberIdx === 'number' && firstNumberIdx >= 0) {
        if (firstIdx === undefined || firstNumberIdx < firstIdx) {
          firstIdx = firstNumberIdx
          firstNumber = num
        }
        if (typeof lastNumberIdx === 'number' && lastNumberIdx >= 0)
          if (lastIdx === undefined || lastNumberIdx > lastIdx) {
            lastIdx = lastNumberIdx
            lastNumber = num
          }
      }

      // search line for words as digits
      const wordMatches = `${line}`.matchAll(new RegExp(word, 'g'))
      for (const match of wordMatches) {
        if (typeof match?.index === 'number' && match?.index >= 0) {
          if (firstIdx === undefined || match?.index < firstIdx) {
            firstIdx = match?.index
            firstNumber = num
          }
          if (lastIdx === undefined || match?.index > lastIdx) {
            lastIdx = match?.index
            lastNumber = num
          }
        }
      }
    })

    total += Number(`${firstNumber}${lastNumber}`)
  }

  return total
}

if (Bun.env.debug === 'true') {
  async function debug() {
    const input = await readInput({ day: 'day01', year: 2023 })
    part1(input)
    part2(input)
  }
  debug()
}
