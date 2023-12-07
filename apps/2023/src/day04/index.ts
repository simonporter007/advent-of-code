import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput?.split('\n')

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	let result = 0

	for (const line of input) {
		const [, numbers] = line.replace('Card ', '').split(':')
		const [myNumbers, winningNumbers] = numbers
			?.split(' | ')
			.map((set) => set.trim().split(/\s{1,}/))
			.filter(Boolean)
		const totalUniqueNumbers = new Set([...myNumbers, ...winningNumbers])?.size
		const uniqueNumbers =
			myNumbers?.length + winningNumbers?.length - totalUniqueNumbers

		result += Boolean(uniqueNumbers)
			? uniqueNumbers === 1
				? 1
				: Math.pow(2, uniqueNumbers) / 2
			: 0
	}

	return result
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	let result = 0
	const cards: Record<number, number> = {}

	for (const line of input) {
		// parse the card ID and numbers
		const [cardId, numbers] = line.replace(/Card\s+/, '').split(':')
		const id = parseInt(cardId, 10)
		// increase our totals as we always have one of the card
		cards[id] = cards?.[id] ? cards?.[id] + 1 : 1

		// split out the card numbers, and the winning numbers
		const [myNumbers, winningNumbers] = numbers
			?.split(' | ')
			.map((set) => set.trim().split(/\s{1,}/))
			.filter(Boolean)

		// find the unique numbers between sets, if equal then no win, if some are duplicates, then card is a winner
		const totalUniqueNumbers = new Set([...myNumbers, ...winningNumbers])?.size
		const winningCards =
			myNumbers?.length + winningNumbers?.length - totalUniqueNumbers

		// if we have winning cards, we need to increase the copies of cards as well as for existing copies too
		if (winningCards > 0) {
			const existingCards = cards?.[id]
			for (let x = 0; x < existingCards; x++) {
				for (let i = 1; i <= winningCards; i++) {
					cards[id + i] = cards?.[id + i] ? cards?.[id + i] + 1 : 1
				}
			}
		}
	}

	// calculate our final total of cards + copies of cards
	Object.values(cards).forEach((total) => (result += total))

	return result
}

run({
	part1: {
		tests: [
			{
				input: `
          Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
          Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
          Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
          Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
          Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
          Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
        `,
				expected: 13,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `
          Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
          Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
          Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
          Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
          Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
          Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
        `,
				expected: 30,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
