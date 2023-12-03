import { getFileContents } from '@/utils/getFileContents';

type Directions = '^' | '>' | 'v' | '<';

function getCoords({
  direction,
  coords,
}: {
  direction: Directions;
  coords: number[];
}) {
  const [x, y] = coords;
  switch (direction) {
    case '^':
      return [x, y + 1];
    case '>':
      return [x + 1, y];
    case 'v':
      return [x, y - 1];
    case '<':
      return [x - 1, y];
    default:
      throw new Error('Invalid direction');
  }
}

const file = getFileContents();
let line: Buffer | false;
let coords = [0, 0];
const startingCoords = JSON.stringify([0, 0]);

while ((line = file.next())) {
  const directions = `${line}`.split('').map((direction) => {
    const newCoords = getCoords({ direction: direction as Directions, coords });
    coords = newCoords;
    return newCoords;
  });
  console.log(
    new Set([startingCoords, ...directions.map((dir) => JSON.stringify(dir))])
      ?.size
  );
}
