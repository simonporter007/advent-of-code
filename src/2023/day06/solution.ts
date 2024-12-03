import { parseLines, readInput } from '@/utils/file-io'
//import { join } from "node:path";
//import { MOCKS_DIR } from "@/constants";

export function part1(input: string) {
  const lines = parseLines(input)
  const [timeLine, distanceLine] = lines
  const times = timeLine
    .replace('Time:', '')
    .split(/\s+/)
    .filter(Boolean)
    .map((digit) => parseInt(digit, 10))
  const distances = distanceLine
    .replace('Distance:', '')
    .split(/\s+/)
    .filter(Boolean)
    .map((digit) => parseInt(digit, 10))
  let totalWins = 0

  times.forEach((time, idx) => {
    let wins = 0
    // find range of possible distances needed, e.g. the discriminant (4^2 - 4ac)
    const maxRange = Math.round(-Math.pow(time, 2) / -4)

    // solve for the required button press lengths (total time - charge time) * charge time = distance
    for (
      let winningDistance = distances[idx] + 1;
      winningDistance <= maxRange;
      winningDistance++
    ) {
      // when solving quadratics, we find the discriminant
      const discriminant = Math.pow(time, 2) - 4 * winningDistance
      // we have two real solutions if positive
      if (discriminant > 0) {
        const firstOption = (time + Math.sqrt(discriminant)) / 2
        const secondOption = (time - Math.sqrt(discriminant)) / 2

        // our total range of wins is the difference between first and second options
        if (Number.isInteger(firstOption) && Number.isInteger(secondOption)) {
          wins = firstOption - secondOption + 1
          break
        }
      }
    }
    // calculate the total wins product for the final result
    totalWins = !totalWins ? wins : totalWins * wins
  })

  return totalWins
}

export function part2(input: string) {
  const lines = parseLines(input)
  const [timeLine, distanceLine] = lines
  const time = parseInt(
    timeLine.replace('Time:', '').split(/\s+/).filter(Boolean).join(''),
    10,
  )
  const distance = parseInt(
    distanceLine.replace('Distance:', '').split(/\s+/).filter(Boolean).join(''),
    10,
  )
  let wins = 0
  // find range of possible distances needed, e.g. the discriminant (4^2 - 4ac)
  const maxRange = Math.round(-Math.pow(time, 2) / -4)

  // solve for the required button press lengths (total time - charge time) * charge time = distance
  for (
    let winningDistance = distance + 1;
    winningDistance <= maxRange;
    winningDistance++
  ) {
    // when solving quadratics, we find the discriminant
    const discriminant = Math.pow(time, 2) - 4 * winningDistance
    // we have two real solutions if positive
    if (discriminant > 0) {
      const firstOption = (time + Math.sqrt(discriminant)) / 2
      const secondOption = (time - Math.sqrt(discriminant)) / 2

      // our total range of wins is the difference between first and second options
      if (Number.isInteger(firstOption) && Number.isInteger(secondOption)) {
        wins = firstOption - secondOption + 1
        break
      }
    }
  }
  return wins
}

if (Bun.env.debug === 'true') {
  async function debug() {
    const input = await readInput({
      day: 'day06',
      //inputFilePath: join(MOCKS_DIR, "input.part1.example.txt"),
      //inputFilePath: join(MOCKS_DIR, "input.part2.example.txt"),
      year: 2023,
    })
    part1(input)
    part2(input)
  }
  debug()
}
