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
// GitHub 加速镜像（国内可直连，点击即下载安装包文件）
const MIRRORS = [
  'https://ghfast.top/',
  'https://gh-proxy.com/',
  'https://ghproxy.net/',
]

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
        const direct = `https://github.com/xuxuyouxiu/PodMuse/releases/download/v${version}/${path}`
        if (alive) setUrl(`${MIRRORS[0]}${direct}`) // 镜像直下安装包
        return undefined
      })
      .catch(() =>
        fetch(API, { cache: 'no-store' })
          .then(r => (r.ok ? r.json() : Promise.reject()))
          .then(d => {
            const exe = (d.assets as Array<{ name: string; browser_download_url: string }>).find(
              a => a.name.endsWith('.exe') && !a.name.endsWith('.blockmap')
            )
            if (exe?.browser_download_url && alive)
              setUrl(`${MIRRORS[0]}${exe.browser_download_url}`)
          })
          .catch(() => {})
      )

    return () => {
      alive = false
    }
  }, [])

  return url
}
