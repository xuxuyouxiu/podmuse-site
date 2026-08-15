'use client'

import { useEffect, useState } from 'react'

/**
 * 动态获取最新安装包直链 —— 全链路走 ghfast.top 镜像（国内可直连）：
 * 1. 镜像拉 latest.yml 解析最新版本
 * 2. 下载链接同样走镜像，点击直接下载 .exe
 * 3. 失败兜底：镜像的 release 列表页（不 404）
 */
const MIRROR = 'https://ghfast.top/'
const GH = 'https://github.com/xuxuyouxiu/PodMuse'
const LATEST_YML = `${MIRROR}${GH}/releases/latest/download/latest.yml`
const FALLBACK = `${MIRROR}${GH}/releases/latest`

export function useLatestSetupUrl(): string {
  const [url, setUrl] = useState(FALLBACK)

  useEffect(() => {
    let alive = true

    fetch(LATEST_YML, { cache: 'no-store' })
      .then(r => (r.ok ? r.text() : Promise.reject()))
      .then(t => {
        const version = t
          .split('\n')
          .find(l => l.startsWith('version:'))
          ?.split(':')[1]
          ?.trim()
        const path = t
          .split('\n')
          .find(l => l.startsWith('path:'))
          ?.split(':')[1]
          ?.trim()
        if (!version || !path) return Promise.reject()
        const direct = `${GH}/releases/download/v${version}/${path}`
        if (alive) setUrl(`${MIRROR}${direct}`) // 镜像直下安装包
        return undefined
      })
      .catch(() => {})

    return () => {
      alive = false
    }
  }, [])

  return url
}
