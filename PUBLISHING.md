# 发布指南

这个项目同时提供两种成品：

- 在线版：发布到 GitHub Pages，玩家点击网址即可玩。
- 离线版：发布 `Reviewer-2-Major-Revision.html`，玩家下载后双击即可玩。

## 第一次上传 GitHub

先在 GitHub 网页中新建一个空仓库，不要添加 README、许可证或 `.gitignore`。然后在项目目录运行以下命令，把其中的仓库地址替换成 GitHub 显示的真实地址：

```bash
git init
git add .
git commit -m "Publish Reviewer #2 game"
git branch -M main
git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main
```

如果项目已经连接 GitHub，只需提交改动并推送 `main` 分支。

## 开启 GitHub Pages

1. 打开 GitHub 仓库的 **Settings → Pages**。
2. 在 **Build and deployment** 中，将 **Source** 选择为 **GitHub Actions**。
3. 打开 **Actions** 标签页，选择 **Publish playable game**。
4. 点击 **Run workflow**，或直接向 `main` 推送一次改动。
5. 等工作流显示绿色勾号，页面顶部会给出可分享的游戏地址。

以后每次推送 `main`，在线游戏都会自动更新。也可以随时在 Actions 页面手动点一次 **Run workflow**，实现一键重新发布。

## 发布可下载的离线版

需要让玩家从 Releases 下载时：

1. 先运行 `pnpm run test:offline`，生成并验证最新单文件。
2. 在 GitHub 仓库右侧选择 **Releases → Draft a new release**。
3. 创建版本标签，例如 `v1.0.0`。
4. 把根目录的 `Reviewer-2-Major-Revision.html` 拖入附件区。
5. 点击 **Publish release**。

玩家只需下载这一个附件并双击，不需要下载整个源码仓库。

## 每次更新前的检查

```bash
pnpm run test:offline
pnpm run test
pnpm run lint
pnpm exec tsc --noEmit
```

只要这些检查通过，GitHub Pages 与离线 HTML 使用的就是同一套游戏代码和内容。

## 常见问题

### 双击后出现空白页

请用最新版本的 Chrome、Edge、Firefox 或 Safari 打开，不要用文本编辑器。若文件由聊天软件或网盘下载，系统可能要求先确认“仍要打开”。

### 存档在哪里

存档和最高分使用浏览器本机存储，不会上传。清理浏览器网站数据、换浏览器，或某些浏览器将不同本地路径视为不同来源时，存档可能不会跟随。

### GitHub Pages 显示 404

确认 Pages 的 Source 已选择 **GitHub Actions**，工作流已成功运行，并等待几十秒后刷新。仓库权限策略如果禁止 Pages，需要由仓库管理员开启。
