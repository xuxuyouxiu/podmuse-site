'use client'

import { useEffect, useRef, useState } from 'react'
import { useMotionValueEvent, useScroll } from 'framer-motion'
import OptionWheel from './option-wheel'
import ScrollReveal from './scroll-reveal'

/* ================= 工作台队列卡：步骤 1→5 线性推进（文案随步骤变），完成自动切卡 ================= */
const PARSE_STEPS = ['下载音频', '语音转写', '智能提炼', '生成总结', '笔记归档']

function WorkbenchQueue({ active }: { active: boolean }) {
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!active) return
    // 步骤 1/5 → 5/5 线性推进，不再回环；5/5 完成后自动切完成态
    const iv = setInterval(() => {
      setStep(prev => {
        if (prev >= 5) {
          clearInterval(iv)
          setTimeout(() => setDone(true), 500)
          return prev
        }
        return prev + 1
      })
    }, 800)
    return () => clearInterval(iv)
  }, [active])

  const pct = Math.round((step / 5) * 100) // 百分比随步骤同步

  /* 完成态：整张卡切换 */
  if (done) {
    return (
      <div className="mt-2 rounded-xl border border-emerald-200 bg-white p-3">
        <div className="flex items-center gap-2">
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">✓</span>
          <span className="flex-1 truncate text-xs font-medium text-slate-900">
            你聪明的大脑，可能不是你爸妈给的
          </span>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">完成</span>
        </div>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full w-full rounded-full bg-emerald-400" />
        </div>
        <div className="mt-1.5 text-right text-[10px] text-slate-400">转写完成 · 耗时 3 分 42 秒</div>
      </div>
    )
  }

  /* 处理中态 */
  return (
    <div className="mt-2 rounded-xl border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-amber-400" />
        <span className="flex-1 truncate text-xs font-medium text-slate-900">
          {step < 5 ? `正在${PARSE_STEPS[step - 1]}…` : '即将完成…'}
        </span>
        <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">处理中</span>
      </div>
      <div className="mt-0.5 text-[10px] text-slate-400">
        小宇宙 · {PARSE_STEPS[step - 1]} · 步骤 {step}/5
      </div>
      <div className="relative mt-1.5 h-1 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand to-brand-light transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
        <span
          className="absolute top-0 h-full w-2 rounded-full bg-white/90 blur-[2px] transition-[left] duration-500 ease-out"
          style={{ left: `calc(${pct}% - 3px)` }}
        />
      </div>
      <div className="mt-1 text-right text-[10px] font-semibold text-brand">{pct}%</div>
    </div>
  )
}

/* ================= AI 问答：JS 打字机（光标紧贴文字末尾）+ 延迟弹出回答 ================= */
const QA_TEXT = '大脑的可塑性到了成年还有多少？'

function QaStage({ active }: { active: boolean }) {
  const [n, setN] = useState(0)
  const [answered, setAnswered] = useState(false)

  useEffect(() => {
    if (!active) return
    const iv = setInterval(() => {
      setN(prev => {
        if (prev >= QA_TEXT.length) {
          clearInterval(iv)
          setTimeout(() => setAnswered(true), 700)
          return prev
        }
        return prev + 1
      })
    }, 130)
    return () => clearInterval(iv)
  }, [active])

  return (
    <>
      <div className="mt-4 rounded-xl rounded-tl-sm bg-brand/8 px-3.5 py-2.5 text-xs text-slate-800">
        {QA_TEXT.slice(0, n)}
        <span className="qa-cursor" aria-hidden />
      </div>
      {answered && (
        <div className="mt-2.5 rounded-xl rounded-tr-sm border border-slate-200 bg-white px-3.5 py-2.5 text-xs leading-relaxed text-slate-700">
          成年大脑仍具可塑性。2000 年伦敦出租车司机研究发现，海马体随导航经验增长——神经可塑性伴随我们一生。
          <div className="mt-2 text-[10px] text-brand">来源：你聪明的大脑 · 第 2 部分</div>
        </div>
      )}
    </>
  )
}

/* ================= 知识图谱 SVG（8 节点环形网：节点弹出 + 连线生长 + 光点持续沿线流动） ================= */
function Graph({ full }: { full: boolean }) {
  const nodes = [
    { x: 150, y: 142, r: 16, label: '播客笔记', core: true },
    { x: 58, y: 44, r: 10, label: '欧莱雅' },
    { x: 46, y: 150, r: 10, label: '卡诗' },
    { x: 64, y: 242, r: 10, label: '商业观察' },
    { x: 152, y: 254, r: 10, label: '伦敦大学' },
    { x: 242, y: 238, r: 10, label: '双语优势' },
    { x: 254, y: 148, r: 10, label: '海马体' },
    { x: 240, y: 46, r: 10, label: '神经可塑性' },
  ]
  const links = [
    [0, 1],
    [0, 2],
    [0, 3],
    [0, 4],
    [0, 5],
    [0, 6],
    [0, 7],
    [1, 7],
    [7, 6],
    [6, 5],
    [5, 4],
    [4, 3],
    [3, 2],
    [2, 1],
  ]
  // stage 5：核心 + 左半圈 3 个实体（连线全部有端点，不悬空）
  const shown = full ? links.length : 3
  const shownNodes = full ? nodes.length : 4
  return (
    <svg viewBox="0 0 300 280" className="mx-auto h-64 w-full" aria-hidden>
      {/* 连线：生长动画 + 虚线持续流动 */}
      {links.slice(0, shown).map(([a, b], i) => (
        <g key={i}>
          <line
            className="flow-graph-link"
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="#a855f7"
            strokeOpacity="0.4"
            strokeWidth="1.4"
            style={{ strokeDasharray: '6 4', strokeDashoffset: 0, animationDelay: `${0.15 + i * 0.08}s` }}
          />
          {/* SMIL 沿线流动光点（加大加亮，持续往返） */}
          <circle r="3.2" fill="#7c3aed" opacity="0.85">
            <animateMotion
              dur={`${2.2 + (i % 4) * 0.45}s`}
              repeatCount="indefinite"
              path={`M ${nodes[a].x} ${nodes[a].y} L ${nodes[b].x} ${nodes[b].y}`}
            />
          </circle>
        </g>
      ))}
      {nodes.slice(0, shownNodes).map((n, i) => (
        /* 节点球持续上下浮动 */
        <g
          key={i}
          className="graph-float"
          style={{
            animationDelay: `${i * 0.3}s`,
            transformBox: 'fill-box',
            transformOrigin: 'center',
          }}
        >
          <circle
            className="flow-graph-node"
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={n.core ? '#0f172a' : '#7c3aed'}
            fillOpacity="0.85"
            stroke={n.core ? '#7c3aed' : 'none'}
            strokeWidth={n.core ? 2.5 : 0}
            style={{ animationDelay: `${0.3 + i * 0.09}s` }}
          />
          <text
            x={n.x + n.r + 6}
            y={n.y + 4}
            fontSize={11}
            fontWeight={600}
            fill={n.core ? '#1e1b4b' : '#334155'}
            className="graph-label"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

/* ================= 8 阶段窗口内容 ================= */
function StagePanel({ stage }: { stage: number }) {
  return (
    <div className="relative h-full w-full">
      {/* 1 工作台 */}
      <div className={`stage ${stage === 1 ? 'stage-on' : 'stage-off'}`}>
        <div className="stage-anim stage-anim-1 text-sm font-semibold text-slate-900">工作台</div>
        {/* 输入框：已粘贴链接（真实运行状态） */}
        <div className="stage-anim stage-anim-2 mt-3 rounded-lg border border-brand/35 bg-white px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-[11px]" aria-hidden>🔗</span>
            <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-700">
              随机波动 Vol.100 · 我们如何理解长期主义
            </span>
            <span className="shrink-0 rounded-md bg-brand px-2.5 py-1 text-[10px] font-medium text-white">开始处理</span>
          </div>
        </div>
        <div className="stage-anim stage-anim-3 mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">处理队列</div>
        <WorkbenchQueue key={stage} active={stage === 1} />
      </div>

      {/* 2 音频淡出（声波渐隐） */}
      <div className={`stage ${stage === 2 ? 'stage-on' : 'stage-off'}`}>
        <div className="stage-anim stage-anim-1 text-sm font-semibold text-slate-900">语音转写</div>
        <div className="stage-anim stage-anim-2 stage-fade mt-6 flex h-32 items-center justify-center gap-1">
          {[24, 52, 36, 76, 44, 92, 58, 100, 64, 40, 80, 48, 68, 30, 56, 72].map((h, i) => (
            <span
              key={i}
              className="wave-bar w-1.5 rounded-full bg-gradient-to-t from-brand to-brand-light"
              style={{ height: `${h}%`, animationDelay: `${i * 0.07}s` }}
            />
          ))}
        </div>
        <div className="stage-anim stage-anim-3 stage-fade-slow mt-4 text-center text-xs text-slate-400">
          24,831 字 → 4,200 字精华
        </div>
      </div>

      {/* 3 笔记生成 */}
      <div className={`stage ${stage === 3 ? 'stage-on' : 'stage-off'}`}>
        <div className="stage-anim stage-anim-1 flex items-center gap-2 text-sm font-semibold text-slate-900">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-brand text-[10px] text-white">N</span>
          你聪明的大脑，可能不是你爸妈给的
        </div>
        <div className="stage-anim stage-anim-2 mt-3 rounded-lg border-l-2 border-brand bg-brand/5 p-3 text-xs leading-relaxed text-slate-700">
          一句话总结：成年大脑仍具可塑性，天赋之外，环境与训练塑造了我们的认知能力。
        </div>
        <div className="mt-2.5 space-y-1.5">
          {['伦敦出租车司机研究：海马体随导航经验增长', '双语儿童执行功能更强', '神经可塑性持续终生'].map((p, i) => (
            <div key={i} className={`stage-item stage-anim stage-anim-${i + 3} flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700`}>
              <span className="h-1 w-1 rounded-full bg-brand" />
              {p}
            </div>
          ))}
        </div>
      </div>

      {/* 4 关键实体浮现 */}
      <div className={`stage ${stage === 4 ? 'stage-on' : 'stage-off'}`}>
        <div className="stage-anim stage-anim-1 text-sm font-semibold text-slate-900">关键实体</div>
        <div className="mt-5 flex flex-wrap gap-2">
          {['神经可塑性', '海马体', '伦敦大学', '双语优势', '认知训练'].map((e, i) => (
            <span
              key={e}
              className={`stage-chip rounded-full border border-brand/25 bg-brand/8 px-3 py-1.5 text-xs font-medium text-brand ${
                stage === 4 ? '' : 'opacity-0'
              }`}
              style={stage === 4 ? { animation: 'chip-in 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards', animationDelay: `${0.15 + i * 0.12}s` } : undefined}
            >
              {e}
            </span>
          ))}
        </div>
        <div className="stage-anim stage-anim-2 mt-6 text-xs text-slate-400">人物 · 项目 · 概念 · 术语，自动建档</div>
      </div>

      {/* 5 节点开始连接 */}
      <div className={`stage ${stage === 5 ? 'stage-on' : 'stage-off'}`}>
        <div className="stage-anim stage-anim-1 text-sm font-semibold text-slate-900">知识关联</div>
        <div className="mt-2"><Graph full={false} /></div>
      </div>

      {/* 6 知识图谱形成 */}
      <div className={`stage ${stage === 6 ? 'stage-on' : 'stage-off'}`}>
        <div className="stage-anim stage-anim-1 text-sm font-semibold text-slate-900">知识图谱</div>
        <div className="mt-2"><Graph full={true} /></div>
      </div>

      {/* 7 AI 开始回答（JS 打字机输入 → 延迟后弹出回答） */}
      <div className={`stage ${stage === 7 ? 'stage-on' : 'stage-off'}`}>
        <div className="stage-anim stage-anim-1 text-sm font-semibold text-slate-900">知识问答</div>
        <QaStage key={stage} active={stage === 7} />
      </div>
    </div>
  )
}

/* ================= 右侧叙事 → 弧形滚轮（OptionWheel） ================= */
const WHEEL_ITEMS = [
  '从工作台开始',
  '音频淡出',
  '笔记生成',
  '实体浮现',
  '节点连接',
  '图谱形成',
  'AI 回答',
]

/* Step Story 叙事文案：标题 + 描述 + CTA */
const STEPS = [
  { t: '从工作台开始', d: '把一期播客，交给 PodMuse。', cta: '开始处理' },
  { t: '音频淡出', d: '两万字的絮语，沉淀成四千字干货。', cta: '继续' },
  { t: '笔记生成', d: '一句话总结，三条核心观点，干净利落。', cta: '继续' },
  { t: '实体浮现', d: '人物、公司、概念，从声音里逐一浮现。', cta: '继续' },
  { t: '节点连接', d: '新的认识，和旧的知识，开始牵手。', cta: '继续' },
  { t: '图谱形成', d: '知识不再散落，长成一张只属于你的网。', cta: '继续' },
  { t: 'AI 回答', d: '随时提问，答案来自你听过的每一期。', cta: '去下载' },
]

export default function Journey() {
  const sectionRef = useRef<HTMLElement>(null)
  const [stage, setStage] = useState(1)
  // sticky 是否固定（板块顶部已到视口顶、且未滚完）——只有固定期间滚轮才接管滚动
  const [stickyActive, setStickyActive] = useState(false)

  const wheelToStage = (idx: number) => {
    // 滚轮交互：切阶段 + 同步滚动页面到对应位置（两边永远一致，不会脱节）
    setStage(idx + 1)
    const top = sectionRef.current?.offsetTop ?? 0
    const bufferV = 0.08
    const vc = idx === 0 ? 0 : bufferV + (idx / 7) * (1 - bufferV)
    window.scrollTo({ top: top + vc * window.innerHeight, behavior: 'smooth' })
  }

  // 页面滚动驱动（sticky 固定屏贯穿 200vh）
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  useMotionValueEvent(scrollYProgress, 'change', v => {
    // 用 framer 的进度 v（0=板块顶部刚进视口，1=板块滚完）直接映射阶段：
    // 数学上 v=1 必然对应第 8 阶段，不存在"够不着最后一项"的问题
    const vc = Math.min(1, Math.max(0, v))
    setStickyActive(v > 0.005 && v < 0.999)
    const bufferV = 0.08 // 8% 进度缓冲：消化上游惯性，进入时先停在阶段 1
    const p = vc <= bufferV ? 0 : (vc - bufferV) / (1 - bufferV)
    setStage(Math.min(7, Math.floor(p * 7) + 1))
  })

  return (
    <section id="journey" ref={sectionRef} className="relative overflow-x-clip border-t border-slate-100 lg:h-[200vh]">
      <div className="flex min-h-screen flex-col pt-20 pb-7 lg:sticky lg:top-0 lg:h-screen">
        {/* 顶部居中标题（与「完整链路」板块同格式） */}
        <div className="mx-auto w-full max-w-6xl px-5 md:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.42em] text-brand/70">
              THE PRODUCT, STEP BY STEP
            </p>
            {/* 标题：纯静态，无任何效果 */}
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-ink md:text-5xl">
              一次处理，每一步都看得见
            </h2>
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-6xl items-center gap-6 px-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.95fr)_minmax(0,0.8fr)] lg:gap-4 lg:px-6">
        {/* 左：App 窗口（滚轮驱动 8 阶段切换） */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_6px_rgba(50,50,93,0.08),0_18px_40px_-8px_rgba(50,50,93,0.16)]">
          <div className="flex items-center gap-1.5 border-b border-slate-100 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
            <span className="ml-3 text-xs text-slate-400">PodMuse</span>
          </div>
          <div className="flex bg-[#fafafa]">
            <div className="hidden w-36 shrink-0 border-r border-black/5 bg-white/60 p-3 sm:block">
              {['笔记库', '工作台', '订阅', '历史', '知识关联', '问答'].map((item, i) => (
                <div
                  key={item}
                  className={`mb-0.5 rounded-lg px-2.5 py-1.5 text-[11px] ${
                    (i === 1 && stage === 1) || // 工作台：阶段 1
                    (i === 3 && stage === 2) || // 历史（语音转写）：阶段 2
                    (i === 0 && stage === 3) || // 笔记库：阶段 3
                    (i === 4 && stage >= 4 && stage <= 6) || // 知识关联：阶段 4-6
                    (i === 5 && stage === 7) // 问答：阶段 7
                      ? 'bg-brand/12 font-semibold text-brand'
                      : 'text-slate-500'
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
            <div className="h-[420px] flex-1 overflow-hidden p-4">
              <StagePanel stage={stage} />
            </div>
          </div>
        </div>

        {/* 中：Step Story 叙事（字号与滚轮字幕一致，被滚轮弧线"包裹"，右移 200px） */}
        <div className="relative flex h-[420px] items-center justify-center md:left-[60px]">
          <div key={stage} className="max-w-[280px] text-center">
            <ScrollReveal
              playOnce
              baseOpacity={0}
              enableBlur
              baseRotation={5}
              blurStrength={10}
              containerClassName="my-0"
              textClassName="!text-[1.6rem] !leading-snug !font-medium text-[#4c3a7d]"
            >
              {STEPS[stage - 1].d}
            </ScrollReveal>
          </div>
        </div>

        {/* 右：弧形滚轮（加宽防截断，右移 280px 对齐导航栏右缘附近） */}
        <div className="relative flex h-[420px] w-[280px] flex-col justify-center md:left-[40px]">
          <OptionWheel
            items={WHEEL_ITEMS}
            defaultSelected={0}
            selected={stage - 1}
            onChange={(idx: number) => wheelToStage(idx)}
            wheelEnabled={stickyActive}
            side="left"
            textColor="#b8aed6"
            activeColor="#7c3aed"
            fontSize={2.1}
            spacing={1.6}
            curve={1.2}
            tilt={5}
            blur={1.6}
            fade={0.18}
            minOpacity={0.15}
            smoothing={190}
            inset={30}
            loop={false}
            draggable
          />
        </div>
      </div>
      </div>
    </section>
  )
}
