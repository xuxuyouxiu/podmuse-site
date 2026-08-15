'use client'

import { useEffect, useState } from 'react'
import GithubIcon from './github-icon'
import { useLatestSetupUrl } from './latest-setup'

const links = [
  { label: '完整链路', href: '#workflow' },
  { label: '产品体验', href: '#journey' },
  { label: '知识问答', href: '#qa' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const setupUrl = useLatestSetupUrl()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 z-50 px-4 transition-[margin-top] duration-300 ease-out ${
        scrolled ? 'mt-3' : 'mt-0'
      }`}
    >
      <nav
        className={`mx-auto flex h-14 max-w-6xl items-center justify-between px-5 md:px-6 ${
          scrolled
            ? 'rounded-2xl bg-white/95 shadow-[0_2px_8px_rgba(50,50,93,0.06),0_12px_28px_-8px_rgba(50,50,93,0.12)]'
            : 'bg-transparent'
        }`}
      >
        {/* 左：logo */}
        <a href="#top" className="flex shrink-0 items-center gap-2.5">
          <img src="/icon-192.png" alt="PodMuse" className="h-8 w-8 rounded-lg" />
          <span className="text-[17px] font-bold tracking-tight text-ink">PodMuse</span>
        </a>

        {/* 中：导航链接 */}
        <div className="hidden items-center gap-9 md:flex">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="text-[15px] font-medium text-ink-soft transition-colors hover:text-brand"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* 右：GitHub + 下载 */}
        <div className="flex shrink-0 items-center gap-4">
          <a
            href="https://github.com/xuxuyouxiu/PodMuse"
            target="_blank"
            rel="noopener"
            aria-label="GitHub"
            className="text-ink-mute transition-colors hover:text-ink"
          >
            <GithubIcon className="h-5 w-5" />
          </a>
          <a
            href={setupUrl}
            className="rounded-lg bg-[#1c1e54] px-4.5 py-2 text-[14px] font-semibold text-white shadow-[0_2px_6px_rgba(28,30,84,0.3)] transition-colors hover:bg-[#2a2d73]"
          >
            免费下载
          </a>
        </div>
      </nav>
    </header>
  )
}
