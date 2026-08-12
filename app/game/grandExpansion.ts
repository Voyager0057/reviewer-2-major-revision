import type {
  Capability,
  CardCategory,
  CardDef,
  CardRarity,
  Delta,
  EventChoice,
  EventDef,
  EventEffect,
  Metric,
  PaperStats,
} from "./types";

/**
 * The Grand Expansion is intentionally self-contained. It adds a large pool of
 * cards and story events without changing the engine's public data contracts.
 * Event `dialogue` metadata stays compatible with the base event contract and
 * is adapted by data.ts into the live story-event renderer's dialogue beats.
 */

interface ResearchTopic {
  capability: Capability;
  slug: string;
  zh: string;
  en: string;
  objectZh: string;
  objectEn: string;
  doubtZh: string;
  doubtEn: string;
  artifactZh: string;
  artifactEn: string;
  primary: Metric;
  secondary: Metric;
  ally: Capability;
  tags: string[];
}

const TOPICS: ResearchTopic[] = [
  { capability: "comparison", slug: "comparison", zh: "公平基线", en: "Fair Baselines", objectZh: "同预算下的强基线", objectEn: "strong baselines under matched budgets", doubtZh: "胜利可能只是对手没有认真调参", doubtEn: "the win may come from undertuned opponents", artifactZh: "统一调参账本", artifactEn: "matched-tuning ledger", primary: "evidence", secondary: "reproducibility", ally: "protocol", tags: ["comparison", "baseline", "protocol"] },
  { capability: "ablation", slug: "ablation", zh: "组件归因", en: "Component Attribution", objectZh: "每个模块和它们的交互", objectEn: "each module and its interactions", doubtZh: "贡献可能藏在组合而不是单个模块里", doubtEn: "the contribution may live in interactions rather than modules", artifactZh: "消融矩阵", artifactEn: "ablation matrix", primary: "novelty", secondary: "evidence", ally: "interpretability", tags: ["ablation", "component", "interpretability"] },
  { capability: "statistics", slug: "statistics", zh: "统计证据", en: "Statistical Evidence", objectZh: "效应量、检验和校正", objectEn: "effect sizes, tests, and corrections", doubtZh: "第三位小数可能比理论更有影响力", doubtEn: "the third decimal may be doing more work than the theory", artifactZh: "分析计划表", artifactEn: "analysis plan", primary: "evidence", secondary: "reproducibility", ally: "uncertainty", tags: ["statistics", "significance", "power"] },
  { capability: "uncertainty", slug: "uncertainty", zh: "不确定性", en: "Uncertainty", objectZh: "区间、分布和误差传播", objectEn: "intervals, distributions, and error propagation", doubtZh: "漂亮的均值可能站在很宽的误差条上", doubtEn: "the attractive mean may stand on very wide error bars", artifactZh: "误差预算", artifactEn: "uncertainty budget", primary: "evidence", secondary: "clarity", ally: "statistics", tags: ["uncertainty", "statistics", "intervals"] },
  { capability: "visualization", slug: "visualization", zh: "视觉论证", en: "Visual Argument", objectZh: "编码、图注和失败案例", objectEn: "encodings, captions, and failure cases", doubtZh: "Figure 2 可能只有作者看得懂", doubtEn: "Figure 2 may be legible only to its authors", artifactZh: "矢量图谱", artifactEn: "vector figure atlas", primary: "clarity", secondary: "evidence", ally: "formatting", tags: ["figure", "visualization", "clarity"] },
  { capability: "protocol", slug: "protocol", zh: "实验协议", en: "Experimental Protocol", objectZh: "划分、指标和停止规则", objectEn: "splits, metrics, and stopping rules", doubtZh: "关键决定可能是在看过结果后才显得关键", doubtEn: "key decisions may have become key only after seeing results", artifactZh: "冻结方案书", artifactEn: "frozen protocol", primary: "reproducibility", secondary: "clarity", ally: "statistics", tags: ["protocol", "preregistration", "details"] },
  { capability: "dataIntegrity", slug: "data-integrity", zh: "数据完整性", en: "Data Integrity", objectZh: "样本、标签、哈希和来源", objectEn: "samples, labels, hashes, and provenance", doubtZh: "训练集与测试集也许早就在候诊室见过", doubtEn: "train and test may already have met in the waiting room", artifactZh: "只读数据谱系", artifactEn: "read-only data lineage", primary: "reproducibility", secondary: "evidence", ally: "ethics", tags: ["data", "audit", "leakage"] },
  { capability: "externalValidation", slug: "external-validation", zh: "外部验证", en: "External Validation", objectZh: "独立中心、时间段和领域", objectEn: "independent sites, periods, and domains", doubtZh: "结论可能只在这台服务器附近成立", doubtEn: "the conclusion may generalize only near this server", artifactZh: "多中心护照", artifactEn: "multi-site passport", primary: "evidence", secondary: "reproducibility", ally: "robustness", tags: ["external", "generalization", "datasets"] },
  { capability: "robustness", slug: "robustness", zh: "鲁棒边界", en: "Robustness Boundary", objectZh: "扰动、超参数和环境变化", objectEn: "perturbations, hyperparameters, and environment shifts", doubtZh: "最佳设置可能是一座只容一粒种子的独木桥", doubtEn: "the best setting may be a bridge wide enough for one seed", artifactZh: "压力测试地图", artifactEn: "stress-test map", primary: "evidence", secondary: "reproducibility", ally: "externalValidation", tags: ["robustness", "parameters", "stress"] },
  { capability: "calibration", slug: "calibration", zh: "置信校准", en: "Confidence Calibration", objectZh: "置信度与真实错误率", objectEn: "confidence and observed error rates", doubtZh: "模型的自信可能来自没有参加过答辩", doubtEn: "the model may be confident because it has never faced a defense", artifactZh: "可靠性曲线册", artifactEn: "reliability curve book", primary: "evidence", secondary: "clarity", ally: "uncertainty", tags: ["calibration", "uncertainty", "clinical"] },
  { capability: "efficiency", slug: "efficiency", zh: "计算效率", en: "Compute Efficiency", objectZh: "吞吐、显存、能耗和延迟", objectEn: "throughput, memory, energy, and latency", doubtZh: "0.1 的提升可能正在烧掉整栋楼的空调预算", doubtEn: "a 0.1 gain may be consuming the building's cooling budget", artifactZh: "算力收支表", artifactEn: "compute ledger", primary: "evidence", secondary: "reproducibility", ally: "comparison", tags: ["efficiency", "compute", "gpu"] },
  { capability: "clinicalRelevance", slug: "clinical-relevance", zh: "临床价值", en: "Clinical Relevance", objectZh: "指标、工作流和患者结局", objectEn: "metrics, workflows, and patient outcomes", doubtZh: "AUC 上升不一定让任何一个真实决定改变", doubtEn: "a higher AUC may not change a single real decision", artifactZh: "床旁决策路径", artifactEn: "bedside decision pathway", primary: "novelty", secondary: "evidence", ally: "externalValidation", tags: ["clinical", "impact", "claims"] },
  { capability: "fairness", slug: "fairness", zh: "亚组公平", en: "Subgroup Fairness", objectZh: "亚组差距、伤害和失败模式", objectEn: "subgroup gaps, harms, and failure modes", doubtZh: "总体均值可能把最需要被看见的人平均掉了", doubtEn: "the aggregate mean may average away those most worth seeing", artifactZh: "亚组审计卡", artifactEn: "subgroup audit card", primary: "evidence", secondary: "clarity", ally: "ethics", tags: ["fairness", "subgroups", "ethics"] },
  { capability: "causalReasoning", slug: "causal-reasoning", zh: "因果边界", en: "Causal Boundary", objectZh: "估计目标、假设和识别策略", objectEn: "estimands, assumptions, and identification strategies", doubtZh: "一根箭头可能把相关写成了因果", doubtEn: "one arrow may have promoted association into causation", artifactZh: "DAG 假设账本", artifactEn: "DAG assumption ledger", primary: "novelty", secondary: "evidence", ally: "protocol", tags: ["causal", "theory", "claims"] },
  { capability: "reproducibility", slug: "reproducibility", zh: "复现流程", en: "Reproducible Workflow", objectZh: "环境、种子、数据和命令", objectEn: "environments, seeds, data, and commands", doubtZh: "README 里的“一键运行”可能需要十二个隐藏步骤", doubtEn: "the README's one-click run may require twelve hidden steps", artifactZh: "复现胶囊", artifactEn: "reproduction capsule", primary: "reproducibility", secondary: "clarity", ally: "documentation", tags: ["reproducibility", "environment", "seed"] },
  { capability: "codeRelease", slug: "code-release", zh: "代码发布", en: "Code Release", objectZh: "安装、测试、许可和示例", objectEn: "installation, tests, licensing, and examples", doubtZh: "仓库可能只在作者的 shell 历史里完整", doubtEn: "the repository may be complete only in the author's shell history", artifactZh: "绿色 CI 徽章", artifactEn: "green CI badge", primary: "reproducibility", secondary: "clarity", ally: "documentation", tags: ["code", "repo", "release"] },
  { capability: "documentation", slug: "documentation", zh: "研究文档", en: "Research Documentation", objectZh: "数据卡、模型卡和运行说明", objectEn: "data cards, model cards, and run instructions", doubtZh: "关键细节可能只存活在一位毕业生的记忆里", doubtEn: "critical details may survive only in one alumnus's memory", artifactZh: "活的 README", artifactEn: "living README", primary: "clarity", secondary: "reproducibility", ally: "codeRelease", tags: ["documentation", "readme", "details"] },
  { capability: "claimFraming", slug: "claim-framing", zh: "主张边界", en: "Claim Boundary", objectZh: "措辞、适用范围和限制", objectEn: "wording, scope, and limitations", doubtZh: "摘要里的形容词可能跑在证据前面", doubtEn: "the abstract's adjectives may be outrunning the evidence", artifactZh: "主张—证据索引", artifactEn: "claim-evidence index", primary: "novelty", secondary: "clarity", ally: "responseWriting", tags: ["claims", "scope", "writing"] },
  { capability: "literature", slug: "literature", zh: "文献定位", en: "Literature Positioning", objectZh: "近期、相反和奠基性工作", objectEn: "recent, contrary, and foundational work", doubtZh: "创新点可能在 1997 年的一篇脚注里见过", doubtEn: "the novelty may have appeared in a 1997 footnote", artifactZh: "文献家谱", artifactEn: "literature family tree", primary: "novelty", secondary: "clarity", ally: "comparison", tags: ["literature", "recent", "citation"] },
  { capability: "responseWriting", slug: "response-writing", zh: "逐点回复", en: "Point-by-Point Response", objectZh: "意见、行动、证据和页码", objectEn: "concerns, actions, evidence, and page numbers", doubtZh: "礼貌可能已经淹没了真正的回答", doubtEn: "politeness may have buried the actual answer", artifactZh: "回复追踪矩阵", artifactEn: "response traceability matrix", primary: "clarity", secondary: "evidence", ally: "documentation", tags: ["response", "rebuttal", "writing"] },
  { capability: "ethics", slug: "ethics", zh: "伦理治理", en: "Ethics Governance", objectZh: "同意、用途限制和潜在伤害", objectEn: "consent, use limits, and possible harms", doubtZh: "能做的实验并不自动等于该做的实验", doubtEn: "an experiment being possible does not make it permissible", artifactZh: "责任登记册", artifactEn: "responsibility register", primary: "reproducibility", secondary: "clarity", ally: "fairness", tags: ["ethics", "consent", "governance"] },
  { capability: "formatting", slug: "formatting", zh: "终稿工程", en: "Camera-Ready Engineering", objectZh: "页数、字体、引用和分辨率", objectEn: "pages, fonts, citations, and resolution", doubtZh: "四毫米可能比四个月实验更影响提交系统", doubtEn: "four millimeters may matter more to the portal than four months of experiments", artifactZh: "终稿检查流水线", artifactEn: "camera-ready pipeline", primary: "clarity", secondary: "reproducibility", ally: "visualization", tags: ["formatting", "camera", "figure"] },
  { capability: "theory", slug: "theory", zh: "理论机制", en: "Theoretical Mechanism", objectZh: "命题、边界条件和可证伪预测", objectEn: "propositions, boundary conditions, and falsifiable predictions", doubtZh: "一个定理可能只是把实验结果穿上了正装", doubtEn: "a theorem may only be the result wearing formal clothes", artifactZh: "机制白板", artifactEn: "mechanism whiteboard", primary: "novelty", secondary: "clarity", ally: "ablation", tags: ["theory", "mechanism", "novelty"] },
  { capability: "interpretability", slug: "interpretability", zh: "解释忠实度", en: "Explanation Fidelity", objectZh: "稳定性、忠实度和反例", objectEn: "stability, fidelity, and counterexamples", doubtZh: "热力图可能只是在认真地装饰输入", doubtEn: "the heatmap may be diligently decorating the input", artifactZh: "解释压力箱", artifactEn: "explanation stress box", primary: "clarity", secondary: "novelty", ally: "robustness", tags: ["interpretability", "analysis", "error"] },
];

const TACTICS = [
  { id: "desk-audit", zh: "案头审计", en: "Desk Audit", category: "rigor", rarity: "common" },
  { id: "pilot", zh: "最小试验", en: "Minimum Pilot", category: "experiment", rarity: "common" },
  { id: "stress", zh: "对抗压力测", en: "Adversarial Stress Test", category: "experiment", rarity: "uncommon" },
  { id: "triangulate", zh: "三角验证", en: "Triangulation", category: "experiment", rarity: "rare" },
  { id: "story-surgery", zh: "叙事手术", en: "Narrative Surgery", category: "writing", rarity: "common" },
  { id: "reviewer-map", zh: "审稿人地图", en: "Reviewer Map", category: "writing", rarity: "uncommon" },
  { id: "ledger", zh: "证据总账", en: "Evidence Ledger", category: "rigor", rarity: "uncommon" },
  { id: "capsule", zh: "复现胶囊", en: "Reproduction Capsule", category: "rigor", rarity: "rare" },
  { id: "office-hours", zh: "专家门诊", en: "Expert Office Hours", category: "support", rarity: "uncommon" },
  { id: "registered-bet", zh: "预注册赌约", en: "Registered Bet", category: "support", rarity: "rare" },
  { id: "shortcut", zh: "漂亮捷径", en: "Seductive Shortcut", category: "questionable", rarity: "rare" },
] as const satisfies ReadonlyArray<{ id: string; zh: string; en: string; category: CardCategory; rarity: CardRarity }>;

function stats(primary: Metric, amount: number, secondary?: Metric, secondAmount = 0): Partial<PaperStats> {
  const value: Partial<PaperStats> = { [primary]: amount };
  if (secondary && secondAmount) value[secondary] = (value[secondary] ?? 0) + secondAmount;
  return value;
}

function cardBase(topic: ResearchTopic, tactic: (typeof TACTICS)[number]): Pick<CardDef, "id" | "name" | "en" | "category" | "rarity" | "tags"> {
  return {
    id: `grand-card-${topic.slug}-${tactic.id}`,
    name: `${topic.zh}·${tactic.zh}`,
    en: `${topic.en}: ${tactic.en}`,
    category: tactic.category,
    rarity: tactic.rarity,
    tags: [...topic.tags, tactic.id, tactic.category],
  };
}

function buildCard(topic: ResearchTopic, tactic: (typeof TACTICS)[number], topicIndex: number): CardDef {
  const base = cardBase(topic, tactic);
  switch (tactic.id) {
    case "desk-audit":
      return { ...base, flavor: `不先开 GPU，先问${topic.doubtZh}。你用红笔把每一个默认值圈成嫌疑人。`, flavorEn: `Before touching a GPU, ask whether ${topic.doubtEn}. Every default value becomes a suspect in red ink.`, rules: `${topic.zh} +2、可复现性 +1、风险 -3；获得 1 点审计轨迹。`, rulesEn: `Provides 2 ${topic.en}; Reproducibility +1 and Risk -3; gain 1 Audit Trail.`, focus: 1, delta: { stats: { reproducibility: 1 }, risk: -3 }, answer: 1, condition: { auditTrail: 1 }, provides: { [topic.capability]: 2, dataIntegrity: 1 } };
    case "pilot":
      return { ...base, flavor: `只取一小块数据检验${topic.objectZh}。结果不够发表，却足够阻止你浪费周末。`, flavorEn: `Test ${topic.objectEn} on a tiny slice. It cannot be published, but it can save the weekend.`, rules: `${topic.zh} +2、核心属性 +1；若上一张是严谨牌，额外 +1 回应。`, rulesEn: `Provides 2 ${topic.en}; primary stat +1. Combo after Rigor: +1 Response.`, focus: 1, gpu: topicIndex % 3 === 0 ? 0 : 1, delta: { stats: stats(topic.primary, 1) }, answer: 1, comboAfter: "rigor", comboAnswer: 1, provides: { [topic.capability]: 2 } };
    case "stress":
      return { ...base, flavor: `把${topic.objectZh}放进最不友善的条件里。第一个崩溃的是假设，第二个才是代码。`, flavorEn: `Put ${topic.objectEn} under the least friendly conditions. The assumption fails before the code.`, rules: `核心属性 +2、次要属性 +1；${topic.zh} +3、${topic.ally} +1。`, rulesEn: `Primary stat +2, secondary stat +1; provides 3 ${topic.en} and 1 allied capability.`, focus: 2, gpu: 2 + (topicIndex % 2), delta: { stats: stats(topic.primary, 2, topic.secondary, 1) }, answer: 2, provides: { [topic.capability]: 3, [topic.ally]: 1 } };
    case "triangulate":
      return { ...base, flavor: `让三种互不信任的方法检查${topic.objectZh}。它们难得在同一个误差条里达成共识。`, flavorEn: `Ask three mutually suspicious methods to inspect ${topic.objectEn}. They reluctantly agree inside one error bar.`, rules: `核心属性 +3、次要属性 +2；${topic.zh} +4、盟友能力 +2。本日耗尽。`, rulesEn: `Primary stat +3, secondary stat +2; provides 4 ${topic.en} and 2 allied capability. Exhaust.`, focus: 3, gpu: 3, funding: topicIndex % 4 === 0 ? 2 : 1, delta: { stats: stats(topic.primary, 3, topic.secondary, 2) }, answer: 3, exhaust: true, provides: { [topic.capability]: 4, [topic.ally]: 2 } };
    case "story-surgery":
      return { ...base, flavor: `你删掉三段“显然”，让${topic.objectZh}第一次成为可检查的论证，而不是摘要里的愿望。`, flavorEn: `Delete three instances of “clearly” so ${topic.objectEn} becomes a testable argument rather than an abstract's wish.`, rules: `清晰度 +2、${topic.zh} +2；当前意见难度 -1。`, rulesEn: `Clarity +2, provides 2 ${topic.en}, and current issue difficulty -1.`, focus: 1, mental: topicIndex % 6 === 0 ? 1 : undefined, delta: { stats: { clarity: 2 } }, answer: 1, shrinkIssue: 1, provides: { [topic.capability]: 2, claimFraming: 1 } };
    case "reviewer-map":
      return { ...base, flavor: `把“我不信”拆成关于${topic.objectZh}的三项可验证担忧，再给每项标出页码。`, flavorEn: `Turn “I am unconvinced” into three testable concerns about ${topic.objectEn}, each with a page number.`, rules: `清晰度 +2；${topic.zh}与逐点回复各 +2。实验牌后打出额外 +2 回应；保留。`, rulesEn: `Clarity +2; provides 2 ${topic.en} and response writing. Combo after Experiment: +2 Response. Retain.`, focus: 1, delta: { stats: { clarity: 2 } }, answer: 2, comboAfter: "experiment", comboAnswer: 2, retain: true, provides: { [topic.capability]: 2, responseWriting: 2 } };
    case "ledger":
      return { ...base, flavor: `在${topic.artifactZh}里记下成功、失败和半成功。最尴尬的那一行通常最有解释力。`, flavorEn: `Record wins, failures, and half-wins in the ${topic.artifactEn}. The embarrassing row explains the most.`, rules: `复现 +2、核心属性 +1、风险 -5；${topic.zh} +3、审计轨迹 +1。`, rulesEn: `Reproducibility +2, primary stat +1, Risk -5; provides 3 ${topic.en} and 1 Audit Trail.`, focus: 1, delta: { stats: { ...stats(topic.primary, 1), reproducibility: (topic.primary === "reproducibility" ? 3 : 2) }, risk: -5 }, answer: 2, condition: { auditTrail: 1 }, provides: { [topic.capability]: 3, reproducibility: 1 } };
    case "capsule":
      return { ...base, flavor: `把${topic.artifactZh}交给一台从没见过你的电脑。它失败两次，第三次没有靠你的 shell 历史。`, flavorEn: `Give the ${topic.artifactEn} to a machine that has never met you. On attempt three, it runs without your shell history.`, rules: `复现 +3、清晰 +1、风险 -6；${topic.zh} +3、代码发布 +2，技术债 -1。`, rulesEn: `Reproducibility +3, Clarity +1, Risk -6; provides 3 ${topic.en}, 2 code release; Technical Debt -1.`, focus: 2, funding: 1, delta: { stats: { reproducibility: 3, clarity: 1 }, risk: -6 }, answer: 2, condition: { technicalDebt: -1, auditTrail: 1 }, provides: { [topic.capability]: 3, codeRelease: 2 } };
    case "office-hours":
      return { ...base, flavor: `真正懂${topic.objectZh}的人看了五分钟，指出你盯了五天也没看见的假设。`, flavorEn: `Someone who understands ${topic.objectEn} finds in five minutes the assumption you missed for five days.`, rules: `精神 +3、核心属性 +1；${topic.zh} +2、洞见 +1。`, rulesEn: `Mental Health +3, primary stat +1; provides 2 ${topic.en} and gain 1 Insight.`, focus: 1, funding: topicIndex % 5 === 0 ? 1 : undefined, delta: { mental: 3, stats: stats(topic.primary, 1) }, answer: 1, condition: { insight: 1 }, provides: { [topic.capability]: 2, documentation: 1 } };
    case "registered-bet":
      return { ...base, flavor: `在看到数字前，把关于${topic.objectZh}的判断写进带时间戳的文件。未来的你失去了狡辩空间。`, flavorEn: `Write the judgment about ${topic.objectEn} into a timestamped file before seeing numbers. Future-you loses room to improvise.`, rules: `复现 +3、风险 -7；${topic.zh}与实验协议各 +3。若上一张是写作牌，额外 +2 回应。`, rulesEn: `Reproducibility +3, Risk -7; provides 3 ${topic.en} and protocol. Combo after Writing: +2 Response.`, focus: 2, delta: { stats: { reproducibility: 3 }, risk: -7 }, answer: 2, comboAfter: "writing", comboAnswer: 2, condition: { auditTrail: 2 }, provides: { [topic.capability]: 3, protocol: 3 } };
    case "shortcut": {
      const risk = 13 + (topicIndex % 4) * 3;
      return { ...base, flavor: `只展示${topic.objectZh}最合作的一面。Figure 3 变漂亮了，研究诚信办公室的剪影也更清楚了。`, flavorEn: `Show only the cooperative side of ${topic.objectEn}. Figure 3 improves; so does the silhouette of the integrity office.`, rules: `核心属性 +3、回应 +3、${topic.zh} +3；风险 +${risk}、技术债 +2。`, rulesEn: `Primary stat +3, +3 Response, provides 3 ${topic.en}; Risk +${risk}, Technical Debt +2.`, focus: 0, risk, delta: { stats: stats(topic.primary, 3) }, answer: 3, exhaust: topicIndex % 2 === 0, condition: { technicalDebt: 2 }, provides: { [topic.capability]: 3 } };
    }
  }
}

export const GRAND_CARDS: CardDef[] = TOPICS.flatMap((topic, topicIndex) =>
  TACTICS.map((tactic) => buildCard(topic, tactic, topicIndex)),
);

export interface GrandDialogueBeat {
  speaker: string;
  speakerEn: string;
  text: string;
  textEn: string;
}

export interface GrandEventDef extends EventDef {
  /** Revealed sequentially before the choice panel in story-capable clients. */
  dialogue: [GrandDialogueBeat, ...GrandDialogueBeat[]];
  /** Signals that choice hints must not reveal resource deltas before resolution. */
  hiddenOutcome: true;
  timelineTag: string;
  timelineTagEn: string;
}

interface Incident {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
}

interface ChoicePlan {
  id: string;
  label: string;
  labelEn: string;
  result: string;
  resultEn: string;
  delta: Delta;
  effect?: EventEffect;
}

interface EventFamily {
  id: string;
  icon: string;
  timelineTag: string;
  timelineTagEn: string;
  speaker: string;
  speakerEn: string;
  opening: string;
  openingEn: string;
  reply: string;
  replyEn: string;
  choices: [ChoicePlan, ChoicePlan, ChoicePlan];
  incidents: [Incident, Incident, Incident, Incident, Incident, Incident, Incident, Incident];
}

const hiddenHint = "后果将在事件结束后揭晓";
const hiddenHintEn = "Consequences revealed after the event";

function choice(eventId: string, plan: ChoicePlan, incident: Incident): EventChoice {
  return {
    id: `${eventId}:${plan.id}`,
    label: plan.label,
    labelEn: plan.labelEn,
    hint: hiddenHint,
    hintEn: hiddenHintEn,
    result: `${incident.title}之后，${plan.result}`,
    resultEn: `After ${incident.titleEn}, ${plan.resultEn}`,
    delta: plan.delta,
    effect: plan.effect,
  };
}

const FAMILIES: EventFamily[] = [
  {
    id: "power", icon: "⚡", timelineTag: "基础设施", timelineTagEn: "Infrastructure", speaker: "设施值班员", speakerEn: "Facilities", opening: "“先别问实验，先确认有没有东西在冒烟。”", openingEn: "“Before the experiment: is anything smoking?”", reply: "你看向服务器，服务器用蜂鸣声拒绝评论。", replyEn: "You look at the server. It declines comment by beeping.",
    choices: [
      { id: "save", label: "启动应急保存", labelEn: "Start emergency checkpointing", result: "最后一个 checkpoint 活了下来，并要求在致谢里占一行。", resultEn: "the last checkpoint survives and requests a line in Acknowledgements.", delta: { gpu: -2, stats: { reproducibility: 3 } }, effect: { conditions: { infrastructureDown: 1, auditTrail: 1 } } },
      { id: "generator", label: "租一台应急发电机", labelEn: "Rent an emergency generator", result: "实验楼重新有电，项目经费开始闪烁。", resultEn: "the lab regains power and the project budget starts flickering.", delta: { funding: -3, gpu: 4 }, effect: { conditions: { infrastructureDown: -2 } } },
      { id: "walk", label: "拔插头，去看天光", labelEn: "Unplug and see daylight", result: "没有新结果，但研究者本人成功重启。", resultEn: "no result is produced, but the researcher reboots successfully.", delta: { days: -1, mental: 6 }, effect: { conditions: { infrastructureDown: 2, caffeine: -1 } } },
    ],
    incidents: [
      { id: "blackout", title: "实验楼全层断电", titleEn: "The Entire Lab Floor Loses Power", description: "走廊瞬间安静，UPS 像一群知道截止日期的蟋蟀同时报警。", descriptionEn: "The corridor goes silent; every UPS chirps like a cricket aware of the deadline." },
      { id: "ups-nine", title: "UPS 只剩九分钟", titleEn: "Nine Minutes Remain on the UPS", description: "训练界面写着十一分钟完成。数学第一次显得带有私人恩怨。", descriptionEn: "Training says eleven minutes remaining. Mathematics suddenly feels personal." },
      { id: "cooling", title: "机房制冷停摆", titleEn: "Server-Room Cooling Stops", description: "GPU 温度和群聊情绪同步上升，只有损失函数还在缓慢下降。", descriptionEn: "GPU temperature and group-chat tension rise together; only the loss keeps falling." },
      { id: "inspection", title: "校园电路突击检查", titleEn: "Surprise Electrical Inspection", description: "通知给了十五分钟保存一切，包括一台没人承认拥有的旧工作站。", descriptionEn: "The notice gives fifteen minutes to save everything, including an old workstation nobody owns." },
      { id: "brownout", title: "凌晨电压像审稿意见一样波动", titleEn: "A Reviewer-Shaped Brownout", description: "三个任务活了下来，四个任务消失了，还有一个开始输出 NaN。", descriptionEn: "Three jobs survive, four vanish, and one begins producing NaN." },
      { id: "drill", title: "停电演练非常成功", titleEn: "The Power Drill Is a Great Success", description: "演练目标全部完成；实验目标全部没有。", descriptionEn: "Every drill objective is met; every experimental objective is not." },
      { id: "breaker", title: "有人把烤箱接在 GPU 回路上", titleEn: "Someone Plugs an Oven into the GPU Circuit", description: "午餐加热到一半，整个消融实验获得了热启动。", descriptionEn: "Halfway through lunch, the entire ablation study receives a thermal restart." },
      { id: "lightning", title: "雷暴选择了你的最后一个 Epoch", titleEn: "Lightning Chooses Your Final Epoch", description: "窗外一闪，屏幕一黑，导师在群里问“有备份吧？”", descriptionEn: "The sky flashes, the screen dies, and your advisor types: “We have backups, right?”" },
    ],
  },
  {
    id: "server", icon: "▣", timelineTag: "集群日志", timelineTagEn: "Cluster Log", speaker: "集群管理员", speakerEn: "Cluster Admin", opening: "“这是计划内维护，计划发在大家都自动归档的邮件列表里。”", openingEn: "“This was scheduled in the mailing list everyone auto-archives.”", reply: "你问恢复时间。对方发来一张没有横轴单位的图。", replyEn: "You ask for an ETA. They send a chart whose x-axis has no unit.",
    choices: [
      { id: "repair", label: "留下来协助排障", labelEn: "Stay and help debug", result: "你修好一个挂载点，也理解了为什么它从未写进文档。", resultEn: "you fix a mount point and learn why it was never documented.", delta: { mental: -2, stats: { reproducibility: 3 } }, effect: { conditions: { technicalDebt: -2, infrastructureDown: -1 } } },
      { id: "cloud", label: "把关键作业迁到云上", labelEn: "Move critical jobs to the cloud", result: "实验继续，账单也用同样的学习率继续。", resultEn: "the experiment continues, and so does the invoice at the same learning rate.", delta: { funding: -4, gpu: 6 }, effect: { conditions: { queueDelay: -2 } } },
      { id: "docs", label: "趁停机补齐复现文档", labelEn: "Document while the cluster is down", result: "README 长了两页，排队长度一格没动。", resultEn: "the README grows by two pages; the queue does not move.", delta: { stats: { clarity: 2, reproducibility: 2 }, days: -1 }, effect: { conditions: { infrastructureDown: 2, auditTrail: 1 } } },
    ],
    incidents: [
      { id: "maintenance", title: "服务器进入计划维修", titleEn: "Scheduled Server Maintenance Begins", description: "三周前的通知邮件终于在截止日前一天体现出预测价值。", descriptionEn: "A three-week-old notice finally shows predictive value one day before the deadline." },
      { id: "login-reboot", title: "登录节点重启", titleEn: "The Login Node Reboots", description: "你的 tmux 会话结束了这段关系，没有留下审稿意见。", descriptionEn: "Your tmux session ends the relationship without reviewer comments." },
      { id: "storage-move", title: "共享盘正在迁移", titleEn: "Shared Storage Is Migrating", description: "数据在搬家，实验在原地，截止日拒绝参与协调。", descriptionEn: "Data move, experiments wait, and the deadline declines mediation." },
      { id: "certificate", title: "集群证书午夜过期", titleEn: "The Cluster Certificate Expires at Midnight", description: "所有节点都在线，但没有一台机器被允许相信另一台。", descriptionEn: "Every node is online, but no machine is allowed to trust another." },
      { id: "kernel", title: "强制内核升级", titleEn: "Mandatory Kernel Upgrade", description: "驱动、CUDA 与现实停止兼容，Release Notes 表示这是改进。", descriptionEn: "Drivers, CUDA, and reality stop agreeing; release notes call it an improvement." },
      { id: "readonly", title: "共享文件系统变成只读", titleEn: "The Shared Filesystem Turns Read-Only", description: "模型仍然可以推理，磁盘决定不再表达意见。", descriptionEn: "The model can infer; the disk decides not to express itself." },
      { id: "quota", title: "你的 inode 配额归零", titleEn: "Your Inode Quota Reaches Zero", description: "空间还有两 TB，但四十万个空日志文件赢得了所有权。", descriptionEn: "Two terabytes remain; four hundred thousand empty logs have claimed them." },
      { id: "scheduler", title: "调度器认为今天是 1970 年", titleEn: "The Scheduler Thinks It Is 1970", description: "任务优先级经过五十六年等待后获得了理论优势。", descriptionEn: "After fifty-six years of waiting, your job gains a theoretical priority advantage." },
    ],
  },
  {
    id: "advisor", icon: "✦", timelineTag: "导师批注", timelineTagEn: "Advisor Notes", speaker: "导师", speakerEn: "Advisor", opening: "“总体很好。我只有一个结构性小建议。”", openingEn: "“Overall, very good. I have one small structural suggestion.”", reply: "屏幕共享里，整篇论文被选中了。", replyEn: "In screen share, the entire manuscript becomes highlighted.",
    choices: [
      { id: "embrace", label: "认真重构论文主线", labelEn: "Rebuild the paper's argument", result: "文件名来到 final_final_story_3，但读者终于知道论文在说什么。", resultEn: "the file reaches final_final_story_3, but readers finally know what the paper says.", delta: { mental: -3, stats: { novelty: 3, clarity: 3 } }, effect: { conditions: { advisorPressure: -1, coauthorTrust: 1 } } },
      { id: "negotiate", label: "带着证据谈判范围", labelEn: "Negotiate scope with evidence", result: "十二项修改变成五项；这在学术上算重大胜利。", resultEn: "twelve edits become five, which counts as a major academic victory.", delta: { stats: { clarity: 2, evidence: 1 } }, effect: { conditions: { advisorPressure: 1, reviewerFavor: 1 } } },
      { id: "cosmetic", label: "只改标题和摘要", labelEn: "Change only title and abstract", result: "论文看起来转向了，方法章节仍站在原地。", resultEn: "the paper appears to pivot while Methods remains exactly where it was.", delta: { stats: { novelty: 2 }, risk: 7 }, effect: { conditions: { advisorPressure: 2, technicalDebt: 1 } } },
    ],
    incidents: [
      { id: "rewrite", title: "导师决定重写整篇故事", titleEn: "The Advisor Rewrites the Entire Story", description: "“方法不动，只换一个角度。”这个角度覆盖标题、摘要、结果和讨论。", descriptionEn: "“The method stays; just change the angle.” The angle covers title, abstract, results, and discussion." },
      { id: "title", title: "午夜十一点的新标题", titleEn: "A New Title at 11 P.M.", description: "标题改了七个词，其中六个要求摘要重新诚实一次。", descriptionEn: "Seven title words change; six require the abstract to become honest again." },
      { id: "clinical", title: "导师刚参加完临床会议", titleEn: "The Advisor Returns from a Clinical Meeting", description: "架构图旁出现一名简笔画患者，贡献列表开始紧张。", descriptionEn: "A stick-figure patient appears beside the architecture; the contribution list gets nervous." },
      { id: "theory", title: "导师突然需要理论保证", titleEn: "The Advisor Suddenly Needs a Theorem", description: "“加一个收敛证明应该不难吧？”白板选择保持沉默。", descriptionEn: "“A convergence proof should be quick, right?” The whiteboard remains silent." },
      { id: "causal", title: "导师发现了因果推断", titleEn: "The Advisor Discovers Causal Inference", description: "一张 DAG 被贴到模型图旁边，所有箭头开始接受身份审查。", descriptionEn: "A DAG is placed beside the model; every arrow undergoes an identity check." },
      { id: "simplify-expand", title: "请同时简化并扩展", titleEn: "Please Simplify and Expand", description: "两个要求单独都很合理，合在一起像 Reviewer #2 的合著作品。", descriptionEn: "Each request is reasonable alone; together they resemble a Reviewer #2 collaboration." },
      { id: "talk", title: "导师用一场报告重新理解了论文", titleEn: "A Talk Changes the Advisor's View of the Paper", description: "报告很成功，因此论文现在必须完全像报告。", descriptionEn: "The talk succeeds, so the manuscript must now become exactly like the talk." },
      { id: "one-more", title: "导师口中的“最后一个实验”", titleEn: "The Advisor's “One Last Experiment”", description: "待办列表新增七行，第一行叫“快速验证”。", descriptionEn: "Seven tasks appear; the first is titled “quick validation.”" },
    ],
  },
  {
    id: "coauthor", icon: "…", timelineTag: "合作者通信", timelineTagEn: "Coauthor Thread", speaker: "合作者", speakerEn: "Coauthor", opening: "“Looks good to me.”", openingEn: "“Looks good to me.”", reply: "附件为空，但语气非常支持。", replyEn: "The attachment is empty, but the tone is supportive.",
    choices: [
      { id: "call", label: "发起十五分钟强制同步", labelEn: "Call a mandatory 15-minute sync", result: "会议持续九十分钟，却真的确定了谁负责 Figure 4。", resultEn: "the meeting lasts ninety minutes but finally assigns Figure 4.", delta: { mental: -2, stats: { clarity: 3 } }, effect: { conditions: { coauthorTrust: 2, advisorPressure: -1 } } },
      { id: "own", label: "接管全部修改", labelEn: "Take over every edit", result: "你终于知道每一段是谁写的：现在全是你。", resultEn: "you finally know who wrote every paragraph: now it is you.", delta: { mental: -4, stats: { clarity: 4 } }, effect: { conditions: { coauthorTrust: -1 } } },
      { id: "boundary", label: "明确分工并保留边界", labelEn: "Set boundaries and ownership", result: "修改慢了一点，但群聊第一次出现了完成标记。", resultEn: "edits slow down, but checkmarks appear in the group chat for the first time.", delta: { mental: 3, stats: { reproducibility: 1 } }, effect: { conditions: { coauthorTrust: 3 } } },
    ],
    incidents: [
      { id: "missing", title: "合作者在收到草稿后失联", titleEn: "A Coauthor Vanishes After Receiving the Draft", description: "最后上线时间恰好是你发送 rebuttal 前一分钟。", descriptionEn: "Their last-seen time is one minute before you sent the rebuttal." },
      { id: "vacation", title: "自动回复：正在休假", titleEn: "Auto-Reply: On Vacation", description: "返回日期是截止日后的第二天，邮件末尾祝你工作顺利。", descriptionEn: "They return two days after the deadline and wish you a productive week." },
      { id: "timezone", title: "跨时区接力失败", titleEn: "The Time-Zone Relay Fails", description: "你醒着时对方睡着；对方醒着时你的 GPU 在 OOM。", descriptionEn: "They sleep while you work; your GPU runs OOM while they work." },
      { id: "empty-track", title: "修订记录里没有修订", titleEn: "Track Changes Contains No Changes", description: "文件名写着 revised_v4，哈希值礼貌地不同意。", descriptionEn: "The file says revised_v4; its checksum politely disagrees." },
      { id: "meeting", title: "所有人都错过了同一场会议", titleEn: "Everyone Misses the Same Meeting", description: "会议纪要只有一句：等人齐了再讨论。", descriptionEn: "The minutes contain one sentence: discuss when everyone is present." },
      { id: "signature", title: "最后一位作者没有确认投稿", titleEn: "The Final Author Has Not Confirmed Submission", description: "系统里的红点比任何 p 值都更显著。", descriptionEn: "The portal's red dot is more significant than any p-value." },
      { id: "conflict", title: "两位合作者修改了同一句话", titleEn: "Two Coauthors Edit the Same Sentence", description: "一个要求更大胆，另一个要求更保守，Git 要求你做人。", descriptionEn: "One wants bolder, one safer; Git asks you to choose a person." },
      { id: "author-order", title: "截止前夜讨论作者顺序", titleEn: "Authorship Order, the Night Before Deadline", description: "实验全部完成，真正的多目标优化现在才开始。", descriptionEn: "Experiments are done; the real multi-objective optimization begins." },
    ],
  },
  {
    id: "data", icon: "◇", timelineTag: "数据谱系", timelineTagEn: "Data Provenance", speaker: "数据管理员", speakerEn: "Data Steward", opening: "“这个版本应该和去年一样。”", openingEn: "“This version should be the same as last year's.”", reply: "两个同名压缩包给出了不同答案。", replyEn: "Two identically named archives give different answers.",
    choices: [
      { id: "audit", label: "冻结数据并逐项审计", labelEn: "Freeze and audit the data", result: "样本少了一些，结论却第一次有了身份证。", resultEn: "the sample shrinks, but the conclusion receives an identity card.", delta: { gpu: -2, stats: { evidence: -1, reproducibility: 4 }, risk: -8 }, effect: { conditions: { auditTrail: 2, technicalDebt: -1 } } },
      { id: "replace", label: "换用可追溯公开版本", labelEn: "Use a traceable public version", result: "最好看的数字离开了，任何人都能复验的数字留下了。", resultEn: "the prettiest number leaves; the reproducible one stays.", delta: { stats: { evidence: -2, reproducibility: 5 }, risk: -5 }, effect: { conditions: { auditTrail: 2 } } },
      { id: "ignore", label: "继续使用旧缓存", labelEn: "Keep the old cached copy", result: "表格没有改变，撤稿风险替它完成了更新。", resultEn: "the table does not change; Retraction Risk updates on its behalf.", delta: { stats: { evidence: 2 }, risk: 16 }, effect: { conditions: { technicalDebt: 3 } } },
    ],
    incidents: [
      { id: "checksum", title: "数据校验和不一致", titleEn: "Dataset Checksums Disagree", description: "两个同名压缩包产生两张不同的主结果表。", descriptionEn: "Two identically named archives produce different main tables." },
      { id: "duplicates", title: "训练集里发现测试患者", titleEn: "Test Patients Appear in Training", description: "他们不仅见过面，还共享了增强后的自拍。", descriptionEn: "They have not only met; they share augmented selfies." },
      { id: "labels", title: "专家重新修订标签", titleEn: "Experts Revise the Labels", description: "共识更新了，Table 1 仍活在旧世界。", descriptionEn: "Consensus changes; Table 1 remains in the old world." },
      { id: "schema", title: "数据供应方修改字段类型", titleEn: "The Provider Changes the Schema", description: "age 变成字符串，unknown 变成浮点数，代码选择沉思。", descriptionEn: "Age becomes text, unknown becomes float, and the code contemplates life." },
      { id: "leak", title: "辅助文件泄漏测试答案", titleEn: "A Helper File Leaks Test Labels", description: "它比 README 更乐于助人，也更可能出现在审计报告里。", descriptionEn: "It is more helpful than the README and more likely to appear in an audit." },
      { id: "mirror", title: "数据镜像同时返回 404", titleEn: "Every Dataset Mirror Returns 404", description: "论文写着“公开可得”，互联网礼貌地要求证据。", descriptionEn: "The paper says “publicly available”; the internet politely requests evidence." },
      { id: "consent", title: "一批样本缺少同意记录", titleEn: "A Batch Lacks Consent Records", description: "文件夹里有扫描件、草稿和一份无法打开的最终版。", descriptionEn: "The folder contains scans, drafts, and one unreadable final version." },
      { id: "timezone", title: "时间戳跨了两个时区", titleEn: "Timestamps Cross Two Time Zones", description: "未来的样本正在预测过去，AUC 表现非常优秀。", descriptionEn: "Future samples predict the past with excellent AUC." },
    ],
  },
  {
    id: "compute", icon: "▰", timelineTag: "算力排队", timelineTagEn: "Compute Queue", speaker: "调度器", speakerEn: "Scheduler", opening: "“预计等待时间：47 小时。”", openingEn: "“Estimated wait: 47 hours.”", reply: "截止时间：46 小时。机器没有显示同情字段。", replyEn: "Deadline: 46 hours. The scheduler exposes no sympathy field.",
    choices: [
      { id: "optimize", label: "改写为省算力方案", labelEn: "Rewrite for a smaller budget", result: "模型小了一半，分数只少第三位小数，骄傲少得更多。", resultEn: "the model halves in size, loses only its third decimal, and costs considerably less pride.", delta: { gpu: 4, stats: { novelty: -1, reproducibility: 3 } }, effect: { conditions: { queueDelay: -2 } } },
      { id: "rent", label: "刷卡租临时 GPU", labelEn: "Rent emergency GPUs", result: "进度条开始移动，财务系统开始写审稿意见。", resultEn: "the progress bar moves and Finance begins peer review.", delta: { funding: -4, gpu: 7 }, effect: { conditions: { queueDelay: -2 } } },
      { id: "queue", label: "排队并整理旧结果", labelEn: "Queue and curate old results", result: "你没跑出新数字，却发现两张足以回答审稿人的旧图。", resultEn: "you run no new numbers but find two old figures that answer the reviewer.", delta: { days: -1, mental: 2, stats: { clarity: 2 } }, effect: { conditions: { queueDelay: 2, insight: 1 } } },
    ],
    incidents: [
      { id: "forty-seven", title: "预计排队四十七小时", titleEn: "Estimated Queue Time: Forty-Seven Hours", description: "你前面的作业名叫 final_final_v19，显然大家都很接近完成。", descriptionEn: "The job ahead is final_final_v19; clearly everyone is nearly done." },
      { id: "preempted", title: "最后一个 Epoch 被抢占", titleEn: "The Final Epoch Is Preempted", description: "高优先级用户在最具戏剧性的时刻发现了这张卡。", descriptionEn: "A high-priority user discovers the cluster at the most dramatic moment." },
      { id: "a100", title: "A100 被“临时”调走", titleEn: "The A100 Is “Temporarily” Reassigned", description: "在集群管理语境里，“临时”是一个没有结束日期的分布。", descriptionEn: "In cluster administration, “temporary” is a distribution without an end date." },
      { id: "credits", title: "云额度在午夜过期", titleEn: "Cloud Credits Expire at Midnight", description: "训练预计 00:07 完成，账单预计永远被导师记住。", descriptionEn: "Training ends at 00:07; your advisor remembers the invoice forever." },
      { id: "driver", title: "驱动与 CUDA 宣布分手", titleEn: "CUDA and the Driver Break Up", description: "容器理解两边，宿主机决定不站队。", descriptionEn: "The container understands both; the host refuses to take sides." },
      { id: "sweep", title: "参数扫描发现隐藏维度", titleEn: "The Sweep Finds a Hidden Dimension", description: "最后一维原来连续、无界，而且由一个拼写错误创建。", descriptionEn: "The last dimension is continuous, unbounded, and created by a typo." },
      { id: "oom", title: "OOM 出现在最佳配置", titleEn: "OOM Finds the Best Configuration", description: "验证分数达到新高，显存则达到物理边界。", descriptionEn: "Validation reaches a new high; memory reaches a physical limit." },
      { id: "zombie", title: "僵尸任务占满八张卡", titleEn: "Zombie Jobs Occupy Eight GPUs", description: "作业没有主人、没有输出、但拥有稳定的资源分配。", descriptionEn: "The jobs have no owner or output, only excellent resource allocation." },
    ],
  },
  {
    id: "statistics", icon: "Σ", timelineTag: "分析日志", timelineTagEn: "Analysis Log", speaker: "统计顾问", speakerEn: "Statistician", opening: "“先把所有分析决定按时间顺序告诉我。”", openingEn: "“First, list every analysis decision in chronological order.”", reply: "你打开文件夹 final_stats_REAL，这次沉默轮到你。", replyEn: "You open final_stats_REAL. This time, you are silent.",
    choices: [
      { id: "reanalyze", label: "按正式计划重做分析", labelEn: "Reanalyze under a formal plan", result: "两个星号消失了，结论却第一次不依赖星号。", resultEn: "two stars vanish, yet the conclusion no longer depends on stars.", delta: { funding: -2, stats: { evidence: 2, reproducibility: 4 }, risk: -6 }, effect: { conditions: { auditTrail: 2 } } },
      { id: "report", label: "完整报告不确定性", labelEn: "Report uncertainty in full", result: "图变得没那么漂亮，编辑的信任变得更具体。", resultEn: "the figure becomes less pretty and the editor's trust more tangible.", delta: { stats: { evidence: -1, clarity: 2, reproducibility: 3 }, risk: -8 }, effect: { conditions: { reviewerFavor: 2 } } },
      { id: "retune", label: "让随机种子再解释一次", labelEn: "Let another seed explain it", result: "数字更好，原因更模糊，风险条最有统计显著性。", resultEn: "the number improves, the reason blurs, and Risk becomes highly significant.", delta: { gpu: -3, stats: { evidence: 3 }, risk: 15 }, effect: { conditions: { technicalDebt: 2 } } },
    ],
    incidents: [
      { id: "p051", title: "p = 0.051", titleEn: "p = 0.051", description: "它距离显著只差一次不诚实决定，距离诚实结论只差一段讨论。", descriptionEn: "It is one dishonest decision from significance and one honest paragraph from usefulness." },
      { id: "ci-zero", title: "置信区间跨过零", titleEn: "The Confidence Interval Crosses Zero", description: "均值指向胜利，误差条保持开放态度。", descriptionEn: "The mean points toward victory; the interval remains open-minded." },
      { id: "fold-zero", title: "一个 Fold 的 Sensitivity 为零", titleEn: "One Fold Has Zero Sensitivity", description: "平均值还能看，那个零却坐在表格正中央看你。", descriptionEn: "The mean survives; the zero sits in the middle of the table and watches you." },
      { id: "reversal", title: "控制协变量后效应反转", titleEn: "The Effect Reverses After Adjustment", description: "因果箭头完成掉头，并拒绝解释转向灯。", descriptionEn: "The causal arrow makes a U-turn without signaling." },
      { id: "subgroup", title: "两个亚组给出相反结论", titleEn: "Subgroups Tell Opposite Stories", description: "总体平均在中间调解，双方都不接受。", descriptionEn: "The aggregate mean mediates; neither subgroup accepts." },
      { id: "correction", title: "多重校正带走全部星号", titleEn: "Multiplicity Correction Removes Every Star", description: "数据仍在，星空不在，标题需要适应白天。", descriptionEn: "The data remain, the stars do not, and the title must adapt to daylight." },
      { id: "missingness", title: "缺失机制并非随机", titleEn: "Missingness Is Not at Random", description: "缺失数据终于出现，只为了说明它为何不出现。", descriptionEn: "The missing data appear only to explain why they are absent." },
      { id: "bootstrap", title: "Bootstrap 分布长出两座山", titleEn: "The Bootstrap Distribution Grows Two Peaks", description: "点估计站在山谷里，假装两边都是同一座山。", descriptionEn: "The point estimate stands in the valley and calls both peaks one mountain." },
    ],
  },
  {
    id: "venue", icon: "Aa", timelineTag: "投稿系统", timelineTagEn: "Submission Portal", speaker: "投稿系统", speakerEn: "Submission Portal", opening: "“您的文件几乎符合要求。”", openingEn: "“Your files almost meet the requirements.”", reply: "“几乎”被标成红色，而且没有帮助链接。", replyEn: "“Almost” appears in red and has no help link.",
    choices: [
      { id: "automate", label: "写脚本逐项检查", labelEn: "Automate every compliance check", result: "这次格式焦虑可以稳定复现，也可以稳定消除。", resultEn: "formatting anxiety becomes reproducible and, finally, removable.", delta: { focus: -1, stats: { clarity: 4, reproducibility: 2 } }, effect: { conditions: { pageDebt: -3, auditTrail: 1 } } },
      { id: "editor", label: "礼貌请求编辑澄清", labelEn: "Ask the editor for clarification", result: "编辑回复一句人类语言，胜过系统的二十个错误码。", resultEn: "one sentence of human language beats twenty portal error codes.", delta: { mental: -1, stats: { clarity: 2 } }, effect: { conditions: { reviewerFavor: 2 } } },
      { id: "compress", label: "用八号字强行通过", labelEn: "Force it through in 8-point type", result: "系统绿了，读者视力和风险条红了。", resultEn: "the portal turns green; readers' eyesight and Risk turn red.", delta: { stats: { clarity: -2 }, risk: 9 }, effect: { conditions: { pageDebt: 2 } } },
    ],
    incidents: [
      { id: "table", title: "Table 3 超出双栏四毫米", titleEn: "Table 3 Exceeds Two Columns by Four Millimeters", description: "四个月实验被四毫米挡在提交按钮外。", descriptionEn: "Four months of experiments are blocked by four millimeters." },
      { id: "font", title: "终稿字体在另一台机器上丢失", titleEn: "The Camera-Ready Font Disappears Elsewhere", description: "你的 PDF 在本机是论文，在编辑部是现代艺术。", descriptionEn: "Your PDF is a paper locally and modern art at the editorial office." },
      { id: "dpi", title: "主图被检测为 72 DPI", titleEn: "The Main Figure Is Detected at 72 DPI", description: "屏幕截图的历史终于追上了你。", descriptionEn: "The long history of screenshots finally catches up." },
      { id: "references", title: "引用编号集体漂移", titleEn: "Reference Numbers Drift Together", description: "引用 12 现在指向海洋生物，相关工作突然跨学科。", descriptionEn: "Reference 12 now cites marine biology; Related Work becomes interdisciplinary." },
      { id: "pages", title: "论文超出页限 1.7 页", titleEn: "The Paper Is 1.7 Pages Over", description: "方法不能删，致谢不敢删，页边距已经没有法律地位。", descriptionEn: "Methods cannot go, acknowledgements are protected, and margins have no legal status." },
      { id: "zip", title: "补充材料只有 thumbs.db 能打开", titleEn: "Only thumbs.db Opens in the Supplement", description: "压缩包忠实保存了错误，同时删除了实验。", descriptionEn: "The archive preserves the error faithfully and removes the experiments." },
      { id: "anonymous", title: "匿名稿里留下实验室网址", titleEn: "The Anonymous Draft Contains the Lab URL", description: "盲审现在只对没有点击超链接的人有效。", descriptionEn: "Double-blind review now works only for people who avoid hyperlinks." },
      { id: "timezone", title: "Anywhere on Earth 不是你以为的时区", titleEn: "Anywhere on Earth Is Not Your Time Zone", description: "投稿系统、日历和你的心率给出三个截止时间。", descriptionEn: "The portal, calendar, and your pulse offer three deadlines." },
    ],
  },
  {
    id: "ethics", icon: "⚖", timelineTag: "伦理记录", timelineTagEn: "Ethics Record", speaker: "伦理秘书", speakerEn: "Ethics Office", opening: "“技术上能做，不是审批类别。”", openingEn: "“Technically possible is not an approval category.”", reply: "你把 demo 窗口关掉，会议里的沉默仍然在线。", replyEn: "You close the demo. The meeting's silence remains online.",
    choices: [
      { id: "amend", label: "正式补充审批与风险说明", labelEn: "File an amendment and risk statement", result: "批准在截止前抵达，方法章节也终于承认现实世界。", resultEn: "approval arrives before deadline and Methods finally acknowledges the real world.", delta: { funding: -1, days: -1, stats: { reproducibility: 4, clarity: 1 }, risk: -12 }, effect: { conditions: { auditTrail: 3 } } },
      { id: "remove", label: "删除超出同意范围的分析", labelEn: "Remove analyses beyond consent", result: "论文短了，责任边界变长并且清楚。", resultEn: "the paper gets shorter and its line of responsibility gets longer and clearer.", delta: { stats: { evidence: -2, clarity: 3 }, risk: -6 }, effect: { conditions: { technicalDebt: -2 } } },
      { id: "defer", label: "先投稿，之后再解释", labelEn: "Submit first, explain later", result: "提交按钮变绿，诚信办公室的地址也变得容易记忆。", resultEn: "the submit button turns green and the integrity office address becomes memorable.", delta: { stats: { evidence: 2 }, risk: 20 }, effect: { conditions: { technicalDebt: 3 } } },
    ],
    incidents: [
      { id: "amendment", title: "伦理审查要求正式补件", titleEn: "The Ethics Board Requests an Amendment", description: "委员会想知道这次二次分析为什么拥有第三个主要终点。", descriptionEn: "The board asks why this secondary analysis has a third primary endpoint." },
      { id: "license", title: "数据许可一夜更新", titleEn: "The Dataset License Changes Overnight", description: "昨天允许研究，今天允许填写申请表。", descriptionEn: "Yesterday it allowed research; today it allows application forms." },
      { id: "consent", title: "模型用途比同意书多两个形容词", titleEn: "The Model Outgrows Its Consent Form", description: "“智能自动临床”没有出现在当年的纸质复印件里。", descriptionEn: "“Intelligent automated clinical” is absent from the old paper form." },
      { id: "sensitive", title: "misc 列里发现敏感人口字段", titleEn: "A Sensitive Field Hides under misc", description: "名字很普通，潜在伤害不是。", descriptionEn: "The column name is ordinary; its potential harm is not." },
      { id: "dual-use", title: "漂亮 Demo 暴露双重用途", titleEn: "A Polished Demo Reveals Dual Use", description: "掌声结束后，有人问了一个你希望更早问的问题。", descriptionEn: "After applause, someone asks a question you wish had come sooner." },
      { id: "deletion", title: "有效的数据删除请求抵达", titleEn: "A Valid Deletion Request Arrives", description: "请求影响一个样本、三个派生表和你全部缓存。", descriptionEn: "It affects one sample, three derived tables, and every cache." },
      { id: "bias", title: "部署模拟显示系统性漏诊", titleEn: "Deployment Simulation Shows Systematic Misses", description: "总体指标优良，受影响亚组不参加总体庆祝。", descriptionEn: "Aggregate metrics are excellent; the affected subgroup declines to celebrate." },
      { id: "approval-number", title: "伦理批准号少了一位数字", titleEn: "The Approval Number Is One Digit Short", description: "研究合法，脚注可疑，投稿系统只认识脚注。", descriptionEn: "The study is approved, the footnote is wrong, and the portal knows only the footnote." },
    ],
  },
  {
    id: "funding", icon: "$", timelineTag: "经费流水", timelineTagEn: "Funding Ledger", speaker: "财务老师", speakerEn: "Finance Officer", opening: "“这笔支出需要附件十七。”", openingEn: "“This expense requires Appendix Seventeen.”", reply: "附件清单只到十六。对方表示这正是问题。", replyEn: "The appendix list ends at sixteen. They say that is precisely the problem.",
    choices: [
      { id: "paperwork", label: "今天补完所有手续", labelEn: "Finish every form today", result: "表格完整了，研究生略微不完整，但钱回来了。", resultEn: "the forms become complete, the student slightly less so, and the money returns.", delta: { mental: -3, funding: 5 }, effect: { conditions: { auditTrail: 1 } } },
      { id: "cut", label: "削减非核心实验", labelEn: "Cut nonessential experiments", result: "项目变小了，主张也变得终于装得下项目。", resultEn: "the project shrinks and the claim finally fits around it.", delta: { funding: 3, stats: { novelty: -1, clarity: 3 } }, effect: { conditions: { advisorPressure: 1 } } },
      { id: "bridge", label: "申请紧急过桥经费", labelEn: "Request emergency bridge funding", result: "钱带着新的汇报义务一起到达。", resultEn: "the funds arrive escorted by a new reporting obligation.", delta: { funding: 6, risk: 5 }, effect: { conditions: { advisorPressure: 2, pageDebt: 1 } } },
    ],
    incidents: [
      { id: "freeze", title: "课题经费账户被冻结", titleEn: "The Grant Account Is Frozen", description: "财务系统需要一份你从没听过、但显然早该提交的附件。", descriptionEn: "Finance wants an attachment you have never heard of but apparently owed months ago." },
      { id: "reimburse", title: "去年的报销今天截止", titleEn: "Last Year's Reimbursement Is Due Today", description: "不在今天完成，去年将永远无法在财务意义上发生。", descriptionEn: "If not filed today, last year will cease to exist financially." },
      { id: "cloud-bill", title: "一个云实例学会了复利", titleEn: "A Cloud Instance Discovers Compound Interest", description: "它没有运行实验，却坚持运行账单。", descriptionEn: "It runs no experiment but executes the invoice flawlessly." },
      { id: "procurement", title: "显卡到货，资产编号在路上", titleEn: "The GPU Arrives before Its Asset Number", description: "硬件近在眼前，制度距离仍以工作日计。", descriptionEn: "The hardware is within reach; bureaucracy remains several business days away." },
      { id: "travel", title: "线上会议释放差旅经费", titleEn: "A Virtual Conference Frees Travel Funds", description: "预算表第一次出现一块没有被承诺的绿色区域。", descriptionEn: "For the first time, the budget shows unpromised green space." },
      { id: "audit", title: "预算审计要求解释每一笔“其他”", titleEn: "Budget Audit Questions Every “Miscellaneous”", description: "每个数字必须成为完整句子，并带有发票。", descriptionEn: "Every number must become a full sentence with a receipt." },
      { id: "exchange", title: "汇率在付款页面更新", titleEn: "The Exchange Rate Updates at Checkout", description: "报价仍有效，项目经费突然不再有效。", descriptionEn: "The quote remains valid; the project budget does not." },
      { id: "open-access", title: "开放获取费用高于剩余经费", titleEn: "The Open-Access Fee Exceeds Remaining Funds", description: "开放科学的大门旁边有一个收费二维码。", descriptionEn: "Open science has a payment QR code beside the door." },
    ],
  },
  {
    id: "community", icon: "⌘", timelineTag: "开放科学", timelineTagEn: "Open Science", speaker: "匿名用户", speakerEn: "Anonymous User", opening: "“您好，最小复现只有七行，而且失败了。”", openingEn: "“Hello. The minimal reproduction is seven lines, and it fails.”", reply: "你运行那七行。它以极高的可复现性失败。", replyEn: "You run the seven lines. They fail with excellent reproducibility.",
    choices: [
      { id: "fix", label: "公开承认并修复", labelEn: "Acknowledge and fix in public", result: "Issue 关闭了，信任没有关闭，反而多了两个 star。", resultEn: "the issue closes; trust stays open and gains two stars.", delta: { mental: -2, stats: { reproducibility: 5 }, risk: -9 }, effect: { upgradeRandom: true, conditions: { auditTrail: 2, technicalDebt: -2 } } },
      { id: "reproduce", label: "整理可执行最小案例", labelEn: "Publish an executable minimal case", result: "问题缩成七行，也第一次被团队真正理解。", resultEn: "the problem shrinks to seven lines and the team finally understands it.", delta: { stats: { clarity: 3, reproducibility: 3 } }, effect: { conditions: { insight: 2 } } },
      { id: "private", label: "暂时关闭仓库", labelEn: "Take the repository private", result: "问题从页面消失，缓存和截图继续同行评审。", resultEn: "the problem leaves the page while caches and screenshots continue peer review.", delta: { risk: 17 }, effect: { conditions: { technicalDebt: 3 } } },
    ],
    incidents: [
      { id: "issue", title: "匿名用户提交七行复现", titleEn: "An Anonymous User Files a Seven-Line Reproduction", description: "它短、礼貌、完整，而且每次都能击穿你的主张。", descriptionEn: "It is short, polite, complete, and breaks the claim every time." },
      { id: "baseline-bug", title: "基线作者发现共同 Bug", titleEn: "A Baseline Author Finds a Shared Bug", description: "修复同时提高你和基线，排名保持不动，理解前进了一步。", descriptionEn: "The fix improves both methods; ranking stays still and understanding advances." },
      { id: "ci", title: "公开仓库的 CI 全红", titleEn: "Every Public CI Check Turns Red", description: "“本地能跑”作为论据再次未能通过测试。", descriptionEn: "“Works locally” once again fails as an argument." },
      { id: "docker", title: "Docker 镜像在每台机器上失败", titleEn: "The Docker Image Fails Everywhere", description: "至少失败行为达到了跨平台一致。", descriptionEn: "At least the failure is cross-platform consistent." },
      { id: "replication", title: "独立复现得到更朴素的数字", titleEn: "Independent Replication Finds Plainer Numbers", description: "方向相同，幅度较小，摘要里的“巨大”开始寻找新工作。", descriptionEn: "Direction agrees, magnitude shrinks, and “dramatic” seeks a new job." },
      { id: "dependency", title: "安全公告点名你的依赖版本", titleEn: "A Security Advisory Names Your Dependency", description: "公告写得比你的 requirements.txt 更精确。", descriptionEn: "The advisory describes your version more precisely than requirements.txt." },
      { id: "fork", title: "陌生人把仓库 Fork 成了可运行版本", titleEn: "A Stranger Forks the Repo into Working Order", description: "他们修了安装脚本，并礼貌询问是否接受十八个 commit。", descriptionEn: "They fix installation and politely offer eighteen commits." },
      { id: "benchmark", title: "社区投票废弃你的主基准", titleEn: "The Community Retires Your Main Benchmark", description: "大家终于承认它有问题，恰好在你完成全部实验之后。", descriptionEn: "The field admits its flaws immediately after you finish every experiment." },
    ],
  },
  {
    id: "wellbeing", icon: "☕", timelineTag: "研究者状态", timelineTagEn: "Researcher Status", speaker: "实验室群聊", speakerEn: "Lab Group Chat", opening: "“今晚还有谁在？”", openingEn: "“Who is still here tonight?”", reply: "五个人发了月亮表情，没有人承认那是求救信号。", replyEn: "Five people send moon emojis; nobody calls them distress signals.",
    choices: [
      { id: "rest", label: "真正停止工作一天", labelEn: "Actually stop for one day", result: "没有新结果，但会生成结果的人恢复了。", resultEn: "no result appears, but the person who produces results returns.", delta: { days: -1, mental: 8 }, effect: { conditions: { caffeine: -3, advisorPressure: -1 } } },
      { id: "rotation", label: "建立互助轮班", labelEn: "Organize a support rotation", result: "没有人成为孤胆英雄，也没有人单独崩溃。", resultEn: "nobody becomes a lone hero and nobody collapses alone.", delta: { funding: -1, mental: 5, stats: { clarity: 1 } }, effect: { conditions: { coauthorTrust: 3 } } },
      { id: "caffeine", label: "让咖啡接管项目管理", labelEn: "Let caffeine manage the project", result: "专注回来了，稳定心率和好判断没有同行。", resultEn: "focus returns without a stable pulse or sound judgment.", delta: { focus: 3, mental: -3, risk: 5 }, effect: { conditions: { caffeine: 4, technicalDebt: 1 } } },
    ],
    incidents: [
      { id: "coffee", title: "咖啡机宣布无限期休假", titleEn: "The Coffee Machine Takes Indefinite Leave", description: "实验室进入了一场未经伦理审批的戒断试验。", descriptionEn: "The lab enters an unapproved withdrawal study." },
      { id: "flu", title: "全实验室共享同一场感冒", titleEn: "The Entire Lab Shares One Cold", description: "群聊里的咳嗽表情比今天的有效样本多。", descriptionEn: "The group chat has more cough emojis than valid samples." },
      { id: "fire-drill", title: "消防演练带你见到白天", titleEn: "A Fire Drill Introduces Daylight", description: "你第一次在工作日看清实验楼外墙的颜色。", descriptionEn: "For the first time on a weekday, you see the building's actual color." },
      { id: "allnighter", title: "连续第二个通宵开始", titleEn: "The Second Consecutive All-Nighter Begins", description: "凌晨四点的论证非常有说服力，直到上午九点重新打开。", descriptionEn: "The 4 a.m. argument is compelling until reopened at 9." },
      { id: "quiet", title: "安静室被预约到下个月", titleEn: "The Quiet Room Is Booked through Next Month", description: "唯一空位位于打印机、咖啡机遗址和两场 Zoom 之间。", descriptionEn: "The only seat lies between a printer, the coffee-machine memorial, and two Zoom calls." },
      { id: "weekend", title: "日历意外空出一个周末", titleEn: "A Weekend Unexpectedly Opens", description: "会议取消了，四十八小时第一次没有被别人命名。", descriptionEn: "A meeting is canceled; forty-eight hours have no assigned owner." },
      { id: "plant", title: "桌面植物倒向显示器", titleEn: "The Desk Plant Leans toward the Monitor", description: "它可能在寻找光，也可能是唯一愿意读补充材料的生物。", descriptionEn: "It may seek light or be the only organism willing to read the supplement." },
      { id: "meal", title: "你发现午饭还在微波炉里", titleEn: "Lunch Is Still in the Microwave", description: "那是昨天的午饭，时间线模块获得了关键证据。", descriptionEn: "It is yesterday's lunch; the timeline gains decisive evidence." },
    ],
  },
  {
    id: "competition", icon: "↗", timelineTag: "领域动态", timelineTagEn: "Field Update", speaker: "同门", speakerEn: "Labmate", opening: "“你先深呼吸，然后看一下 arXiv。”", openingEn: "“Take a breath before checking arXiv.”", reply: "标题相似度 73%，上传时间早一天。", replyEn: "The title is 73% similar and one day earlier.",
    choices: [
      { id: "differentiate", label: "连夜做差异化验证", labelEn: "Differentiate with new evidence", result: "你写出职业生涯最长的转折句，也跑出一项真正不同的实验。", resultEn: "you write your longest contrastive sentence and run one genuinely different experiment.", delta: { gpu: -3, mental: -2, stats: { novelty: 4, evidence: 1 } }, effect: { conditions: { insight: 2 } } },
      { id: "position", label: "精读并重新定位贡献", labelEn: "Read and reposition the contribution", result: "相关工作变长，创新声明变短，两者都更可信。", resultEn: "Related Work grows, the novelty claim shrinks, and both become credible.", delta: { stats: { novelty: 2, clarity: 3 } }, effect: { conditions: { reviewerFavor: 1 } } },
      { id: "pretend", label: "假装没有看见", labelEn: "Pretend not to have seen it", result: "预印本没有消失，只是风险条替你读完了。", resultEn: "the preprint remains; the Risk meter reads it on your behalf.", delta: { mental: 2, risk: 13 }, effect: { conditions: { technicalDebt: 2 } } },
    ],
    incidents: [
      { id: "preprint", title: "竞争预印本提前一天上线", titleEn: "A Competing Preprint Appears One Day Earlier", description: "标题像你的，图配色也像，连 typo 都有一种亲缘感。", descriptionEn: "The title resembles yours, the palette does too, and even the typo feels related." },
      { id: "sota", title: "新 SOTA 领先幅度刚好多一点", titleEn: "A New SOTA Wins by Just a Little More", description: "它的提升恰好比你摘要中加粗的数字大 0.1。", descriptionEn: "Its gain exceeds the bold number in your abstract by exactly 0.1." },
      { id: "retired", title: "主基准被正式宣布过时", titleEn: "The Main Benchmark Is Officially Retired", description: "社区终于同意你的 Limitations，只是把整篇论文也归入其中。", descriptionEn: "The field accepts your Limitations and places the whole paper inside them." },
      { id: "policy", title: "昨天的创新点变成今日最低要求", titleEn: "Yesterday's Novelty Becomes Today's Requirement", description: "新政策使用与你摘要完全相同的三个关键词。", descriptionEn: "The new policy uses the exact three keywords from your abstract." },
      { id: "critique", title: "批评整个领域的文章走红", titleEn: "A Critique of the Field Goes Viral", description: "其中三个问题命中你的方法，第四个命中你的标题。", descriptionEn: "Three concerns hit your method; a fourth hits the title." },
      { id: "dataset", title: "更难的新数据集开放下载", titleEn: "A Harder Dataset Opens for Download", description: "下载按钮旁写着“欢迎提交基线”，语气像一封挑战书。", descriptionEn: "“Baselines welcome” beside Download reads like a duel invitation." },
      { id: "survey", title: "新综述没有提到你的预印本", titleEn: "A New Survey Omits Your Preprint", description: "它引用了你引用的所有论文，像绕着你画了一个完美的圆。", descriptionEn: "It cites everything you cite, drawing a perfect circle around you." },
      { id: "leaderboard", title: "排行榜更换评价指标", titleEn: "The Leaderboard Changes Its Metric", description: "昨天第一的模型今天排第十七，大家同时发现指标的重要性。", descriptionEn: "Yesterday's winner ranks seventeenth; everyone discovers metric design." },
    ],
  },
  {
    id: "collaboration", icon: "✚", timelineTag: "合作机会", timelineTagEn: "Collaboration", speaker: "潜在合作者", speakerEn: "Potential Collaborator", opening: "“我们有数据，你们有代码，对吧？”", openingEn: "“We have data and you have code, right?”", reply: "你想到那段只有在自己电脑上运行的脚本，点头幅度很小。", replyEn: "You think of the script that runs only on your laptop and nod carefully.",
    choices: [
      { id: "merge", label: "建立清晰分工后合作", labelEn: "Collaborate with clear ownership", result: "论文多了一位真正读过方法的人，群聊多了一张职责表。", resultEn: "the paper gains someone who read Methods and the chat gains an ownership table.", delta: { stats: { clarity: 2, reproducibility: 3 } }, effect: { conditions: { coauthorTrust: 3, insight: 1 } } },
      { id: "commission", label: "委托一次深度复核", labelEn: "Commission a focused review", result: "对方删除一个漂亮但站不住的结果，并救下其余结果。", resultEn: "they remove one beautiful unsupported result and rescue the rest.", delta: { funding: -3, stats: { evidence: 4, reproducibility: 1 } }, effect: { conditions: { auditTrail: 1 } } },
      { id: "decline", label: "感谢并守住论文范围", labelEn: "Thank them and protect scope", result: "合作没有发生，新增待办也没有发生。", resultEn: "the collaboration does not happen, and neither does its task list.", delta: { mental: 4, stats: { clarity: 1 } }, effect: { conditions: { advisorPressure: -1 } } },
    ],
    incidents: [
      { id: "statistician", title: "统计顾问出现罕见空档", titleEn: "A Statistician Has a Rare Open Slot", description: "预约表露出三十分钟空白，像宇宙中的可居住带。", descriptionEn: "A thirty-minute gap appears like a habitable zone." },
      { id: "librarian", title: "图书馆员修好 BibTeX", titleEn: "A Librarian Repairs BibTeX", description: "对方拒绝共同作者署名，只要求你以后别手改 .bib。", descriptionEn: "They decline authorship and ask only that you stop hand-editing .bib." },
      { id: "clinician", title: "临床专家给出三条具体反馈", titleEn: "A Clinician Gives Three Concrete Notes", description: "不是“很有潜力”，而是三个可验证、可执行的动词。", descriptionEn: "Not “promising,” but three testable, actionable verbs." },
      { id: "engineer", title: "工程师发现 CI 的致命空格", titleEn: "An Engineer Finds the Fatal CI Space", description: "问题是你盯了三小时的一个空格，它现在有了修复者。", descriptionEn: "The problem is a space you stared at for three hours; it now has a fixer." },
      { id: "plot", title: "同门在旧日志里发现关键图", titleEn: "A Labmate Finds the Key Plot in Old Logs", description: "它一直住在 logs/archive/old/really_old，保持谦逊。", descriptionEn: "It lived quietly in logs/archive/old/really_old." },
      { id: "consortium", title: "多中心联盟发来验证邀请", titleEn: "A Consortium Offers External Validation", description: "对方有五个中心，你有一段勉强可以发给别人的代码。", descriptionEn: "They have five sites; you have code that can almost be emailed." },
      { id: "student", title: "本科生复现出你忘记的实验", titleEn: "An Undergraduate Reproduces a Forgotten Experiment", description: "README 对新人比对作者更诚实。", descriptionEn: "The README is kinder to newcomers than to its authors." },
      { id: "rival", title: "竞争团队提出共享失败结果", titleEn: "A Rival Team Offers to Share Failures", description: "双方第一次发现彼此都被同一个数据集骗过。", descriptionEn: "Both teams learn that the same dataset fooled them." },
    ],
  },
  {
    id: "publicity", icon: "@", timelineTag: "公众反馈", timelineTagEn: "Public Response", speaker: "宣传部门", speakerEn: "Press Office", opening: "“能不能把‘初步’删掉？听起来不够有突破性。”", openingEn: "“Could we remove ‘preliminary’? It sounds insufficiently groundbreaking.”", reply: "你把它加回去。文档立刻再次被共享。", replyEn: "You restore it. The document is immediately shared again.",
    choices: [
      { id: "engage", label: "认真解释证据边界", labelEn: "Explain the evidence boundary", result: "公众误解少了一些，你的睡眠也少了一些。", resultEn: "public misunderstanding shrinks, along with your sleep.", delta: { mental: -3, stats: { novelty: 2, clarity: 4 } }, effect: { conditions: { insight: 1, reviewerFavor: 1 } } },
      { id: "release", label: "公开更多材料和失败案例", labelEn: "Release materials and failures", result: "讨论开始引用文档，而不是引用猜测。", resultEn: "the discussion begins citing documentation rather than speculation.", delta: { stats: { reproducibility: 4, evidence: 1 }, risk: -7 }, effect: { conditions: { auditTrail: 2 } } },
      { id: "hype", label: "接受“革命性”标题", labelEn: "Accept the “revolutionary” headline", result: "点击量上升，主张边界和风险条向相反方向移动。", resultEn: "clicks rise while claim boundaries and Risk move in opposite directions.", delta: { stats: { novelty: 4, clarity: -1 }, risk: 14 }, effect: { conditions: { advisorPressure: 1 } } },
    ],
    incidents: [
      { id: "citation", title: "预印本收到第一条外部引用", titleEn: "The Preprint Receives Its First External Citation", description: "虽然是自引，但来自另一个团队，学术亲属关系获得新定义。", descriptionEn: "It is a self-citation, but by another team; academic kinship expands." },
      { id: "poster", title: "失败案例图意外获得海报奖", titleEn: "The Failure-Case Figure Wins a Poster Prize", description: "评委最喜欢你差点删除的那一格。", descriptionEn: "The judges love the panel you nearly deleted." },
      { id: "press", title: "宣传部门写好革命性新闻稿", titleEn: "The Press Office Drafts a Revolutionary Release", description: "“初步”消失三次，“首次”出现五次。", descriptionEn: "“Preliminary” vanishes three times; “first” appears five." },
      { id: "viral", title: "论文讨论串突然走红", titleEn: "A Thread about the Paper Goes Viral", description: "最热门回复问了 Reviewer #2 没有想到的问题。", descriptionEn: "The top reply asks what Reviewer #2 missed." },
      { id: "podcast", title: "播客要求一句话解释方法", titleEn: "A Podcast Wants a One-Sentence Explanation", description: "你写出一百三十七个字，并把分号称为呼吸。", descriptionEn: "You write 137 words and describe semicolons as breathing." },
      { id: "negative", title: "失败实验比主结果传播更广", titleEn: "The Negative Result Outruns the Main Finding", description: "大家犯过同一个错误，只是你第一个把它写出来。", descriptionEn: "Everyone made the same mistake; you were first to write it down." },
      { id: "meme", title: "Figure 2 被做成表情包", titleEn: "Figure 2 Becomes a Meme", description: "至少现在所有人都能读懂坐标轴，语境则另说。", descriptionEn: "At least everyone can read the axes now; context is another matter." },
      { id: "interview", title: "记者把置信区间称为预测范围", titleEn: "A Reporter Renames the Confidence Interval", description: "你有十五分钟阻止一个统计术语进入永久互联网。", descriptionEn: "You have fifteen minutes to stop a statistical term entering permanent internet." },
    ],
  },
  {
    id: "institution", icon: "§", timelineTag: "学院行政", timelineTagEn: "Department Admin", speaker: "学院办公室", speakerEn: "Department Office", opening: "“这是一个很简单的流程。”", openingEn: "“This is a very simple process.”", reply: "流程图有十三个节点、两个回环和一个只在周二办公的人。", replyEn: "The flowchart has thirteen nodes, two loops, and one person available Tuesdays.",
    choices: [
      { id: "comply", label: "按流程逐章盖章", labelEn: "Follow every step and stamp", result: "行政链终于闭合，你的审计轨迹也异常漂亮。", resultEn: "the administrative chain closes and your audit trail looks magnificent.", delta: { mental: -3, days: -1, stats: { reproducibility: 3 } }, effect: { conditions: { auditTrail: 2 } } },
      { id: "ally", label: "请办公室老师指路", labelEn: "Ask an administrator to guide you", result: "对方画出一条合法捷径，并拒绝被列为共同作者。", resultEn: "they draw a legal shortcut and decline coauthorship.", delta: { funding: -1, stats: { clarity: 3 } }, effect: { conditions: { reviewerFavor: 1, advisorPressure: -1 } } },
      { id: "bypass", label: "上传一个叫 final 的文件", labelEn: "Upload a file named final", result: "系统接受了文件，现实保留追诉权。", resultEn: "the portal accepts the file; reality reserves the right to appeal.", delta: { days: 1, risk: 11 }, effect: { conditions: { technicalDebt: 2 } } },
    ],
    incidents: [
      { id: "stamp", title: "院章只在周二下午开放", titleEn: "The Department Stamp Works Tuesday Afternoons", description: "今天是周三，截止日是周一，时间旅行尚未通过伦理审批。", descriptionEn: "It is Wednesday, deadline is Monday, and time travel lacks approval." },
      { id: "training", title: "投稿前必须完成新培训", titleEn: "A New Training Module Blocks Submission", description: "课程时长两小时，视频不允许倍速，测验问你校徽颜色。", descriptionEn: "The module lasts two hours, forbids speedup, and quizzes the logo color." },
      { id: "vpn", title: "校园 VPN 只拒绝投稿系统", titleEn: "Campus VPN Rejects Only the Submission Portal", description: "娱乐网站正常，学术生产力获得精准限流。", descriptionEn: "Entertainment works; academic productivity is precisely throttled." },
      { id: "office", title: "关键办公室正在搬家", titleEn: "The Critical Office Is Moving", description: "旧房间有牌子，新房间有人，两边都没有审批人。", descriptionEn: "The old room has a sign, the new room has people, neither has the approver." },
      { id: "domain", title: "学校邮箱域名突然迁移", titleEn: "The University Migrates Email Domains", description: "投稿系统向旧邮箱发送了唯一的确认链接。", descriptionEn: "The portal sends its only confirmation link to the old domain." },
      { id: "signature", title: "电子签名系统要求手写签名", titleEn: "E-Signature Requires a Handwritten Signature", description: "扫描件必须数字提交，数字签名必须打印扫描。", descriptionEn: "Scans must be digital; digital signatures must be printed and scanned." },
      { id: "seminar", title: "强制学术讲座撞上 Rebuttal", titleEn: "A Mandatory Seminar Overlaps Rebuttal", description: "讲座主题是时间管理，出席必须现场签到。", descriptionEn: "The seminar is about time management and requires in-person attendance." },
      { id: "cleaning", title: "保洁误收了白板上的证明", titleEn: "Cleaning Removes the Whiteboard Proof", description: "白板现在非常干净，定理恢复为猜想。", descriptionEn: "The board is spotless and the theorem returns to conjecture." },
    ],
  },
];

export const GRAND_EVENTS: GrandEventDef[] = FAMILIES.flatMap((family) =>
  family.incidents.map((incident) => {
    const id = `grand-event-${family.id}-${incident.id}`;
    return {
      id,
      icon: family.icon,
      title: incident.title,
      titleEn: incident.titleEn,
      description: incident.description,
      descriptionEn: incident.descriptionEn,
      choices: family.choices.map((plan) => choice(id, plan, incident)) as [EventChoice, EventChoice, EventChoice],
      dialogue: [
        { speaker: family.speaker, speakerEn: family.speakerEn, text: family.opening, textEn: family.openingEn },
        { speaker: "你", speakerEn: "You", text: incident.description, textEn: incident.descriptionEn },
        { speaker: "旁白", speakerEn: "Narrator", text: family.reply, textEn: family.replyEn },
      ],
      hiddenOutcome: true,
      timelineTag: family.timelineTag,
      timelineTagEn: family.timelineTagEn,
    };
  }),
);

function assertUnique(label: string, values: string[]) {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) throw new Error(`${label}: duplicate id ${value}`);
    seen.add(value);
  }
}

function assertBilingual(label: string, values: Array<string | undefined>) {
  if (values.some((value) => !value?.trim())) throw new Error(`${label}: missing bilingual text`);
}

if (GRAND_CARDS.length !== 264) throw new Error(`GRAND_CARDS: expected 264, received ${GRAND_CARDS.length}`);
if (GRAND_EVENTS.length !== 128) throw new Error(`GRAND_EVENTS: expected 128, received ${GRAND_EVENTS.length}`);

assertUnique("grand entity ids", [...GRAND_CARDS.map((item) => item.id), ...GRAND_EVENTS.map((item) => item.id)]);
assertUnique("grand event choice ids", GRAND_EVENTS.flatMap((event) => event.choices.map((item) => item.id)));
assertBilingual("GRAND_CARDS", GRAND_CARDS.flatMap((card) => [card.name, card.en, card.flavor, card.flavorEn, card.rules, card.rulesEn]));
assertBilingual("GRAND_EVENTS", GRAND_EVENTS.flatMap((event) => [
  event.title, event.titleEn, event.description, event.descriptionEn, event.timelineTag, event.timelineTagEn,
  ...event.dialogue.flatMap((beat) => [beat.speaker, beat.speakerEn, beat.text, beat.textEn]),
  ...event.choices.flatMap((item) => [item.label, item.labelEn, item.hint, item.hintEn, item.result, item.resultEn]),
]));
