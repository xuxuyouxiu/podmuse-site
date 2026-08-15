'use client'

import { useEffect, useMemo, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './scroll-reveal.css'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealProps {
  children: string
  enableBlur?: boolean
  baseOpacity?: number
  baseRotation?: number
  blurStrength?: number
  containerClassName?: string
  textClassName?: string
  /** true=mount 即播放（sticky 固定屏/滚轮切换场景）；默认 false=随滚动 scrub（参考组件原版） */
  playOnce?: boolean
}

/**
 * ScrollReveal（React Bits 原版移植，严格按参考实现）：
 * 逐词揭示——模糊 + 旋转 + 透明 → 滚动 scrub 清晰复位。
 * playOnce 模式供 sticky 屏内使用：挂载即播放完整揭示动画（每次 key 变化重播）。
 */
export default function ScrollReveal({
  children,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  playOnce = false,
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLHeadingElement>(null)

  const splitText = useMemo(() => {
    return children.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word
      return (
        <span className="word" key={index}>
          {word}
        </span>
      )
    })
  }, [children])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const wordElements = el.querySelectorAll<HTMLElement>('.word')

    if (playOnce) {
      // sticky/滚轮场景：挂载即播放（完整揭示动画，时长与 scrub 全程相当）
      gsap.fromTo(
        el,
        { transformOrigin: '0% 50%', rotate: baseRotation },
        { ease: 'power3.out', rotate: 0, duration: 1.4 },
      )
      gsap.fromTo(
        wordElements,
        {
          opacity: baseOpacity,
          willChange: 'opacity',
          filter: enableBlur ? `blur(${blurStrength}px)` : 'none',
        },
        {
          ease: 'power2.out',
          opacity: 1,
          filter: 'blur(0px)',
          stagger: 0.08,
          duration: 1.1,
          delay: 0.15,
        },
      )
      return () => {
        gsap.killTweensOf(el)
        gsap.killTweensOf(wordElements)
      }
    }

    // 参考组件原版：滚动 scrub
    gsap.fromTo(
      el,
      { transformOrigin: '0% 50%', rotate: baseRotation },
      {
        ease: 'none',
        rotate: 0,
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true,
        },
      },
    )

    gsap.fromTo(
      wordElements,
      { opacity: baseOpacity, willChange: 'opacity' },
      {
        ease: 'none',
        opacity: 1,
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          start: 'top bottom-=20%',
          end: 'bottom bottom',
          scrub: true,
        },
      },
    )

    if (enableBlur) {
      gsap.fromTo(
        wordElements,
        { filter: `blur(${blurStrength}px)` },
        {
          ease: 'none',
          filter: 'blur(0px)',
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            start: 'top bottom-=20%',
            end: 'bottom bottom',
            scrub: true,
          },
        },
      )
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children])

  return (
    <h2 ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </h2>
  )
}
