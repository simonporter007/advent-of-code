import { getFileContents } from '@/utils/getFileContents';
import { check } from 'prettier';

const file = getFileContents();
let lastLine: Buffer | false;
let midLine: Buffer | false = false;
let topLine: Buffer | false = false;
let validNumbers = 0;

function checkLine({
  topLine,
  midLine,
  lastLine,
}: {
  topLine?: string[];
  midLine: string[];
  lastLine?: string[];
}) {
  let foundNumber = '';
  for (let x = 0; x <= midLine?.length; x++) {
    // find special characters to trigger number check
    if (midLine[x] === '.' || Number.isNaN(parseInt(midLine[x], 10))) {
      // we found a special character, check if we have a number
      if (foundNumber) {
        // we have a number, work out the indexes to check for surrounding special characters
        const minIdx =
          x - foundNumber?.length === 0 ? 0 : x - foundNumber?.length - 1;
        const maxIdx = x >= midLine?.length ? x - 1 : x;

        // search top and bottom rows for valid numbers
        for (let y = minIdx; y <= maxIdx; y++) {
          if (
            (lastLine &&
              lastLine[y] !== '.' &&
              Number.isNaN(parseInt(lastLine[y], 10))) ||
            (topLine &&
              topLine[y] !== '.' &&
              Number.isNaN(parseInt(topLine[y], 10)))
          ) {
            // we found a special character that isn't a period, valid part number.
            validNumbers += parseInt(foundNumber, 10);
            foundNumber = '';
            // break out of the loop, no point checking other numbers
            break;
          }
        }

        // if we still have foundNumber, check the midLine, as top and bottom did not match
        if (foundNumber) {
          if (
            (midLine[minIdx] !== '.' &&
              Number.isNaN(parseInt(midLine[minIdx], 10))) ||
            (midLine[maxIdx] !== '.' &&
              Number.isNaN(parseInt(midLine[maxIdx], 10)))
          ) {
            // we found a special character that isn't a period, valid part number.
            validNumbers += parseInt(foundNumber, 10);
          }
        }
        // otherwise, we didn't find a valid number or need to reset the foundNumber anyway
        foundNumber = '';
      }
      // must just be a period otherwise, so move on
      continue;
    }
    // found a number in the grid, contunue searching for the end of the number
    foundNumber += midLine[x];
  }
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

  checkLine({
    topLine: topLineArr,
    midLine: midLineArr,
    lastLine: lastLineArr,
  });

  // move the lines up
  topLine = midLine;
  midLine = lastLine;
} while (lastLine);

console.log(validNumbers);
