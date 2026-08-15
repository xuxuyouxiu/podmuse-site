'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Download, ArrowDown, BookMarked, LayoutDashboard, Rss, History, Network, Search, MessageCircle, Settings } from 'lucide-react'
import { useLatestSetupUrl } from './latest-setup'

/** 知识节点连线 SVG（Hero 背景装饰，轻） */
function KnowledgeNodes() {
  const nodes = [
    { x: 18, y: 22, r: 3.5 },
    { x: 50, y: 10, r: 2.5 },
    { x: 82, y: 26, r: 3 },
    { x: 32, y: 62, r: 2.5 },
    { x: 68, y: 74, r: 3.5 },
    { x: 88, y: 56, r: 2 },
  ]
  const links = [
    [0, 1],
    [0, 2],
    [1, 2],
    [0, 3],
    [2, 4],
    [3, 4],
    [4, 5],
    [2, 5],
  ]
  return (
    <svg
      viewBox="0 0 100 86"
      className="pointer-events-none absolute -right-8 -top-6 h-56 w-56 opacity-30 md:-right-16 md:h-72 md:w-72"
      aria-hidden
    >
      {links.map(([a, b], i) => (
        <line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="#a855f7"
          strokeWidth="0.4"
          strokeDasharray="2 1.6"
        />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.r} fill="#7c3aed" fillOpacity="0.5" />
      ))}
    </svg>
  )
}

/** 迷你工作台：1:1 模拟真实 PodMuse 界面（浅色主题，真实 tokens，放大版） */
function WorkspaceShot() {
  const sideItems = [
    { label: '笔记库', icon: BookMarked, active: false },
    { label: '工作台', icon: LayoutDashboard, active: true },
    { label: '订阅', icon: Rss, active: false },
    { label: '历史', icon: History, active: false },
    { label: '知识关联', icon: Network, active: false },
    { label: '搜索', icon: Search, active: false },
    { label: '问答', icon: MessageCircle, active: false },
  ]
  return (
    <div className="relative mx-auto w-full max-w-[560px] xl:mx-0">
      {/* 浮动装饰 */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-5 left-2 z-10 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 shadow-[0_2px_6px_rgba(50,50,93,0.08),0_12px_24px_-8px_rgba(50,50,93,0.14)] sm:-left-5 md:-left-8"
      >
        <div className="text-[11px] font-medium text-ink-mute">识别平台</div>
        <div className="text-[13px] font-semibold text-brand">抖音 · B站 · 小宇宙 · YouTube</div>
      </motion.div>

      {/* 主窗口：真实结构 */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_6px_rgba(50,50,93,0.08),0_18px_40px_-8px_rgba(50,50,93,0.16)]">
        {/* 标题栏 */}
        <div className="flex items-center gap-1.5 border-b border-slate-100 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-300" />
          <span className="h-3 w-3 rounded-full bg-amber-300" />
          <span className="h-3 w-3 rounded-full bg-green-300" />
          <span className="ml-3 text-[13px] text-ink-mute">PodMuse</span>
          <span className="ml-auto text-[11px] text-ink-mute">v1.45.4</span>
        </div>
        <div className="flex bg-[#fafafa]">
          {/* 侧边栏（真实 7 项 + 任务概览） */}
          <div className="hidden w-44 shrink-0 border-r border-black/5 bg-white/60 p-3 sm:block">
            <div className="flex items-center gap-2 px-2 pb-2 text-[14px] font-bold text-[#18181b]">
              <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-lg">
                <img src="/icon-192.png" alt="" className="h-full w-full object-cover" />
              </span>
              PodMuse
            </div>
            {sideItems.map(item => (
              <div
                key={item.label}
                className={`mb-0.5 flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12.5px] ${
                  item.active
                    ? 'bg-[#7c3aed]/12 font-semibold text-[#7c3aed]'
                    : 'text-[#52525b]'
                }`}
              >
                <item.icon
                  size={14}
                  strokeWidth={item.active ? 2.2 : 1.8}
                  className={item.active ? 'text-[#7c3aed]' : 'text-slate-400'}
                />
                {item.label}
              </div>
            ))}
            <div className="mt-2.5 border-t border-black/5 pt-2">
              <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#a1a1aa]">
                任务概览
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 text-[11px] text-[#52525b]">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                进行中 <b className="ml-auto text-[#18181b]">2</b>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 text-[11px] text-[#52525b]">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                排队中 <b className="ml-auto text-[#18181b]">1</b>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-0.5 text-[11px] text-[#52525b]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                今日完成 <b className="ml-auto text-[#18181b]">5</b>
              </div>
            </div>
            <div className="mt-2.5 border-t border-black/5 pt-2">
              <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[12px] text-[#52525b]">
                <Settings size={14} strokeWidth={1.8} className="text-slate-400" />
                设置
              </div>
            </div>
          </div>
          {/* 主区（真实 workspace 结构） */}
          <div className="min-w-0 flex-1 overflow-hidden p-4">
            {/* workspace-hero */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#7c3aed]">
                  AI 播客工作区
                </div>
                <div className="mt-0.5 text-[15px] font-bold text-[#18181b]">下午好，欢迎回来</div>
                <div className="text-[11px] text-[#52525b]">粘贴链接，AI 自动转写并生成结构化笔记</div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                处理中 1 项
              </span>
            </div>
            {/* 统计 */}
            <div className="mt-2.5 flex gap-7">
              {[
                ['5', '今日完成'],
                ['122', '累计笔记'],
                ['89.8%', '成功率'],
              ].map(([v, l]) => (
                <div key={l}>
                  <div className="text-[17px] font-extrabold leading-none text-[#18181b]">{v}</div>
                  <div className="mt-1 text-[10px] text-[#a1a1aa]">{l}</div>
                </div>
              ))}
            </div>
            {/* UrlInput 真实卡 */}
            <div className="mt-2.5 rounded-xl border border-black/8 bg-white p-3 shadow-sm">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#7c3aed]">
                开始新任务
              </div>
              <div className="mt-0.5 text-[13px] font-semibold text-[#18181b]">粘贴链接开始处理</div>
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-[#7c3aed]/35 px-3 py-2">
                <span className="min-w-0 flex-1 truncate text-[11px] text-[#a1a1aa]">
                  支持抖音、B 站、小宇宙、YouTube、喜马拉雅、Apple Podcasts 及直接音频链接
                </span>
                <span className="rounded-md bg-[#7c3aed] px-3 py-1.5 text-[11px] font-medium text-white">
                  开始处理
                </span>
              </div>
            </div>
            {/* 处理队列（真实任务） */}
            <div className="mt-2.5 text-[10px] font-bold uppercase tracking-wider text-[#a1a1aa]">
              处理队列 · 2
            </div>
            <div className="mt-1 rounded-xl border border-black/8 bg-white p-2.5">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
                <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-[#18181b]">
                  你聪明的大脑，可能不是你爸妈给的
                </span>
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                  处理中
                </span>
              </div>
              <div className="mt-0.5 text-[10px] text-[#a1a1aa]">小宇宙 · 提炼中 · 步骤 3/5</div>
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-[#7c3aed] to-[#a855f7]" />
              </div>
            </div>
            <div className="mt-1 rounded-xl border border-black/8 bg-white p-2.5">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-[#18181b]">
                  美妆巨头集体盯上头发，洗护生意为何又热起来？
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                  完成
                </span>
              </div>
              <div className="mt-0.5 text-[10px] text-[#a1a1aa]">B站 · 已完成 · 4.2k 字</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Hero() {
  const setupUrl = useLatestSetupUrl()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, 80])

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-screen snap-start items-center overflow-x-clip"
    >
      {/* 背景光斑（radial 渐变，无 filter blur，防 Windows GPU 黑线 artifact） */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[860px] -translate-x-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(closest-side, rgba(124,58,237,0.10), rgba(168,85,247,0.05) 55%, rgba(236,72,153,0.04) 78%, transparent 100%)',
        }}
      />

      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-8 px-5 pb-14 pt-24 xl:grid-cols-2 xl:px-6 xl:pt-28">
        <motion.div style={{ y }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs text-ink-soft"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            全新上线 · 完全免费
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-6 text-[34px] font-semibold leading-[1.06] tracking-tight sm:text-[44px] md:text-[68px]"
          >
            把播客，
            <br />
            变成你的
            <br />
            <span className="font-display italic text-brand">第二大脑</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-5 max-w-md text-base leading-relaxed text-ink-soft sm:text-lg"
          >
            粘贴一条链接，AI 自动转写、提炼、结构化——让每一期节目都沉淀为可复用、可互链的知识资产。
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <a
              href={setupUrl}
              className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-base font-medium text-white shadow-lg shadow-brand/25 transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              <Download className="h-4 w-4" />
              免费下载
            </a>
            <a
              href="#journey"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-brand"
            >
              看它怎么工作
              <ArrowDown className="h-3.5 w-3.5" />
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-9 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-mute"
          >
            <span>✓ 数据 100% 存本地</span>
            <span>✓ 支持主流播客平台</span>
            <span>✓ 免费开源</span>
          </motion.div>
        </motion.div>

        {/* App 窗口（浮动 + 节点装饰，放大完整显示） */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative min-w-0"
        >
          <KnowledgeNodes />
          <WorkspaceShot />
        </motion.div>
      </div>
    </section>
  )
}
