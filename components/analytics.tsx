'use client'

import { useEffect } from 'react'

/**
 * 百度统计（Baidu Tongji）。
 * 官网统计脚本 + 下载按钮点击事件埋点。
 */
const BAIDU_SITE_ID = '47c3d20d16483b897729f4ed49bc87fd'

type Hmt = Array<Array<string | number>>

export default function Analytics() {
  useEffect(() => {
    const w = window as unknown as { _hmt?: Hmt }
    w._hmt = w._hmt || []

    if (!document.querySelector('script[src^="https://hm.baidu.com/hm.js?"]')) {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://hm.baidu.com/hm.js?${BAIDU_SITE_ID}`
      document.head.appendChild(script)
    }

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
      const script = document.querySelector(
        'script[src^="https://hm.baidu.com/hm.js?"]',
      ) as HTMLScriptElement | null
      if (script) document.head.removeChild(script)
    }
  }, [])

  return null
}
