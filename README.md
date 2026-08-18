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

## 数据统计

使用百度统计（Baidu Tongji），统计脚本随官网一起加载。

- 站点 ID：`47c3d20d16483b897729f4ed49bc87fd`
- 下载按钮已埋点：`download-hero`、`download-navbar`、`download-navbar-mobile`、`download-main`、`download-mirror`、`download-footer`
- 点击事件通过 `data-track-event` 属性触发，统一上报到百度统计的“下载”类别

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
