import { isNumber, isString } from "./primitives";

export const NUMBER_REGEX = /\d+/g;
export const stringNumbers: { [key: string]: number } = {
  eight: 8,
  five: 5,
  four: 4,
  nine: 9,
  one: 1,
  seven: 7,
  six: 6,
  ten: 10,
  three: 3,
  two: 2,
};

export function isBetween({
  max,
  min,
  x,
}: {
  x: number;
  min: number;
  max: number;
}) {
  return x >= min && x <= max;
}

export function isAsc<T extends number | string>(a: T, b: T) {
  if (isNumber(a) && isNumber(b)) {
    return a - b;
  } else if (isString(a) && isString(b)) {
    return a.localeCompare(b);
  }
  throw new Error("Invalid argument types");
}

export function isDesc<T extends number | string>(a: T, b: T) {
  if (isNumber(a) && isNumber(b)) {
    return b - a;
  } else if (isString(a) && isString(b)) {
    return b.localeCompare(a);
  }
  throw new Error("Invalid argument types");
}

export function strToNum(time: string) {
  return stringNumbers[time] || NaN;
}

export function findFirstNumber(input: string) {
  return input?.match(/(\d)/)?.[1]?.[0];
}

export function findLastNumber(input: string) {
  return input?.match(/(\d)(?!.*\d)/)?.[1]?.[0];
}

export function isStringNum(input?: string) {
  return input?.match(/[0-9]/);
}
