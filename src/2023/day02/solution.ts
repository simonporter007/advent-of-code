import { parseLines, readInput } from '@/utils/file-io'

export function part1(input: string) {
  const lines = parseLines(input)
  const maxCubes = {
    blue: 14,
    green: 13,
    red: 12,
  } as const

  let eligibleGames = 0

  for (const line of lines) {
    const [gameId, cubes] = line.replace('Game ', '').split(':')
    const matches = cubes.matchAll(new RegExp(/(?<count>\d+) (?<colour>\w+)/g))

    const isEligibleGame = Array.from(matches)?.every((match) => {
      const { colour, count } = match?.groups as {
        count: string
        colour: keyof typeof maxCubes
      }
      return count && colour && parseInt(count, 10) <= maxCubes[colour]
    })

    eligibleGames += isEligibleGame ? parseInt(gameId, 10) : 0
  }

  return eligibleGames
}

export function part2(input: string) {
  const lines = parseLines(input)

  let powerOfGames = 0

  for (const line of lines) {
    const [, cubes] = line.replace('Game ', '').split(':')
    const matches = cubes.matchAll(new RegExp(/(?<count>\d+) (?<colour>\w+)/g))
    const maxCubes = {
      blue: 0,
      green: 0,
      red: 0,
    }

    Array.from(matches)?.forEach((match) => {
      const { colour, count } = match?.groups as {
        count: string
        colour: keyof typeof maxCubes
      }
      if (count && colour && parseInt(count, 10) > maxCubes[colour]) {
        maxCubes[colour] = parseInt(count, 10)
      }
    })

    powerOfGames += maxCubes.red * maxCubes.blue * maxCubes.green
  }

  return powerOfGames
}

if (Bun.env.debug === 'true') {
  async function debug() {
    const input = await readInput({ day: 'day02', year: 2023 })
    part1(input)
    part2(input)
  }
  debug()
}
