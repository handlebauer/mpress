import { Upload } from 'lucide-react'
import { Field, FileUpload, FileUploadFileAcceptDetails } from '@ark-ui/react'

export const BasicFileUpload = ({
  onFileAccept,
}: {
  onFileAccept: (details: FileUploadFileAcceptDetails) => void
}) => {
  return (
    <Field.Root className="h-full grow">
      <FileUpload.Root
        maxFiles={1}
        onFileAccept={onFileAccept}
        className="flex h-full p-2"
      >
        <FileUpload.Dropzone className="flex grow cursor-pointer items-center justify-center rounded-sm border border-dashed border-slate-800 p-3 hover:bg-slate-200">
          <div className="flex">
            <Upload size={26} />
          </div>
        </FileUpload.Dropzone>
        <FileUpload.HiddenInput />
      </FileUpload.Root>
    </Field.Root>
  )
}
