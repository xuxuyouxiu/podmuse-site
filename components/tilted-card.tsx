'use client'

import React, { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'

interface TiltedCardProps extends React.PropsWithChildren {
  className?: string
  rotateAmplitude?: number
  scaleOnHover?: number
}

/**
 * TiltedCard（React Bits 思路的内容版）：
 * 鼠标在卡片上移动时卡片 3D 倾斜（±rotateAmplitude），弹簧平滑回位，
 * 紫色光晕跟随鼠标位置，hover 轻微放大。
 */
const springValues = {
  damping: 22,
  stiffness: 160,
  mass: 1,
}

export default function TiltedCard({
  children,
  className = '',
  rotateAmplitude = 9,
  scaleOnHover = 1.03,
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const rotateX = useSpring(useMotionValue(0), springValues)
  const rotateY = useSpring(useMotionValue(0), springValues)
  const scale = useSpring(1, springValues)
  const glowX = useMotionValue(-200)
  const glowY = useMotionValue(-200)
  const glowOpacity = useSpring(0, { damping: 30, stiffness: 200 })
  const glowBg = useMotionTemplate`radial-gradient(circle at ${glowX}px ${glowY}px, rgba(124,58,237,0.14), transparent 65%)`

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left - rect.width / 2
    const offsetY = e.clientY - rect.top - rect.height / 2
    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude
    rotateX.set(rotationX)
    rotateY.set(rotationY)
    glowX.set(e.clientX - rect.left)
    glowY.set(e.clientY - rect.top)
  }

  const handleMouseEnter = () => {
    scale.set(scaleOnHover)
    glowOpacity.set(1)
  }

  const handleMouseLeave = () => {
    scale.set(1)
    rotateX.set(0)
    rotateY.set(0)
    glowOpacity.set(0)
  }

  return (
    <div
      ref={ref}
      className="h-full w-full [perspective:900px]"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className={`relative h-full w-full [transform-style:preserve-3d] ${className}`}
        style={{ rotateX, rotateY, scale }}
      >
        {children}
        {/* 跟随光晕（translateZ 抬到卡片表面上方） */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            opacity: glowOpacity,
            background: glowBg,
            transform: 'translateZ(40px)',
          }}
        />
      </motion.div>
    </div>
  )
}
