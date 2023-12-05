import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput?.split('\n')

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	let result = 0

	for (const line of input) {
		const lineArr = line.split('')
		const goUpCount = lineArr.filter((char) => char === '(').length
		const goDownCount = lineArr.filter((char) => char === ')').length
		result += goUpCount - goDownCount
	}

	return result
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	let total = 0
	let result = 0

	for (const line of input) {
		for (let [idx, direction] of line.split('').entries()) {
			if (direction === '(') {
				total += 1
			} else if (direction === ')') {
				total -= 1
			}
			if (total === -1) {
				result = idx + 1
				break
			}
		}
	}

	return result
}

run({
	part1: {
		tests: [
			{
				input: `(())`,
				expected: 0,
			},
			{
				input: `(((`,
				expected: 3,
			},
			{
				input: `(()(()(`,
				expected: 3,
			},
			{
				input: `))(((((`,
				expected: 3,
			},
			{
				input: `())`,
				expected: -1,
			},
			{
				input: `))(`,
				expected: -1,
			},
			{
				input: `)))`,
				expected: -3,
			},
			{
				input: `)())())`,
				expected: -3,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `)`,
				expected: 1,
			},
			{
				input: `()())`,
				expected: 5,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
