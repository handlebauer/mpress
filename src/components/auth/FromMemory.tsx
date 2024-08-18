import { useState } from 'react'
import OTPInput from 'react-otp-input'

interface FromMemoryProps {
  charLength: number
  onProgressDone: (pass: string) => void
}

export default function FromMemory(props: FromMemoryProps) {
  const [value, setValue] = useState<string>('')
  const progress = (value.length / props.charLength) * 100

  if (progress === 100) {
    return void props.onProgressDone(value)
  } else {
    const numerator = value.length
    const denonminator = props.charLength
    const fraction = `${numerator}/${denonminator}`
    return (
      <div className="flex flex-col items-center space-y-1">
        <p>from-memory</p>
        <OTPInput
          value={value}
          onChange={setValue}
          numInputs={props.charLength}
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
        <span className="pointer-events-none">{fraction}</span>
      </div>
    )
  }
}
