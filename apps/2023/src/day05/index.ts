import { getSeedMappings } from './utils/getSeedMappings.js'
import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput?.split('\n').filter(Boolean)

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

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const seeds = input
		.shift()
		?.replace('seeds: ', '')
		.split(' ')
		.map((seed) => parseInt(seed, 10))
	const mappings: {
		[key: string]: SeedMap[]
	} = getSeedMappings({ input })

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

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	// First we grab the seed list from input and generate the possible ranges (start and end)
	const seedRanges = input
		.shift()
		?.replace('seeds: ', '')
		.split(' ')
		.map((seed, idx, seeds) => {
			if (idx % 2 === 0) {
				return {
					sourceStart: parseInt(seed, 10),
					sourceEnd: parseInt(seed, 10) + parseInt(seeds[idx + 1], 10) - 1,
					length: parseInt(seeds[idx + 1], 10),
				}
			}
		})
		.filter((seed): seed is SeedType => Boolean(seed))

	// Next we generate the mappings from the almanac with ranges too (source + destination start and end)
	const mappings: MappingsType = getSeedMappings({ input })

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

run({
	part1: {
		tests: [
			{
				input: `
          seeds: 79 14 55 13

          seed-to-soil map:
          50 98 2
          52 50 48

          soil-to-fertilizer map:
          0 15 37
          37 52 2
          39 0 15

          fertilizer-to-water map:
          49 53 8
          0 11 42
          42 0 7
          57 7 4

          water-to-light map:
          88 18 7
          18 25 70

          light-to-temperature map:
          45 77 23
          81 45 19
          68 64 13

          temperature-to-humidity map:
          0 69 1
          1 0 69

          humidity-to-location map:
          60 56 37
          56 93 4
        `,
				expected: 35,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `
          seeds: 79 14 55 13

          seed-to-soil map:
          50 98 2
          52 50 48

          soil-to-fertilizer map:
          0 15 37
          37 52 2
          39 0 15

          fertilizer-to-water map:
          49 53 8
          0 11 42
          42 0 7
          57 7 4

          water-to-light map:
          88 18 7
          18 25 70

          light-to-temperature map:
          45 77 23
          81 45 19
          68 64 13

          temperature-to-humidity map:
          0 69 1
          1 0 69

          humidity-to-location map:
          60 56 37
          56 93 4
        `,
				expected: 46,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
