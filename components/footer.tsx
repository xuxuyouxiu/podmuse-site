'use client'

import GithubIcon from './github-icon'

interface FooterLink {
  label: string
  href: string
  external?: boolean
}

const buildGroups = (setupUrl: string): { title: string; links: FooterLink[] }[] => [
  {
    title: '产品',
    links: [
      { label: '完整链路', href: '#workflow' },
      { label: '产品体验', href: '#journey' },
      { label: '知识问答', href: '#qa' },
      { label: '下载', href: setupUrl },
    ],
  },
  {
    title: '资源',
    links: [
      { label: 'GitHub', href: 'https://github.com/xuxuyouxiu/PodMuse', external: true },
      {
        label: '更新日志',
        href: 'https://github.com/xuxuyouxiu/PodMuse/blob/main/CHANGELOG.md',
        external: true,
      },
      {
        label: 'License',
        href: 'https://github.com/xuxuyouxiu/PodMuse/blob/main/LICENSE',
        external: true,
      },
    ],
  },
]

export default function Footer({ setupUrl }: { setupUrl: string }) {
  const groups = buildGroups(setupUrl)

  return (
    <footer className="border-t border-slate-100">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-6">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-xs">
            <a href="#top" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
              <img src="/icon-192.png" alt="PodMuse" className="h-7 w-7 rounded-lg" />
              PodMuse
            </a>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              把播客变成你的第二大脑。粘贴一条链接，让每一期节目沉淀为可互链的知识资产。
            </p>
          </div>
          {groups.map(g => (
            <div key={g.title}>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-mute">
                {g.title}
              </div>
              <div className="mt-3.5 space-y-2.5">
                {g.links.map(l => (
                  <a
                    key={l.label}
                    href={l.href}
                    data-track-event={l.label === '下载' ? 'download-footer' : undefined}
                    target={l.external ? '_blank' : undefined}
                    rel={l.external ? 'noopener' : undefined}
                    className="block text-sm text-ink-soft transition-colors hover:text-brand"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 text-xs text-ink-mute md:flex-row">
          <span>© 2026 PodMuse · 免费 · 开源</span>
          <a
            href="https://github.com/xuxuyouxiu/PodMuse"
            target="_blank"
            rel="noopener"
            className="flex items-center gap-1.5 transition-colors hover:text-brand"
          >
            <GithubIcon className="h-3.5 w-3.5" />
            xuxuyouxiu/PodMuse
          </a>
        </div>
      </div>
    </footer>
  )
}
