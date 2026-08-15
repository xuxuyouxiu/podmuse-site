'use client'

import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollToPlugin)

/**
 * 全屏分页滚动：滚一下 → GSAP 缓动滑动到相邻屏（丝滑滑动，非瞬跳）。
 * 动画期间吞掉多余滚轮事件防连跳；支持键盘翻页。
 */
export default function FullpageScroll() {
  useEffect(() => {
    let busy = false
    let lastTrigger = 0
    const DURATION = 0.95 // 滑动时长（秒）

    const countSections = () => document.querySelectorAll<HTMLElement>('section[id]').length

    const currentIndex = () => Math.round(window.scrollY / window.innerHeight)

    const goTo = (i: number) => {
      const n = countSections()
      const target = Math.max(0, Math.min(n - 1, i))
      const cur = currentIndex()
      if (target === cur && Math.abs(window.scrollY - target * window.innerHeight) < 2) return
      busy = true
      gsap.to(window, {
        scrollTo: { y: target * window.innerHeight },
        duration: DURATION,
        ease: 'power3.inOut',
        onComplete: () => {
          busy = false
        },
      })
    }

    const onWheel = (e: WheelEvent) => {
      const now = Date.now()
      if (now - lastTrigger < 250) {
        if (busy) e.preventDefault()
        return
      }
      if (Math.abs(e.deltaY) < 15) return
      lastTrigger = now
      e.preventDefault()
      goTo(currentIndex() + (e.deltaY > 0 ? 1 : -1))
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'PageDown' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        goTo(currentIndex() + 1)
      } else if (e.key === 'PageUp' || e.key === 'ArrowUp') {
        e.preventDefault()
        goTo(currentIndex() - 1)
      } else if (e.key === 'Home') {
        e.preventDefault()
        goTo(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        goTo(countSections() - 1)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  return null
}
