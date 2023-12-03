import { getFileContents } from '@/utils/getFileContents';

const file = getFileContents();
let line: Buffer | false;
let total = 0;

while ((line = file.next())) {
  const [length, width, height] = `${line}`
    .split('x')
    .map((num) => parseInt(num, 10));
  const [shortFace, secondShortFace] = [length, width, height].sort(
    (a, b) => a - b
  );
  const bowLength = length * width * height;
  const ribbonLength = 2 * shortFace + 2 * secondShortFace + bowLength;
  total += ribbonLength;
}
console.log(total);
