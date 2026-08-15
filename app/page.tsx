import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import Workflow from '@/components/workflow'
import Journey from '@/components/journey'
import QA from '@/components/qa'
import Download from '@/components/download'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* 01 Hero */}
        <Hero />
        {/* 02 完整链路（工作流+核心能力融合）：一条链接 → 内容资产 */}
        <Workflow />
        {/* 03 产品体验（贯穿式，核心） */}
        <Journey />
        {/* 04 AI 知识问答 */}
        <QA />
        {/* 05 输出台 + 下载 */}
        <Download />
      </main>
      {/* 06 Footer */}
      <Footer />
    </>
  )
}
