# Reviewer #2: Major Revision

一款中英双语的学术生存卡牌 Roguelike。你要在投稿截止日前管理 GPU、时间、经费和精神状态，用真正匹配审稿意见的实验、分析与写作卡牌完成修稿，同时避免技术债和撤稿风险失控。

## 下载后双击即玩

最简单的游玩方式只有一步：下载仓库根目录中的 **`Reviewer-2-Major-Revision.html`**，然后双击它。

- 不需要安装 Node.js、pnpm 或任何依赖
- 不需要启动服务器
- 不需要联网
- 整个游戏、样式和中英文本都封装在一个 HTML 文件中
- Chrome、Edge、Firefox、Safari 的现代版本均可运行

如果浏览器询问用什么程序打开，请选择任意现代浏览器。游戏进度和最高分保存在浏览器本机；为减少浏览器对本地文件存档策略的差异，建议不要频繁修改文件名或移动文件。

## 游戏内容

- 264 张行动卡，包含实验、统计、写作、复现、协作和高风险操作
- 160 条与卡牌标签和能力直接关联的审稿意见
- 128 个实验室、服务器、导师、合作者、会议和生活事件
- 20 种论文流派与不同初始牌组
- 48 件遗物、40 项修稿任务、最长 48 天的完整战役
- Reviewer #1、Reviewer #2、Associate Editor、Camera Ready 与隐藏 Coauthor Boss
- 简体中文 / English 随时切换
- 本地自动存档、最高分与结局分享卡

审稿意见不是随机血条。每条意见都要求若干研究能力，例如“统计检验”“外部验证”“数据完整性”或“可解释性”；只有带有相应能力标签的卡牌才能高效回应。打出顺序、卡牌组合、资源成本和意见紧迫度都会影响结果。


## 本地开发

开发源码需要 Node.js `>=22.13.0` 与 pnpm。普通玩家不需要执行本节。

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm run dev
```

开发服务器默认可在 `http://localhost:3000/` 打开。

## 重新生成离线文件

修改游戏后运行：

```bash
pnpm run build:offline
```

它会生成两个内容完全一致的文件：

- `Reviewer-2-Major-Revision.html`：提供给玩家下载
- `.pages/index.html`：供 GitHub Pages 自动发布

`.pages` 是临时构建目录，不需要提交；根目录中的单文件版本建议提交，方便玩家直接下载。

## 验证

```bash
pnpm run test:offline  # 生成并验证单文件离线版
pnpm run test          # 完整网页构建与游戏规则测试
pnpm run lint          # 代码规范检查
pnpm exec tsc --noEmit # TypeScript 类型检查
```

## 项目结构

```text
app/game/                    游戏状态、规则、卡牌、审稿意见与事件
offline/                     单文件版本的浏览器入口
scripts/build-offline.mjs    单文件打包器
tests/                       规则、渲染与离线包测试
.github/workflows/pages.yml  GitHub Pages 自动发布
Reviewer-2-Major-Revision.html  可直接双击的成品
```

## English quick start

Download `Reviewer-2-Major-Revision.html` and double-click it. The game is fully self-contained, works offline, requires no installation, and can switch between Chinese and English in-game. Repository owners can publish the browser version through the included GitHub Pages workflow.
