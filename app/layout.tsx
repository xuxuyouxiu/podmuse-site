import type { Metadata } from 'next'
import { Inter, Instrument_Serif } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/smooth-scroll'
import BalatroBackground from '@/components/balatro-background'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const instrument = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PodMuse — 把播客变成你的第二大脑',
  description:
    '粘贴一条链接，AI 自动转写、提炼、结构化。支持小宇宙、B站、喜马拉雅、抖音、YouTube。数据 100% 本地。',
  icons: {
    icon: '/icon-192.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${instrument.variable}`}>
      <body className="font-sans antialiased">
        {/* 全屏 Balatro 漩涡背景（品牌紫，淡） */}
        <BalatroBackground
          color1="#7c3aed"
          color2="#a855f7"
          color3="#ffffff"
          spinRotation={-2.0}
          spinSpeed={7.0}
          pixelFilter={745}
          contrast={3.5}
          lighting={0.4}
          spinAmount={0.25}
          isRotate={false}
          mouseInteraction
          opacity={0.16}
        />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
