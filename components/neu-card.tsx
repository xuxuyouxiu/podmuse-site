'use client'

import React from 'react'

/**
 * NeuCard（Uiverse by dylanharriscameron 结构，品牌紫适配）：
 * 新拟态外壳（双色投影）+ 内层玻璃卡 + 紫色光斑沿四角循环游走，
 * 光斑透过玻璃层透出柔光。
 */
export default function NeuCard({ children }: React.PropsWithChildren) {
  return (
    <div
      className="neu-card relative z-10 flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-[14px]"
      style={{
        background: '#eceef3',
        boxShadow: '18px 18px 48px rgba(190,190,200,0.55), -14px -14px 40px rgba(255,255,255,0.95)',
      }}
    >
      {/* 游走光斑（外壳层，内层玻璃卡之下） */}
      <div aria-hidden className="neu-blob" />

      {/* 内层玻璃卡 */}
      <div className="group relative z-10 m-1.5 flex h-[calc(100%-12px)] w-[calc(100%-12px)] flex-col items-center justify-center overflow-hidden rounded-[10px] bg-white/95 p-6 text-center outline-2 outline-white">
        {children}
      </div>
    </div>
  )
}
