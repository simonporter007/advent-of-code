import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput?.split('\n')

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	let total = 0

	for (const sequence of input) {
		// for each line we split the digits into an array
		const startSeq = sequence.split(' ').map((char) => parseInt(char, 10))
		const midSeqs: number[][] = []
		let differences: number[] = startSeq
		let addition = 0

		// we can then parse the array creating a new array with the differences between each digit in the starting array
		do {
			differences = differences
				.map((num, idx, arr) => {
					if (idx === arr?.length - 1) return
					return arr[idx + 1] - num
				})
				// filtering out any undefined from the new array
				.filter((num): num is number => typeof num !== 'undefined')
			midSeqs.push(differences)
			// we do this until the new array contains all zeros
		} while (!differences.every((num) => num === 0))

		// with the collection of arrays, we parse them in reverse, starting from 0, and add together the last element
		for (const differences of midSeqs.reverse()) {
			addition += differences[differences?.length - 1]
		}

		// this final last element gives us what the extrapolated new element should be, summed for our total
		total += addition + startSeq[startSeq?.length - 1]
	}

	return total
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	let total = 0

	for (const sequence of input) {
		// for each line we split the digits into an array
		const startSeq = sequence.split(' ').map((char) => parseInt(char, 10))
		const midSeqs: number[][] = []
		let differences: number[] = startSeq

		// We map over the arrays, working out the 0 length array again and storing the differences
		do {
			differences = differences
				.map((num, idx, arr) => {
					if (idx === arr?.length - 1) return
					return arr[idx + 1] - num
				})
				.filter((num): num is number => typeof num !== 'undefined')
			midSeqs.push(differences)
		} while (!differences.every((num) => num === 0))

		// this time we are extrapolating the first number, which requires (firstElement - x = prevFirstElement)
		// Otherwise rewritten as x = firstElement - prevFirstElement
		let lastNum = 0
		for (const differences of midSeqs.reverse()) {
			lastNum = differences[0] - lastNum
		}

		// Once we have our final last element, we can use this to work out the first row extrapolated number and add to our sum
		total += startSeq[0] - lastNum
	}

	return total
}

run({
	part1: {
		tests: [
			{
				input: `
					0 3 6 9 12 15
					1 3 6 10 15 21
					10 13 16 21 30 45
                `,
				expected: 114,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `
					0 3 6 9 12 15
					1 3 6 10 15 21
					10 13 16 21 30 45
				`,
				expected: 2,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
