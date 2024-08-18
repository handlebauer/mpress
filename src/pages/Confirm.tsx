import { MouseEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Store, TargetOperation, useStore } from '~/store'

import ConfirmButton from '~/components/summary/ConfirmButton'
import SummaryContainer from '~/components/summary/SummaryContainer'
import SummaryPaths from '~/components/summary/SummaryPaths'

import { save } from '@tauri-apps/api/dialog'
import { noop } from 'es-toolkit'

export default function Confirm() {
  const navigate = useNavigate()

  const selector = (state: Store) =>
    [
      state.setCurrentPage,
      state.fileName,
      state.outputPath,
      state.setOutputPath,
      state.targetOperation,
      state.saveOutput,
    ] as const
  const [
    setCurrentPage,
    fileName,
    outputPath,
    setOutputPath,
    targetOperation,
    saveOutput,
  ] = useStore(selector)

  useEffect(() => {
    setCurrentPage('/confirm')
  }, [])

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
    if (outputPath === '') {
      promptSave().then(noop).catch(noop)
    }
  }, [])

  const handleModifyPathClick = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    event.preventDefault()
    promptSave().then(noop).catch(console.error)
  }

  const handleConfirm = (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => {
    event.preventDefault()
    saveOutput()
      .then(() => navigate('/success', { replace: true }))
      .catch(console.error)
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
        outputPath={outputPath}
        onConfirm={handleConfirm}
      />
    </SummaryContainer>
  )
}
