'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollFloatProps {
  children: string
  containerClassName?: string
  textClassName?: string
  animationDuration?: number
  ease?: string
  scrollStart?: string
  scrollEnd?: string
  stagger?: number
  /** true=随滚动 scrub（普通流式区块）；false=进入视口即播放（sticky 固定屏场景） */
  scrub?: boolean
  /** 指定外部 trigger 选择器（如 '#journey'）——sticky 屏内用整个板块的滚动进度驱动 scrub */
  triggerSelector?: string
}

/**
 * ScrollFloat：滚动逐字浮入（Vue Bits 移植 React 版）。
 * 文字拆成单字，随滚动 scrub 从下方放大浮入（opacity/scale/位移联动）。
 */
export default function ScrollFloat({
  children,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03,
  scrub = true,
  triggerSelector,
}: ScrollFloatProps) {
  const containerRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const triggerEl = (triggerSelector ? document.querySelector(triggerSelector) : el) as HTMLElement | null
    const trigger = triggerEl ?? el
    const chars = el.querySelectorAll('.scroll-float-char')
    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        {
          willChange: 'opacity, transform',
          opacity: 0,
          yPercent: 120,
          scaleY: 2.3,
          scaleX: 0.7,
          transformOrigin: '50% 0%',
        },
        {
          duration: animationDuration,
          ease,
          opacity: 1,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          stagger,
          scrollTrigger: scrub
            ? {
                trigger,
                start: scrollStart,
                end: scrollEnd,
                scrub: true,
              }
            : {
                trigger,
                start: scrollStart,
                toggleActions: 'play none none none',
              },
        },
      )
    }, el)
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })
    return () => ctx.revert()
  }, [animationDuration, ease, scrollStart, scrollEnd, stagger, scrub, triggerSelector])

  const chars = children.split('').map(c => (c === ' ' ? '\u00A0' : c))

  return (
    <h2 ref={containerRef} className={`my-5 overflow-hidden ${containerClassName}`}>
      <span className={`inline-block leading-[1.5] ${textClassName}`}>
        {chars.map((c, i) => (
          <span key={i} className="inline-block scroll-float-char">
            {c}
          </span>
        ))}
      </span>
    </h2>
  )
}
