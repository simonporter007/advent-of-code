import { getFileContents } from '@/utils/getFileContents';

const numbers = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
} as const;

const file = getFileContents();
let line: Buffer | false;
let total = 0;

while ((line = file.next())) {
  let firstIdx: number | undefined = undefined;
  let firstNumber = 0;
  let lastIdx: number | undefined = undefined;
  let lastNumber = 0;

  Object.entries(numbers).forEach(([word, number]) => {
    // search line for digits
    const lineArr = `${line}`.split('');
    const firstNumberIdx = lineArr.findIndex(
      (char) => char?.match(new RegExp(`${number}`))
    );
    const lastNumberIdx = lineArr.findLastIndex(
      (char) => char?.match(new RegExp(`${number}`))
    );
    if (typeof firstNumberIdx === 'number' && firstNumberIdx >= 0) {
      if (firstIdx === undefined || firstNumberIdx < firstIdx) {
        firstIdx = firstNumberIdx;
        firstNumber = number;
      }
      if (typeof lastNumberIdx === 'number' && lastNumberIdx >= 0)
        if (lastIdx === undefined || lastNumberIdx > lastIdx) {
          lastIdx = lastNumberIdx;
          lastNumber = number;
        }
    }

    // search line for words as digits
    const wordMatches = `${line}`.matchAll(new RegExp(word, 'g'));
    for (let match of wordMatches) {
      if (typeof match?.index === 'number' && match?.index >= 0) {
        if (firstIdx === undefined || match?.index < firstIdx) {
          firstIdx = match?.index;
          firstNumber = number;
        }
        if (lastIdx === undefined || match?.index > lastIdx) {
          lastIdx = match?.index;
          lastNumber = number;
        }
      }
    }
  });

  total += Number(`${firstNumber}${lastNumber}`);
}

console.log(total);
