import { useState } from 'react'
import clsx from 'clsx'

import OTPInput from 'react-otp-input'

interface AskFromMemoryProps {
  onFromMemory: (passPart: string) => void
}

export default function AskFromMemory({ onFromMemory }: AskFromMemoryProps) {
  const [value, setFromMemory] = useState<string>('')
  const valueMaxLength = 5
  const progress = (value.length / valueMaxLength) * 100

  if (progress === 100) {
    return void onFromMemory(value)
  }

  const inputStyles = clsx(
    progress === 100 && 'bg-gray-50',
    progress === 100 && 'select-none',
    'border',
    'border-slate-300',
    'outline-none',
    'ring-1',
    'ring-gray-50',
  )

  return (
    <div className="flex flex-col items-center space-y-1">
      <p>from-memory</p>
      <OTPInput
        value={value}
        onChange={setFromMemory}
        numInputs={5}
        renderSeparator={<span className="px-[1px]"></span>}
        renderInput={props => (
          <input
            {...props}
            type="password"
            className={inputStyles}
            disabled={progress === 100}
          />
        )}
        shouldAutoFocus
      />
      <p>{(progress / 20).toFixed(0)}/5</p>
    </div>
  )
}
