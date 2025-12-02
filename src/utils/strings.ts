export function half(input: string): [string, string] {
  const mid = Math.floor(input.length / 2)
  return [input.slice(0, mid), input.slice(mid)]
}

export function isPalindrome(input: string): boolean {
  return input === input.split('').reverse().join('')
}
