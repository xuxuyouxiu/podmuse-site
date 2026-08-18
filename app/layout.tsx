import type { Metadata } from 'next'
import { Inter, Instrument_Serif } from 'next/font/google'
import './globals.css'
import SmoothScroll from '@/components/smooth-scroll'
import BalatroBackground from '@/components/balatro-background'
import Analytics from '@/components/analytics'

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

const SITE_URL = 'https://xuxuya66.top'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'PodMuse — 把播客变成你的第二大脑',
    template: '%s | PodMuse',
  },
  description:
    '粘贴一条链接，AI 自动转写、提炼、结构化。支持小宇宙、B站、喜马拉雅、抖音、YouTube。数据 100% 本地。',
  applicationName: 'PodMuse',
  authors: [{ name: 'PodMuse', url: 'https://github.com/xuxuyouxiu/PodMuse' }],
  creator: 'PodMuse',
  publisher: 'PodMuse',
  keywords: ['播客笔记', 'AI 笔记', 'PodMuse', '播客转写', '知识管理', '本地笔记'],
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/icon-192.png',
    apple: '/apple-touch-icon.png',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'PodMuse',
    title: 'PodMuse — 把播客变成你的第二大脑',
    description:
      '粘贴一条链接，AI 自动转写、提炼、结构化。支持小宇宙、B站、喜马拉雅、抖音、YouTube。数据 100% 本地。',
    locale: 'zh_CN',
    images: [
      {
        url: '/share-card.png',
        width: 1080,
        height: 1080,
        alt: 'PodMuse 分享卡',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PodMuse — 把播客变成你的第二大脑',
    description:
      '粘贴一条链接，AI 自动转写、提炼、结构化。支持小宇宙、B站、喜马拉雅、抖音、YouTube。数据 100% 本地。',
    images: ['/share-card.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      name: 'PodMuse',
      url: SITE_URL,
      description:
        '把播客变成你的第二大脑。粘贴一条链接，AI 自动转写、提炼、结构化。',
      inLanguage: 'zh-CN',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'PodMuse',
      url: SITE_URL,
      applicationCategory: 'UtilityApplication',
      operatingSystem: 'Windows',
      description:
        '粘贴一条链接，AI 自动转写、提炼、结构化。支持小宇宙、B站、喜马拉雅、抖音、YouTube。数据 100% 本地。',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'CNY',
      },
      author: {
        '@type': 'Organization',
        name: 'PodMuse',
        url: 'https://github.com/xuxuyouxiu/PodMuse',
      },
    },
  ],
}

const baiduAnalyticsSnippet = `
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?47c3d20d16483b897729f4ed49bc87fd";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();
`

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
        <Analytics />
        <script dangerouslySetInnerHTML={{ __html: baiduAnalyticsSnippet }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  )
}
