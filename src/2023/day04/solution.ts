import { parseLines, readInput } from '@/utils/file-io'

export function part1(input: string) {
  const lines = parseLines(input)
  let result = 0

  for (const line of lines) {
    const [, numbers] = line.replace('Card ', '').split(':')
    const [myNumbers, winningNumbers] = numbers
      .split(' | ')
      .map((set) => set.trim().split(/\s{1,}/))
      .filter(Boolean)
    const totalUniqueNumbers = new Set([...myNumbers, ...winningNumbers]).size
    const uniqueNumbers =
      myNumbers.length + winningNumbers.length - totalUniqueNumbers

    result += uniqueNumbers
      ? uniqueNumbers === 1
        ? 1
        : Math.pow(2, uniqueNumbers) / 2
      : 0
  }

  return result
}

export function part2(input: string) {
  const lines = parseLines(input)
  let result = 0
  const cards: Record<number, number> = {}

  for (const line of lines) {
    // parse the card ID and numbers
    const [cardId, numbers] = line.replace(/Card\s+/, '').split(':')
    const id = parseInt(cardId, 10)
    // increase our totals as we always have one of the card
    cards[id] = cards?.[id] ? cards?.[id] + 1 : 1

    // split out the card numbers, and the winning numbers
    const [myNumbers, winningNumbers] = numbers
      .split(' | ')
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

if (Bun.env.debug === 'true') {
  async function debug() {
    const input = await readInput({ day: 'day04', year: 2023 })
    part1(input)
    part2(input)
  }
  debug()
}
