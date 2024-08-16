import { MouseEvent, useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'

import { Store, TargetOperation, useStore } from '~/store'

import ConfirmButton from '~/components/summary/ConfirmButton'
import SummaryContainer from '~/components/summary/SummaryContainer'
import SummaryPaths from '~/components/summary/SummaryPaths'

import { save } from '@tauri-apps/api/dialog'

export default function Confirm() {
  const navigate = useNavigate()

  const selector = (state: Store) =>
    [
      state.fileName,
      state.outputPath,
      state.setOutputPath,
      state.setPass,
      state.targetOperation,
      state.saveOutput,
    ] as const
  const [
    fileName,
    outputPath,
    setOutputPath,
    setPass,
    targetOperation,
    saveOutput,
  ] = useStore(selector)

  const [wasPrompted, setWasPrompted] = useState<boolean>(false)

  async function promptSave() {
    if (targetOperation === TargetOperation.DECRYPT) {
      const decryptedFileName = fileName.endsWith('.enc')
        ? fileName.slice(0, -4)
        : fileName
      const opts = { defaultPath: decryptedFileName }
      await save(opts).then(setOutputPath)
    }
    if (targetOperation === TargetOperation.ENCRYPT) {
      const filter = { name: 'Encrypted', extensions: [`enc`] }
      const opts = { defaultPath: fileName, filters: [filter] }
      await save(opts).then(setOutputPath)
    }
    return true
  }

  useEffect(() => {
    void promptSave().then(setWasPrompted)
  }, [])

  const handleModifyPathClick = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    event.preventDefault()
    void promptSave()
  }

  const handleConfirm = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    event.preventDefault()
    saveOutput()
      .then(() => navigate('/success', { replace: true }))
      .catch(console.error)
  }

  if (outputPath === '') {
    if (wasPrompted) {
      setPass('')
      return <Navigate to={'/auth'} replace />
    }
    return null
  }

  return (
    <SummaryContainer>
      <SummaryPaths
        fileName={fileName}
        outputPath={outputPath}
        onModifyPathClick={handleModifyPathClick}
      />
      <ConfirmButton
        targetOperation={targetOperation}
        onConfirm={handleConfirm}
      />
    </SummaryContainer>
  )
}
