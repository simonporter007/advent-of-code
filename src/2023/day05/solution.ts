import { join } from 'node:path'
import { MOCKS_DIR } from '@/constants'
import { parseLines, readInput } from '@/utils/file-io'

export type MappingsType = {
  [key: string]: SeedMap[]
}
export type SeedType = {
  sourceStart: number
  sourceEnd: number
  length: number
}
export type SeedMap = {
  destinationStart: number
  destinationEnd: number
} & SeedType

function getSeedMappings({ input }: { input: string[] }) {
  const mappings: Record<string, SeedMap[]> = {}
  let currentLookup = ''

  for (const line of input) {
    const mapTypeMatch = line.match(/^(?<typeOfMap>[a-z-]+)/)?.groups?.typeOfMap
    if (mapTypeMatch) {
      // starts with a letter, must be a map list
      currentLookup = mapTypeMatch
      mappings[currentLookup] = []
    } else {
      // otherwise must be a row of ids to parse for the current lookup
      const [destination, source, length] = line.split(/\s+/)
      mappings[currentLookup].push({
        destinationEnd: parseInt(destination, 10) + parseInt(length, 10) - 1,
        destinationStart: parseInt(destination, 10),
        length: parseInt(length, 10),
        sourceEnd: parseInt(source, 10) + parseInt(length, 10) - 1,
        sourceStart: parseInt(source, 10),
      })
    }
  }

  return mappings
}

export function part1(input: string) {
  const lines = parseLines(input)
  const seeds = lines
    .filter(Boolean)
    .shift()
    ?.replace('seeds: ', '')
    .split(' ')
    .map((seed) => parseInt(seed, 10))
  const mappings: {
    [key: string]: SeedMap[]
  } = getSeedMappings({ input: lines })

  const seedLocations = seeds?.map((seed) => {
    // start looking up the seed in almanac
    let currMappedId = seed
    Object.values(mappings).forEach((maps) => {
      for (const map of maps) {
        // if the given seed number fits within source range, find linked source number for next lookups
        if (currMappedId >= map.sourceStart && currMappedId <= map.sourceEnd) {
          currMappedId =
            (map.destinationStart || 0) + (currMappedId - map.sourceStart)
          break
        }
      }
    })
    return currMappedId
  })

  // find the lowest location to return
  return seedLocations?.sort()?.shift()
}

export function part2(input: string) {
  const lines = parseLines(input).filter((line) => Boolean(line))
  const seedRanges = lines
    .shift()
    ?.replace('seeds: ', '')
    .split(' ')
    .map((seed, idx, seeds) => {
      if (idx % 2 === 0) {
        return {
          length: parseInt(seeds[idx + 1], 10),
          sourceEnd: parseInt(seed, 10) + parseInt(seeds[idx + 1], 10) - 1,
          sourceStart: parseInt(seed, 10),
        }
      }
    })
    .filter((seed): seed is SeedType => Boolean(seed))

  if (!seedRanges) {
    throw new Error('Seed range parsing failed!')
  }

  // Next we generate the mappings from the almanac with ranges too (source + destination start and end)
  const mappings: MappingsType = getSeedMappings({ input: lines })
  const splitSeedRanges: SeedMap[] = []
  for (const seed of seedRanges) {
    for (const maps of Object.values(mappings)) {
      for (const seedMap of maps) {
        // if completely outside, skip
        // if the whole range fits inside, we can skip to next one
        if (
          (seed.sourceStart >= seedMap.sourceStart &&
            seed.sourceEnd <= seedMap.sourceEnd) ||
          seed.sourceEnd < seedMap.sourceStart ||
          seed.sourceStart > seedMap.sourceEnd
        )
          continue

        const start = Math.max(seed.sourceStart, seedMap.sourceStart)
        const end = Math.min(seed.sourceEnd, seedMap.sourceEnd)
        splitSeedRanges.push({
          destinationEnd: end + (seed.sourceStart - seedMap.destinationEnd),
          destinationStart:
            start + (seed.sourceStart - seedMap.destinationStart),
          length: end - start,
          sourceEnd: end,
          sourceStart: start,
        })

        // split over left side of range
        if (start - seed.sourceStart > 0) {
          const overlapStart = seedMap.sourceStart
          const overlapEnd = start
          splitSeedRanges.push({
            destinationEnd:
              overlapEnd + (seed.sourceStart - seedMap.destinationEnd),
            destinationStart:
              overlapStart + (seed.sourceStart - seedMap.destinationStart),
            length: overlapEnd - overlapStart,
            sourceEnd: overlapEnd,
            sourceStart: overlapStart,
          })
          // split over right side of range
        } else if (seed.sourceEnd - end > 0) {
          const overlapStart = end
          const overlapEnd = seed.sourceEnd
          splitSeedRanges.push({
            destinationEnd:
              overlapEnd + (seed.sourceStart - seedMap.destinationEnd),
            destinationStart:
              overlapStart + (seed.sourceStart - seedMap.destinationStart),
            length: overlapEnd - overlapStart,
            sourceEnd: overlapEnd,
            sourceStart: overlapStart,
          })
        }
      }
    }
  }

  // With seed ranges and mapping ranges, we work backwards using starting location 0
  let lowestLocation = 0

  while (true) {
    // work through the mapping starting from location > ... > seed number
    let seed = lowestLocation

    Object.values(mappings)
      ?.reverse()
      ?.forEach((maps) => {
        // within each map (e.g. location-to-humidity) search for a location match (destination)
        for (const map of maps) {
          const isInRange =
            seed >= map.destinationStart && seed <= map.destinationEnd

          // if it's not in range, skip to next possible map within same map type
          if (!isInRange) continue

          // otherwise we've found a match, work the seed backwards by adding the offset (diff between start and destination)
          // break out to move to next map type
          seed = seed + (map.sourceStart - map.destinationStart)
          break
        }
      })

    // Check the seed ranges to see if the location > seed exists, first match is therefore lowest location possible
    if (
      seedRanges?.some(
        (map) => seed >= map.sourceStart && seed <= map.sourceEnd,
      )
    ) {
      break
    }

    // keep going otherwise
    lowestLocation++
  }

  return lowestLocation
}

if (Bun.env.debug === 'true') {
  async function debug() {
    const input = await readInput({
      day: 'day05',
      inputFilePath: join(MOCKS_DIR, 'input.part2.example.txt'),
      year: 2023,
    })

    // part1(input);
    part2(input)
  }
  debug()
}
