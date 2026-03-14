'use client'

import dynamic from 'next/dynamic'

const AXIOMScene = dynamic(() => import('@/components/3d/AXIOMScene'), { ssr: false })

export default function Home() {
  return (
    <main style={{
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      background: '#080808',
      margin: 0,
      padding: 0,
    }}>
      <AXIOMScene />
    </main>
  )
}
