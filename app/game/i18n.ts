import type { CardDef, CommentDef, EventChoice, EventDef, Locale, RoleDef } from "./types";

export const UI_COPY: Record<Locale, Record<string, string>> = {
  zh: {
    home: "Reviewer #2 首页", soundOff: "关闭声音", soundOn: "开启声音", help: "打开玩法说明",
    coverAbstract: "一款关于有限 GPU、无限意见，以及在截止日期前保持科研诚信的卡牌 Roguelike。",
    runTime: "完整战役 45–70 分钟", browserPlay: "浏览器即玩", localSave: "自动本地存档",
    menuTitle: "论文能不能收，先看你能不能活到截止日。",
    menuDescription: "从精简牌组起步，在评审途中选择新卡、升级行动、收集遗物并承受持续状态。正规操作会慢慢变强，危险捷径会让数字立刻好看——直到撤稿风险追上你。",
    start: "开始完整投稿战役", continue: "继续 Revision", daysLeft: "天", localHigh: "本地最高分", mayMeet: "行动卡池", hiddenBoss: "264 张卡", dangerous: "随机事件池", consequences: "128 个事件",
    tagline: "48 天、40+ 条意见、三条解决路线；每次投稿都会构筑不同的回复策略。", version: "v3.0 · Capability-linked peer review",
    selectManuscript: "选择论文流派", chooseManuscript: "选择你的论文", back: "返回", roleHeading: "每种论文都有优势。Reviewer #2 会找到它的弱点。", currentChoice: "当前选择", submit: "以此论文投稿",
    passive: "被动", weakness: "弱点", funding: "经费", mental: "精神", remaining: "剩余", focus: "专注", log: "打开行动记录",
    currentBoss: "当前 Boss", resolved: "已解决意见", escalations: "追加次数", yourPaper: "你的论文", hideLog: "收起记录", viewLog: "查看行动记录", actionLog: "行动记录",
    round: "轮次", major: "严重", concern: "关注", comment: "意见", original: "审稿原文", translation: "中文译文", gameplay: "规则解读",
    primary: "主要求", secondary: "次要求", severity: "严重度", responseProgress: "路线进度", delayed: "回合：步骤标准已上升。", exactHint: "只有能力匹配的行动才会推进路线步骤；精准填满可返还专注。",
    ready: "准备执行", riskExecute: "承担风险并执行", execute: "执行行动", selectHint: "先选择解决路线，再从手牌寻找能推进具体步骤的行动。",
    manuscript: "论文状态", mentalState: "精神状态", risk: "撤稿风险", riskTitle: "达到 100% 会立即失败", riskLow: "研究记录尚且干净。", riskMid: "短期数字变好，审计压力正在积累。", riskHigh: "高风险：复现与审计意见会更难。", endDay: "结束今天",
    today: "今日行动", cardHint: "点击选牌，再执行", deck: "牌库", discard: "弃牌", exhausted: "本日耗尽", response: "回应", emptyHand: "手牌已空", notEnough: "资源不足",
    tutorialTitle: "4 步上手", tutorial: "读意见 → 选解决路线 → 找能力匹配卡 → 完成全部步骤", closeTutorial: "关闭教程",
    randomEvent: "随机事件", eventFootnote: "事件必须处理，不能假装没有看到邮件。",
    finalScore: "最终分数", comments: "意见", strangest: "最离谱事件", newHigh: "新的本地最高分", share: "下载 / 分享结局卡", copied: "已复制", copyReport: "复制战报", retry: "再投一次", retrySeed: "相同 Seed 重试", returnHome: "返回首页",
    rewardTitle: "修改获得新方向", rewardStage: "阶段奖励：选择一件遗物", rewardCard: "构筑奖励：加入新卡或升级旧卡", chooseOne: "三选一，本次选择会改变后续牌组。", addCard: "加入牌组", upgradeCard: "升级卡牌", gainRelic: "获得遗物", skipReward: "跳过并回复 2 精神", upgraded: "已升级", rarityCommon: "普通", rarityUncommon: "进阶", rarityRare: "稀有",
    activeEffects: "本局效果", relics: "遗物", noRelics: "尚未获得遗物", caffeine: "咖啡因", insight: "洞见", technicalDebt: "技术债", reviewerFavor: "审稿人好感", pageDebt: "版面债",
    keywordMatch: "命中", combo: "连锁", retain: "保留", exhaust: "耗尽", questionable: "危险", upgradedMark: "升级",
    helpTitle: "活到 Decision Letter", readComments: "拆解意见", readCommentsBody: "每条意见有三条解决路线，每条路线包含明确能力步骤。离题卡不会再造成通用伤害。", chooseActions: "构筑行动", chooseActionsBody: "每解决四条意见会获得新卡或升级；跨过评审阶段会获得遗物。定向检索可用 1 专注换取相关卡。", consequencesTitle: "承担后果", consequencesBody: "拖延会掉精神并提高步骤标准；风险达到 100% 会立即撤稿。", defeatRounds: "制造连锁", defeatRoundsBody: "严谨→实验、实验→写作等组合会强化已匹配的步骤；状态与遗物会继续改变规则。", selectCard: "选牌", playCard: "执行", showLog: "日志", gotIt: "我已阅读审稿意见",
  },
  en: {
    home: "Reviewer #2 home", soundOff: "Mute sound", soundOn: "Enable sound", help: "Open game guide",
    coverAbstract: "A card roguelike about finite GPUs, infinite reviewer comments, and keeping your research integrity before the deadline.",
    runTime: "45–70 minute full campaign", browserPlay: "Play in browser", localSave: "Automatic local save",
    menuTitle: "Before the paper survives review, you have to survive the deadline.",
    menuDescription: "Start with a focused deck, draft new cards, upgrade actions, collect relics, and manage persistent conditions. Honest work compounds slowly. Questionable shortcuts look brilliant—until Retraction Risk catches up.",
    start: "Begin Full Submission Campaign", continue: "Continue Revision", daysLeft: "days", localHigh: "Local high score", mayMeet: "Action card pool", hiddenBoss: "264 cards", dangerous: "Random event pool", consequences: "128 events",
    tagline: "48 days, 40+ comments, and three resolution routes. Every submission builds a different strategy.", version: "v3.0 · Capability-linked peer review",
    selectManuscript: "Select a Paper Archetype", chooseManuscript: "Choose your manuscript", back: "Back", roleHeading: "Every paper has strengths. Reviewer #2 will find the weakness.", currentChoice: "Current choice", submit: "Submit this manuscript",
    passive: "Passive", weakness: "Weakness", funding: "Funding", mental: "Mental", remaining: "Days", focus: "Focus", log: "Open action log",
    currentBoss: "Current Boss", resolved: "Comments resolved", escalations: "Escalations", yourPaper: "Your paper", hideLog: "Hide action log", viewLog: "View action log", actionLog: "Action log",
    round: "Round", major: "Major", concern: "Concern", comment: "Comment", original: "Original comment", translation: "Translation", gameplay: "Gameplay note",
    primary: "Primary", secondary: "Secondary", severity: "Severity", responseProgress: "Route progress", delayed: "turn(s): step standards have increased.", exactHint: "Only capability-matched actions advance route steps. A precise reply refunds Focus.",
    ready: "Ready to play", riskExecute: "Accept risk and play", execute: "Play card", selectHint: "Choose a resolution route, then find actions that advance its specific steps.",
    manuscript: "Manuscript status", mentalState: "Mental Health", risk: "Retraction Risk", riskTitle: "Reaching 100% immediately ends the run", riskLow: "The research record is still clean.", riskMid: "Short-term numbers improve while audit pressure accumulates.", riskHigh: "High risk: audit and reproducibility comments become harder.", endDay: "End Day",
    today: "Today's actions", cardHint: "Select a card, then play it", deck: "Deck", discard: "Discard", exhausted: "Exhausted today", response: "Response", emptyHand: "Your hand is empty", notEnough: "Not enough resources",
    tutorialTitle: "4 quick steps", tutorial: "Read the issue → choose a route → match capabilities → complete every step", closeTutorial: "Close tutorial",
    randomEvent: "Random Event", eventFootnote: "This event must be handled. Pretending you missed the email is not an option.",
    finalScore: "Final Score", comments: "Comments", strangest: "Strangest event", newHigh: "New Local High Score", share: "Download / Share Result Card", copied: "Copied", copyReport: "Copy Run Report", retry: "Submit Again", retrySeed: "Retry Same Seed", returnHome: "Return Home",
    rewardTitle: "The Revision Opens a New Direction", rewardStage: "Stage reward: choose one relic", rewardCard: "Deck reward: add a card or upgrade one", chooseOne: "Choose one. It will shape the rest of this run.", addCard: "Add to deck", upgradeCard: "Upgrade card", gainRelic: "Take relic", skipReward: "Skip and restore 2 Mental", upgraded: "Upgraded", rarityCommon: "Common", rarityUncommon: "Uncommon", rarityRare: "Rare",
    activeEffects: "Run effects", relics: "Relics", noRelics: "No relics yet", caffeine: "Caffeine", insight: "Insight", technicalDebt: "Technical Debt", reviewerFavor: "Reviewer Favor", pageDebt: "Page Debt",
    keywordMatch: "Match", combo: "Combo", retain: "Retain", exhaust: "Exhaust", questionable: "Questionable", upgradedMark: "Upgraded",
    helpTitle: "Survive to the Decision Letter", readComments: "Decompose the issue", readCommentsBody: "Every comment has three routes with explicit capability steps. Off-topic cards no longer deal generic damage.", chooseActions: "Build your deck", chooseActionsBody: "Every four resolved comments grants a card or upgrade; stage clears grant relics. Targeted research trades 1 Focus for a relevant card.", consequencesTitle: "Own the consequences", consequencesBody: "Delays cost Mental Health and raise step standards. At 100% Risk, the paper is withdrawn.", defeatRounds: "Create combos", defeatRoundsBody: "Sequences such as Rigor → Experiment or Experiment → Writing strengthen matched steps. Conditions and relics keep changing the rules.", selectCard: "Select card", playCard: "Play", showLog: "Log", gotIt: "I have read the reviewer comments",
  },
};

const ROLE_EN: Record<string, { pitch: string; passive: string; weakness: string }> = {
  method: { pitch: "The idea is novel; the experiment table is always one row short.", passive: "Your first Experiment card each day gains +1 Response.", weakness: "Clinical and external-validation comments are 1 point harder." },
  clinical: { pitch: "The data are credible. The reviewer only wants to know what is new.", passive: "Your first Rigor card each day gains +1 Response and restores 1 Mental Health.", weakness: "Novelty comments are 1 point harder." },
  foundation: { pitch: "Many parameters, little memory, and an abstract that reads like a moon landing.", passive: "GPU cards cost 1 less GPU; your first Experiment card each day gains +1 Response.", weakness: "Formatting and reproducibility comments are 1 point harder." },
};

const CARD_RULES_EN: Record<string, string> = {
  ablation: "Evidence +2 and Reproducibility +1; strong against ablation and novelty concerns.", baseline: "Evidence +2; strong against comparison comments.",
  "external-validation": "Evidence +3 and Reproducibility +1. Powerful and expensive.", "rewrite-intro": "Novelty +2 and Clarity +2.", "stat-test": "Evidence +2 and Reproducibility +2.", "better-figure": "Clarity +3; strong against figure comments.",
  "ask-coauthor": "Uncertain: sometimes a critical edit, sometimes only 'Looks good.'", sleep: "Mental Health +7 and Risk -3; consumes all Focus for the day.", "tune-seed": "55% chance of a large Evidence gain; failure loses Evidence and Mental Health. Risk +12.", "hide-result": "Evidence +3, Clarity +1, and +4 Response; Risk +25.",
  "release-code": "Reproducibility +3 and Risk -6.", "seed-everything": "Reproducibility +3 and Evidence +1.", "power-analysis": "Evidence +3 and Reproducibility +1.", "error-analysis": "Evidence +2 and Clarity +1.", "rebuttal-letter": "Clarity +2 and +3 base Response against any comment.", "related-work": "Novelty +2 and Clarity +1.", "cite-recent": "Novelty +1 and Clarity +1; costs no Focus but requires Funding.",
  "simplify-claim": "Clarity +2, Novelty -1, Risk -2; current difficulty -1.", appendix: "Clarity +1 and Reproducibility +2.", "clean-split": "Reproducibility +3 and Evidence +1.", "cross-validation": "Evidence +3 and Reproducibility +2.", "ask-labmate": "Clarity +1, Mental Health +2, and refund 1 Focus.", coffee: "Focus +1, Mental Health +1, and Risk +2.", "cut-scope": "Clarity +2, Novelty -1, regain 1 day; current difficulty -2.", "smaller-model": "GPU +3, Reproducibility +2, and Evidence -1.", "cloud-gpu": "Funding -3, GPU +7, and Risk +3.", "negative-results": "Evidence +1, Reproducibility +3, Novelty -1, and Risk -10.", "reproduce-baseline": "Evidence +2 and Reproducibility +3.", "latex-exorcism": "Clarity +4; strong against camera-ready and formatting comments.", "take-walk": "Mental Health +5 and Risk -2.",
};

const COMMENT_ZH: Record<string, string> = {
  "r1-baseline": "与成熟基线的比较并不完整。", "r1-stats": "没有提供统计显著性检验。", "r1-figure": "图 2 难以理解。", "r1-split": "请说明训练/测试划分和随机种子。", "r1-ablation": "各组件的贡献仍不明确。", "r2-novelty": "创新性有限。", "r2-recent": "缺少与近期方法的比较。", "r2-leakage": "无法排除潜在数据泄漏。", "r2-mask": "为什么选择这一掩码比例？", "r2-datasets": "请在另外三个数据集上增加实验。", "r2-vit": "为完整性，请与 ViT-Large 比较。", "r2-clinical": "临床相关性没有得到充分证明。", "r2-contradiction": "请简化方法，同时增加更多组件。", "r2-selfcite": "请引用这六篇高度相关的论文。", "editor-claims": "论文主张似乎强于现有证据。", "editor-balance": "各项关切没有得到均衡回应。", "editor-ethics": "数据治理和伦理声明需要澄清。", "editor-impact": "尚不清楚该进展是否足够实质。", "camera-pages": "稿件超出页数限制 1.7 页。", "camera-figure": "图片未达到所需分辨率。", "camera-repo": "匿名仓库包含身份信息。", "camera-refs": "若干参考文献缺失或格式错误。", "coauthor-rewrite": "合作者：我们应该重写整篇论文。", "coauthor-title": "合作者：标题需要完全不同的叙事框架。",
};

const COMMENT_NOTE_EN: Record<string, string> = {
  "r1-baseline": "Add a strong baseline—not only your own three-month-old version.", "r1-stats": "Needs statistical evidence, not 'visibly better.'", "r1-figure": "Save at least two of the legend, font size, and palette.", "r1-split": "Reproducibility details cannot be replaced by 'see code,' especially when the code is private.", "r1-ablation": "Prove each module exists for more than filling the architecture diagram.", "r2-novelty": "The classic two-word verdict. Defend the contribution and explain it clearly.", "r2-recent": "'Recent' means the preprint uploaded last night.", "r2-leakage": "High-risk concern: audit the split, code, and logs.", "r2-mask": "'We used the default' is not a methodological explanation.", "r2-datasets": "The reviewer provides neither datasets, compute, nor three extra months.", "r2-vit": "Completeness is inversely proportional to available VRAM.", "r2-clinical": "There is a bridge between better metrics and real-world value.", "r2-contradiction": "The mutually exclusive requests have passed peer review.", "r2-selfcite": "All six papers happen to share one corresponding author.", "editor-claims": "The editor is counting adjectives per experiment.", "editor-balance": "Only adding experiments or only editing prose will not be enough.", "editor-ethics": "This time, 'see supplement' is not enough.", "editor-impact": "The editor draws a line between interesting and interesting enough.", "camera-pages": "The algorithm cannot go. Neither can the acknowledgements.", "camera-figure": "The cost of pasting screenshots has arrived.", "camera-repo": "Git history is more honest than the author list.", "camera-refs": "BibTeX becomes self-aware on the final day.", "coauthor-rewrite": "One day before the deadline, the hidden boss joins the meeting.", "coauthor-title": "Change the title and the entire narrative changes with it.",
};

type EventEnglish = { title: string; description: string; choices: Record<string, { label: string; hint: string; result: string }> };
const EVENT_EN: Record<string, EventEnglish> = {
  "gpu-oom": { title: "GPU OOM", description: "At 3 a.m., training hits 99% and runs out of memory.", choices: { rerun: { label: "Reduce batch size and rerun", hint: "GPU -2 · Evidence +1", result: "It finishes, only four times slower." }, debug: { label: "Fix the memory leak", hint: "Mental -2 · Repro +2", result: "Every tensor was being cached. You grow older and wiser." } } },
  "disk-full": { title: "The Server Disk Is Full", description: "274 checkpoints named final_final_v3 occupy the shared drive.", choices: { cleanup: { label: "Clean the experiment directory", hint: "Mental -1 · Repro +2", result: "You delete 86 GB and finally understand your own folders." }, storage: { label: "Buy temporary storage", hint: "Funding -2 · GPU +2", result: "The problem is renewed, not solved." } } },
  "new-method": { title: "A New Method Appears First", description: "One day before submission, arXiv produces a title 73% similar to yours.", choices: { differentiate: { label: "Differentiate overnight", hint: "GPU -2 · Mental -2 · Novelty +2", result: "Related Work gains the longest contrastive sentence of your career." }, narrow: { label: "Narrow the claim honestly", hint: "Novelty -1 · Clarity +3 · Risk -4", result: "Less dramatic, finally accurate." } } },
  "sensitivity-zero": { title: "One Fold Has Sensitivity 0", description: "The average survives, but the zero looks like a black hole in the table.", choices: { report: { label: "Report it honestly", hint: "Evidence -1 · Repro +3 · Risk -8", result: "The figure looks worse. The rest becomes believable." }, rerun: { label: "Rerun with another seed", hint: "GPU -3 · Evidence +2 · Risk +12", result: "It is no longer zero. You decide not to ask why." } } },
  "looks-good": { title: "Coauthor: Looks good to me", description: "You sent 17 concrete questions. Four words arrive 11 seconds later.", choices: { chase: { label: "Request substantive edits", hint: "Mental -2 · Clarity +2", result: "They change one comma and one critical argument." }, accept: { label: "Take it as a blessing", hint: "Mental +2", result: "At least nobody added a requirement." } } },
  "self-citations": { title: "The Reviewer Requests Six Citations", description: "The corresponding-author initials mysteriously match the review signature.", choices: { cite: { label: "Add them strategically", hint: "Clarity +2 · Risk +6", result: "Related Work grows half a page. Satisfaction may also grow." }, decline: { label: "Decline politely", hint: "Mental -2 · Novelty +2", result: "Three airtight paragraphs explain why they are irrelevant." } } },
  "auc-drop": { title: "The Requested Experiment Lowers AUC", description: "Reviewer #2's experiment confirms Reviewer #2's concern.", choices: { honest: { label: "Discuss the failure mode", hint: "Evidence +1 · Repro +2 · Risk -6", result: "The result weakens. The paper strengthens." }, tune: { label: "Tune one more round", hint: "GPU -3 · Evidence +2 · Mental -2", result: "AUC returns. The weekend does not." } } },
  "latex-table": { title: "The LaTeX Table Exceeds Two Columns", description: "Only by 4 mm, which the system treats as a character flaw.", choices: { rewrite: { label: "Rebuild the table", hint: "Mental -1 · Clarity +3", result: "It becomes readable without resizebox." }, tiny: { label: "Use 4 pt text", hint: "Clarity -1 · Gain 1 day", result: "It meets the format, not human vision." } } },
  "free-cluster": { title: "The Cluster Is Suddenly Free", description: "The lab is at a meeting. Eight GPUs wait in the night.", choices: { sweep: { label: "Run the full sweep", hint: "GPU +4 · Evidence +2", result: "A progress bar appears without OOM." }, rest: { label: "Back up and go home", hint: "Mental +4 · Repro +1", result: "Both server and researcher receive maintenance." } } },
  "license-update": { title: "The Dataset License Changes", description: "README contains a restriction you never saw before submission.", choices: { audit: { label: "Redo the compliance audit", hint: "Lose 1 day · Repro +3", result: "Painful, but the governance section survives questions." }, ignore: { label: "Pretend you missed it", hint: "Risk +18 · Evidence +1", result: "The submit button turns green. The risk bar turns red." } } },
  "useful-edits": { title: "The Coauthor Sends Real Edits", description: "A tracked-changes document. Not 'Looks good.' This is not a drill.", choices: { merge: { label: "Merge every edit", hint: "Clarity +3 · Mental +2", result: "Some sentences are understandable on the first reading." }, learn: { label: "Rebuild the argument too", hint: "Novelty +2 · Clarity +2 · Mental -1", result: "The paper gains a spine. You lose a night." } } },
  "reviewer-appendix": { title: "The Reviewer Actually Read the Appendix", description: "They quote Appendix C.4 exactly. This was not in the disaster plan.", choices: { polish: { label: "Complete the details", hint: "Repro +3 · Mental -1", result: "For once, 'see appendix' solves the problem." }, celebrate: { label: "Celebrate being read", hint: "Mental +4 · Clarity +1", result: "Careful review feels moving. Slightly." } } },
};

export function roleText(role: RoleDef, field: "pitch" | "passive" | "weakness", locale: Locale) {
  if (locale === "zh") return role[field];
  return role[`${field}En` as keyof RoleDef] as string | undefined ?? ROLE_EN[role.id]?.[field] ?? role[field];
}

export function cardRules(card: CardDef, locale: Locale) {
  return locale === "zh" ? card.rules : card.rulesEn ?? CARD_RULES_EN[card.id] ?? card.rules;
}

export function commentQuote(comment: CommentDef, locale: Locale) {
  return locale === "zh" ? comment.quoteZh ?? COMMENT_ZH[comment.id] ?? comment.quote : comment.quote;
}

export function commentNote(comment: CommentDef, locale: Locale) {
  return locale === "zh" ? comment.note : comment.noteEn ?? COMMENT_NOTE_EN[comment.id] ?? comment.note;
}

export function eventTitle(event: EventDef, locale: Locale) {
  return locale === "zh" ? event.title : event.titleEn ?? EVENT_EN[event.id]?.title ?? event.title;
}

export function eventDescription(event: EventDef, locale: Locale) {
  return locale === "zh" ? event.description : event.descriptionEn ?? EVENT_EN[event.id]?.description ?? event.description;
}

export function eventChoiceText(event: EventDef, choice: EventChoice, field: "label" | "hint" | "result", locale: Locale) {
  if (locale === "zh") return choice[field];
  const direct = choice[`${field}En` as keyof EventChoice];
  return typeof direct === "string" ? direct : EVENT_EN[event.id]?.choices[choice.id]?.[field] ?? choice[field];
}
