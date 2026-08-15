/**
 * PodMuse 分享卡（CSS 手绘版，按真实分享卡结构重绘）。
 * size: 'md'（ContentAssets 用）| 'sm'（画廊 IMAGE 卡用）
 */
export default function ShareCard({ size = 'md' }: { size?: 'md' | 'sm' }) {
  const md = size === 'md'
  return (
    <div
      className={`flex flex-col rounded-lg bg-white shadow-[0_8px_24px_rgba(89,62,168,0.14)] ${
        md ? 'h-[280px] w-[210px] p-4' : 'h-[210px] w-[158px] p-3'
      }`}
    >
      {/* header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span
            className={`flex items-center justify-center rounded-full bg-[#7c3aed] font-bold text-white ${
              md ? 'h-5 w-5 text-[10px]' : 'h-4 w-4 text-[8px]'
            }`}
          >
            P
          </span>
          <span className={`font-medium text-slate-500 ${md ? 'text-[8.5px]' : 'text-[6.5px]'}`}>
            PodMuse · AI 知识卡片
          </span>
        </div>
        <span className={`text-slate-400 ${md ? 'text-[7.5px]' : 'text-[5.5px]'}`}>2026年8月14日</span>
      </div>

      {/* 标题 */}
      <div className={`font-extrabold leading-snug text-[#1a1a1a] ${md ? 'mt-3 text-[16px]' : 'mt-2 text-[12px]'}`}>
        公考最大的毒瘤：学生思维
      </div>
      {/* 紫色短下划线 */}
      <div className={`mt-1.5 bg-[#7c3aed] ${md ? 'h-[3px] w-8' : 'h-[2px] w-6'}`} />
      {/* 摘要 */}
      <div className={`leading-relaxed text-slate-600 ${md ? 'mt-2 text-[7.5px]' : 'mt-1.5 text-[5.5px]'}`}>
        主讲人痛批公考备考中的学生思维，指出学历崇拜、听课思维、形式主义等误区，强调三分听七分练。
      </div>

      {/* 双对比卡 */}
      <div className={`flex gap-1.5 ${md ? 'mt-3' : 'mt-2'}`}>
        {/* 左：学生思维（灰底） */}
        <div className={`flex-1 rounded-md bg-[#f2f2f2] ${md ? 'p-2' : 'p-1.5'}`}>
          <div className={`text-center font-bold text-slate-600 ${md ? 'text-[9px]' : 'text-[7px]'}`}>学生思维</div>
          <div className={`mt-1 space-y-0.5 ${md ? 'text-[7px]' : 'text-[5.5px]'}`}>
            {['崇拜高学历', '只听课少刷题', '笔记形式主义'].map(t => (
              <div key={t} className="flex items-center gap-1 text-slate-500">
                <span className={`shrink-0 rounded-full bg-slate-400 ${md ? 'h-1 w-1' : 'h-[3px] w-[3px]'}`} />
                {t}
              </div>
            ))}
          </div>
        </div>
        {/* 右：正确备考（淡紫底） */}
        <div className={`flex-1 rounded-md bg-[#f3f0ff] ${md ? 'p-2' : 'p-1.5'}`}>
          <div className={`text-center font-bold text-[#7c3aed] ${md ? 'text-[9px]' : 'text-[7px]'}`}>正确备考</div>
          <div className={`mt-1 space-y-0.5 ${md ? 'text-[7px]' : 'text-[5.5px]'}`}>
            {['重学习习惯', '三分听七分练', '复盘重实效'].map(t => (
              <div key={t} className="flex items-center gap-1 text-slate-600">
                <span className={`shrink-0 rounded-full bg-[#7c3aed] ${md ? 'h-1 w-1' : 'h-[3px] w-[3px]'}`} />
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="mt-auto">
        <div className="border-t border-slate-200 pt-1 text-right">
          <div className={`text-slate-500 ${md ? 'text-[7.5px]' : 'text-[5.5px]'}`}>
            由 <span className="font-semibold text-[#7c3aed]">PodMuse</span> 整理
          </div>
          <div className={`italic text-slate-400 ${md ? 'text-[6.5px]' : 'text-[5px]'}`}>把播客变成你的知识库</div>
        </div>
      </div>
    </div>
  )
}
