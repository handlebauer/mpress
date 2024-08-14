import { invoke } from '@tauri-apps/api/tauri'

export function encryptData(
  path: string,
  pass: string,
  data: number[],
): Promise<boolean> {
  return invoke('encrypt_file', { path, pass, data })
}

export function decryptData(
  path: string,
  pass: string,
  data: number[],
): Promise<boolean> {
  return invoke('decrypt_file', { path, pass, data })
}

export function checkIsEncryptedFile(data: number[]) {
  return invoke('check_is_encrypted_file', { data })
}
