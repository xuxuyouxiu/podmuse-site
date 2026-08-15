'use client'

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

export default function QA() {
  return (
    <section id="qa" className="flex min-h-screen snap-start flex-col justify-center border-t border-slate-100 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 md:grid-cols-2 md:px-6">
        {/* 左：文案 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.55 }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">AI 知识问答</p>
          <h2 className="mt-3 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            从「听过」
            <br />
            到「真正理解」
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-soft">
            对着自己的笔记库提问，答案附引用来源——比搜索引擎更懂你的上下文。问它上个月听的商业案例，它能定位到具体哪一期、哪一部分。
          </p>
          <div className="mt-7 space-y-2.5">
            {['答案带引用来源，可回原文复核', '多篇笔记交叉回答，串联你的知识', '本地检索，隐私零外泄'].map(t => (
              <div key={t} className="flex items-center gap-2.5 text-sm text-ink-soft">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-[9px] text-emerald-600">
                  ✓
                </span>
                {t}
              </div>
            ))}
          </div>
        </motion.div>

        {/* 右：真实问答界面模拟 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_6px_rgba(50,50,93,0.08),0_18px_40px_-8px_rgba(50,50,93,0.16)]"
        >
          <div className="flex items-center gap-1.5 border-b border-slate-100 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-300" />
            <span className="ml-3 text-xs text-ink-mute">PodMuse · 知识问答</span>
          </div>
          <div className="space-y-4 p-5">
            <div className="flex items-center gap-2 text-center">
              <Sparkles className="h-4 w-4 text-brand" />
              <span className="text-sm font-semibold">与你的知识库对话</span>
            </div>
            <div className="text-center text-xs text-ink-mute">基于你生成的播客笔记回答，答案带引用来源</div>
            <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-sm bg-brand/8 px-4 py-2.5 text-sm text-ink">
              防脱洗护为什么是唯一稳价的品类？
            </div>
            <div className="w-fit max-w-[85%] rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-2.5 text-sm leading-relaxed text-ink">
              防脱功效见效慢、切换成本高，用户对价格不敏感；头部品牌集中、竞争格局稳定，使其成为洗护中唯一能守住价格带的功能性品类。
              <div className="mt-2 flex items-center gap-1.5 text-xs text-brand">
                <span className="rounded bg-brand/10 px-1.5 py-0.5">来源：美妆巨头集体盯上头发 · 第 3 部分</span>
              </div>
            </div>
            <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-tr-sm bg-brand/8 px-4 py-2.5 text-sm text-ink">
              大脑的可塑性到了成年还有多少？
            </div>
            <div className="w-fit max-w-[85%] rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-2.5 text-sm leading-relaxed text-ink">
              成年大脑仍具可塑性：2000 年伦敦出租车司机研究发现，海马体随导航经验增长，神经可塑性持续终生。
              <div className="mt-2 flex items-center gap-1.5 text-xs text-brand">
                <span className="rounded bg-brand/10 px-1.5 py-0.5">来源：你聪明的大脑 · 第 2 部分</span>
              </div>
            </div>
            <div className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-ink-mute">
              输入问题，Enter 发送…
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
