import chalk from 'chalk'
import { join } from 'node:path'
import { parseArgs } from 'util'
import { sendSolution, STATUSES } from '@/api/advent-of-code'
import { readConfig, saveConfig } from '@/api/config'
import { DEFAULT_PERFORMANCE_RUNS, PROJECT_ROOT } from '@/constants'
import type { Year } from '@/types/types'
import { readInput } from '@/utils/file-io'
import { formatDayName } from '@/utils/format-day'
import {
  formatPerformance,
  getPerformance,
  withPerformance,
} from '@/utils/performance'
import { validateDay, validateYear } from '@/utils/validate'

const { positionals, values: opts } = parseArgs({
  allowPositionals: true,
  args: Bun.argv,
  options: {
    clear: {
      type: 'boolean',
    },
    dev: {
      type: 'boolean',
    },
    performance: {
      default: false,
      type: 'boolean',
    },
    runs: {
      default: `${DEFAULT_PERFORMANCE_RUNS}`,
      type: 'string',
    },
    year: {
      type: 'string',
    },
  },
  strict: true,
})

const currentYear = new Date().getFullYear()
const day = Number(positionals?.[2]) || new Date().getDate()
const year = Number.parseInt(
  opts?.year || (Bun.env.YEAR ?? currentYear.toString()),
) as Year
const runs = opts.runs ? parseInt(opts.runs, 10) : DEFAULT_PERFORMANCE_RUNS

async function run() {
  if (!validateDay(day)) {
    console.log(`🎅 Pick a day between ${chalk.bold(1)} and ${chalk.bold(25)}.`)
    console.log(`🎅 To get started, try: ${chalk.cyan('bun day 1')}`)
    return
  }

  if (!validateYear(year)) {
    console.log(
      chalk.red(
        `📅 Year must be between ${chalk.bold(2015)} and ${chalk.bold(currentYear)}.`,
      ),
    )
    return
  }

  const dayName = formatDayName(day)
  const dirPath = join(PROJECT_ROOT, 'src', year.toString(), dayName)
  const solutionPath = `${dirPath}/solution.ts`

  const file = Bun.file(solutionPath)
  const fileExists = await file.exists()

  if (!fileExists) {
    console.log(
      chalk.red(
        `🎅 ${year}/${dayName} does not exist! Try ${chalk.cyan(`pnpm aoc:setup --year ${year} ${day}`)}`,
      ),
    )
    return
  }

  const input = await readInput({ day: dayName, year: year })
  const { part1, part2 } = await import(solutionPath)

  let one = ''
  let two = ''
  let onePerformance = 0
  let twoPerformance = 0

  if (opts?.performance) {
    let i = 0
    let avgOnePerformance = 0
    let avgTwoPerformance = 0

    while (i <= runs) {
      ;[one, onePerformance] = withPerformance(() => part1?.(input))
      ;[two, twoPerformance] = withPerformance(() => part2?.(input))
      avgOnePerformance += onePerformance
      avgTwoPerformance += twoPerformance
      i++
    }

    onePerformance = avgOnePerformance / runs
    twoPerformance = avgTwoPerformance / runs
  } else {
    ;[one, onePerformance] = withPerformance(() => part1?.(input))
    ;[two, twoPerformance] = withPerformance(() => part2?.(input))
  }

  if (opts?.clear) {
    console.clear()
  }

  console.log('🎅', 'Year', chalk.red(year), 'day', chalk.red(day))
  if (opts?.performance) {
    console.log('🕒', `Average time taken across`, chalk.green(runs), 'runs')
  }
  console.log(
    '🌲',
    'Part One:',
    chalk.green(one ?? '—'),
    one ? `(${formatPerformance(onePerformance)})` : '',
  )
  console.log(
    '🎄',
    'Part Two:',
    chalk.green(two ?? '—'),
    two ? `(${formatPerformance(twoPerformance)})` : '',
  )

  const stats = await readConfig()

  if (!stats?.[year]) {
    console.log(
      chalk.red(`${year} does not exist in stats, did you run setup?`),
    )
    return
  }
  if (!stats[year]?.[dayName]) {
    console.log(
      chalk.red(
        `${year}/${dayName} does not exist in stats, did you run setup?`,
      ),
    )
    return
  }

  if (!opts?.dev) {
    const part = two ? 2 : 1
    const solution = two || one
    const timeTaken = two ? twoPerformance : onePerformance

    if (stats[year][dayName][`part${part}`].solved) {
      console.log(chalk.red(`🌟 ${year}/${dayName} already solved!`))
      return
    }

    const response = await sendSolution({
      day,
      part,
      solution: two || one,
      year,
    })

    if (response === STATUSES.SOLVED) {
      stats[year][dayName][`part${part}`].result = solution
      stats[year][dayName][`part${part}`].time = timeTaken
      stats[year][dayName][`part${part}`].solved = true
      stats[year].totalStars += 1
      stats[year].totalTime += timeTaken
      stats.totalStars += 1
      stats.totalTime += timeTaken
    } else if (response === STATUSES.WRONG) {
      if (
        !stats[year]?.[dayName]?.[`part${part}`].attempts.includes(solution)
      ) {
        stats[year]?.[dayName]?.[`part${part}`].attempts.push(solution)
      }
    }

    saveConfig(stats)
  }

  if (opts?.performance) {
    if (one && onePerformance) {
      stats[year][dayName][`part1`].time = getPerformance(onePerformance)
    }
    if (two && twoPerformance) {
      stats[year][dayName][`part2`].time = getPerformance(twoPerformance)
    }

    saveConfig(stats)
  }
}

run()
