import chalk from 'chalk'
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { parseArgs } from 'util'
import { fetchInput } from '@/api/advent-of-code'
import { readConfig, saveConfig } from '@/api/config'
import { MOCKS_DIR, PROJECT_ROOT, TESTS_DIR } from '@/constants'
import type { Year, YearStats } from '@/types/types'
import { formatDay, formatDayName } from '@/utils/format-day'
import { isDirValid } from '@/utils/is-dir-valid'
import { sortObject } from '@/utils/objects'
import { generateDayTemplate, generateDayTestTemplate } from '@/utils/templates'
import { validateDay, validateYear } from '@/utils/validate'

const { positionals, values } = parseArgs({
  allowPositionals: true,
  args: Bun.argv,
  options: {
    year: {
      type: 'string',
    },
  },
  strict: true,
})

const currentYear = new Date().getFullYear()
const day = Number(positionals?.[2]) || new Date().getDate()
const year = Number.parseInt(
  values?.year || (Bun.env.YEAR ?? currentYear.toString()),
)

async function setup({ day, year }: { day: number; year: number }) {
  if (!validateDay(day)) {
    console.log(`🎅 Pick a day between ${chalk.bold(1)} and ${chalk.bold(25)}.`)
    console.log(`🎅 To get started, try: ${chalk.cyan('pnpm aoc:setup 1')}`)
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
  const dir = join(PROJECT_ROOT, 'src', year.toString(), dayName)
  const dirExists = await isDirValid(dir)

  if (dirExists) {
    console.log(chalk.red(`Day ${day} already exists! Checking input...`))
    const filePath = join(
      PROJECT_ROOT,
      'src',
      year.toString(),
      dayName,
      'input.txt',
    )
    const file = Bun.file(filePath)
    if (!(await file.exists())) {
      const input = await fetchInput({ day, year }).catch(() => {
        console.log(
          chalk.red.bold(
            '❌ Fetching input failed, empty file will be created.',
          ),
        )
      })
      await Bun.write(join(dir, 'input.txt'), input ?? '')
      console.log(chalk.green.bold(`✅ Day ${formatDay(day)} set up!`))
    } else {
      console.log(chalk.red.bold(`❌ Day ${day} already exists!`))
    }
    return
  }

  console.log('📄 Fetching input...')
  const input = await fetchInput({ day, year }).catch(() => {
    console.log(
      chalk.red.bold('❌ Fetching input failed, empty file will be created.'),
    )
  })

  console.log(`📂 Setting up day ${formatDay(day)}...`)

  try {
    await mkdir(dir, { recursive: true })
    await mkdir(join(dir, MOCKS_DIR), { recursive: true })
    await Bun.write(join(dir, 'input.txt'), input ?? '')
    await Bun.write(
      join(dir, 'solution.ts'),
      generateDayTemplate({ dayName, year: year as Year }),
    )
    await Bun.write(
      join(dir, TESTS_DIR, 'solution.spec.ts'),
      generateDayTestTemplate({ dayName, year: year as Year }),
    )
    await Bun.write(join(dir, MOCKS_DIR, 'input.part1.example.txt'), '')
    await Bun.write(join(dir, MOCKS_DIR, 'input.part2.example.txt'), '')

    const config = await readConfig()
    config[year as Year] = sortObject({
      [dayName]: {
        part1: {
          attempts: [],
          result: '',
          solved: false,
          time: 0,
        },
        part2: {
          attempts: [],
          result: '',
          solved: false,
          time: 0,
        },
      },
      totalStars: 0,
      totalTime: 0,
      ...config[year as Year],
    }) as YearStats

    saveConfig(config)

    console.log(chalk.green.bold(`✅ Day ${formatDay(day)} set up!`))
  } catch (err) {
    console.error(
      chalk.red(
        (err as { message?: string })?.message ?? 'Failed to set up day',
      ),
    )
  }
}

setup({ day, year })
