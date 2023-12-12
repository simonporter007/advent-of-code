export function calculateLCM({ numbers }: { numbers: number[] }) {
	function greatestCommonDivisor(a: number, b: number) {
		if (!b) return b === 0 ? a : NaN
		return greatestCommonDivisor(b, a % b)
	}
	function leastCommonMultiple(a: number, b: number) {
		return (a * b) / greatestCommonDivisor(a, b)
	}

	let lcm = 1
	numbers?.forEach((answer) => {
		lcm = leastCommonMultiple(answer, lcm)
	})
	return lcm
}
