import { getCoords, Directions } from './utils/getCoords.js'
import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput?.split('\n')

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const startingCoords = JSON.stringify([0, 0])
	let coords = [0, 0]
	let result = 0

	for (const line of input) {
		const directions = line.split('').map((direction) => {
			const newCoords = getCoords({
				direction: direction as Directions,
				coords,
			})
			coords = newCoords
			return newCoords
		})

		result = new Set([
			startingCoords,
			...directions.map((dir) => JSON.stringify(dir)),
		])?.size
	}

	return result
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const startingCoords = JSON.stringify([0, 0])
	const coords = {
		santa: [0, 0],
		robo: [0, 0],
	}
	let deliverer = 'santa'
	let result = 0

	for (const line of input) {
		const directions = `${line}`.split('').map((direction) => {
			const currentDeliverer = deliverer
			const newCoords = getCoords({
				direction: direction as Directions,
				coords: coords[deliverer],
			})
			coords[currentDeliverer] = newCoords
			deliverer = deliverer === 'santa' ? 'robo' : 'santa'
			return { deliverer: currentDeliverer, newCoords }
		})

		result = new Set([
			startingCoords,
			...directions
				.filter((direction) => direction?.deliverer === 'santa')
				.map((dir) => JSON.stringify(dir.newCoords)),
			...directions
				.filter((direction) => direction?.deliverer === 'robo')
				.map((dir) => JSON.stringify(dir.newCoords)),
		])?.size
	}

	return result
}

run({
	part1: {
		tests: [
			{
				input: `>`,
				expected: 2,
			},
			{
				input: `^>v<`,
				expected: 4,
			},
			{
				input: `^v^v^v^v^v`,
				expected: 2,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `^v`,
				expected: 3,
			},
			{
				input: `^>v<`,
				expected: 3,
			},
			{
				input: `^v^v^v^v^v`,
				expected: 11,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
