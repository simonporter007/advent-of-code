import { parseLines, readInput } from '@/utils/file-io'
//import { join } from "node:path";
//import { MOCKS_DIR } from "@/constants";

function parseRulesToRegex(rules: string) {
  const parsedRules: number[] = []
  let regex = ''

  rules
    .split('\n')
    .map((update) => update.split('|').map((num) => parseInt(num, 10)))
    .sort((a, b) => a[0] - b[0])
    .forEach((rule, i, rules) => {
      if (parsedRules.includes(rule[0])) return
      const disallowedList = rules
        .filter((r) => r[0] === rule[0])
        .map((r) => r[1])
      regex += `${i > 0 ? '|' : ''}(${disallowedList.join('|')}).+${rule[0]}`
      parsedRules.push(rule[0])
    })

  return regex
}

export function part1(input: string) {
  const [rules, updates] = parseLines(input, '\n\n')
  const regex = parseRulesToRegex(rules)
  let total = 0

  updates.split('\n').forEach((update) => {
    const match = update.match(new RegExp(regex))
    if (match) return
    const pages = update.split(',').map((page) => parseInt(page, 10))
    total += pages[Math.floor(pages.length / 2)]
  })

  return total
}

function parseRules(rules: string) {
  const parsedRulesArr: number[] = []
  const parsedRules = new Map<number, number[]>()
  let regex = ''

  rules
    .split('\n')
    .map((update) => update.split('|').map((num) => parseInt(num, 10)))
    .forEach((rule, i, rules) => {
      parsedRules.set(rule[0], [...(parsedRules.get(rule[0]) || []), rule[1]])

      if (parsedRulesArr.includes(rule[0])) return
      const disallowedList = rules
        .filter((r) => r[0] === rule[0])
        .map((r) => r[1])
      regex += `${i > 0 ? '|' : ''}(${disallowedList.join('|')}).+${rule[0]}`
      parsedRulesArr.push(rule[0])
    })

  return [regex, parsedRules] as const
}

export function part2(input: string) {
  const [rules, updates] = parseLines(input, '\n\n')
  const [regex, parsedRules] = parseRules(rules)
  let total = 0

  updates.split('\n').forEach((update) => {
    const match = update.match(new RegExp(regex))
    if (match) {
      const pages = match.input
        ?.split(',')
        .map((page) => parseInt(page, 10))
        .sort((a, b) => {
          if (parsedRules.get(a)?.includes(b)) return -1
          if (parsedRules.get(b)?.includes(a)) return 1
          return 0
        })
      total += pages?.[Math.floor(pages.length / 2)] || 0
    }
  })

  return total
}

if (Bun.env.debug === 'true') {
  async function debug() {
    const input = await readInput({
      day: 'day05',
      //inputFilePath: join(MOCKS_DIR, "input.part1.example.txt"),
      //inputFilePath: join(MOCKS_DIR, "input.part2.example.txt"),
      year: 2024,
    })
    part1(input)
    part2(input)
  }
  debug()
}
