export function getSeedMappings({ input }: { input: string[] }) {
	const mappings = {}
	let currentLookup = ''

	for (const line of input) {
		const mapTypeMatch = line.match(/^(?<typeOfMap>[a-z-]+)/)?.groups?.typeOfMap
		if (mapTypeMatch) {
			// starts with a letter, must be a map list
			currentLookup = mapTypeMatch
			mappings[currentLookup] = []
		} else {
			// otherwise must be a row of ids to parse for the current lookup
			const [destination, source, length] = line?.split(/\s+/)
			mappings[currentLookup].push({
				destinationStart: parseInt(destination, 10),
				destinationEnd: parseInt(destination, 10) + parseInt(length, 10) - 1,
				sourceStart: parseInt(source, 10),
				sourceEnd: parseInt(source, 10) + parseInt(length, 10) - 1,
				length: parseInt(length, 10),
			})
		}
	}

	return mappings
}
