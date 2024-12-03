import { saveConfig } from '@/api/config'
import { CONFIG_FILE } from '@/constants'

async function init() {
  const confExists = await Bun.file(CONFIG_FILE).exists()

  if (confExists) {
    console.log(`🎅 Your ${CONFIG_FILE} already exists, you're good to go!`)
    return
  }

  saveConfig({
    canSubmit: true,
    delayAmount: 0,
    delayStart: 0,
    totalStars: 0,
    totalTime: 0,
  })

  console.log(`🎅 AOC stats initialized. Time to get coding!`)
}

init()
