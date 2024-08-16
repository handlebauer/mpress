import { MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { invoke } from '@tauri-apps/api/tauri'

import { Store, useStore } from '~/store'

import { Button } from '~/components/ui/Button'
import { FolderOpen, Laugh, RotateCcw } from 'lucide-react'

export default function Success() {
  const navigate = useNavigate()

  const selector = (state: Store) =>
    [state.outputPath, state.resetState] as const
  const [outputPath, resetState] = useStore(selector)

  const handleRevealFileClick = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    event.preventDefault()
    invoke('show_file', { path: outputPath }).catch(console.error)
  }

  const handleStartOverClick = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    event.preventDefault()
    resetState()
    navigate('/', { replace: true })
  }

  return (
    <div className="flex flex-col items-center space-y-1">
      <div className="mb-2">
        <Laugh strokeWidth={1.5} />
      </div>
      <Button
        variant="outline"
        className="w-full space-x-1 text-xs"
        onClick={handleRevealFileClick}
      >
        <FolderOpen className="h-4 w-4" />
        <p>Reveal File</p>
      </Button>
      <Button
        variant="outline"
        className="w-full space-x-1 text-xs"
        onClick={handleStartOverClick}
      >
        <RotateCcw className="h-4 w-4" />
        <p>Start Over</p>
      </Button>
    </div>
  )
}
