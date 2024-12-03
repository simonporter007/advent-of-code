import { readConfig, saveConfig } from '@/api/config'
import type { Day, Year } from '@/types/types'
import { formatDayName } from '@/utils/format-day'
import { formatPerformance } from '@/utils/performance'

export function generateDayTemplate({
  dayName,
  year,
}: {
  year: Year
  dayName: Day
}) {
  return `import { parseLines, readInput } from '@/utils/file-io'
//import { join } from "node:path";
//import { MOCKS_DIR } from "@/constants";

export function part1(input: string) {
  const lines = parseLines(input)
  // your code goes here
}

export function part2(input: string) {
  const lines = parseLines(input)
  // your code goes here
}

if (Bun.env.debug === "true") {
  async function debug() {
    const input = await readInput({
      day: "${dayName}",
      //inputFilePath: join(MOCKS_DIR, "input.part1.example.txt"),
      //inputFilePath: join(MOCKS_DIR, "input.part2.example.txt"),
      year: ${year},
    });
    part1(input);
    part2(input);
  }
  debug();
}
`
}

export function generateDayTestTemplate({
  dayName,
  year,
}: {
  year: Year
  dayName: Day
}) {
  return `import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { part1, part2 } from "@/${year}/${dayName}/solution";
import { MOCKS_DIR } from "@/constants";
import { readInput } from "@/utils/file-io";

describe("${year}/${dayName} >", async () => {
  test("part1 > example", async () => {
    const input = await readInput({
      day: "${dayName}",
      inputFilePath: join(MOCKS_DIR, "input.part1.example.txt"),
      year: ${year},
    });
    expect(part1(input)).toEqual(/* answer goes here */);
  });

  test("part2 > example", async () => {
    const input = await readInput({
      day: "${dayName}",
      inputFilePath: join(MOCKS_DIR, "input.part2.example.txt"),
      year: ${year},
    });
    expect(part2(input)).toEqual(/* answer goes here */);
  });
})

`
}

export async function generateYearReadmeTemplate({ year }: { year: Year }) {
  return `[![AoC](https://badgen.net/badge/AoC/${year}/blue)](https://adventofcode.com/${year})

# 🎄 Advent of Code ${year} 🎄

## Solutions

${await getBadges({ year })}

_Click a badge to go to the specific day._

---

## Results

${await getResults({ year })}

${await getTotals({ year })}

---

✨🎄🎁🎄🎅🎄🎁🎄✨
`
}

export async function getBadges({ year }: { year: Year }) {
  const stats = await readConfig()

  return Array.from({ length: 25 }, (_, i) => {
    const day = i + 1
    const formattedDay = formatDayName(day) as Day
    const part1Solved = stats?.[year]?.[formattedDay]?.part1?.solved
    const part2Solved = stats?.[year]?.[formattedDay]?.part2?.solved

    return `${part1Solved ? '[' : ''}![Day ${day}](https://badgen.net/badge/${formattedDay}/${part1Solved ? `%E2%98%85` : '%E2%98%86'}${part2Solved ? `%E2%98%85` : '%E2%98%86'}/${part1Solved ? (part2Solved ? 'green' : 'yellow') : 'grey'})${part1Solved ? `](./${formattedDay})` : ''}`
  }).join('\n')
}

export async function getResults({ year }: { year: Year }) {
  const stats = await readConfig()

  return Array.from({ length: 25 }, (_, i) => {
    const day = i + 1
    const formattedDay = formatDayName(day) as Day

    return `\`\`\`
${formattedDay}
Time part 1: ${stats?.[year]?.[formattedDay]?.part1?.time ? formatPerformance(stats?.[year]?.[formattedDay]?.part1?.time) : '-'}
Time part 2: ${stats?.[year]?.[formattedDay]?.part2?.time ? formatPerformance(stats?.[year]?.[formattedDay]?.part2?.time) : '-'}
Both parts: ${formatPerformance((stats?.[year]?.[formattedDay]?.part1?.time || 0) + (stats?.[year]?.[formattedDay]?.part2?.time || 0))}
\`\`\``
  }).join('\n\n')
}

export async function getTotals({ year }: { year: Year }) {
  const stats = await readConfig()
  let totalStars = 0
  let totalTime = 0

  if (!stats[year]) return ''

  Array.from({ length: 25 }, (_, i) => {
    const day = i + 1
    const formattedDay = formatDayName(day) as Day
    totalStars += stats?.[year]?.[formattedDay]?.part1?.solved ? 1 : 0
    totalStars += stats?.[year]?.[formattedDay]?.part2?.solved ? 1 : 0
    totalTime += stats?.[year]?.[formattedDay]?.part1?.time || 0
    totalTime += stats?.[year]?.[formattedDay]?.part2?.time || 0
  })

  stats[year].totalStars = totalStars
  stats[year].totalTime = totalTime

  saveConfig(stats)

  return `\`\`\`
Total stars: ${stats?.[year]?.totalStars}/50
Total time: ${formatPerformance(stats?.[year]?.totalTime)}
\`\`\``
}
