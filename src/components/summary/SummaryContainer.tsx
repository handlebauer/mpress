import { ReactNode } from 'react'

export default function SummaryContainer(props: { children: ReactNode }) {
  return (
    <div className="flex w-screen flex-col space-y-3 p-3">{props.children}</div>
  )
}
