# 功能设计：PodMuse 官网

**版本**：v1.0
**日期**：2026-08-14

## 1. 信息架构

单页滚动，锚点导航：

```
导航（固定毛玻璃）：logo 左 | 功能 · 下载 · 支持 中右 | GitHub 右
  Hero（100vh）
  Why 为什么（3 卡）
  Features 功能（2×3 网格）
  Flow 三步流程
  Download 下载
  Support 打赏
  页脚
```

## 2. 视觉规范（Design Tokens）

| Token | 值 |
| --- | --- |
| 页面底色 | `#ffffff`（白底，用户明确要求） |
| 品牌主紫 | `#7c3aed`（按钮、强调、链接） |
| 紫渐变 | `#7c3aed → #a855f7 → #ec4899`（光斑/标题渐变） |
| 文字主色 | `#1f2937`（近黑灰，正文） |
| 文字次要 | `#6b7280` |
| 玻璃卡片 | 白底 `rgba(255,255,255,0.65)` + `backdrop-blur(16px)` + 细边 `rgba(124,58,237,0.15)` + 大圆角 20px + 柔阴影 |
| 圆角 | 卡 20px / 按钮 12px / 图标容器 14px |
| 阴影 | `0 8px 32px rgba(124,58,237,0.10)` |
| 字体 | 系统字体栈（`PingFang SC / Microsoft YaHei / Segoe UI`），标题 600-700 字重 |
| 字号 | Hero 标题 56px / 区块标题 36px / 卡片标题 17px / 正文 15px |
| 布局 | 内容最大宽 1120px 居中；区块间距 96-120px |
| 按钮 | 主按钮紫底白字圆角 12 + hover 上浮 + 阴影加深；次按钮白底紫边 |

## 3. 动效清单（GSAP ScrollTrigger）

| # | 位置 | 动效 | 触发 |
| --- | --- | --- | --- |
| 1 | 全局背景 | 3 个紫/粉大渐变光斑缓慢漂移（20s 循环）+ 轻微缩放 | 常驻 |
| 2 | Hero 标题 | 逐行上浮淡入（stagger 0.15s） | 页面加载 |
| 3 | Hero 音波 | 底部波形条 5-7 根，高度随机起伏循环 | 常驻 |
| 4 | Hero CTA | 按钮 hover 上浮 4px + 阴影加深；点击平滑滚动 | hover/click |
| 5 | Why 卡片 | 依次上浮 + 淡入（y: 30 → 0） | 进入视口 |
| 6 | Features 卡片 | stagger 上浮；hover 上浮 -6px + 阴影加深 | 进入视口/hover |
| 7 | Flow 步骤 | 步骤依次点亮 + 连线从左到右生长 | 进入视口 |
| 8 | 下载按钮 | 呼吸光晕（box-shadow 紫色脉冲） | 常驻 |
| 9 | 导航 | 滚动 >80px 后加毛玻璃底 + 细阴影 | scroll |
| 10 | 全局 | `prefers-reduced-motion` 时全部动画关闭，直接显示 | 媒体查询 |

技术：GSAP core + ScrollTrigger（**本地文件打包进仓库**，不用 CDN——防被墙）；JS 原生，无框架。

## 4. 页面/组件清单

| 组件 | 关键元素 | 状态 |
| --- | --- | --- |
| NavBar | logo、3 锚点、GitHub 图标链接 | 默认透明 / 滚动后毛玻璃 |
| Hero | 大标题（渐变字）、副标题、2 CTA、音波 | 加载动画 |
| WhyCards ×3 | 图标、标题、描述 | hover 上浮 |
| FeatureCards ×6 | 图标（紫色圆角底）、标题、一句话 | hover 上浮 |
| FlowSteps ×3 | 步骤号圆、标题、小描述、连线 | 依次点亮 |
| Download | 版本号徽章、主下载按钮、Releases 链接 | 按钮呼吸光晕 |
| Support | 文案 + 微信/支付宝码 | — |
| Footer | 版权、GitHub、邮箱 | — |

## 5. 资源清单

| 资源 | 来源 | 状态 |
| --- | --- | --- |
| 应用图标 | `G:\Podcast_Notes\build\icon.png` | 需复制到官网 assets |
| 收款码 | `G:\Podcast_Notes\public\donate\*.{png,jpg}` | 需复制 |
| GSAP 库 | npm 下载 gsap 单文件（gsap.min.js + ScrollTrigger.min.js） | 需下载本地化 |
| 图标 | 内联 SVG（自绘简单线性图标，紫色系） | 开发时绘制 |
| 功能示意素材 | 无需截图——纯图形化示意（图标+文字） | — |

## 6. 开放问题（开发前需确认）

1. 域名（部署用，可开发完再给）
2. 下载按钮指向：GitHub Releases 直达 or 官网展示版本号后跳转？（设计默认：跳转 Releases）
3. 打赏文案沿用应用内「请我喝杯咖啡」还是官网换说法？
