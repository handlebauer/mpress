import { invoke } from '@tauri-apps/api/tauri'
import { createWithEqualityFn } from 'zustand/traditional'
import { arrayBufferToPlainArray, stringToPlainArray } from '~/lib/utils'

import {
  FROM_MEMORY_DEFAULT_LENGTH,
  FROM_MEMORY_MAX_LENGTH,
  FROM_MEMORY_MIN_LENGTH,
  LONG_PRESS_DEFAULT_LENGTH,
  LONG_PRESS_MAX_LENGTH,
  LONG_PRESS_MIN_LENGTH,
} from '~/constants'

import { BaseDirectory, writeTextFile } from '@tauri-apps/api/fs'

import { omit } from 'remeda'

export enum TargetOperation {
  'ENCRYPT',
  'DECRYPT',
}

type Pages = '/' | '/auth' | '/confirm' | '/success'

export type Config = {
  fromMemory: {
    enabled: boolean
    charLength: number
  }
  longPress: {
    enabled: boolean
    charLength: number
  }
}

type State = {
  config: Config
  currentPage: Pages
  fileName: string
  fileData: null | number[]
  targetOperation: null | TargetOperation
  initFileExtension: string
  postFileExtension: string
  fromMemory: string
  longPress: string
  fromMemoryMinLength: number
  fromMemoryMaxLength: number
  longPressMinLength: number
  longPressMaxLength: number
  outputPath: string
  outputData: null | number[] | string
}

type Actions = {
  setConfig: (config: Config) => Promise<void>
  setCurrentPage: (page: Pages) => void
  setFile: (fileName: string, arrayBuffer: ArrayBuffer) => Promise<void>
  setFromMemory: (input: string) => void
  setLongPress: (input: string) => void
  setOutputPath: (outputPath: null | string) => void
  decrypt: () => Promise<void>
  encrypt: () => Promise<void>
  saveOutput: () => Promise<boolean>
  resetState: () => void
}

export type Store = State & Actions

const initialState: State = {
  config: {
    fromMemory: { enabled: true, charLength: FROM_MEMORY_DEFAULT_LENGTH },
    longPress: { enabled: true, charLength: LONG_PRESS_DEFAULT_LENGTH },
  },
  currentPage: '/',
  fileName: '',
  fileData: null,
  targetOperation: null,
  initFileExtension: '',
  postFileExtension: '',
  fromMemory: '',
  longPress: '',
  fromMemoryMinLength: FROM_MEMORY_MIN_LENGTH,
  fromMemoryMaxLength: FROM_MEMORY_MAX_LENGTH,
  longPressMinLength: LONG_PRESS_MIN_LENGTH,
  longPressMaxLength: LONG_PRESS_MAX_LENGTH,
  outputPath: '',
  outputData: null,
}

export const useStore = createWithEqualityFn<Store>((set, get) => ({
  ...initialState,
  setConfig: async (config: Config) => {
    const opts = { dir: BaseDirectory.AppConfig }
    await writeTextFile('app.conf', JSON.stringify(config), opts)
    set({ config })
  },
  setCurrentPage: (page: Pages) => {
    set({ currentPage: page })
  },
  setFile: async (fileName: string, arrayBuffer: ArrayBuffer) => {
    const fileData = arrayBufferToPlainArray(arrayBuffer)

    const isEncrypted = await invoke('check_is_encrypted', { data: fileData })

    const targetOperation = (isEncrypted as boolean)
      ? TargetOperation.DECRYPT
      : TargetOperation.ENCRYPT

    set({ fileName, fileData, targetOperation })
  },
  setFromMemory: (input: string) => set({ fromMemory: input }),
  setLongPress: (input: string) => set({ longPress: input }),
  setOutputPath: (outputPath: null | string) =>
    set(state => ({ outputPath: outputPath || state.outputPath })),
  decrypt: async () => {
    const { fileData: data, fromMemory, longPress } = get()
    const pass = fromMemory + longPress || 'mpress'

    try {
      const decryptedData = await invoke('decrypt_data', { data, pass })
      set({ outputData: decryptedData as number[] })
    } catch (error) {
      console.log(error)
      throw new Error(String(error))
    }
  },
  encrypt: async () => {
    const { fileData: data, fromMemory, longPress } = get()
    const pass = fromMemory + longPress || 'mpress'
    try {
      const encryptedData = await invoke('encrypt_data', { data, pass })
      set({ outputData: encryptedData as string })
    } catch (error) {
      throw new Error(String(error))
    }
  },
  saveOutput: async (): Promise<boolean> => {
    const { outputData: data, outputPath: path } = get()

    try {
      if (typeof data === 'string') {
        return invoke('write_data_to_file', {
          data: stringToPlainArray(data),
          path,
        })
      } else {
        return invoke('write_data_to_file', { data, path })
      }
    } catch (error) {
      throw new Error(String(error))
    }
  },
  resetState: () => set(omit(initialState, ['config'])),
}))
