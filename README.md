# PodMuse 官网

PodMuse 官网：**把播客变成你的第二大脑**。

粘贴一条链接，AI 自动转写、提炼、结构化——让每一期节目都沉淀为可复用、可互链的知识资产。

- 官网：<https://xuxuya66.top>
- 产品仓库：<https://github.com/xuxuyouxiu/PodMuse>
- 部署：GitHub Pages（静态导出，无后端）

## 技术栈

- Next.js 16（App Router）
- React 19 + TypeScript
- Tailwind CSS 4
- GSAP + ScrollTrigger
- Framer Motion
- Lenis（平滑滚动）
- OGL（全屏 WebGL 背景）

## 本地开发

```bash
npm install
npm run dev
```

打开 <http://localhost:3000>。

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生产构建（输出到 `out/`） |
| `npm run start` | 预览生产构建 |
| `npm run lint` | ESLint 检查 |
| `npx tsc --noEmit` | TypeScript 类型检查 |

## 数据统计（可选）

使用 [GoatCounter](https://www.goatcounter.com/)（免费、隐私友好）。

启用方式：在构建环境中设置环境变量：

```bash
NEXT_PUBLIC_GOATCOUNTER=https://your-name.goatcounter.com/count
```

- 未设置时不会加载任何统计脚本，不影响页面性能。
- 下载按钮已埋点：`download-hero`、`download-navbar`、`download-navbar-mobile`、`download-main`、`download-mirror`、`download-footer`。

## 目录结构

```text
app/            Next.js App Router（页面、全局布局）
components/     页面组件与动效组件
public/         静态资源（图标、分享图、二维码）
docs-pm/        产品文档（PRD、功能设计、用户故事）
.github/        GitHub Pages 部署工作流
```

## 部署

推送 `main` 分支后，GitHub Actions 会自动：

1. 安装依赖
2. 运行 lint 与 TypeScript 检查
3. 构建静态站点
4. 写入 `CNAME`
5. 部署到 GitHub Pages

## 说明

- 纯静态站点，无后端、无数据库。
- 构建时通过 GitHub API 解析 GitHub Releases 中的最新版本，直接写入静态页面；另提供国内镜像加速通道。
- 页面数据均为前端静态展示，应用本身数据 100% 存本地。
