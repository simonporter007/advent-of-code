import chalk from "chalk";
import { saveConfig } from "@/api/config";
import { CONFIG_FILE, PROJECT_ROOT } from "@/constants";
import { strToNum } from "@/utils/numbers";
import { msToReadable, timeToReadable } from "@/utils/time";
import { JSDOM } from "jsdom";

export type Status = keyof typeof STATUSES;

const API_URL = Bun.env.AOC_API ?? "https://adventofcode.com";
const HEADERS = {
  Cookie: `session=${Bun.env.AOC_SESSION_KEY}`,
};
export const STATUSES = {
  ERROR: "ERROR",
  SOLVED: "SOLVED",
  WRONG: "WRONG",
} as const;

function handleErrors(e: Error) {
  if (e.message === "400" || e.message === "500") {
    console.log(
      chalk.red("INVALID SESSION KEY\n\n") +
        "Please make sure that the session key in the .env file is correct.\n" +
        "You can find your session key in the 'session' cookie at:\n" +
        "https://adventofcode.com\n\n" +
        chalk.bold("Restart the script after changing the .env file.\n"),
    );
  } else if (e.message.startsWith("5")) {
    console.log(chalk.red("SERVER ERROR"));
  } else if (e.message === "404") {
    console.log(chalk.yellow("CHALLENGE NOT YET AVAILABLE"));
  } else {
    console.log(
      chalk.red(
        "UNEXPECTED ERROR\nPlease check your internet connection.\n\nIf you think it's a bug, create an issue on github.\nHere are some details to include:\n",
      ),
    );
    console.log(e);
  }

  return STATUSES.ERROR;
}

export async function fetchInput({
  day,
  year,
}: {
  day: number;
  year?: number;
}) {
  if (!year) {
    year = new Date().getFullYear();
  }

  const response = await fetch(`${API_URL}/${year}/day/${day}/input`, {
    headers: HEADERS,
  });

  return await response.text();
}

export async function sendSolution({
  day,
  part,
  solution,
  year,
}: {
  day: number;
  part: 1 | 2;
  solution: number | string;
  year: number;
}) {
  const config = Bun.file(`${PROJECT_ROOT}/${CONFIG_FILE}`);
  const stats = await config.json();

  if (!stats.canSubmit) {
    const now = Date.now();
    const remainingMs = stats.delayAmount - (now - stats.delayStart);

    if (remainingMs <= 0) {
      stats.canSubmit = true;
    } else {
      console.log(chalk.red(`You have to wait: ${msToReadable(remainingMs)}`));
      return Promise.resolve(STATUSES.ERROR);
    }
  }

  const response = await fetch(`${API_URL}/${year}/day/${day}/answer`, {
    body: new URLSearchParams({
      answer: `${solution}`,
      level: `${part}`,
    }),
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      cookie: `session=${Bun.env.AOC_SESSION_KEY}`,
    },
    method: "POST",
  }).catch(handleErrors);

  if (response === STATUSES.ERROR) {
    throw new Error(String(response));
  }

  const body = await response.text();
  const $main = new JSDOM(body).window.document.querySelector("main");
  let status: Status = STATUSES.ERROR;

  const info =
    $main !== null
      ? ($main.textContent as string).replace(/\[.*\]/, "").trim()
      : "Can't find the main element";

  if (info.includes("That's the right answer")) {
    console.log(chalk.green(`PART ${part} SOLVED!`));
    return STATUSES.SOLVED;
  } else if (info.includes("That's not the right answer")) {
    console.log(chalk.red("WRONG ANSWER"));
    console.log(`\n${info}\n`);
    status = STATUSES.WRONG;
  } else if (info.includes("You gave an answer too recently")) {
    console.log(chalk.yellow("TOO SOON"));
  } else if (info.includes("You don't seem to be solving the right level")) {
    console.log(chalk.yellow("ALREADY COMPLETED or LOCKED"));
  } else {
    console.log(chalk.red("UNKNOWN RESPONSE\n"));
    console.log(`\n${info}\n`);
  }

  const waitStr = info.match(
    /(one|two|three|four|five|six|seven|eight|nine|ten) (second|minute|hour|day)/,
  );
  const waitNum = info.match(/\d+\s*(s|m|h|d)/g);

  if (waitStr !== null || waitNum !== null) {
    const waitTime: { [key: string]: number } = {
      d: 0,
      h: 0,
      m: 0,
      s: 0,
    };

    if (waitStr !== null) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, time, unit] = waitStr;
      waitTime[unit[0]] = strToNum(time);
    } else if (waitNum !== null) {
      waitNum.forEach((x) => {
        waitTime[x.slice(-1)] = Number(x.slice(0, -1));
      });
    }

    stats.canSubmit = false;
    stats.delayStart = Date.now();
    stats.delayAmount =
      (waitTime.d * 24 * 60 * 60 +
        waitTime.h * 60 * 60 +
        waitTime.m * 60 +
        waitTime.s) *
      1000;

    const delayStr = timeToReadable({
      d: waitTime.d,
      h: waitTime.h,
      m: waitTime.m,
      s: waitTime.s,
    });

    console.log(`Next request possible in: ${delayStr}`);
  }

  saveConfig(stats);

  return status;
}
