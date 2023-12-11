import run from 'aocrunner'

const parseInput = (rawInput: string) => rawInput?.split('\n')

const RANKS = {
	FIVES: 'FIVE_OF_A_KIND',
	FOURS: 'FOUR_OF_A_KIND',
	FULL_HOUSE: 'FULL_HOUSE',
	THREES: 'THREE_OF_A_KIND',
	TWO_PAIR: 'TWO_PAIR',
	ONE_PAIR: 'ONE_PAIR',
	HIGH_CARD: 'HIGH_CARD',
}

const part1 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const rankings: {
		[key in keyof typeof RANKS]?: Array<[string, number]>
	} = {
		[RANKS.FIVES]: [],
		[RANKS.FOURS]: [],
		[RANKS.FULL_HOUSE]: [],
		[RANKS.THREES]: [],
		[RANKS.TWO_PAIR]: [],
		[RANKS.ONE_PAIR]: [],
		[RANKS.HIGH_CARD]: [],
	}
	const CARD_RANKS = {
		A: 14,
		K: 13,
		Q: 12,
		J: 11,
		T: 10,
	}

	function getCardRankScore(card) {
		return CARD_RANKS[card] || parseInt(card, 10)
	}

	for (const hand of input) {
		const [cards, bid] = hand.split(/\s/)
		const parsedBid = parseInt(bid, 10)
		const uniqueCards = new Set([...cards.split('')])

		if (uniqueCards.size === 1) {
			// Only one unique card returned, must be FIVES
			rankings[RANKS.FIVES].push([cards, parsedBid])
		} else if (uniqueCards.size === 2) {
			// Two unique cards returned, must be FULL_HOUSE or FOURS (e.g. JJJ99 or JJJJ9)
			if (
				cards
					.split('')
					.sort()
					.join('')
					.match(/([AKQJT2-9])\1{3}/)
			) {
				rankings[RANKS.FOURS].push([cards, parsedBid])
			} else {
				rankings[RANKS.FULL_HOUSE].push([cards, parsedBid])
			}
		} else if (uniqueCards.size === 3) {
			// Three unique cards returned, must be THREES or TWO_PAIR (e.g. JJJ98 or JJ998)
			if (
				cards
					.split('')
					.sort()
					.join('')
					.match(/([AKQJT2-9])\1{2}/)
			) {
				rankings[RANKS.THREES].push([cards, parsedBid])
			} else {
				rankings[RANKS.TWO_PAIR].push([cards, parsedBid])
			}
		} else if (uniqueCards.size === 4) {
			// Four unique cards returned, must be ONE_PAIR (e.g. JJ987)
			rankings[RANKS.ONE_PAIR].push([cards, parsedBid])
		} else if (uniqueCards.size === 5) {
			// Five unique cards returned, must be HIGH_CARD (e.g. JT987)
			rankings[RANKS.HIGH_CARD].push([cards, parsedBid])
		}
	}

	let totalBids = 0
	let totalRanks = input.length

	// Rank cards starting from best to worst (e.g. FIVES to HIGH_CARD)
	for (const ranks of Object.values(rankings)) {
		if (ranks.length === 1) {
			const rank = ranks.shift()
			if (rank) {
				// only one hand at this rank, add to total and move on
				const [, bid] = rank
				totalBids += bid * totalRanks
				totalRanks -= 1
			}
		} else {
			// multiple hands have same winning hand, sort by card positions starting from first to last
			ranks.sort((a, b) => {
				if (a[0][0] !== b[0][0])
					return getCardRankScore(b[0][0]) - getCardRankScore(a[0][0])
				else if (a[0][1] !== b[0][1])
					return getCardRankScore(b[0][1]) - getCardRankScore(a[0][1])
				else if (a[0][2] !== b[0][2])
					return getCardRankScore(b[0][2]) - getCardRankScore(a[0][2])
				else if (a[0][3] !== b[0][3])
					return getCardRankScore(b[0][3]) - getCardRankScore(a[0][3])
				else if (a[0][4] !== b[0][4])
					return getCardRankScore(b[0][4]) - getCardRankScore(a[0][4])
				else return 0
			})
			for (const rank of ranks) {
				const [, bid] = rank
				totalBids += bid * totalRanks
				totalRanks -= 1
			}
		}
	}

	return totalBids
}

const part2 = (rawInput: string) => {
	const input = parseInput(rawInput)
	const rankings: {
		[key in keyof typeof RANKS]?: Array<[string, number]>
	} = {
		[RANKS.FIVES]: [],
		[RANKS.FOURS]: [],
		[RANKS.FULL_HOUSE]: [],
		[RANKS.THREES]: [],
		[RANKS.TWO_PAIR]: [],
		[RANKS.ONE_PAIR]: [],
		[RANKS.HIGH_CARD]: [],
	}
	const CARD_RANKS = {
		A: 14,
		K: 13,
		Q: 12,
		T: 10,
		J: 1,
	}

	function getCardRankScore(card) {
		return CARD_RANKS[card] || parseInt(card, 10)
	}

	for (const hand of input) {
		const [cards, bid] = hand.split(/\s/)
		const parsedBid = parseInt(bid, 10)
		// search for the most common card, ordered by rank if multiple, as this will be the best combination to add to
		const mostCommonCards = cards
			.split('')
			.sort()
			.join('')
			.match(/([AKQT2-9])\1{0,}/g)
			?.sort((a, b) =>
				b.length - a.length === 0
					? getCardRankScore(b[0]) - getCardRankScore(a[0])
					: b.length - a.length,
			)
		// replace the jokers with the best winning combo found above so that the new cards can be ranked inclusive of the changed card
		const replacedCards = mostCommonCards
			? cards.replaceAll('J', mostCommonCards[0][0])
			: cards
		const uniqueCards = new Set([...replacedCards.split('')])

		if (uniqueCards.size === 1) {
			// Only one unique card returned, must be FIVES
			rankings[RANKS.FIVES].push([cards, parsedBid])
		} else if (uniqueCards.size === 2) {
			// Two unique cards returned, must be FULL_HOUSE or FOURS (e.g. JJJ99 or JJJJ9)
			if (
				replacedCards
					.split('')
					.sort()
					.join('')
					.match(/([AKQJT2-9])\1{3}/)
			) {
				rankings[RANKS.FOURS].push([cards, parsedBid])
			} else {
				rankings[RANKS.FULL_HOUSE].push([cards, parsedBid])
			}
		} else if (uniqueCards.size === 3) {
			// Three unique cards returned, must be THREES or TWO_PAIR (e.g. JJJ98 or JJ998)
			if (
				replacedCards
					.split('')
					.sort()
					.join('')
					.match(/([AKQJT2-9])\1{2}/)
			) {
				rankings[RANKS.THREES].push([cards, parsedBid])
			} else {
				rankings[RANKS.TWO_PAIR].push([cards, parsedBid])
			}
		} else if (uniqueCards.size === 4) {
			// Four unique cards returned, must be ONE_PAIR (e.g. JJ987)
			rankings[RANKS.ONE_PAIR].push([cards, parsedBid])
		} else if (uniqueCards.size === 5) {
			// Five unique cards returned, must be HIGH_CARD (e.g. JT987)
			rankings[RANKS.HIGH_CARD].push([cards, parsedBid])
		}
	}

	let totalBids = 0
	let totalRanks = input.length

	// Rank cards starting from best to worst (e.g. FIVES to HIGH_CARD)
	for (const ranks of Object.values(rankings)) {
		if (ranks.length === 1) {
			const rank = ranks.shift()
			if (rank) {
				// only one hand at this rank, add to total and move on
				const [, bid] = rank
				totalBids += bid * totalRanks
				totalRanks -= 1
			}
		} else {
			// multiple hands have same winning hand, sort by card positions starting from first to last, taking into account new J score
			ranks.sort((a, b) => {
				if (a[0][0] !== b[0][0])
					return getCardRankScore(b[0][0]) - getCardRankScore(a[0][0])
				else if (a[0][1] !== b[0][1])
					return getCardRankScore(b[0][1]) - getCardRankScore(a[0][1])
				else if (a[0][2] !== b[0][2])
					return getCardRankScore(b[0][2]) - getCardRankScore(a[0][2])
				else if (a[0][3] !== b[0][3])
					return getCardRankScore(b[0][3]) - getCardRankScore(a[0][3])
				else if (a[0][4] !== b[0][4])
					return getCardRankScore(b[0][4]) - getCardRankScore(a[0][4])
				else return 0
			})
			for (const rank of ranks) {
				const [, bid] = rank
				totalBids += bid * totalRanks
				totalRanks -= 1
			}
		}
	}

	return totalBids
}

run({
	part1: {
		tests: [
			{
				input: `
          32T3K 765
          T55J5 684
          KK677 28
          KTJJT 220
          QQQJA 483
        `,
				expected: 6440,
			},
		],
		solution: part1,
	},
	part2: {
		tests: [
			{
				input: `
          32T3K 765
          T55J5 684
          KK677 28
          KTJJT 220
          QQQJA 483
        `,
				expected: 5905,
			},
			{
				input: `
          2345A 1
          Q2KJJ 13
          Q2Q2Q 19
          T3T3J 17
          T3Q33 11
          2345J 3
          J345A 2
          32T3K 5
          T55J5 29
          KK677 7
          KTJJT 34
          QQQJA 31
          JJJJJ 37
          JAAAA 43
          AAAAJ 59
          AAAAA 61
          2AAAA 23
          2JJJJ 53
          JJJJ2 41
        `,
				expected: 6839,
			},
		],
		solution: part2,
	},
	trimTestInputs: true,
	onlyTests: false,
})
