import run from 'aocrunner'
import { checkLine } from './utils/checkLine.js'
import { getRowNumbers } from './utils/getRowNumbers.js'
import { arrayRange } from '@simonporter007/utils'

const parseInput = (rawInput: string) => rawInput?.split('\n')

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	let lastLine = ''
	let midLine = ''
	let topLine = ''
	let validNumbers = 0
	let i = 0

	do {
		lastLine = input?.[i]
		// Just starting, copy the row and move on
		if (!midLine) {
			midLine = lastLine
			continue
		}

		const topLineArr = topLine ? `${topLine}`.split('') : undefined
		const midLineArr = `${midLine}`.split('')
		const lastLineArr = lastLine ? `${lastLine}`.split('') : undefined

		validNumbers += checkLine({
			topLine: topLineArr,
			midLine: midLineArr,
			lastLine: lastLineArr,
		})

		// move the lines up
		topLine = midLine
		midLine = lastLine
		i++
	} while (lastLine)

	return validNumbers
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	let lastLine = ''
	let midLine = ''
	let topLine = ''
	let validNumbers = 0
	let i = 0

	do {
		lastLine = input?.[i]
		// Just starting, copy the row and move on
		if (!midLine) {
			midLine = lastLine
			continue
		}

		const topLineArr = topLine?.split('')
		const midLineArr = midLine?.split('')
		const lastLineArr = lastLine?.split('')

		midLineArr.forEach((char, idx) => {
			if (char === '*') {
				// we match a gear, so we find numbers on all rows
				const topLineNumbers = getRowNumbers({ array: topLineArr })
				const midLineNumbers = getRowNumbers({ array: midLineArr })
				const lastLineNumbers = getRowNumbers({ array: lastLineArr })

				// then we work out the indexes that are touching the gear for validation
				const minIdx = Math.max(idx - 1, 0)
				const maxIdx = Math.min(idx + 1, midLineArr?.length - 1)
				const linkedNumbers: number[] = []

				// then we loop over each number of our rows, and if they are in a valid range, they count towards the gear
				;[
					...(topLineNumbers || []),
					...(midLineNumbers || []),
					...(lastLineNumbers || []),
				].forEach((match) => {
					if (match) {
						const matchRange = arrayRange({
							start: match?.from,
							stop: match?.to,
						})
						const gearRange = arrayRange({ start: minIdx, stop: maxIdx })
						if (gearRange.some((idx) => matchRange.includes(idx))) {
							linkedNumbers.push(match.number)
						}
					}
				})

				// finally, if there are only two linked numbers, it's valid and included in the sum
				if (linkedNumbers?.length === 2) {
					validNumbers += linkedNumbers[0] * linkedNumbers[1]
				}
			}
		})

		// move the lines up
		topLine = midLine
		midLine = lastLine
		i++
	} while (lastLine)

	return validNumbers
}

run({
	part1: {
		tests: [
			{
				input: `
					467..114..
					...*......
					..35..633.
					......#...
					617*......
					.....+.58.
					..592.....
					......755.
					...$.*....
					.664.598..
				`,
				expected: 4361,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `
					467..114..
					...*......
					..35..633.
					......#...
					617*......
					.....+.58.
					..592.....
					......755.
					...$.*....
					.664.598..
			  	`,
				expected: 467835,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
