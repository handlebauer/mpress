import { delay } from 'es-toolkit'
import { useEffect, useState } from 'react'

interface AskLongPressProps {
  onLongPress: (passPart: string) => void
}

export default function AskLongPress({ onLongPress }: AskLongPressProps) {
  const [value, setValue] = useState<string>('')
  const valueMaxLength = 38
  const progress = (value.length / valueMaxLength) * 100

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Backspace') {
        setValue(prev => prev.slice(0, -1))
      } else if (event.key.length === 1) {
        // Single character keys
        setValue(prev => (prev + event.key).slice(0, valueMaxLength))
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  if (progress === 100) {
    delay(500)
      .then(() => onLongPress(value))
      .catch(console.error)
  } else {
    return (
      <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-1 p-4">
        <div>long-press</div>
        <div className="h-[18px] w-full rounded-sm bg-gray-200">
          <div
            className="h-[18px] rounded-sm bg-slate-950 transition-all duration-150 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p>{progress.toFixed(0)}%</p>
      </div>
    )
  }
}
