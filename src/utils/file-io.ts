import chalk from 'chalk'
import { join } from 'node:path'
import { PROJECT_ROOT } from '@/constants'
import type { Day, Year } from '@/types/types'

export function parseLines(rawInput: string) {
  return rawInput?.trim()?.split('\n')
}

export async function readInput({
  day,
  inputFilePath = 'input.txt',
  year,
}: {
  day: Day
  year: Year
  inputFilePath?: string
}) {
  const filePath = join(
    PROJECT_ROOT,
    'src',
    year.toString(),
    day,
    inputFilePath,
  )
  const file = Bun.file(filePath)

  if (!(await file.exists())) {
    console.log(chalk.red(`❌ Something's up. Missing input file!`))
  }

  const contents = await file.text()
  return contents
}
