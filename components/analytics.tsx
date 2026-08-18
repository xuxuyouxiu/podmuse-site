'use client'

import { useEffect } from 'react'

/**
 * GoatCounter 统计（免费、轻量、隐私友好）。
 * 通过 NEXT_PUBLIC_GOATCOUNTER 环境变量启用，例如：
 *   NEXT_PUBLIC_GOATCOUNTER=https://your-name.goatcounter.com/count
 *
 * 未配置时组件不加载任何脚本，不影响页面性能。
 */
const GOATCOUNTER_URL = process.env.NEXT_PUBLIC_GOATCOUNTER

export default function Analytics() {
  useEffect(() => {
    if (!GOATCOUNTER_URL) return

    const script = document.createElement('script')
    script.setAttribute('data-goatcounter', GOATCOUNTER_URL)
    script.async = true
    script.src = 'https://gc.zgo.at/count.js'
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  return null
}
