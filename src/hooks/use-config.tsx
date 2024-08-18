import { useEffect } from 'react'

import {
  exists,
  writeTextFile,
  BaseDirectory,
  readTextFile,
} from '@tauri-apps/api/fs'

import { Config, Store, useStore } from '~/store'

export default function useConfig() {
  const selector = (state: Store) => [state.config, state.setConfig] as const
  const [config, setConfig] = useStore(selector)

  async function reloadConfig() {
    const opts = { dir: BaseDirectory.AppConfig }
    const configFileExists = await exists('app.conf', opts)
    if (configFileExists) {
      const stringifiedConfig = await readTextFile('app.conf', opts)
      const config = JSON.parse(stringifiedConfig) as Config
      return setConfig(config)
    } else {
      await writeTextFile('app.conf', JSON.stringify(config), opts)
    }
  }

  useEffect(() => {
    reloadConfig().catch(console.error)
  }, [])

  return [config, setConfig, reloadConfig] as const
}
