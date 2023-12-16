import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput?.split('\n')

type Pipe = '|' | '-' | 'L' | 'J' | '7' | 'F' | '.' | 'S' | '*' | '$' | 'I'

// We check if the given pipe has a valid connecting pipe in matching cardinal spots
function checkIsConnectingPipe({
	start,
	pipe,
	pipeValue,
}: {
	start: number[]
	pipe?: number[]
	pipeValue?: Pipe
}) {
	if (!pipe) return false

	const [pipeX, pipeY] = pipe
	const [startX, startY] = start

	if (pipeValue === '.') return false
	if (pipeValue === '-' && (pipeX === startX + 1 || pipeX === startX - 1)) {
		// connects east and west (x)
		return true
	}
	if (pipeValue === '|' && (pipeY - 1 === startY || pipeY + 1 === startY)) {
		// connects north and south (y)
		return true
	}
	if (pipeValue === 'L' && (pipeY - 1 === startY || pipeX + 1 === startX)) {
		// connects from north and east (y) and (x)
		return true
	}
	if (pipeValue === 'J' && (pipeY - 1 === startY || pipeX - 1 === startX)) {
		// connects from north and west (y) and (x)
		return true
	}
	if (pipeValue === '7' && (pipeY + 1 === startY || pipeX - 1 === startX)) {
		// connects from south and west (y) and (x)
		return true
	}
	if (pipeValue === 'F' && (pipeY + 1 === startY || pipeX + 1 === startX)) {
		// connects from south and east (y) and (x)
		return true
	}
}

// Depending on the found pipe, we get the next direction it will connect to and return that pipe to continue the loop
function getNextConnectingPipe({
	connectedPipe,
	prevPipe,
	pipeValue,
}: {
	connectedPipe: number[]
	prevPipe: number[]
	pipeValue: Pipe
}) {
	const [connectedPipeX, connectedPipeY] = connectedPipe
	const [prevPipeX, prevPipeY] = prevPipe
	let next: number[] = []
	if (pipeValue === '|') {
		next =
			connectedPipeY - 1 === prevPipeY
				? [connectedPipeX, connectedPipeY + 1]
				: [connectedPipeX, connectedPipeY - 1]
	} else if (pipeValue === '-') {
		next =
			connectedPipeX - 1 === prevPipeX
				? [connectedPipeX + 1, connectedPipeY]
				: [connectedPipeX - 1, connectedPipeY]
	} else if (pipeValue === 'L') {
		next =
			connectedPipeX + 1 === prevPipeX
				? [connectedPipeX, connectedPipeY - 1]
				: [connectedPipeX + 1, connectedPipeY]
	} else if (pipeValue === 'J') {
		next =
			connectedPipeX - 1 === prevPipeX
				? [connectedPipeX, connectedPipeY - 1]
				: [connectedPipeX - 1, connectedPipeY]
	} else if (pipeValue === '7') {
		next =
			connectedPipeX - 1 === prevPipeX
				? [connectedPipeX, connectedPipeY + 1]
				: [connectedPipeX - 1, connectedPipeY]
	} else if (pipeValue === 'F') {
		next =
			connectedPipeX + 1 === prevPipeX
				? [connectedPipeX, connectedPipeY + 1]
				: [connectedPipeX + 1, connectedPipeY]
	}

	return next
}

// Given a pipe, this returns all pipes surrounding it in the cardinal directions
function getSurroundingPipes({
	start,
	xLength,
	yLength,
}: {
	start: number[]
	xLength: number
	yLength: number
}) {
	const [x, y] = start

	const north = y === 0 ? undefined : [x, y - 1]
	const east = x === xLength - 1 ? undefined : [x + 1, y]
	const south = y === yLength - 1 ? undefined : [x, y + 1]
	const west = x === 0 ? undefined : [x - 1, y]

	return [north, south, east, west].filter((val): val is number[] =>
		Boolean(val),
	)
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const grid: Pipe[][] = []
	const connectingPipes: number[][] = []
	let start = [0, 0]

	// To start we generate our grid, and store the starting location
	for (const [y, line] of input.entries()) {
		const x = line.split('') as Pipe[]
		const sLocation = x.findIndex((pipe) => pipe === 'S')
		if (sLocation !== -1) {
			start = [sLocation, y]
		}
		grid.push(x)
	}

	// We start looking at the pipes surrounding the start location, and check if it connects to our starting pipe
	// If it does, we record that location and break at the first match, this gives us our starting direction to follow
	for (const pipe of getSurroundingPipes({
		start,
		xLength: grid[0]?.length,
		yLength: grid?.length,
	})) {
		if (
			checkIsConnectingPipe({
				start,
				pipe,
				pipeValue: grid[pipe[1]][pipe[0]],
			})
		) {
			connectingPipes.push(pipe)
			break
		}
	}

	// We then loop over the connecting pipe, following the direction it leads to, until we eventually reach the start again
	let pipeValue: Pipe | undefined
	while (pipeValue !== 'S') {
		const connectedPipe = connectingPipes[connectingPipes?.length - 1]
		pipeValue = grid[connectedPipe[1]][connectedPipe[0]]
		const next = getNextConnectingPipe({
			connectedPipe: connectedPipe,
			prevPipe:
				connectingPipes?.length === 1
					? start
					: connectingPipes[connectingPipes?.length - 2],
			pipeValue,
		})
		connectingPipes.push(next)
	}

	// Now that we have the full loop, we can find the furthest  pipe from the start by halfing the full length of the pipe
	return connectingPipes.filter((pipe) => pipe.length).length / 2
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const grid: Pipe[][] = []
	const connectingPipes: number[][] = []
	let start = [0, 0]

	// We repeat the process as in part1, generating our grid and finding our pipe loop
	for (const [y, line] of input.entries()) {
		const x = line.split('') as Pipe[]
		const sLocation = x.findIndex((pipe) => pipe === 'S')
		if (sLocation !== -1) {
			start = [sLocation, y]
		}
		grid.push(x)
	}

	for (const pipe of getSurroundingPipes({
		start,
		xLength: grid[0]?.length,
		yLength: grid?.length,
	})) {
		if (
			checkIsConnectingPipe({
				start,
				pipe,
				pipeValue: grid[pipe[1]][pipe[0]],
			})
		) {
			connectingPipes.push(pipe)
			break
		}
	}

	let pipeValue: Pipe | undefined
	while (pipeValue !== 'S') {
		const connectedPipe = connectingPipes[connectingPipes?.length - 1]
		pipeValue = grid[connectedPipe[1]][connectedPipe[0]]
		const next = getNextConnectingPipe({
			connectedPipe: connectedPipe,
			prevPipe:
				connectingPipes?.length === 1
					? start
					: connectingPipes[connectingPipes?.length - 2],
			pipeValue,
		})
		connectingPipes.push(next)
	}

	// This time, we add a ridiculous brute force to catch edge cases, we attack the pipe loop from the outer perimeter, changing all junk pipes into a generic symbols for skipping over
	// When we then look for inner pipes, if we see the generic symbol, we know it HAS to be outside the loop.
	for (let y = 0; y < grid.length; y++) {
		for (let x = 0; x < grid[0].length; x++) {
			// Attack from left to right
			if (grid[y][x] === '$') continue
			if (connectingPipes.find((pipe) => pipe[0] === x && pipe[1] === y)) break
			grid[y][x] = '$'
		}
	}
	for (let y = 0; y < grid.length; y++) {
		for (let x = grid[0].length - 1; x > 0; x--) {
			// Attack from right to left
			if (grid[y][x] === '$') continue
			if (connectingPipes.find((pipe) => pipe[0] === x && pipe[1] === y)) break
			grid[y][x] = '$'
		}
	}
	for (let x = 0; x < grid.length; x++) {
		for (let y = 0; y < grid.length; y++) {
			// Attack from top to bottom
			if (grid[y][x] === '$') continue
			if (connectingPipes.find((pipe) => pipe[0] === x && pipe[1] === y)) break
			grid[y][x] = '$'
		}
	}
	for (let x = 0; x < grid[0].length; x++) {
		for (let y = grid.length - 1; y > 0; y--) {
			// Attack from bottom to top
			if (grid[y][x] === '$') continue
			if (connectingPipes.find((pipe) => pipe[0] === x && pipe[1] === y)) break
			grid[y][x] = '$'
		}
	}

	// We now have our completely outside pipes removed, we can use the scanline formula to find all inner pipes
	let totalPipes = 0
	for (const [y, row] of grid.entries()) {
		let inRegion = false
		let corner = ''
		if (y === 0 || y === grid.length) continue
		for (const [x, pipe] of row.entries()) {
			// Try to speed up by skipping over pipes we know are not part of the loop
			if (pipe === '$' || pipe === 'S') continue
			if (connectingPipes.find((pipe) => pipe[0] === x && pipe[1] === y)) {
				// We found a connected pipe, so we need to decide if we're switching to an IN region, or if it's OUT side the loop
				const isCorner = ['7', 'F', 'J', 'L'].includes(pipe)
				if (isCorner) {
					// Corners require special handling, as they could generate a U shape loop which wouldn't alter the current loop state (IN or OUT)
					if (
						(corner === 'F' && pipe === '7') ||
						(corner === 'L' && pipe === 'J')
					) {
						// U shapes, don't change state, reset corner and watch for next
						corner = ''
					} else if (
						(corner === 'L' && pipe === '7') ||
						(corner === 'F' && pipe === 'J')
					) {
						// Non U shapes, change state, reset corner and watch for next
						corner = ''
						inRegion = !inRegion
					} else {
						corner = pipe
					}
				} else if (!corner) {
					// found a connected pipe, but if we have a corner, it must be a connecting pipe between corners
					// only change state if we don't have a previous corner
					inRegion = !inRegion
				}
				continue
			}

			// We therefore found a pipe that is not connected, so we need to decide if it's IN or OUT based on our current state
			if (inRegion) {
				grid[y][x] = 'I'
				totalPipes++
			}
		}
	}

	return totalPipes
}

run({
	part1: {
		tests: [
			{
				input: `
					.....
					.S-7.
					.|.|.
					.L-J.
					.....
				`,
				expected: 4,
			},
			{
				input: `
					..F7.
					.FJ|.
					SJ.L7
					|F--J
					LJ...
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
					FF7FSF7F7F7F7F7F---7
					L|LJ||||||||||||F--J
					FL-7LJLJ||||||LJL-77
					F--JF--7||LJLJ7F7FJ-
					L---JF-JLJ.||-FJLJJ7
					|F|F-JF---7F7-L7L|7|
					|FFJF7L7F-JF7|JL---7
					7-L-JL7||F7|L7F-7F7|
					L.L7LFJ|||||FJL7||LJ
					L7JLJL-JLJLJL--JLJ.L
				`,
				expected: 10,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
