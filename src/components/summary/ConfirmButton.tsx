import { MouseEvent } from 'react'
import { Lock, LockKeyholeOpen } from 'lucide-react'

import { Button } from '~/components/ui/Button'
import { TargetOperation } from '~/store'

interface ConfirmButtonProps {
  targetOperation: null | TargetOperation
  onConfirm: (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => void
}

export default function ConfirmButton(props: ConfirmButtonProps) {
  const renderIcon = () =>
    props.targetOperation ? (
      <LockKeyholeOpen className="mr-2 h-4 w-4" />
    ) : (
      <Lock className="mr-2 h-4 w-4" />
    )

  const renderLabel = () => (
    <p>
      {props.targetOperation === TargetOperation.DECRYPT
        ? 'Decrypt'
        : 'Encrypt'}
    </p>
  )

  return (
    <Button
      className="w-full border-gray-500 text-xs font-thin uppercase"
      onClick={props.onConfirm}
    >
      {renderIcon()}
      {renderLabel()}
    </Button>
  )
}
