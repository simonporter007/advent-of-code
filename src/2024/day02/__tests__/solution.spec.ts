import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { part1, part2 } from "@/2024/day02/solution";
import { MOCKS_DIR } from "@/constants";
import { readInput } from "@/utils/file-io";

describe("2024/day02 >", async () => {
  test("part1 > example", async () => {
    const input = await readInput({
      day: "day02",
      inputFilePath: join(MOCKS_DIR, "input.part1.example.txt"),
      year: 2024,
    });
    expect(part1(input)).toEqual(2);
  });

  test("part2 > example", async () => {
    const input = await readInput({
      day: "day02",
      inputFilePath: join(MOCKS_DIR, "input.part2.example.txt"),
      year: 2024,
    });
    expect(part2(input)).toEqual(4);
  });

  test("part2 > initial data set", async () => {
    const input = await readInput({
      day: "day02",
      inputFilePath: join(MOCKS_DIR, "input.part2.extended.txt"),
      year: 2024,
    });
    expect(part2(input)).toEqual(6);
  });

  test("part2 > initial number error", async () => {
    const input = await readInput({
      day: "day02",
      inputFilePath: join(MOCKS_DIR, "input.part2.initial.txt"),
      year: 2024,
    });
    expect(part2(input)).toEqual(3);
  });

  test("part2 > ending error", async () => {
    const input = await readInput({
      day: "day02",
      inputFilePath: join(MOCKS_DIR, "input.part2.end.txt"),
      year: 2024,
    });
    expect(part2(input)).toEqual(3);
  });
});
