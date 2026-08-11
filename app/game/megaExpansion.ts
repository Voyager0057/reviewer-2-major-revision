import type {
  Capability,
  CardCategory,
  CardDef,
  CardRarity,
  CommentDef,
  Delta,
  EventChoice,
  EventDef,
  EventEffect,
  Metric,
  PaperStats,
  RelicDef,
  ResolutionRoute,
  RoleDef,
  StageId,
} from "./types";

/**
 * A deliberately data-heavy expansion library. The game can sample from this
 * module without putting every definition into one run.
 */

interface CapabilityTopic {
  capability: Capability;
  slug: string;
  zh: string;
  en: string;
  stemZh: string;
  stemEn: string;
  concernZh: string;
  concernEn: string;
  actionZh: string;
  actionEn: string;
  primary: Metric;
  secondary: Metric;
  ally: Capability;
  tags: string[];
  relicZh: string;
  relicEn: string;
}

const CAPABILITY_TOPICS: CapabilityTopic[] = [
  {
    capability: "comparison",
    slug: "comparison",
    zh: "基线比较",
    en: "baseline comparison",
    stemZh: "基线对照",
    stemEn: "Baseline Comparison",
    concernZh: "比较对象是否公平且足够强",
    concernEn: "whether the baselines are strong and fairly configured",
    actionZh: "统一预算、实现和调参协议",
    actionEn: "align budgets, implementations, and tuning protocols",
    primary: "evidence",
    secondary: "reproducibility",
    ally: "protocol",
    tags: ["comparison", "baseline", "evidence"],
    relicZh: "基线博物馆",
    relicEn: "Baseline Museum",
  },
  {
    capability: "ablation",
    slug: "ablation",
    zh: "组件消融",
    en: "component ablation",
    stemZh: "模块消融",
    stemEn: "Component Ablation",
    concernZh: "每个模块是否真的贡献了增益",
    concernEn: "whether each component genuinely contributes",
    actionZh: "逐项移除组件并解释交互",
    actionEn: "remove components one by one and explain interactions",
    primary: "novelty",
    secondary: "evidence",
    ally: "interpretability",
    tags: ["ablation", "components", "novelty"],
    relicZh: "模块拔线钳",
    relicEn: "Module Wire Cutters",
  },
  {
    capability: "statistics",
    slug: "statistics",
    zh: "统计检验",
    en: "statistical testing",
    stemZh: "统计检验",
    stemEn: "Statistical Test",
    concernZh: "提升是否超过随机波动",
    concernEn: "whether the improvement exceeds random variation",
    actionZh: "报告效应量、检验与多重校正",
    actionEn: "report effect sizes, tests, and multiplicity corrections",
    primary: "evidence",
    secondary: "reproducibility",
    ally: "uncertainty",
    tags: ["statistics", "significance", "evidence"],
    relicZh: "统计顾问名片",
    relicEn: "Statistician's Card",
  },
  {
    capability: "uncertainty",
    slug: "uncertainty",
    zh: "不确定性量化",
    en: "uncertainty quantification",
    stemZh: "不确定性",
    stemEn: "Uncertainty",
    concernZh: "点估计是否掩盖了不稳定性",
    concernEn: "whether point estimates conceal instability",
    actionZh: "补充区间、分布与误差传播",
    actionEn: "add intervals, distributions, and error propagation",
    primary: "evidence",
    secondary: "clarity",
    ally: "statistics",
    tags: ["uncertainty", "intervals", "statistics"],
    relicZh: "误差条尺",
    relicEn: "Error-Bar Ruler",
  },
  {
    capability: "visualization",
    slug: "visualization",
    zh: "结果可视化",
    en: "result visualization",
    stemZh: "结果图解",
    stemEn: "Result Visualization",
    concernZh: "图表能否独立传达结论",
    concernEn: "whether figures communicate the conclusion unaided",
    actionZh: "重做编码、图注与视觉层级",
    actionEn: "redesign encodings, captions, and visual hierarchy",
    primary: "clarity",
    secondary: "evidence",
    ally: "formatting",
    tags: ["figure", "visualization", "clarity"],
    relicZh: "矢量图母版",
    relicEn: "Vector Figure Master",
  },
  {
    capability: "protocol",
    slug: "protocol",
    zh: "实验协议",
    en: "experimental protocol",
    stemZh: "实验协议",
    stemEn: "Experimental Protocol",
    concernZh: "关键决策是否在看结果前确定",
    concernEn: "whether key decisions were fixed before seeing results",
    actionZh: "冻结划分、指标与停止规则",
    actionEn: "freeze splits, metrics, and stopping rules",
    primary: "reproducibility",
    secondary: "clarity",
    ally: "statistics",
    tags: ["protocol", "preregistration", "details"],
    relicZh: "冻结的方案书",
    relicEn: "Frozen Protocol",
  },
  {
    capability: "dataIntegrity",
    slug: "data-integrity",
    zh: "数据完整性",
    en: "data integrity",
    stemZh: "数据完整性",
    stemEn: "Data Integrity",
    concernZh: "数据划分、标签和来源是否可靠",
    concernEn: "whether splits, labels, and provenance are trustworthy",
    actionZh: "审计样本、哈希、划分和标签",
    actionEn: "audit samples, hashes, splits, and labels",
    primary: "reproducibility",
    secondary: "evidence",
    ally: "ethics",
    tags: ["data", "audit", "leakage"],
    relicZh: "只读数据快照",
    relicEn: "Read-Only Data Snapshot",
  },
  {
    capability: "externalValidation",
    slug: "external-validation",
    zh: "外部验证",
    en: "external validation",
    stemZh: "外部验证",
    stemEn: "External Validation",
    concernZh: "结论能否离开当前数据集成立",
    concernEn: "whether findings survive beyond the current dataset",
    actionZh: "在独立中心、时间段或领域复验",
    actionEn: "validate across independent sites, periods, or domains",
    primary: "evidence",
    secondary: "reproducibility",
    ally: "robustness",
    tags: ["external", "generalization", "data"],
    relicZh: "多中心通行证",
    relicEn: "Multi-Site Passport",
  },
  {
    capability: "robustness",
    slug: "robustness",
    zh: "鲁棒性",
    en: "robustness",
    stemZh: "鲁棒性",
    stemEn: "Robustness",
    concernZh: "结论是否依赖脆弱的设置",
    concernEn: "whether the conclusion depends on brittle settings",
    actionZh: "扰动输入、超参数和环境",
    actionEn: "perturb inputs, hyperparameters, and environments",
    primary: "evidence",
    secondary: "reproducibility",
    ally: "externalValidation",
    tags: ["robustness", "stress", "parameters"],
    relicZh: "压力测试夹具",
    relicEn: "Stress-Test Rig",
  },
  {
    capability: "calibration",
    slug: "calibration",
    zh: "模型校准",
    en: "model calibration",
    stemZh: "模型校准",
    stemEn: "Model Calibration",
    concernZh: "置信度是否对应真实错误率",
    concernEn: "whether confidence corresponds to real error rates",
    actionZh: "绘制校准曲线并报告校准误差",
    actionEn: "plot reliability curves and report calibration error",
    primary: "evidence",
    secondary: "clarity",
    ally: "uncertainty",
    tags: ["calibration", "uncertainty", "clinical"],
    relicZh: "校准砝码",
    relicEn: "Calibration Weight",
  },
  {
    capability: "efficiency",
    slug: "efficiency",
    zh: "计算效率",
    en: "computational efficiency",
    stemZh: "效率评估",
    stemEn: "Efficiency Evaluation",
    concernZh: "边际提升是否值得额外算力",
    concernEn: "whether marginal gains justify the extra compute",
    actionZh: "统一预算并报告吞吐、内存和能耗",
    actionEn: "match budgets and report throughput, memory, and energy",
    primary: "evidence",
    secondary: "reproducibility",
    ally: "comparison",
    tags: ["efficiency", "compute", "gpu"],
    relicZh: "碳预算表",
    relicEn: "Carbon Ledger",
  },
  {
    capability: "clinicalRelevance",
    slug: "clinical-relevance",
    zh: "临床相关性",
    en: "clinical relevance",
    stemZh: "临床价值",
    stemEn: "Clinical Relevance",
    concernZh: "指标提升是否改变实际决策",
    concernEn: "whether metric gains change real decisions",
    actionZh: "连接指标、工作流与患者结局",
    actionEn: "connect metrics to workflows and patient outcomes",
    primary: "novelty",
    secondary: "evidence",
    ally: "externalValidation",
    tags: ["clinical", "impact", "claims"],
    relicZh: "床旁决策便签",
    relicEn: "Bedside Decision Notes",
  },
  {
    capability: "fairness",
    slug: "fairness",
    zh: "公平性",
    en: "fairness",
    stemZh: "公平性分析",
    stemEn: "Fairness Analysis",
    concernZh: "总体均值是否掩盖亚组伤害",
    concernEn: "whether aggregate means conceal subgroup harms",
    actionZh: "报告亚组表现、差距和失败模式",
    actionEn: "report subgroup performance, gaps, and failure modes",
    primary: "evidence",
    secondary: "clarity",
    ally: "ethics",
    tags: ["fairness", "subgroups", "ethics"],
    relicZh: "亚组检查清单",
    relicEn: "Subgroup Checklist",
  },
  {
    capability: "causalReasoning",
    slug: "causal-reasoning",
    zh: "因果推理",
    en: "causal reasoning",
    stemZh: "因果推理",
    stemEn: "Causal Reasoning",
    concernZh: "相关性是否被误写成因果关系",
    concernEn: "whether association is being presented as causation",
    actionZh: "明确估计目标、假设和识别策略",
    actionEn: "state estimands, assumptions, and identification strategy",
    primary: "novelty",
    secondary: "evidence",
    ally: "protocol",
    tags: ["causal", "claims", "theory"],
    relicZh: "DAG 模板尺",
    relicEn: "DAG Stencil",
  },
  {
    capability: "reproducibility",
    slug: "reproducibility",
    zh: "可复现性",
    en: "reproducibility",
    stemZh: "复现实验",
    stemEn: "Reproducibility",
    concernZh: "他人能否从说明重建结果",
    concernEn: "whether others can reconstruct the result from the record",
    actionZh: "锁定环境、种子、数据和命令",
    actionEn: "lock environments, seeds, data, and commands",
    primary: "reproducibility",
    secondary: "clarity",
    ally: "documentation",
    tags: ["reproducibility", "environment", "seed"],
    relicZh: "可复现胶囊",
    relicEn: "Reproducibility Capsule",
  },
  {
    capability: "codeRelease",
    slug: "code-release",
    zh: "代码发布",
    en: "code release",
    stemZh: "代码发布",
    stemEn: "Code Release",
    concernZh: "公开仓库是否真的可运行",
    concernEn: "whether the public repository actually runs",
    actionZh: "补齐安装、测试、许可和示例",
    actionEn: "add installation, tests, licensing, and examples",
    primary: "reproducibility",
    secondary: "clarity",
    ally: "documentation",
    tags: ["code", "release", "reproducibility"],
    relicZh: "绿色 CI 徽章",
    relicEn: "Green CI Badge",
  },
  {
    capability: "documentation",
    slug: "documentation",
    zh: "研究文档",
    en: "research documentation",
    stemZh: "研究文档",
    stemEn: "Research Documentation",
    concernZh: "关键细节是否只存在于作者记忆中",
    concernEn: "whether critical details exist only in the authors' memory",
    actionZh: "整理数据卡、模型卡和运行说明",
    actionEn: "prepare data cards, model cards, and run instructions",
    primary: "clarity",
    secondary: "reproducibility",
    ally: "codeRelease",
    tags: ["documentation", "details", "readme"],
    relicZh: "永不失效的 README",
    relicEn: "Evergreen README",
  },
  {
    capability: "claimFraming",
    slug: "claim-framing",
    zh: "主张边界",
    en: "claim framing",
    stemZh: "主张边界",
    stemEn: "Claim Framing",
    concernZh: "论文措辞是否超出证据范围",
    concernEn: "whether the prose outruns the evidence",
    actionZh: "收窄主张并标明适用边界",
    actionEn: "narrow claims and state their scope",
    primary: "novelty",
    secondary: "clarity",
    ally: "responseWriting",
    tags: ["claims", "scope", "writing"],
    relicZh: "删形容词的红笔",
    relicEn: "Adjective-Cutting Pen",
  },
  {
    capability: "literature",
    slug: "literature",
    zh: "相关工作",
    en: "related literature",
    stemZh: "相关工作",
    stemEn: "Related Literature",
    concernZh: "贡献是否被放在正确的研究脉络中",
    concernEn: "whether the contribution is positioned in the right lineage",
    actionZh: "补齐近期、相反和奠基性工作",
    actionEn: "cover recent, contrary, and foundational work",
    primary: "novelty",
    secondary: "clarity",
    ally: "comparison",
    tags: ["literature", "citations", "novelty"],
    relicZh: "整理好的 Zotero",
    relicEn: "Perfect Zotero Library",
  },
  {
    capability: "responseWriting",
    slug: "response-writing",
    zh: "逐条回复",
    en: "response writing",
    stemZh: "逐条回复",
    stemEn: "Response Writing",
    concernZh: "回复是否清楚对应每一项担忧",
    concernEn: "whether the rebuttal clearly maps to every concern",
    actionZh: "建立意见、行动和页码的映射",
    actionEn: "map each concern to an action and page number",
    primary: "clarity",
    secondary: "evidence",
    ally: "documentation",
    tags: ["rebuttal", "response", "writing"],
    relicZh: "逐条回复矩阵",
    relicEn: "Response Matrix",
  },
  {
    capability: "ethics",
    slug: "ethics",
    zh: "研究伦理",
    en: "research ethics",
    stemZh: "伦理说明",
    stemEn: "Ethics Statement",
    concernZh: "同意、治理和潜在伤害是否被处理",
    concernEn: "whether consent, governance, and possible harms are addressed",
    actionZh: "补齐批准、用途限制和风险说明",
    actionEn: "document approvals, use limits, and risks",
    primary: "reproducibility",
    secondary: "clarity",
    ally: "fairness",
    tags: ["ethics", "governance", "consent"],
    relicZh: "伦理批件复印件",
    relicEn: "IRB Approval Copy",
  },
  {
    capability: "formatting",
    slug: "formatting",
    zh: "终稿格式",
    en: "camera-ready formatting",
    stemZh: "终稿格式",
    stemEn: "Camera-Ready Formatting",
    concernZh: "页面、字体和引用是否符合规范",
    concernEn: "whether pages, fonts, and references meet the specification",
    actionZh: "自动检查页数、字体、分辨率和引用",
    actionEn: "automate checks for pages, fonts, resolution, and references",
    primary: "clarity",
    secondary: "reproducibility",
    ally: "visualization",
    tags: ["formatting", "camera", "references"],
    relicZh: "双栏排版尺",
    relicEn: "Two-Column Ruler",
  },
  {
    capability: "theory",
    slug: "theory",
    zh: "理论解释",
    en: "theoretical grounding",
    stemZh: "理论解释",
    stemEn: "Theory",
    concernZh: "方法为何有效是否有可检验解释",
    concernEn: "whether there is a testable account of why the method works",
    actionZh: "提出命题、边界条件和可证伪预测",
    actionEn: "state propositions, boundary conditions, and falsifiable predictions",
    primary: "novelty",
    secondary: "clarity",
    ally: "ablation",
    tags: ["theory", "mechanism", "novelty"],
    relicZh: "白板的一角",
    relicEn: "A Corner of the Whiteboard",
  },
  {
    capability: "interpretability",
    slug: "interpretability",
    zh: "可解释性",
    en: "interpretability",
    stemZh: "可解释分析",
    stemEn: "Interpretability",
    concernZh: "解释是否忠实于模型行为",
    concernEn: "whether explanations are faithful to model behavior",
    actionZh: "验证解释稳定性、忠实度和反例",
    actionEn: "test explanation stability, faithfulness, and counterexamples",
    primary: "clarity",
    secondary: "novelty",
    ally: "robustness",
    tags: ["interpretability", "explanations", "analysis"],
    relicZh: "透明模型盒",
    relicEn: "Transparent Model Box",
  },
];

function addStats(
  primary: Metric,
  primaryAmount: number,
  secondary?: Metric,
  secondaryAmount = 0,
): Partial<PaperStats> {
  const stats: Partial<PaperStats> = {};
  stats[primary] = primaryAmount;
  if (secondary && secondaryAmount !== 0) {
    stats[secondary] = (stats[secondary] ?? 0) + secondaryAmount;
  }
  return stats;
}

function mergeStats(...parts: Partial<PaperStats>[]): Partial<PaperStats> {
  const result: Partial<PaperStats> = {};
  for (const part of parts) {
    for (const metric of Object.keys(part) as Metric[]) {
      result[metric] = (result[metric] ?? 0) + (part[metric] ?? 0);
    }
  }
  return result;
}

function capabilityMap(
  entries: Array<readonly [Capability, number]>,
): Partial<Record<Capability, number>> {
  const result: Partial<Record<Capability, number>> = {};
  for (const [capability, amount] of entries) {
    result[capability] = Math.max(result[capability] ?? 0, amount);
  }
  return result;
}

interface CardTactic {
  id: string;
  suffixZh: string;
  suffixEn: string;
  category: CardCategory;
  rarity: CardRarity;
  build: (topic: CapabilityTopic, index: number) => Omit<
    CardDef,
    "id" | "name" | "en" | "category" | "rarity" | "flavor" | "flavorEn" | "rules" | "rulesEn" | "tags" | "provides"
  > & {
    flavor: string;
    flavorEn: string;
    rules: string;
    rulesEn: string;
    tags?: string[];
    provides: Partial<Record<Capability, number>>;
  };
}

const CARD_TACTICS: CardTactic[] = [
  {
    id: "quick-check",
    suffixZh: "速查",
    suffixEn: "Quick Check",
    category: "experiment",
    rarity: "common",
    build: (topic) => ({
      flavor: `先用最小成本确认${topic.concernZh}不是幻觉。`,
      flavorEn: `Use the smallest experiment to check ${topic.concernEn}.`,
      rules: `${topic.zh}能力 +2；${topic.primary === "clarity" ? "清晰度" : "核心属性"} +1。严谨牌后打出时额外 +1 回应。`,
      rulesEn: `Provides 2 ${topic.en}. Primary stat +1. Combo after a Rigor card: +1 Response.`,
      focus: 1,
      gpu: 1,
      delta: { stats: addStats(topic.primary, 1) },
      answer: 1,
      comboAfter: "rigor",
      comboAnswer: 1,
      provides: capabilityMap([[topic.capability, 2]]),
    }),
  },
  {
    id: "stress-test",
    suffixZh: "压力实验",
    suffixEn: "Stress Test",
    category: "experiment",
    rarity: "uncommon",
    build: (topic, index) => ({
      flavor: `把${topic.zh}推到最苛刻的条件下，直到结论开始说真话。`,
      flavorEn: `Push ${topic.en} into hostile conditions until the conclusion tells the truth.`,
      rules: `核心属性 +3、次要属性 +1；${topic.zh}能力 +3。`,
      rulesEn: `Primary stat +3, secondary stat +1, and provides 3 ${topic.en}.`,
      focus: 2,
      gpu: 2 + (index % 2),
      mental: index % 4 === 0 ? 1 : undefined,
      delta: { stats: addStats(topic.primary, 3, topic.secondary, 1) },
      answer: 2,
      exhaust: index % 6 === 0,
      provides: capabilityMap([
        [topic.capability, 3],
        [topic.ally, 1],
      ]),
    }),
  },
  {
    id: "argument-rewrite",
    suffixZh: "论证重写",
    suffixEn: "Argument Rewrite",
    category: "writing",
    rarity: "common",
    build: (topic, index) => ({
      flavor: `把${topic.zh}从附带说明提升为论文主线。`,
      flavorEn: `Move ${topic.en} from a footnote into the paper's main argument.`,
      rules: `清晰度 +2，${topic.zh}能力 +2${index % 3 === 0 ? "，当前意见难度 -1" : ""}。`,
      rulesEn: `Clarity +2 and provides 2 ${topic.en}${index % 3 === 0 ? "; current difficulty -1" : ""}.`,
      focus: 1,
      mental: index % 5 === 0 ? 1 : undefined,
      delta: { stats: mergeStats({ clarity: 2 }, topic.primary === "clarity" ? {} : addStats(topic.primary, 1)) },
      answer: 1,
      shrinkIssue: index % 3 === 0 ? 1 : undefined,
      retain: index % 8 === 0,
      provides: capabilityMap([
        [topic.capability, 2],
        ["claimFraming", 1],
      ]),
    }),
  },
  {
    id: "visual-brief",
    suffixZh: "图解",
    suffixEn: "Visual Brief",
    category: "writing",
    rarity: "uncommon",
    build: (topic, index) => ({
      flavor: `让${topic.zh}在一张图里接受审问。`,
      flavorEn: `Make ${topic.en} survive an interrogation on a single page.`,
      rules: `清晰度 +3；${topic.zh}与可视化能力各 +2。实验牌后打出额外 +1 回应。`,
      rulesEn: `Clarity +3; provides 2 ${topic.en} and 2 visualization. Combo after Experiment: +1 Response.`,
      focus: 1,
      funding: index % 4 === 0 ? 1 : undefined,
      delta: { stats: { clarity: 3 } },
      answer: 2,
      comboAfter: "experiment",
      comboAnswer: 1,
      provides: capabilityMap([
        [topic.capability, 2],
        ["visualization", 2],
      ]),
    }),
  },
  {
    id: "audit",
    suffixZh: "审计",
    suffixEn: "Audit",
    category: "rigor",
    rarity: "uncommon",
    build: (topic, index) => ({
      flavor: `为${topic.zh}的每一步留下足够让未来的你作证的记录。`,
      flavorEn: `Leave enough records for your future self to testify about ${topic.en}.`,
      rules: `可复现性 +2、核心属性 +1、风险 -${3 + (index % 3)}；审计轨迹 +1。`,
      rulesEn: `Reproducibility +2, primary stat +1, Risk -${3 + (index % 3)}, and Audit Trail +1.`,
      focus: index % 5 === 0 ? 2 : 1,
      funding: index % 7 === 0 ? 1 : undefined,
      delta: {
        stats: mergeStats({ reproducibility: 2 }, topic.primary === "reproducibility" ? {} : addStats(topic.primary, 1)),
        risk: -(3 + (index % 3)),
      },
      answer: 2,
      condition: { auditTrail: 1 },
      provides: capabilityMap([
        [topic.capability, 2],
        ["dataIntegrity", 1],
        ["reproducibility", 1],
      ]),
    }),
  },
  {
    id: "protocol-lock",
    suffixZh: "方案冻结",
    suffixEn: "Protocol Lock",
    category: "rigor",
    rarity: "rare",
    build: (topic, index) => ({
      flavor: `在结果出现前锁死关于${topic.zh}的关键决定。`,
      flavorEn: `Lock the critical ${topic.en} decisions before the result appears.`,
      rules: `可复现性 +3、风险 -4；${topic.zh}与实验协议能力各 +2，技术债 -1。`,
      rulesEn: `Reproducibility +3, Risk -4; provides 2 ${topic.en} and 2 protocol; Technical Debt -1.`,
      focus: 1,
      mental: index % 6 === 0 ? 1 : undefined,
      delta: { stats: { reproducibility: 3 }, risk: -4 },
      answer: 2,
      retain: index % 7 === 0,
      condition: { technicalDebt: -1 },
      provides: capabilityMap([
        [topic.capability, 2],
        ["protocol", 2],
      ]),
    }),
  },
  {
    id: "consultation",
    suffixZh: "会诊",
    suffixEn: "Consultation",
    category: "support",
    rarity: "uncommon",
    build: (topic, index) => ({
      flavor: `找到真正懂${topic.zh}的人，也找到三条新的待办。`,
      flavorEn: `Find someone who understands ${topic.en}, and receive three new action items.`,
      rules: `精神 +3、核心属性 +1；获得 ${1 + (index % 2)} 洞见。`,
      rulesEn: `Mental Health +3, primary stat +1, and gain ${1 + (index % 2)} Insight.`,
      focus: 1,
      funding: index % 6 === 0 ? 1 : undefined,
      delta: { mental: 3, stats: addStats(topic.primary, 1) },
      answer: 1,
      condition: index % 4 === 0 ? { reviewerFavor: 1 } : { insight: 1 + (index % 2) },
      provides: capabilityMap([
        [topic.capability, 1],
        ["responseWriting", 1],
      ]),
    }),
  },
  {
    id: "shortcut",
    suffixZh: "捷径",
    suffixEn: "Shortcut",
    category: "questionable",
    rarity: "rare",
    build: (topic, index) => {
      const risk = 12 + (index % 4) * 3;
      return {
        flavor: `先让${topic.zh}看起来成立，后果交给补充材料。`,
        flavorEn: `Make ${topic.en} look settled now and leave the consequences to the supplement.`,
        rules: `核心属性 +3、回应 +3、${topic.zh}能力 +3；风险 +${risk}、技术债 +1。`,
        rulesEn: `Primary stat +3, +3 Response, and provides 3 ${topic.en}; Risk +${risk}, Technical Debt +1.`,
        focus: 0,
        risk,
        delta: { stats: addStats(topic.primary, 3) },
        answer: 3,
        exhaust: index % 2 === 0,
        condition: { technicalDebt: 1 },
        provides: capabilityMap([[topic.capability, 3]]),
      };
    },
  },
];

const GENERATED_CARDS: CardDef[] = CAPABILITY_TOPICS.flatMap((topic, topicIndex) =>
  CARD_TACTICS.map((tactic) => {
    const built = tactic.build(topic, topicIndex);
    return {
      id: `mega-card-${topic.slug}-${tactic.id}`,
      name: `${topic.stemZh}${tactic.suffixZh}`,
      en: `${topic.stemEn} ${tactic.suffixEn}`,
      category: tactic.category,
      rarity: tactic.rarity,
      flavor: built.flavor,
      flavorEn: built.flavorEn,
      rules: built.rules,
      rulesEn: built.rulesEn,
      focus: built.focus,
      gpu: built.gpu,
      funding: built.funding,
      mental: built.mental,
      risk: built.risk,
      delta: built.delta,
      answer: built.answer,
      tags: [...topic.tags, tactic.category, ...(built.tags ?? [])],
      volatile: built.volatile,
      shrinkIssue: built.shrinkIssue,
      exhaust: built.exhaust,
      retain: built.retain,
      comboAfter: built.comboAfter,
      comboAnswer: built.comboAnswer,
      condition: built.condition,
      provides: built.provides,
    };
  }),
);

const CAPSTONE_CARDS: CardDef[] = [
  {
    id: "mega-card-consortium-validation",
    name: "联盟级外部验证",
    en: "Consortium-Scale Validation",
    category: "experiment",
    rarity: "rare",
    flavor: "五个中心、三种设备，以及一份终于能推广的结论。",
    flavorEn: "Five sites, three device families, and a conclusion that may finally generalize.",
    rules: "证据 +4、复现 +3、风险 -5；外部验证 +4、临床相关性 +2。本日耗尽。",
    rulesEn: "Evidence +4, Reproducibility +3, Risk -5; provides 4 external validation and 2 clinical relevance. Exhausts for the day.",
    focus: 3,
    gpu: 4,
    funding: 3,
    delta: { stats: { evidence: 4, reproducibility: 3 }, risk: -5 },
    answer: 4,
    tags: ["external", "clinical", "consortium"],
    exhaust: true,
    provides: { externalValidation: 4, clinicalRelevance: 2 },
  },
  {
    id: "mega-card-reproduction-capsule",
    name: "一键复现胶囊",
    en: "One-Click Reproduction Capsule",
    category: "rigor",
    rarity: "rare",
    flavor: "命令只有一行，而且在另一台机器上也能工作。",
    flavorEn: "The command is one line long, and it works on another machine.",
    rules: "复现 +5、清晰 +1、风险 -10；复现与代码发布各 +4，技术债清零。",
    rulesEn: "Reproducibility +5, Clarity +1, Risk -10; provides 4 reproducibility and code release; clears Technical Debt.",
    focus: 2,
    funding: 2,
    delta: { stats: { reproducibility: 5, clarity: 1 }, risk: -10 },
    answer: 4,
    tags: ["code", "environment", "release"],
    condition: { technicalDebt: -5, auditTrail: 2 },
    provides: { reproducibility: 4, codeRelease: 4, documentation: 2 },
  },
  {
    id: "mega-card-living-rebuttal",
    name: "活的回复矩阵",
    en: "Living Rebuttal Matrix",
    category: "writing",
    rarity: "rare",
    flavor: "每条意见都能追溯到实验、段落、图和提交记录。",
    flavorEn: "Every concern traces to an experiment, paragraph, figure, and commit.",
    rules: "清晰 +4；逐条回复 +4、文档 +3。实验牌后打出额外 +3 回应；保留。",
    rulesEn: "Clarity +4; provides 4 response writing and 3 documentation. Combo after Experiment: +3 Response. Retain.",
    focus: 2,
    delta: { stats: { clarity: 4 } },
    answer: 4,
    tags: ["rebuttal", "documentation", "matrix"],
    retain: true,
    comboAfter: "experiment",
    comboAnswer: 3,
    provides: { responseWriting: 4, documentation: 3 },
  },
  {
    id: "mega-card-compute-treaty",
    name: "实验室算力停战协议",
    en: "Laboratory Compute Treaty",
    category: "support",
    rarity: "rare",
    flavor: "第一次，GPU 排期没有使用全大写字母。",
    flavorEn: "For the first time, the GPU schedule contains no all-caps messages.",
    rules: "GPU +8、精神 +3、效率 +3；审稿人好感 +1。本日耗尽。",
    rulesEn: "GPU +8, Mental Health +3, provides 3 efficiency, and gains 1 Reviewer Favor. Exhausts for the day.",
    focus: 2,
    delta: { gpu: 8, mental: 3 },
    answer: 1,
    tags: ["support", "gpu", "efficiency"],
    exhaust: true,
    condition: { reviewerFavor: 1 },
    provides: { efficiency: 3 },
  },
  {
    id: "mega-card-negative-ledger",
    name: "失败实验总账",
    en: "Negative-Result Ledger",
    category: "rigor",
    rarity: "rare",
    flavor: "每个没成功的实验终于有了名字，而不是被覆盖的目录。",
    flavorEn: "Every failed experiment finally has a name instead of an overwritten folder.",
    rules: "证据 +2、复现 +4、风险 -18；统计、不确定性和文档各 +3。",
    rulesEn: "Evidence +2, Reproducibility +4, Risk -18; provides 3 statistics, uncertainty, and documentation.",
    focus: 2,
    mental: 1,
    delta: { stats: { evidence: 2, reproducibility: 4 }, risk: -18 },
    answer: 4,
    tags: ["negative", "statistics", "audit"],
    condition: { auditTrail: 2 },
    provides: { statistics: 3, uncertainty: 3, documentation: 3 },
  },
  {
    id: "mega-card-theory-clinic-bridge",
    name: "从定理到床旁",
    en: "From Theorem to Bedside",
    category: "experiment",
    rarity: "rare",
    flavor: "证明没有治好病人，但终于解释了该测什么。",
    flavorEn: "The proof treats no patient, but finally explains what should be measured.",
    rules: "创新 +3、证据 +3、清晰 +2；理论、因果与临床相关性各 +3。",
    rulesEn: "Novelty +3, Evidence +3, Clarity +2; provides 3 theory, causal reasoning, and clinical relevance.",
    focus: 3,
    gpu: 2,
    funding: 2,
    delta: { stats: { novelty: 3, evidence: 3, clarity: 2 } },
    answer: 4,
    tags: ["theory", "causal", "clinical"],
    provides: { theory: 3, causalReasoning: 3, clinicalRelevance: 3 },
  },
  {
    id: "mega-card-camera-pipeline",
    name: "终稿自动流水线",
    en: "Camera-Ready Pipeline",
    category: "support",
    rarity: "rare",
    flavor: "页数、字体、引用和匿名检查终于由机器焦虑。",
    flavorEn: "Page limits, fonts, citations, and anonymity are finally the machine's anxiety.",
    rules: "清晰 +3、复现 +3；格式 +4、可视化 +2、代码发布 +2，页数债 -5。",
    rulesEn: "Clarity +3, Reproducibility +3; provides 4 formatting, 2 visualization, and 2 code release; clears Page Debt.",
    focus: 2,
    delta: { stats: { clarity: 3, reproducibility: 3 } },
    answer: 3,
    tags: ["camera", "formatting", "automation"],
    condition: { pageDebt: -5 },
    provides: { formatting: 4, visualization: 2, codeRelease: 2 },
  },
  {
    id: "mega-card-perfect-dashboard",
    name: "只展示最完美的仪表盘",
    en: "The Perfect Dashboard",
    category: "questionable",
    rarity: "rare",
    flavor: "所有指标都向上，因为向下的没有被加载。",
    flavorEn: "Every metric goes up because the downward ones were never loaded.",
    rules: "创新、证据、清晰各 +4，回应 +5；风险 +30、技术债 +3。本日耗尽。",
    rulesEn: "Novelty, Evidence, and Clarity +4; +5 Response; Risk +30 and Technical Debt +3. Exhausts for the day.",
    focus: 0,
    risk: 30,
    delta: { stats: { novelty: 4, evidence: 4, clarity: 4 } },
    answer: 5,
    tags: ["dashboard", "cherry-pick", "claims"],
    exhaust: true,
    condition: { technicalDebt: 3 },
    provides: { visualization: 4, claimFraming: 3, statistics: 2 },
  },
];

export const MEGA_CARDS: CardDef[] = [...GENERATED_CARDS, ...CAPSTONE_CARDS];

interface RolePlan {
  id: string;
  name: string;
  en: string;
  symbol: string;
  pitch: string;
  pitchEn: string;
  passive: string;
  passiveEn: string;
  weakness: string;
  weaknessEn: string;
  stats: PaperStats;
  resources: RoleDef["resources"];
  trait: NonNullable<RoleDef["trait"]>;
  deckCapabilities: [Capability, Capability, Capability];
}

const ROLE_PLANS: RolePlan[] = [
  {
    id: "theory-first", name: "理论先行论文", en: "Theory-First Paper", symbol: "T",
    pitch: "证明写得很漂亮，实验部分还在排队。", pitchEn: "The proof is elegant. The experiments are still queued.",
    passive: "理论牌额外 +2 回应，相关牌少耗 1 经费。", passiveEn: "Theory cards gain +2 Response and cost 1 less Funding.",
    weakness: "临床相关性意见更难处理。", weaknessEn: "Clinical-relevance concerns are harder to address.",
    stats: { novelty: 5, evidence: 2, clarity: 3, reproducibility: 2 }, resources: { gpu: 8, funding: 9, mental: 14 },
    trait: { capability: "theory", answerBonus: 2, costResource: "funding", costReduction: 1 },
    deckCapabilities: ["theory", "ablation", "claimFraming"],
  },
  {
    id: "replication", name: "复现研究", en: "Replication Study", symbol: "R",
    pitch: "创新不多，但每一行命令都能运行。", pitchEn: "Not much novelty, but every command actually runs.",
    passive: "严谨牌与复现能力额外 +2 回应。", passiveEn: "Rigor cards with reproducibility gain +2 Response.",
    weakness: "创新性意见难度更高。", weaknessEn: "Novelty concerns are harder.",
    stats: { novelty: 1, evidence: 4, clarity: 3, reproducibility: 6 }, resources: { gpu: 10, funding: 8, mental: 16 },
    trait: { category: "rigor", capability: "reproducibility", answerBonus: 2 },
    deckCapabilities: ["reproducibility", "codeRelease", "documentation"],
  },
  {
    id: "multisite-clinical", name: "多中心临床研究", en: "Multi-Site Clinical Study", symbol: "C",
    pitch: "数据真实、流程复杂、每个中心都有自己的表格。", pitchEn: "The data are real, the workflow is complex, and every site has its own spreadsheet.",
    passive: "外部验证少耗 1 经费，并多获得 1 天。", passiveEn: "External-validation work costs 1 less Funding and starts with 1 extra day.",
    weakness: "理论解释较弱。", weaknessEn: "Theoretical-grounding concerns are harder.",
    stats: { novelty: 2, evidence: 5, clarity: 3, reproducibility: 4 }, resources: { gpu: 8, funding: 12, mental: 15 },
    trait: { capability: "externalValidation", answerBonus: 1, costResource: "funding", costReduction: 1, extraDays: 1 },
    deckCapabilities: ["externalValidation", "clinicalRelevance", "calibration"],
  },
  {
    id: "efficient-model", name: "高效模型论文", en: "Efficient Model Paper", symbol: "E",
    pitch: "不一定最大，但至少能在实验室机器上跑。", pitchEn: "It may not be the largest, but it runs on the lab machine.",
    passive: "效率牌少耗 1 GPU，并额外 +2 回应。", passiveEn: "Efficiency cards cost 1 less GPU and gain +2 Response.",
    weakness: "大规模比较容易被追问。", weaknessEn: "Large-scale comparison requests are harder.",
    stats: { novelty: 4, evidence: 3, clarity: 3, reproducibility: 4 }, resources: { gpu: 9, funding: 7, mental: 15 },
    trait: { capability: "efficiency", answerBonus: 2, costResource: "gpu", costReduction: 1 },
    deckCapabilities: ["efficiency", "comparison", "robustness"],
  },
  {
    id: "fairness-audit", name: "公平性审计", en: "Fairness Audit", symbol: "F",
    pitch: "平均值越漂亮，你越想看亚组。", pitchEn: "The prettier the mean, the more you want to inspect subgroups.",
    passive: "公平性能力额外 +2 回应，严谨牌少耗 1 精神。", passiveEn: "Fairness gains +2 Response; Rigor cards cost 1 less Mental Health.",
    weakness: "GPU 资源有限。", weaknessEn: "GPU resources are limited.",
    stats: { novelty: 3, evidence: 4, clarity: 4, reproducibility: 4 }, resources: { gpu: 6, funding: 10, mental: 16 },
    trait: { capability: "fairness", answerBonus: 2, costResource: "mental", costReduction: 1 },
    deckCapabilities: ["fairness", "ethics", "dataIntegrity"],
  },
  {
    id: "causal-paper", name: "因果推断论文", en: "Causal Inference Paper", symbol: "D",
    pitch: "每一条箭头都有假设，每一个假设都有审稿人。", pitchEn: "Every arrow has an assumption, and every assumption has a reviewer.",
    passive: "因果推理额外 +2 回应，起始多 1 张手牌。", passiveEn: "Causal reasoning gains +2 Response; start with 1 extra card in hand.",
    weakness: "可复现实现起点较低。", weaknessEn: "Implementation reproducibility starts low.",
    stats: { novelty: 5, evidence: 3, clarity: 3, reproducibility: 2 }, resources: { gpu: 7, funding: 10, mental: 14 },
    trait: { capability: "causalReasoning", answerBonus: 2, extraHand: 1 },
    deckCapabilities: ["causalReasoning", "protocol", "statistics"],
  },
  {
    id: "interpretable-ai", name: "可解释 AI 论文", en: "Interpretable AI Paper", symbol: "I",
    pitch: "模型解释了一切，除了为什么解释会变。", pitchEn: "The model explains everything except why the explanation changes.",
    passive: "可解释性牌额外 +2 回应，起始手牌 +1。", passiveEn: "Interpretability cards gain +2 Response and the opening hand gains 1 card.",
    weakness: "纯性能比较较弱。", weaknessEn: "Raw performance comparisons are weaker.",
    stats: { novelty: 4, evidence: 3, clarity: 5, reproducibility: 2 }, resources: { gpu: 9, funding: 8, mental: 14 },
    trait: { capability: "interpretability", answerBonus: 2, extraHand: 1 },
    deckCapabilities: ["interpretability", "visualization", "robustness"],
  },
  {
    id: "systems-paper", name: "系统论文", en: "Systems Paper", symbol: "Y",
    pitch: "吞吐量很好，文档要等下一个 release。", pitchEn: "Throughput is excellent. Documentation is scheduled for the next release.",
    passive: "代码发布牌少耗 1 GPU，额外 +2 回应。", passiveEn: "Code-release cards cost 1 less GPU and gain +2 Response.",
    weakness: "写作与临床叙事起点低。", weaknessEn: "Writing and clinical narrative start low.",
    stats: { novelty: 4, evidence: 4, clarity: 1, reproducibility: 5 }, resources: { gpu: 18, funding: 6, mental: 13 },
    trait: { capability: "codeRelease", answerBonus: 2, costResource: "gpu", costReduction: 1 },
    deckCapabilities: ["codeRelease", "efficiency", "reproducibility"],
  },
  {
    id: "open-science", name: "开放科学论文", en: "Open Science Paper", symbol: "O",
    pitch: "结果不总是漂亮，但实验记录非常诚实。", pitchEn: "The results are not always pretty, but the record is unusually honest.",
    passive: "第一张严谨牌风险成本 -4，并额外 +1 回应。", passiveEn: "The first Rigor card gains +1 Response and costs 4 less Risk.",
    weakness: "短期证据增长较慢。", weaknessEn: "Short-term Evidence grows more slowly.",
    stats: { novelty: 3, evidence: 3, clarity: 4, reproducibility: 6 }, resources: { gpu: 8, funding: 8, mental: 16 },
    trait: { category: "rigor", capability: "codeRelease", answerBonus: 1, costResource: "risk", costReduction: 4 },
    deckCapabilities: ["codeRelease", "documentation", "dataIntegrity"],
  },
  {
    id: "meta-analysis", name: "系统综述与元分析", en: "Systematic Review and Meta-Analysis", symbol: "Σ",
    pitch: "没有新模型，只有四百篇需要筛选的论文。", pitchEn: "No new model—only four hundred papers to screen.",
    passive: "相关工作少耗 1 经费，起始手牌 +1。", passiveEn: "Literature cards cost 1 less Funding and the opening hand gains 1 card.",
    weakness: "GPU 很少，实验牌更难承担。", weaknessEn: "GPU is scarce, making experiments harder to fund.",
    stats: { novelty: 2, evidence: 5, clarity: 5, reproducibility: 3 }, resources: { gpu: 3, funding: 12, mental: 15 },
    trait: { capability: "literature", answerBonus: 2, costResource: "funding", costReduction: 1, extraHand: 1 },
    deckCapabilities: ["literature", "statistics", "uncertainty"],
  },
  {
    id: "negative-results", name: "负结果论文", en: "Negative Results Paper", symbol: "0",
    pitch: "没有 SOTA，但避免了别人再浪费半年。", pitchEn: "No SOTA, but it may save someone else six months.",
    passive: "主张边界牌额外 +2 回应，起始多 1 天。", passiveEn: "Claim-framing cards gain +2 Response; start with 1 extra day.",
    weakness: "创新性上限较难建立。", weaknessEn: "High Novelty is difficult to establish.",
    stats: { novelty: 1, evidence: 4, clarity: 4, reproducibility: 6 }, resources: { gpu: 7, funding: 8, mental: 17 },
    trait: { capability: "claimFraming", answerBonus: 2, extraDays: 1 },
    deckCapabilities: ["claimFraming", "uncertainty", "documentation"],
  },
  {
    id: "deployment", name: "工业部署论文", en: "Deployment Paper", symbol: "P",
    pitch: "模型已经上线，所以每个 bug 都有真实用户。", pitchEn: "The model is deployed, so every bug has real users.",
    passive: "鲁棒性牌少耗 1 GPU，额外 +1 回应。", passiveEn: "Robustness cards cost 1 less GPU and gain +1 Response.",
    weakness: "理论创新容易被质疑。", weaknessEn: "Theoretical novelty is easier to challenge.",
    stats: { novelty: 3, evidence: 5, clarity: 3, reproducibility: 5 }, resources: { gpu: 14, funding: 9, mental: 13 },
    trait: { capability: "robustness", answerBonus: 1, costResource: "gpu", costReduction: 1 },
    deckCapabilities: ["robustness", "efficiency", "documentation"],
  },
  {
    id: "rapid-communication", name: "快速通讯", en: "Rapid Communication", symbol: "Q",
    pitch: "页数很短，截止日更短。", pitchEn: "The paper is short. The deadline is shorter.",
    passive: "写作牌少耗 1 专注，起始多 1 天。", passiveEn: "Writing cards cost 1 less Focus; start with 1 extra day.",
    weakness: "可复现细节空间不足。", weaknessEn: "There is little room for reproducibility details.",
    stats: { novelty: 5, evidence: 3, clarity: 4, reproducibility: 1 }, resources: { gpu: 10, funding: 6, mental: 12 },
    trait: { category: "writing", answerBonus: 1, costResource: "focus", costReduction: 1, extraDays: 1 },
    deckCapabilities: ["responseWriting", "claimFraming", "visualization"],
  },
  {
    id: "interdisciplinary", name: "跨学科论文", en: "Interdisciplinary Paper", symbol: "X",
    pitch: "每个领域都觉得另外两个领域解释得不够。", pitchEn: "Every field believes the other two are under-explained.",
    passive: "逐条回复额外 +2 回应，起始手牌 +1。", passiveEn: "Response writing gains +2 Response; opening hand +1.",
    weakness: "精神资源较紧。", weaknessEn: "Mental Health is tighter than usual.",
    stats: { novelty: 4, evidence: 3, clarity: 3, reproducibility: 3 }, resources: { gpu: 10, funding: 9, mental: 12 },
    trait: { capability: "responseWriting", answerBonus: 2, extraHand: 1 },
    deckCapabilities: ["responseWriting", "literature", "interpretability"],
  },
  {
    id: "benchmark-challenge", name: "基准挑战论文", en: "Benchmark Challenge Paper", symbol: "B",
    pitch: "排行榜第一，直到审稿人问比较是否公平。", pitchEn: "First on the leaderboard until the reviewer asks whether comparison was fair.",
    passive: "比较能力额外 +2 回应，相关实验少耗 1 GPU。", passiveEn: "Comparison gains +2 Response and relevant experiments cost 1 less GPU.",
    weakness: "伦理与实际价值叙事较弱。", weaknessEn: "Ethics and real-world value are less developed.",
    stats: { novelty: 4, evidence: 6, clarity: 2, reproducibility: 2 }, resources: { gpu: 16, funding: 6, mental: 13 },
    trait: { capability: "comparison", answerBonus: 2, costResource: "gpu", costReduction: 1 },
    deckCapabilities: ["comparison", "statistics", "efficiency"],
  },
];

export const MEGA_ROLES: RoleDef[] = ROLE_PLANS.map((role) => ({
  id: `mega-role-${role.id}`,
  name: role.name,
  en: role.en,
  symbol: role.symbol,
  pitch: role.pitch,
  pitchEn: role.pitchEn,
  passive: role.passive,
  passiveEn: role.passiveEn,
  weakness: role.weakness,
  weaknessEn: role.weaknessEn,
  stats: role.stats,
  resources: role.resources,
  trait: role.trait,
}));

interface StagePlan {
  stage: StageId;
  slug: string;
  difficulty: (topicIndex: number) => number;
  severity: (topicIndex: number) => 1 | 2 | 3;
  quoteZh: (topic: CapabilityTopic) => string;
  quoteEn: (topic: CapabilityTopic) => string;
  noteZh: (topic: CapabilityTopic) => string;
  noteEn: (topic: CapabilityTopic) => string;
}

const STAGE_PLANS: StagePlan[] = [
  {
    stage: "reviewer1",
    slug: "r1",
    difficulty: (index) => 5 + (index % 3),
    severity: (index) => (index % 6 === 0 ? 2 : 1),
    quoteZh: (topic) => `请进一步说明${topic.zh}；目前尚不清楚${topic.concernZh}。`,
    quoteEn: (topic) => `Please clarify the ${topic.en}; it is not yet clear ${topic.concernEn}.`,
    noteZh: (topic) => `第一轮关注可验证的基本完整性：${topic.actionZh}。`,
    noteEn: (topic) => `The first review asks for a verifiable minimum: ${topic.actionEn}.`,
  },
  {
    stage: "reviewer2",
    slug: "r2",
    difficulty: (index) => 8 + (index % 4),
    severity: (index) => (index % 3 === 0 ? 3 : 2),
    quoteZh: (topic) => `修订稿仍未建立可信的${topic.zh}，尤其无法判断${topic.concernZh}。`,
    quoteEn: (topic) => `The revision still fails to establish credible ${topic.en}, especially ${topic.concernEn}.`,
    noteZh: (topic) => `Reviewer #2 要求正面回应，而不是再补一句“未来工作”：${topic.actionZh}。`,
    noteEn: (topic) => `Reviewer #2 wants a direct answer, not another future-work sentence: ${topic.actionEn}.`,
  },
  {
    stage: "editor",
    slug: "editor",
    difficulty: (index) => 9 + (index % 3),
    severity: () => 3,
    quoteZh: (topic) => `编辑决定取决于论文能否充分支撑其${topic.zh}主张。`,
    quoteEn: (topic) => `The editorial decision depends on whether the paper adequately supports its ${topic.en} claims.`,
    noteZh: (topic) => `编辑会综合证据、边界和透明度判断：${topic.actionZh}。`,
    noteEn: (topic) => `The editor weighs evidence, scope, and transparency: ${topic.actionEn}.`,
  },
  {
    stage: "camera",
    slug: "camera",
    difficulty: (index) => 7 + (index % 3),
    severity: (index) => (index % 4 === 0 ? 3 : 2),
    quoteZh: (topic) => `终稿材料没有一致、完整地记录${topic.zh}。`,
    quoteEn: (topic) => `The camera-ready materials do not document ${topic.en} consistently or completely.`,
    noteZh: (topic) => `最后检查要求读者无需猜测即可复核：${topic.actionZh}。`,
    noteEn: (topic) => `The final check expects readers to verify this without guessing: ${topic.actionEn}.`,
  },
  {
    stage: "coauthor",
    slug: "coauthor",
    difficulty: (index) => 10 + (index % 4),
    severity: () => 3,
    quoteZh: (topic) => `合作者：我们能不能在截止前围绕${topic.zh}重写整篇故事？`,
    quoteEn: (topic) => `Coauthor: Can we rebuild the entire story around ${topic.en} before the deadline?`,
    noteZh: (topic) => `隐藏 Boss 把技术问题升级成叙事问题：${topic.actionZh}。`,
    noteEn: (topic) => `The hidden boss turns a technical concern into a narrative crisis: ${topic.actionEn}.`,
  },
];

function routeRequirement(
  id: string,
  capability: Capability,
  label: string,
  labelEn: string,
  target: number,
) {
  return { id, capability, label, labelEn, target };
}

function buildRoutes(
  commentId: string,
  topic: CapabilityTopic,
  severity: 1 | 2 | 3,
): ResolutionRoute[] {
  const coreTarget = severity + 1;
  const supportTarget = severity === 3 ? 2 : 1;
  const transparencyCapability: Capability =
    topic.capability === "documentation" ? "reproducibility" : "documentation";
  const scopeCapability: Capability =
    topic.capability === "claimFraming" ? "responseWriting" : "claimFraming";

  return [
    {
      id: "verify",
      name: "直接验证",
      nameEn: "Verify Directly",
      summary: `用实验或分析正面建立${topic.zh}。`,
      summaryEn: `Establish ${topic.en} directly with experiments or analysis.`,
      requirements: [
        routeRequirement(
          `${commentId}-verify-core`,
          topic.capability,
          `${topic.zh}证据`,
          `${topic.stemEn} evidence`,
          coreTarget,
        ),
        routeRequirement(
          `${commentId}-verify-support`,
          topic.ally,
          "互补验证",
          "Supporting validation",
          supportTarget,
        ),
      ],
      resolutionDelta: { stats: { evidence: 1, reproducibility: 1 }, gpu: severity === 3 ? -1 : 0 },
      followUpChance: severity === 3 ? 0.22 : 0.14,
      followUpCapability: topic.ally,
    },
    {
      id: "scope",
      name: "收窄主张",
      nameEn: "Narrow the Claim",
      summary: `承认${topic.zh}的边界，并让文字与证据重新对齐。`,
      summaryEn: `Acknowledge the limits of ${topic.en} and realign prose with evidence.`,
      requirements: [
        routeRequirement(
          `${commentId}-scope-frame`,
          scopeCapability,
          "边界重写",
          "Scope reframing",
          coreTarget,
        ),
        routeRequirement(
          `${commentId}-scope-response`,
          "responseWriting",
          "逐条解释",
          "Point-by-point explanation",
          supportTarget,
        ),
      ],
      resolutionDelta: { stats: { novelty: -1, clarity: 2 }, risk: -2 },
      followUpChance: 0.08,
      followUpCapability: "literature",
    },
    {
      id: "transparent",
      name: "透明披露",
      nameEn: "Disclose Transparently",
      summary: `完整公开${topic.zh}的决策、失败与限制。`,
      summaryEn: `Disclose the decisions, failures, and limits around ${topic.en}.`,
      requirements: [
        routeRequirement(
          `${commentId}-transparent-docs`,
          transparencyCapability,
          "透明文档",
          "Transparent documentation",
          coreTarget,
        ),
        routeRequirement(
          `${commentId}-transparent-ethics`,
          "ethics",
          "责任说明",
          "Responsibility statement",
          supportTarget,
        ),
      ],
      resolutionDelta: { stats: { reproducibility: 2 }, risk: -(2 + severity) },
      followUpChance: 0.11,
      followUpCapability: "documentation",
    },
  ];
}

export const MEGA_COMMENTS: CommentDef[] = STAGE_PLANS.flatMap((stagePlan) =>
  CAPABILITY_TOPICS.map((topic, topicIndex) => {
    const id = `mega-comment-${stagePlan.slug}-${topic.slug}`;
    const severity = stagePlan.severity(topicIndex);
    return {
      id,
      stage: stagePlan.stage,
      quote: stagePlan.quoteEn(topic),
      quoteZh: stagePlan.quoteZh(topic),
      note: stagePlan.noteZh(topic),
      noteEn: stagePlan.noteEn(topic),
      primary: topic.primary,
      secondary: topic.secondary,
      difficulty: stagePlan.difficulty(topicIndex),
      severity,
      tags: [...topic.tags, topic.capability, stagePlan.stage],
      routes: buildRoutes(id, topic, severity),
    };
  }),
);

interface EventIncident {
  id: string;
  titleZh: string;
  titleEn: string;
  descriptionZh: string;
  descriptionEn: string;
}

type EventFamilyKind =
  | "power"
  | "server"
  | "advisor"
  | "coauthor"
  | "data"
  | "compute"
  | "statistics"
  | "formatting"
  | "ethics"
  | "funding"
  | "community"
  | "venue"
  | "wellbeing"
  | "competition"
  | "collaboration"
  | "publicity";

interface EventFamily {
  id: string;
  icon: string;
  kind: EventFamilyKind;
  incidents: [EventIncident, EventIncident, EventIncident, EventIncident, EventIncident, EventIncident];
}

const EVENT_FAMILIES: EventFamily[] = [
  {
    id: "power",
    icon: "⚡",
    kind: "power",
    incidents: [
      { id: "lab-blackout", titleZh: "实验室断电", titleEn: "Laboratory Blackout", descriptionZh: "整层楼突然安静，只有 UPS 在尖叫。", descriptionEn: "The entire floor goes quiet except for the UPS alarms." },
      { id: "ups-alarm", titleZh: "UPS 电池报警", titleEn: "UPS Battery Alarm", descriptionZh: "屏幕显示还剩九分钟，训练显示还剩十一分钟。", descriptionEn: "The battery says nine minutes; training says eleven." },
      { id: "cooling-failure", titleZh: "机房制冷故障", titleEn: "Server-Room Cooling Failure", descriptionZh: "GPU 温度比审稿意见更快上升。", descriptionEn: "GPU temperature rises faster than the review thread." },
      { id: "circuit-inspection", titleZh: "校园电路临检", titleEn: "Emergency Circuit Inspection", descriptionZh: "设施部门给了十五分钟保存一切。", descriptionEn: "Facilities gives the lab fifteen minutes to save everything." },
      { id: "overnight-brownout", titleZh: "夜间电压不稳", titleEn: "Overnight Brownout", descriptionZh: "三个作业活了下来，没人知道为什么。", descriptionEn: "Three jobs survive, and nobody knows why." },
      { id: "power-drill", titleZh: "大楼停电演练", titleEn: "Building Power Drill", descriptionZh: "演练很成功，实验很失败。", descriptionEn: "The drill succeeds. The experiment does not." },
    ],
  },
  {
    id: "server",
    icon: "▣",
    kind: "server",
    incidents: [
      { id: "scheduled-maintenance", titleZh: "服务器计划维修", titleEn: "Scheduled Server Maintenance", descriptionZh: "通知邮件发于三周前，当然没人看见。", descriptionEn: "The notice was sent three weeks ago, so naturally nobody saw it." },
      { id: "login-reboot", titleZh: "登录节点重启", titleEn: "Login Node Reboot", descriptionZh: "你的 tmux 会话决定结束这段关系。", descriptionEn: "Your tmux session decides to end the relationship." },
      { id: "storage-migration", titleZh: "共享盘迁移", titleEn: "Shared Storage Migration", descriptionZh: "数据正在搬家，截止日没有。", descriptionEn: "The data are moving. The deadline is not." },
      { id: "certificate-expiry", titleZh: "集群证书过期", titleEn: "Cluster Certificate Expiry", descriptionZh: "所有节点都在线，但没有人被允许相信它们。", descriptionEn: "Every node is online, but none can be trusted." },
      { id: "kernel-upgrade", titleZh: "内核强制升级", titleEn: "Mandatory Kernel Upgrade", descriptionZh: "驱动、CUDA 和现实停止兼容。", descriptionEn: "Drivers, CUDA, and reality stop being compatible." },
      { id: "readonly-filesystem", titleZh: "文件系统变成只读", titleEn: "Filesystem Turns Read-Only", descriptionZh: "模型能推理，磁盘拒绝表达意见。", descriptionEn: "The model can infer; the disk refuses to express itself." },
    ],
  },
  {
    id: "advisor",
    icon: "✦",
    kind: "advisor",
    incidents: [
      { id: "rewrite-story", titleZh: "导师决定重写故事", titleEn: "Advisor Reframes the Story", descriptionZh: "“方法没变，只需要把整篇论文换个角度。”", descriptionEn: "'The method stays; only the entire paper needs a new angle.'" },
      { id: "new-title", titleZh: "午夜的新标题", titleEn: "A New Title at Midnight", descriptionZh: "标题改了七个词，其中六个影响摘要。", descriptionEn: "Seven title words change; six of them affect the abstract." },
      { id: "clinical-pivot", titleZh: "突然转向临床价值", titleEn: "Sudden Clinical Pivot", descriptionZh: "导师刚参加完一场医学合作会议。", descriptionEn: "Your advisor has just returned from a medical collaboration meeting." },
      { id: "theory-pivot", titleZh: "突然需要理论保证", titleEn: "Sudden Theory Pivot", descriptionZh: "“加一个定理应该不会太久吧？”", descriptionEn: "'Adding one theorem should not take long, right?'" },
      { id: "causal-pivot", titleZh: "导师发现因果推断", titleEn: "Advisor Discovers Causal Inference", descriptionZh: "架构图旁边突然多了一个 DAG。", descriptionEn: "A DAG suddenly appears beside the architecture diagram." },
      { id: "simplify-expand", titleZh: "既简化又扩展", titleEn: "Simplify and Expand", descriptionZh: "两个要求都很合理，只是不能同时完成。", descriptionEn: "Both requests are reasonable, just not simultaneously." },
    ],
  },
  {
    id: "coauthor",
    icon: "…",
    kind: "coauthor",
    incidents: [
      { id: "missing", titleZh: "合作者失联", titleEn: "Coauthor Goes Missing", descriptionZh: "最后上线时间是你发出 rebuttal 草稿前一分钟。", descriptionEn: "They were last online one minute before you sent the rebuttal draft." },
      { id: "vacation-reply", titleZh: "自动回复：正在休假", titleEn: "Auto-Reply: On Vacation", descriptionZh: "返回日期是截止日后的第二天。", descriptionEn: "The return date is two days after the deadline." },
      { id: "timezone-silence", titleZh: "时区沉默", titleEn: "Time-Zone Silence", descriptionZh: "你醒着时对方睡着，对方醒着时你在跑实验。", descriptionEn: "They sleep while you are awake; you run experiments while they are awake." },
      { id: "empty-track-changes", titleZh: "空白修订记录", titleEn: "Empty Track Changes", descriptionZh: "文件名叫 revised，但内容与昨天完全相同。", descriptionEn: "The file is called revised and is identical to yesterday's version." },
      { id: "missed-call", titleZh: "错过 rebuttal 会议", titleEn: "Missed Rebuttal Call", descriptionZh: "会议纪要只有一句：等大家到齐再讨论。", descriptionEn: "The minutes contain one line: discuss when everyone is present." },
      { id: "signature-pending", titleZh: "作者确认未完成", titleEn: "Author Confirmation Pending", descriptionZh: "投稿系统在最后一位作者旁边显示红点。", descriptionEn: "The portal shows a red dot beside the final author." },
    ],
  },
  {
    id: "data",
    icon: "◇",
    kind: "data",
    incidents: [
      { id: "checksum", titleZh: "数据校验和不一致", titleEn: "Dataset Checksum Mismatch", descriptionZh: "两个同名压缩包产生了不同结果。", descriptionEn: "Two identically named archives produce different results." },
      { id: "duplicate-patients", titleZh: "发现重复患者", titleEn: "Duplicate Patients Found", descriptionZh: "训练集和测试集在候诊室见过面。", descriptionEn: "The train and test sets have met in the waiting room." },
      { id: "labels-revised", titleZh: "标签被重新修订", titleEn: "Labels Are Revised", descriptionZh: "专家共识更新了，表 1 没有。", descriptionEn: "Expert consensus changes; Table 1 does not." },
      { id: "schema-change", titleZh: "数据供应方修改字段", titleEn: "Data Provider Changes the Schema", descriptionZh: "age 现在是字符串，unknown 现在是数字。", descriptionEn: "Age is now a string; unknown is now a number." },
      { id: "test-leak", titleZh: "测试集答案泄漏", titleEn: "Test Labels Leak", descriptionZh: "一个辅助文件比 README 更乐于助人。", descriptionEn: "A helper file is more helpful than the README intended." },
      { id: "mirror-deleted", titleZh: "数据镜像被删除", titleEn: "Dataset Mirror Is Deleted", descriptionZh: "原始链接和备份链接同时返回 404。", descriptionEn: "Both the original and backup links return 404." },
    ],
  },
  {
    id: "compute",
    icon: "▰",
    kind: "compute",
    incidents: [
      { id: "queue-47h", titleZh: "预计排队 47 小时", titleEn: "Estimated Queue Time: 47 Hours", descriptionZh: "前面的作业叫 final_final_v12。", descriptionEn: "The job ahead is called final_final_v12." },
      { id: "preempted", titleZh: "训练任务被抢占", titleEn: "Training Job Is Preempted", descriptionZh: "高优先级用户发现了你的最后一个 epoch。", descriptionEn: "A high-priority user discovers your final epoch." },
      { id: "a100-reassigned", titleZh: "A100 被临时调走", titleEn: "A100 Is Reassigned", descriptionZh: "“临时”在集群管理语境中没有结束日期。", descriptionEn: "'Temporary' has no end date in cluster administration." },
      { id: "cloud-expired", titleZh: "云额度过期", titleEn: "Cloud Credits Expire", descriptionZh: "额度午夜过期，训练预计 00:07 完成。", descriptionEn: "Credits expire at midnight; training ends at 00:07." },
      { id: "driver-mismatch", titleZh: "驱动版本不匹配", titleEn: "Driver Version Mismatch", descriptionZh: "容器理解 CUDA，宿主机选择不理解。", descriptionEn: "The container understands CUDA; the host chooses not to." },
      { id: "sweep-overrun", titleZh: "参数扫描超出预算", titleEn: "Sweep Exceeds Its Budget", descriptionZh: "搜索空间的最后一维原来不是离散的。", descriptionEn: "The final search dimension was not discrete after all." },
    ],
  },
  {
    id: "statistics",
    icon: "Σ",
    kind: "statistics",
    incidents: [
      { id: "p-051", titleZh: "p = 0.051", titleEn: "p = 0.051", descriptionZh: "它离显著只差一个不诚实的决定。", descriptionEn: "It is one dishonest decision away from significance." },
      { id: "ci-crosses-zero", titleZh: "置信区间跨过零", titleEn: "Confidence Interval Crosses Zero", descriptionZh: "均值向上，误差条保持开放态度。", descriptionEn: "The mean points upward; the interval remains open-minded." },
      { id: "fold-zero", titleZh: "一个 Fold 的指标为零", titleEn: "One Fold Scores Zero", descriptionZh: "平均值还能看，那个零却无法不看。", descriptionEn: "The mean survives; the zero refuses to be ignored." },
      { id: "effect-reversal", titleZh: "效应方向反转", titleEn: "Effect Direction Reverses", descriptionZh: "控制协变量后，箭头决定掉头。", descriptionEn: "After adjustment, the arrow changes direction." },
      { id: "subgroup-flip", titleZh: "亚组结论相反", titleEn: "Subgroup Result Flips", descriptionZh: "总体结论在两个亚组中分别成立和不成立。", descriptionEn: "The aggregate conclusion holds in one subgroup and reverses in another." },
      { id: "correction-erases", titleZh: "校正后不再显著", titleEn: "Correction Removes Significance", descriptionZh: "星号消失了，数据没有。", descriptionEn: "The star disappears. The data remain." },
    ],
  },
  {
    id: "formatting",
    icon: "Aa",
    kind: "formatting",
    incidents: [
      { id: "table-overflow", titleZh: "表格超出双栏", titleEn: "Table Exceeds Two Columns", descriptionZh: "只超出四毫米，但编辑系统很在意。", descriptionEn: "It exceeds by four millimeters; the portal cares deeply." },
      { id: "font-missing", titleZh: "终稿字体丢失", titleEn: "Camera-Ready Font Missing", descriptionZh: "PDF 在另一台机器上变成现代艺术。", descriptionEn: "The PDF becomes modern art on another machine." },
      { id: "figure-72dpi", titleZh: "主图只有 72 DPI", titleEn: "Main Figure Is 72 DPI", descriptionZh: "屏幕截图的历史终于追上了你。", descriptionEn: "The history of screenshots finally catches up." },
      { id: "broken-references", titleZh: "引用编号全部错位", titleEn: "Reference Numbers Drift", descriptionZh: "第 12 条引用现在指向一篇海洋生物论文。", descriptionEn: "Reference 12 now points to a marine-biology paper." },
      { id: "page-limit", titleZh: "超出页数 1.7 页", titleEn: "Over the Limit by 1.7 Pages", descriptionZh: "方法不能删，致谢也不敢删。", descriptionEn: "Methods cannot go; acknowledgements are politically protected." },
      { id: "supplement-corrupt", titleZh: "补充材料损坏", titleEn: "Supplement Is Corrupted", descriptionZh: "唯一能打开的文件是 thumbs.db。", descriptionEn: "The only readable file is thumbs.db." },
    ],
  },
  {
    id: "ethics",
    icon: "⚖",
    kind: "ethics",
    incidents: [
      { id: "irb-amendment", titleZh: "伦理审查要求补件", titleEn: "IRB Amendment Requested", descriptionZh: "委员会想知道二次分析到底是不是二次分析。", descriptionEn: "The board asks whether the secondary analysis is actually secondary." },
      { id: "license-change", titleZh: "数据许可突然更新", titleEn: "Dataset License Changes", descriptionZh: "昨天允许研究，今天需要单独批准。", descriptionEn: "Yesterday it allowed research; today it requires separate approval." },
      { id: "consent-mismatch", titleZh: "同意书用途不匹配", titleEn: "Consent Scope Mismatch", descriptionZh: "模型用途比原始同意书多了两个形容词。", descriptionEn: "The model's use has two more adjectives than the consent form." },
      { id: "sensitive-field", titleZh: "发现敏感人口字段", titleEn: "Sensitive Demographic Field Found", descriptionZh: "字段隐藏在名为 misc 的列里。", descriptionEn: "The field is hidden in a column named misc." },
      { id: "dual-use", titleZh: "双重用途担忧", titleEn: "Dual-Use Concern", descriptionZh: "一个漂亮的 demo 也展示了不漂亮的可能性。", descriptionEn: "A polished demo reveals an unpolished possibility." },
      { id: "deletion-request", titleZh: "收到数据删除请求", titleEn: "Data Deletion Request Arrives", descriptionZh: "请求合法、紧急，并影响三个派生表。", descriptionEn: "The request is valid, urgent, and affects three derived tables." },
    ],
  },
  {
    id: "funding",
    icon: "$",
    kind: "funding",
    incidents: [
      { id: "grant-freeze", titleZh: "经费账户冻结", titleEn: "Grant Account Frozen", descriptionZh: "财务系统需要一份你从未听过的附件。", descriptionEn: "Finance requires an attachment you have never heard of." },
      { id: "reimbursement", titleZh: "报销截止日", titleEn: "Reimbursement Deadline", descriptionZh: "今天不提交，去年也不会报销。", descriptionEn: "If it is not filed today, last year will never be reimbursed." },
      { id: "cloud-bill", titleZh: "云账单异常", titleEn: "Cloud Bill Anomaly", descriptionZh: "一个忘记关闭的实例学会了复利。", descriptionEn: "A forgotten instance discovers compound interest." },
      { id: "procurement-delay", titleZh: "采购流程延迟", titleEn: "Procurement Delay", descriptionZh: "显卡已经到货，资产编号还在旅行。", descriptionEn: "The GPU has arrived; its asset number is still traveling." },
      { id: "travel-reallocated", titleZh: "差旅经费可调剂", titleEn: "Travel Funds Can Be Reallocated", descriptionZh: "会议改线上，预算第一次显得有希望。", descriptionEn: "The conference goes online; the budget shows hope." },
      { id: "budget-audit", titleZh: "课题预算审计", titleEn: "Project Budget Audit", descriptionZh: "每一笔“其他”都需要变成一个完整句子。", descriptionEn: "Every 'miscellaneous' expense must become a complete sentence." },
    ],
  },
  {
    id: "community",
    icon: "⌘",
    kind: "community",
    incidents: [
      { id: "anonymous-issue", titleZh: "匿名复现问题", titleEn: "Anonymous Reproduction Issue", descriptionZh: "最小示例只有七行，并且确实失败。", descriptionEn: "The minimal example is seven lines long and genuinely fails." },
      { id: "baseline-bug", titleZh: "基线作者发现 Bug", titleEn: "Baseline Author Reports a Bug", descriptionZh: "Bug 同时提高了你和基线的分数。", descriptionEn: "The bug improves both your score and the baseline's." },
      { id: "ci-failure", titleZh: "公开仓库 CI 全红", titleEn: "Public CI Turns Red", descriptionZh: "本地仍然能运行，这句话没有帮助。", descriptionEn: "It still works locally, which helps nobody." },
      { id: "docker-fails", titleZh: "Docker 镜像无法启动", titleEn: "Docker Image Will Not Start", descriptionZh: "镜像是可复现的：它在每台机器上都失败。", descriptionEn: "The image is reproducible: it fails on every machine." },
      { id: "replication-preprint", titleZh: "出现独立复现预印本", titleEn: "Independent Replication Appears", descriptionZh: "结果方向相同，数值没有那么漂亮。", descriptionEn: "The direction agrees; the numbers are less flattering." },
      { id: "dependency-cve", titleZh: "依赖库曝出漏洞", titleEn: "Dependency Vulnerability Disclosed", descriptionZh: "安全公告准确列出了你的版本号。", descriptionEn: "The advisory names your exact version." },
    ],
  },
  {
    id: "venue",
    icon: "◷",
    kind: "venue",
    incidents: [
      { id: "deadline-moved", titleZh: "截止日提前", titleEn: "Deadline Moves Forward", descriptionZh: "时区换算没有错，主办方真的少给了一天。", descriptionEn: "Your time-zone math is right; the organizers removed a day." },
      { id: "track-transfer", titleZh: "论文被转到新 Track", titleEn: "Paper Moves to Another Track", descriptionZh: "新 Track 的关键词与你的摘要只有一个重合。", descriptionEn: "The new track shares one keyword with your abstract." },
      { id: "short-rebuttal", titleZh: "Rebuttal 字数减半", titleEn: "Rebuttal Limit Is Halved", descriptionZh: "感谢审稿人的句子已经占了三分之一。", descriptionEn: "Thanking the reviewers already consumes one third." },
      { id: "template-update", titleZh: "模板临时更新", titleEn: "Submission Template Updates", descriptionZh: "新版模板改变了边距和你的血压。", descriptionEn: "The new template changes the margins and your blood pressure." },
      { id: "desk-check", titleZh: "编辑部追加桌面检查", titleEn: "Editorial Desk Check Added", descriptionZh: "系统要求一份从未在征稿启事出现的清单。", descriptionEn: "The portal requests a checklist absent from the call." },
      { id: "conference-postponed", titleZh: "会议延期", titleEn: "Conference Is Postponed", descriptionZh: "截止日延后了，相关工作也会继续增长。", descriptionEn: "The deadline moves back; related work will keep growing too." },
    ],
  },
  {
    id: "wellbeing",
    icon: "☕",
    kind: "wellbeing",
    incidents: [
      { id: "coffee-broken", titleZh: "咖啡机坏了", titleEn: "Coffee Machine Breaks", descriptionZh: "实验室进入未经审批的人体试验。", descriptionEn: "The lab enters an unapproved human-subjects experiment." },
      { id: "lab-flu", titleZh: "实验室集体感冒", titleEn: "The Lab Catches a Cold", descriptionZh: "群聊里的咳嗽表情比实验结果多。", descriptionEn: "The group chat has more cough emojis than results." },
      { id: "fire-drill", titleZh: "消防演练", titleEn: "Fire Drill", descriptionZh: "你第一次在白天看见实验楼外墙。", descriptionEn: "You see the outside of the building in daylight." },
      { id: "all-nighter", titleZh: "连续第二个通宵", titleEn: "Second All-Nighter", descriptionZh: "凌晨四点的逻辑非常有说服力，直到早上。", descriptionEn: "Four-a.m. logic is persuasive until morning." },
      { id: "quiet-room", titleZh: "安静室被预约满", titleEn: "Quiet Room Fully Booked", descriptionZh: "唯一空位在打印机和咖啡机之间。", descriptionEn: "The only free seat is between the printer and coffee machine." },
      { id: "unexpected-weekend", titleZh: "意外空出的周末", titleEn: "An Unexpected Free Weekend", descriptionZh: "会议取消了，两天空白出现在日历里。", descriptionEn: "A meeting is canceled; two blank days appear on the calendar." },
    ],
  },
  {
    id: "competition",
    icon: "↗",
    kind: "competition",
    incidents: [
      { id: "competing-preprint", titleZh: "竞争预印本上线", titleEn: "Competing Preprint Appears", descriptionZh: "标题相似度 73%，上传时间早一天。", descriptionEn: "The title is 73% similar and one day earlier." },
      { id: "new-sota", titleZh: "新 SOTA 刷新榜单", titleEn: "A New SOTA Tops the Board", descriptionZh: "领先幅度刚好大于你的提升。", descriptionEn: "Its margin is just larger than your claimed gain." },
      { id: "benchmark-retired", titleZh: "主基准被宣布过时", titleEn: "Main Benchmark Is Retired", descriptionZh: "社区终于承认它有问题，恰好在你跑完之后。", descriptionEn: "The community admits its flaws just after you finish running it." },
      { id: "policy-change", titleZh: "领域政策突然改变", titleEn: "Field Policy Changes", descriptionZh: "昨天的创新点今天变成最低要求。", descriptionEn: "Yesterday's novelty becomes today's minimum requirement." },
      { id: "viral-critique", titleZh: "同方向批评文章走红", titleEn: "A Critique of the Field Goes Viral", descriptionZh: "其中三个问题与你的方法有关。", descriptionEn: "Three of its concerns apply directly to your method." },
      { id: "new-dataset", titleZh: "更难的新数据集发布", titleEn: "A Harder Dataset Launches", descriptionZh: "下载按钮旁边写着“欢迎提交基线”。", descriptionEn: "The download button says, 'Baselines welcome.'" },
    ],
  },
  {
    id: "collaboration",
    icon: "✚",
    kind: "collaboration",
    incidents: [
      { id: "statistician-free", titleZh: "统计顾问今天有空", titleEn: "Statistician Has Office Hours", descriptionZh: "预约表上出现了传说中的空位。", descriptionEn: "A legendary open slot appears on the calendar." },
      { id: "librarian-help", titleZh: "图书馆员修好 BibTeX", titleEn: "Librarian Repairs BibTeX", descriptionZh: "对方拒绝了共同作者署名。", descriptionEn: "They decline coauthorship." },
      { id: "clinician-feedback", titleZh: "临床专家给出具体反馈", titleEn: "Clinician Gives Concrete Feedback", descriptionZh: "不是“很有潜力”，而是三条可执行建议。", descriptionEn: "Not 'promising'—three actionable suggestions." },
      { id: "engineer-fixes-ci", titleZh: "工程师修好 CI", titleEn: "Engineer Fixes the CI", descriptionZh: "问题是一个你看了三小时的空格。", descriptionEn: "The problem was a space you stared at for three hours." },
      { id: "labmate-plot", titleZh: "同门发现关键图", titleEn: "Labmate Finds the Missing Plot", descriptionZh: "那张图一直在 logs/archive/old 里。", descriptionEn: "The plot was in logs/archive/old all along." },
      { id: "consortium-invite", titleZh: "收到联盟验证邀请", titleEn: "Consortium Validation Invite", descriptionZh: "对方有数据，你有一个勉强能运行的脚本。", descriptionEn: "They have data; you have a script that almost runs." },
    ],
  },
  {
    id: "publicity",
    icon: "@",
    kind: "publicity",
    incidents: [
      { id: "first-citation", titleZh: "预印本收到第一条引用", titleEn: "Preprint Gets Its First Citation", descriptionZh: "虽然是自引，但来自另一个团队。", descriptionEn: "It is a self-citation, but from another team." },
      { id: "poster-award", titleZh: "海报意外获奖", titleEn: "Poster Wins an Award", descriptionZh: "评委最喜欢你差点删掉的失败案例。", descriptionEn: "The judges love the failure case you nearly deleted." },
      { id: "press-office", titleZh: "宣传部门要求新闻稿", titleEn: "Press Office Requests a Release", descriptionZh: "他们把“初步”删了三次。", descriptionEn: "They remove the word 'preliminary' three times." },
      { id: "social-thread", titleZh: "论文讨论串突然走红", titleEn: "Paper Thread Goes Viral", descriptionZh: "最热门回复问了 Reviewer #2 没问到的问题。", descriptionEn: "The top reply asks what Reviewer #2 missed." },
      { id: "podcast", titleZh: "收到播客邀请", titleEn: "Podcast Invitation Arrives", descriptionZh: "主持人希望你用一句话解释方法。", descriptionEn: "The host wants the method explained in one sentence." },
      { id: "negative-viral", titleZh: "失败实验意外走红", titleEn: "Negative Result Goes Viral", descriptionZh: "大家都犯过同一个错误，只是没人写出来。", descriptionEn: "Everyone made the same mistake; nobody wrote it down." },
    ],
  },
];

function hintFor(delta: Delta, effect?: EventEffect, locale: "zh" | "en" = "zh") {
  const parts: string[] = [];
  const labelsZh: Record<Metric, string> = { novelty: "创新", evidence: "证据", clarity: "清晰", reproducibility: "复现" };
  const labelsEn: Record<Metric, string> = { novelty: "Novelty", evidence: "Evidence", clarity: "Clarity", reproducibility: "Repro" };
  const add = (labelZh: string, labelEn: string, value?: number) => {
    if (!value) return;
    parts.push(`${locale === "zh" ? labelZh : labelEn} ${value > 0 ? "+" : ""}${value}`);
  };
  for (const metric of ["novelty", "evidence", "clarity", "reproducibility"] as Metric[]) {
    add(labelsZh[metric], labelsEn[metric], delta.stats?.[metric]);
  }
  add("GPU", "GPU", delta.gpu);
  add("经费", "Funding", delta.funding);
  add("精神", "Mental", delta.mental);
  add("风险", "Risk", delta.risk);
  add("天数", "Days", delta.days);
  add("专注", "Focus", delta.focus);
  if (effect?.conditions) {
    const conditionLabels: Record<keyof NonNullable<EventEffect["conditions"]>, [string, string]> = {
      caffeine: ["咖啡因", "Caffeine"], insight: ["洞见", "Insight"], technicalDebt: ["技术债", "Tech Debt"],
      reviewerFavor: ["审稿人好感", "Reviewer Favor"], pageDebt: ["页数债", "Page Debt"], infrastructureDown: ["设施故障", "Infrastructure Down"],
      queueDelay: ["排队延迟", "Queue Delay"], advisorPressure: ["导师压力", "Advisor Pressure"], coauthorTrust: ["合作者信任", "Coauthor Trust"],
      auditTrail: ["审计轨迹", "Audit Trail"],
    };
    for (const key of Object.keys(effect.conditions) as Array<keyof NonNullable<EventEffect["conditions"]>>) {
      const [zh, en] = conditionLabels[key];
      add(zh, en, effect.conditions[key]);
    }
  }
  if (effect?.upgradeRandom) parts.push(locale === "zh" ? "随机升级 1 张牌" : "Upgrade 1 random card");
  if (effect?.removeQuestionable) parts.push(locale === "zh" ? "移除 1 张危险牌" : "Remove 1 Questionable card");
  return parts.join(" · ") || (locale === "zh" ? "无即时变化" : "No immediate change");
}

function makeEventChoice(
  eventId: string,
  key: string,
  label: string,
  labelEn: string,
  result: string,
  resultEn: string,
  delta: Delta,
  effect?: EventEffect,
): EventChoice {
  return {
    id: `${eventId}-${key}`,
    label,
    labelEn,
    hint: hintFor(delta, effect, "zh"),
    hintEn: hintFor(delta, effect, "en"),
    result,
    resultEn,
    delta,
    effect,
  };
}

function buildEventChoices(kind: EventFamilyKind, eventId: string, index: number): [EventChoice, EventChoice, EventChoice] {
  const scale = index % 3;
  switch (kind) {
    case "power":
      return [
        makeEventChoice(eventId, "checkpoint", "抢救检查点", "Rescue checkpoints", "关键文件保住了，目录也第一次有了清单。", "The critical files survive, and the directory finally gets an inventory.", { mental: -2, stats: { reproducibility: 2 + scale } }, { conditions: { infrastructureDown: -2, auditTrail: 1 } }),
        makeEventChoice(eventId, "relocate", "迁移到备用机器", "Move to backup hardware", "运行慢了，但研究没有完全停下。", "The run slows down, but the research does not stop.", { gpu: -(1 + scale), stats: { evidence: 1, clarity: 1 } }, { conditions: { queueDelay: 1, infrastructureDown: -1 } }),
        makeEventChoice(eventId, "leave", "保存后回家", "Save and go home", "停电替你做出了休息决定。", "The outage makes the rest decision for you.", { days: -1, mental: 4 + scale }, { conditions: { infrastructureDown: -1 } }),
      ];
    case "server":
      return [
        makeEventChoice(eventId, "containerize", "修环境并容器化", "Repair and containerize", "这次环境不仅恢复，还留下了说明。", "The environment returns with documentation attached.", { mental: -1, stats: { reproducibility: 3 } }, { conditions: { technicalDebt: -2, infrastructureDown: -1, auditTrail: 1 } }),
        makeEventChoice(eventId, "cloud", "临时迁到云端", "Move temporarily to cloud", "实验继续，账单也继续。", "The experiment continues. So does the bill.", { funding: -(2 + scale), gpu: 4 + scale }, { conditions: { technicalDebt: 1 } }),
        makeEventChoice(eventId, "wait", "等待维护完成", "Wait for maintenance", "你获得了被基础设施强制安排的休息。", "Infrastructure schedules a break on your behalf.", { days: -1, mental: 2 + scale }, { conditions: { queueDelay: 1 + scale } }),
      ];
    case "advisor":
      return [
        makeEventChoice(eventId, "accept", "接受新故事", "Accept the new story", "摘要更宏大，待办列表也更宏大。", "The abstract grows grander, and so does the task list.", { mental: -2, stats: { novelty: 2 + scale, clarity: 1 } }, { conditions: { advisorPressure: 2 } }),
        makeEventChoice(eventId, "negotiate", "拿证据谈范围", "Negotiate with evidence", "故事保留了主线，也保留了截止日。", "The story keeps a spine and the deadline remains recognizable.", { mental: 1, stats: { clarity: 2 } }, { conditions: { reviewerFavor: 1, advisorPressure: -1, coauthorTrust: 1 } }),
        makeEventChoice(eventId, "test", "用实验决定叙事", "Let an experiment decide", "数据替会议做出了决定。", "The data make the decision the meeting could not.", { gpu: -(2 + scale), stats: { evidence: 3 } }, { conditions: { auditTrail: 1, advisorPressure: -1 } }),
      ];
    case "coauthor":
      return [
        makeEventChoice(eventId, "take-over", "自己接管修改", "Take over the revision", "现在每一段都是你改的，也都是你的问题。", "Every paragraph is now your edit—and your problem.", { mental: -(2 + scale), stats: { clarity: 3 } }, { conditions: { coauthorTrust: -1 } }),
        makeEventChoice(eventId, "recruit", "找同门临时支援", "Recruit a labmate", "新读者发现了旧作者都看不见的问题。", "A fresh reader finds what every old author stopped seeing.", { funding: -1, stats: { clarity: 2, reproducibility: 1 } }, { conditions: { coauthorTrust: 1, insight: 1 } }),
        makeEventChoice(eventId, "wait", "保留边界并等待", "Wait and respect boundaries", "进度慢了，关系没有坏。", "Progress slows; the relationship does not break.", { days: -1, mental: 3 + scale }, { conditions: { coauthorTrust: -1 } }),
      ];
    case "data":
      return [
        makeEventChoice(eventId, "audit", "完整审计数据", "Audit the data", "记录变长，怀疑变短。", "The record grows longer and the suspicion shorter.", { funding: -1, risk: -(5 + scale), stats: { reproducibility: 3 } }, { conditions: { auditTrail: 2, technicalDebt: -1 } }),
        makeEventChoice(eventId, "replace", "替换受影响部分", "Replace affected records", "样本少了，但边界重新可信。", "The sample shrinks, but its boundary becomes trustworthy again.", { gpu: -(1 + scale), stats: { evidence: -1, reproducibility: 2 } }, { conditions: { auditTrail: 1 } }),
        makeEventChoice(eventId, "ignore", "先按原数据提交", "Submit with the old data", "数字暂时没变，风险条变了。", "The numbers stay fixed; the Risk meter does not.", { risk: 12 + scale * 3, stats: { evidence: 2 } }, { conditions: { technicalDebt: 2 } }),
      ];
    case "compute":
      return [
        makeEventChoice(eventId, "optimize", "优化成小配置", "Optimize a smaller setup", "它更快，而且令人不安地接近原模型。", "It runs faster and lands disturbingly close to the original model.", { gpu: 3 + scale, stats: { novelty: -1, reproducibility: 2 } }, { conditions: { queueDelay: -2 } }),
        makeEventChoice(eventId, "buy", "购买临时算力", "Buy temporary compute", "GPU 指示灯变绿，预算表变红。", "GPU lights turn green; the budget turns red.", { funding: -(2 + scale), gpu: 5 + scale }, { conditions: { queueDelay: -2 } }),
        makeEventChoice(eventId, "queue", "继续排队", "Stay in the queue", "你整理了文档，也数了很多次排队位置。", "You improve the documentation and count the queue position repeatedly.", { days: -1, mental: 2, stats: { clarity: 1 } }, { conditions: { queueDelay: 2 + scale } }),
      ];
    case "statistics":
      return [
        makeEventChoice(eventId, "investigate", "请统计顾问复核", "Ask a statistician", "你删掉两个检验，结论反而更稳。", "You remove two tests and the conclusion becomes stronger.", { funding: -(1 + scale), stats: { evidence: 2, reproducibility: 2 } }, { conditions: { insight: 1, auditTrail: 1 } }),
        makeEventChoice(eventId, "report", "如实报告不确定性", "Report uncertainty honestly", "星号少了，可信度多了。", "There are fewer stars and more credibility.", { risk: -(5 + scale), stats: { evidence: -1, reproducibility: 3 } }, { conditions: { auditTrail: 1 } }),
        makeEventChoice(eventId, "retune", "再调一轮", "Tune one more round", "这次数字更好，原因没有更清楚。", "The number improves; the reason does not.", { gpu: -(2 + scale), risk: 10 + scale * 2, stats: { evidence: 3 } }, { conditions: { technicalDebt: 1 } }),
      ];
    case "formatting":
      return [
        makeEventChoice(eventId, "automate", "自动修复流水线", "Automate the fix", "这次格式问题可以被重复地解决。", "This formatting fix can now be reproduced.", { focus: -1, stats: { clarity: 3, reproducibility: 1 } }, { conditions: { pageDebt: -2, auditTrail: 1 } }),
        makeEventChoice(eventId, "shrink", "强行压缩", "Force it to fit", "它符合规范，但不再符合人类视觉。", "It meets the specification and leaves human vision behind.", { days: 1, stats: { clarity: -1 } }, { conditions: { pageDebt: 1 + scale } }),
        makeEventChoice(eventId, "outsource", "请专业编辑处理", "Hire a production editor", "页边距终于不再由直觉决定。", "Margins are no longer governed by intuition.", { funding: -(2 + scale), stats: { clarity: 3 + scale } }, { conditions: { pageDebt: -2 } }),
      ];
    case "ethics":
      return [
        makeEventChoice(eventId, "amend", "提交正式修订", "File a formal amendment", "批准邮件在截止日前几个小时抵达。", "Approval arrives a few hours before the deadline.", { funding: -1, days: -1, risk: -(7 + scale), stats: { reproducibility: 3 } }, { conditions: { auditTrail: 2 } }),
        makeEventChoice(eventId, "remove", "删除受影响分析", "Remove the affected analysis", "结果少了，责任边界清楚了。", "There are fewer results and a clearer line of responsibility.", { risk: -3, stats: { evidence: -2, clarity: 2 } }, { conditions: { technicalDebt: -1 } }),
        makeEventChoice(eventId, "defer", "先提交再处理", "Defer until after submission", "提交按钮变绿，诚信办公室的想象也更具体。", "The submit button turns green; the integrity office becomes easier to imagine.", { risk: 15 + scale * 2, stats: { evidence: 1 } }, { conditions: { technicalDebt: 2 } }),
      ];
    case "funding":
      return [
        makeEventChoice(eventId, "paperwork", "当天补完手续", "Finish the paperwork", "表格终于完整，研究生略微不完整。", "The forms are complete; the graduate student is slightly less so.", { mental: -(2 + scale), funding: 4 + scale }, { conditions: { auditTrail: 1 } }),
        makeEventChoice(eventId, "cut", "削减非核心开支", "Cut nonessential spending", "项目变小了，预算活下来了。", "The project becomes smaller and the budget survives.", { funding: 2, stats: { novelty: -1, clarity: 2 } }, { conditions: { advisorPressure: 1 } }),
        makeEventChoice(eventId, "bridge", "申请过桥经费", "Request bridge funding", "钱到账了，同时附带一份新的汇报义务。", "The money arrives with a new reporting obligation attached.", { funding: 3 + scale, risk: 5 }, { conditions: { advisorPressure: 1, pageDebt: 1 } }),
      ];
    case "community":
      return [
        makeEventChoice(eventId, "fix", "公开修复", "Fix it in public", "Issue 关闭了，信任反而增加了。", "The issue closes, and trust unexpectedly grows.", { mental: -(2 + scale), risk: -6, stats: { reproducibility: 4 } }, { upgradeRandom: true, conditions: { auditTrail: 2 } }),
        makeEventChoice(eventId, "document", "整理最小复现", "Document a minimal reproduction", "问题缩成了七行，也第一次真正被理解。", "The problem shrinks to seven lines and is finally understood.", { stats: { clarity: 2, reproducibility: 2 } }, { conditions: { insight: 1, technicalDebt: -1 } }),
        makeEventChoice(eventId, "hide", "暂时关闭仓库", "Take the repository private", "问题看不见了，缓存仍然记得。", "The problem disappears; caches remember.", { risk: 14 + scale * 2 }, { conditions: { technicalDebt: 2 } }),
      ];
    case "venue":
      return [
        makeEventChoice(eventId, "adapt", "立刻适配新要求", "Adapt immediately", "稿件重新符合要求，你不再知道今天星期几。", "The paper complies again; you no longer know the day of the week.", { funding: -1, mental: -1, stats: { clarity: 2 } }, { conditions: { pageDebt: -1 } }),
        makeEventChoice(eventId, "appeal", "向编辑解释", "Ask the editor", "编辑没有完全同意，但给了一个可执行答案。", "The editor does not fully agree, but gives an actionable answer.", { mental: -2, stats: { novelty: 2 } }, { conditions: { reviewerFavor: 1 + scale } }),
        makeEventChoice(eventId, "rescope", "调整投稿计划", "Rescope the submission", "论文活下来，只是路线改变了。", "The paper survives on a different route.", { days: 1 + scale, mental: 3, stats: { novelty: -1, clarity: 1 } }, { conditions: { advisorPressure: -1 } }),
      ];
    case "wellbeing":
      return [
        makeEventChoice(eventId, "rest", "真正休息", "Actually rest", "休息没有生成新结果，但恢复了会生成结果的人。", "Rest produces no result and restores the person who does.", { days: -1, mental: 5 + scale }, { conditions: { caffeine: -2 } }),
        makeEventChoice(eventId, "team", "组织互助轮班", "Organize a team rotation", "没有人成为英雄，也没有人单独崩溃。", "Nobody becomes a hero, and nobody collapses alone.", { funding: -1, mental: 3, stats: { clarity: 1 } }, { conditions: { coauthorTrust: 2 } }),
        makeEventChoice(eventId, "stimulant", "靠咖啡继续", "Continue with caffeine", "专注回来了，稳定心率没有。", "Focus returns. A stable heart rate does not.", { focus: 1 + scale, mental: -1, risk: 3 }, { conditions: { caffeine: 2 + scale } }),
      ];
    case "competition":
      return [
        makeEventChoice(eventId, "differentiate", "连夜做差异化", "Differentiate overnight", "你写出了职业生涯最长的转折句。", "You write the longest contrastive sentence of your career.", { gpu: -(2 + scale), mental: -2, stats: { novelty: 3 } }, { conditions: { insight: 1 } }),
        makeEventChoice(eventId, "position", "补读并重新定位", "Read and reposition", "相关工作变长了，贡献边界变清楚了。", "Related Work grows, and the contribution boundary sharpens.", { stats: { novelty: 1, clarity: 2 } }, { conditions: { reviewerFavor: 1 } }),
        makeEventChoice(eventId, "narrow", "诚实收窄主张", "Narrow the claim honestly", "没那么轰动，但终于准确。", "Less spectacular, finally accurate.", { risk: -4, stats: { novelty: -1, clarity: 3 } }, { conditions: { auditTrail: 1 } }),
      ];
    case "collaboration":
      return [
        makeEventChoice(eventId, "merge", "合并对方建议", "Merge the contribution", "论文多了一位真正读过它的人。", "The paper gains someone who has genuinely read it.", { stats: { clarity: 2, reproducibility: 2 } }, { conditions: { coauthorTrust: 2, insight: 1 } }),
        makeEventChoice(eventId, "commission", "委托深度分析", "Commission a deep analysis", "对方删除了一个漂亮但站不住的结果。", "They remove one attractive result that could not stand up.", { funding: -(2 + scale), stats: { evidence: 3, reproducibility: 1 } }, { conditions: { auditTrail: 1 } }),
        makeEventChoice(eventId, "decline", "感谢并保持范围", "Thank them and hold scope", "合作没有发生，待办也没有增加。", "The collaboration does not happen, and neither does the task list.", { mental: 3 }, { conditions: { reviewerFavor: 1 } }),
      ];
    case "publicity":
      return [
        makeEventChoice(eventId, "engage", "认真回应反馈", "Engage with feedback", "公众误解减少了，你的睡眠也减少了。", "Public misunderstanding shrinks, along with your sleep.", { mental: -(2 + scale), stats: { novelty: 2, clarity: 2 } }, { conditions: { insight: 1 } }),
        makeEventChoice(eventId, "open", "公开更多材料", "Release more material", "讨论开始引用你的文档，而不是猜测。", "The discussion starts citing your documentation instead of guessing.", { risk: -5, stats: { reproducibility: 3 } }, { conditions: { auditTrail: 2 } }),
        makeEventChoice(eventId, "mute", "关闭通知", "Mute notifications", "世界继续讨论，你终于完成了一段方法。", "The world keeps talking; you finish a Methods paragraph.", { mental: 4 + scale, stats: { clarity: 1 } }, { conditions: { insight: 1 } }),
      ];
  }
}

export const MEGA_EVENTS: EventDef[] = EVENT_FAMILIES.flatMap((family) =>
  family.incidents.map((incident, incidentIndex) => {
    const id = `mega-event-${family.id}-${incident.id}`;
    return {
      id,
      icon: family.icon,
      title: incident.titleZh,
      titleEn: incident.titleEn,
      description: incident.descriptionZh,
      descriptionEn: incident.descriptionEn,
      choices: buildEventChoices(family.kind, id, incidentIndex),
    };
  }),
);

const CAPABILITY_RELICS: RelicDef[] = CAPABILITY_TOPICS.map((topic, index) => {
  const answerBonus = index % 6 === 0 ? 2 : 1;
  return {
    id: `mega-relic-${topic.slug}`,
    icon: ["⌖", "◇", "Σ", "±", "▧", "¶"][index % 6],
    name: topic.relicZh,
    en: topic.relicEn,
    rules: `${topic.zh}牌额外 +${answerBonus} 回应。`,
    rulesEn: `${topic.stemEn} cards gain +${answerBonus} Response.`,
    rarity: answerBonus === 2 ? "rare" : "uncommon",
    effect: { capability: topic.capability, answerBonus },
  };
});

const SYSTEM_RELICS: RelicDef[] = [
  {
    id: "mega-relic-reserved-cluster",
    icon: "A100",
    name: "预留集群时段",
    en: "Reserved Cluster Window",
    rules: "实验牌少消耗 1 GPU。",
    rulesEn: "Experiment cards cost 1 less GPU.",
    rarity: "uncommon",
    effect: { category: "experiment", costResource: "gpu", costReduction: 1 },
  },
  {
    id: "mega-relic-track-changes",
    icon: "✎",
    name: "完整修订记录",
    en: "Complete Track Changes",
    rules: "写作牌额外 +1 回应。",
    rulesEn: "Writing cards gain +1 Response.",
    rarity: "uncommon",
    effect: { category: "writing", answerBonus: 1 },
  },
  {
    id: "mega-relic-rigor-budget",
    icon: "⌘",
    name: "方法学专项经费",
    en: "Methods Support Fund",
    rules: "严谨牌少消耗 1 经费。",
    rulesEn: "Rigor cards cost 1 less Funding.",
    rarity: "uncommon",
    effect: { category: "rigor", costResource: "funding", costReduction: 1 },
  },
  {
    id: "mega-relic-support-roster",
    icon: "☕",
    name: "实验室互助排班",
    en: "Lab Support Roster",
    rules: "支援牌额外 +1 回应，每日精神 +1。",
    rulesEn: "Support cards gain +1 Response; restore 1 Mental Health daily.",
    rarity: "rare",
    effect: { category: "support", answerBonus: 1, daily: { mental: 1 } },
  },
  {
    id: "mega-relic-risk-register",
    icon: "⚠",
    name: "研究风险登记表",
    en: "Research Risk Register",
    rules: "危险牌增加的风险减少 5。",
    rulesEn: "Questionable cards gain 5 less Risk.",
    rarity: "rare",
    effect: { category: "questionable", costResource: "risk", costReduction: 5 },
  },
  {
    id: "mega-relic-backup-generator",
    icon: "⚡",
    name: "备用发电机",
    en: "Backup Generator",
    rules: "事件造成的资源损失减少 2。",
    rulesEn: "Resource losses from events are reduced by 2.",
    rarity: "rare",
    effect: { eventShield: 2 },
  },
  {
    id: "mega-relic-desk-plant",
    icon: "♧",
    name: "仍然活着的桌面植物",
    en: "A Still-Living Desk Plant",
    rules: "每天开始时精神 +1。",
    rulesEn: "Restore 1 Mental Health at the start of each day.",
    rarity: "uncommon",
    effect: { daily: { mental: 1 } },
  },
  {
    id: "mega-relic-coffee-thermos",
    icon: "☕",
    name: "不会空的保温杯",
    en: "Bottomless Coffee Thermos",
    rules: "每天开始时专注 +1、风险 +1。",
    rulesEn: "Gain 1 Focus and 1 Risk at the start of each day.",
    rarity: "rare",
    effect: { daily: { focus: 1, risk: 1 } },
  },
  {
    id: "mega-relic-rebuttal-clock",
    icon: "◷",
    name: "Rebuttal 倒计时器",
    en: "Rebuttal Countdown Clock",
    rules: "逐条回复牌额外 +2 回应。",
    rulesEn: "Response-writing cards gain +2 Response.",
    rarity: "rare",
    effect: { capability: "responseWriting", answerBonus: 2 },
  },
  {
    id: "mega-relic-open-notebook",
    icon: "▤",
    name: "开放实验记录",
    en: "Open Lab Notebook",
    rules: "文档牌额外 +1 回应，每天风险 -1。",
    rulesEn: "Documentation cards gain +1 Response; reduce Risk by 1 daily.",
    rarity: "rare",
    effect: { capability: "documentation", answerBonus: 1, daily: { risk: -1 } },
  },
  {
    id: "mega-relic-elastic-template",
    icon: "8p",
    name: "有弹性的终稿模板",
    en: "Elastic Camera-Ready Template",
    rules: "格式牌额外 +2 回应，并少消耗 1 专注。",
    rulesEn: "Formatting cards gain +2 Response and cost 1 less Focus.",
    rarity: "rare",
    effect: { capability: "formatting", answerBonus: 2, costResource: "focus", costReduction: 1 },
  },
  {
    id: "mega-relic-emergency-fund",
    icon: "$",
    name: "未花完的应急经费",
    en: "Unspent Emergency Fund",
    rules: "每天经费 +1，但精神 -1。",
    rulesEn: "Gain 1 Funding and lose 1 Mental Health each day.",
    rarity: "uncommon",
    effect: { daily: { funding: 1, mental: -1 } },
  },
];

export const MEGA_RELICS: RelicDef[] = [...CAPABILITY_RELICS, ...SYSTEM_RELICS];

const TOPIC_BY_CAPABILITY = Object.fromEntries(
  CAPABILITY_TOPICS.map((topic) => [topic.capability, topic]),
) as Record<Capability, CapabilityTopic>;

function generatedCardId(capability: Capability, tacticId: string) {
  return `mega-card-${TOPIC_BY_CAPABILITY[capability].slug}-${tacticId}`;
}

function buildStartingDeck(capabilities: [Capability, Capability, Capability]) {
  const [primary, secondary, tertiary] = capabilities;
  return [
    generatedCardId(primary, "quick-check"),
    generatedCardId(primary, "argument-rewrite"),
    generatedCardId(primary, "audit"),
    generatedCardId(primary, "protocol-lock"),
    generatedCardId(primary, "consultation"),
    generatedCardId(primary, "shortcut"),
    generatedCardId(secondary, "quick-check"),
    generatedCardId(secondary, "stress-test"),
    generatedCardId(secondary, "audit"),
    generatedCardId(secondary, "visual-brief"),
    generatedCardId(tertiary, "quick-check"),
    generatedCardId(tertiary, "argument-rewrite"),
    generatedCardId(tertiary, "audit"),
    generatedCardId(tertiary, "consultation"),
  ];
}

export const MEGA_STARTING_DECKS: Record<string, string[]> = Object.fromEntries(
  ROLE_PLANS.map((role) => [
    `mega-role-${role.id}`,
    buildStartingDeck(role.deckCapabilities),
  ]),
);

function assertCount(label: string, actual: number, expected: number) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, received ${actual}`);
  }
}

function assertUnique(label: string, ids: string[]) {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) throw new Error(`${label}: duplicate id ${id}`);
    seen.add(id);
  }
}

function assertText(label: string, values: Array<string | undefined>) {
  if (values.some((value) => !value?.trim())) {
    throw new Error(`${label}: missing bilingual user-facing text`);
  }
}

assertCount("MEGA_ROLES", MEGA_ROLES.length, 15);
assertCount("MEGA_CARDS", MEGA_CARDS.length, 200);
assertCount("MEGA_COMMENTS", MEGA_COMMENTS.length, 120);
assertCount("MEGA_EVENTS", MEGA_EVENTS.length, 96);
assertCount("MEGA_RELICS", MEGA_RELICS.length, 36);
assertCount("MEGA_STARTING_DECKS", Object.keys(MEGA_STARTING_DECKS).length, 15);

assertUnique("mega entity ids", [
  ...MEGA_ROLES.map((item) => item.id),
  ...MEGA_CARDS.map((item) => item.id),
  ...MEGA_COMMENTS.map((item) => item.id),
  ...MEGA_EVENTS.map((item) => item.id),
  ...MEGA_RELICS.map((item) => item.id),
]);
assertUnique("mega event choice ids", MEGA_EVENTS.flatMap((event) => event.choices.map((choice) => choice.id)));
assertUnique(
  "mega capability requirement ids",
  MEGA_COMMENTS.flatMap((comment) =>
    (comment.routes ?? []).flatMap((route) => route.requirements.map((requirement) => requirement.id)),
  ),
);

assertText("MEGA_ROLES", MEGA_ROLES.flatMap((role) => [role.name, role.en, role.pitch, role.pitchEn, role.passive, role.passiveEn, role.weakness, role.weaknessEn]));
assertText("MEGA_CARDS", MEGA_CARDS.flatMap((card) => [card.name, card.en, card.flavor, card.flavorEn, card.rules, card.rulesEn]));
assertText("MEGA_COMMENTS", MEGA_COMMENTS.flatMap((comment) => [comment.quote, comment.quoteZh, comment.note, comment.noteEn]));
assertText("MEGA_EVENTS", MEGA_EVENTS.flatMap((event) => [
  event.title,
  event.titleEn,
  event.description,
  event.descriptionEn,
  ...event.choices.flatMap((choice) => [choice.label, choice.labelEn, choice.hint, choice.hintEn, choice.result, choice.resultEn]),
]));
assertText("MEGA_RELICS", MEGA_RELICS.flatMap((relic) => [relic.name, relic.en, relic.rules, relic.rulesEn]));

const megaCardIds = new Set(MEGA_CARDS.map((card) => card.id));
for (const [roleId, deck] of Object.entries(MEGA_STARTING_DECKS)) {
  assertCount(`${roleId} starting deck`, deck.length, 14);
  assertUnique(`${roleId} starting deck`, deck);
  for (const cardId of deck) {
    if (!megaCardIds.has(cardId)) throw new Error(`${roleId}: unknown card ${cardId}`);
  }
}
