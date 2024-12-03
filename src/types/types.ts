export type Day =
  | 'day01'
  | 'day02'
  | 'day03'
  | 'day04'
  | 'day05'
  | 'day06'
  | 'day07'
  | 'day08'
  | 'day09'
  | 'day10'
  | 'day11'
  | 'day12'
  | 'day13'
  | 'day14'
  | 'day15'
  | 'day16'
  | 'day17'
  | 'day18'
  | 'day19'
  | 'day20'
  | 'day21'
  | 'day22'
  | 'day23'
  | 'day24'
  | 'day25'

export type Year = 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2023 | 2024

export type PartStats = {
  attempts: unknown[]
  result: string
  solved: boolean
  time: number
}

export type DayStats = {
  part1: PartStats
  part2: PartStats
}

export type YearStats = { totalStars: number; totalTime: number } & {
  [day in Day]?: DayStats
}

export type Config = {
  canSubmit: boolean
  delayAmount: number
  delayStart: number
  totalStars: number
  totalTime: number
} & { [year in Year]?: YearStats }
