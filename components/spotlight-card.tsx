'use client'

import React, { useRef, useState } from 'react'

interface Position {
  x: number
  y: number
}

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string
  spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`
}

/**
 * SpotlightCard（React Bits，白底适配版）：
 * 鼠标移入卡片时，光斑跟随鼠标位置移动，边框渐变高亮。
 */
const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(124, 58, 237, 0.12)',
}) => {
  const divRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState<number>(0)

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = e => {
    if (!divRef.current || isFocused) return
    const rect = divRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const handleFocus = () => {
    setIsFocused(true)
    setOpacity(0.6)
  }

  const handleBlur = () => {
    setIsFocused(false)
    setOpacity(0)
  }

  const handleMouseEnter = () => {
    setOpacity(0.6)
  }

  const handleMouseLeave = () => {
    setOpacity(0)
  }

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-brand/30 hover:shadow-[0_4px_10px_rgba(50,50,93,0.08),0_24px_48px_-12px_rgba(124,58,237,0.22)] ${className}`}
    >
      {/* 鼠标光斑 */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />
      {/* 顶部渐变高光线（hover 显现） */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {children}
    </div>
  )
}

export default SpotlightCard
