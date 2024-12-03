export function sortObject(o: Record<string, unknown>) {
  return Object.keys(o)
    .sort()
    .reduce((r: Record<string, unknown>, k) => ((r[k] = o[k]), r), {})
}
