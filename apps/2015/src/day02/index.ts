import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput?.split('\n')

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	let total = 0

	for (const line of input) {
		const [length, width, height] = line
			.split('x')
			.map((num) => parseInt(num, 10))
		const shortestSide = Math.min(
			length * width,
			width * height,
			height * length,
		)
		const ribbonLength =
			2 * length * width +
			2 * width * height +
			2 * height * length +
			shortestSide
		total += ribbonLength
	}

	return total
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	let total = 0

	for (const line of input) {
		const [length, width, height] = line
			.split('x')
			.map((num) => parseInt(num, 10))
		const [shortFace, secondShortFace] = [length, width, height].sort(
			(a, b) => a - b,
		)
		const bowLength = length * width * height
		const ribbonLength = 2 * shortFace + 2 * secondShortFace + bowLength
		total += ribbonLength
	}

	return total
}

run({
	part1: {
		tests: [
			{
				input: `2x3x4`,
				expected: 52,
			},
			{
				input: `1x1x10`,
				expected: 43,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `2x3x4`,
				expected: 34,
			},
			{
				input: `1x1x10`,
				expected: 14,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
