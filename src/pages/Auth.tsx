import { useCallback, useEffect, useMemo } from 'react'
import { shallow } from 'zustand/shallow'

import { Store, useStore } from '~/store'

import FromMemory from '~/components/auth/FromMemory'
import LongPress from '~/components/auth/LongPress'
import { useCrypto } from '~/hooks/use-crypto'
import AuthFailure from '~/components/auth/AuthFailure'
// import AuthFailure from '~/components/auth/AuthFailure'

function useAuthComponents() {
  const { config, fromMemory, longPress, setFromMemory, setLongPress } =
    useStore(
      (state: Store) => ({
        config: state.config,
        fromMemory: state.fromMemory,
        longPress: state.longPress,
        setFromMemory: state.setFromMemory,
        setLongPress: state.setLongPress,
      }),
      shallow,
    )

  const handleFromMemoryDone = useCallback(
    (input: string) => {
      setFromMemory(input)
    },
    [setFromMemory],
  )

  const handleLongPressDone = useCallback(
    (input: string) => {
      setLongPress(input)
    },
    [setLongPress],
  )

  const components = useMemo(
    () => [
      {
        Component: FromMemory,
        props: {
          charLength: config.fromMemory.charLength,
          onProgressDone: handleFromMemoryDone,
        },
        shouldRender: config.fromMemory.enabled && !fromMemory,
      },
      {
        Component: LongPress,
        props: {
          charLength: config.longPress.charLength,
          onProgressDone: handleLongPressDone,
        },
        shouldRender: config.longPress.enabled && !longPress,
      },
    ],
    [config, fromMemory, longPress, handleFromMemoryDone, handleLongPressDone],
  )

  return {
    activeComponent: components.find(({ shouldRender }) => shouldRender),
    setFromMemory,
    setLongPress,
  }
}

export default function Auth() {
  const setCurrentPage = useStore(state => state.setCurrentPage, shallow)
  const { handleCrypto, error, clearError } = useCrypto()
  const { activeComponent, setFromMemory, setLongPress } = useAuthComponents()

  useEffect(() => {
    setCurrentPage('/auth')
  }, [setCurrentPage])

  useEffect(() => {
    if (!activeComponent && !error) {
      handleCrypto()
    }
  }, [activeComponent, handleCrypto, error])

  const handleTryAgain = useCallback(
    (event: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
      event.preventDefault()
      setFromMemory('')
      setLongPress('')
      clearError()
    },
    [setFromMemory, setLongPress],
  )

  if (error) {
    return <AuthFailure onTryAgain={handleTryAgain} />
  }

  if (activeComponent) {
    const { Component, props } = activeComponent
    return <Component {...props} />
  }

  return null
}
