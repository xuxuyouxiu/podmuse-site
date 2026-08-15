'use client'

import { useEffect, useState } from 'react'

/**
 * 动态获取最新安装包下载链接（jsdelivr 解析，CORS 友好）：
 * - url：GitHub 直链（浏览器原生下载，无第三方域名警告）
 * - mirrorUrl：ghfast 镜像加速通道（下载慢时用）
 * 版本解析：data.jsdelivr.com（Access-Control-Allow-Origin: *，国内可达）
 */
const GH = 'https://github.com/xuxuyouxiu/PodMuse'
const MIRROR = 'https://ghfast.top/'
const JSDELIVR = 'https://data.jsdelivr.com/v1/packages/gh/xuxuyouxiu/PodMuse'
// 静态兜底：当前已知最新版（发布新版本后由发布流程同步更新）
const STATIC_VERSION = '1.47.3'

function setupUrl(version: string): string {
  return `${GH}/releases/download/v${version}/PodMuse-Setup-${version}.exe`
}

export function useLatestSetupUrl(): {
  url: string
  mirrorUrl: string
} {
  const [url, setUrl] = useState(setupUrl(STATIC_VERSION))
  const [mirrorUrl, setMirrorUrl] = useState(`${MIRROR}${setupUrl(STATIC_VERSION)}`)

  useEffect(() => {
    let alive = true

    fetch(JSDELIVR, { cache: 'no-store' })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(d => {
        const v = d?.versions?.[0]?.version
        if (!v) return Promise.reject()
        if (alive) {
          setUrl(setupUrl(v))
          setMirrorUrl(`${MIRROR}${setupUrl(v)}`)
        }
        return undefined
      })
      .catch(() => {})

    return () => {
      alive = false
    }
  }, [])

  return { url, mirrorUrl }
}
