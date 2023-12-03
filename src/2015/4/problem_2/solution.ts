import { Md5 } from 'ts-md5';
import { getFileContents } from '@/utils/getFileContents';

const file = getFileContents();
let line: Buffer | false;

while ((line = file.next())) {
  let md5Hash = '';
  let i = 0;
  while (!md5Hash.startsWith('000000')) {
    md5Hash = Md5.hashStr(`${line}${++i}`);
  }
  console.log(i);
}
