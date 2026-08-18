export interface LatestRelease {
  version: string
  url: string
  mirrorUrl: string
}

const GH = 'https://github.com/xuxuyouxiu/PodMuse'
const MIRROR = 'https://ghfast.top/'
const GITHUB_API = 'https://api.github.com/repos/xuxuyouxiu/PodMuse/releases/latest'
// 静态兜底：GitHub API 不可用时使用（发布新版本后记得同步更新）
const STATIC_VERSION = '1.47.3'

function setupUrl(version: string): string {
  return `${GH}/releases/download/v${version}/PodMuse-Setup-${version}.exe`
}

function fallbackRelease(): LatestRelease {
  const url = setupUrl(STATIC_VERSION)
  return {
    version: STATIC_VERSION,
    url,
    mirrorUrl: `${MIRROR}${url}`,
  }
}

/**
 * 在 Next.js 构建时获取 GitHub 最新 Release。
 * 只在服务端组件/构建期调用，不会打包进浏览器。
 */
export async function getLatestRelease(): Promise<LatestRelease> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 6000)

    const res = await fetch(GITHUB_API, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'PodMuse-Website',
      },
      signal: controller.signal,
    })
    clearTimeout(timer)

    if (!res.ok) return fallbackRelease()

    const data = (await res.json()) as { tag_name?: string; name?: string }
    const rawVersion = data.tag_name ?? data.name ?? ''
    const version = rawVersion.replace(/^v/i, '').trim()

    if (!/^\d+\.\d+\.\d+$/.test(version)) return fallbackRelease()

    const url = setupUrl(version)
    return {
      version,
      url,
      mirrorUrl: `${MIRROR}${url}`,
    }
  } catch {
    return fallbackRelease()
  }
}
