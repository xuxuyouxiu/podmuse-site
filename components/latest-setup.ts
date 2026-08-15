'use client'

import { useEffect, useState } from 'react'

/**
 * 动态获取最新安装包直链。
 * 读取 electron-builder 生成的 latest.yml（稳定地址，文件名不含版本号），
 * 解析出最新版本号 + 安装包文件名，拼出精确直链。
 * 失败时回退到当前已知版本。
 */
const LATEST_YML =
  'https://github.com/xuxuyouxiu/PodMuse/releases/latest/download/latest.yml'
const FALLBACK =
  'https://github.com/xuxuyouxiu/PodMuse/releases/latest/download/PodMuse-Setup-1.47.2.exe'

export function useLatestSetupUrl(): string {
  const [url, setUrl] = useState(FALLBACK)

  useEffect(() => {
    fetch(LATEST_YML)
      .then(r => r.text())
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
        if (version && path) {
          setUrl(`https://github.com/xuxuyouxiu/PodMuse/releases/download/v${version}/${path}`)
        }
      })
      .catch(() => {})
  }, [])

  return url
}
