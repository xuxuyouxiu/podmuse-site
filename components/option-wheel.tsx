'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'

export type Side = 'left' | 'right'

interface OptionWheelProps {
  items?: string[]
  defaultSelected?: number
  textColor?: string
  activeColor?: string
  side?: Side
  fontSize?: number
  spacing?: number
  curve?: number
  tilt?: number
  blur?: number
  fade?: number
  minOpacity?: number
  smoothing?: number
  inset?: number
  loop?: boolean
  draggable?: boolean
  soundUrl?: string
  soundVolume?: number
  className?: string
  onChange?: (index: number, item: string) => void
}

/**
 * OptionWheel：弧形选项滚轮（Vue Bits 移植 React 版）。
 * rAF 指数平滑 + 圆形曲线布局 + 拖拽/滚轮/键盘。
 */
export default function OptionWheel({
  items = [
    'Ambient',
    'House',
    'Techno',
    'Jazz',
    'Lo-Fi',
    'Synthwave',
    'Trance',
    'Funk',
    'Disco',
    'Hip-Hop',
    'Chillwave',
    'Drum & Bass',
  ],
  defaultSelected = 3,
  textColor = '#a6a6a6',
  activeColor = '#ffffff',
  side = 'left',
  fontSize = 3,
  spacing = 1.4,
  curve = 1,
  tilt = 6,
  blur = 2,
  fade = 0.25,
  minOpacity = 0.05,
  smoothing = 200,
  inset = 80,
  loop = false,
  draggable = true,
  soundUrl = '',
  soundVolume = 0.5,
  className = '',
  onChange,
  selected,
  wheelEnabled = true,
}: OptionWheelProps & { selected?: number; wheelEnabled?: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const [selectedIndex, setSelectedIndex] = useState(defaultSelected)
  const selectedIdxRef = useRef(defaultSelected)
  const [isDragging, setIsDragging] = useState(false)

  // 最新 props 引用（供 rAF 循环读取，不重挂监听）
  const p = useRef({ fontSize, spacing, curve, tilt, blur, fade, minOpacity, side, loop, smoothing, soundUrl, soundVolume, items, draggable, onChange, defaultSelected, wheelEnabled })
  useEffect(() => {
    p.current = { fontSize, spacing, curve, tilt, blur, fade, minOpacity, side, loop, smoothing, soundUrl, soundVolume, items, draggable, onChange, defaultSelected, wheelEnabled }
  })

  // 可变状态（无渲染）
  const s = useRef({
    pos: defaultSelected,
    target: defaultSelected,
    raf: null as number | null,
    last: 0,
    wheelTimer: null as ReturnType<typeof setTimeout> | null,
    drag: null as { y: number; start: number; id: number } | null,
    dragMoved: false,
    audio: null as HTMLAudioElement | null,
    audioUrl: '',
    lastTick: 0,
  })

  const remPx = () =>
    typeof window !== 'undefined' ? parseFloat(getComputedStyle(document.documentElement).fontSize) || 16 : 16
  const rowH = () => Math.max(p.current.fontSize * p.current.spacing * remPx(), 1)

  const runFrame = (now: number) => {
    const st = s.current
    const props = p.current
    const dt = Math.min((now - st.last) / 1000, 0.05)
    st.last = now
    const tau = Math.max(props.smoothing, 1) / 1000
    const k = 1 - Math.exp(-dt / tau)

    let next = st.pos + (st.target - st.pos) * k
    const settled = Math.abs(st.target - next) < 0.001
    if (settled) next = st.target
    st.pos = next

    const els = itemRefs.current
    const n = props.items.length
    const mirror = props.side === 'right' ? -1 : 1
    const tiltRad = (props.tilt * Math.PI) / 180
    const R = tiltRad > 0.0005 ? rowH() / tiltRad : 0
    for (let i = 0; i < n; i++) {
      const el = els[i]
      if (!el) continue
      let d = i - next
      if (props.loop && n > 1) {
        d = ((d % n) + n) % n
        if (d > n / 2) d -= n
      }
      const dist = Math.abs(d)
      let x = 0
      let y = d * rowH()
      let rot = 0
      if (R > 0) {
        const ang = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, d * tiltRad))
        y = R * Math.sin(ang)
        x = -mirror * R * (1 - Math.cos(ang)) * props.curve
        rot = (mirror * ang * 180) / Math.PI
      }
      el.style.transform = `translate(${x.toFixed(2)}px, calc(${y.toFixed(2)}px - 50%)) rotate(${rot.toFixed(3)}deg)`
      el.style.opacity = String(Math.max(props.minOpacity, 1 - dist * props.fade))
      el.style.filter = props.blur > 0 ? `blur(${(dist * props.blur).toFixed(2)}px)` : 'none'
      el.style.setProperty('--ow-p', Math.max(0, 1 - Math.min(dist, 1)).toFixed(4))
    }

    st.raf = settled ? null : requestAnimationFrame(runFrame)
  }

  const startLoop = () => {
    const st = s.current
    if (st.raf != null) return
    st.last = performance.now()
    st.raf = requestAnimationFrame(runFrame)
  }

  const playTick = () => {
    const st = s.current
    const props = p.current
    if (!props.soundUrl) return
    const now = performance.now()
    if (now - st.lastTick < 70) return
    st.lastTick = now
    if (!st.audio || st.audioUrl !== props.soundUrl) {
      st.audio = new Audio(props.soundUrl)
      st.audio.preload = 'auto'
      st.audioUrl = props.soundUrl
    }
    if (st.audio) {
      st.audio.volume = Math.min(Math.max(props.soundVolume, 0), 1)
      st.audio.currentTime = 0
      st.audio.play()?.catch(() => {})
    }
  }

  const applyTarget = (value: number, snap: boolean, silent = false) => {
    const st = s.current
    const props = p.current
    let v = value
    const n = props.items.length
    if (!props.loop) v = Math.min(Math.max(v, 0), Math.max(n - 1, 0))
    if (snap) v = Math.round(v)
    st.target = v
    const idx = ((Math.round(v) % n) + n) % n
    // onChange 只能在用户主动操作时触发；受控同步用 silent 避免与外部状态互踢成死循环
    if (idx !== selectedIdxRef.current) {
      selectedIdxRef.current = idx
      setSelectedIndex(idx)
      if (!silent) {
        props.onChange?.(idx, props.items[idx])
        playTick()
      }
    }
    startLoop()
  }

  // 受控：外部 selected 变化时平滑滚到对应项（静默，不回调，避免死循环）
  useEffect(() => {
    if (selected === undefined) return
    const idx = Math.min(Math.max(selected, 0), Math.max(p.current.items.length - 1, 0))
    if (Math.round(s.current.target) !== idx) applyTarget(idx, true, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected])

  // 挂载：滚轮监听 + 初始布局
  useEffect(() => {
    const el = rootRef.current
    const st = s.current
    // 累积器：滚轮每滚一格滑一项（吸附到整数），杜绝「微移后弹回」的闪烁
    let accum = 0
    const onWheel = (e: WheelEvent) => {
      // 未启用接管（如 sticky 未固定）：不拦截，页面正常滚动
      if (!p.current.wheelEnabled) return
      e.stopPropagation() // 阻止冒泡到 Lenis，避免双重滚动
      const delta = e.deltaMode === 1 ? e.deltaY * 24 : e.deltaY
      const n = p.current.items.length
      // 边界放行：已在最后一项继续往下滚（或在第一项继续往上滚）→ 不拦截，页面滚出板块
      if ((Math.round(s.current.target) >= n - 1 && delta > 0) || (Math.round(s.current.target) <= 0 && delta < 0)) {
        window.scrollTo({ top: window.scrollY + delta, behavior: 'auto' })
        return
      }
      e.preventDefault()
      accum += delta / rowH()
      // 每次滚轮事件最多切一项（消费全部累积），杜绝一格跳两项
      if (Math.abs(accum) >= 0.55) {
        const step = accum >= 0 ? 1 : -1
        accum = 0
        applyTarget(Math.round(s.current.target) + step, true)
      }
    }
    if (el) el.addEventListener('wheel', onWheel, { passive: false })
    applyTarget(st.target, false)
    return () => {
      if (el) el.removeEventListener('wheel', onWheel)
      if (st.wheelTimer) clearTimeout(st.wheelTimer)
      if (st.raf != null) cancelAnimationFrame(st.raf)
      st.raf = null // 关键：StrictMode 二次挂载时允许重新启动 rAF 循环
      st.audio?.pause()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!p.current.draggable) return
    s.current.drag = { y: e.clientY, start: s.current.target, id: e.pointerId }
    s.current.dragMoved = false
    setIsDragging(true)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    const st = s.current
    if (!st.drag) return
    const dy = e.clientY - st.drag.y
    if (!st.dragMoved && Math.abs(dy) > 4) {
      st.dragMoved = true
      rootRef.current?.setPointerCapture(st.drag.id)
    }
    if (st.dragMoved) applyTarget(st.drag.start - dy / rowH(), false)
  }

  const handlePointerEnd = () => {
    const st = s.current
    if (!st.drag) return
    st.drag = null
    setIsDragging(false)
    if (st.dragMoved) applyTarget(st.target, true)
  }

  const handleItemClick = (index: number) => {
    if (s.current.dragMoved) return
    const props = p.current
    const n = props.items.length
    const cur = s.current.target
    let d = index - (((cur % n) + n) % n)
    if (props.loop && n > 1) {
      if (d > n / 2) d -= n
      else if (d < -n / 2) d += n
    }
    applyTarget(cur + d, true)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    let delta: number | null = null
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') delta = -1
    else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') delta = 1
    if (delta == null) return
    e.preventDefault()
    applyTarget(Math.round(s.current.target) + delta, true)
  }

  const rootStyle = {
    '--ow-text-color': textColor,
    '--ow-active-color': activeColor,
    '--ow-font-size': `${fontSize}rem`,
    '--ow-inset': `${inset}px`,
  } as CSSProperties

  const itemClass = (index: number) =>
    `absolute top-1/2 cursor-pointer whitespace-nowrap leading-none will-change-[transform,opacity,filter] [font-size:var(--ow-font-size)] [color:color-mix(in_srgb,var(--ow-active-color)_calc(var(--ow-p,0)*100%),var(--ow-text-color))] ${
      side === 'right' ? 'right-[var(--ow-inset)] origin-right' : 'left-[var(--ow-inset)] origin-left'
    } ${selectedIndex === index ? 'font-semibold' : 'font-light'}`

  return (
    <div
      ref={rootRef}
      role="listbox"
      tabIndex={0}
      aria-label="Option wheel"
      className={`relative h-full w-full touch-none select-none overflow-hidden outline-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${className}`}
      style={rootStyle}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onKeyDown={handleKeyDown}
    >
      {items.map((label, index) => (
        <div
          key={`${label}-${index}`}
          ref={el => {
            itemRefs.current[index] = el
          }}
          role="option"
          aria-selected={selectedIndex === index}
          className={itemClass(index)}
          onClick={() => handleItemClick(index)}
        >
          {label}
        </div>
      ))}
    </div>
  )
}
