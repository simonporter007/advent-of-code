import { calculateLCM } from '@simonporter007/utils'
import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput?.split('\n').filter(Boolean)

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const inputDirections = input.shift()
	const nodes: Map<string, [string, string]> = new Map()
	let steps = 0
	// start from AAA, spent far too long on first line of input, :facepalm:
	let currentNode = 'AAA'

	// map our input into a Map for easy lookup
	for (const nodeLine of input) {
		const [node, mappings] = nodeLine.split(' = ')
		const [left, right] = mappings.match(/(\w){3}/g) || []
		if (left && right) {
			nodes.set(node, [left, right])
		}
	}

	// start looping over our data following the trail Left or Right based on directions
	while (currentNode !== 'ZZZ') {
		let path = inputDirections?.split('')
		// nested while loop so that we re-start path from the beginning when it reaches the end
		while (path?.length) {
			const dir = path.shift() === 'L' ? 0 : 1
			currentNode = nodes?.get(currentNode)![dir]
			// while loop breaks and ends when we find our target, 'ZZZ'
			if (currentNode === 'ZZZ') {
				steps += 1
				break
			}
			steps += 1
		}
	}

	return steps
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const inputDirections = input.shift()
	const nodes: Map<string, [string, string]> = new Map()

	// map our input into a Map for easy lookup
	for (const nodeLine of input) {
		const [node, mappings] = nodeLine.split(' = ')
		const [left, right] = mappings.match(/(\w){3}/g) || []
		if (left && right) {
			nodes.set(node, [left, right])
		}
	}

	// Filter our map to pull out all nodes that end with 'A'
	let aNodes = [...nodes.entries()]
		.filter(([key]) => key.endsWith('A'))
		.map((node) => node[0])

	// Run each answer through separately to work out how many steps each one would take
	const answers = aNodes.map((node) => {
		let steps = 0
		while (!node.endsWith('Z')) {
			let path = inputDirections?.split('')
			while (path?.length) {
				const dir = path?.shift() === 'L' ? 0 : 1
				node = nodes?.get(node)![dir]
				if (node.endsWith('Z')) {
					steps += 1
					break
				}
				steps += 1
			}
		}
		return steps
	})

	// Once we have all the steps for each node, we need to find where they cross
	// which is the least common multiple of all numbers
	return calculateLCM({ numbers: answers })
}

run({
	part1: {
		tests: [
			{
				input: `
			    RL
			    AAA = (BBB, CCC)
			    BBB = (DDD, EEE)
			    CCC = (ZZZ, GGG)
			    DDD = (DDD, DDD)
			    EEE = (EEE, EEE)
			    GGG = (GGG, GGG)
			    ZZZ = (ZZZ, ZZZ)
			  `,
				expected: 2,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `
			    LR
			    11A = (11B, XXX)
			    11B = (XXX, 11Z)
			    11Z = (11B, XXX)
			    22A = (22B, XXX)
			    22B = (22C, 22C)
			    22C = (22Z, 22Z)
			    22Z = (22B, 22B)
			    XXX = (XXX, XXX)
			  `,
				expected: 6,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
