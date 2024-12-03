import { parseLines, readInput } from '@/utils/file-io'
//import { join } from "node:path";
//import { MOCKS_DIR } from "@/constants";

type CardRanks = {
  A: number
  K: number
  Q: number
  J: number
  T: number
}

const RANKS = {
  FIVE_OF_A_KIND: 'FIVE_OF_A_KIND',
  FOUR_OF_A_KIND: 'FOUR_OF_A_KIND',
  FULL_HOUSE: 'FULL_HOUSE',
  THREE_OF_A_KIND: 'THREE_OF_A_KIND',
  TWO_PAIR: 'TWO_PAIR',
  ONE_PAIR: 'ONE_PAIR',
  HIGH_CARD: 'HIGH_CARD',
}

function getCardRankScore(card: string, ranks: CardRanks) {
  return ranks[card as keyof CardRanks] || parseInt(card, 10)
}

export function part1(input: string) {
  const lines = parseLines(input)

  const CARD_RANKS = {
    A: 14,
    K: 13,
    Q: 12,
    J: 11,
    T: 10,
  } as CardRanks

  const rankings: {
    [key in keyof typeof RANKS]?: Array<[string, number]>
  } = {
    [RANKS.FIVE_OF_A_KIND]: [],
    [RANKS.FOUR_OF_A_KIND]: [],
    [RANKS.FULL_HOUSE]: [],
    [RANKS.THREE_OF_A_KIND]: [],
    [RANKS.TWO_PAIR]: [],
    [RANKS.ONE_PAIR]: [],
    [RANKS.HIGH_CARD]: [],
  } as const

  for (const hand of lines) {
    const [cards, bid] = hand.split(/\s/)
    const parsedBid = parseInt(bid, 10)
    const uniqueCards = new Set([...cards.split('')])

    if (uniqueCards.size === 1) {
      // Only one unique card returned, must be FIVES
      rankings?.FIVE_OF_A_KIND?.push([cards, parsedBid])
    } else if (uniqueCards.size === 2) {
      // Two unique cards returned, must be FULL_HOUSE or FOURS (e.g. JJJ99 or JJJJ9)
      if (
        cards
          .split('')
          .sort()
          .join('')
          .match(/([AKQJT2-9])\1{3}/)
      ) {
        rankings?.FOUR_OF_A_KIND?.push([cards, parsedBid])
      } else {
        rankings?.FULL_HOUSE?.push([cards, parsedBid])
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
        rankings?.THREE_OF_A_KIND?.push([cards, parsedBid])
      } else {
        rankings?.TWO_PAIR?.push([cards, parsedBid])
      }
    } else if (uniqueCards.size === 4) {
      // Four unique cards returned, must be ONE_PAIR (e.g. JJ987)
      rankings?.ONE_PAIR?.push([cards, parsedBid])
    } else if (uniqueCards.size === 5) {
      // Five unique cards returned, must be HIGH_CARD (e.g. JT987)
      rankings?.HIGH_CARD?.push([cards, parsedBid])
    }
  }

  let totalBids = 0
  let totalRanks = lines.length

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
          return (
            getCardRankScore(b[0][0], CARD_RANKS) -
            getCardRankScore(a[0][0], CARD_RANKS)
          )
        else if (a[0][1] !== b[0][1])
          return (
            getCardRankScore(b[0][1], CARD_RANKS) -
            getCardRankScore(a[0][1], CARD_RANKS)
          )
        else if (a[0][2] !== b[0][2])
          return (
            getCardRankScore(b[0][2], CARD_RANKS) -
            getCardRankScore(a[0][2], CARD_RANKS)
          )
        else if (a[0][3] !== b[0][3])
          return (
            getCardRankScore(b[0][3], CARD_RANKS) -
            getCardRankScore(a[0][3], CARD_RANKS)
          )
        else if (a[0][4] !== b[0][4])
          return (
            getCardRankScore(b[0][4], CARD_RANKS) -
            getCardRankScore(a[0][4], CARD_RANKS)
          )
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

export function part2(input: string) {
  const lines = parseLines(input)
  const rankings: {
    [key in keyof typeof RANKS]?: Array<[string, number]>
  } = {
    [RANKS.FIVE_OF_A_KIND]: [],
    [RANKS.FOUR_OF_A_KIND]: [],
    [RANKS.FULL_HOUSE]: [],
    [RANKS.THREE_OF_A_KIND]: [],
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

  for (const hand of lines) {
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
          ? getCardRankScore(b[0], CARD_RANKS) -
            getCardRankScore(a[0], CARD_RANKS)
          : b.length - a.length,
      )
    // replace the jokers with the best winning combo found above so that the new cards can be ranked inclusive of the changed card
    const replacedCards = mostCommonCards
      ? cards.replaceAll('J', mostCommonCards[0][0])
      : cards
    const uniqueCards = new Set([...replacedCards.split('')])

    if (uniqueCards.size === 1) {
      // Only one unique card returned, must be FIVES
      rankings?.FIVE_OF_A_KIND?.push([cards, parsedBid])
    } else if (uniqueCards.size === 2) {
      // Two unique cards returned, must be FULL_HOUSE or FOURS (e.g. JJJ99 or JJJJ9)
      if (
        replacedCards
          .split('')
          .sort()
          .join('')
          .match(/([AKQJT2-9])\1{3}/)
      ) {
        rankings?.FOUR_OF_A_KIND?.push([cards, parsedBid])
      } else {
        rankings?.FULL_HOUSE?.push([cards, parsedBid])
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
        rankings?.THREE_OF_A_KIND?.push([cards, parsedBid])
      } else {
        rankings?.TWO_PAIR?.push([cards, parsedBid])
      }
    } else if (uniqueCards.size === 4) {
      // Four unique cards returned, must be ONE_PAIR (e.g. JJ987)
      rankings?.ONE_PAIR?.push([cards, parsedBid])
    } else if (uniqueCards.size === 5) {
      // Five unique cards returned, must be HIGH_CARD (e.g. JT987)
      rankings?.HIGH_CARD?.push([cards, parsedBid])
    }
  }

  let totalBids = 0
  let totalRanks = lines.length

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
          return (
            getCardRankScore(b[0][0], CARD_RANKS) -
            getCardRankScore(a[0][0], CARD_RANKS)
          )
        else if (a[0][1] !== b[0][1])
          return (
            getCardRankScore(b[0][1], CARD_RANKS) -
            getCardRankScore(a[0][1], CARD_RANKS)
          )
        else if (a[0][2] !== b[0][2])
          return (
            getCardRankScore(b[0][2], CARD_RANKS) -
            getCardRankScore(a[0][2], CARD_RANKS)
          )
        else if (a[0][3] !== b[0][3])
          return (
            getCardRankScore(b[0][3], CARD_RANKS) -
            getCardRankScore(a[0][3], CARD_RANKS)
          )
        else if (a[0][4] !== b[0][4])
          return (
            getCardRankScore(b[0][4], CARD_RANKS) -
            getCardRankScore(a[0][4], CARD_RANKS)
          )
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

if (Bun.env.debug === 'true') {
  async function debug() {
    const input = await readInput({
      day: 'day07',
      //inputFilePath: join(MOCKS_DIR, "input.part1.example.txt"),
      //inputFilePath: join(MOCKS_DIR, "input.part2.example.txt"),
      year: 2023,
    })
    part1(input)
    part2(input)
  }
  debug()
}
