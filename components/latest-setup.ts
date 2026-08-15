'use client'

import { useEffect, useState } from 'react'

/**
 * 动态获取最新安装包直链（三层兜底，永不 404）：
 * 1. latest.yml（electron-builder 版本目录，稳定地址）
 * 2. GitHub API releases/latest（解析 .exe 资产）
 * 3. 全部失败 → 跳 release 列表页（可手动下载，绝不 404）
 */
const LATEST_YML =
  'https://github.com/xuxuyouxiu/PodMuse/releases/latest/download/latest.yml'
const API =
  'https://api.github.com/repos/xuxuyouxiu/PodMuse/releases/latest'
const FALLBACK = 'https://github.com/xuxuyouxiu/PodMuse/releases/latest'

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
        if (alive)
          setUrl(`https://github.com/xuxuyouxiu/PodMuse/releases/download/v${version}/${path}`)
        return undefined
      })
      .catch(() =>
        fetch(API, { cache: 'no-store' })
          .then(r => (r.ok ? r.json() : Promise.reject()))
          .then(d => {
            const exe = (d.assets as Array<{ name: string; browser_download_url: string }>).find(
              a => a.name.endsWith('.exe') && !a.name.endsWith('.blockmap')
            )
            if (exe?.browser_download_url && alive) setUrl(exe.browser_download_url)
          })
          .catch(() => {})
      )

    return () => {
      alive = false
    }
  }, [])

  return url
}
