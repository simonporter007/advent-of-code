// Needed some help with this one from reddit, solved part 1 but without memoize, there's no hope for part 2!
import { memoize } from '@simonporter007/utils'
import { sum } from '@simonporter007/utils'
import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput?.split('\n')

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	let total = 0

	for (const line of input) {
		// We grab our record and the groups from the line
		const [record, groups] = line.split(' ')

		// Here's the magic that gets us to solve part 2, we wrap our possible combination function in memoize
		// This means that if we've already calculated the result for the given input (JSON stringified), we won't do it again
		const possibleCombinations = memoize((line: string, groups: number[]) => {
			// First we check for any early returns. This can be where we've scanned the full line already
			if (line.length === 0) {
				// If we've got this far and there's no more groups left, then we have a match, otherwise we don't
				return groups.length === 0 ? 1 : 0
			}
			if (groups.length === 0) {
				// if we have no groups left but come across another #, then we don't have a match
				return line.includes('#') ? 0 : 1
			}
			if (line.length < sum(groups)) {
				// if the line is shorter than the sum of the groups, then we don't have a match
				return 0
			}

			// While we have a line to process
			while (line) {
				// If the first character is a dot, then we don't need further processing, recursively call with the rest of the line and the groups
				if (line[0] === '.') {
					return possibleCombinations(line.slice(1), groups)
				}

				// If we have a hash, then we need to check if we can match it to our groups
				if (line[0] === '#') {
					// Take the first group from the array, leaving the rest for later, these have to be in order
					const [firstGroup, ...rest] = groups
					if (
						line[firstGroup] === '#' ||
						line.slice(0, firstGroup).includes('.')
					)
						// If the line contains a hash at the index of the first group (which isn't 0 indexed) therefore the first character after the group
						// Or if the line contains a dot before the first group length, then we don't have a match
						return 0

					// Otherwise we have a match and need to carry on with the rest of the line, minus the matching group
					return possibleCombinations(line.slice(firstGroup + 1), rest)
				}

				// Otherwise the only possibility is that we have a question mark, so we need to check both possibilities in case it can be a "." or a "#"
				return (
					possibleCombinations(`#${line.slice(1)}`, groups) +
					possibleCombinations(`.${line.slice(1)}`, groups)
				)
			}
		})
		// Finally we add up the total number of combinations for the given record and groups returned recursively
		total += possibleCombinations(
			record,
			groups.split(',').map((item) => parseInt(item, 10)),
		)
	}

	return total
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	let total = 0

	// For once this is exactly the same as the first function except...
	for (const line of input) {
		const [record, groups] = line.split(' ')
		// we now have to repeat our line 5 times for both the record and the groups
		const actualRecord = `${record}?`.repeat(5).slice(0, -1)
		const actualGroups = `${groups},`
			.repeat(5)
			.slice(0, -1)
			.split(',')
			.map((item) => parseInt(item, 10))

		const possibleCombinations = memoize((line: string, groups: number[]) => {
			if (line.length === 0) {
				return groups.length === 0 ? 1 : 0
			}
			if (groups.length === 0) {
				return line.includes('#') ? 0 : 1
			}
			if (line.length < sum(groups) + groups.length - 1) {
				return 0
			}

			while (line) {
				if (line[0] === '.') {
					return possibleCombinations(line.slice(1), groups)
				}

				if (line[0] === '#') {
					const [firstGroup, ...rest] = groups
					if (
						line[firstGroup] === '#' ||
						line.slice(0, firstGroup).includes('.')
					)
						return 0

					return possibleCombinations(line.slice(firstGroup + 1), rest)
				}

				return (
					possibleCombinations(`#${line.slice(1)}`, groups) +
					possibleCombinations(`.${line.slice(1)}`, groups)
				)
			}
		})
		total += possibleCombinations(actualRecord, actualGroups)
	}

	return total
}

run({
	part1: {
		tests: [
			{
				input: `
          ?###???????? 3,2,1
        `,
				expected: 10,
			},
			{
				input: `
			    ???.### 1,1,3
			    .??..??...?##. 1,1,3
			    ?#?#?#?#?#?#?#? 1,3,1,6
			    ????.#...#... 4,1,1
			    ????.######..#####. 1,6,5
			    ?###???????? 3,2,1
			  `,
				expected: 21,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `
			    ???.### 1,1,3
			    .??..??...?##. 1,1,3
			    ?#?#?#?#?#?#?#? 1,3,1,6
			    ????.#...#... 4,1,1
			    ????.######..#####. 1,6,5
			    ?###???????? 3,2,1
			  `,
				expected: 525152,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
