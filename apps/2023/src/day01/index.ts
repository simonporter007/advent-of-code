import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput?.split('\n')
const numbers = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
} as const

function part1(rawInput: string) {
  const input = parseInput(rawInput)
  let total = 0

  for (const line of input) {
    const lineArr = line.split('')
    const firstDigit = lineArr.find((char) => char?.match(/[0-9]/))
    const lastDigit = lineArr.findLast((char) => char?.match(/[0-9]/))
    total += Number(`${firstDigit}${lastDigit}`)
  }
  return total
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  let total = 0

  for (const line of input) {
    let firstIdx: number | undefined = undefined
    let firstNumber = 0
    let lastIdx: number | undefined = undefined
    let lastNumber = 0
    Object.entries(numbers).forEach(([word, number]) => {
      // search line for digits
      const lineArr = line.split('')
      const firstNumberIdx = lineArr.findIndex(
        (char) => char?.match(new RegExp(`${number}`)),
      )
      const lastNumberIdx = lineArr.findLastIndex(
        (char) => char?.match(new RegExp(`${number}`)),
      )
      if (typeof firstNumberIdx === 'number' && firstNumberIdx >= 0) {
        if (firstIdx === undefined || firstNumberIdx < firstIdx) {
          firstIdx = firstNumberIdx
          firstNumber = number
        }
        if (typeof lastNumberIdx === 'number' && lastNumberIdx >= 0)
          if (lastIdx === undefined || lastNumberIdx > lastIdx) {
            lastIdx = lastNumberIdx
            lastNumber = number
          }
      }

      // search line for words as digits
      const wordMatches = `${line}`.matchAll(new RegExp(word, 'g'))
      for (let match of wordMatches) {
        if (typeof match?.index === 'number' && match?.index >= 0) {
          if (firstIdx === undefined || match?.index < firstIdx) {
            firstIdx = match?.index
            firstNumber = number
          }
          if (lastIdx === undefined || match?.index > lastIdx) {
            lastIdx = match?.index
            lastNumber = number
          }
        }
      }
    })

    total += Number(`${firstNumber}${lastNumber}`)
  }

  return total
}

run({
  part1: {
    tests: [
      {
        input: `
          1abc2
          pqr3stu8vwx
          a1b2c3d4e5f
          treb7uchet
        `,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          two1nine
          eightwothree
          abcone2threexyz
          xtwone3four
          4nineeightseven2
          zoneight234
          7pqrstsixteen
        `,
        expected: 281,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
