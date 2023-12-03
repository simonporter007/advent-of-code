import { getFileContents } from '@/utils/getFileContents';

const file = getFileContents();
let line: Buffer | false;
let total = 0;

while ((line = file.next())) {
  const [length, width, height] = `${line}`
    .split('x')
    .map((num) => parseInt(num, 10));
  const shortestSide = Math.min(
    length * width,
    width * height,
    height * length
  );
  const ribbonLength =
    2 * length * width +
    2 * width * height +
    2 * height * length +
    shortestSide;
  total += ribbonLength;
}
console.log(total);
