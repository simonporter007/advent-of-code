import { isNumber } from '@simonporter007/utils'

export function checkLine({
	topLine,
	midLine,
	lastLine,
}: {
	topLine?: string[]
	midLine: string[]
	lastLine?: string[]
}) {
	let foundNumber = ''
	let validNumbers = 0
	for (let x = 0; x <= midLine?.length; x++) {
		// find special characters to trigger number check
		if (midLine[x] === '.' || !isNumber(midLine[x])) {
			// we found a special character, check if we have a number
			if (foundNumber) {
				// we have a number, work out the indexes to check for surrounding special characters
				const minIdx =
					x - foundNumber?.length === 0 ? 0 : x - foundNumber?.length - 1
				const maxIdx = x >= midLine?.length ? x - 1 : x

				// search top and bottom rows for valid numbers
				for (let y = minIdx; y <= maxIdx; y++) {
					if (
						(lastLine && lastLine[y] !== '.' && !isNumber(lastLine[y])) ||
						(topLine && topLine[y] !== '.' && !isNumber(topLine[y]))
					) {
						// we found a special character that isn't a period, valid part number.
						validNumbers += parseInt(foundNumber, 10)
						foundNumber = ''
						// break out of the loop, no point checking other numbers
						break
					}
				}

				// if we still have foundNumber, check the midLine, as top and bottom did not match
				if (foundNumber) {
					if (
						(midLine[minIdx] !== '.' && !isNumber(midLine[minIdx])) ||
						(midLine[maxIdx] !== '.' && !isNumber(midLine[maxIdx]))
					) {
						// we found a special character that isn't a period, valid part number.
						validNumbers += parseInt(foundNumber, 10)
					}
				}
				// otherwise, we didn't find a valid number or need to reset the foundNumber anyway
				foundNumber = ''
			}
			// must just be a period otherwise, so move on
			continue
		}
		// found a number in the grid, contunue searching for the end of the number
		foundNumber += midLine[x]
	}
	return validNumbers
}
