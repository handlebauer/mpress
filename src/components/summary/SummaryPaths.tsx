import { Wand } from 'lucide-react'
import { MouseEvent } from 'react'
import { shortenPath } from '~/lib/utils'

interface SummaryPathsProps {
  fileName: string
  outputPath: string
  onModifyPathClick: (
    event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
  ) => void
}

export default function SummaryPaths(props: SummaryPathsProps) {
  return (
    <div className="flex-col space-y-1">
      <div className="flex items-center overflow-hidden rounded-sm bg-gray-100">
        <span className="w-10 border-r border-gray-200 bg-gray-200 p-1 text-right font-medium text-gray-800">
          src
        </span>
        <span className="flex-1 truncate p-1 text-xs font-normal text-gray-500">
          {props.fileName}
        </span>
      </div>
      <div className="flex items-center overflow-hidden rounded-sm bg-gray-100">
        <span className="w-10 border-r border-gray-200 bg-gray-200 p-1 text-right font-medium text-gray-800">
          dest
        </span>
        <span className="flex-1 overflow-hidden p-1 text-xs font-normal text-gray-500">
          {shortenPath(props.outputPath)}
        </span>
        <button
          className="p-1 text-xs font-normal text-gray-950"
          onClick={props.onModifyPathClick}
        >
          <Wand className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
