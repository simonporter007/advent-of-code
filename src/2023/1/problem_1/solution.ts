import { getFileContents } from '@/utils/getFileContents';

const file = getFileContents();
let line: Buffer | false;
let total = 0;

while ((line = file.next())) {
  const lineArr = `${line}`.split('');
  const firstDigit = lineArr.find((char) => char?.match(/[0-9]/));
  const lastDigit = lineArr.findLast((char) => char?.match(/[0-9]/));

  total += Number(`${firstDigit}${lastDigit}`);
}

console.log(total);
