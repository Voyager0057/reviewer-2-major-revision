import { CAPABILITIES, CARD_BY_ID, COMMENT_BY_ID, EVENT_BY_ID, RELIC_BY_ID, ROLE_BY_ID } from "./data";
import { resolveCampaignConfig } from "./settings";
import type { EndingId, GameState } from "./types";

const SAVE_KEY = "reviewer2:save:v3";
const BEST_KEY = "reviewer2:highscore:v3";
const MANUAL_SAVE_PREFIX = "reviewer2:manual-save:v1:";

export const MANUAL_SAVE_SLOTS = [1, 2, 3] as const;
export type ManualSaveSlot = (typeof MANUAL_SAVE_SLOTS)[number];

export interface ManualSaveMetadata {
  slot: ManualSaveSlot;
  savedAt: number;
  roleId: string;
  turn: number;
  resolved: number;
  target: number;
  daysRemaining: number;
  seed: number;
  phase: GameState["phase"];
  engineVersion: number;
  difficultyId: GameState["campaign"]["difficultyId"];
  lengthId: GameState["campaign"]["lengthId"];
  ironman: boolean;
}

interface ManualSaveEnvelope {
  formatVersion: 1;
  savedAt: number;
  state: GameState;
}

type StoredGameState = Omit<Partial<GameState>, "engineVersion" | "runStats"> & {
  engineVersion?: number;
  runStats?: Partial<GameState["runStats"]>;
};

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

function isManualSaveSlot(slot: number): slot is ManualSaveSlot {
  return MANUAL_SAVE_SLOTS.includes(slot as ManualSaveSlot);
}

function manualSaveKey(slot: ManualSaveSlot) {
  return `${MANUAL_SAVE_PREFIX}${slot}`;
}

/**
 * Keep all persisted-state validation in one place so automatic and manual
 * saves cannot drift apart. Version 3 remains readable and is upgraded in
 * memory with standard-campaign defaults; the stored v3 snapshot is not
 * rewritten until the player explicitly saves again.
 */
export function normalizeStoredRun(input: unknown): GameState | null {
  if (!input || typeof input !== "object") return null;
  const stored = input as StoredGameState;
  const value: StoredGameState = stored.engineVersion === 3
    ? {
        ...stored,
        engineVersion: 4,
        campaign: resolveCampaignConfig(),
        eventFlow: stored.phase === "event" && typeof stored.activeEventId === "string"
          ? { eventId: stored.activeEventId, choiceId: null, beatIndex: 0, status: "choice" }
          : null,
        runStats: {
          ...stored.runStats,
          eventsCompleted: Array.isArray(stored.seenEvents)
            ? Math.max(0, stored.seenEvents.length - (stored.phase === "event" ? 1 : 0))
            : 0,
        },
        timeline: [],
        nextTimelineId: 1,
      }
    : stored;
  if (
    value.engineVersion !== 4 ||
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
    !value.campaign ||
    !value.runStats ||
    !Array.isArray(value.timeline) ||
    !Number.isSafeInteger(value.nextTimelineId) ||
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
    (value.phase === "event" && (
      !value.eventFlow ||
      value.eventFlow.eventId !== value.activeEventId ||
      !["choice", "decision", "dialogue", "reveal"].includes(value.eventFlow.status) ||
      !Number.isSafeInteger(value.eventFlow.beatIndex) ||
      value.eventFlow.beatIndex < 0 ||
      (value.eventFlow.status === "decision" && (
        !Number.isSafeInteger(value.eventFlow.decisionIndex) ||
        (value.eventFlow.decisionIndex ?? -1) < 0 ||
        (value.eventFlow.decisionIndex ?? 3) > 1 ||
        !Array.isArray(value.eventFlow.decisionIds) ||
        value.eventFlow.decisionIds.length !== value.eventFlow.decisionIndex ||
        value.eventFlow.decisionIds.some((entry) => typeof entry !== "string")
      ))
    )) ||
    (value.phase !== "event" && value.eventFlow !== null) ||
    (value.phase === "reward" && value.rewardOffers.length === 0) ||
    (value.phase !== "reward" && value.rewardOffers.length > 0) ||
    (value.phase === "reward" && !value.rewardReason) ||
    resourceKeys.some((key) => !Number.isSafeInteger(value.resources?.[key]) || (value.resources?.[key] ?? -1) < 0) ||
    statKeys.some((key) => !Number.isSafeInteger(value.stats?.[key]) || (value.stats?.[key] ?? -1) < 0 || (value.stats?.[key] ?? 16) > 15) ||
    conditionKeys.some((key) => !Number.isSafeInteger(value.conditions?.[key]) || (value.conditions?.[key] ?? -1) < 0 || (value.conditions?.[key] ?? 6) > 5) ||
    typeof value.campaign.difficultyId !== "string" ||
    typeof value.campaign.lengthId !== "string" ||
    typeof value.campaign.ironman !== "boolean" ||
    !Number.isSafeInteger(value.campaign.totalDays) || value.campaign.totalDays < 1 ||
    !Number.isSafeInteger(value.campaign.baseTarget) || value.campaign.baseTarget < 1 ||
    !Number.isSafeInteger(value.campaign.eventEvery) || value.campaign.eventEvery < 1 ||
    !Number.isFinite(value.campaign.issueModifier) ||
    !Number.isFinite(value.campaign.pressureModifier) ||
    !Number.isFinite(value.campaign.resourceMultiplier) || value.campaign.resourceMultiplier <= 0 ||
    !Number.isFinite(value.campaign.scoreMultiplier) || value.campaign.scoreMultiplier <= 0 ||
    !Number.isSafeInteger(value.runStats.eventsCompleted) || (value.runStats.eventsCompleted ?? -1) < 0 ||
    value.timeline.some((entry) =>
      !entry || !Number.isSafeInteger(entry.id) || entry.id < 1 ||
      !Number.isSafeInteger(entry.turn) || entry.turn < 0 ||
      !Number.isSafeInteger(entry.daysRemaining) || entry.daysRemaining < 0 ||
      !["submission", "review", "revision", "event", "decision", "save"].includes(entry.kind) ||
      !["good", "bad", "neutral", "danger"].includes(entry.tone) ||
      typeof entry.title !== "string" || typeof entry.detail !== "string"
    ) ||
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
    return normalizeStoredRun(JSON.parse(raw));
  } catch {
    return null;
  }
}

function metadataFor(slot: ManualSaveSlot, state: GameState, savedAt: number): ManualSaveMetadata {
  return {
    slot,
    savedAt,
    roleId: state.roleId,
    turn: state.turn,
    resolved: state.resolved,
    target: state.target,
    daysRemaining: state.resources.days,
    seed: state.seed,
    phase: state.phase,
    engineVersion: state.engineVersion,
    difficultyId: state.campaign.difficultyId,
    lengthId: state.campaign.lengthId,
    ironman: state.campaign.ironman,
  };
}

function readManualEnvelope(slot: ManualSaveSlot): ManualSaveEnvelope | null {
  if (!available()) return null;
  try {
    const raw = window.localStorage.getItem(manualSaveKey(slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const candidate = parsed as Partial<ManualSaveEnvelope>;
    // Accept a direct GameState too, in case a prerelease build used that
    // representation. Reading it never rewrites or deletes the player's data.
    const state = normalizeStoredRun(candidate.formatVersion === 1 ? candidate.state : parsed);
    if (!state) return null;
    const savedAt = candidate.formatVersion === 1 && Number.isSafeInteger(candidate.savedAt) && (candidate.savedAt ?? -1) >= 0
      ? candidate.savedAt!
      : 0;
    return { formatVersion: 1, savedAt, state };
  } catch {
    return null;
  }
}

/** Save an active run into one of the three explicit manual slots. */
export function saveManualRun(slot: ManualSaveSlot, state: GameState): ManualSaveMetadata | null {
  if (!isManualSaveSlot(slot) || !available() || state.phase === "ended") return null;
  const normalized = normalizeStoredRun(state);
  if (!normalized || normalized.campaign.ironman) return null;
  const savedAt = Date.now();
  const envelope: ManualSaveEnvelope = { formatVersion: 1, savedAt, state: normalized };
  try {
    window.localStorage.setItem(manualSaveKey(slot), JSON.stringify(envelope));
    return metadataFor(slot, normalized, savedAt);
  } catch {
    return null;
  }
}

/** Load a manual slot without mutating or consuming it. */
export function loadManualRun(slot: ManualSaveSlot): GameState | null {
  if (!isManualSaveSlot(slot)) return null;
  return readManualEnvelope(slot)?.state ?? null;
}

/** Delete exactly one manual slot. Automatic saves and high scores are untouched. */
export function deleteManualRun(slot: ManualSaveSlot): boolean {
  if (!isManualSaveSlot(slot) || !available()) return false;
  try {
    const key = manualSaveKey(slot);
    const existed = window.localStorage.getItem(key) !== null;
    window.localStorage.removeItem(key);
    return existed;
  } catch {
    return false;
  }
}

/** Return metadata for occupied, valid slots in stable slot order. */
export function listManualRuns(): ManualSaveMetadata[] {
  return MANUAL_SAVE_SLOTS.flatMap((slot) => {
    const envelope = readManualEnvelope(slot);
    return envelope ? [metadataFor(slot, envelope.state, envelope.savedAt)] : [];
  });
}

// Short aliases keep menu code readable while the explicit names remain
// discoverable to callers that distinguish automatic and manual saves.
export const saveSlot = saveManualRun;
export const loadSlot = loadManualRun;
export const deleteSlot = deleteManualRun;
export const listSaveSlots = listManualRuns;

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
      "best_paper",
      "open_science",
      "replication_legend",
      "clean_review",
      "speedrun",
      "last_minute",
      "survivor_accept",
      "coauthor_ending",
      "minor_revision",
      "major_revision",
      "revise_resubmit",
      "desk_reject",
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
