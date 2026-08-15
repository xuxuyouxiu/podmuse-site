'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll } from 'framer-motion'
import SplitText from './split-text'
import DecryptedText from './decrypted-text'
import ShareCard from './share-card'

/**
 * 逐屏物品展示（Item-by-Item Reveal）：
 * 每向下滚动一段，舞台中央换一个「物品」——炫酷进场 → 停留 → 慢慢隐藏退场。
 * 序列：链接书 → 转写解密 → AI 总结 → 知识图谱 → 笔记输出 → 内容资产。
 * 滚动钉住驱动，双向。
 */

/* ═══ 物品 1：封面卡片（滚动进入/退出双向翻转） ═══ */
function LinkBook({ on = false }: { on?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        initial={{ rotateY: -90, opacity: 0 }}
        animate={on ? { rotateY: 0, opacity: 1 } : { rotateY: 90, opacity: 0 }}
        transition={{ duration: 1, ease: [0.22, 0.8, 0.23, 1] }}
        style={{ transformPerspective: 1100 }}
        className="relative h-[440px] w-[340px] -rotate-3 overflow-hidden rounded-2xl shadow-[0_42px_92px_rgba(84,56,159,0.17),0_14px_30px_rgba(84,56,159,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]"
      >
        {/* 渐变底 */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 70% 20%, rgba(255,255,255,0.75), transparent 25%), radial-gradient(circle at 24% 82%, rgba(161,122,240,0.4), transparent 25%), linear-gradient(145deg,#aa8cf5,#d9d1ff 50%,#f8f6ff)',
          }}
        />
        {/* 顶部眉字 */}
        <div className="absolute left-6 right-6 top-5 flex justify-between text-[9px] font-bold tracking-[2.5px] text-white/80">
          <span>PODCAST</span>
          <span>XIAOYUZHOU</span>
        </div>
        {/* 标题 */}
        <div className="absolute left-7 top-16 text-[34px] font-extrabold leading-[1.04] tracking-[-1.7px] text-[#211c35]">
          如何建立
          <br />
          长期主义
        </div>
        <div className="absolute left-7 top-[140px] text-[13px] tracking-[0.7px] text-[#615974]">
          一期播客 · 36:42 · 中文
        </div>
        {/* 波形装饰（两条斜弧线） */}
        <svg className="absolute bottom-[120px] left-7 right-7 h-[90px]" viewBox="0 0 200 74" fill="none" aria-hidden>
          <path d="M0 62 Q 100 6 200 62" stroke="rgba(72,54,119,0.22)" strokeWidth="2" fill="none" transform="skewX(-18) rotate(-7 100 37)" />
          <path d="M0 70 Q 100 14 200 70" stroke="rgba(72,54,119,0.22)" strokeWidth="2" fill="none" opacity="0.45" transform="skewX(12) rotate(8 100 37)" />
        </svg>
        {/* orb 光球 */}
        <div
          className="absolute -right-11 -bottom-10 h-[260px] w-[260px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(255,255,255,0.8) 0 8%, rgba(222,210,255,0.65) 22%, rgba(144,104,238,0.27) 44%, transparent 70%)',
          }}
        />
      </motion.div>
      <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-ink-mute/70">
        PASTE A LINK · 一条链接，打开一期内容
      </div>
    </div>
  )
}

/* ═══ 物品 2：转写解密（DecryptedText：乱码 → 文字） ═══ */
function TranscriptDecrypt({ on = false }: { on?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-brand/80">
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-brand" />
        TRANSCRIBING · 转写中
      </div>
      <DecryptedText
        key={on ? 'run' : 'idle'}
        text="今天我们聊到长期主义，其实本质不是坚持，而是把时间变成复利。"
        speed={65}
        maxIterations={16}
        sequential
        animateOn="view"
        revealDirection="start"
        useOriginalCharsOnly
        characters="▁▂▃▄▅▆▇█▒░"
        className="max-w-[92vw] text-center text-[21px] font-medium leading-relaxed tracking-tight text-ink sm:text-[30px]"
      />
      <div className="flex h-14 items-center gap-[6px]" aria-hidden>
        {[35, 60, 45, 85, 55, 75, 40, 90, 65, 50, 80, 45, 70, 55, 95, 40].map((h, i) => (
          <span
            key={i}
            className="wave-bar w-[6px] rounded-full bg-brand/50"
            style={{ height: `${h}%`, animationDelay: `${i * 0.07}s` }}
          />
        ))}
      </div>
    </div>
  )
}

/* ═══ 物品 3：AI 总结（要点逐条浮现） ═══ */
function AiSummary() {
  const rows = [
    ['一句话总结', '把播客变成你的知识库'],
    ['核心观点', '3 条要点 · 自动提炼'],
    ['金句摘录', '最有传播力的一句'],
  ]
  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand/80">AI 总结 · SUMMARY</div>
      <div className="mt-1 space-y-3">
        {rows.map(([k, v], i) => (
          <div key={k} className="ai-sum-row flex items-baseline gap-3" style={{ animationDelay: `${0.3 + i * 0.35}s` }}>
            <span className="w-20 shrink-0 text-right text-[13px] font-semibold text-ink-mute sm:w-28 sm:text-[16px]">{k}</span>
            <span className="text-[17px] font-medium text-ink sm:text-[24px]">{v}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══ 物品 4：知识图谱（迷你图谱） ═══ */
function MiniGraph() {
  const nodes = [
    { x: 40, y: 20, r: 4 }, { x: 110, y: 12, r: 4 }, { x: 180, y: 24, r: 4 },
    { x: 80, y: 56, r: 5.5 }, { x: 150, y: 52, r: 4 }, { x: 26, y: 52, r: 4 }, { x: 198, y: 56, r: 4 },
  ]
  const links = [[0,1],[1,2],[0,3],[1,3],[2,4],[3,4],[0,5],[3,5],[2,6],[4,6]]
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand/80">知识图谱 · KNOWLEDGE GRAPH</div>
      <svg viewBox="0 0 224 76" className="h-36 w-[310px] sm:h-60 sm:w-[560px]" fill="none" aria-hidden>
        {links.map(([a, b], i) => (
          <line key={i} className="flow-graph-link" x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
            stroke="#a855f7" strokeOpacity="0.35" strokeWidth="1.2"
            style={{ strokeDasharray: 80, strokeDashoffset: 80, animationDelay: `${0.15 + i * 0.1}s` }} />
        ))}
        {nodes.map((n, i) => (
          <circle key={i} className="flow-graph-node" cx={n.x} cy={n.y} r={n.r} fill="#7c3aed" fillOpacity="0.55"
            style={{ animationDelay: `${0.3 + i * 0.12}s` }} />
        ))}
      </svg>
      <div className="text-[15px] text-ink-mute">人物 · 项目 · 概念自动建卡互链</div>
    </div>
  )
}

/* ═══ 物品 5：笔记输出（笔记纸） ═══ */
function NotePaper() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand/80">笔记输出 · NOTES</div>
      <div className="note-pop w-[310px] rounded-[4px] bg-[#fbfaf7] px-7 py-7 shadow-[0_2px_10px_rgba(50,50,93,0.08),0_20px_44px_-18px_rgba(50,50,93,0.24)] sm:w-[430px] sm:px-10 sm:py-9">
        <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ink-mute/70">NOTES</div>
        <div className="mt-2 text-[21px] font-semibold leading-snug text-ink sm:text-[26px]">一期节目 · 一篇结构化笔记</div>
        <div className="mt-4 space-y-2.5">
          <div className="h-[2px] w-full rounded-full bg-slate-200" />
          <div className="h-[2px] w-11/12 rounded-full bg-slate-200" />
          <div className="h-[2px] w-4/5 rounded-full bg-slate-200" />
          <div className="h-[2px] w-full rounded-full bg-slate-200" />
          <div className="h-[2px] w-3/5 rounded-full bg-slate-200" />
        </div>
        <div className="mt-3 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-brand/70">
          <span className="h-px w-5 bg-[#d8ccf7]" /> 核心观点 · 金句 · 术语
        </div>
      </div>
      <div className="text-[15px] text-ink-mute">直接写入 Obsidian / 任何 Markdown 笔记库</div>
    </div>
  )
}

/* ═══ 物品 6：内容资产（真实分享卡 + PDF，等高对齐） ═══ */
function ContentAssets() {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-brand/80">内容资产 · CONTENT ASSETS</div>
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-9">
        {/* 图片：CSS 手绘分享卡 */}
        <div className="asset-pop overflow-hidden rounded-[4px] bg-[#fbfaf7] p-3 shadow-[0_2px_10px_rgba(50,50,93,0.08),0_16px_36px_-16px_rgba(50,50,93,0.2)]" style={{ animationDelay: '0.2s' }}>
          <ShareCard size="md" />
        </div>
        {/* PDF：与分享卡外框同高 */}
        <div className="asset-pop flex h-[304px] w-[215px] flex-col justify-between rounded-[3px] bg-white px-6 py-5 shadow-[0_2px_10px_rgba(50,50,93,0.08),0_16px_36px_-16px_rgba(50,50,93,0.2)]" style={{ animationDelay: '0.45s' }}>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-mute/70">PDF</div>
            <div className="mt-2 text-[19px] font-semibold leading-snug text-ink">正式文档</div>
          </div>
          <div className="space-y-2.5 pb-1">
            <div className="h-[2.5px] w-full rounded-full bg-slate-200" />
            <div className="h-[2.5px] w-4/5 rounded-full bg-slate-200" />
            <div className="h-[2.5px] w-3/5 rounded-full bg-slate-200" />
            <div className="h-[2.5px] w-full rounded-full bg-slate-200" />
            <div className="h-[2.5px] w-2/5 rounded-full bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══ 画廊收束：5 个产出物从左往右排列，逐个弹出（参考 HTML 阶段 4） ═══ */

function OutputPiece({
  label,
  children,
  delay,
}: {
  label: string
  children: React.ReactNode
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 0.8, 0.23, 1] }}
      className="flex w-[210px] shrink-0 flex-col"
    >
      <div className="mb-1 text-center text-[12px] font-extrabold uppercase tracking-[2.5px] text-ink-mute">{label}</div>
      <div className="flex h-[240px] items-center justify-center rounded-xl border border-brand/16 bg-white/70 shadow-[0_15px_30px_rgba(88,61,171,0.07),inset_0_1px_0_rgba(255,255,255,0.84)] backdrop-blur-sm">
        {children}
      </div>
    </motion.div>
  )
}

function Gallery() {
  return (
    <div className="flex w-full flex-col items-center gap-6 px-0 pb-0 lg:flex-row lg:items-stretch lg:px-0">
      {/* Obsidian：实体关系图谱 */}
      <OutputPiece label="OBSIDIAN" delay={0.1}>
        <svg viewBox="0 0 190 150" className="h-full w-full p-4" aria-hidden>
          {[
            [95, 75, 45, 40],
            [95, 75, 150, 45],
            [95, 75, 60, 118],
            [95, 75, 140, 115],
            [45, 40, 150, 45],
          ].map(([x1, y1, x2, y2], i) => (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#a855f7" strokeOpacity="0.4" strokeWidth="1.3" />
          ))}
          <circle cx="95" cy="75" r="16" fill="#7c3aed" fillOpacity="0.9" />
          <circle cx="45" cy="40" r="9" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="1.5" />
          <circle cx="150" cy="45" r="9" fill="#c4b5fd" stroke="#7c3aed" strokeWidth="1.5" />
          <circle cx="60" cy="118" r="9" fill="#ede9fe" stroke="#a78bfa" strokeWidth="1.5" />
          <circle cx="140" cy="115" r="9" fill="#ede9fe" stroke="#a78bfa" strokeWidth="1.5" />
          <text x="95" y="80" textAnchor="middle" fontSize="13" fontWeight="700" fill="#ffffff">笔记</text>
          <text x="45" y="63" textAnchor="middle" fontSize="11" fill="#6d28d9">人物</text>
          <text x="150" y="68" textAnchor="middle" fontSize="11" fill="#6d28d9">概念</text>
          <text x="60" y="142" textAnchor="middle" fontSize="11" fill="#7c3aed">项目</text>
          <text x="140" y="139" textAnchor="middle" fontSize="11" fill="#7c3aed">术语</text>
        </svg>
      </OutputPiece>
      {/* AI Chat */}
      <OutputPiece label="AI CHAT" delay={0.24}>
        <div className="p-3 text-center">
          <div className="text-[20px] font-bold leading-[1.5] text-ink">
            从原文整理出 <em className="not-italic text-brand">3 个核心结论</em>。
          </div>
          <div className="mt-1.5 text-[13px] text-ink-mute">自动整理 · 保留来源</div>
        </div>
      </OutputPiece>
      {/* Notes */}
      <OutputPiece label="NOTES" delay={0.38}>
        <div className="w-full p-4">
          <div className="text-[21px] font-extrabold leading-snug text-ink">一期节目<br />一篇结构化笔记</div>
          <div
            className="mt-2 h-[80px]"
            style={{ background: 'repeating-linear-gradient(180deg, rgba(102,91,120,0.18) 0 1px, transparent 1px 18px)' }}
          />
        </div>
      </OutputPiece>
      {/* Image：CSS 手绘分享卡 */}
      <OutputPiece label="IMAGE" delay={0.52}>
        <ShareCard size="sm" />
      </OutputPiece>
      {/* PDF */}
      <OutputPiece label="PDF" delay={0.66}>
        <div className="flex h-[210px] w-[160px] flex-col justify-between rounded-[3px] bg-white p-4">
          <div className="text-[19px] font-extrabold text-ink">正式文档</div>
          <div className="space-y-3 pb-1">
            <div className="h-px w-full bg-[#5b4f72]/25" />
            <div className="h-px w-full bg-[#5b4f72]/25" />
            <div className="h-px w-2/3 bg-[#5b4f72]/25" />
            <div className="h-px w-full bg-[#5b4f72]/25" />
          </div>
        </div>
      </OutputPiece>
    </div>
  )
}

const ITEMS: Array<React.ComponentType<{ on?: boolean }>> = [
  LinkBook,
  TranscriptDecrypt,
  AiSummary,
  MiniGraph,
  NotePaper,
  ContentAssets,
]

function Head() {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <motion.p
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: '-60px' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-[11px] font-semibold uppercase tracking-[0.42em] text-brand/70"
      >
        FROM ONE LINK, TO CONTENT ASSETS
      </motion.p>
      <SplitText
        text="一条链接，变成内容资产"
        tag="h2"
        splitType="words"
        delay={100}
        duration={1}
        ease="power2.out"
        from={{ opacity: 0, y: 24 }}
        to={{ opacity: 1, y: 0 }}
        rootMargin="-80px"
        className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl"
        textAlign="center"
      />
    </div>
  )
}

export default function Workflow() {
  const ref = useRef<HTMLDivElement>(null)
  // 初始 -1（未滚入板块）：第一张卡保持隐藏，滑到板块才翻转入场
  const [stage, setStage] = useState(-1)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  useEffect(() => {
    const unsub = scrollYProgress.on('change', v => {
      const s = v <= 0.005 ? -1 : Math.min(7, Math.max(0, Math.floor(v / 0.132)))
      setStage(s)
    })
    return () => unsub()
  }, [scrollYProgress])

  return (
    <section id="workflow" className="relative border-t border-slate-100">
      <div ref={ref} className="relative h-[560vh]">
        <div aria-hidden className="flow-aura absolute left-1/2 top-1/3 h-[420px] w-[760px] -translate-x-1/2 opacity-60" />
        <div className="sticky top-0 flex h-screen flex-col overflow-hidden pb-7 pt-20">
          <div className="mx-auto w-full max-w-6xl px-5 md:px-6">
            <Head />
          </div>

          {/* 物品舞台：flex-1 顶到底部，边界留两行字距离 */}
          <div className="relative mx-auto mt-2 flex w-full max-w-6xl flex-1 items-center justify-center px-5 md:px-6">
            {ITEMS.map((Item, i) => {
              const on = stage === i
              const done = stage > i && stage < 7
              return (
                <div
                  key={i}
                  className={`absolute transition-all duration-[1100ms] ease-out ${on ? 'item-on opacity-100 scale-100 blur-0' : done ? 'opacity-0 scale-[0.92] blur-[3px]' : 'opacity-0 scale-[0.85] blur-[6px]'}`}
                >
                  <Item on={on} />
                </div>
              )
            })}

            {/* 画廊收束（桌面：sticky 内横排，滚到才挂载） */}
            {stage >= 7 && (
              <div className="absolute hidden opacity-100 scale-100 lg:block">
                <Gallery />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 手机：画廊竖排（sticky 结束后的正常文档流） */}
      <div className="px-5 pb-16 lg:hidden">
        <div className="mx-auto flex w-full max-w-[300px] flex-col gap-5">
          <Gallery />
        </div>
      </div>
    </section>
  )
}
