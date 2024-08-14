import { MouseEvent, useEffect, useState } from 'react'
import { save } from '@tauri-apps/api/dialog'
import { Button } from './ui/button'
import { shortenPath } from '../lib/utils'
import { Lock, LockKeyholeOpen } from 'lucide-react'

interface AskPathProps {
  filename: string
  fileExtension: string
  isEncrypted: boolean | null
  startEncryption: (path: string) => void
  startDecryption: (path: string) => void
}

export default function AskPath({
  filename,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fileExtension,
  isEncrypted,
  startEncryption,
  startDecryption,
}: AskPathProps) {
  const [path, setPath] = useState<string | null>('')

  useEffect(() => {
    const promptSave = async () => {
      if (isEncrypted) {
        const nextFilename = filename.split('.enc').slice(0).join('') // strips .enc off end if present
        const opts = { defaultPath: nextFilename }
        await save(opts).then(setPath)
      } else {
        const filter = { name: 'Encrypted', extensions: [`enc`] }
        const opts = { defaultPath: filename, filters: [filter] }
        await save(opts).then(setPath)
      }
    }
    void promptSave()
  }, [])

  const handleClick = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    event.preventDefault()
    if (path) {
      if (isEncrypted) {
        startDecryption(path)
      } else {
        startEncryption(path)
      }
    }
  }

  const renderIcon = () =>
    isEncrypted ? (
      <LockKeyholeOpen className="mr-2 h-4 w-4" />
    ) : (
      <Lock className="mr-2 h-4 w-4" />
    )

  const renderLabel = () => <p>{isEncrypted ? 'Decrypt' : 'Encrypt'}</p>

  if (path) {
    return (
      <div className="flex w-screen flex-col space-y-3 p-3">
        <div className="flex-col space-y-1">
          <div className="flex items-center overflow-hidden rounded-sm bg-gray-100">
            <span className="w-10 border-r border-gray-200 bg-gray-200 p-1 text-right font-medium text-gray-800">
              src
            </span>
            <span className="flex-1 truncate p-1 text-xs font-normal text-gray-500">
              {filename}
            </span>
          </div>
          <div className="flex items-center overflow-hidden rounded-sm bg-gray-100">
            <span className="w-10 border-r border-gray-200 bg-gray-200 p-1 text-right font-medium text-gray-800">
              dest
            </span>
            <span className="flex-1 truncate p-1 text-xs font-normal text-gray-500">
              {shortenPath(path)}
            </span>
          </div>
        </div>
        <Button
          className="w-full border-gray-500 text-xs font-thin uppercase"
          onClick={handleClick}
        >
          {renderIcon()}
          {renderLabel()}
        </Button>
      </div>
    )
  }
}

// return (
//   <div className="flex flex-col items-center gap-1">
//     <p className="p-1">{path ? shortenPath(path) : ''}</p>
//     <Button
//       size="sm"
//       className="text-xs font-thin uppercase"
//       onClick={handleClick}
//     >
//       {renderIcon()}
//       {renderLabel()}
//     </Button>
//   </div>
// )
