import type { CampaignConfig, CampaignLengthId, DifficultyId, RunSetup } from "./types";

export interface DifficultyDef {
  id: DifficultyId;
  name: string;
  nameEn: string;
  subtitle: string;
  subtitleEn: string;
  description: string;
  descriptionEn: string;
  issueModifier: number;
  pressureModifier: number;
  resourceMultiplier: number;
  scoreMultiplier: number;
  eventOffset: number;
}

export interface CampaignLengthDef {
  id: Exclude<CampaignLengthId, "custom">;
  name: string;
  nameEn: string;
  subtitle: string;
  subtitleEn: string;
  days: number;
  target: number;
  eventEvery: number;
  estimatedMinutes: string;
}

export const DIFFICULTIES: DifficultyDef[] = [
  {
    id: "friendly", name: "友善预审", nameEn: "Friendly Pre-review", subtitle: "审稿人使用了完整句号", subtitleEn: "The reviewer uses complete sentences",
    description: "资源宽裕、意见标准较低，适合第一次投稿。", descriptionEn: "Generous resources and softer requirements. Ideal for a first submission.",
    issueModifier: -2, pressureModifier: -1, resourceMultiplier: 1.28, scoreMultiplier: 0.75, eventOffset: 2,
  },
  {
    id: "constructive", name: "建设性意见", nameEn: "Constructive Feedback", subtitle: "Major，但语气温柔", subtitleEn: "Major, but politely worded",
    description: "略多资源、略低压力，仍会遇到完整事件线。", descriptionEn: "A little more runway and less pressure, with the full event system intact.",
    issueModifier: -1, pressureModifier: 0, resourceMultiplier: 1.12, scoreMultiplier: 0.9, eventOffset: 1,
  },
  {
    id: "major", name: "标准大修", nameEn: "Standard Major Revision", subtitle: "编辑部推荐剂量", subtitleEn: "The editor-recommended dose",
    description: "原版平衡：资源、意见与崩溃概率都恰到好处。", descriptionEn: "The intended balance of resources, requirements, and academic despair.",
    issueModifier: 0, pressureModifier: 0, resourceMultiplier: 1, scoreMultiplier: 1, eventOffset: 0,
  },
  {
    id: "reviewer_two", name: "二号审稿人解封", nameEn: "Reviewer #2 Unleashed", subtitle: "请再补三个数据集", subtitleEn: "Please add three more datasets",
    description: "意见更难、资源更紧，拖延会被认真记录。", descriptionEn: "Harder comments, tighter resources, and every delay enters the record.",
    issueModifier: 2, pressureModifier: 1, resourceMultiplier: 0.88, scoreMultiplier: 1.3, eventOffset: -1,
  },
  {
    id: "desk_reject", name: "编辑部炼狱", nameEn: "Editorial Inferno", subtitle: "为什么还没拒稿？", subtitleEn: "Why has this not been rejected yet?",
    description: "高难意见、频繁事件、极少资源；分数倍率最高。", descriptionEn: "Severe requirements, frequent events, and scarce resources. Highest score multiplier.",
    issueModifier: 4, pressureModifier: 2, resourceMultiplier: 0.74, scoreMultiplier: 1.65, eventOffset: -1,
  },
];

export const CAMPAIGN_LENGTHS: CampaignLengthDef[] = [
  { id: "espresso", name: "浓缩返修", nameEn: "Espresso Rebuttal", subtitle: "咖啡还热，截止已到", subtitleEn: "The coffee is hot; the deadline is now", days: 18, target: 14, eventEvery: 3, estimatedMinutes: "12–20" },
  { id: "conference", name: "会议冲刺", nameEn: "Conference Sprint", subtitle: "DDL 是一种自然现象", subtitleEn: "The deadline is a force of nature", days: 30, target: 24, eventEvery: 2, estimatedMinutes: "25–40" },
  { id: "standard", name: "标准大修", nameEn: "Full Major Revision", subtitle: "编辑给了四十八天", subtitleEn: "The editor grants forty-eight days", days: 48, target: 40, eventEvery: 2, estimatedMinutes: "45–70" },
  { id: "marathon", name: "期刊马拉松", nameEn: "Journal Marathon", subtitle: "补充材料比正文长", subtitleEn: "The supplement outgrows the paper", days: 72, target: 60, eventEvery: 2, estimatedMinutes: "70–105" },
  { id: "eternal", name: "无限补实验", nameEn: "Eternal Revision", subtitle: "第六轮审稿仍然很新鲜", subtitleEn: "Round six still feels surprisingly personal", days: 96, target: 80, eventEvery: 2, estimatedMinutes: "100–150" },
];

export const DEFAULT_RUN_SETUP: RunSetup = {
  difficultyId: "major",
  lengthId: "standard",
  ironman: false,
};

export function resolveCampaignConfig(setup: RunSetup = DEFAULT_RUN_SETUP): CampaignConfig {
  const difficulty = DIFFICULTIES.find((item) => item.id === setup.difficultyId) ?? DIFFICULTIES[2];
  const preset = CAMPAIGN_LENGTHS.find((item) => item.id === setup.lengthId) ?? CAMPAIGN_LENGTHS[2];
  const custom = setup.lengthId === "custom";
  const totalDays = custom ? Math.min(120, Math.max(12, Math.round(setup.customDays ?? 48))) : preset.days;
  const baseTarget = custom ? Math.min(100, Math.max(10, Math.round(setup.customTarget ?? 40))) : preset.target;
  const rawEventEvery = custom ? Math.round(setup.customEventEvery ?? 2) : preset.eventEvery;
  const lengthResourceScale = Math.min(1.55, Math.max(0.72, 0.6 + (baseTarget / 40) * 0.4));
  return {
    difficultyId: difficulty.id,
    lengthId: custom ? "custom" : preset.id,
    ironman: Boolean(setup.ironman),
    customDays: custom ? totalDays : undefined,
    customTarget: custom ? baseTarget : undefined,
    customEventEvery: custom ? Math.min(6, Math.max(1, rawEventEvery)) : undefined,
    totalDays,
    baseTarget,
    eventEvery: Math.min(6, Math.max(1, rawEventEvery + difficulty.eventOffset)),
    issueModifier: difficulty.issueModifier,
    pressureModifier: difficulty.pressureModifier,
    resourceMultiplier: difficulty.resourceMultiplier * lengthResourceScale,
    scoreMultiplier: difficulty.scoreMultiplier,
  };
}

export function difficultyFor(id: DifficultyId) {
  return DIFFICULTIES.find((item) => item.id === id) ?? DIFFICULTIES[2];
}

export function campaignLengthFor(id: CampaignLengthId) {
  return CAMPAIGN_LENGTHS.find((item) => item.id === id) ?? null;
}
