import { getFileContents } from '@/utils/getFileContents';

const file = getFileContents();
let line: Buffer | false;

while ((line = file.next())) {
  const lineArr = `${line}`.split('');
  const goUpCount = lineArr.filter((char) => char === '(').length;
  const goDownCount = lineArr.filter((char) => char === ')').length;
  console.log(goUpCount - goDownCount);
}
