import { invoke } from '@tauri-apps/api/tauri'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function arrayBufferToStandardArray(data: ArrayBuffer) {
  return Array.from(new Uint8Array(data))
}

export function shortenPath(path: string) {
  // eslint-disable-next-line prefer-const
  let [first, ...rest] = path.slice(1).split('/')
  let [last] = rest.reverse()

  if (first.length > 10) first = first.slice(0, 5) + '..' + first.slice(-5)
  if (last.length > 10) last = last.slice(0, 4) + '..' + last.slice(-4)

  return `/${first}/.../${last}`
}

export function getFileExtension(data: number[]): Promise<string> {
  return invoke('get_file_type', { data })
}
