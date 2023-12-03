import { getFileContents } from '@/utils/getFileContents';

const file = getFileContents();
let line: Buffer | false;

while ((line = file.next())) {
  const lineArr = `${line}`.split('');
  let total = 0;
  for (let [idx, direction] of lineArr.entries()) {
    if (direction === '(') {
      total += 1;
    } else if (direction === ')') {
      total -= 1;
    }
    if (total === -1) {
      console.log(idx + 1);
      break;
    }
  }
}
