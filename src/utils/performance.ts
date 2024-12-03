export function withPerformance<T>(handler: () => T) {
  const start = performance.now();
  const result = handler();
  const end = performance.now();

  return [result, end - start] as const;
}

export function getPerformance(time: number) {
  const round = (x: number) => Math.round((x + Number.EPSILON) * 100) / 100;
  return round(time);
}

export function formatPerformance(time: number) {
  const result = getPerformance(time);
  if (time < 1) {
    return `${result * 1000} µs`;
  }
  return `${result} ms`;
}
