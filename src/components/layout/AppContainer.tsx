import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export default function AppContainer(props: Props) {
  return (
    <div className="h-100vh flex h-screen w-screen items-center justify-center font-mono text-xs">
      {props.children}
    </div>
  )
}
