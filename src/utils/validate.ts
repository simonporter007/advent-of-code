import { isBetween } from '@/utils/numbers'

export function validateDay(day: number | string) {
  const parsedDay = Number(day)
  return (
    day &&
    !Number.isNaN(parsedDay) &&
    isBetween({ max: 25, min: 1, x: parsedDay })
  )
}

export function validateYear(year: number) {
  const currentYear = new Date().getFullYear()
  return (
    !Number.isNaN(year) && isBetween({ max: currentYear, min: 2015, x: year })
  )
}
