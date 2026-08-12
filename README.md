# Reviewer #2: Major Revision

> **5 档审稿强度。6 种返修周期。528 张行动卡。256 个互动故事事件。**
> 你能在 Reviewer #2 改完所有要求之前，活着拿到 Decision Letter 吗？

[![Reviewer #2: Major Revision 游戏封面](public/og.png)](https://voyager0057.github.io/reviewer-2-major-revision/)

*点击封面即可进入在线版。*

## 立即游玩

### [▶ 在线开始游戏](https://voyager0057.github.io/reviewer-2-major-revision/)

### [⬇ 下载单文件离线版](https://github.com/Voyager0057/reviewer-2-major-revision/raw/refs/heads/main/Reviewer-2-Major-Revision.html)

离线版只有一个 HTML 文件。下载 `Reviewer-2-Major-Revision.html` 后双击即可游玩：不需要安装、不需要启动服务器，也不需要联网。

---

## 这是什么游戏？

《Reviewer #2: Major Revision》是一款中英双语的学术生存卡牌 Roguelike。

你扮演一名正在经历 Major Revision 的研究生，需要在截止日期前处理不断追加的审稿意见。新游戏不再随机把你扔进一篇论文：你会先填写一份“投稿配置表”，选择论文类型、五档难度、返修周期、随机种子、自定义规则与铁人模式。

每一天都要决定：把 GPU 用在外部验证还是消融实验？先补统计检验还是重画 Figure 2？诚实报告失败实验，还是冒险调整随机种子？事件中的选择不再提前展示收益；你需要先作决定，经历 1–3 轮对话，最后才能拆开结算信封。

审稿意见不是一条等待扣血的随机血条。每条意见都有具体的能力要求，例如：

- 基线比较与组件消融
- 统计检验与不确定性量化
- 数据完整性与实验协议
- 外部验证、鲁棒性与模型校准
- 文献定位、主张边界与逐条回复
- 代码开放、方法文档与可复现流程

只有能力匹配的行动卡才能推进相应步骤。离题卡不会凭空解决审稿意见。

## 游戏画面

![Reviewer #2 主菜单与完整投稿战役入口](public/readme/menu.jpg)

*从论文封面进入主菜单，再配置属于你的投稿战役。*

![Reviewer #2 审稿意见、解决路线与行动卡界面](public/readme/gameplay.jpg)

*读懂审稿意见，选择解决路线，再用能力真正匹配的行动卡推进具体步骤。*

## 五步上手

1. **配置投稿战役**：选择论文流派、评审难度、返修周期、铁人模式或自定义参数。
2. **读懂审稿意见**：查看主要问题，并从“完整核验”“收窄主张”“透明回应”中选择解决路线。
3. **匹配行动能力**：寻找能推进当前路线步骤的卡牌，再考虑资源成本和出牌顺序。
4. **承担研究后果**：在不预知数值的情况下处理互动事件，通过 1–3 轮对话看到故事结果。
5. **建立投稿档案**：用投稿时间线回看关键节点，或使用自动存档与三个手动槽继续战役。

严谨牌、实验牌和写作牌可以形成连锁；精准完成回应会获得额外收益。如果手牌完全不对题，可以花费 1 点专注进行一次“定向检索”。

## 你需要管理

| 指标 | 意义 |
| --- | --- |
| Novelty | 论文的创新性与主张定位 |
| Evidence | 实验、统计和验证证据 |
| Clarity | 写作、图表与回复质量 |
| Reproducibility | 协议、代码、划分与参数完整度 |
| Mental Health | 降到零，本轮研究生涯结束 |
| Retraction Risk | 达到 100%，论文立即撤回 |

行动还会消耗 GPU、Funding、Focus 和剩余天数。高风险操作可能短期见效，但会留下技术债，并让后续的数据审计和复现问题更加危险。

## 新游戏配置

### 五档评审强度

- **友善预审**：资源宽裕、意见标准较低，适合第一次投稿
- **建设性意见**：完整玩法，但压力稍低
- **标准大修**：推荐的原版平衡
- **二号审稿人解封**：意见更难、资源更紧、拖延更痛
- **编辑部炼狱**：频繁事件与极少资源，换取最高分数倍率

### 六种返修周期

| 模式 | 规模 | 预计单局时间 |
| --- | --- | --- |
| 浓缩返修 | 18 天 / 14 条意见 | 12–20 分钟 |
| 会议冲刺 | 30 天 / 24 条意见 | 25–40 分钟 |
| 标准大修 | 48 天 / 40 条意见 | 45–70 分钟 |
| 期刊马拉松 | 72 天 / 60 条意见 | 70–105 分钟 |
| 无限补实验 | 96 天 / 80 条意见 | 100–150 分钟 |
| 自定义审稿合同 | 12–120 天 / 10–100 条意见 | 由你决定 |

铁人模式保留防浏览器崩溃的自动存档，但禁用手动存档与同 Seed 回档。它是荣誉制——毕竟玩家仍然拥有开发者工具。

## 互动事件与投稿时间线

事件现在是一段短篇学术喜剧，而不是立刻增减数值的弹窗：

1. 实验室断电、服务器维护、导师突袭、数据漂移、合作者失联等事件发生。
2. 玩家只看到行动选择，看不到准确收益与代价。
3. 选择后展开 1–3 轮中英文角色对话。
4. 故事结束后，统一揭示资源、属性、风险和持续状态变化。
5. 关键选择会写入独立的“投稿时间线”，与逐张出牌的行动日志分开保存。

256 个事件分布在基础设施、集群、导师、合作者、数据、统计、投稿系统、伦理、经费、开放科学、研究者状态、学术竞争等故事线上。

## 游戏内容

- **528 张行动卡**：实验、统计、写作、复现、协作与危险操作；每张都包含双语规则、风味文本和明确能力标签
- **160 条审稿意见**：与卡牌能力和解决路线直接关联
- **256 个互动故事事件**：每个提供隐藏后果选择，新增事件拥有三轮双语对话
- **20 种论文流派**：不同初始牌组、被动效果和先天弱点
- **48 件研究遗物**与 **40 项修稿任务**
- **5 档难度、6 种周期**，最长 96 天；自定义模式可设为 120 天
- Reviewer #1、Reviewer #2、Associate Editor、Camera Ready 与隐藏 Coauthor Boss
- **16 种结局**：Best Paper、开放科学、复现传奇、零风险接收、速通、23:59 投稿、隐藏合作者、小修、大修、R&R 等
- 投稿时间线、行动日志、本地自动存档、三个手动存档槽、最高分、随机种子与结局分享卡

## 新手提示

- 先看路线中的能力步骤，再选卡；卡牌数值很高但能力不匹配，依然无法有效回应。
- “完整核验”通常资源昂贵但最稳；“收窄主张”更快，却可能牺牲创新性；“透明回应”能降低风险并提升编辑信任。
- 不必每次都追求更高 AUC。诚实解释失败结果往往能提高可复现性并降低撤稿风险。
- 不要忽视 Mental Health。睡觉不是浪费回合，是研究基础设施维护。
- Reviewer #2 会追加要求；留一些 GPU 和经费给战役后半程。

## 中英文切换

游戏支持 **简体中文 / English**。在主菜单、论文选择页或游戏界面点击右上角语言按钮即可随时切换。

## 存档说明

游戏会自动把当前进度和最高分保存在浏览器本机，并提供三个独立的手动存档槽，不会上传任何个人数据。

- 点击游戏顶部的暂停按钮，可以继续、手动存档、打开时间线、查看帮助或保存并返回主菜单。
- 主菜单的“读取存档”可以查看三个档案的论文类型、进度、剩余天数、难度和保存时间。
- 铁人模式不能使用手动槽，但会继续自动保存，避免意外关闭页面导致整局消失。

- 在线版与离线版通常拥有各自独立的存档。
- 清理浏览器网站数据或更换浏览器后，原存档可能无法继续使用。
- 离线游玩时，建议保持文件名和存放位置不变。

## 离线版打不开怎么办？

请确认下载的是完整的 `Reviewer-2-Major-Revision.html`，然后使用最新版 Chrome、Edge、Firefox 或 Safari 打开。不要使用文本编辑器打开，也不需要解压或安装任何程序。

---

<details>
<summary><strong>English player guide</strong></summary>

**Reviewer #2: Major Revision** is a bilingual academic-survival deckbuilding roguelike. Manage finite GPU time, funding, focus, mental health, and retraction risk while responding to capability-linked reviewer comments.

- [Play online](https://voyager0057.github.io/reviewer-2-major-revision/)
- [Download the single-file offline edition](https://github.com/Voyager0057/reviewer-2-major-revision/raw/refs/heads/main/Reviewer-2-Major-Revision.html)

Configure a submission with five review difficulties, six campaign lengths, Ironman, custom rules, and 20 manuscript archetypes. Read each review, select one of three resolution routes, and play cards whose capabilities match its concrete steps. Interactive events hide their outcomes, unfold over 1–3 dialogue beats, and enter a persistent submission timeline before revealing the result.

The Decision Letter Update includes 528 action cards, 160 reviewer comments, 256 story events, 48 relics, 16 endings, autosave, three manual save slots, and campaigns ranging from a 12-minute Espresso Rebuttal to a 96-day Eternal Revision. Use the language button to switch between English and Simplified Chinese at any time.

</details>

项目维护与版本发布说明见 [PUBLISHING.md](PUBLISHING.md)。
