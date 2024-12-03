[![Bun](https://badgen.net/badge/bun/v1.1.38+/blue)](https://bun.sh/)
![Language](https://badgen.net/badge/Language/TypeScript/blue)

# 🎄 Advent of Code 🎄

[![2023](https://badgen.net/badge/AOC/2023/blue)](./src/2023)
[![2024](https://badgen.net/badge/AOC/2024/blue)](./src/2024)

## Installation

```
bun install
bun aoc:init
```

This will install all required dependencies and create the skeleton `.aoc.json` state file. You can then run the setup instructions below to get started!

## Setup and submissions

You can use the `aoc:setup` script to setup the template files with solutions, and the containing directories.

```
bun aoc:setup --year <year> <day>
```

This will output the following structure:

```
-src
|__`<year>`
|____`day<day>`
|______`__tests__`
|________`__mocks__`
|__________input.part1.examples.txt
|__________input.part2.examples.txt
|________solution.spec.ts
|______input.txt
|______solution.ts
```

As well as updating the `.aoc.json` state file with the template format for storing your results.

## Running in dev mode

Dev mode will run the solutions locally without submitting to Advent of Code. If running in performance mode, you can use this to improve your solution and it will update the recorded time in the `.aoc.json` state file.

```
bun aoc:run:dev --year <year> <day> --performance
```

Example:

```
bun aoc:run:dev 2                   // run day 2 solutions for the current year
bun aoc:run:dev --year 2023 2       // run day 2 solutions for the year 2023
bun aoc:run:dev 2 --performance     // run day 2 solutions for the current year to calculate performance, 50 runs avg.
```

## Running tests

Run the vitest test suites for all years, or specific solutions.

```
bun test
bun test:watch
bun test src/2023/day02/__tests__/solutions.spec.ts
```

---

✨🎄🎁🎄🎅🎄🎁🎄✨
