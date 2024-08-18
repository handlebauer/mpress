import { delay, noop } from 'es-toolkit'
import { useEffect, useState } from 'react'
import { LONG_PRESS_DEFAULT_LENGTH } from '~/constants'

interface LongPressProps {
  charLength: number
  onProgressDone: (value: string) => void
}

export default function LongPress(props: LongPressProps) {
  const [value, setValue] = useState<string>('')
  const progress = (value.length / props.charLength) * 100

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Backspace') {
        setValue(prev => prev.slice(0, -1))
      } else if (event.key.length === 1) {
        // Single character keys
        setValue(prev => (prev + event.key).slice(0, LONG_PRESS_DEFAULT_LENGTH))
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  if (progress === 100) {
    delay(50)
      .then(() => props.onProgressDone(value))
      .catch(noop)
  }
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-1 p-4">
      <div>long-press</div>
      <div className="h-[18px] w-full rounded-sm bg-gray-200">
        <div
          className="h-[18px] rounded-sm bg-slate-950 transition-all duration-75 ease-in-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p>{progress.toFixed(0)}%</p>
    </div>
  )
}
