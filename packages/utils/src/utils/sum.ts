// accept either an array of numbers, a list of numbers, or an array of arrays of numbers
export function sum(...numbers: number[] | number[][]) {
	let total = 0
	for (const number of numbers) {
		if (typeof number === 'number') {
			// standard number array
			total += number
		} else {
			// multi-dimensional array
			for (const num of number) {
				total += num
			}
		}
	}
	return total
}
