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
  EventDecisionRound,
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

function eventStoryVariant(eventId: string) {
  return [...eventId].reduce((value, character) => (value * 31 + character.charCodeAt(0)) >>> 0, 17) % 4;
}

export function getEventDecisionRound(event: EventDef, choice: EventChoice, roundIndex: number, decisionIds: string[] = []): EventDecisionRound {
  const variant = eventStoryVariant(event.id);
  const eventZh = eventTitle(event, "zh");
  const eventEn = eventTitle(event, "en");
  const actionZh = eventChoiceText(event, choice, "label", "zh");
  const actionEn = eventChoiceText(event, choice, "label", "en");

  const firstRounds: EventDecisionRound[] = [
    {
      id: "room", speaker: "项目群聊", speakerEn: "Project Chat",
      narrative: `${eventDescription(event, "zh")} 你提出“${actionZh}”后，群聊里的“正在输入”亮了又灭。终于有人问：如果今晚只能救下一件东西，究竟救实验、记录，还是救人？`,
      narrativeEn: `${eventDescription(event, "en")} After you propose “${actionEn},” the typing indicator appears, vanishes, and returns. Someone finally asks: if only one thing survives tonight, is it the experiment, the record, or the researcher?`,
      prompt: "你怎么把这场混乱变成一个共同决定？", promptEn: "How do you turn the confusion into a shared decision?",
      options: [
        { id: "room-owners", label: "让每个人说出最担心失去的东西", labelEn: "Ask what everyone is most afraid to lose", response: "答案彼此冲突，却第一次把真正的风险摆在了同一张桌上。", responseEn: "The answers conflict, but the real risks finally occupy the same table.", delta: { mental: -1, stats: { clarity: 1, reproducibility: 1 }, risk: -1 } },
        { id: "room-command", label: "直接分配任务，先让现场动起来", labelEn: "Assign tasks and get the room moving", response: "所有人立刻有了动词，至于这些动词是否指向同一个目标，暂时没人追问。", responseEn: "Everyone immediately gets a verb. Whether those verbs share a destination remains unasked.", delta: { mental: 1, days: 1, risk: 2 } },
      ],
    },
    {
      id: "thread", speaker: "邮件线程（17 封未读）", speakerEn: "Email Thread (17 unread)",
      narrative: `${eventDescription(event, "zh")} 你写下“${actionZh}”，抄送列表随即多了四个人。每个人都引用了不同版本的附件，并礼貌地认为自己看到的是最终版。`,
      narrativeEn: `${eventDescription(event, "en")} You write “${actionEn},” and four more people join CC. Each quotes a different attachment and politely assumes theirs is final.`,
      prompt: "下一封邮件要公开到什么程度？", promptEn: "How much should the next message reveal?",
      options: [
        { id: "thread-all", label: "Reply All：把失败事实与版本号写清楚", labelEn: "Reply All with failures and version numbers", response: "线程短暂安静，因为所有人终于在讨论同一份文件。", responseEn: "The thread falls briefly silent because everyone is finally discussing the same file.", delta: { mental: -1, stats: { reproducibility: 1 }, risk: -2 } },
        { id: "thread-call", label: "拉核心人员开一个十分钟小会", labelEn: "Move the core people into a ten-minute call", response: "十分钟变成二十七分钟，但至少没有产生第十八封互相矛盾的邮件。", responseEn: "Ten minutes become twenty-seven, but no eighteenth contradictory email is born.", delta: { mental: -1, stats: { clarity: 1 }, risk: 1 } },
      ],
    },
    {
      id: "advisor", speaker: "导师", speakerEn: "Advisor",
      narrative: `${eventDescription(event, "zh")} 你解释准备“${actionZh}”。导师没有立刻反对，只把眼镜推高一点，说：“可以。但什么结果会让你承认这条路不通？”`,
      narrativeEn: `${eventDescription(event, "en")} You explain that you plan to “${actionEn}.” Your advisor does not object, only adjusts their glasses: “Fine. What result would make you admit this path is not working?”`,
      prompt: "你如何回答这个危险但合理的问题？", promptEn: "How do you answer the dangerous but reasonable question?",
      options: [
        { id: "advisor-criterion", label: "当场写下停止标准和判断依据", labelEn: "Write the stopping rule and decision criterion", response: "白板上多了一条未来的你无法轻易改写的边界。", responseEn: "The whiteboard gains a boundary that future-you cannot quietly rewrite.", delta: { stats: { evidence: 1, reproducibility: 1 }, risk: -1 } },
        { id: "advisor-promise", label: "保证今晚一定拿出一个结果", labelEn: "Promise a result before tonight ends", response: "导师点头，截止日期仿佛因此又向前走了半步。", responseEn: "Your advisor nods, and the deadline seems to take half a step closer.", delta: { mental: -2, days: 1, risk: 2 } },
      ],
    },
    {
      id: "evidence", speaker: "现场记录", speakerEn: "Incident Log",
      narrative: `${eventDescription(event, "zh")} 你决定“${actionZh}”。屏幕上仍有窗口在刷新，日志仍在增长；每多等一分钟，证据更多，现场也更难复原。`,
      narrativeEn: `${eventDescription(event, "en")} You decide to “${actionEn}.” Windows keep refreshing and logs keep growing; every extra minute creates more evidence and makes the scene harder to reconstruct.`,
      prompt: "现在先固定证据，还是边处理边观察？", promptEn: "Do you freeze the evidence now or keep observing while acting?",
      options: [
        { id: "evidence-freeze", label: "冻结日志、环境和当前版本", labelEn: "Freeze logs, environment, and current revision", response: "时间戳终于排成一条能解释的线，虽然修复因此慢了一点。", responseEn: "The timestamps finally form an explainable line, though the repair slows down.", delta: { gpu: -1, stats: { reproducibility: 1 }, risk: -2 } },
        { id: "evidence-live", label: "保持系统运行，边修边收集线索", labelEn: "Keep the system live and collect clues while repairing", response: "你多拿到一个结果，也多制造了两个需要解释的变量。", responseEn: "You gain one more result and create two more variables that need explaining.", delta: { stats: { evidence: 1 }, mental: -1, risk: 2 } },
      ],
    },
  ];

  if (roundIndex <= 0) return firstRounds[variant];
  const first = firstRounds[variant];
  const previous = first.options.find((option) => option.id === decisionIds[0]) ?? first.options[0];
  const secondRounds: EventDecisionRound[] = [
    {
      id: "room-close", speaker: "负责记录的同门", speakerEn: "Labmate Taking Notes",
      narrative: `${previous.response} 五分钟后，${eventZh}仍未结束，但大家已经围绕“${actionZh}”列出三项动作。负责记录的人抬头问：哪一项要进入正式事故记录？`,
      narrativeEn: `${previous.responseEn} Five minutes later, ${eventEn} is not over, but the team has three actions around “${actionEn}.” The note-taker asks which one belongs in the official incident record.`,
      prompt: "最后一步，你留下什么样的记录？", promptEn: "For the final step, what kind of record do you leave?",
      options: [
        { id: "room-close-ledger", label: "记下负责人、时间点和失败条件", labelEn: "Record owner, timestamp, and failure condition", response: "这份记录不漂亮，但明天任何人都能从这里接手。", responseEn: "The record is not elegant, but anyone can resume from it tomorrow.", delta: { mental: -1, stats: { clarity: 1, reproducibility: 1 }, risk: -1 } },
        { id: "room-close-motion", label: "只保留行动清单，先抢回时间", labelEn: "Keep only the action list and recover time", response: "行动开始得更快，原因与责任则留给未来的会议。", responseEn: "Action begins faster; causes and ownership are deferred to a future meeting.", delta: { days: 1, mental: 1, risk: 2 } },
      ],
    },
    {
      id: "thread-close", speaker: "合作者", speakerEn: "Coauthor",
      narrative: `${previous.response} 当${eventZh}的讨论终于收束到“${actionZh}”，合作者发来一句：“我同意，但我们是不是应该把证据也放进去？”附件图标在发送按钮旁边闪着。`,
      narrativeEn: `${previous.responseEn} As discussion of ${eventEn} finally converges on “${actionEn},” a coauthor writes: “Agreed, but should the evidence travel with it?” The attachment icon waits beside Send.`,
      prompt: "你如何结束这条线程？", promptEn: "How do you close the thread?",
      options: [
        { id: "thread-close-attach", label: "附上日志片段与一段限制说明", labelEn: "Attach the log excerpt and a limitations note", response: "邮件长了一屏，但再也没人问“这个数字从哪来”。", responseEn: "The message grows by a screen, but nobody asks where the number came from.", delta: { mental: -1, stats: { evidence: 1, reproducibility: 1 }, risk: -1 } },
        { id: "thread-close-summary", label: "只发三行结论，结束邮件风暴", labelEn: "Send three lines of conclusions and end the storm", response: "收件箱恢复安静；被删掉的上下文则进入下一轮审稿。", responseEn: "The inbox quiets; the omitted context moves into the next review round.", delta: { mental: 2, stats: { clarity: 1 }, risk: 2 } },
      ],
    },
    {
      id: "advisor-close", speaker: "你", speakerEn: "You",
      narrative: `${previous.response} 围绕${eventZh}的讨论走到最后，导师把“${actionZh}”圈起来：“那就说清楚，失败时我们报告什么，而不是藏什么。”`,
      narrativeEn: `${previous.responseEn} As the discussion of ${eventEn} closes, your advisor circles “${actionEn}”: “Then state what we report when it fails—not what we hide.”`,
      prompt: "你把哪句话写进研究记录？", promptEn: "Which sentence enters the research record?",
      options: [
        { id: "advisor-close-limit", label: "写下最坏结果以及它会否定什么", labelEn: "Write the worst result and what it would refute", response: "失败第一次从威胁变成了可以解释的研究结果。", responseEn: "Failure changes from a threat into an interpretable research result.", delta: { stats: { evidence: 1, reproducibility: 1 }, risk: -2 } },
        { id: "advisor-close-win", label: "先写预期成功版本，争取一点士气", labelEn: "Draft the success version first to protect morale", response: "段落读起来很鼓舞人心，前提部分却安静地缩小了字号。", responseEn: "The paragraph is inspiring; the assumptions quietly shrink their font size.", delta: { mental: 2, stats: { novelty: 1 }, risk: 3 } },
      ],
    },
    {
      id: "evidence-close", speaker: "系统终端", speakerEn: "System Terminal",
      narrative: `${previous.response} ${eventZh}留下的最后一行日志停在光标上方。围绕“${actionZh}”的处理已经可以继续，但系统问你是否保存本次状态快照。`,
      narrativeEn: `${previous.responseEn} The final line left by ${eventEn} sits above the cursor. Work on “${actionEn}” can continue, but the system asks whether to preserve a snapshot.`,
      prompt: "你按下哪个键？", promptEn: "Which key do you press?",
      options: [
        { id: "evidence-close-snapshot", label: "保存快照并写一行复现命令", labelEn: "Save a snapshot and one reproduction command", response: "硬盘少了一点空间，未来少了一场侦探小说。", responseEn: "The disk loses some space; the future loses a detective story.", delta: { gpu: -1, stats: { reproducibility: 2 }, risk: -1 } },
        { id: "evidence-close-skip", label: "跳过快照，让队列立刻继续", labelEn: "Skip the snapshot and resume the queue now", response: "进度条重新移动；今晚发生过什么，只剩几个人的记忆。", responseEn: "The progress bar moves again; what happened tonight survives in a few memories.", delta: { days: 1, stats: { evidence: 1 }, risk: 3 } },
      ],
    },
  ];
  return secondRounds[variant];
}

function mergeEventDeltas(...deltas: Delta[]): Delta {
  const merged: Delta = { stats: {} };
  for (const delta of deltas) {
    for (const metric of METRICS) {
      const value = delta.stats?.[metric] ?? 0;
      if (value) merged.stats![metric] = (merged.stats![metric] ?? 0) + value;
    }
    for (const key of ["gpu", "funding", "mental", "risk", "days", "focus"] as const) {
      const value = delta[key] ?? 0;
      if (value) merged[key] = (merged[key] ?? 0) + value;
    }
  }
  return merged;
}

export function getEventDialogue(choice: EventChoice, event?: EventDef, decisionIds: string[] = []) {
  const source = choice.story && choice.story.length > 0 ? choice.story.slice(0, 3) : [];
  const labelEn = event ? eventChoiceText(event, choice, "label", "en") : choice.labelEn ?? choice.label;
  const titleZh = event ? eventTitle(event, "zh") : "这场事件";
  const titleEn = event ? eventTitle(event, "en") : "the incident";
  const firstRound = event ? getEventDecisionRound(event, choice, 0, []) : null;
  const secondRound = event ? getEventDecisionRound(event, choice, 1, decisionIds) : null;
  const firstDecision = firstRound?.options.find((option) => option.id === decisionIds[0]);
  const secondDecision = secondRound?.options.find((option) => option.id === decisionIds[1]);
  const fallback = [
    {
      speaker: "你", speakerEn: "You",
      text: `你把“${choice.label}”变成第一项行动。没有人欢呼；有人关掉了无关窗口，有人把剩余时间写在白板右上角。${firstDecision?.response ?? "现场终于从争论进入执行。"}`,
      textEn: `You turn “${labelEn}” into the first action. Nobody cheers. Someone closes unrelated windows; someone writes the remaining time in the corner. ${firstDecision?.responseEn ?? "The room finally moves from argument to execution."}`,
      aside: `${titleZh}仍在继续，结果还没有资格被总结。`, asideEn: `${titleEn} is still unfolding; the outcome has not earned a summary yet.`,
    },
    {
      speaker: "事件现场", speakerEn: "At the Scene",
      text: `${secondDecision?.response ?? "第二个决定落下后，现场安静了一会儿。"} 时间过去了一小段，足够让一个假设露出裂缝，也足够让一项原本含糊的责任找到名字。`,
      textEn: `${secondDecision?.responseEn ?? "After the second decision, the scene goes quiet for a moment."} Enough time passes for one assumption to crack and one vague responsibility to acquire a name.`,
      aside: "最后的数字仍封在信封里，但故事已经留下可以追溯的痕迹。", asideEn: "The final numbers remain sealed, but the story now leaves an auditable trail.",
    },
    {
      speaker: "旁白", speakerEn: "Narrator",
      text: `${titleZh}没有像电影那样结束。没有掌声，也没有突然恢复的服务器；只有一份新记录、几条被删掉的草率结论，以及终于可以继续推进的论文。`,
      textEn: `${titleEn} does not end like a film. There is no applause and no magically restored server—only a new record, several deleted hasty claims, and a paper that can finally move again.`,
      aside: "现在可以拆开结果信封。", asideEn: "The outcome envelope can now be opened.",
    },
  ];
  if (source.length === 0) return fallback;
  return source.map((beat, index) => ({
    ...beat,
    text: `${beat.text} ${fallback[index]?.text ?? ""}`,
    textEn: `${beat.textEn ?? beat.text} ${fallback[index]?.textEn ?? ""}`,
    aside: beat.aside ?? fallback[index]?.aside,
    asideEn: beat.asideEn ?? fallback[index]?.asideEn,
  }));
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
    { ...state, eventFlow: { eventId, choiceId, beatIndex: 0, status: "decision", decisionIndex: 0, decisionIds: [], before } },
    `${event.title}：你选择了「${choice.label}」，结果尚未揭晓。`,
    `${eventTitle(event, "en")}: you choose “${eventChoiceText(event, choice, "label", "en")}.” Outcome pending.`,
    "neutral",
  );
}

function selectEventDecision(state: GameState, optionId: string): GameState {
  const flow = state.eventFlow;
  if (state.phase !== "event" || !flow || flow.status !== "decision" || !flow.choiceId || state.ending) return state;
  const event = EVENT_BY_ID[flow.eventId];
  const choice = event?.choices.find((item) => item.id === flow.choiceId);
  if (!event || !choice) return state;
  const decisionIndex = Math.min(1, Math.max(0, flow.decisionIndex ?? 0));
  const previousIds = flow.decisionIds ?? [];
  const round = getEventDecisionRound(event, choice, decisionIndex, previousIds);
  const option = round.options.find((item) => item.id === optionId);
  if (!option || previousIds.length !== decisionIndex) return state;
  const decisionIds = [...previousIds, option.id];
  return addLog(
    {
      ...state,
      eventFlow: decisionIndex === 0
        ? { ...flow, decisionIndex: 1, decisionIds }
        : { ...flow, status: "dialogue", decisionIndex: 2, decisionIds, beatIndex: 0 },
    },
    `${event.title}：现场决定「${option.label}」。结算仍未揭晓。`,
    `${eventTitle(event, "en")}: the scene chooses “${option.labelEn}.” Resolution remains sealed.`,
    "neutral",
  );
}

function advanceEvent(state: GameState): GameState {
  const flow = state.eventFlow;
  if (state.phase !== "event" || !flow || flow.status !== "dialogue" || !flow.choiceId || state.ending) return state;
  const event = EVENT_BY_ID[flow.eventId];
  const choice = event?.choices.find((item) => item.id === flow.choiceId);
  if (!event || !choice) return state;
  const decisionIds = flow.decisionIds ?? [];
  const dialogue = getEventDialogue(choice, event, decisionIds);
  if (flow.beatIndex < dialogue.length - 1) {
    return { ...state, eventFlow: { ...flow, beatIndex: flow.beatIndex + 1 } };
  }
  const decisionDeltas = [0, 1].map((index) => {
    const round = getEventDecisionRound(event, choice, index, decisionIds);
    return round.options.find((option) => option.id === decisionIds[index])?.delta ?? {};
  });
  let delta = mergeEventDeltas(choice.delta, ...decisionDeltas);
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
  const chosenRounds = [0, 1].map((index) => {
    const round = getEventDecisionRound(event, choice, index, decisionIds);
    return round.options.find((option) => option.id === decisionIds[index]);
  }).filter((option): option is NonNullable<typeof option> => Boolean(option));
  const resultZh = `${choice.result}${chosenRounds.length ? ` 你在现场先后选择了：${chosenRounds.map((option) => option.label).join("；")}。` : ""}`;
  const resultEn = `${eventChoiceText(event, choice, "result", "en")}${chosenRounds.length ? ` Your scene decisions were: ${chosenRounds.map((option) => option.labelEn).join("; ")}.` : ""}`;
  next = addLog(next, `${event.title}：${resultZh}`, `${eventTitle(event, "en")}: ${resultEn}`, "neutral");
  next = {
    ...next,
    eventFlow: { ...flow, beatIndex: dialogue.length - 1, status: "reveal" },
    runStats: { ...next.runStats, eventsCompleted: next.runStats.eventsCompleted + 1 },
  };
  return addTimeline(next, {
    kind: "event",
    title: `${event.title} · 结案`,
    titleEn: `${eventTitle(event, "en")} · resolved`,
    detail: resultZh,
    detailEn: resultEn,
    tone: (delta.risk ?? 0) >= 10 || (delta.mental ?? 0) <= -4 ? "danger" : (delta.risk ?? 0) < 0 || (delta.mental ?? 0) > 0 ? "good" : "neutral",
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
    case "CHOOSE_EVENT_DECISION": return selectEventDecision(state, action.optionId);
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
