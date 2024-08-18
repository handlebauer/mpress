import { MouseEvent } from 'react'
import { Lock, LockKeyholeOpen } from 'lucide-react'

import { Button } from '~/components/ui/Button'
import { TargetOperation } from '~/store'

interface ConfirmButtonProps {
  targetOperation: null | TargetOperation
  outputPath: string
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
      disabled={!props.outputPath}
      onClick={props.onConfirm}
      className="w-full select-none border-gray-500 text-xs font-thin uppercase"
    >
      {renderIcon()}
      {renderLabel()}
    </Button>
  )
}
