export function removeAtIndex<T>({ array, idx }: { array: T[]; idx: number }) {
  if (idx < 0 || idx >= array.length) {
    throw new Error(`Index ${idx} is out of bounds`)
  }

  return [...array.slice(0, idx), ...array.slice(idx + 1, array.length)]
}
