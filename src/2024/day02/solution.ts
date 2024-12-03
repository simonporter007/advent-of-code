import { join } from "node:path";
import { MOCKS_DIR } from "@/constants";
import { parseLines, readInput } from "@/utils/file-io";
import { N } from "vitest/dist/chunks/reporters.anwo7Y6a.js";

export function part1(input: string) {
  const lines = parseLines(input);
  let safe = 0;

  for (let i = 0; i < lines.length; i++) {
    const report = lines[i].split(" ").map((str) => parseInt(str, 10));
    let order: "increasing" | "decreasing" | undefined;

    while (report.length > 0) {
      const curr = report.shift()!;
      const next = report.shift()!;
      const diff = next - curr;

      if (diff > 0) {
        // if we already have order, and it's decreasing previously, it's now increasing meaning unsafe
        if (order === "decreasing") break;
        order = "increasing";
      } else if (diff < 0) {
        // if we already have order, and it's increasing previously, it's now decreasing meaning unsafe
        if (order === "increasing") break;
        order = "decreasing";
      } else {
        // next - curr === 0, which means we're not increasing or decreasing and therefore not safe.
        break;
      }

      // otherwise, we've set order for the first time, or it's the same as before, make sure the levels difference is acceptable
      if (Math.abs(diff) > 3) {
        // unsafe as difference is more than 3
        break;
      }

      // otherwise, safety level passes
      if (!report.length) {
        safe += 1;
      } else {
        report.unshift(next);
      }
    }
  }

  return safe;
}

// function maybeRetry({
//   idx,
//   report,
//   retry,
// }: {
//   idx: number;
//   report: number[];
//   retry: boolean;
// }) {
//   if (retry) {
//     // try again with problem dampener ignoring the problem, but ignoring the specific number which caused the error
//     const safeAfterRetry =
//       isSafe({
//         report: [
//           ...report.slice(0, idx),
//           ...report.slice(idx + 1, report.length),
//         ],
//         retry: false,
//       }) ||
//       isSafe({
//         report: [
//           ...report.slice(0, idx + 1),
//           ...report.slice(idx + 2, report.length),
//         ],
//         retry: false,
//       });
//     if (!safeAfterRetry) {
//       console.log(report);
//     }
//     return safeAfterRetry;
//   }

//   return false;
// }

function isSafe({ report }: { report: number[]; lines?: string[] }) {
  const origLength = report.length;
  let order: "increasing" | "decreasing" | undefined;
  let errors = 0;
  let i = 0;

  while (i < report.length - 1) {
    const curr = report[i];
    const next = report[i + 1];
    const diff = next - curr;

    if (diff > 0) {
      // if we already have order, and it's decreasing previously, it's now increasing meaning unsafe
      if (order === "decreasing") {
        errors += 1;
      } else {
        order = "increasing";
      }
    } else if (diff < 0) {
      // if we already have order, and it's increasing previously, it's now decreasing meaning unsafe
      if (order === "increasing") {
        errors += 1;
      } else {
        order = "decreasing";
      }
    } else {
      // next - curr === 0, which means we're not increasing or decreasing and therefore not safe.
      errors += 1;
    }

    if (errors === 1) {
      if (report.length === origLength) {
        return [
          [...report.slice(0, i), ...report.slice(i + 1, report.length)],
          [...report.slice(0, i + 1), ...report.slice(i + 2, report.length)],
        ];
      }
    }

    // otherwise, we've set order for the first time, or it's the same as before, make sure the levels difference is acceptable
    if (Math.abs(diff) > 3) {
      // unsafe as difference is more than 3
      errors += 1;
    }

    if (errors > 1) {
      // no hope with this one, unsafe after problem dampener
      console.log(report);
      return false;
    }

    // otherwise, safety level passes
    if (errors === 1) {
      if (report.length === origLength) {
        return [
          [...report.slice(0, i), ...report.slice(i + 1, report.length)],
          [...report.slice(0, i + 1), ...report.slice(i + 2, report.length)],
        ];
      }
    } else {
      // otherwise, normal case of traversing the list, add back the next number to become current in next loop
      i++;
    }
  }

  return [];
}

export function part2(input: string) {
  const lines = parseLines(input);
  let safe = 0;

  for (let i = 0; i < lines.length; i++) {
    const report = lines[i].split(" ").map((str) => parseInt(str, 10));
    // const duplicates = report
    //   .map((_, idx, report) =>
    //     report[idx] === report[idx + 1] ? [idx] : false,
    //   )
    //   .filter(Boolean);
    // const differences = report
    //   .map((_, idx, report) =>
    //     Math.abs(report[idx] - report[idx + 1]) > 3 ? [idx, idx + 1] : false,
    //   )
    //   .filter(Boolean);

    // const changeDirection = report
    //   .map((_, idx, report) => {
    //     const diff = report[idx] - report[idx + 1];
    //     if (diff > 0) {
    //       return "decreasing";
    //     } else if (diff < 0) {
    //       return "increasing";
    //     }
    //   })
    //   .filter(Boolean);
    // const decreasingDirection = changeDirection.filter(
    //   (type) => type === "decreasing",
    // ).length;
    // const increasingDirection = changeDirection.filter(
    //   (type) => type === "increasing",
    // ).length;

    // const errors = [...duplicates, ...differences, ...changeDirection].flat();
    // const isSafe = errors.length - new Set(errors).size < 2;

    // console.log({
    //   changeDirection,
    //   decreasingDirection,
    //   differences,
    //   duplicates,
    //   errors,
    //   increasingDirection,
    //   isSafe,
    //   report,
    // });

    const needsChecking = isSafe({ report });
    const safeCount = 0;
    if (!needsChecking) {
      continue;
    } else {
      if (needsChecking?.length === 0) {
        safe += 1;
      } else {
        for (const modifiedreport of needsChecking) {
          const isSafeCheck = isSafe({ report: modifiedreport });
          if (!isSafeCheck) continue;
          safe += isSafeCheck?.length === 0 ? 1 : 0;
        }
      }
    }
  }

  return safe;
}

if (Bun.env.debug === "true") {
  async function debug() {
    const input = await readInput({
      day: "day02",
      // inputFilePath: join(MOCKS_DIR, "input.part1.example.txt"),
      inputFilePath: join(MOCKS_DIR, "input.part2.initial.txt"),
      year: 2024,
    });
    part1(input);
    part2(input);
  }
  debug();
}
