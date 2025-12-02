import { parseLines, readInput } from '@/utils/file-io'
import { join } from 'node:path';
import { MOCKS_DIR } from '@/constants';

export function part1(input: string) {
  const lines = parseLines(input)
  let curr = 50
  let result = 0

  for (const line of lines) {
    const dir = line.at(0)
    const num = Number(line.substring(1))
    curr = dir === "L" ? curr - num : curr + num

    while (curr < 0 || curr > 100) {
      curr = curr < 0 ? 100 + curr : curr > 100 ? curr - 100 : curr
    }

    if (curr === 0 || curr === 100) {
      result++
    }
  }

  return result
}

export function part2(input: string) {
  const lines = parseLines(input)
  let curr = 50
  let result = 0

  for (const line of lines) {
    const dir = line.at(0)
    const num = Number(line.substring(1))
    curr = dir === "L" ? curr - num : curr + num
    
    while (curr < 0 || curr > 100) {
      if (curr < 0) {
        if (num + curr !== 0) result++
        curr = 100 + curr
      } else if (curr > 100) {
        if (curr - num !== 100) result++
        curr = curr - 100
      }
    }

    if (curr === 0 || curr === 100) {
      result++
    }
  }

  return result
}

if (Bun.env.debug === 'true') {
  async function debug() {
    const input = await readInput({
      day: 'day01',
      inputFilePath: join(MOCKS_DIR, 'input.part1.example.txt'),
      //inputFilePath: join(MOCKS_DIR, 'input.part2.example.txt'),
      year: 2025,
    });
    part1(input);
    part2(input);
  }
  debug();
}
9