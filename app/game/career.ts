import { CARD_BY_ID, COMMENT_BY_ID, EVENT_BY_ID, RELIC_BY_ID, ROLE_BY_ID } from "./data";
import type { EndingId, GameState, TimelineEntry } from "./types";

const CAREER_KEY = "reviewer2:career:v1";
const MAX_RUNS = 30;

export interface CareerRun {
  id: string;
  finishedAt: number;
  roleId: string;
  endingId: EndingId;
  endingTitle: string;
  endingTitleEn: string;
  stamp: string;
  score: number;
  seed: number;
  difficultyId: GameState["campaign"]["difficultyId"];
  lengthId: GameState["campaign"]["lengthId"];
  ironman: boolean;
  turn: number;
  resolved: number;
  target: number;
  daysRemaining: number;
  finalRisk: number;
  finalMental: number;
  cardsPlayed: number;
  dangerousPlayed: number;
  perfectReplies: number;
  eventsCompleted: number;
  strangestEvent: string;
  seenEvents: string[];
  seenComments: string[];
  deck: string[];
  relics: string[];
  timeline: TimelineEntry[];
}

export interface CareerDiscoveries {
  roles: string[];
  cards: string[];
  events: string[];
  comments: string[];
  routes: string[];
  endings: EndingId[];
  relics: string[];
}

export interface CareerProfile {
  version: 1;
  runs: CareerRun[];
  discoveries: CareerDiscoveries;
}

export const EMPTY_CAREER: CareerProfile = {
  version: 1,
  runs: [],
  discoveries: { roles: [], cards: [], events: [], comments: [], routes: [], endings: [], relics: [] },
};

function available() {
  try {
    return typeof window !== "undefined" && Boolean(window.localStorage);
  } catch {
    return false;
  }
}

function unique(values: string[]) {
  return [...new Set(values)].sort();
}

function validRun(value: unknown): value is CareerRun {
  if (!value || typeof value !== "object") return false;
  const run = value as Partial<CareerRun>;
  return typeof run.id === "string" && Number.isFinite(run.finishedAt) && typeof run.roleId === "string" && Boolean(ROLE_BY_ID[run.roleId]) &&
    typeof run.endingId === "string" && Number.isFinite(run.score) && Number.isSafeInteger(run.seed) && Array.isArray(run.timeline) &&
    Array.isArray(run.seenEvents) && run.seenEvents.every((id) => Boolean(EVENT_BY_ID[id])) &&
    Array.isArray(run.seenComments) && run.seenComments.every((id) => Boolean(COMMENT_BY_ID[id])) &&
    Array.isArray(run.deck) && run.deck.every((id) => Boolean(CARD_BY_ID[id])) &&
    Array.isArray(run.relics) && run.relics.every((id) => Boolean(RELIC_BY_ID[id]));
}

export function readCareer(): CareerProfile {
  if (!available()) return EMPTY_CAREER;
  try {
    const raw = window.localStorage.getItem(CAREER_KEY);
    if (!raw) return EMPTY_CAREER;
    const parsed = JSON.parse(raw) as Partial<CareerProfile>;
    if (parsed.version !== 1 || !Array.isArray(parsed.runs) || !parsed.discoveries) return EMPTY_CAREER;
    const discoveries = parsed.discoveries;
    return {
      version: 1,
      runs: parsed.runs.filter(validRun).slice(0, MAX_RUNS),
      discoveries: {
        roles: unique((discoveries.roles ?? []).filter((id) => Boolean(ROLE_BY_ID[id]))),
        cards: unique((discoveries.cards ?? []).filter((id) => Boolean(CARD_BY_ID[id]))),
        events: unique((discoveries.events ?? []).filter((id) => Boolean(EVENT_BY_ID[id]))),
        comments: unique((discoveries.comments ?? []).filter((id) => Boolean(COMMENT_BY_ID[id]))),
        routes: unique(discoveries.routes ?? []),
        endings: unique(discoveries.endings ?? []) as EndingId[],
        relics: unique((discoveries.relics ?? []).filter((id) => Boolean(RELIC_BY_ID[id]))),
      },
    };
  } catch {
    return EMPTY_CAREER;
  }
}

function writeCareer(profile: CareerProfile) {
  if (!available()) return profile;
  try {
    window.localStorage.setItem(CAREER_KEY, JSON.stringify(profile));
  } catch {
    // The archive is optional when browser storage is unavailable or full.
  }
  return profile;
}

function discoveriesFrom(state: GameState, current: CareerDiscoveries): CareerDiscoveries {
  return {
    roles: unique([...current.roles, state.roleId]),
    cards: unique([...current.cards, ...state.masterDeck, ...state.playedThisTurn]),
    events: unique([...current.events, ...state.seenEvents]),
    comments: unique([...current.comments, ...state.seenComments, state.issue.commentId]),
    routes: unique([...current.routes, `${state.issue.commentId}:${state.issue.routeId}`]),
    endings: unique([...current.endings, ...(state.ending ? [state.ending.id] : [])]) as EndingId[],
    relics: unique([...current.relics, ...state.relics]),
  };
}

export function recordCareerDiscovery(state: GameState): CareerProfile {
  const current = readCareer();
  const next = { ...current, discoveries: discoveriesFrom(state, current.discoveries) };
  if (JSON.stringify(next.discoveries) === JSON.stringify(current.discoveries)) return current;
  return writeCareer(next);
}

export function recordCompletedCareerRun(state: GameState): CareerProfile {
  if (!state.ending) return recordCareerDiscovery(state);
  const current = readCareer();
  const id = [state.seed, state.roleId, state.campaign.difficultyId, state.campaign.lengthId, state.ending.id, state.turn].join(":");
  const run: CareerRun = {
    id,
    finishedAt: Date.now(),
    roleId: state.roleId,
    endingId: state.ending.id,
    endingTitle: state.ending.title,
    endingTitleEn: state.ending.titleEn ?? state.ending.title,
    stamp: state.ending.stamp,
    score: state.ending.score,
    seed: state.seed,
    difficultyId: state.campaign.difficultyId,
    lengthId: state.campaign.lengthId,
    ironman: state.campaign.ironman,
    turn: state.turn,
    resolved: state.resolved,
    target: state.target,
    daysRemaining: state.resources.days,
    finalRisk: state.resources.risk,
    finalMental: state.resources.mental,
    cardsPlayed: state.runStats.cardsPlayed,
    dangerousPlayed: state.runStats.dangerousPlayed,
    perfectReplies: state.runStats.perfectReplies,
    eventsCompleted: state.runStats.eventsCompleted,
    strangestEvent: state.runStats.strangestEvent,
    seenEvents: unique(state.seenEvents),
    seenComments: unique(state.seenComments),
    deck: unique(state.masterDeck),
    relics: unique(state.relics),
    timeline: state.timeline.slice(-80),
  };
  const runs = [run, ...current.runs.filter((item) => item.id !== id)].slice(0, MAX_RUNS);
  return writeCareer({ version: 1, runs, discoveries: discoveriesFrom(state, current.discoveries) });
}

export function clearCareer() {
  if (!available()) return;
  try {
    window.localStorage.removeItem(CAREER_KEY);
  } catch {
    // Optional browser storage.
  }
}

export function careerExport(profile = readCareer()) {
  return JSON.stringify(profile, null, 2);
}
