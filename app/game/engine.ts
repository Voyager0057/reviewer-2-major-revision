import {
  CAPABILITY_META,
  CARD_BY_ID,
  CARDS,
  COMMENTS,
  COMMENT_BY_ID,
  EVENT_BY_ID,
  EVENTS,
  METRICS,
  RELICS,
  RELIC_BY_ID,
  ROLE_BY_ID,
  STARTING_DECKS,
  scaleRouteRequirements,
  stageForResolved,
} from "./data";
import { eventChoiceText, eventDescription, eventTitle } from "./i18n";
import { DEFAULT_RUN_SETUP, resolveCampaignConfig } from "./settings";
import type {
  Capability,
  CapabilityContribution,
  CapabilityRequirement,
  CardCategory,
  CardDef,
  CardPreview,
  ConditionState,
  Delta,
  EventChoice,
  EventDef,
  GameAction,
  GameState,
  Locale,
  LogEntry,
  Metric,
  PaperStats,
  ResolutionRoute,
  RewardOffer,
  RunSetup,
  RunEnding,
  StageId,
  TimelineEntry,
} from "./types";

const MAX_STAT = 15;
const MAX_MENTAL = 24;
const MAX_GPU = 96;
const MAX_FUNDING = 60;
const MAX_DAYS = 140;
const MAX_FOCUS = 8;
const MAX_CONDITION = 5;
const BASE_HAND_SIZE = 7;

const EMPTY_CONDITIONS: ConditionState = {
  caffeine: 0,
  insight: 0,
  technicalDebt: 0,
  reviewerFavor: 0,
  pageDebt: 0,
  infrastructureDown: 0,
  queueDelay: 0,
  advisorPressure: 0,
  coauthorTrust: 0,
  auditTrail: 0,
};

const ENDING_COPY: Record<RunEnding["id"], Omit<RunEnding, "id" | "score">> = {
  accepted: {
    stamp: "ACCEPT",
    title: "Reviewer #2 沉默了",
    titleEn: "Reviewer #2 Falls Silent",
    copy: "四轮审稿、数十条任务和一套逐渐成形的回复策略，终于把论文送过了终点。",
    copyEn: "Four review phases, dozens of tasks, and a rebuttal strategy that finally came together carry the paper across the line.",
  },
  best_paper: {
    stamp: "BEST PAPER",
    title: "连 Reviewer #2 都投了赞成票",
    titleEn: "Even Reviewer #2 Votes for Best Paper",
    copy: "四项质量指标像排版过的表格一样整齐。编辑来信问你能否准备获奖感言。",
    copyEn: "All four quality metrics align like a well-typeset table. The editor asks whether you can prepare an acceptance speech.",
  },
  open_science: {
    stamp: "ACCEPT",
    title: "开放科学英雄",
    titleEn: "Open Science Hero",
    copy: "你报告失败实验、公开细节，还真的被接收了。罕见结局。",
    copyEn: "You report the failures, open the details, and still get accepted. A rare ending.",
  },
  replication_legend: {
    stamp: "REPRODUCED",
    title: "复现界传说",
    titleEn: "Replication Legend",
    copy: "陌生实验室第一次运行就复现了结果。有人怀疑这违反了科研常识。",
    copyEn: "An unfamiliar lab reproduces the result on its first run. Someone suspects this violates academic convention.",
  },
  clean_review: {
    stamp: "CLEAN ACCEPT",
    title: "零风险通关",
    titleEn: "A Clean Review Record",
    copy: "没有藏结果，没有移动阈值，审计记录干净得让研究诚信办公室无事可做。",
    copyEn: "No hidden results, no moving thresholds, and an audit trail so clean that the integrity office has nothing to do.",
  },
  speedrun: {
    stamp: "FAST TRACK",
    title: "返修速通纪录",
    titleEn: "Rebuttal Speedrun Record",
    copy: "咖啡还没有凉，Decision Letter 已经到了。实验室开始研究你的路线。",
    copyEn: "The coffee is still warm when the decision letter arrives. The lab begins studying your route.",
  },
  last_minute: {
    stamp: "23:59",
    title: "截止前六十秒",
    titleEn: "Sixty Seconds Before the Deadline",
    copy: "上传进度条在 23:59:41 走完。你第一次觉得服务器时钟很美。",
    copyEn: "The upload completes at 23:59:41. For the first time, the server clock looks beautiful.",
  },
  survivor_accept: {
    stamp: "ACCEPT / REST",
    title: "接收，然后请假",
    titleEn: "Accepted, Then Immediately on Leave",
    copy: "论文被接收，精神状态只剩一个像素。编辑祝贺你，你把通知设为免打扰。",
    copyEn: "The paper is accepted with one pixel of Mental Health remaining. The editor congratulates you; you enable Do Not Disturb.",
  },
  coauthor_ending: {
    stamp: "ACCEPT",
    title: "Reviewer #2 成了合作者",
    titleEn: "Reviewer #2 Becomes a Coauthor",
    copy: "你通过了隐藏加试。合作者现在坚称，自己一直相信这个版本。",
    copyEn: "You pass the hidden examination. The coauthor now insists they always believed in this version.",
  },
  major_revision: {
    stamp: "MAJOR REVISION",
    title: "Revision 还会回来",
    titleEn: "The Revision Will Return",
    copy: "你活到了截止日，也说服了大多数人。编辑又给了你四十八天。",
    copyEn: "You survive the deadline and persuade most of the room. The editor gives you forty-eight more days.",
  },
  minor_revision: {
    stamp: "MINOR REVISION",
    title: "小修——传说中的两个字",
    titleEn: "Minor Revision—The Legendary Phrase",
    copy: "只剩两处问题。整个实验室围观这封从未见过的 Decision Letter。",
    copyEn: "Only two issues remain. The entire lab gathers around a decision letter nobody has seen before.",
  },
  revise_resubmit: {
    stamp: "R&R",
    title: "再修再投，还有希望",
    titleEn: "Revise, Resubmit, Retain Hope",
    copy: "编辑没有关门，只把门移远了八条意见。至少投稿系统还认识你。",
    copyEn: "The editor does not close the door; they move it eight comments farther away. At least the portal remembers you.",
  },
  desk_reject: {
    stamp: "DESK REJECT",
    title: "编辑在摘要处停下了",
    titleEn: "The Editor Stops at the Abstract",
    copy: "评审流程结束得非常高效。遗憾的是，高效的是拒稿。",
    copyEn: "The review process ends with remarkable efficiency. Unfortunately, the efficient part is the rejection.",
  },
  rejected: {
    stamp: "REJECT",
    title: "Reject & Resubmit",
    titleEn: "Reject & Resubmit",
    copy: "好消息：评审意见非常详细。坏消息：下一轮可能还是 Reviewer #2。",
    copyEn: "Good news: the feedback is extremely detailed. Bad news: Reviewer #2 may return next round.",
  },
  burnout: {
    stamp: "LEAVE",
    title: "无限期休假",
    titleEn: "Indefinite Leave",
    copy: "论文可以再投，精神值不行。你关掉 Overleaf，先去睡觉。",
    copyEn: "The paper can be resubmitted. Your Mental Health cannot. You close Overleaf and sleep.",
  },
  retracted: {
    stamp: "RETRACTED",
    title: "投稿前撤稿",
    titleEn: "Withdrawn Before Publication",
    copy: "捷径越积越多，最后成了没有出口的迷宫。研究诚信办公室发来了邮件。",
    copyEn: "Shortcuts accumulate into a maze with no exit. The research-integrity office sends an email.",
  },
};

export const ENDING_IDS = Object.freeze(Object.keys(ENDING_COPY) as RunEnding["id"][]);

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

export function nextRandom(rngState: number): [number, number] {
  const nextState = (rngState + 0x6d2b79f5) >>> 0;
  let value = nextState;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  return [((value ^ (value >>> 14)) >>> 0) / 4294967296, nextState];
}

function shuffle<T>(items: T[], rngState: number): [T[], number] {
  const result = [...items];
  let nextState = rngState;
  for (let index = result.length - 1; index > 0; index -= 1) {
    const [roll, updatedState] = nextRandom(nextState);
    nextState = updatedState;
    const swapIndex = Math.floor(roll * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return [result, nextState];
}

function addLog(state: GameState, text: string, textEn: string, tone: LogEntry["tone"] = "neutral"): GameState {
  return {
    ...state,
    logs: [...state.logs, { id: state.nextLogId, text, textEn, tone }].slice(-12),
    nextLogId: state.nextLogId + 1,
    lastMessage: text,
  };
}

function addTimeline(
  state: GameState,
  entry: Omit<TimelineEntry, "id" | "turn" | "daysRemaining">,
): GameState {
  return {
    ...state,
    timeline: [
      ...state.timeline,
      {
        id: state.nextTimelineId,
        turn: state.turn,
        daysRemaining: state.resources.days,
        ...entry,
      },
    ].slice(-240),
    nextTimelineId: state.nextTimelineId + 1,
  };
}

function normalizeStats(stats: PaperStats): PaperStats {
  return {
    novelty: clamp(stats.novelty, 0, MAX_STAT),
    evidence: clamp(stats.evidence, 0, MAX_STAT),
    clarity: clamp(stats.clarity, 0, MAX_STAT),
    reproducibility: clamp(stats.reproducibility, 0, MAX_STAT),
  };
}

function applyDelta(state: GameState, delta: Delta = {}): GameState {
  const stats = { ...state.stats };
  for (const metric of METRICS) stats[metric] += delta.stats?.[metric] ?? 0;
  return {
    ...state,
    stats: normalizeStats(stats),
    resources: {
      gpu: clamp(state.resources.gpu + (delta.gpu ?? 0), 0, MAX_GPU),
      funding: clamp(state.resources.funding + (delta.funding ?? 0), 0, MAX_FUNDING),
      mental: clamp(state.resources.mental + (delta.mental ?? 0), 0, MAX_MENTAL),
      risk: clamp(state.resources.risk + (delta.risk ?? 0), 0, 100),
      days: clamp(state.resources.days + (delta.days ?? 0), 0, MAX_DAYS),
      focus: clamp(state.resources.focus + (delta.focus ?? 0), 0, MAX_FOCUS),
    },
  };
}

function applyConditions(state: GameState, delta: Partial<ConditionState> = {}) {
  const conditions = { ...state.conditions };
  for (const key of Object.keys(EMPTY_CONDITIONS) as (keyof ConditionState)[]) {
    conditions[key] = clamp(conditions[key] + (delta[key] ?? 0), 0, MAX_CONDITION);
  }
  return { ...state, conditions };
}

function hasPlayedCategory(state: GameState, category: CardCategory) {
  return state.playedThisTurn.some((cardId) => CARD_BY_ID[cardId]?.category === category);
}

function lastPlayedCard(state: GameState) {
  const id = state.playedThisTurn.at(-1);
  return id ? CARD_BY_ID[id] : null;
}

function isUpgraded(state: GameState, cardId: string) {
  return (state.cardLevels[cardId] ?? 0) > 0;
}

function cardHasCapability(card: CardDef, capability: Capability) {
  return (card.provides?.[capability] ?? 0) > 0;
}

export function getCurrentComment(state: GameState) {
  return COMMENT_BY_ID[state.issue.commentId];
}

export function getCurrentRoute(state: GameState): ResolutionRoute | undefined {
  const comment = getCurrentComment(state);
  return comment?.routes?.find((route) => route.id === state.issue.routeId) ?? comment?.routes?.[0];
}

function mergeRequirements(requirements: CapabilityRequirement[]) {
  const merged = new Map<Capability, CapabilityRequirement>();
  for (const item of requirements) {
    const previous = merged.get(item.capability);
    merged.set(item.capability, previous ? { ...previous, target: previous.target + item.target } : { ...item });
  }
  return [...merged.values()];
}

export function getIssueRequirements(state: GameState): CapabilityRequirement[] {
  const route = getCurrentRoute(state);
  if (!route) return [];
  const extraTotal = state.issue.extraRequirements.reduce((sum, item) => sum + item.target, 0);
  const coreDifficulty = Math.max(route.requirements.length, state.issue.difficulty - extraTotal);
  return mergeRequirements([...scaleRouteRequirements(route, coreDifficulty), ...state.issue.extraRequirements]);
}

function syncIssue(state: GameState): GameState {
  const requirements = getIssueRequirements(state);
  const difficulty = requirements.reduce((sum, item) => sum + item.target, 0);
  const progress = requirements.reduce(
    (sum, item) => sum + Math.min(item.target, state.issue.capabilityProgress[item.capability] ?? 0),
    0,
  );
  return { ...state, issue: { ...state.issue, difficulty, progress } };
}

function traitApplies(state: GameState, card: CardDef) {
  const trait = ROLE_BY_ID[state.roleId]?.trait;
  if (!trait) return false;
  return (!trait.category || trait.category === card.category) && (!trait.capability || cardHasCapability(card, trait.capability));
}

export function getCardCosts(state: GameState, card: CardDef) {
  let focus = card.focus;
  let gpu = card.gpu ?? 0;
  let funding = card.funding ?? 0;
  let mental = card.mental ?? 0;
  let risk = card.risk ?? 0;
  const firstOfCategory = !hasPlayedCategory(state, card.category);

  if (state.roleId === "foundation" && gpu > 0) gpu -= 1;
  if (state.roleId === "small-data" && cardHasCapability(card, "statistics") && funding > 0) funding -= 1;

  const trait = ROLE_BY_ID[state.roleId]?.trait;
  if (trait && traitApplies(state, card) && trait.costResource && trait.costReduction) {
    if (trait.costResource === "focus") focus -= trait.costReduction;
    if (trait.costResource === "gpu") gpu -= trait.costReduction;
    if (trait.costResource === "funding") funding -= trait.costReduction;
    if (trait.costResource === "mental") mental -= trait.costReduction;
    if (trait.costResource === "risk") risk -= trait.costReduction;
  }

  if (isUpgraded(state, card.id)) {
    if (card.category === "experiment") gpu -= 1;
    if (card.category === "writing" || card.category === "support") focus -= 1;
    if (card.category === "rigor") funding -= 1;
    if (card.category === "questionable") risk -= 5;
  }

  if (state.relics.includes("gpu-allocation") && card.category === "experiment" && firstOfCategory) gpu -= 1;
  if (state.relics.includes("zotero-library") && card.category === "writing" && firstOfCategory) focus -= 1;
  for (const relicId of state.relics) {
    const effect = RELIC_BY_ID[relicId]?.effect;
    if (!effect?.costResource || !effect.costReduction) continue;
    if (effect.category && effect.category !== card.category) continue;
    if (effect.capability && !cardHasCapability(card, effect.capability)) continue;
    if (effect.costResource === "focus") focus -= effect.costReduction;
    if (effect.costResource === "gpu") gpu -= effect.costReduction;
    if (effect.costResource === "funding") funding -= effect.costReduction;
    if (effect.costResource === "mental") mental -= effect.costReduction;
    if (effect.costResource === "risk") risk -= effect.costReduction;
  }

  if (state.conditions.pageDebt > 0 && card.category === "writing") focus += 1;
  if (state.conditions.infrastructureDown > 0 && card.category === "experiment") focus += 1;
  if (state.conditions.queueDelay > 0 && gpu > 0) gpu += 1;
  if (state.conditions.advisorPressure > 0 && card.category === "writing") mental += 1;
  if (state.conditions.technicalDebt > 0 && card.category === "experiment") risk += Math.min(3, state.conditions.technicalDebt);
  if (state.relics.includes("open-notebook") && risk > 0) risk -= 5;

  return {
    focus: Math.max(0, focus), gpu: Math.max(0, gpu), funding: Math.max(0, funding),
    mental: Math.max(0, mental), risk: Math.max(0, risk),
  };
}

function paymentBlock(state: GameState, card: CardDef) {
  const cost = getCardCosts(state, card);
  if (state.resources.focus < cost.focus) return { zh: `专注不足，还差 ${cost.focus - state.resources.focus}`, en: `Need ${cost.focus - state.resources.focus} more Focus` };
  if (state.resources.gpu < cost.gpu) return { zh: `GPU 不足，还差 ${cost.gpu - state.resources.gpu}`, en: `Need ${cost.gpu - state.resources.gpu} more GPU` };
  if (state.resources.funding < cost.funding) return { zh: `经费不足，还差 ${cost.funding - state.resources.funding}`, en: `Need ${cost.funding - state.resources.funding} more Funding` };
  if (state.resources.mental < cost.mental) return { zh: `精神不足，还差 ${cost.mental - state.resources.mental}`, en: `Need ${cost.mental - state.resources.mental} more Mental Health` };
  return null;
}

function comboForCard(state: GameState, card: CardDef) {
  const previous = lastPlayedCard(state);
  if (!previous) return false;
  if (card.comboAfter) return previous.category === card.comboAfter;
  if (card.id === "response-matrix" || state.roleId === "interdisciplinary") return previous.category !== card.category;
  return false;
}

type AnswerDetails = {
  answer: number;
  rawAnswer: number;
  matchedCapabilities: Capability[];
  comboActive: boolean;
  contributions: CapabilityContribution[];
};

function answerForCard(state: GameState, card: CardDef): AnswerDetails {
  const requirements = getIssueRequirements(state);
  const matches = requirements.filter((item) => cardHasCapability(card, item.capability));
  const comboActive = comboForCard(state, card);
  if (matches.length === 0) return { answer: 0, rawAnswer: 0, matchedCapabilities: [], comboActive, contributions: [] };

  let systemBonus = 0;
  if (state.roleId === "method" && card.category === "experiment" && !hasPlayedCategory(state, "experiment")) systemBonus += 1;
  if (state.roleId === "clinical" && card.category === "rigor" && !hasPlayedCategory(state, "rigor")) systemBonus += 1;
  if (state.roleId === "foundation" && card.category === "experiment" && !hasPlayedCategory(state, "experiment")) systemBonus += 1;
  if (state.roleId === "small-data" && card.category === "rigor" && !hasPlayedCategory(state, "rigor")) systemBonus += 2;
  if (state.roleId === "interdisciplinary" && comboActive) systemBonus += 1;
  const trait = ROLE_BY_ID[state.roleId]?.trait;
  if (trait?.answerBonus && traitApplies(state, card)) systemBonus += trait.answerBonus;
  if (comboActive) systemBonus += card.comboAnswer ?? (card.id === "response-matrix" ? 2 : 1);
  if (state.conditions.insight > 0) systemBonus += Math.min(2, state.conditions.insight);
  if (state.conditions.coauthorTrust > 0 && card.category === "support") systemBonus += 1;
  if (state.conditions.auditTrail > 0 && (cardHasCapability(card, "dataIntegrity") || cardHasCapability(card, "reproducibility"))) systemBonus += 1;
  if (state.relics.includes("preregistration") && card.category === "rigor" && !hasPlayedCategory(state, "rigor")) systemBonus += 2;
  if (state.relics.includes("page-budget") && (cardHasCapability(card, "formatting") || cardHasCapability(card, "visualization"))) systemBonus += 2;
  for (const relicId of state.relics) {
    const effect = RELIC_BY_ID[relicId]?.effect;
    if (!effect?.answerBonus) continue;
    if (effect.category && effect.category !== card.category) continue;
    if (effect.capability && !cardHasCapability(card, effect.capability)) continue;
    systemBonus += effect.answerBonus;
  }
  if (isUpgraded(state, card.id)) systemBonus += card.category === "writing" || card.category === "questionable" ? 2 : 1;
  systemBonus = Math.min(4, systemBonus);

  let rawAnswer = 0;
  let answer = 0;
  const contributions = matches.map((item, index) => {
    const before = state.issue.capabilityProgress[item.capability] ?? 0;
    const raw = (card.provides?.[item.capability] ?? 0) + (index === 0 ? systemBonus : 0);
    const amount = Math.max(0, Math.min(raw, item.target - Math.min(item.target, before)));
    rawAnswer += raw;
    answer += amount;
    return {
      capability: item.capability,
      label: item.label,
      labelEn: item.labelEn,
      amount,
      before: Math.min(item.target, before),
      after: Math.min(item.target, before + raw),
      target: item.target,
    };
  }).filter((item) => item.amount > 0);

  return { answer, rawAnswer, matchedCapabilities: matches.map((item) => item.capability), comboActive, contributions };
}

export function getCardPreview(state: GameState, instanceId: number): CardPreview {
  const instance = state.hand.find((item) => item.instanceId === instanceId);
  if (!instance || state.phase !== "playing") {
    return { playable: false, reason: "这张牌已不在手中", reasonEn: "This card is no longer in hand", answer: 0, outcome: "", outcomeEn: "" };
  }
  const card = CARD_BY_ID[instance.cardId];
  if (!card) return { playable: false, reason: "未知卡牌", reasonEn: "Unknown card", answer: 0, outcome: "", outcomeEn: "" };
  const blocked = paymentBlock(state, card);
  const details = answerForCard(state, card);
  const remaining = Math.max(0, state.issue.difficulty - state.issue.progress);
  let outcome = details.answer > 0
    ? `推进 ${details.contributions.map((item) => `${item.label} +${item.amount}`).join("、")}`
    : "与当前路线无直接关联，但仍会产生卡牌的全局效果";
  let outcomeEn = details.answer > 0
    ? `Advance ${details.contributions.map((item) => `${item.labelEn} +${item.amount}`).join(", ")}`
    : "No direct link to this route; the card's global effects still apply";
  if (card.volatile === "seed") {
    const chance = state.relics.includes("golden-seed") ? 75 : 55;
    outcome += ` · ${chance}% 成功时匹配步骤额外 +3`;
    outcomeEn += ` · ${chance}% chance: +3 to a matched step`;
  }
  if (card.volatile === "coauthor") {
    outcome += " · 65% 获得有用回复，35% 只有 Looks good";
    outcomeEn += " · 65% useful edits, 35% just 'Looks good'";
  }
  if (card.shrinkIssue) {
    outcome += ` · 路线总难度 -${card.shrinkIssue}`;
    outcomeEn += ` · Route difficulty -${card.shrinkIssue}`;
  }
  if (details.comboActive) {
    outcome += " · 连锁已触发";
    outcomeEn += " · Combo active";
  }
  return {
    playable: !blocked,
    reason: blocked?.zh ?? "",
    reasonEn: blocked?.en ?? "",
    answer: details.answer,
    outcome,
    outcomeEn,
    matchedTags: details.matchedCapabilities,
    comboActive: details.comboActive,
    contributions: details.contributions,
    matchLevel: details.answer >= Math.min(4, remaining) || details.contributions.length >= 2 ? "strong" : details.answer > 0 ? "partial" : "none",
    completesIssue: details.answer >= remaining,
  };
}

function drawCards(state: GameState, count: number): GameState {
  let deck = [...state.deck];
  let discard = [...state.discard];
  let rngState = state.rngState;
  let nextInstanceId = state.nextInstanceId;
  const hand = [...state.hand];
  while (hand.length < count) {
    if (deck.length === 0) {
      if (discard.length === 0) break;
      [deck, rngState] = shuffle(discard, rngState);
      discard = [];
    }
    const cardId = deck.shift();
    if (!cardId || !CARD_BY_ID[cardId]) continue;
    hand.push({ instanceId: nextInstanceId, cardId });
    nextInstanceId += 1;
  }
  return { ...state, deck, discard, hand, rngState, nextInstanceId };
}

function relevanceForCard(state: GameState, cardId: string) {
  const card = CARD_BY_ID[cardId];
  if (!card) return 0;
  return getIssueRequirements(state).reduce((sum, item) => {
    const remaining = Math.max(0, item.target - (state.issue.capabilityProgress[item.capability] ?? 0));
    return sum + (remaining > 0 ? Math.min(remaining, card.provides?.[item.capability] ?? 0) : 0);
  }, 0);
}

function ensureContextualHand(state: GameState, desired = 3): GameState {
  if (state.hand.length === 0) return state;
  const hand = [...state.hand];
  const deck = [...state.deck];
  let relevant = hand.filter((item) => relevanceForCard(state, item.cardId) > 0).length;
  while (relevant < Math.min(desired, hand.length)) {
    let deckIndex = -1;
    let bestScore = 0;
    deck.forEach((cardId, index) => {
      const score = relevanceForCard(state, cardId);
      if (score > bestScore) { bestScore = score; deckIndex = index; }
    });
    if (deckIndex < 0) break;
    let handIndex = -1;
    let worstScore = Number.POSITIVE_INFINITY;
    hand.forEach((item, index) => {
      const score = relevanceForCard(state, item.cardId);
      if (score < worstScore) { worstScore = score; handIndex = index; }
    });
    if (handIndex < 0 || worstScore > 0) break;
    const incoming = deck[deckIndex];
    deck[deckIndex] = hand[handIndex].cardId;
    hand[handIndex] = { ...hand[handIndex], cardId: incoming };
    relevant += 1;
  }
  return { ...state, hand, deck };
}

function issueDifficulty(state: GameState, commentId: string, stage: StageId) {
  const comment = COMMENT_BY_ID[commentId];
  const role = ROLE_BY_ID[state.roleId];
  let difficulty = comment.difficulty;
  if (role.id === "method" && comment.tags.some((tag) => tag === "clinical" || tag === "external")) difficulty += 1;
  if (role.id === "clinical" && comment.primary === "novelty") difficulty += 1;
  if (role.id === "foundation" && (comment.primary === "reproducibility" || comment.tags.some((tag) => tag === "formatting" || tag === "camera"))) difficulty += 1;
  if (role.id === "small-data" && comment.tags.some((tag) => tag === "external" || tag === "data" || tag === "compute")) difficulty += 2;
  if (stage === "reviewer2") difficulty += 1 + Math.floor(Math.max(0, state.resolved - 8) / 8);
  if (stage === "editor") difficulty += 2;
  if (stage === "camera") difficulty += 1;
  if (stage === "coauthor") difficulty += 3;
  if (state.resources.risk >= 60 && (comment.primary === "reproducibility" || comment.tags.includes("audit"))) difficulty += 1;
  if (comment.tags.some((tag) => tag === "audit" || tag === "code") || comment.primary === "reproducibility") difficulty += Math.min(2, state.conditions.technicalDebt);
  difficulty -= Math.min(2, state.conditions.reviewerFavor);
  difficulty += state.campaign.issueModifier;
  return clamp(difficulty, 5, 20);
}

function campaignMilestones(target: number) {
  const reviewer1 = Math.max(2, Math.round(target * 0.2));
  const reviewer2 = Math.max(reviewer1 + 2, Math.round(target * 0.6));
  const editor = Math.max(reviewer2 + 2, Math.round(target * 0.8));
  return { reviewer1, reviewer2, editor };
}

function routeCoverage(state: GameState, route: ResolutionRoute) {
  return route.requirements.filter((requirement) =>
    state.masterDeck.some((cardId) => cardHasCapability(CARD_BY_ID[cardId], requirement.capability)),
  ).length;
}

function commentHasCoverage(state: GameState, commentId: string) {
  const comment = COMMENT_BY_ID[commentId];
  if (!comment?.routes?.length) return true;
  return comment.routes.some((route) => routeCoverage(state, route) === route.requirements.length);
}

function bestRouteForDeck(state: GameState, commentId: string) {
  const routes = COMMENT_BY_ID[commentId]?.routes ?? [];
  return routes.find((route) => routeCoverage(state, route) === route.requirements.length)
    ?? [...routes].sort((a, b) => routeCoverage(state, b) - routeCoverage(state, a))[0];
}

function spawnIssue(state: GameState, requestedStage?: StageId): GameState {
  let working = state;
  const milestones = campaignMilestones(state.campaign.baseTarget);
  let stage = requestedStage ?? stageForResolved(state.resolved, state.campaign.baseTarget);
  if (state.resolved === milestones.editor && !state.coauthorChecked && !requestedStage) {
    const [roll, rngState] = nextRandom(state.rngState);
    let chance = 0.18 + (state.stats.clarity <= 5 ? 0.12 : 0) + (state.runStats.dangerousPlayed > 0 ? 0.15 : 0);
    chance = Math.min(0.5, chance);
    const hiddenBoss = roll < chance;
    const hiddenExtra = Math.max(2, Math.round(state.campaign.baseTarget * 0.1));
    working = { ...state, rngState, coauthorChecked: true, hiddenBoss, target: hiddenBoss ? state.campaign.baseTarget + hiddenExtra : state.target };
    if (hiddenBoss) stage = "coauthor";
  }

  const stageComments = COMMENTS.filter((comment) => comment.stage === stage);
  const unseen = stageComments.filter((comment) => !working.seenComments.includes(comment.id));
  const covered = unseen.filter((comment) => commentHasCoverage(working, comment.id));
  const candidates = covered.length > 0 ? covered : unseen.length > 0 ? unseen : stageComments;
  const [roll, rngState] = nextRandom(working.rngState);
  const comment = candidates[Math.floor(roll * candidates.length)] ?? stageComments[0] ?? COMMENTS[0];
  const difficulty = issueDifficulty(working, comment.id, stage);
  const route = bestRouteForDeck(working, comment.id) ?? comment.routes?.[0];
  const initialRequirement = route?.requirements[0];
  const statProgress = Math.min(2, Math.floor(working.stats[comment.primary] / 7));
  const relicProgress = working.relics.includes("reviewer-map") ? 2 : 0;
  const capabilityProgress = initialRequirement
    ? { [initialRequirement.capability]: statProgress + relicProgress }
    : {};
  let next: GameState = {
    ...working,
    rngState,
    currentStage: stage,
    conditions: { ...working.conditions, reviewerFavor: 0 },
    issue: {
      commentId: comment.id,
      progress: 0,
      difficulty,
      escalations: 0,
      routeId: route?.id ?? "verify",
      capabilityProgress,
      extraRequirements: [],
      followUps: 0,
    },
    seenComments: [...working.seenComments, comment.id],
  };
  next = syncIssue(next);
  next = ensureContextualHand(next);
  const zh = stage === "coauthor" ? "隐藏 Boss 出现：合作者要求重写整篇。" : comment.quoteZh ?? comment.quote;
  const en = stage === "coauthor" ? "Hidden boss: the coauthor requests a complete rewrite." : comment.quote;
  next = addLog(next, zh, en, stage === "coauthor" ? "danger" : "neutral");
  return addTimeline(next, {
    kind: "review",
    title: stage === "coauthor" ? "隐藏加试：整篇重写" : `收到第 ${state.resolved + 1} 条审稿意见`,
    titleEn: stage === "coauthor" ? "Hidden examination: rewrite everything" : `Review comment ${state.resolved + 1} arrives`,
    detail: zh,
    detailEn: en,
    tone: stage === "coauthor" ? "danger" : "neutral",
  });
}

function createReward(state: GameState, reason: GameState["rewardReason"]): GameState {
  let rngState = state.rngState;
  const offers: RewardOffer[] = [];
  if (reason === "opening" || reason === "stage_clear") {
    let shuffled: typeof RELICS;
    [shuffled, rngState] = shuffle(RELICS.filter((relic) => !state.relics.includes(relic.id)), rngState);
    for (const relic of shuffled.slice(0, 3)) offers.push({ id: `relic:${relic.id}:${state.resolved}`, kind: "relic", contentId: relic.id });
  } else {
    const weighted = CARDS.filter((card) => !state.masterDeck.includes(card.id)).flatMap((card) => {
      const weight = (card.rarity ?? "common") === "common" ? 3 : card.rarity === "uncommon" ? 2 : 1;
      return Array.from({ length: weight }, () => card.id);
    });
    let shuffledIds: string[];
    [shuffledIds, rngState] = shuffle(weighted, rngState);
    for (const cardId of [...new Set(shuffledIds)].slice(0, 2)) offers.push({ id: `card:${cardId}:${state.resolved}`, kind: "card", contentId: cardId });
    let upgradeCandidates: string[];
    [upgradeCandidates, rngState] = shuffle([...new Set(state.masterDeck)].filter((cardId) => !isUpgraded(state, cardId)), rngState);
    if (upgradeCandidates[0]) offers.push({ id: `upgrade:${upgradeCandidates[0]}:${state.resolved}`, kind: "upgrade", contentId: upgradeCandidates[0] });
  }
  if (offers.length === 0) return state;
  return addLog(
    { ...state, rngState, phase: "reward", rewardOffers: offers, rewardReason: reason },
    "新的研究方向出现：选择一项构筑奖励。",
    "A new research direction appears: choose a deck reward.",
    "good",
  );
}

export function createGame(roleId: string, seed: number, setup: RunSetup = DEFAULT_RUN_SETUP): GameState {
  const role = ROLE_BY_ID[roleId] ?? ROLE_BY_ID.method;
  const campaign = resolveCampaignConfig(setup);
  const normalizedSeed = (seed >>> 0) || 0x2f6e2b1;
  const starter = (STARTING_DECKS[role.id] ?? STARTING_DECKS.method).filter((cardId) => CARD_BY_ID[cardId]);
  const [deck, rngState] = shuffle(starter, normalizedSeed);
  let state: GameState = {
    engineVersion: 4,
    phase: "playing",
    seed: normalizedSeed,
    rngState,
    roleId: role.id,
    campaign,
    turn: 1,
    stats: { ...role.stats },
    resources: {
      gpu: clamp(role.resources.gpu * 4 * campaign.resourceMultiplier, 0, MAX_GPU),
      funding: clamp(role.resources.funding * 4 * campaign.resourceMultiplier, 0, MAX_FUNDING),
      mental: clamp((role.resources.mental + 8) * Math.min(1.12, campaign.resourceMultiplier), 0, MAX_MENTAL),
      risk: 0,
      days: clamp(campaign.totalDays + (role.trait?.extraDays ?? 0), 0, MAX_DAYS),
      focus: campaign.difficultyId === "desk_reject" ? 3 : 4,
    },
    deck,
    discard: [],
    exhausted: [],
    masterDeck: [...starter],
    hand: [],
    cardLevels: {},
    relics: [],
    conditions: { ...EMPTY_CONDITIONS },
    rewardOffers: [],
    rewardReason: null,
    nextInstanceId: 1,
    issue: {
      commentId: COMMENTS[0].id,
      progress: 0,
      difficulty: COMMENTS[0].difficulty,
      escalations: 0,
      routeId: "verify",
      capabilityProgress: {},
      extraRequirements: [],
      followUps: 0,
    },
    seenComments: [],
    seenEvents: [],
    resolved: 0,
    target: campaign.baseTarget,
    solvedThisTurn: 0,
    playedThisTurn: [],
    researchedThisTurn: false,
    currentStage: "reviewer1",
    hiddenBoss: false,
    coauthorChecked: false,
    activeEventId: null,
    eventFlow: null,
    runStats: { cardsPlayed: 0, dangerousPlayed: 0, perfectReplies: 0, negativeResults: 0, maxDailySolved: 0, strangestEvent: "", eventsCompleted: 0 },
    logs: [],
    nextLogId: 1,
    timeline: [{
      id: 1,
      turn: 1,
      daysRemaining: clamp(campaign.totalDays + (role.trait?.extraDays ?? 0), 0, MAX_DAYS),
      kind: "submission",
      title: `《${role.name}》正式投稿`,
      titleEn: `${role.en} formally submitted`,
      detail: `编辑部确认收稿。你获得了 ${campaign.totalDays} 天，以及一种暂时没有邮件的宁静。`,
      detailEn: `The editorial office confirms receipt. You receive ${campaign.totalDays} days and a brief, email-free silence.`,
      tone: "good",
    }],
    nextTimelineId: 2,
    lastMessage: "投稿已送达。Reviewer #1 正在输入……",
    ending: null,
  };
  state = spawnIssue(state, "reviewer1");
  state = ensureContextualHand(drawCards(state, BASE_HAND_SIZE + (role.trait?.extraHand ?? 0)));
  return createReward(state, "opening");
}

export function calculateScore(state: GameState) {
  const quality = METRICS.reduce((sum, metric) => sum + state.stats[metric], 0);
  const upgrades = Object.values(state.cardLevels).filter((level) => level > 0).length;
  const raw = Math.max(0, Math.round(
    state.resolved * 240 + quality * 45 + state.resources.mental * 18 + state.resources.gpu * 3 +
    state.resources.funding * 6 + state.resources.days * 20 + state.runStats.perfectReplies * 60 +
    state.relics.length * 45 + upgrades * 35 - state.resources.risk * 9 - state.runStats.dangerousPlayed * 40,
  ));
  return Math.round(raw * (state.campaign?.scoreMultiplier ?? 1));
}

function finish(state: GameState, id: RunEnding["id"]): GameState {
  const copy = ENDING_COPY[id];
  const scored = { ...state, phase: "ended" as const, activeEventId: null, eventFlow: null, rewardOffers: [], rewardReason: null, ending: { id, ...copy, score: calculateScore(state) }, lastMessage: copy.title };
  return addTimeline(scored, {
    kind: "decision",
    title: copy.title,
    titleEn: copy.titleEn ?? copy.title,
    detail: copy.copy,
    detailEn: copy.copyEn ?? copy.copy,
    tone: ["retracted", "burnout", "rejected", "desk_reject"].includes(id) ? "danger" : ["major_revision", "revise_resubmit"].includes(id) ? "neutral" : "good",
  });
}

function resolveHardFailure(state: GameState): GameState | null {
  if (state.resources.risk >= 100) return finish(state, "retracted");
  if (state.resources.mental <= 0) return finish(state, "burnout");
  return null;
}

function finishAccepted(state: GameState): GameState {
  const floor = Math.min(...METRICS.map((metric) => state.stats[metric]));
  if (floor >= 12 && state.resources.risk <= 15 && state.runStats.perfectReplies >= Math.ceil(state.target * 0.2)) return finish(state, "best_paper");
  if (state.resources.risk <= 5 && state.stats.reproducibility >= 10 && state.runStats.negativeResults > 0) return finish(state, "open_science");
  if (state.stats.reproducibility >= 15 && state.stats.evidence >= 12 && state.runStats.dangerousPlayed === 0) return finish(state, "replication_legend");
  if (state.resources.risk === 0 && state.runStats.dangerousPlayed === 0) return finish(state, "clean_review");
  if (state.campaign.lengthId === "espresso" && state.resources.days >= Math.max(2, Math.floor(state.campaign.totalDays * 0.18))) return finish(state, "speedrun");
  if (state.resources.days <= 1) return finish(state, "last_minute");
  if (state.resources.mental <= 3) return finish(state, "survivor_accept");
  if (state.hiddenBoss) return finish(state, "coauthor_ending");
  return finish(state, "accepted");
}

function deadlineDecision(state: GameState): GameState {
  const quality = METRICS.reduce((sum, metric) => sum + state.stats[metric], 0);
  const floor = Math.min(...METRICS.map((metric) => state.stats[metric]));
  if (state.resolved >= state.target - 2 && quality >= 32 && floor >= 5) return finish(state, "minor_revision");
  if (state.resolved >= state.target - 4 && quality >= 24 && floor >= 3) return finish(state, "major_revision");
  if (state.resolved >= state.target - 8 && quality >= 20 && floor >= 2) return finish(state, "revise_resubmit");
  if (state.resolved < Math.ceil(state.target * 0.25) || state.stats.novelty <= 1) return finish(state, "desk_reject");
  return finish(state, "rejected");
}

function followUpCapability(state: GameState, route: ResolutionRoute) {
  const used = new Set(getIssueRequirements(state).map((item) => item.capability));
  const candidates: Capability[] = [route.followUpCapability, "protocol", "uncertainty", "responseWriting", "documentation", "literature"];
  const covered = (capability: Capability) => state.masterDeck.some((cardId) => cardHasCapability(CARD_BY_ID[cardId], capability));
  return candidates.find((capability) => !used.has(capability) && covered(capability))
    ?? candidates.find(covered)
    ?? route.requirements[0]?.capability
    ?? route.followUpCapability;
}

function maybeCreateFollowUp(state: GameState): GameState | null {
  if ((state.currentStage !== "reviewer2" && state.currentStage !== "coauthor") || state.issue.followUps >= 2) return null;
  const route = getCurrentRoute(state);
  if (!route) return null;
  const [roll, rngState] = nextRandom(state.rngState);
  const chance = Math.min(0.55, route.followUpChance + state.issue.escalations * 0.04 + (state.currentStage === "coauthor" ? 0.12 : 0));
  if (roll >= chance) return { ...state, rngState };
  const capability = followUpCapability(state, route);
  const meta = CAPABILITY_META[capability];
  const target = 2 + Math.min(2, state.issue.followUps);
  const extra: CapabilityRequirement = {
    id: `${state.issue.commentId}:followup:${state.issue.followUps + 1}`,
    capability,
    label: `追问：${meta.label}`,
    labelEn: `Follow-up: ${meta.labelEn}`,
    target,
  };
  let next = {
    ...state,
    rngState,
    issue: {
      ...state.issue,
      difficulty: state.issue.difficulty + target,
      extraRequirements: [...state.issue.extraRequirements, extra],
      followUps: state.issue.followUps + 1,
    },
  };
  next = syncIssue(next);
  next = ensureContextualHand(next);
  return addLog(
    next,
    `Reviewer #2 移动了球门：请再补充「${meta.label}」。`,
    `Reviewer #2 moves the goalposts: please also address ${meta.labelEn}.`,
    "danger",
  );
}

function resolveIssue(state: GameState, overshoot: number): GameState {
  const followUp = maybeCreateFollowUp(state);
  if (followUp && followUp.issue.followUps > state.issue.followUps) return followUp;
  let working = followUp ?? state;
  const route = getCurrentRoute(working);
  if (route?.resolutionDelta) working = applyDelta(working, route.resolutionDelta);
  const exact = overshoot <= 1;
  const solvedThisTurn = working.solvedThisTurn + 1;
  const resolved = working.resolved + 1;
  let next: GameState = {
    ...working,
    resolved,
    solvedThisTurn,
    resources: {
      ...working.resources,
      mental: clamp(working.resources.mental + 2 + (exact && working.relics.includes("red-pen") ? 1 : 0), 0, MAX_MENTAL),
      focus: clamp(working.resources.focus + (exact ? 1 : 0), 0, MAX_FOCUS),
    },
    stats: exact && working.relics.includes("red-pen") ? normalizeStats({ ...working.stats, clarity: working.stats.clarity + 1 }) : working.stats,
    runStats: {
      ...working.runStats,
      perfectReplies: working.runStats.perfectReplies + (exact ? 1 : 0),
      maxDailySolved: Math.max(working.runStats.maxDailySolved, solvedThisTurn),
    },
  };
  next = addLog(
    next,
    exact ? `路线完成：${route?.name ?? "审稿意见"}，精准回复返还 1 专注。` : `已解决第 ${resolved} 条审稿意见。`,
    exact ? `Route complete: ${route?.nameEn ?? "review comment"}. A precise reply refunds 1 Focus.` : `Resolved reviewer comment ${resolved}.`,
    "good",
  );
  next = addTimeline(next, {
    kind: "revision",
    title: `第 ${resolved} 条意见已回复`,
    titleEn: `Comment ${resolved} resolved`,
    detail: `采用「${route?.name ?? "当前路线"}」完成回应${exact ? "，编辑系统标记为精准回复" : ""}。`,
    detailEn: `Completed via ${route?.nameEn ?? "the selected route"}${exact ? "; the portal marks it as a precise response" : ""}.`,
    tone: "good",
  });
  if (resolved >= next.target) return finishAccepted(next);
  const milestones = campaignMilestones(next.campaign.baseTarget);
  if ([milestones.reviewer1, milestones.reviewer2, milestones.editor].includes(resolved)) return createReward(next, "stage_clear");
  if (resolved % 4 === 0) return createReward(next, "peer_review");
  return spawnIssue(next);
}

function addCapabilityProgress(state: GameState, details: AnswerDetails, bonus = 0) {
  const capabilityProgress = { ...state.issue.capabilityProgress };
  details.contributions.forEach((item, index) => {
    capabilityProgress[item.capability] = (capabilityProgress[item.capability] ?? 0) + item.amount + (index === 0 ? bonus : 0);
  });
  return syncIssue({ ...state, issue: { ...state.issue, capabilityProgress } });
}

function playCard(state: GameState, instanceId: number): GameState {
  if (state.phase !== "playing" || state.ending) return state;
  const handIndex = state.hand.findIndex((item) => item.instanceId === instanceId);
  if (handIndex < 0) return state;
  const instance = state.hand[handIndex];
  const card = CARD_BY_ID[instance.cardId];
  if (!card) return state;
  const blocked = paymentBlock(state, card);
  if (blocked) return addLog(state, `${card.name}：${blocked.zh}。`, `${card.en}: ${blocked.en}.`, "bad");

  const details = answerForCard(state, card);
  const remainingBefore = Math.max(0, state.issue.difficulty - state.issue.progress);
  const costs = getCardCosts(state, card);
  const hand = state.hand.filter((item) => item.instanceId !== instanceId);
  let next: GameState = {
    ...state,
    hand,
    discard: card.exhaust ? state.discard : [...state.discard, card.id],
    exhausted: card.exhaust ? [...state.exhausted, card.id] : state.exhausted,
    playedThisTurn: [...state.playedThisTurn, card.id],
    resources: {
      ...state.resources,
      focus: state.resources.focus - costs.focus,
      gpu: state.resources.gpu - costs.gpu,
      funding: state.resources.funding - costs.funding,
      mental: state.resources.mental - costs.mental,
      risk: clamp(state.resources.risk + costs.risk, 0, 100),
    },
    runStats: {
      ...state.runStats,
      cardsPlayed: state.runStats.cardsPlayed + 1,
      dangerousPlayed: state.runStats.dangerousPlayed + (card.category === "questionable" ? 1 : 0),
      negativeResults: state.runStats.negativeResults + (card.id === "negative-results" ? 1 : 0),
    },
  };
  next = applyDelta(next, card.delta);
  if (card.condition) next = applyConditions(next, card.condition);
  if (isUpgraded(state, card.id) && card.category === "rigor") next = applyDelta(next, { risk: -3 });
  if (isUpgraded(state, card.id) && card.category === "support") next = applyDelta(next, { mental: 1 });
  if (state.relics.includes("open-notebook") && card.category === "rigor") next = applyDelta(next, { risk: -1 });
  if (state.relics.includes("support-group") && card.category === "support" && !hasPlayedCategory(state, "support")) next = applyDelta(next, { mental: 2 });
  if (state.roleId === "clinical" && card.category === "rigor" && !hasPlayedCategory(state, "rigor")) next = applyDelta(next, { mental: 1 });

  let answerBonus = 0;
  let answerPenalty = 0;
  let outcome = details.answer > 0
    ? `${card.name}：推进 ${details.contributions.map((item) => `${item.label} +${item.amount}`).join("、")}。`
    : `${card.name}改善了论文，但没有回答当前路线的任何步骤。`;
  let outcomeEn = details.answer > 0
    ? `${card.en}: ${details.contributions.map((item) => `${item.labelEn} +${item.amount}`).join(", ")}.`
    : `${card.en} improves the paper but does not answer any step in the current route.`;
  if (card.volatile) {
    const [roll, rngState] = nextRandom(next.rngState);
    next = { ...next, rngState };
    if (card.volatile === "seed") {
      const threshold = state.relics.includes("golden-seed") ? 0.75 : 0.55;
      if (roll < threshold && details.answer > 0) {
        next = applyDelta(next, { stats: { evidence: 3 } });
        answerBonus = 3;
        outcome = "随机种子站在你这边：匹配步骤与证据大幅提升。";
        outcomeEn = "The random seed sides with you: the matched step and Evidence surge.";
      } else {
        next = applyDelta(next, { stats: { evidence: -1 }, mental: -2 });
        answerPenalty = details.answer > 0 ? 1 : 0;
        outcome = "随机种子背叛了你：指标更差，焦虑更真。";
        outcomeEn = "The seed betrays you: worse metrics, better anxiety.";
      }
    } else if (roll < 0.65 && details.answer > 0) {
      next = applyDelta(next, { stats: { clarity: 1 } });
      answerBonus = 3;
      outcome = "合作者发来了真正有用、而且与当前任务相关的修改。";
      outcomeEn = "The coauthor sends genuinely useful edits that address the current task.";
    } else {
      next = applyDelta(next, { mental: -1 });
      outcome = "合作者回复：Looks good to me。当前步骤没有推进。";
      outcomeEn = "Coauthor: Looks good to me. No current step advances.";
    }
  }

  const adjustedDetails = answerPenalty > 0
    ? { ...details, contributions: details.contributions.map((item, index) => index === 0 ? { ...item, amount: Math.max(0, item.amount - answerPenalty) } : item) }
    : details;
  next = addCapabilityProgress(next, adjustedDetails, answerBonus);
  if (state.conditions.insight > 0 && details.answer > 0) next = { ...next, conditions: { ...next.conditions, insight: 0 } };
  if (card.shrinkIssue) {
    next = syncIssue({ ...next, issue: { ...next.issue, difficulty: Math.max(next.issue.progress + 1, next.issue.difficulty - card.shrinkIssue) } });
  }
  if (isUpgraded(state, card.id) && card.category === "support") next = drawCards(next, next.hand.length + 1);
  next = addLog(next, outcome, outcomeEn, card.category === "questionable" ? "danger" : details.answer > 0 ? "good" : "neutral");

  const failed = resolveHardFailure(next);
  if (failed) return failed;
  if (next.resources.days <= 0) return deadlineDecision(next);
  if (next.issue.progress >= next.issue.difficulty) {
    const rawAfterVolatile = Math.max(0, details.rawAnswer + answerBonus - answerPenalty);
    return resolveIssue(next, Math.max(0, rawAfterVolatile - remainingBefore));
  }
  return next;
}

function chooseEvent(state: GameState): GameState {
  const unseen = EVENTS.filter((event) => !state.seenEvents.includes(event.id));
  const pool = unseen.length > 0 ? unseen : EVENTS;
  const [roll, rngState] = nextRandom(state.rngState);
  const event = pool[Math.floor(roll * pool.length)] ?? EVENTS[0];
  let next: GameState = {
    ...state,
    phase: "event",
    rngState,
    activeEventId: event.id,
    eventFlow: { eventId: event.id, choiceId: null, beatIndex: 0, status: "choice" },
    seenEvents: [...state.seenEvents, event.id],
    runStats: { ...state.runStats, strangestEvent: event.id },
    lastMessage: `突发事件：${event.title}`,
  };
  next = addTimeline(next, {
    kind: "event",
    title: `突发事件：${event.title}`,
    titleEn: `Breaking event: ${eventTitle(event, "en")}`,
    detail: event.description,
    detailEn: eventDescription(event, "en"),
    tone: "neutral",
  });
  return next;
}

function applyDailyRelics(state: GameState) {
  return state.relics.reduce((next, relicId) => {
    const daily = RELIC_BY_ID[relicId]?.effect?.daily;
    return daily ? applyDelta(next, daily) : next;
  }, state);
}

function prepareNextDay(state: GameState): GameState {
  const role = ROLE_BY_ID[state.roleId];
  const caffeineBonus = Math.min(2, state.conditions.caffeine);
  const plantBonus = state.relics.includes("desk-plant") ? 1 : 0;
  let next: GameState = {
    ...state,
    phase: "playing",
    activeEventId: null,
    conditions: { ...state.conditions, caffeine: 0 },
    resources: {
      ...state.resources,
      focus: clamp((state.turn >= 32 ? 5 : 4) + caffeineBonus, 0, MAX_FOCUS),
      mental: clamp(state.resources.mental + plantBonus, 0, MAX_MENTAL),
    },
  };
  next = applyDailyRelics(next);
  next = drawCards(next, BASE_HAND_SIZE + (role.trait?.extraHand ?? 0));
  return ensureContextualHand(next);
}

function ageConditions(conditions: ConditionState): ConditionState {
  return {
    ...conditions,
    pageDebt: Math.max(0, conditions.pageDebt - 1),
    infrastructureDown: Math.max(0, conditions.infrastructureDown - 1),
    queueDelay: Math.max(0, conditions.queueDelay - 1),
    advisorPressure: Math.max(0, conditions.advisorPressure - 1),
    coauthorTrust: Math.max(0, conditions.coauthorTrust - 1),
    auditTrail: Math.max(0, conditions.auditTrail - 1),
  };
}

function endTurn(state: GameState): GameState {
  if (state.phase !== "playing" || state.ending) return state;
  const comment = getCurrentComment(state);
  const rawPenalty = Math.max(0, 1 + state.campaign.pressureModifier + state.issue.escalations + (comment.severity === 3 ? 1 : 0));
  const statDefense = Math.floor(state.stats[comment.primary] / 7);
  const requirements = getIssueRequirements(state);
  const madeRelevantProgress = state.playedThisTurn.some((cardId) => {
    const card = CARD_BY_ID[cardId];
    return card && requirements.some((item) => cardHasCapability(card, item.capability));
  });
  let penalty = state.solvedThisTurn > 0 || madeRelevantProgress ? 0 : clamp(rawPenalty - statDefense, 1, 5);
  if (state.roleId === "interdisciplinary" && penalty > 0) penalty += 1;
  const retained = state.hand.filter((item) => CARD_BY_ID[item.cardId]?.retain);
  const discarded = state.hand.filter((item) => !CARD_BY_ID[item.cardId]?.retain).map((item) => item.cardId);
  let next: GameState = {
    ...state,
    turn: state.turn + 1,
    hand: retained,
    discard: [...state.discard, ...discarded, ...state.exhausted],
    exhausted: [],
    playedThisTurn: [],
    researchedThisTurn: false,
    solvedThisTurn: 0,
    conditions: ageConditions(state.conditions),
    resources: {
      ...state.resources,
      days: clamp(state.resources.days - 1, 0, MAX_DAYS),
      mental: clamp(state.resources.mental - penalty + (state.solvedThisTurn >= 2 ? 1 : 0), 0, MAX_MENTAL),
      focus: 0,
    },
    issue: {
      ...state.issue,
      difficulty: state.issue.difficulty + (penalty > 0 ? 1 : 0),
      escalations: state.issue.escalations + (penalty > 0 ? 1 : 0),
    },
  };
  next = syncIssue(next);
  next = penalty > 0
    ? addLog(next, `未解决意见造成 ${penalty} 点精神伤害；Reviewer 又提高了一个步骤的标准。`, `The unresolved comment deals ${penalty} Mental damage; the reviewer raises the bar on one step.`, "bad")
    : addLog(next, "今日回复已送达。暂时没有新邮件。", "Today's response is sent. No new email—for now.", "good");
  const failed = resolveHardFailure(next);
  if (failed) return failed;
  if (next.resources.days <= 0) return deadlineDecision(next);
  if (next.turn >= 2 && (next.turn - 1) % next.campaign.eventEvery === 0) return chooseEvent(next);
  return prepareNextDay(next);
}

export function canChooseEvent(state: GameState, choice: EventChoice) {
  if (state.phase !== "event" || state.eventFlow?.status !== "choice") return false;
  if ((choice.delta.gpu ?? 0) < 0 && state.resources.gpu < -(choice.delta.gpu ?? 0)) return false;
  if ((choice.delta.funding ?? 0) < 0 && state.resources.funding < -(choice.delta.funding ?? 0)) return false;
  if ((choice.delta.focus ?? 0) < 0 && state.resources.focus < -(choice.delta.focus ?? 0)) return false;
  return true;
}

function applyEventEffect(state: GameState, choice: EventChoice) {
  let next = state;
  const effect = choice.effect;
  if (!effect) return next;
  if (effect.conditions) next = applyConditions(next, effect.conditions);
  if (effect.addCard && CARD_BY_ID[effect.addCard] && !next.masterDeck.includes(effect.addCard)) {
    next = { ...next, masterDeck: [...next.masterDeck, effect.addCard], discard: [...next.discard, effect.addCard] };
  }
  if (effect.gainRelic && RELIC_BY_ID[effect.gainRelic] && !next.relics.includes(effect.gainRelic)) {
    next = { ...next, relics: [...next.relics, effect.gainRelic] };
  }
  if (effect.upgradeRandom) {
    const candidates = [...new Set(next.masterDeck)].filter((cardId) => !isUpgraded(next, cardId));
    if (candidates.length > 0) {
      const [roll, rngState] = nextRandom(next.rngState);
      const cardId = candidates[Math.floor(roll * candidates.length)];
      next = { ...next, rngState, cardLevels: { ...next.cardLevels, [cardId]: 1 } };
    }
  }
  if (effect.removeQuestionable) {
    const cardId = next.masterDeck.find((id) => CARD_BY_ID[id]?.category === "questionable");
    if (cardId) {
      const removeOne = (items: string[]) => {
        const index = items.indexOf(cardId);
        return index < 0 ? items : [...items.slice(0, index), ...items.slice(index + 1)];
      };
      next = {
        ...next,
        masterDeck: removeOne(next.masterDeck), deck: removeOne(next.deck), discard: removeOne(next.discard),
        exhausted: removeOne(next.exhausted), hand: next.hand.filter((item) => item.cardId !== cardId),
      };
    }
  }
  return next;
}

export function getEventDialogue(choice: EventChoice, event?: EventDef) {
  if (choice.story && choice.story.length > 0) return choice.story.slice(0, 3);
  const labelEn = event ? eventChoiceText(event, choice, "label", "en") : choice.labelEn ?? choice.label;
  return [{
    speaker: "你",
    speakerEn: "You",
    text: `“${choice.label}。”你按下发送。对话框里出现三个点，停了很久，又消失了。`,
    textEn: `“${labelEn}.” You press Send. Three dots appear, linger, and disappear.`,
    aside: "选择已经作出，收益与代价将在故事结束后揭晓。",
    asideEn: "The choice is locked. Its costs and rewards will be revealed after the scene.",
  }];
}

function selectEventChoice(state: GameState, eventId: string, choiceId: string): GameState {
  if (state.phase !== "event" || state.activeEventId !== eventId || state.ending || state.eventFlow?.status !== "choice") return state;
  const event = EVENT_BY_ID[eventId];
  const choice = event?.choices.find((item) => item.id === choiceId);
  if (!event || !choice || !canChooseEvent(state, choice)) return state;
  const before = {
    stats: { ...state.stats },
    resources: { ...state.resources },
    conditions: { ...state.conditions },
    masterDeck: [...state.masterDeck],
    cardLevels: { ...state.cardLevels },
    relics: [...state.relics],
  };
  return addLog(
    { ...state, eventFlow: { eventId, choiceId, beatIndex: 0, status: "dialogue", before } },
    `${event.title}：你选择了「${choice.label}」，结果尚未揭晓。`,
    `${eventTitle(event, "en")}: you choose “${eventChoiceText(event, choice, "label", "en")}.” Outcome pending.`,
    "neutral",
  );
}

function advanceEvent(state: GameState): GameState {
  const flow = state.eventFlow;
  if (state.phase !== "event" || !flow || flow.status !== "dialogue" || !flow.choiceId || state.ending) return state;
  const event = EVENT_BY_ID[flow.eventId];
  const choice = event?.choices.find((item) => item.id === flow.choiceId);
  if (!event || !choice) return state;
  const dialogue = getEventDialogue(choice, event);
  if (flow.beatIndex < dialogue.length - 1) {
    return { ...state, eventFlow: { ...flow, beatIndex: flow.beatIndex + 1 } };
  }
  let delta = choice.delta;
  const shield = state.relics.reduce((sum, relicId) => sum + (RELIC_BY_ID[relicId]?.effect?.eventShield ?? 0), 0);
  if (state.relics.includes("backup-drive") && (delta.stats?.reproducibility ?? 0) < 0) {
    delta = { ...delta, stats: { ...delta.stats, reproducibility: Math.min(0, (delta.stats?.reproducibility ?? 0) + 2) } };
  }
  if (shield > 0) {
    const protectedResources = ["gpu", "funding", "mental", "days", "focus"] as const;
    const protectedDelta = { ...delta };
    protectedResources.forEach((key) => {
      if ((protectedDelta[key] ?? 0) < 0) protectedDelta[key] = Math.min(0, (protectedDelta[key] ?? 0) + shield);
    });
    delta = protectedDelta;
  }
  let next = applyEventEffect(applyDelta(state, delta), choice);
  next = addLog(next, `${event.title}：${choice.result}`, `${eventTitle(event, "en")}: ${eventChoiceText(event, choice, "result", "en")}`, "neutral");
  next = {
    ...next,
    eventFlow: { ...flow, beatIndex: dialogue.length - 1, status: "reveal" },
    runStats: { ...next.runStats, eventsCompleted: next.runStats.eventsCompleted + 1 },
  };
  return addTimeline(next, {
    kind: "event",
    title: `${event.title} · 结案`,
    titleEn: `${eventTitle(event, "en")} · resolved`,
    detail: choice.result,
    detailEn: eventChoiceText(event, choice, "result", "en"),
    tone: (choice.delta.risk ?? 0) >= 10 || (choice.delta.mental ?? 0) <= -4 ? "danger" : (choice.delta.risk ?? 0) < 0 || (choice.delta.mental ?? 0) > 0 ? "good" : "neutral",
  });
}

function completeEvent(state: GameState): GameState {
  if (state.phase !== "event" || state.eventFlow?.status !== "reveal" || state.ending) return state;
  const next: GameState = { ...state, activeEventId: null, eventFlow: null };
  const failed = resolveHardFailure(next);
  if (failed) return failed;
  if (next.resources.days <= 0) return deadlineDecision(next);
  return prepareNextDay(next);
}

function finishReward(next: GameState, reason: GameState["rewardReason"]) {
  if (reason === "opening") return ensureContextualHand(next);
  return ensureContextualHand(spawnIssue(next));
}

function chooseReward(state: GameState, offerId: string): GameState {
  if (state.phase !== "reward" || state.ending) return state;
  const offer = state.rewardOffers.find((item) => item.id === offerId);
  if (!offer) return state;
  const reason = state.rewardReason;
  let next: GameState = { ...state, phase: "playing", rewardOffers: [], rewardReason: null };
  if (offer.kind === "relic" && RELIC_BY_ID[offer.contentId] && !next.relics.includes(offer.contentId)) {
    const relic = RELIC_BY_ID[offer.contentId];
    next = { ...next, relics: [...next.relics, relic.id] };
    next = addLog(next, `获得遗物：${relic.name}。`, `Relic acquired: ${relic.en}.`, "good");
  } else if (offer.kind === "card" && CARD_BY_ID[offer.contentId]) {
    const card = CARD_BY_ID[offer.contentId];
    next = { ...next, masterDeck: [...next.masterDeck, card.id], discard: [...next.discard, card.id] };
    next = addLog(next, `新卡加入牌组：${card.name}。`, `New card added: ${card.en}.`, "good");
  } else if (offer.kind === "upgrade" && CARD_BY_ID[offer.contentId]) {
    const card = CARD_BY_ID[offer.contentId];
    next = { ...next, cardLevels: { ...next.cardLevels, [card.id]: 1 } };
    next = addLog(next, `卡牌升级：${card.name}。`, `Card upgraded: ${card.en}.`, "good");
  }
  const label = offer.kind === "relic"
    ? RELIC_BY_ID[offer.contentId]?.name
    : CARD_BY_ID[offer.contentId]?.name;
  const labelEn = offer.kind === "relic"
    ? RELIC_BY_ID[offer.contentId]?.en
    : CARD_BY_ID[offer.contentId]?.en;
  next = addTimeline(next, {
    kind: "revision",
    title: offer.kind === "upgrade" ? `升级行动：${label ?? offer.contentId}` : `研究资产入组：${label ?? offer.contentId}`,
    titleEn: offer.kind === "upgrade" ? `Action upgraded: ${labelEn ?? offer.contentId}` : `Research asset acquired: ${labelEn ?? offer.contentId}`,
    detail: reason === "stage_clear" ? "阶段复盘完成，这项选择将影响后续评审。" : "牌组构筑记录已写入修稿档案。",
    detailEn: reason === "stage_clear" ? "Stage review complete; this choice will shape later rounds." : "The deckbuilding choice enters the revision archive.",
    tone: "good",
  });
  return finishReward(next, reason);
}

function skipReward(state: GameState): GameState {
  if (state.phase !== "reward" || state.ending) return state;
  const reason = state.rewardReason;
  const next = addLog(
    applyDelta({ ...state, phase: "playing", rewardOffers: [], rewardReason: null }, { mental: 2 }),
    "你跳过奖励，回复了 2 点精神。",
    "You skip the reward and restore 2 Mental Health.",
    "neutral",
  );
  return finishReward(addTimeline(next, {
    kind: "revision",
    title: "跳过新方向，保住精神状态",
    titleEn: "Skipped a new direction to preserve Mental Health",
    detail: "你礼貌地拒绝再开一条支线。待办列表第一次变短。",
    detailEn: "You politely decline another research branch. The task list gets shorter for once.",
    tone: "neutral",
  }), reason);
}

function chooseRoute(state: GameState, routeId: ResolutionRoute["id"]): GameState {
  if (state.phase !== "playing" || state.issue.routeId === routeId) return state;
  const route = getCurrentComment(state)?.routes?.find((item) => item.id === routeId);
  if (!route || routeCoverage(state, route) < route.requirements.length) return state;
  let next = syncIssue({ ...state, issue: { ...state.issue, routeId } });
  next = ensureContextualHand(next);
  return addLog(next, `修改策略切换为「${route.name}」，已完成的能力进度会保留。`, `Strategy switched to ${route.nameEn}; completed capability work is retained.`, "neutral");
}

function researchRelevantAction(state: GameState): GameState {
  if (state.phase !== "playing" || state.researchedThisTurn || state.resources.focus < 1) return state;
  const sources = [
    ...state.deck.map((cardId, index) => ({ zone: "deck" as const, cardId, index })),
    ...state.discard.map((cardId, index) => ({ zone: "discard" as const, cardId, index })),
  ];
  const candidate = sources
    .map((item) => ({ ...item, score: relevanceForCard(state, item.cardId) }))
    .sort((a, b) => b.score - a.score)[0];
  if (!candidate || candidate.score <= 0) {
    return addLog({ ...state, researchedThisTurn: true, resources: { ...state.resources, focus: state.resources.focus - 1 } }, "检索完成，但当前牌组里没有能直接回答这条路线的行动。", "Research completes, but this deck contains no action that directly answers the route.", "bad");
  }
  const deck = [...state.deck];
  const discard = [...state.discard];
  if (candidate.zone === "deck") deck.splice(candidate.index, 1);
  else discard.splice(candidate.index, 1);
  const hand = [...state.hand];
  if (hand.length >= BASE_HAND_SIZE + (ROLE_BY_ID[state.roleId]?.trait?.extraHand ?? 0)) {
    let worstIndex = 0;
    hand.forEach((item, index) => {
      if (relevanceForCard(state, item.cardId) < relevanceForCard(state, hand[worstIndex].cardId)) worstIndex = index;
    });
    discard.push(hand[worstIndex].cardId);
    hand.splice(worstIndex, 1);
  }
  const card = CARD_BY_ID[candidate.cardId];
  hand.push({ instanceId: state.nextInstanceId, cardId: candidate.cardId });
  return addLog(
    { ...state, deck, discard, hand, nextInstanceId: state.nextInstanceId + 1, researchedThisTurn: true, resources: { ...state.resources, focus: state.resources.focus - 1 } },
    `定向检索找到「${card.name}」，已替换一张离题行动。`,
    `Targeted research finds ${card.en}, replacing an off-topic action.`,
    "good",
  );
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (state.phase === "ended") return state;
  switch (action.type) {
    case "PLAY_CARD": return playCard(state, action.instanceId);
    case "END_TURN": return action.expectedTurn === state.turn ? endTurn(state) : state;
    case "CHOOSE_EVENT": return selectEventChoice(state, action.eventId, action.choiceId);
    case "ADVANCE_EVENT": return advanceEvent(state);
    case "COMPLETE_EVENT": return completeEvent(state);
    case "CHOOSE_REWARD": return chooseReward(state, action.offerId);
    case "SKIP_REWARD": return skipReward(state);
    case "CHOOSE_ROUTE": return chooseRoute(state, action.routeId);
    case "RESEARCH": return researchRelevantAction(state);
    default: return state;
  }
}

export function cardDeltaSummary(card: CardDef, locale: Locale = "en") {
  const parts: string[] = [];
  const labels: Record<Metric, string> = locale === "zh"
    ? { novelty: "创新", evidence: "证据", clarity: "清晰", reproducibility: "复现" }
    : { novelty: "Novelty", evidence: "Evidence", clarity: "Clarity", reproducibility: "Repro" };
  for (const metric of METRICS) {
    const value = card.delta?.stats?.[metric];
    if (value) parts.push(`${labels[metric]} ${value > 0 ? "+" : ""}${value}`);
  }
  const resourceLabels = locale === "zh"
    ? { mental: "精神", risk: "风险", gpu: "GPU", days: "天数", funding: "经费", focus: "专注" }
    : { mental: "Mental", risk: "Risk", gpu: "GPU", days: "Days", funding: "Funding", focus: "Focus" };
  for (const key of ["mental", "risk", "gpu", "days", "funding", "focus"] as const) {
    const value = card.delta?.[key];
    if (value) parts.push(`${resourceLabels[key]} ${value > 0 ? "+" : ""}${value}`);
  }
  return parts.join(" · ") || (locale === "zh" ? "即时策略牌" : "Immediate strategy card");
}

export function getActiveEvent(state: GameState) {
  return state.activeEventId ? EVENT_BY_ID[state.activeEventId] : null;
}

export function getCampaignConfig(setup?: RunSetup) {
  if (!setup) return { days: 48, target: 40, handSize: BASE_HAND_SIZE };
  const campaign = resolveCampaignConfig(setup);
  return { days: campaign.totalDays, target: campaign.baseTarget, handSize: BASE_HAND_SIZE, ...campaign };
}
