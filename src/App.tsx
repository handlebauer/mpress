import { useHotkeys } from 'react-hotkeys-hook'
import { useNavigate } from 'react-router-dom'
import { appWindow } from '@tauri-apps/api/window'
import { useStore } from '~/store'

import AppRoutes from './routes'
import AppContainer from './components/layout/AppContainer'

import { noop } from 'es-toolkit'

export default function App() {
  const navigate = useNavigate()
  const resetState = useStore(state => state.resetState)

  appWindow
    .listen('open-settings', () => {
      navigate('/settings', { replace: true })
    })
    .then(noop)
    .catch(console.error)

  useHotkeys('mod+r', () => {
    resetState()
    return navigate('/', { replace: true })
  })

  return (
    <AppContainer>
      <AppRoutes />
    </AppContainer>
  )
}
