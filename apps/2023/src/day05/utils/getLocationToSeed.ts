import { MappingsType } from '../index.js'

export function getLocationToSeed({
	location,
	mappings,
}: {
	location: number
	mappings: MappingsType
}) {
	let seed = location

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
}
