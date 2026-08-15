'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4, // 滚动阻尼时长：越大滚动越缓慢顺滑
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // 指数缓出，尾段惯性
      smoothWheel: true,
    })
    lenisRef.current = lenis
    // 暴露到 window：产品体验板块 sticky 期间需暂停 Lenis，让滚轮独占滚动控制
    ;(window as unknown as { lenis: Lenis }).lenis = lenis

    // 官方同步方案：Lenis 与 ScrollTrigger 共用 GSAP ticker，同帧更新，杜绝 scrub 抖动
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
