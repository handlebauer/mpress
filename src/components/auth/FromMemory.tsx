import { useState } from 'react'
import OTPInput from 'react-otp-input'
import { FROM_MEMORY_MAX_LENGTH } from '~/constants'

interface FromMemoryProps {
  onProgressDone: (pass: string) => void
}

export default function FromMemory(props: FromMemoryProps) {
  const [value, setValue] = useState<string>('')
  const progress = (value.length / FROM_MEMORY_MAX_LENGTH) * 100

  if (progress === 100) {
    return void props.onProgressDone(value)
  } else {
    return (
      <div className="flex flex-col items-center space-y-1">
        <p>from-memory</p>
        <OTPInput
          value={value}
          onChange={setValue}
          numInputs={5}
          renderSeparator={<span className="px-[1px]"></span>}
          renderInput={props => (
            <input
              {...props}
              type="password"
              className="border border-slate-300 outline-none ring-1 ring-gray-50"
              disabled={progress === 100}
            />
          )}
          shouldAutoFocus
        />
        <p>{(progress / 20).toFixed(0)}/5</p>
      </div>
    )
  }
}
