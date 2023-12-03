import { getFileContents } from '@/utils/getFileContents';

const file = getFileContents();
let line: Buffer | false;
let eligibleGames = 0;
const maxCubes = {
  red: 12,
  green: 13,
  blue: 14,
};

while ((line = file.next())) {
  const [gameId, cubes] = `${line}`.replace('Game ', '').split(':');
  const matches = cubes.matchAll(new RegExp(/(?<count>\d+) (?<colour>\w+)/g));

  const isEligibleGame = Array.from(matches)?.every((match) => {
    return (
      match?.groups?.count &&
      match?.groups?.colour &&
      match?.groups?.count <= maxCubes[match?.groups?.colour]
    );
  });

  eligibleGames += isEligibleGame ? parseInt(gameId, 10) : 0;
}
console.log(eligibleGames);
