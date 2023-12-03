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
let deliverer = 'santa';
const startingCoords = JSON.stringify([0, 0]);
const coords = {
  santa: [0, 0],
  robo: [0, 0],
};

while ((line = file.next())) {
  const directions = `${line}`.split('').map((direction) => {
    const currentDeliverer = deliverer;
    const newCoords = getCoords({
      direction: direction as Directions,
      coords: coords[deliverer],
    });
    coords[currentDeliverer] = newCoords;
    deliverer = deliverer === 'santa' ? 'robo' : 'santa';
    return { deliverer: currentDeliverer, newCoords };
  });

  console.log(
    new Set([
      startingCoords,
      ...directions
        .filter((direction) => direction?.deliverer === 'santa')
        .map((dir) => JSON.stringify(dir.newCoords)),
      ...directions
        .filter((direction) => direction?.deliverer === 'robo')
        .map((dir) => JSON.stringify(dir.newCoords)),
    ])?.size
  );
}
