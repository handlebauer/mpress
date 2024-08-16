import { useNavigate } from 'react-router-dom'

import { FileUploadFileAcceptDetails } from '@ark-ui/react'
import { BasicFileUpload } from '~/components/ui/BasicFileUpload'

import { useStore } from '~/store'

export default function Home() {
  const navigate = useNavigate()
  const setFile = useStore(state => state.setFile)

  const handleFileAccept = (details: FileUploadFileAcceptDetails) => {
    const [file] = details.files
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)

    reader.addEventListener('load', () => {
      const { result } = reader
      if (result === null) return
      setFile(file.name, result as ArrayBuffer)
        .then(() => navigate('/auth', { replace: true }))
        .catch(console.error)
    })
  }

  return <BasicFileUpload onFileAccept={handleFileAccept} />
}
