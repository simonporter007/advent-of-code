// import { join } from "node:path";
// import { MOCKS_DIR } from "@/constants";
import { removeAtIndex } from '@/utils/arrays'
import { parseLines, readInput } from '@/utils/file-io'

function checkIsSafe({ report }: { report: number[] }) {
  let order: 'increasing' | 'decreasing' | undefined
  let errors = 0
  let i = 0

  while (i < report.length - 1) {
    const curr = report[i]
    const next = report[i + 1]
    const diff = next - curr

    if (diff > 0) {
      // if we already have order, and it's decreasing previously, it's now increasing meaning unsafe
      if (order === 'decreasing') {
        errors += 1
      } else {
        order = 'increasing'
      }
    } else if (diff < 0) {
      // if we already have order, and it's increasing previously, it's now decreasing meaning unsafe
      if (order === 'increasing') {
        errors += 1
      } else {
        order = 'decreasing'
      }
    } else {
      // next - curr === 0, which means we're not increasing or decreasing and therefore not safe.
      errors += 1
    }

    if (errors === 1) {
      return i
    }

    // otherwise, we've set order for the first time, or it's the same as before, make sure the levels difference is acceptable
    if (Math.abs(diff) > 3) {
      // unsafe as difference is more than 3
      errors += 1
    }

    if (errors > 1) {
      // no hope with this one, unsafe after problem dampener
      return false
    }

    // otherwise, safety level passes
    if (errors === 1) {
      return i
    } else {
      // otherwise, normal case of traversing the list, add back the next number to become current in next loop
      i++
    }
  }

  return true
}

export function part1(input: string) {
  const lines = parseLines(input)
  let safe = 0

  for (let i = 0; i < lines.length; i++) {
    const report = lines[i].split(' ').map((str) => parseInt(str, 10))
    const isSafe = checkIsSafe({ report })
    if (isSafe === true) {
      safe += 1
    }
  }

  return safe
}

export function part2(input: string) {
  const lines = parseLines(input)
  let safe = 0

  for (let i = 0; i < lines.length; i++) {
    const report = lines[i].split(' ').map((str) => parseInt(str, 10))
    const isSafe = checkIsSafe({ report })

    if (isSafe === true) {
      safe += 1
    } else if (typeof isSafe === 'number') {
      const idx = isSafe
      const safeAfterRetry =
        checkIsSafe({
          report: removeAtIndex({ array: report, idx }),
        }) === true ||
        (idx + 1 < report.length
          ? checkIsSafe({
              report: removeAtIndex({ array: report, idx: idx + 1 }),
            }) === true
          : false) ||
        (idx - 1 >= 0
          ? checkIsSafe({
              report: removeAtIndex({ array: report, idx: idx - 1 }),
            }) === true
          : false)

      if (safeAfterRetry === true) {
        safe += 1
      }
    }
  }

  return safe
}

if (Bun.env.debug === 'true') {
  async function debug() {
    const input = await readInput({
      day: 'day02',
      // inputFilePath: join(MOCKS_DIR, "input.part1.example.txt"),
      //inputFilePath: join(MOCKS_DIR, "input.part2.example.txt"),
      year: 2024,
    })
    part1(input)
    part2(input)
  }
  debug()
}
