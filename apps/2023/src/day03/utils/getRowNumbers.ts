import { isNumber } from '@simonporter007/utils'

export function getRowNumbers({ array }: { array?: string[] }) {
	// we scan each row, looking for a number
	let foundNumber = ''
	return (
		array
			?.map((number, index) => {
				// if a number is found, we add it to our tally
				if (isNumber(number)) {
					foundNumber += number
					// if the number is found at the end of the line, we return early
					// parse it's data with start and end indexes, and return
					if (index === array?.length - 1) {
						const number = parseInt(foundNumber, 10)
						return {
							number,
							from: index - 1 - `${number}`.length,
							to: index,
						}
					}
					// otherwise, if we find a non number but have found a number previous, we reached the end of the number
					// parse it's data with start and end indexes, and return
				} else if (foundNumber && !isNumber(number)) {
					const number = parseInt(foundNumber, 10)
					foundNumber = ''
					return {
						number,
						from: index - `${number}`.length,
						to: index - 1,
					}
				}
			})
			// filter out anything else
			.filter(Boolean)
	)
}
