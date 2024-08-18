import { MouseEvent } from 'react'

import { CheckedState } from '@radix-ui/react-checkbox'
import { Slider } from '~/components/ui/Slider'
import { Checkbox } from '~/components/ui/Checkbox'
import { Button } from '~/components/ui/Button'

import { RotateCcw } from 'lucide-react'

import { FROM_MEMORY_DEFAULT_LENGTH } from '~/constants'

interface FromMemoryOptionsProps {
  min: number
  max: number
  length: number
  enabled: boolean
  onResetLengthClick: (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => void
  onLengthChange: (length: number[]) => void
  onEnableChange: (checked: CheckedState) => void
  onDoneClick: () => void
}

export default function FromMemoryOptions(props: FromMemoryOptionsProps) {
  return (
    <div className="space-y-7 p-2">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center space-x-2">
          <span>Character Length:</span>
          <span className="font-sans text-sm">{props.length}</span>
          {props.length !== FROM_MEMORY_DEFAULT_LENGTH && (
            <button onClick={props.onResetLengthClick}>
              <RotateCcw className="mr-2 h-4 w-4" />
            </button>
          )}
        </div>
        <div className="flex w-full space-x-2">
          <Slider
            value={[props.length]}
            min={props.min}
            max={props.max}
            step={1}
            className="w-full"
            onValueChange={props.onLengthChange}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex space-x-3">
          <span>Enabled:</span>
          <Checkbox
            className="scale-125"
            checked={props.enabled}
            onCheckedChange={props.onEnableChange}
          />
        </div>
        <Button size="sm" onClick={props.onDoneClick}>
          Done
        </Button>
      </div>
    </div>
  )
}
