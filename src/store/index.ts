import { invoke } from '@tauri-apps/api/tauri'
import { createWithEqualityFn } from 'zustand/traditional'
import { arrayBufferToPlainArray, stringToPlainArray } from '~/lib/utils'

export enum TargetOperation {
  'ENCRYPT',
  'DECRYPT',
}

type State = {
  fileName: string
  fileData: null | number[]
  targetOperation: null | TargetOperation
  initFileExtension: string
  postFileExtension: string
  pass: string
  outputPath: string
  outputData: null | number[] | string
}

type Actions = {
  setFile: (fileName: string, arrayBuffer: ArrayBuffer) => Promise<void>
  setPass: (passPart: string) => void
  setOutputPath: (outputPath: null | string) => void
  decrypt: () => Promise<void>
  encrypt: () => Promise<void>
  saveOutput: () => Promise<boolean>
  resetState: () => void
}

export type Store = State & Actions

const initialState: State = {
  fileName: '',
  fileData: null,
  targetOperation: null,
  initFileExtension: '',
  postFileExtension: '',
  pass: '',
  outputPath: '',
  outputData: null,
}

export const useStore = createWithEqualityFn<Store>((set, get) => ({
  ...initialState,
  setFile: async (fileName: string, arrayBuffer: ArrayBuffer) => {
    const fileData = arrayBufferToPlainArray(arrayBuffer)

    const isEncrypted = await invoke('check_is_encrypted', { data: fileData })

    const targetOperation = (isEncrypted as boolean)
      ? TargetOperation.DECRYPT
      : TargetOperation.ENCRYPT

    return set({ fileName, fileData, targetOperation })
  },
  setPass: (passPart: string) =>
    set(({ pass }) => ({ pass: passPart ? pass + passPart : '' })),
  setOutputPath: (outputPath: null | string) =>
    set({ outputPath: outputPath || '' }),
  decrypt: async () => {
    const { fileData: data, pass } = get()

    try {
      const decryptedData = await invoke('decrypt_data', { data, pass })
      set({ outputData: decryptedData as number[] })
    } catch (error) {
      console.log(error)
      throw new Error(String(error))
    }
  },
  encrypt: async () => {
    const { fileData: data, pass } = get()
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
  resetState: () => {
    set(initialState)
  },
}))
