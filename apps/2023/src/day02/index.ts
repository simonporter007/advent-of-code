import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput?.split('\n')

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput)
  let eligibleGames = 0
  const maxCubes = {
    red: 12,
    green: 13,
    blue: 14,
  }
  for (const line of input) {
    const [gameId, cubes] = line.replace('Game ', '').split(':')
    const matches = cubes.matchAll(new RegExp(/(?<count>\d+) (?<colour>\w+)/g))

    const isEligibleGame = Array.from(matches)?.every((match) => {
      return (
        match?.groups?.count &&
        match?.groups?.colour &&
        match?.groups?.count <= maxCubes[match?.groups?.colour]
      )
    })

    eligibleGames += isEligibleGame ? parseInt(gameId, 10) : 0
  }

  return eligibleGames
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput)
  let powerOfGames = 0

  for (const line of input) {
    const [, cubes] = line.replace('Game ', '').split(':')
    const matches = cubes.matchAll(new RegExp(/(?<count>\d+) (?<colour>\w+)/g))
    const maxCubes = {
      red: 0,
      blue: 0,
      green: 0,
    }

    Array.from(matches)?.forEach((match) => {
      if (
        match?.groups?.count &&
        match?.groups?.colour &&
        match?.groups?.count > maxCubes[match?.groups?.colour]
      ) {
        maxCubes[match?.groups?.colour] = parseInt(match?.groups?.count, 10)
      }
    })

    powerOfGames += maxCubes.red * maxCubes.blue * maxCubes.green
  }
  return powerOfGames
}

run({
  part1: {
    tests: [
      {
        input: `
          Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
          Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
          Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
          Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
          Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
        `,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
          Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
          Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
          Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
          Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
          Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
        `,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
