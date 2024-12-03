import { CONFIG_FILE } from "@/constants";
import type { Config } from "@/types/types";

export async function readConfig() {
  const file = Bun.file(CONFIG_FILE);
  const contents = (await file.json()) as Config;
  return contents;
}

export function saveConfig(config: Config) {
  const data = JSON.stringify(config, null, 2);
  Bun.write(CONFIG_FILE, data);
}
