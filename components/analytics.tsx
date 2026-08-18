'use client'

import { useEffect } from 'react'

/**
 * 百度统计事件埋点。
 * 统计脚本本身由 app/layout.tsx 中的内联脚本加载，
 * 这里只负责把下载按钮点击上报为 _trackEvent。
 */
type Hmt = Array<Array<string | number>>

export default function Analytics() {
  useEffect(() => {
    const w = window as unknown as { _hmt?: Hmt }
    w._hmt = w._hmt || []

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const el = target?.closest?.('[data-track-event]') as HTMLElement | null
      const eventName = el?.dataset.trackEvent
      if (!eventName) return
      w._hmt?.push(['_trackEvent', '下载', 'click', eventName])
    }
    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return null
}
