import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput?.split('\n')

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const galaxy: string[][] = []
	let planets: number[][] = []
	const empty: Record<string, number[]> = {
		rows: [],
		cols: [],
	}

	// To start we generate our galaxy, by parsing input line (y) by row (x)
	for (const [y, line] of input.entries()) {
		const x = line.split('')
		galaxy.push(x)
	}

	// We also need to account for empty space columns, so we check each column for empty space
	for (let x = galaxy[0].length - 1; x > 0; x--) {
		let isEmpty = true
		for (let y = 0; y < galaxy.length; y++) {
			const char = galaxy[y][x]
			if (char === '#') {
				// if we find a '.', we know the column isn't empty, so we break
				isEmpty = false
				break
			}
		}

		// Otherwise, we're still empty, so duplicate the column
		if (isEmpty) {
			empty.cols.push(x)
		}
	}

	for (const [y, row] of galaxy.entries()) {
		// we store the row that is empty as well, for later adjustment to the coordinates
		if (row.every((char) => char === '.')) {
			empty.rows.push(y)
		}
		// and we look for planets, and store their location as (x, y)
		planets = [
			...planets,
			...row
				.map((planet, idx) => (planet === '#' ? [idx, y] : undefined))
				?.filter((x): x is number[] => Boolean(x)),
		]
	}

	let total = 0
	for (const [idx, planet] of planets.entries()) {
		for (const [otherIdx, otherPlanet] of planets.entries()) {
			if (idx <= otherIdx) continue

			// we can use the formula Math.abs(x2 - x1) + Math.abs(y2 - y1) to calculate the shortest distance between two points
			// but we need to account for the empty space in the galaxy, so we add the number of empty spaces before each planet
			const [x1, y1] = planet
			const [x2, y2] = otherPlanet
			const emptyColsBeforeX1 = empty.cols.filter((col) => col < x1).length
			const emptyColsBeforeX2 = empty.cols.filter((col) => col < x2).length
			const emptyRowsBeforeY1 = empty.rows.filter((row) => row < y1).length
			const emptyRowsBeforeY2 = empty.rows.filter((row) => row < y2).length
			total +=
				Math.abs(x2 + emptyColsBeforeX2 - (x1 + emptyColsBeforeX1)) +
				Math.abs(y2 + emptyRowsBeforeY2 - (y1 + emptyRowsBeforeY1))
		}
	}

	return total
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const galaxy: string[][] = []
	let planets: number[][] = []
	const empty: Record<string, number[]> = {
		rows: [],
		cols: [],
	}

	// To start we generate our galaxy, by parsing input line (y) by row (x)
	for (const [y, line] of input.entries()) {
		const x = line.split('')
		galaxy.push(x)
	}

	// We also need to account for empty space columns, so we check each column for empty space
	for (let x = galaxy[0].length - 1; x > 0; x--) {
		let isEmpty = true
		for (let y = 0; y < galaxy.length; y++) {
			const char = galaxy[y][x]
			if (char === '#') {
				// if we find a '.', we know the column isn't empty, so we break
				isEmpty = false
				break
			}
		}

		// Otherwise, we're still empty, so duplicate the column
		if (isEmpty) {
			empty.cols.push(x)
		}
	}

	for (const [y, row] of galaxy.entries()) {
		// we store the row that is empty as well, for later adjustment to the coordinates
		if (row.every((char) => char === '.')) {
			empty.rows.push(y)
		}
		// and we look for planets, and store their location as (x, y)
		planets = [
			...planets,
			...row
				.map((planet, idx) => (planet === '#' ? [idx, y] : undefined))
				?.filter((x): x is number[] => Boolean(x)),
		]
	}

	let total = 0
	for (const [idx, planet] of planets.entries()) {
		for (const [otherIdx, otherPlanet] of planets.entries()) {
			if (idx <= otherIdx) continue

			// we can use the formula Math.abs(x2 - x1) + Math.abs(y2 - y1) to calculate the shortest distance between two points
			// but we need to account for the empty space in the galaxy, so we add the number of empty spaces before each planet
			const [x1, y1] = planet
			const [x2, y2] = otherPlanet

			const emptyColsBeforeX1 = empty.cols.filter((col) => col < x1).length
			const emptyColsBeforeX2 = empty.cols.filter((col) => col < x2).length
			const emptyRowsBeforeY1 = empty.rows.filter((row) => row < y1).length
			const emptyRowsBeforeY2 = empty.rows.filter((row) => row < y2).length

			total +=
				Math.abs(
					x2 -
						emptyColsBeforeX2 +
						emptyColsBeforeX2 * 1000000 -
						(x1 - emptyColsBeforeX1 + emptyColsBeforeX1 * 1000000),
				) +
				Math.abs(
					y2 -
						emptyRowsBeforeY2 +
						emptyRowsBeforeY2 * 1000000 -
						(y1 - emptyRowsBeforeY1 + emptyRowsBeforeY1 * 1000000),
				)
		}
	}

	return total
}

run({
	part1: {
		tests: [
			{
				input: `
          ...#......
          .......#..
          #.........
          ..........
          ......#...
          .#........
          .........#
          ..........
          .......#..
          #...#.....
        `,
				expected: 374,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			// {
			// 	input: `
			//     ...#......
			//     .......#..
			//     #.........
			//     ..........
			//     ......#...
			//     .#........
			//     .........#
			//     ..........
			//     .......#..
			//     #...#.....
			//   `,
			// 	expected: 1030,
			// },
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
