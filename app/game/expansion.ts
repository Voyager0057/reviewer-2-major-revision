import type { CardDef, CommentDef, EventDef, RelicDef, RoleDef } from "./types";

export const EXPANSION_ROLES: RoleDef[] = [
  {
    id: "small-data",
    name: "小样本论文",
    en: "Small Dataset Paper",
    symbol: "S",
    pitch: "数据只有一点点，所以每一个置信区间都很珍贵。",
    pitchEn: "There is barely any data, so every confidence interval matters.",
    passive: "每天第一张严谨牌额外 +2 回应；统计类卡牌经费消耗 -1。",
    passiveEn: "Your first Rigor card each day gains +2 Response; statistics cards cost 1 less Funding.",
    weakness: "外部验证与规模类意见难度 +2。",
    weaknessEn: "External-validation and scale comments are 2 points harder.",
    stats: { novelty: 2, evidence: 3, clarity: 3, reproducibility: 5 },
    resources: { gpu: 6, funding: 8, mental: 16 },
  },
  {
    id: "interdisciplinary",
    name: "跨学科论文",
    en: "Interdisciplinary Paper",
    symbol: "X",
    pitch: "三个领域都觉得另外两个领域写得不够清楚。",
    pitchEn: "Three fields agree that the other two are not explained clearly enough.",
    passive: "连续打出不同类别的牌时，第二张额外 +1 回应。",
    passiveEn: "When consecutive cards have different categories, the second gains +1 Response.",
    weakness: "每次拖延意见都会额外损失 1 精神。",
    weaknessEn: "Every delayed comment deals 1 additional Mental Health damage.",
    stats: { novelty: 4, evidence: 3, clarity: 2, reproducibility: 3 },
    resources: { gpu: 10, funding: 9, mental: 14 },
  },
];

export const EXPANSION_CARDS: CardDef[] = [
  {
    id: "robustness-sweep", name: "鲁棒性扫描", en: "Robustness Sweep", category: "experiment", rarity: "uncommon",
    flavor: "把每个超参数都推到它开始冒烟的位置。", flavorEn: "Push every hyperparameter until something starts smoking.",
    rules: "证据 +3；若上一张是严谨牌，额外 +2 回应。", rulesEn: "Evidence +3. Combo: +2 Response after a Rigor card.",
    focus: 2, gpu: 3, delta: { stats: { evidence: 3 } }, answer: 2, tags: ["robustness", "evidence", "parameters"], comboAfter: "rigor", comboAnswer: 2,
  },
  {
    id: "subgroup-analysis", name: "亚组分析", en: "Subgroup Analysis", category: "experiment", rarity: "uncommon",
    flavor: "总体平均值很好，直到你问它对谁有效。", flavorEn: "The average looks excellent until you ask: for whom?",
    rules: "证据 +2，清晰度 +1；临床与公平性意见特别有效。", rulesEn: "Evidence +2 and Clarity +1; strong against clinical and fairness comments.",
    focus: 1, gpu: 2, delta: { stats: { evidence: 2, clarity: 1 } }, answer: 2, tags: ["clinical", "fairness", "analysis"],
  },
  {
    id: "prospective-validation", name: "前瞻性验证", en: "Prospective Validation", category: "experiment", rarity: "rare",
    flavor: "现实世界加入了实验，并且拒绝遵守 README。", flavorEn: "The real world joined the experiment and ignored the README.",
    rules: "证据 +4、复现 +2、风险 -4；本日耗尽。", rulesEn: "Evidence +4, Reproducibility +2, Risk -4. Exhausts for the day.",
    focus: 3, gpu: 3, funding: 3, delta: { stats: { evidence: 4, reproducibility: 2 }, risk: -4 }, answer: 4, tags: ["external", "clinical", "evidence"], exhaust: true,
  },
  {
    id: "calibration-curve", name: "校准曲线", en: "Calibration Curve", category: "experiment", rarity: "common",
    flavor: "0.9 的自信终于需要为自己负责。", flavorEn: "A confidence of 0.9 is finally held accountable.",
    rules: "证据 +2，清晰度 +1。", rulesEn: "Evidence +2 and Clarity +1.",
    focus: 1, gpu: 1, delta: { stats: { evidence: 2, clarity: 1 } }, answer: 2, tags: ["calibration", "clinical", "figure"],
  },
  {
    id: "label-audit", name: "标签审计", en: "Label Audit", category: "experiment", rarity: "uncommon",
    flavor: "Ground truth 被发现只是另一个研究生。", flavorEn: "The ground truth turns out to be another graduate student.",
    rules: "证据 +2、复现 +2、风险 -3。", rulesEn: "Evidence +2, Reproducibility +2, and Risk -3.",
    focus: 2, funding: 2, delta: { stats: { evidence: 2, reproducibility: 2 }, risk: -3 }, answer: 3, tags: ["data", "audit", "labels"],
  },
  {
    id: "compute-matched", name: "等算力比较", en: "Compute-Matched Baseline", category: "experiment", rarity: "uncommon",
    flavor: "这一次，大模型不能靠多烧十倍 GPU 获胜。", flavorEn: "This time the larger model cannot win by burning ten times the compute.",
    rules: "证据 +3；比较与效率意见额外有效。", rulesEn: "Evidence +3; especially effective against comparison and efficiency comments.",
    focus: 2, gpu: 3, delta: { stats: { evidence: 3 } }, answer: 3, tags: ["comparison", "efficiency", "evidence"],
  },
  {
    id: "leave-one-site-out", name: "留一中心验证", en: "Leave-One-Site-Out", category: "experiment", rarity: "rare",
    flavor: "每个中心都轮流扮演未知世界。", flavorEn: "Each site takes a turn pretending to be the unknown world.",
    rules: "证据 +3、复现 +2；若上一张是实验牌，额外 +2 回应。", rulesEn: "Evidence +3 and Reproducibility +2. Combo: +2 Response after an Experiment card.",
    focus: 2, gpu: 3, funding: 1, delta: { stats: { evidence: 3, reproducibility: 2 } }, answer: 3, tags: ["external", "clinical", "robustness"], comboAfter: "experiment", comboAnswer: 2,
  },
  {
    id: "synthetic-controls", name: "合成对照", en: "Synthetic Controls", category: "experiment", rarity: "rare",
    flavor: "真实对照组不存在，于是你认真地制造了一个。", flavorEn: "The real control group does not exist, so you carefully manufacture one.",
    rules: "创新 +2、证据 +3，但风险 +4。", rulesEn: "Novelty +2 and Evidence +3, but Risk +4.",
    focus: 2, gpu: 2, risk: 4, delta: { stats: { novelty: 2, evidence: 3 } }, answer: 3, tags: ["causal", "clinical", "evidence"],
  },
  {
    id: "graphical-abstract", name: "图形摘要", en: "Graphical Abstract", category: "writing", rarity: "common",
    flavor: "把八页方法压缩成六个箭头。", flavorEn: "Compress eight pages of methods into six arrows.",
    rules: "清晰度 +3；保留在手中直到使用。", rulesEn: "Clarity +3. Retain this card until played.",
    focus: 1, delta: { stats: { clarity: 3 } }, answer: 2, tags: ["figure", "clarity", "summary"], retain: true,
  },
  {
    id: "limitations-section", name: "诚实的局限性", en: "Honest Limitations", category: "writing", rarity: "uncommon",
    flavor: "承认边界并不会让论文立刻消失。通常不会。", flavorEn: "Acknowledging boundaries does not instantly erase the paper. Usually.",
    rules: "清晰度 +2、复现 +1、风险 -7；当前难度 -1。", rulesEn: "Clarity +2, Reproducibility +1, Risk -7; current difficulty -1.",
    focus: 1, delta: { stats: { clarity: 2, reproducibility: 1 }, risk: -7 }, answer: 2, tags: ["claims", "ethics", "writing"], shrinkIssue: 1,
  },
  {
    id: "response-matrix", name: "回复矩阵", en: "Response Matrix", category: "writing", rarity: "uncommon",
    flavor: "行是意见，列是页码，单元格是你的尊严。", flavorEn: "Rows are comments, columns are pages, cells contain your dignity.",
    rules: "清晰度 +2；上一张牌类别不同则额外 +2 回应。保留。", rulesEn: "Clarity +2. Combo: +2 Response after a different category. Retain.",
    focus: 1, delta: { stats: { clarity: 2 } }, answer: 3, tags: ["rebuttal", "writing", "details"], retain: true,
  },
  {
    id: "cut-jargon", name: "删除黑话", en: "Cut the Jargon", category: "writing", rarity: "common",
    flavor: "“范式协同”重新变回了“两个模块一起用”。", flavorEn: "Paradigm synergy becomes 'we use both modules together.'",
    rules: "清晰度 +3，创新 -1；0 专注。", rulesEn: "Clarity +3 and Novelty -1. Costs 0 Focus.",
    focus: 0, delta: { stats: { clarity: 3, novelty: -1 } }, answer: 1, tags: ["writing", "clarity", "claims"],
  },
  {
    id: "title-surgery", name: "标题手术", en: "Title Surgery", category: "writing", rarity: "common",
    flavor: "删除“新颖”“统一”“通用”，标题仍然活着。", flavorEn: "Remove 'novel,' 'unified,' and 'general.' The title survives.",
    rules: "清晰度 +2、风险 -2；标题与结论意见额外有效。", rulesEn: "Clarity +2 and Risk -2; strong against title and claim comments.",
    focus: 0, delta: { stats: { clarity: 2 }, risk: -2 }, answer: 2, tags: ["title", "claims", "writing"],
  },
  {
    id: "narrative-arc", name: "重建叙事线", en: "Rebuild the Narrative", category: "writing", rarity: "rare",
    flavor: "实验顺序现在看起来像计划，而不是事故。", flavorEn: "The experiment order now looks planned rather than accidental.",
    rules: "创新 +2、清晰度 +4；本日耗尽。", rulesEn: "Novelty +2 and Clarity +4. Exhausts for the day.",
    focus: 2, mental: 2, delta: { stats: { novelty: 2, clarity: 4 } }, answer: 4, tags: ["writing", "novelty", "rebuttal"], exhaust: true,
  },
  {
    id: "supplementary-video", name: "补充视频", en: "Supplementary Video", category: "writing", rarity: "uncommon",
    flavor: "终于有人能看懂那个旋转的三维结果。", flavorEn: "Someone can finally understand the rotating 3D result.",
    rules: "清晰度 +3；图表与可访问性意见额外有效。", rulesEn: "Clarity +3; strong against figure and accessibility comments.",
    focus: 1, funding: 1, delta: { stats: { clarity: 3 } }, answer: 2, tags: ["figure", "accessibility", "clarity"],
  },
  {
    id: "preregister-analysis", name: "预注册追加分析", en: "Preregister Follow-up", category: "rigor", rarity: "rare",
    flavor: "你在知道结果之前写下了计划。古老的魔法。", flavorEn: "You write the plan before seeing the result. Ancient magic.",
    rules: "复现 +3、风险 -6，并获得 1 洞见。", rulesEn: "Reproducibility +3, Risk -6, and gain 1 Insight.",
    focus: 1, delta: { stats: { reproducibility: 3 }, risk: -6 }, answer: 3, tags: ["statistics", "audit", "preregistration"], condition: { insight: 1 },
  },
  {
    id: "bootstrap-ci", name: "自助法置信区间", en: "Bootstrap Confidence Intervals", category: "rigor", rarity: "common",
    flavor: "重采样一万次，只为让误差条停止被追问。", flavorEn: "Resample ten thousand times so the error bars stop being questioned.",
    rules: "证据 +2、复现 +2。", rulesEn: "Evidence +2 and Reproducibility +2.",
    focus: 1, gpu: 1, delta: { stats: { evidence: 2, reproducibility: 2 } }, answer: 2, tags: ["statistics", "significance", "evidence"],
  },
  {
    id: "blind-evaluation", name: "盲法评估", en: "Blind Evaluation", category: "rigor", rarity: "uncommon",
    flavor: "评分者不知道哪个结果属于你的模型。你也希望不知道。", flavorEn: "Raters do not know which output is yours. You almost wish you did not either.",
    rules: "证据 +2、复现 +2、风险 -3。", rulesEn: "Evidence +2, Reproducibility +2, and Risk -3.",
    focus: 2, funding: 1, delta: { stats: { evidence: 2, reproducibility: 2 }, risk: -3 }, answer: 3, tags: ["evaluation", "bias", "clinical"],
  },
  {
    id: "leakage-audit", name: "泄漏审计", en: "Leakage Audit", category: "rigor", rarity: "rare",
    flavor: "每一个 join 都有不在场证明。", flavorEn: "Every join now has an alibi.",
    rules: "复现 +4、证据 +1、风险 -8；审计意见极强。", rulesEn: "Reproducibility +4, Evidence +1, Risk -8; exceptional against audits.",
    focus: 2, mental: 1, delta: { stats: { reproducibility: 4, evidence: 1 }, risk: -8 }, answer: 4, tags: ["leakage", "audit", "data"], condition: { technicalDebt: -1 },
  },
  {
    id: "environment-lock", name: "锁定运行环境", en: "Lock the Environment", category: "rigor", rarity: "common",
    flavor: "CUDA、驱动和依赖终于签署了停战协议。", flavorEn: "CUDA, drivers, and dependencies sign a temporary ceasefire.",
    rules: "复现 +3；若上一张是实验牌，额外 +2 回应。", rulesEn: "Reproducibility +3. Combo: +2 Response after an Experiment card.",
    focus: 1, delta: { stats: { reproducibility: 3 } }, answer: 2, tags: ["code", "reproducibility", "environment"], comboAfter: "experiment", comboAnswer: 2, condition: { technicalDebt: -2 },
  },
  {
    id: "data-card", name: "数据说明卡", en: "Dataset Card", category: "rigor", rarity: "uncommon",
    flavor: "数据终于有了来源、许可和已知缺陷。", flavorEn: "The dataset finally has provenance, licensing, and known limitations.",
    rules: "复现 +3、清晰度 +1、风险 -4。", rulesEn: "Reproducibility +3, Clarity +1, and Risk -4.",
    focus: 1, delta: { stats: { reproducibility: 3, clarity: 1 }, risk: -4 }, answer: 3, tags: ["data", "license", "ethics"],
  },
  {
    id: "multiple-testing", name: "多重比较校正", en: "Multiple-Testing Correction", category: "rigor", rarity: "uncommon",
    flavor: "显著结果变少了，可信度变多了。", flavorEn: "There are fewer significant results and more credibility.",
    rules: "证据 +2、复现 +3；精神 -1。", rulesEn: "Evidence +2 and Reproducibility +3; Mental Health -1.",
    focus: 1, mental: 1, delta: { stats: { evidence: 2, reproducibility: 3 } }, answer: 3, tags: ["statistics", "significance", "audit"],
  },
  {
    id: "rubber-duck", name: "向橡皮鸭解释", en: "Explain to a Rubber Duck", category: "support", rarity: "common",
    flavor: "鸭子没有博士学位，所以它问了正确的问题。", flavorEn: "The duck has no PhD, so it asks the right question.",
    rules: "精神 +2、清晰度 +1，并获得 1 洞见。", rulesEn: "Mental Health +2, Clarity +1, and gain 1 Insight.",
    focus: 0, delta: { mental: 2, stats: { clarity: 1 } }, answer: 0, tags: ["support", "clarity"], condition: { insight: 1 },
  },
  {
    id: "advisor-escalation", name: "召唤导师", en: "Escalate to the Advisor", category: "support", rarity: "rare",
    flavor: "导师回复了两个词：Call me。", flavorEn: "Your advisor replies with two words: Call me.",
    rules: "当前难度 -3、精神 +2；本日耗尽。", rulesEn: "Current difficulty -3 and Mental Health +2. Exhausts for the day.",
    focus: 1, delta: { mental: 2 }, answer: 1, tags: ["support", "rebuttal"], shrinkIssue: 3, exhaust: true,
  },
  {
    id: "lab-meeting", name: "召开组会", en: "Emergency Lab Meeting", category: "support", rarity: "uncommon",
    flavor: "十二个人提出了十四个互不兼容的修复方案。", flavorEn: "Twelve people propose fourteen mutually incompatible fixes.",
    rules: "精神 +3，并获得 2 洞见；保留。", rulesEn: "Mental Health +3 and gain 2 Insight. Retain.",
    focus: 1, delta: { mental: 3 }, answer: 0, tags: ["support", "analysis"], condition: { insight: 2 }, retain: true,
  },
  {
    id: "power-nap", name: "二十分钟午睡", en: "Twenty-Minute Nap", category: "support", rarity: "common",
    flavor: "大脑重启成功，未检测到未保存的想法。", flavorEn: "Brain restarted successfully. No unsaved ideas detected.",
    rules: "精神 +4；获得 1 咖啡因（明天 +1 专注）。", rulesEn: "Mental Health +4; gain 1 Caffeine (+1 Focus tomorrow).",
    focus: 1, delta: { mental: 4 }, answer: 0, tags: ["support"], condition: { caffeine: 1 },
  },
  {
    id: "grant-extension", name: "申请经费延期", en: "Request a Grant Extension", category: "support", rarity: "rare",
    flavor: "表格比实验多，但这次值得。", flavorEn: "There are more forms than experiments, but this time it is worth it.",
    rules: "经费 +5、GPU +2；本日耗尽。", rulesEn: "Funding +5 and GPU +2. Exhausts for the day.",
    focus: 2, delta: { funding: 5, gpu: 2 }, answer: 0, tags: ["support", "funding"], exhaust: true,
  },
  {
    id: "borrow-gpu", name: "借隔壁组 GPU", en: "Borrow the Neighbor Lab's GPU", category: "support", rarity: "uncommon",
    flavor: "作为交换，你要帮他们修一个“很小的环境问题”。", flavorEn: "In return, you must fix one 'tiny environment issue.'",
    rules: "GPU +6、精神 -2、技术债 +1。", rulesEn: "GPU +6, Mental Health -2, and Technical Debt +1.",
    focus: 1, delta: { gpu: 6, mental: -2 }, answer: 0, tags: ["support", "compute"], condition: { technicalDebt: 1 },
  },
  {
    id: "automate-table", name: "自动生成表格", en: "Automate the Tables", category: "support", rarity: "uncommon",
    flavor: "再也不会手工把 0.842 抄成 0.824。", flavorEn: "You will never manually copy 0.842 as 0.824 again.",
    rules: "复现 +2、清晰度 +2；若上一张是实验牌，额外 +2 回应。", rulesEn: "Reproducibility +2 and Clarity +2. Combo: +2 Response after an Experiment card.",
    focus: 1, delta: { stats: { reproducibility: 2, clarity: 2 } }, answer: 1, tags: ["code", "figure", "reproducibility"], comboAfter: "experiment", comboAnswer: 2,
  },
  {
    id: "p-hack-threshold", name: "移动显著性阈值", en: "Move the Significance Threshold", category: "questionable", rarity: "rare",
    flavor: "0.051 只是 0.05 穿了一件外套。", flavorEn: "0.051 is just 0.05 wearing a coat.",
    rules: "证据 +4、回应 +4；风险 +22、技术债 +2。本日耗尽。", rulesEn: "Evidence +4 and +4 Response; Risk +22 and Technical Debt +2. Exhausts.",
    focus: 0, risk: 22, delta: { stats: { evidence: 4 } }, answer: 4, tags: ["statistics", "significance"], exhaust: true, condition: { technicalDebt: 2 },
  },
  {
    id: "cherry-pick-fold", name: "挑最好的一折", en: "Cherry-Pick a Fold", category: "questionable", rarity: "uncommon",
    flavor: "Fold 4 一直是最理解你的人。", flavorEn: "Fold 4 has always understood you best.",
    rules: "证据 +3、回应 +3；风险 +18。", rulesEn: "Evidence +3 and +3 Response; Risk +18.",
    focus: 0, risk: 18, delta: { stats: { evidence: 3 } }, answer: 3, tags: ["statistics", "evidence"],
  },
  {
    id: "salami-slice", name: "切成两篇论文", en: "Salami-Slice the Study", category: "questionable", rarity: "rare",
    flavor: "一份工作，两篇投稿，三倍审稿意见。", flavorEn: "One study, two submissions, three times the reviewer comments.",
    rules: "创新 +3、经费 +2；风险 +20、清晰度 -2。", rulesEn: "Novelty +3 and Funding +2; Risk +20 and Clarity -2.",
    focus: 1, risk: 20, delta: { funding: 2, stats: { novelty: 3, clarity: -2 } }, answer: 3, tags: ["novelty", "claims"],
  },
  {
    id: "cite-six", name: "引用审稿人六篇论文", en: "Cite All Six of Their Papers", category: "questionable", rarity: "uncommon",
    flavor: "Related Work 突然出现了一个非常集中的岛屿。", flavorEn: "Related Work develops one extremely concentrated island.",
    rules: "创新 +2、回应 +4；风险 +10、清晰度 -1。", rulesEn: "Novelty +2 and +4 Response; Risk +10 and Clarity -1.",
    focus: 0, risk: 10, delta: { stats: { novelty: 2, clarity: -1 } }, answer: 4, tags: ["citations", "novelty"],
  },
  {
    id: "reviewer-model", name: "猜测审稿人身份", en: "Model the Reviewer", category: "questionable", rarity: "rare",
    flavor: "匿名评审并不妨碍你训练一个分类器。", flavorEn: "Anonymous review does not stop you from training a classifier.",
    rules: "获得 3 洞见和 2 审稿人好感；风险 +15。", rulesEn: "Gain 3 Insight and 2 Reviewer Favor; Risk +15.",
    focus: 1, gpu: 1, risk: 15, answer: 0, tags: ["audit", "rebuttal"], condition: { insight: 3, reviewerFavor: 2 },
  },
];

export const EXPANSION_COMMENTS: CommentDef[] = [
  { id: "r1-calibration", stage: "reviewer1", quote: "The model appears poorly calibrated.", quoteZh: "模型似乎没有得到良好校准。", note: "需要校准、统计或临床证据。", noteEn: "Needs calibration, statistics, or clinical evidence.", primary: "evidence", secondary: "clarity", difficulty: 6, severity: 2, tags: ["calibration", "statistics", "clinical"] },
  { id: "r1-ci", stage: "reviewer1", quote: "Please report confidence intervals, not only point estimates.", quoteZh: "请报告置信区间，而不只是点估计。", note: "误差条不是装饰。", noteEn: "Error bars are not decoration.", primary: "evidence", secondary: "reproducibility", difficulty: 6, severity: 2, tags: ["statistics", "significance"] },
  { id: "r1-robustness", stage: "reviewer1", quote: "How robust are the findings to hyperparameter choices?", quoteZh: "结论对超参数选择有多鲁棒？", note: "鲁棒性、参数与消融牌会命中。", noteEn: "Robustness, parameter, and ablation cards match.", primary: "evidence", difficulty: 6, severity: 2, tags: ["robustness", "parameters", "ablation"] },
  { id: "r2-carbon", stage: "reviewer2", quote: "The computational cost and carbon footprint are not discussed.", quoteZh: "论文没有讨论计算成本与碳足迹。", note: "效率比较和更小模型更有说服力。", noteEn: "Efficiency comparisons and smaller models are persuasive.", primary: "reproducibility", secondary: "clarity", difficulty: 9, severity: 2, tags: ["efficiency", "compute", "claims"] },
  { id: "r2-preregister", stage: "reviewer2", quote: "Were these analyses specified before observing the results?", quoteZh: "这些分析是在观察结果之前确定的吗？", note: "预注册与审计类行动能降低怀疑。", noteEn: "Preregistration and audit actions reduce suspicion.", primary: "reproducibility", secondary: "evidence", difficulty: 10, severity: 3, tags: ["preregistration", "audit", "statistics"] },
  { id: "r2-epoch", stage: "reviewer2", quote: "The selected checkpoint appears cherry-picked.", quoteZh: "所选检查点似乎经过了挑选。", note: "固定协议、盲评与诚实报告更有效。", noteEn: "Locked protocols, blind evaluation, and honest reporting work best.", primary: "reproducibility", secondary: "evidence", difficulty: 10, severity: 3, tags: ["audit", "statistics", "evaluation"] },
  { id: "r2-synthetic", stage: "reviewer2", quote: "Could synthetic data be introducing hidden bias?", quoteZh: "合成数据是否引入了隐藏偏差？", note: "标签审计、公平性与数据说明卡会命中。", noteEn: "Label audits, fairness analysis, and dataset cards match.", primary: "evidence", secondary: "reproducibility", difficulty: 9, severity: 3, tags: ["data", "bias", "fairness"] },
  { id: "r2-contamination", stage: "reviewer2", quote: "How do you rule out benchmark contamination?", quoteZh: "如何排除基准污染？", note: "泄漏审计和严格数据划分是核心。", noteEn: "Leakage audits and clean data splits are central.", primary: "reproducibility", secondary: "evidence", difficulty: 11, severity: 3, tags: ["leakage", "audit", "data"] },
  { id: "r2-license", stage: "reviewer2", quote: "The license does not appear to permit this downstream use.", quoteZh: "该许可似乎不允许这种下游用途。", note: "许可、伦理与数据来源必须完整说明。", noteEn: "Licensing, ethics, and provenance must be documented.", primary: "reproducibility", secondary: "clarity", difficulty: 9, severity: 3, tags: ["license", "ethics", "data"] },
  { id: "r2-subgroups", stage: "reviewer2", quote: "Performance across demographic subgroups is missing.", quoteZh: "缺少不同人口亚组的性能结果。", note: "亚组、公平性与临床分析会命中。", noteEn: "Subgroup, fairness, and clinical analyses match.", primary: "evidence", secondary: "clarity", difficulty: 10, severity: 3, tags: ["fairness", "clinical", "analysis"] },
  { id: "editor-scope", stage: "editor", quote: "The claims exceed what the study design can support.", quoteZh: "论文主张超出了研究设计所能支持的范围。", note: "收窄结论、局限性和因果证据更有效。", noteEn: "Narrowed claims, limitations, and causal evidence work best.", primary: "clarity", secondary: "evidence", difficulty: 10, severity: 3, tags: ["claims", "causal", "writing"] },
  { id: "editor-societal", stage: "editor", quote: "Potential societal harms require a more serious discussion.", quoteZh: "潜在社会危害需要更严肃的讨论。", note: "伦理、公平性和局限性牌会命中。", noteEn: "Ethics, fairness, and limitations cards match.", primary: "clarity", secondary: "reproducibility", difficulty: 9, severity: 3, tags: ["ethics", "fairness", "claims"] },
  { id: "editor-cost", stage: "editor", quote: "Is the marginal gain worth the additional compute?", quoteZh: "这点边际提升值得额外算力吗？", note: "等算力比较与效率行动最有效。", noteEn: "Compute-matched comparisons and efficiency actions work best.", primary: "evidence", secondary: "novelty", difficulty: 9, severity: 2, tags: ["efficiency", "comparison", "compute"] },
  { id: "camera-alt", stage: "camera", quote: "All figures require accessible alt text.", quoteZh: "所有图都需要无障碍替代文本。", note: "图表、可访问性与清晰度行动会命中。", noteEn: "Figure, accessibility, and clarity actions match.", primary: "clarity", difficulty: 7, severity: 2, tags: ["accessibility", "figure", "formatting"] },
  { id: "camera-anon", stage: "camera", quote: "The anonymized repository still reveals author identities.", quoteZh: "匿名仓库仍然暴露了作者身份。", note: "代码、审计和复现类行动会命中。", noteEn: "Code, audit, and reproducibility actions match.", primary: "reproducibility", difficulty: 8, severity: 3, tags: ["code", "audit", "reproducibility"] },
  { id: "coauthor-abstract", stage: "coauthor", quote: "Can we rewrite the abstract around a completely different story?", quoteZh: "我们能不能围绕一个完全不同的故事重写摘要？", note: "合作者在截止前发现了新的论文。", noteEn: "The coauthor discovers a new paper inside yours, right before the deadline.", primary: "clarity", secondary: "novelty", difficulty: 12, severity: 3, tags: ["writing", "summary", "novelty"] },
];

export const EXPANSION_EVENTS: EventDef[] = [
  {
    id: "deadline-moved", icon: "◷", title: "会议提前了截止日", titleEn: "The Deadline Moved Forward",
    description: "时区换算没有错，主办方真的少给了一天。", descriptionEn: "Your time-zone math is correct. The organizers really removed a day.",
    choices: [
      { id: "triage", label: "砍掉非必要实验", labelEn: "Triage the scope", hint: "天数 -1 · 清晰度 +2", hintEn: "Days -1 · Clarity +2", result: "论文变短了，也更像一篇论文了。", resultEn: "The paper is shorter and, somehow, more like a paper.", delta: { days: -1, stats: { clarity: 2 } } },
      { id: "all-nighter", label: "通宵硬顶", labelEn: "Pull an all-nighter", hint: "天数不变 · 精神 -4 · 咖啡因 +2", hintEn: "No day lost · Mental -4 · Caffeine +2", result: "早上到了。你不确定自己有没有。", resultEn: "Morning arrives. You are less certain that you did.", delta: { mental: -4 }, effect: { conditions: { caffeine: 2 } } },
    ],
  },
  {
    id: "queue-empty", icon: "▰", title: "集群队列突然为空", titleEn: "The Cluster Queue Is Empty",
    description: "这种异常现象可能持续不到十分钟。", descriptionEn: "This anomaly may last fewer than ten minutes.",
    choices: [
      { id: "launch", label: "立刻启动扫描", labelEn: "Launch a sweep", hint: "GPU -3 · 证据 +3", hintEn: "GPU -3 · Evidence +3", result: "你占满了八张卡，并假装没有看到群聊。", resultEn: "You occupy eight GPUs and pretend not to see the group chat.", delta: { gpu: -3, stats: { evidence: 3 } } },
      { id: "save", label: "保存配额", labelEn: "Save the allocation", hint: "GPU +3 · 精神 +1", hintEn: "GPU +3 · Mental +1", result: "克制也是一种实验设计。", resultEn: "Restraint is also an experimental design.", delta: { gpu: 3, mental: 1 } },
    ],
  },
  {
    id: "queue-forty-seven", icon: "⌛", title: "预计排队 47 小时", titleEn: "Estimated Queue Time: 47 Hours",
    description: "你的任务排在一个名为 final_final_v9 的作业后面。", descriptionEn: "Your job is behind one called final_final_v9.",
    choices: [
      { id: "optimize", label: "优化成小模型", labelEn: "Optimize the small model", hint: "创新 -1 · 复现 +2 · GPU +2", hintEn: "Novelty -1 · Repro +2 · GPU +2", result: "它更快，而且令人不安地接近原结果。", resultEn: "It is faster and disturbingly close to the original result.", delta: { gpu: 2, stats: { novelty: -1, reproducibility: 2 } } },
      { id: "cloud", label: "刷卡上云", labelEn: "Put it on the cloud", hint: "经费 -3 · GPU +6", hintEn: "Funding -3 · GPU +6", result: "账单在增长，实验也在增长。", resultEn: "The bill grows. So do the experiments.", delta: { funding: -3, gpu: 6 } },
    ],
  },
  {
    id: "reviewer-tweet", icon: "@", title: "有人发推抱怨你的方向", titleEn: "A Reviewer Tweets About Your Topic",
    description: "措辞非常熟悉，但当然无法确认身份。", descriptionEn: "The phrasing is familiar, but naturally the identity cannot be confirmed.",
    choices: [
      { id: "listen", label: "提炼有效批评", labelEn: "Extract the useful criticism", hint: "洞见 +2 · 精神 -1", hintEn: "Insight +2 · Mental -1", result: "社交媒体偶尔也能产生一个控制变量。", resultEn: "Social media occasionally produces a useful control variable.", delta: { mental: -1 }, effect: { conditions: { insight: 2 } } },
      { id: "mute", label: "静音并散步", labelEn: "Mute and take a walk", hint: "精神 +4", hintEn: "Mental +4", result: "草地没有意见。", resultEn: "The grass has no comments.", delta: { mental: 4 } },
    ],
  },
  {
    id: "license-revoked", icon: "§", title: "数据集许可突然更新", titleEn: "The Dataset License Changes",
    description: "昨天允许研究，今天需要单独批准。", descriptionEn: "Yesterday it permitted research. Today it requires separate approval.",
    choices: [
      { id: "audit", label: "重做数据合规审计", labelEn: "Redo the compliance audit", hint: "经费 -2 · 复现 +3 · 风险 -6", hintEn: "Funding -2 · Repro +3 · Risk -6", result: "数据来源现在比方法章节更长。", resultEn: "The data provenance section is now longer than Methods.", delta: { funding: -2, risk: -6, stats: { reproducibility: 3 } } },
      { id: "replace", label: "换成公开数据", labelEn: "Replace it with open data", hint: "证据 -2 · 复现 +4", hintEn: "Evidence -2 · Repro +4", result: "指标下降了，但任何人都能验证。", resultEn: "The metric drops, but anyone can verify it.", delta: { stats: { evidence: -2, reproducibility: 4 } }, effect: { addCard: "data-card" } },
    ],
  },
  {
    id: "irb-amendment", icon: "✚", title: "伦理审查要求补充说明", titleEn: "The IRB Requests an Amendment",
    description: "委员会想知道这个二次分析到底是不是二次分析。", descriptionEn: "The committee wants to know whether the secondary analysis is actually secondary.",
    choices: [
      { id: "amend", label: "提交正式修订", labelEn: "File the amendment", hint: "经费 -1 · 天数 -1 · 风险 -8", hintEn: "Funding -1 · Days -1 · Risk -8", result: "批准邮件终于比截止日早到了六小时。", resultEn: "Approval arrives six hours before the deadline.", delta: { funding: -1, days: -1, risk: -8, stats: { reproducibility: 2 } } },
      { id: "exclude", label: "删除相关分析", labelEn: "Remove the analysis", hint: "证据 -2 · 清晰度 +2", hintEn: "Evidence -2 · Clarity +2", result: "结果少了，边界清楚了。", resultEn: "There are fewer results and clearer boundaries.", delta: { stats: { evidence: -2, clarity: 2 } } },
    ],
  },
  {
    id: "coffee-broken", icon: "☕", title: "咖啡机坏了", titleEn: "The Coffee Machine Breaks",
    description: "实验室进入了未经伦理审批的人体试验。", descriptionEn: "The lab enters an unapproved human-subjects experiment.",
    choices: [
      { id: "repair", label: "拆开维修", labelEn: "Repair it yourself", hint: "专注 -1 · 咖啡因 +3", hintEn: "Focus -1 · Caffeine +3", result: "你修好了泵，也许顺便修好了团队。", resultEn: "You fix the pump and perhaps the team.", delta: { focus: -1 }, effect: { conditions: { caffeine: 3 } } },
      { id: "tea", label: "改喝茶", labelEn: "Switch to tea", hint: "精神 +2 · 清晰度 +1", hintEn: "Mental +2 · Clarity +1", result: "实验室第一次听见了自己的心跳。", resultEn: "The lab hears its own heartbeat for the first time.", delta: { mental: 2, stats: { clarity: 1 } } },
    ],
  },
  {
    id: "causal-advisor", icon: "↝", title: "导师突然想做因果推断", titleEn: "Your Advisor Discovers Causal Inference",
    description: "“加一个 DAG 应该不难吧？”", descriptionEn: "'Adding one DAG should not be difficult, right?'",
    choices: [
      { id: "learn", label: "认真补因果分析", labelEn: "Learn it properly", hint: "精神 -2 · 创新 +2 · 证据 +2", hintEn: "Mental -2 · Novelty +2 · Evidence +2", result: "箭头终于有了方向，也有了假设。", resultEn: "The arrows now have direction—and assumptions.", delta: { mental: -2, stats: { novelty: 2, evidence: 2 } }, effect: { addCard: "synthetic-controls" } },
      { id: "appendix", label: "把 DAG 放进附录", labelEn: "Put the DAG in the appendix", hint: "清晰度 +1 · 风险 +3", hintEn: "Clarity +1 · Risk +3", result: "它在那里，看起来很因果。", resultEn: "It is there, looking extremely causal.", delta: { risk: 3, stats: { clarity: 1 } } },
    ],
  },
  {
    id: "poster-award", icon: "★", title: "海报意外获奖", titleEn: "The Poster Wins an Award",
    description: "评委喜欢那张你差点删掉的失败案例图。", descriptionEn: "The judges love the failure-case figure you nearly deleted.",
    choices: [
      { id: "confidence", label: "把反馈写进论文", labelEn: "Use the feedback", hint: "清晰度 +3 · 精神 +3", hintEn: "Clarity +3 · Mental +3", result: "第一次，会议茶歇提供了可操作意见。", resultEn: "For once, conference coffee produces actionable feedback.", delta: { mental: 3, stats: { clarity: 3 } } },
      { id: "network", label: "请评委做外部顾问", labelEn: "Ask a judge to advise", hint: "经费 -1 · 审稿人好感 +2", hintEn: "Funding -1 · Reviewer Favor +2", result: "对方答应看一页。你发了十二页。", resultEn: "They agree to read one page. You send twelve.", delta: { funding: -1 }, effect: { conditions: { reviewerFavor: 2 } } },
    ],
  },
  {
    id: "benchmark-down", icon: "×", title: "基准服务器宕机", titleEn: "The Benchmark Server Goes Down",
    description: "排行榜消失后，所有人突然开始讨论方法。", descriptionEn: "With the leaderboard gone, everyone suddenly discusses methodology.",
    choices: [
      { id: "offline", label: "建立离线评估", labelEn: "Build an offline evaluation", hint: "GPU -2 · 复现 +3", hintEn: "GPU -2 · Repro +3", result: "评估脚本第一次不依赖周二的服务器状态。", resultEn: "Evaluation no longer depends on a server's Tuesday mood.", delta: { gpu: -2, stats: { reproducibility: 3 } }, effect: { addCard: "blind-evaluation" } },
      { id: "wait", label: "等待恢复", labelEn: "Wait for recovery", hint: "天数 -1 · 精神 +2", hintEn: "Days -1 · Mental +2", result: "你获得了罕见的被迫休息。", resultEn: "You receive a rare mandatory break.", delta: { days: -1, mental: 2 } },
    ],
  },
  {
    id: "preprint-cited", icon: "↗", title: "预印本收到了第一条引用", titleEn: "The Preprint Gets Its First Citation",
    description: "虽然是自引，但来自另一个团队。", descriptionEn: "It is a self-citation, but from a different team.",
    choices: [
      { id: "read", label: "阅读他们的用法", labelEn: "Read how they used it", hint: "创新 +2 · 洞见 +1", hintEn: "Novelty +2 · Insight +1", result: "别人误解了你的方法，却发现了新用途。", resultEn: "They misunderstand your method and discover a new use.", delta: { stats: { novelty: 2 } }, effect: { conditions: { insight: 1 } } },
      { id: "celebrate", label: "截图发群里", labelEn: "Screenshot it for the group chat", hint: "精神 +5", hintEn: "Mental +5", result: "点赞数第一次超过实验数。", resultEn: "The reaction count exceeds the experiment count.", delta: { mental: 5 } },
    ],
  },
  {
    id: "anonymous-issue", icon: "!", title: "匿名用户提交了复现问题", titleEn: "An Anonymous User Files a Reproduction Issue",
    description: "最小示例只有七行，并且确实失败。", descriptionEn: "The minimal example is seven lines long and genuinely fails.",
    choices: [
      { id: "fix", label: "公开修复", labelEn: "Fix it in public", hint: "精神 -2 · 复现 +4 · 风险 -6", hintEn: "Mental -2 · Repro +4 · Risk -6", result: "Issue 关闭了，信任没有。它反而增加了。", resultEn: "The issue closes. Trust does not—it grows.", delta: { mental: -2, risk: -6, stats: { reproducibility: 4 } }, effect: { upgradeRandom: true } },
      { id: "private", label: "私下删除仓库", labelEn: "Take the repository private", hint: "风险 +14 · 技术债 +2", hintEn: "Risk +14 · Technical Debt +2", result: "问题看不见了，搜索缓存还看得见。", resultEn: "The issue disappears. Search caches remember.", delta: { risk: 14 }, effect: { conditions: { technicalDebt: 2 } } },
    ],
  },
  {
    id: "coauthor-vacation", icon: "✈", title: "合作者进入自动回复", titleEn: "The Coauthor Goes on Vacation",
    description: "返回日期是截止日后的第二天。", descriptionEn: "Their return date is two days after the deadline.",
    choices: [
      { id: "own", label: "自己接管修改", labelEn: "Take ownership", hint: "精神 -2 · 清晰度 +3", hintEn: "Mental -2 · Clarity +3", result: "你终于知道每一段是谁写的：现在都是你。", resultEn: "You finally know who wrote every paragraph: now it is you.", delta: { mental: -2, stats: { clarity: 3 } } },
      { id: "wait", label: "尊重休假", labelEn: "Respect the vacation", hint: "精神 +3 · 审稿人好感 -1", hintEn: "Mental +3 · Reviewer Favor -1", result: "边界感提升了，回复速度没有。", resultEn: "Boundaries improve. Response speed does not.", delta: { mental: 3 }, effect: { conditions: { reviewerFavor: -1 } } },
    ],
  },
  {
    id: "stat-consultant", icon: "Σ", title: "统计顾问今天有空", titleEn: "A Statistician Has Office Hours",
    description: "预约表上竟然有一个空位。", descriptionEn: "There is somehow one open appointment.",
    choices: [
      { id: "book", label: "带上全部分析", labelEn: "Bring every analysis", hint: "经费 -2 · 证据 +3 · 复现 +3", hintEn: "Funding -2 · Evidence +3 · Repro +3", result: "你删除了两个检验，论文反而更强。", resultEn: "You remove two tests and the paper becomes stronger.", delta: { funding: -2, stats: { evidence: 3, reproducibility: 3 } }, effect: { addCard: "multiple-testing" } },
      { id: "email", label: "只发一个问题", labelEn: "Email one question", hint: "清晰度 +2 · 洞见 +1", hintEn: "Clarity +2 · Insight +1", result: "回复只有一句，但正中问题。", resultEn: "The reply is one sentence and exactly right.", delta: { stats: { clarity: 2 } }, effect: { conditions: { insight: 1 } } },
    ],
  },
  {
    id: "carbon-warning", icon: "♻", title: "计算平台发来碳预算警告", titleEn: "A Carbon-Budget Warning Arrives",
    description: "本月训练排放已经超过整个课题组的差旅。", descriptionEn: "This month's training emissions exceed the lab's travel footprint.",
    choices: [
      { id: "efficient", label: "改用高效配置", labelEn: "Switch to an efficient setup", hint: "GPU +4 · 创新 -1 · 复现 +2", hintEn: "GPU +4 · Novelty -1 · Repro +2", result: "训练快了，准确率只少了第三位小数。", resultEn: "Training is faster. Accuracy loses only its third decimal.", delta: { gpu: 4, stats: { novelty: -1, reproducibility: 2 } } },
      { id: "offset", label: "购买计算额度", labelEn: "Buy more compute credits", hint: "经费 -3 · GPU +5 · 风险 +2", hintEn: "Funding -3 · GPU +5 · Risk +2", result: "预算表变红，GPU 指示灯变绿。", resultEn: "The budget turns red. The GPU lights turn green.", delta: { funding: -3, gpu: 5, risk: 2 } },
    ],
  },
  {
    id: "title-typo", icon: "Aa", title: "标题里发现一个拼写错误", titleEn: "There Is a Typo in the Title",
    description: "预印本已经被下载了 417 次。", descriptionEn: "The preprint has already been downloaded 417 times.",
    choices: [
      { id: "version", label: "立刻上传新版本", labelEn: "Upload a new version now", hint: "清晰度 +2 · 精神 -1", hintEn: "Clarity +2 · Mental -1", result: "版本号增加，羞耻感减少。", resultEn: "The version number rises. Shame recedes.", delta: { mental: -1, stats: { clarity: 2 } }, effect: { addCard: "title-surgery" } },
      { id: "feature", label: "说这是英式拼写", labelEn: "Call it British spelling", hint: "风险 +4 · 精神 +2", hintEn: "Risk +4 · Mental +2", result: "没有人相信，但有人点了赞。", resultEn: "Nobody believes you, but someone likes the post.", delta: { risk: 4, mental: 2 } },
    ],
  },
  {
    id: "supplement-zip", icon: "ZIP", title: "补充材料压缩包损坏", titleEn: "The Supplementary ZIP Is Corrupted",
    description: "唯一正常的文件是 thumbs.db。", descriptionEn: "The only healthy file is thumbs.db.",
    choices: [
      { id: "rebuild", label: "自动重建材料", labelEn: "Rebuild it automatically", hint: "专注 -1 · 复现 +3", hintEn: "Focus -1 · Repro +3", result: "这次生成过程可以重复。连压缩包也可以。", resultEn: "The generation process is reproducible now. So is the ZIP.", delta: { focus: -1, stats: { reproducibility: 3 } }, effect: { addCard: "automate-table" } },
      { id: "manual", label: "手工重新打包", labelEn: "Repack it manually", hint: "精神 -2 · 清晰度 +1", hintEn: "Mental -2 · Clarity +1", result: "你数了 83 个文件，数了两遍。", resultEn: "You count 83 files. Twice.", delta: { mental: -2, stats: { clarity: 1 } } },
    ],
  },
  {
    id: "negative-goes-viral", icon: "↯", title: "失败实验意外走红", titleEn: "The Negative Result Goes Viral",
    description: "大家似乎都在犯同一个错误，只是没人写出来。", descriptionEn: "Everyone appears to be making the same mistake. Nobody wrote it down.",
    choices: [
      { id: "embrace", label: "把失败写进主文", labelEn: "Move it into the main paper", hint: "证据 +2 · 复现 +3 · 风险 -5", hintEn: "Evidence +2 · Repro +3 · Risk -5", result: "最不好看的结果成了最有用的结果。", resultEn: "The ugliest result becomes the most useful one.", delta: { risk: -5, stats: { evidence: 2, reproducibility: 3 } }, effect: { addCard: "negative-results" } },
      { id: "thread", label: "只发一条长帖", labelEn: "Write a long thread instead", hint: "创新 +2 · 清晰度 +1", hintEn: "Novelty +2 · Clarity +1", result: "线程比论文先通过了同行评审。", resultEn: "The thread passes peer review before the paper.", delta: { stats: { novelty: 2, clarity: 1 } } },
    ],
  },
  {
    id: "backup-found", icon: "▣", title: "找到了三个月前的备份", titleEn: "A Three-Month-Old Backup Appears",
    description: "文件名叫 old_do_not_use，但它可能是唯一能用的版本。", descriptionEn: "It is named old_do_not_use, but may be the only usable version.",
    choices: [
      { id: "diff", label: "逐行对比", labelEn: "Diff every line", hint: "精神 -2 · 复现 +4", hintEn: "Mental -2 · Repro +4", result: "你找到了 bug，也找到了为什么它曾经有效。", resultEn: "You find the bug and why it once worked.", delta: { mental: -2, stats: { reproducibility: 4 } }, effect: { upgradeRandom: true } },
      { id: "restore", label: "直接恢复旧版", labelEn: "Restore it immediately", hint: "天数 +1 · 技术债 +2", hintEn: "Days +1 · Technical Debt +2", result: "时间回来了，理解没有。", resultEn: "Time returns. Understanding does not.", delta: { days: 1 }, effect: { conditions: { technicalDebt: 2 } } },
    ],
  },
  {
    id: "reviewer-apology", icon: "…", title: "审稿人发来补充说明", titleEn: "The Reviewer Sends a Clarification",
    description: "原来那条互相矛盾的要求是复制粘贴错误。", descriptionEn: "The contradictory request was apparently a copy-paste error.",
    choices: [
      { id: "gracious", label: "礼貌接受", labelEn: "Accept graciously", hint: "精神 +3 · 审稿人好感 +3", hintEn: "Mental +3 · Reviewer Favor +3", result: "一句道歉抵消不了三天实验，但很接近。", resultEn: "One apology cannot restore three days of experiments, but it comes close.", delta: { mental: 3 }, effect: { conditions: { reviewerFavor: 3 } } },
      { id: "document", label: "保存邮件记录", labelEn: "Archive the email", hint: "复现 +2 · 风险 -3", hintEn: "Repro +2 · Risk -3", result: "严谨不仅适用于代码，也适用于收件箱。", resultEn: "Rigor applies to inboxes as well as code.", delta: { risk: -3, stats: { reproducibility: 2 } } },
    ],
  },
];

export const RELICS: RelicDef[] = [
  { id: "preregistration", icon: "¶", name: "预注册协议", en: "Preregistration", rules: "每天第一张严谨牌额外 +2 回应。", rulesEn: "Your first Rigor card each day gains +2 Response.", rarity: "uncommon" },
  { id: "gpu-allocation", icon: "▰", name: "长期 GPU 配额", en: "Standing GPU Allocation", rules: "每天第一张实验牌少消耗 1 GPU。", rulesEn: "Your first Experiment card each day costs 1 less GPU.", rarity: "uncommon" },
  { id: "zotero-library", icon: "Z", name: "整理好的 Zotero", en: "Organized Zotero Library", rules: "每天第一张写作牌少消耗 1 专注。", rulesEn: "Your first Writing card each day costs 1 less Focus.", rarity: "uncommon" },
  { id: "support-group", icon: "☕", name: "研究生互助群", en: "Grad Student Support Group", rules: "每天第一张支援牌额外回复 2 精神。", rulesEn: "Your first Support card each day restores 2 extra Mental Health.", rarity: "uncommon" },
  { id: "open-notebook", icon: "▤", name: "开放实验记录", en: "Open Lab Notebook", rules: "危险牌增加的风险减少 5；严谨牌额外降低 1 风险。", rulesEn: "Questionable cards gain 5 less Risk; Rigor cards reduce 1 extra Risk.", rarity: "rare" },
  { id: "golden-seed", icon: "3407", name: "传奇 Seed 3407", en: "Legendary Seed 3407", rules: "调随机种子的成功率从 55% 提升到 75%。", rulesEn: "Tune Random Seed succeeds 75% of the time instead of 55%.", rarity: "rare" },
  { id: "red-pen", icon: "✎", name: "编辑的红笔", en: "The Editor's Red Pen", rules: "精准回复额外获得 1 清晰度和 1 精神。", rulesEn: "Exact replies also grant 1 Clarity and 1 Mental Health.", rarity: "rare" },
  { id: "backup-drive", icon: "▣", name: "真正能用的备份盘", en: "A Working Backup Drive", rules: "每次事件造成的复现性损失减少 2。", rulesEn: "Events reduce Reproducibility by 2 less.", rarity: "uncommon" },
  { id: "desk-plant", icon: "♧", name: "还活着的桌面植物", en: "A Living Desk Plant", rules: "每天开始回复 1 精神。", rulesEn: "Restore 1 Mental Health at the start of each day.", rarity: "uncommon" },
  { id: "reviewer-map", icon: "⌖", name: "审稿人思维导图", en: "Reviewer Mind Map", rules: "每条新意见初始获得 2 回复进度。", rulesEn: "Every new comment starts with 2 additional Response progress.", rarity: "rare" },
  { id: "page-budget", icon: "8p", name: "神奇的页数预算", en: "Elastic Page Budget", rules: "格式与图表意见获得 +2 回应。", rulesEn: "Gain +2 Response against formatting and figure comments.", rarity: "uncommon" },
  { id: "rubber-duck-relic", icon: "◆", name: "终身教职橡皮鸭", en: "Tenured Rubber Duck", rules: "每天第一张不命中标签的牌仍获得 +1 回应。", rulesEn: "Your first card with no tag match each day still gains +1 Response.", rarity: "rare" },
];

export const STARTING_DECKS: Record<string, string[]> = {
  method: ["ablation", "baseline", "error-analysis", "rewrite-intro", "better-figure", "stat-test", "rebuttal-letter", "related-work", "release-code", "seed-everything", "ask-coauthor", "coffee", "sleep", "tune-seed"],
  clinical: ["external-validation", "stat-test", "power-analysis", "clean-split", "cross-validation", "error-analysis", "better-figure", "rebuttal-letter", "release-code", "negative-results", "ask-labmate", "take-walk", "sleep", "calibration-curve"],
  foundation: ["baseline", "ablation", "smaller-model", "cloud-gpu", "reproduce-baseline", "seed-everything", "release-code", "appendix", "rewrite-intro", "better-figure", "coffee", "ask-coauthor", "sleep", "compute-matched"],
  "small-data": ["stat-test", "power-analysis", "bootstrap-ci", "cross-validation", "clean-split", "negative-results", "simplify-claim", "limitations-section", "rebuttal-letter", "release-code", "ask-labmate", "take-walk", "sleep", "rubber-duck"],
  interdisciplinary: ["rewrite-intro", "related-work", "better-figure", "rebuttal-letter", "baseline", "stat-test", "error-analysis", "appendix", "ask-coauthor", "ask-labmate", "coffee", "take-walk", "sleep", "response-matrix"],
};
