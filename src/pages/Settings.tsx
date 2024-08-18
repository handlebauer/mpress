import { useState } from 'react'

import { MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Config, Store, useStore } from '~/store'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/Tabs'
import ConfirmDialog from '~/components/ui/ConfirmDialog'

import FromMemoryOptions from '~/components/settings/FromMemoryOptions'
import LongPressOptions from '~/components/settings/LongPressOptions'
import useConfig from '~/hooks/use-config'
import { CheckedState } from '@radix-ui/react-checkbox'
import {
  FROM_MEMORY_DEFAULT_LENGTH,
  LONG_PRESS_DEFAULT_LENGTH,
} from '~/constants'

export default function Settings() {
  const navigate = useNavigate()
  const [config, setConfig] = useConfig()
  const [confirmed, setConfirmed] = useState<boolean>(false)

  const selector = (state: Store) =>
    [
      state.currentPage,
      state.fromMemoryMinLength,
      state.fromMemoryMaxLength,
      state.longPressMinLength,
      state.longPressMaxLength,
    ] as const

  const [
    currentPage,
    fromMemoryMinLength,
    fromMemoryMaxLength,
    longPressMinLength,
    longPressMaxLength,
  ] = useStore(selector)

  const isMidProcess = ['/auth', '/confirm'].includes(currentPage)

  const handleGoBackClick = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    event.preventDefault()
    navigate(currentPage, { replace: true })
  }

  const handleContinueClick = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    event.preventDefault()
    setConfirmed(true)
  }

  if (confirmed === false && isMidProcess) {
    return (
      <ConfirmDialog
        affirmativeText="Continue"
        negativeText="Go Back"
        onAffirmativeClick={handleContinueClick}
        onNegativeClick={handleGoBackClick}
      >
        All progress will be lost
      </ConfirmDialog>
    )
  }

  const handleResetFromMemoryLengthClick = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    event.preventDefault()
    const nextFromMemory = {
      ...config.fromMemory,
      charLength: FROM_MEMORY_DEFAULT_LENGTH,
    }
    const nextConfig: Config = { ...config, fromMemory: nextFromMemory }
    setConfig(nextConfig).catch(console.error)
  }

  const handleFromMemoryLengthChange = (values: number[]) => {
    const [value] = values

    const nextFromMemory = { ...config.fromMemory, charLength: value }
    const nextConfig: Config = { ...config, fromMemory: nextFromMemory }
    setConfig(nextConfig).catch(console.error)
  }

  const handleFromMemoryEnableChange = (checked: CheckedState) => {
    if (checked === 'indeterminate') return

    const nextFromMemory = { ...config.fromMemory, enabled: checked }
    const nextConfig: Config = { ...config, fromMemory: nextFromMemory }
    setConfig(nextConfig).catch(console.error)
  }

  const handleResetLongPressLengthClick = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    event.preventDefault()
    const nextLongPress = {
      ...config.longPress,
      charLength: LONG_PRESS_DEFAULT_LENGTH,
    }
    const nextConfig: Config = { ...config, longPress: nextLongPress }
    setConfig(nextConfig).catch(console.error)
  }

  const handleLongPressLengthChange = (values: number[]) => {
    const [value] = values

    const nextLongPress = { ...config.longPress, charLength: value }
    const nextConfig: Config = { ...config, longPress: nextLongPress }
    setConfig(nextConfig).catch(console.error)
  }

  const handleLongPressEnableChange = (checked: CheckedState) => {
    if (checked === 'indeterminate') return

    const nextLongPress = { ...config.longPress, enabled: checked }
    const nextConfig: Config = { ...config, longPress: nextLongPress }
    setConfig(nextConfig).catch(console.error)
  }

  const handleDoneClick = () => {
    navigate('/', { replace: true })
  }

  return (
    <Tabs defaultValue="from-memory" className="h-screen w-[240px]">
      <TabsList className="w-full rounded-none bg-slate-300 text-slate-900">
        <TabsTrigger value="from-memory">from-memory</TabsTrigger>
        <TabsTrigger value="long-press">long-press</TabsTrigger>
      </TabsList>
      <TabsContent value="from-memory" className="px-2">
        <FromMemoryOptions
          min={fromMemoryMinLength}
          max={fromMemoryMaxLength}
          length={config.fromMemory.charLength}
          enabled={config.fromMemory.enabled}
          onResetLengthClick={handleResetFromMemoryLengthClick}
          onLengthChange={handleFromMemoryLengthChange}
          onEnableChange={handleFromMemoryEnableChange}
          onDoneClick={handleDoneClick}
        />
      </TabsContent>
      <TabsContent value="long-press" className="px-2">
        <LongPressOptions
          min={longPressMinLength}
          max={longPressMaxLength}
          length={config.longPress.charLength}
          enabled={config.longPress.enabled}
          onResetLengthClick={handleResetLongPressLengthClick}
          onLengthChange={handleLongPressLengthChange}
          onEnableChange={handleLongPressEnableChange}
          onDoneClick={handleDoneClick}
        />
      </TabsContent>
    </Tabs>
  )
}
