import run from 'aocrunner'
import { Md5 } from 'ts-md5'

const parseInput = (rawInput: string) => rawInput?.split('\n')

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	let result = 0

	for (const line of input) {
		let md5Hash = ''
		let i = 0
		while (!md5Hash.startsWith('00000')) {
			md5Hash = Md5.hashStr(`${line}${++i}`)
		}
		result = i
	}

	return result
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	let result = 0

	for (const line of input) {
		let md5Hash = ''
		let i = 0
		while (!md5Hash.startsWith('000000')) {
			md5Hash = Md5.hashStr(`${line}${++i}`)
		}
		result = i
	}

	return result
}

run({
	part1: {
		tests: [
			{
				input: `abcdef`,
				expected: 609043,
			},
			{
				input: `pqrstuv`,
				expected: 1048970,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			// {
			//   input: ``,
			//   expected: "",
			// },
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
