import { getFileContents } from '@/utils/getFileContents';

const file = getFileContents();
let line: Buffer | false;
let powerOfGames = 0;

while ((line = file.next())) {
  const [, cubes] = `${line}`.replace('Game ', '').split(':');
  const matches = cubes.matchAll(new RegExp(/(?<count>\d+) (?<colour>\w+)/g));
  const maxCubes = {
    red: 0,
    blue: 0,
    green: 0,
  };

  Array.from(matches)?.forEach((match) => {
    if (
      match?.groups?.count &&
      match?.groups?.colour &&
      match?.groups?.count > maxCubes[match?.groups?.colour]
    ) {
      maxCubes[match?.groups?.colour] = parseInt(match?.groups?.count, 10);
    }
  });

  powerOfGames += maxCubes.red * maxCubes.blue * maxCubes.green;
}
console.log(powerOfGames);
