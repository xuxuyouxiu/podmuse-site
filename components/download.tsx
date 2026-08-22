'use client'

import { motion } from 'framer-motion'
import { Image as ImageIcon, FileText, Download as DownloadIcon } from 'lucide-react'

/**
 * Export Studio 输出台：一条内容从知识图谱流出，
 * 汇入笔记预览卡 → 从双出口（宣传图片 / PDF）发布/归档。
 */
export default function ExportStudio({
  setupUrl,
  mirrorUrl,
  version,
}: {
  setupUrl: string
  mirrorUrl: string
  version: string
}) {
  return (
    <section id="download" className="flex min-h-screen snap-start flex-col justify-center border-t border-slate-100 py-20">
      <div className="mx-auto w-full max-w-6xl px-5 md:px-6">
        {/* 眉题 + 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-80px' }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-xl text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.42em] text-brand/70">
            EXPORT STUDIO
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            从笔记，到内容资产
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            一条链接 → 一篇结构化笔记 → 一份可分享、可归档的产出
          </p>
        </motion.div>

        {/* 输出台 */}
        <div className="relative mx-auto mt-14 max-w-4xl">
          {/* 流入光点（内容从上方汇入笔记） */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="pointer-events-none absolute -top-10 left-1/2 h-10 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-brand/40 to-brand/70"
          >
            <span className="export-inflow absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-brand shadow-[0_0_8px_rgba(124,58,237,0.6)]" />
          </motion.div>

          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
            {/* 左出口：宣传图片 */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="order-2 flex justify-center md:order-1"
            >
              <div className="group flex w-52 flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_2px_6px_rgba(50,50,93,0.06),0_14px_30px_-10px_rgba(50,50,93,0.14)] transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_4px_10px_rgba(50,50,93,0.08),0_20px_40px_-12px_rgba(124,58,237,0.2)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a855f7] text-white transition-transform duration-300 group-hover:scale-110">
                  <ImageIcon size={20} strokeWidth={1.7} />
                </div>
                <div className="text-[15px] font-semibold">宣传图片</div>
                <div className="text-[11px] text-ink-mute">内容发布 · 直接分享</div>
                <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-brand/10 px-3.5 py-1.5 text-xs font-medium text-brand">
                  PNG 图片
                </div>
              </div>
            </motion.div>

            {/* 中间：笔记预览卡（米白纸感） */}
            <motion.div
              initial={{ opacity: 0, y: 44, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="order-1 md:order-2"
            >
              <div className="relative mx-auto w-full max-w-[380px] rounded-xl bg-[#fbfaf7] p-7 shadow-[0_2px_8px_rgba(50,50,93,0.07),0_24px_48px_-16px_rgba(50,50,93,0.18)] ring-1 ring-slate-200/70">
                {/* 纸感顶部 */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand/70">
                    Podcast Notes
                  </span>
                  <span className="text-[10px] text-ink-mute">AI 知识卡片 · 08/15</span>
                </div>
                <div className="mt-5 text-[22px] font-bold leading-snug text-[#111111]">
                  如何建立长期主义
                </div>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-ink-mute">
                  <span className="h-px w-8 bg-slate-300" />
                  核心观点
                </div>
                <div className="mt-3 space-y-2.5">
                  {[
                    ['01', '长期主义的本质：把时间变成复利'],
                    ['02', '如何建立自己的复利系统'],
                    ['03', '避免短期陷阱，稳住节奏'],
                  ].map(([n, t]) => (
                    <div key={n} className="flex items-start gap-3">
                      <span className="mt-0.5 w-5 shrink-0 text-right text-[11px] font-bold text-brand">
                        {n}
                      </span>
                      <span className="border-l border-slate-200 pl-3 text-[12.5px] leading-relaxed text-[#3f3f46]">
                        {t}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 border-t border-slate-200 pt-3 text-[10px] text-ink-mute">
                  由 PodMuse 整理 · 把播客变成你的知识库
                </div>
              </div>
            </motion.div>

            {/* 右出口：PDF */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="order-3 flex justify-center"
            >
              <div className="group flex w-52 flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_2px_6px_rgba(50,50,93,0.06),0_14px_30px_-10px_rgba(50,50,93,0.14)] transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_4px_10px_rgba(50,50,93,0.08),0_20px_40px_-12px_rgba(124,58,237,0.2)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#18181b] to-[#3f3f46] text-white transition-transform duration-300 group-hover:scale-110">
                  <FileText size={20} strokeWidth={1.7} />
                </div>
                <div className="text-[15px] font-semibold">PDF 文档</div>
                <div className="text-[11px] text-ink-mute">文档归档 · 正式导出</div>
                <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-slate-100 px-3.5 py-1.5 text-xs font-medium text-ink-soft">
                  PDF 文件
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 主下载 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-16 text-center"
        >
          <a
            href={setupUrl}
            data-track-event="download-main"
            className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#a855f7] px-8 py-4 text-base font-semibold text-white shadow-[0_4px_16px_rgba(124,58,237,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(124,58,237,0.45)]"
          >
            <DownloadIcon size={18} strokeWidth={2} className="transition-transform group-hover:translate-y-0.5" />
            免费下载 PodMuse
          </a>
          <p className="mt-3 text-xs text-ink-mute">Windows · 当前版本 v{version} · 个人使用永久免费 · 开源 · 数据 100% 本地</p>
          <a
            href={mirrorUrl}
            data-track-event="download-mirror"
            className="mt-2 inline-block text-xs text-ink-mute underline decoration-slate-300 underline-offset-4 transition-colors hover:text-brand"
          >
            国内下载慢？点这里走 GitHub 通道（海外用户/挂 VPN 适用）
          </a>
        </motion.div>
      </div>
    </section>
  )
}
