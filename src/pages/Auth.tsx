import { MouseEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { shallow } from 'zustand/shallow'

import { Store, TargetOperation, useStore } from '~/store'

import FromMemory from '~/components/auth/FromMemory'
import LongPress from '~/components/auth/LongPress'
import AuthFailure from '~/components/auth/AuthFailure'

enum AuthStage {
  'FROM_MEMORY',
  'LONG_PRESS',
  'FAILURE',
}

export default function Auth() {
  const navigate = useNavigate()
  const stateSelector = (state: Store) =>
    [
      state.targetOperation,
      state.setPass,
      state.decrypt,
      state.encrypt,
    ] as const
  const [targetOperation, setPass, decrypt, encrypt] = useStore(
    stateSelector,
    shallow,
  )
  const [authStage, setAuthStage] = useState(AuthStage.FROM_MEMORY)

  const handleTryAgain = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    event.preventDefault()
    setPass('')
    setAuthStage(AuthStage.FROM_MEMORY)
  }

  const handleProgressDone = (pass: string) => {
    switch (authStage) {
      case AuthStage.FROM_MEMORY: {
        setPass(pass)
        return void setAuthStage(AuthStage.LONG_PRESS)
      }
      case AuthStage.LONG_PRESS: {
        setPass(pass)
        if (targetOperation === TargetOperation.DECRYPT) {
          return void decrypt()
            .then(() => navigate('/confirm', { replace: true }))
            .catch(() => setAuthStage(AuthStage.FAILURE))
        }
        if (targetOperation === TargetOperation.ENCRYPT) {
          return void encrypt()
            .then(() => navigate('/confirm', { replace: true }))
            .catch(error => {
              console.error(error)
              return setAuthStage(AuthStage.FAILURE)
            })
        }
        throw new Error('Encountered invalid TargetOperation')
      }
      case AuthStage.FAILURE: {
        return <AuthFailure onTryAgain={handleTryAgain} />
      }
      default: {
        return <p>should never get here</p>
      }
    }
  }

  switch (authStage) {
    case AuthStage.FROM_MEMORY: {
      return <FromMemory onProgressDone={handleProgressDone} />
    }
    case AuthStage.LONG_PRESS: {
      return <LongPress onProgressDone={handleProgressDone} />
    }
    case AuthStage.FAILURE: {
      return <AuthFailure onTryAgain={handleTryAgain} />
    }
    default: {
      return <div>something went wrong</div>
    }
  }
}
