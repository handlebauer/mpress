import { Route, Routes } from 'react-router-dom'

import Auth from '~/pages/Auth'
import Confirm from '~/pages/Confirm'
import Home from '~/pages/Home'
import Settings from '~/pages/Settings'
import Success from '~/pages/Success'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/confirm" element={<Confirm />} />
      <Route path="/success" element={<Success />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  )
}
