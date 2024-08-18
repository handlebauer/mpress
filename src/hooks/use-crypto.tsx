import { useCallback, useState } from 'react'

import { useNavigate } from 'react-router-dom'
import { shallow } from 'zustand/shallow'

import { Store, TargetOperation, useStore } from '~/store'

export function useCrypto() {
  const navigate = useNavigate()
  const [error, setError] = useState<string>('')
  const { targetOperation, decrypt, encrypt } = useStore(
    (state: Store) => ({
      targetOperation: state.targetOperation,
      decrypt: state.decrypt,
      encrypt: state.encrypt,
    }),
    shallow,
  )

  const handleCrypto = useCallback(() => {
    const crypto =
      targetOperation === TargetOperation.DECRYPT ? decrypt : encrypt
    return void crypto()
      .then(() => navigate('/confirm', { replace: true }))
      .catch((err: string) => {
        console.error(err)
        setError(err)
      })
  }, [targetOperation, decrypt, encrypt, navigate])

  const clearError = useCallback(() => {
    setError('')
  }, [])

  return { handleCrypto, error, clearError }
}
