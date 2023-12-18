export function memoize<T extends unknown[], R>(func: (...args: T) => R) {
	const stored = new Map<string, R>()

	return (...args: T) => {
		const k = JSON.stringify(args)
		if (stored.has(k)) {
			return stored.get(k)!
		}
		const result = func(...args)
		stored.set(k, result)
		return result
	}
}
