import { CAPABILITIES, CARD_BY_ID, COMMENT_BY_ID, EVENT_BY_ID, RELIC_BY_ID, ROLE_BY_ID } from "./data";
import type { EndingId, GameState } from "./types";

const SAVE_KEY = "reviewer2:save:v3";
const BEST_KEY = "reviewer2:highscore:v3";

export interface BestRun {
  score: number;
  roleId: string;
  ending: EndingId;
  seed: number;
  resolved: number;
}

function available() {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
}

export function saveRun(state: GameState) {
  if (!available() || state.phase === "ended") return;
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    // Storage is optional. The run continues when privacy settings block it.
  }
}

export function clearRun() {
  if (!available()) return;
  try {
    window.localStorage.removeItem(SAVE_KEY);
  } catch {
    // Storage is optional.
  }
}

export function loadRun(): GameState | null {
  if (!available()) return null;
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as Partial<GameState>;
    if (
      value.engineVersion !== 3 ||
      (value.phase !== "playing" && value.phase !== "event" && value.phase !== "reward") ||
      typeof value.roleId !== "string" ||
      !ROLE_BY_ID[value.roleId] ||
      !value.issue ||
      typeof value.issue.commentId !== "string" ||
      !COMMENT_BY_ID[value.issue.commentId] ||
      !Array.isArray(value.hand) ||
      !Array.isArray(value.deck) ||
      !Array.isArray(value.discard) ||
      !Array.isArray(value.exhausted) ||
      !Array.isArray(value.masterDeck) ||
      !value.cardLevels ||
      !Array.isArray(value.relics) ||
      !value.conditions ||
      typeof value.researchedThisTurn !== "boolean" ||
      !value.issue.routeId ||
      !value.issue.capabilityProgress ||
      !Array.isArray(value.issue.extraRequirements) ||
      !Array.isArray(value.rewardOffers) ||
      !value.resources ||
      !value.stats ||
      !Number.isSafeInteger(value.seed) ||
      !Number.isSafeInteger(value.turn)
    ) {
      return null;
    }
    const cardIds = [
      ...value.deck,
      ...value.discard,
      ...value.exhausted,
      ...value.masterDeck,
      ...value.hand.map((card) => card.cardId),
    ];
    const resourceKeys = ["gpu", "funding", "mental", "risk", "days", "focus"] as const;
    const statKeys = ["novelty", "evidence", "clarity", "reproducibility"] as const;
    const conditionKeys = [
      "caffeine", "insight", "technicalDebt", "reviewerFavor", "pageDebt",
      "infrastructureDown", "queueDelay", "advisorPressure", "coauthorTrust", "auditTrail",
    ] as const;
    const route = COMMENT_BY_ID[value.issue.commentId].routes?.find((item) => item.id === value.issue?.routeId);
    const zonedCards = [
      ...value.deck,
      ...value.discard,
      ...value.exhausted,
      ...value.hand.map((card) => card.cardId),
    ].sort();
    const masterCards = [...value.masterDeck].sort();
    const maxInstanceId = value.hand.reduce((max, card) => Math.max(max, card.instanceId), 0);
    const nextInstanceId = typeof value.nextInstanceId === "number" ? value.nextInstanceId : -1;
    if (
      cardIds.some((cardId) => typeof cardId !== "string" || !CARD_BY_ID[cardId]) ||
      value.relics.some((relicId) => typeof relicId !== "string" || !RELIC_BY_ID[relicId]) ||
      new Set(value.relics).size !== value.relics.length ||
      new Set(value.hand.map((card) => card.instanceId)).size !== value.hand.length ||
      value.hand.some((card) => !Number.isSafeInteger(card.instanceId) || card.instanceId <= 0) ||
      !Number.isSafeInteger(nextInstanceId) || nextInstanceId <= maxInstanceId ||
      !route ||
      !Number.isSafeInteger(value.issue.progress) || value.issue.progress < 0 ||
      !Number.isSafeInteger(value.issue.difficulty) || value.issue.difficulty < 1 ||
      !Number.isSafeInteger(value.issue.escalations) || value.issue.escalations < 0 ||
      !Number.isSafeInteger(value.issue.followUps) || value.issue.followUps < 0 ||
      Object.entries(value.issue.capabilityProgress).some(([key, entry]) => !CAPABILITIES.includes(key as (typeof CAPABILITIES)[number]) || !Number.isFinite(entry) || (entry ?? -1) < 0) ||
      value.issue.extraRequirements.some((item) => !item || !CAPABILITIES.includes(item.capability) || !Number.isSafeInteger(item.target) || item.target < 1 || !item.label || !item.labelEn) ||
      (value.phase === "event" && (!value.activeEventId || !EVENT_BY_ID[value.activeEventId])) ||
      (value.phase !== "event" && value.activeEventId !== null) ||
      (value.phase === "reward" && value.rewardOffers.length === 0) ||
      (value.phase !== "reward" && value.rewardOffers.length > 0) ||
      (value.phase === "reward" && !value.rewardReason) ||
      resourceKeys.some((key) => !Number.isSafeInteger(value.resources?.[key]) || (value.resources?.[key] ?? -1) < 0) ||
      statKeys.some((key) => !Number.isSafeInteger(value.stats?.[key]) || (value.stats?.[key] ?? -1) < 0 || (value.stats?.[key] ?? 16) > 15) ||
      conditionKeys.some((key) => !Number.isSafeInteger(value.conditions?.[key]) || (value.conditions?.[key] ?? -1) < 0 || (value.conditions?.[key] ?? 6) > 5) ||
      zonedCards.length !== masterCards.length || zonedCards.some((cardId, index) => cardId !== masterCards[index]) ||
      value.rewardOffers.some((offer) =>
        !offer || typeof offer.id !== "string" ||
        (offer.kind === "card" && !CARD_BY_ID[offer.contentId]) ||
        (offer.kind === "upgrade" && !CARD_BY_ID[offer.contentId]) ||
        (offer.kind === "relic" && !RELIC_BY_ID[offer.contentId]) ||
        !["card", "upgrade", "relic"].includes(offer.kind)
      )
    ) {
      return null;
    }
    return value as GameState;
  } catch {
    return null;
  }
}

function validBest(value: unknown): value is BestRun {
  if (!value || typeof value !== "object") return false;
  const run = value as Partial<BestRun>;
  return (
    Number.isSafeInteger(run.score) &&
    (run.score ?? -1) >= 0 &&
    (run.score ?? 0) < 1_000_000 &&
    typeof run.roleId === "string" &&
    Boolean(ROLE_BY_ID[run.roleId]) &&
    typeof run.ending === "string" &&
    [
      "accepted",
      "open_science",
      "coauthor_ending",
      "major_revision",
      "rejected",
      "burnout",
      "retracted",
    ].includes(run.ending) &&
    Number.isSafeInteger(run.seed) &&
    Number.isSafeInteger(run.resolved)
  );
}

export function readBest(): BestRun | null {
  if (!available()) return null;
  try {
    const raw = window.localStorage.getItem(BEST_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as unknown;
    return validBest(value) ? value : null;
  } catch {
    return null;
  }
}

export function commitBest(state: GameState): BestRun | null {
  if (!available() || !state.ending) return null;
  const candidate: BestRun = {
    score: state.ending.score,
    roleId: state.roleId,
    ending: state.ending.id,
    seed: state.seed,
    resolved: state.resolved,
  };
  try {
    const current = readBest();
    const best = !current || candidate.score > current.score ? candidate : current;
    window.localStorage.setItem(BEST_KEY, JSON.stringify(best));
    return best;
  } catch {
    return candidate;
  }
}
