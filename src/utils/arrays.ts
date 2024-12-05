export function removeAtIndex<T>({ array, idx }: { array: T[]; idx: number }) {
  if (idx < 0 || idx >= array.length) {
    throw new Error(`Index ${idx} is out of bounds`)
  }

  return [...array.slice(0, idx), ...array.slice(idx + 1, array.length)]
}

export function rotate45(matrix: string[]) {
  const n = matrix.length
  const result: string[] = []

  for (let top = 0; top < n; top++) {
    let line = ''
    for (let i = 0; i <= top; i++) {
      line += matrix[i][top - i]
    }
    result.push(line)
  }

  for (let bottom = 1; bottom < n; bottom++) {
    let line = ''
    for (let i = 0; i < n - bottom; i++) {
      line += matrix[bottom + i][n - 1 - i]
    }
    result.push(line)
  }

  return result
}

export function rotate90(matrix: string[]) {
  const n = matrix.length
  const result: string[] = []

  for (let col = 0; col < n; col++) {
    let newRow = ''
    for (let row = n - 1; row >= 0; row--) {
      newRow += matrix[row][col]
    }
    result.push(newRow)
  }

  return result
}

export function rotate180(matrix: string[]) {
  return matrix
    .slice()
    .reverse()
    .map((row) => row.split('').reverse().join(''))
}

export type Directions = {
  top: unknown
  topRight: unknown
  right: unknown
  bottomRight: unknown
  bottom: unknown
  bottomLeft: unknown
  left: unknown
  topLeft: unknown
}

export function getPoints({
  lines,
  col,
  row,
}: {
  lines: string[]
  col: number
  row: number
}) {
  const top = lines[row - 1][col]
  const topRight = lines[row - 1][col + 1]
  const right = lines[row][col + 1]
  const bottomRight = lines[row + 1][col + 1]
  const bottom = lines[row + 1][col]
  const bottomLeft = lines[row + 1][col - 1]
  const left = lines[row][col - 1]
  const topLeft = lines[row - 1][col - 1]

  return {
    top,
    topRight,
    right,
    bottomRight,
    bottom,
    bottomLeft,
    left,
    topLeft,
  } as Directions
}
