import { parseLines, readInput } from "@/utils/file-io";

function parseColumns({ lines }: { lines: string[] }) {
  const first: number[] = [];
  const second: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    const [firstNum, secondNum] = lines[i]
      .split("   ")
      .map((num) => parseInt(num, 10));
    first.push(firstNum);
    second.push(secondNum);
  }

  return [first, second];
}

export function part1(input: string) {
  const lines = parseLines(input);
  const [first, second] = parseColumns({ lines });
  let distances = 0;

  first.sort((a, b) => a - b);
  second.sort((a, b) => a - b);

  while (first.length > 0) {
    const lowestFirstNum = first.shift()!;
    const lowestSecondNum = second.shift()!;
    distances += Math.abs(lowestSecondNum - lowestFirstNum);
  }

  return distances;
}

export function part2(input: string) {
  const lines = parseLines(input);
  const [first, second] = parseColumns({ lines });
  let similarity = 0;

  while (first.length > 0) {
    const num = first.shift()!;
    const multiplier = second.filter((x) => x === num)?.length || 0;
    similarity += num * multiplier;
  }

  return similarity;
}

if (Bun.env.debug === "true") {
  async function debug() {
    const input = await readInput({
      day: "day01",
      //inputFilePath: join(MOCKS_DIR, "input.part1.example.txt"),
      //inputFilePath: join(MOCKS_DIR, "input.part2.example.txt"),
      year: 2024,
    });
    part1(input);
    part2(input);
  }
  debug();
}
