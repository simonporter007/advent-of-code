import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { part1, part2 } from "@/2024/day01/solution";
import { MOCKS_DIR } from "@/constants";
import { readInput } from "@/utils/file-io";

describe("2024/day01 >", async () => {
  test("part1 > example", async () => {
    const input = await readInput({
      day: "day01",
      inputFilePath: join(MOCKS_DIR, "input.part1.example.txt"),
      year: 2024,
    });
    expect(part1(input)).toEqual(11);
  });

  test("part2 > example", async () => {
    const input = await readInput({
      day: "day01",
      inputFilePath: join(MOCKS_DIR, "input.part2.example.txt"),
      year: 2024,
    });
    expect(part2(input)).toEqual(31);
  });
});
