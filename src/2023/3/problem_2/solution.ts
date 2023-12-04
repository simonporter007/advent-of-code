import { arrayRange } from '@/utils/arrayRange';
import { getFileContents } from '@/utils/getFileContents';
import { isNumber } from '@/utils/isNumber';

const file = getFileContents();
let lastLine: Buffer | false = false;
let midLine: Buffer | false = false;
let topLine: Buffer | false = false;
let validNumbers = 0;

function getRowNumbers({ array }: { array?: string[] }) {
  // we scan each row, looking for a number
  let foundNumber = '';
  return (
    array
      ?.map((number, index) => {
        // if a number is found, we add it to our tally
        if (isNumber(number)) {
          foundNumber += number;
          // if the number is found at the end of the line, we return early
          // parse it's data with start and end indexes, and return
          if (index === array?.length - 1) {
            const number = parseInt(foundNumber, 10);
            return {
              number,
              from: index - 1 - `${number}`.length,
              to: index,
            };
          }
          // otherwise, if we find a non number but have found a number previous, we reached the end of the number
          // parse it's data with start and end indexes, and return
        } else if (foundNumber && !isNumber(number)) {
          const number = parseInt(foundNumber, 10);
          foundNumber = '';
          return {
            number,
            from: index - `${number}`.length,
            to: index - 1,
          };
        }
      })
      // filter out anything else
      .filter(Boolean)
  );
}

// use do..while to catch last two lines when lastLine is false
do {
  lastLine = file.next();
  // Just starting, copy the row and move on
  if (!midLine) {
    midLine = lastLine;
    continue;
  }

  const topLineArr = topLine ? `${topLine}`.split('') : undefined;
  const midLineArr = `${midLine}`.split('');
  const lastLineArr = lastLine ? `${lastLine}`.split('') : undefined;

  midLineArr.forEach((char, idx) => {
    if (char === '*') {
      // we match a gear, so we find numbers on all rows
      const topLineNumbers = getRowNumbers({ array: topLineArr });
      const midLineNumbers = getRowNumbers({ array: midLineArr });
      const lastLineNumbers = getRowNumbers({ array: lastLineArr });

      // then we work out the indexes that are touching the gear for validation
      const minIdx = Math.max(idx - 1, 0);
      const maxIdx = Math.min(idx + 1, midLineArr?.length - 1);
      const linkedNumbers: number[] = [];

      // then we loop over each number of our rows, and if they are in a valid range, they count towards the gear
      [
        ...(topLineNumbers || []),
        ...(midLineNumbers || []),
        ...(lastLineNumbers || []),
      ].forEach((match) => {
        if (match) {
          const matchRange = arrayRange({
            start: match?.from,
            stop: match?.to,
          });
          const gearRange = arrayRange({ start: minIdx, stop: maxIdx });
          if (gearRange.some((idx) => matchRange.includes(idx))) {
            linkedNumbers.push(match.number);
          }
        }
      });

      // finally, if there are only two linked numbers, it's valid and included in the sum
      if (linkedNumbers?.length === 2) {
        validNumbers += linkedNumbers[0] * linkedNumbers[1];
      }
    }
  });

  // move the lines up
  topLine = midLine;
  midLine = lastLine;
} while (lastLine);

console.log(validNumbers);
