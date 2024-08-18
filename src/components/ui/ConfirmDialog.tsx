import { MouseEvent, ReactNode } from 'react'
import { Button } from './Button'

interface ConfirmDialogProps {
  children: ReactNode
  affirmativeText?: string
  negativeText?: string
  onNegativeClick: (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => void
  onAffirmativeClick: (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => void
}

export default function ConfirmDialog(props: ConfirmDialogProps) {
  return (
    <div className="flex flex-col space-y-3">
      <p>{props.children}</p>
      <div className="flex justify-center space-x-1">
        <Button
          size="sm"
          variant="outline"
          className="border-gray-500 text-xs uppercase"
          onClick={props.onNegativeClick}
        >
          {props.negativeText || 'Cancel'}
        </Button>
        <Button
          size="sm"
          className="border-gray-500 text-xs uppercase"
          onClick={props.onAffirmativeClick}
        >
          {props.affirmativeText || 'Confirm'}
        </Button>
      </div>
    </div>
  )
}
