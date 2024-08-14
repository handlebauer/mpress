import { useEffect, useState } from 'react'
import { checkIsEncryptedFile, decryptData, encryptData } from '../lib/crypto'
import { arrayBufferToStandardArray, getFileExtension } from '../lib/utils'

export enum AppState {
  SPLASH,
  INPUT_FROM_MEMORY,
  INPUT_LONG_PRESS,
  CRYPTO_READY,
  ENCRYPTING,
  DECRYPTING,
  SUCCESS,
}

export function useAppState() {
  const [state, setState] = useState<AppState>(AppState.SPLASH)
  const [filename, setFilename] = useState<string>('')
  const [fileExtension, setFileExtension] = useState<string>('')
  const [data, setData] = useState<number[] | null>(null)
  const [path, setPath] = useState<string>('')
  const [isEncrypted, setIsEncrypted] = useState<boolean | null>(null)

  const [pass, setPass] = useState<string>('')

  console.log({ state })

  useEffect(() => {
    if (data) {
      checkIsEncryptedFile(data)
        .then(result => setIsEncrypted(result as boolean))
        .catch(console.error)

      getFileExtension(data)
        .then(setFileExtension)
        .catch(() => setFileExtension('txt'))
    }
  }, [data])

  const selectFile = (filename: string, data: ArrayBuffer) => {
    const arrayData = arrayBufferToStandardArray(data)
    setFilename(filename)
    setData(arrayData)
    setState(AppState.INPUT_FROM_MEMORY)
  }

  const enterFromMemory = (passPart: string) => {
    setPass(passPart)
    setState(AppState.INPUT_LONG_PRESS)
  }

  const enterLongPress = (passPart: string) => {
    setPass(pass => pass + passPart)
    setState(AppState.CRYPTO_READY)
  }

  const startEncryption = (targetPath: string) => {
    setPath(targetPath)
    setState(AppState.ENCRYPTING)
  }

  const doEncryption = async () => {
    try {
      const result = await encryptData(path, pass, data as number[])
      setState(AppState.SUCCESS)
      return result
    } catch (error) {
      if (error instanceof Error) {
        console.error(error)
      }
      throw new Error(String(error))
    }
  }

  const startDecryption = (targetPath: string) => {
    setPath(targetPath)
    setState(AppState.DECRYPTING)
  }

  const doDecryption = async () => {
    try {
      const result = await decryptData(path, pass, data as number[])
      setState(AppState.SUCCESS)
      return result
    } catch (error) {
      if (error instanceof Error) {
        console.error(error)
      }
      throw new Error(String(error))
    }
  }

  const startOver = () => {
    setState(AppState.SPLASH)
  }

  const redoAuth = () => {
    setPass('')
    setState(AppState.INPUT_FROM_MEMORY)
  }

  return {
    state,
    data,
    selectFile,
    path,
    filename,
    fileExtension,
    isEncrypted,
    enterFromMemory,
    enterLongPress,
    startEncryption,
    doEncryption,
    startDecryption,
    doDecryption,
    startOver,
    redoAuth,
  }
}
