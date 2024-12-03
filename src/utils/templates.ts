import type { Day, Year } from '@/types/types'

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
