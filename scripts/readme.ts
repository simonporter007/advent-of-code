import chalk from 'chalk'
import { join } from 'node:path'
import { parseArgs } from 'util'
import { PROJECT_ROOT } from '@/constants'
import type { Year } from '@/types/types'
import { generateYearReadmeTemplate } from '@/utils/templates'
import { validateYear } from '@/utils/validate'

const { values } = parseArgs({
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
const year = Number.parseInt(
  values?.year || (Bun.env.YEAR ?? currentYear.toString()),
) as Year

async function readme({ year }: { year: number }) {
  if (!validateYear(year)) {
    console.log(
      chalk.red(
        `📅 Year must be between ${chalk.bold(2015)} and ${chalk.bold(currentYear)}.`,
      ),
    )
    return
  }

  console.log(chalk.green.bold(`Updating readme for the year...`))
  const yearTemplate = await generateYearReadmeTemplate({ year: year as Year })

  const filePath = join(PROJECT_ROOT, 'src', year.toString(), 'README.md')
  const file = Bun.file(filePath)
  await Bun.write(file, yearTemplate)

  console.log(`🎅 AOC yearly readme updated!. Great job!`)
}

readme({ year })
