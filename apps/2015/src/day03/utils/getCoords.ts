export type Directions = '^' | '>' | 'v' | '<'

export function getCoords({
	direction,
	coords,
}: {
	direction: Directions
	coords: number[]
}) {
	const [x, y] = coords
	switch (direction) {
		case '^':
			return [x, y + 1]
		case '>':
			return [x + 1, y]
		case 'v':
			return [x, y - 1]
		case '<':
			return [x - 1, y]
		default:
			throw new Error('Invalid direction')
	}
}
