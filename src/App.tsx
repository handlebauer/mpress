import { MouseEvent, useEffect, useState } from 'react'
import './App.css'

import { AppState, useAppState } from './hooks/app-state'

import Splash from './components/splash'
import AskFromMemory from './components/ask-from-memory'
import AskLongPress from './components/ask-long-press'
import AskPath from './components/ask-path'
import { Button } from './components/ui/button'
import { FolderOpen, Laugh, RotateCcw } from 'lucide-react'
import { invoke } from '@tauri-apps/api/tauri'

function Encrypt({
  doEncryption,
  redoAuth,
}: {
  doEncryption: () => Promise<boolean>
  redoAuth: () => void
}) {
  const [error, setError] = useState<string>('')

  const handleRedoAuth = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    event.preventDefault()
    redoAuth()
  }

  useEffect(() => {
    doEncryption()
      .then(console.log)
      .catch(() => setError('Authentication Failed'))
  }, [])

  if (error) {
    return (
      <div className="flex flex-col space-y-2">
        <Button
          variant="outline"
          className="space-x-1 text-xs"
          onClick={handleRedoAuth}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          <p>Try Again</p>
        </Button>
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <p>encrypting...</p>
    </div>
  )
}

function Decrypt({
  doDecryption,
  redoAuth,
}: {
  doDecryption: () => Promise<boolean>
  redoAuth: () => void
}) {
  const [error, setError] = useState<string>('')

  useEffect(() => {
    doDecryption()
      .then(console.log)
      .catch(() => setError('Authentication Failed'))
  }, [])

  const handleRedoAuth = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    event.preventDefault()
    redoAuth()
  }

  if (error) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <Button
          variant="outline"
          className="space-x-1 text-xs"
          onClick={handleRedoAuth}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          <p>Try Again</p>
        </Button>
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return <p>decrypting...</p>
}

function Success({ path, startOver }: { path: string; startOver: () => void }) {
  const handleRevealFileClick = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    event.preventDefault()
    invoke('show_in_fs', { path }).then(console.log).catch(console.error)
  }

  const handleStartOverClick = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    event.preventDefault()
    startOver()
  }

  return (
    <div className="flex flex-col items-center space-y-1">
      <div className="mb-2">
        <Laugh />
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

function Content() {
  const {
    state,
    selectFile,
    filename,
    fileExtension,
    path,
    isEncrypted,
    enterFromMemory,
    enterLongPress,
    startEncryption,
    doEncryption,
    startDecryption,
    doDecryption,
    startOver,
    redoAuth,
  } = useAppState()

  switch (state) {
    case AppState.SPLASH: {
      return <Splash onFileAccept={selectFile} />
    }
    case AppState.INPUT_FROM_MEMORY: {
      return <AskFromMemory onFromMemory={enterFromMemory} />
    }
    case AppState.INPUT_LONG_PRESS: {
      return <AskLongPress onLongPress={enterLongPress} />
    }
    case AppState.CRYPTO_READY: {
      return (
        <AskPath
          filename={filename}
          fileExtension={fileExtension}
          isEncrypted={isEncrypted}
          startEncryption={startEncryption}
          startDecryption={startDecryption}
        />
      )
    }
    case AppState.ENCRYPTING: {
      return <Encrypt doEncryption={doEncryption} redoAuth={redoAuth} />
    }
    case AppState.DECRYPTING: {
      return <Decrypt doDecryption={doDecryption} redoAuth={redoAuth} />
    }
    case AppState.SUCCESS: {
      return <Success path={path} startOver={startOver} />
    }
    default: {
      return <div>Nothing to see here</div>
    }
  }
}

export default function App() {
  return (
    <div className="h-100vh flex h-screen w-screen items-center justify-center font-mono text-xs">
      <Content />
    </div>
  )
}
