import { MouseEvent } from 'react'
import { RotateCcw } from 'lucide-react'

import { Button } from '~/components/ui/Button'

interface AuthFailureProps {
  onTryAgain: (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => void
}

export default function AuthFailure(props: AuthFailureProps) {
  return (
    <div className="flex flex-col items-center space-y-2">
      <Button
        variant="outline"
        className="space-x-1 text-xs"
        onClick={props.onTryAgain}
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        <p>Try Again</p>
      </Button>
      <p className="text-red-600">Auth Failed</p>
    </div>
  )
}
