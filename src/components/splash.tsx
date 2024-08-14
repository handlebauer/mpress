import { FileUploadFileAcceptDetails } from '@ark-ui/react'

import { BasicFileUpload } from './ui/basic-file-upload'

interface SplashProps {
  onFileAccept: (filename: string, data: ArrayBuffer) => void
}

export default function Splash({ onFileAccept }: SplashProps) {
  const handleFileAccept = ({ files }: FileUploadFileAcceptDetails) => {
    const reader = new FileReader()

    reader.addEventListener('load', () => {
      if (reader.result === null) return
      onFileAccept(files[0].name, reader.result as ArrayBuffer)
    })

    reader.readAsArrayBuffer(files[0])
  }

  return <BasicFileUpload onFileAccept={handleFileAccept} />
}
