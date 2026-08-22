export interface LatestRelease {
  version: string
  /** 主下载地址：阿里云 CDN（dl.xuxuya66.top，源站 OSS bucket podmuse），国内全速无需 VPN */
  url: string
  /** 备用地址：GitHub 直链（挂 VPN 的用户/海外用户） */
  mirrorUrl: string
}

const GH = 'https://github.com/xuxuyouxiu/PodMuse'
/** 阿里云 CDN 下载域（与桌面应用内更新通道同源；发布流程自动同步产物到 download/v{version}/） */
const CDN = 'https://dl.xuxuya66.top'
// 静态兜底：GitHub API 不可用时使用（发布新版本后记得同步更新）
const STATIC_VERSION = '1.52.6'

function cdnUrl(version: string): string {
  return `${CDN}/download/v${version}/PodMuse-Setup-${version}.exe`
}

function githubUrl(version: string): string {
  return `${GH}/releases/download/v${version}/PodMuse-Setup-${version}.exe`
}

/**
 * 版本号来源优先级：
 * 1. 自己的 CDN latest.yml（国内可达，构建机在海外也能访问）
 * 2. GitHub API
 * 3. 静态兜底版本号（STATIC_VERSION）
 * 任一途径拿到版本号后，下载地址一律走自有 CDN。
 */
async function resolveVersion(): Promise<string> {
  // 1) CDN latest.yml
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 6000)
    const res = await fetch(`${CDN}/download/v${STATIC_VERSION}/latest.yml`, {
      signal: controller.signal,
      cache: 'no-store',
    })
    clearTimeout(timer)
    if (res.ok) {
      const text = await res.text()
      const m = text.match(/^version:\s*(\d+\.\d+\.\d+)\s*$/m)
      if (m) return m[1]
    }
  } catch {}

  // 2) GitHub API
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 6000)
    const res = await fetch('https://api.github.com/repos/xuxuyouxiu/PodMuse/releases/latest', {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'PodMuse-Website' },
      signal: controller.signal,
    })
    clearTimeout(timer)
    if (res.ok) {
      const data = (await res.json()) as { tag_name?: string; name?: string }
      const v = (data.tag_name ?? data.name ?? '').replace(/^v/i, '').trim()
      if (/^\d+\.\d+\.\d+$/.test(v)) return v
    }
  } catch {}

  // 3) 静态兜底
  return STATIC_VERSION
}

/**
 * 在 Next.js 构建时获取最新版本并拼出下载地址。
 * 只在服务端组件/构建期调用，不会打包进浏览器。
 *
 * 注意：Next 静态导出/ISR 下版本号是构建时快照——发新版本后需重新构建部署官网
 * （或后续改为动态路由/定时重建）。下载地址本身始终指向 CDN 对应版本目录。
 */
export async function getLatestRelease(): Promise<LatestRelease> {
  let version = STATIC_VERSION
  try {
    version = await resolveVersion()
  } catch {}
  return {
    version,
    url: cdnUrl(version),
    mirrorUrl: githubUrl(version),
  }
}
