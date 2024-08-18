import { useNavigate } from 'react-router-dom'
import { useHotkeys } from 'react-hotkeys-hook'
import { appWindow } from '@tauri-apps/api/window'

import { useStore } from '~/store'

import AppRoutes from './routes'
import AppContainer from './components/layout/AppContainer'

import { useEffect } from 'react'
import useConfig from './hooks/use-config'
import { noop } from 'es-toolkit'

export default function App() {
  const navigate = useNavigate()
  const resetState = useStore(state => state.resetState)

  useConfig()

  useEffect(() => {
    const listenForOpenSettings = () => {
      return appWindow.listen('open-settings', () => {
        navigate('/settings', { replace: true })
      })
    }

    listenForOpenSettings().then(noop).catch(console.error)
  }, [])

  useHotkeys('mod+r', () => {
    resetState()
    navigate('/', { replace: true })
  })

  return (
    <AppContainer>
      <AppRoutes />
    </AppContainer>
  )
}
