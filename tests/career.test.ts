import assert from "node:assert/strict";
import test from "node:test";
import { createGame } from "../app/game/engine";
import { clearCareer, readCareer, recordCareerDiscovery, recordCompletedCareerRun } from "../app/game/career";
import { DEFAULT_PREFERENCES, readPreferences, savePreferences } from "../app/game/preferences";
import type { GameState } from "../app/game/types";

class MemoryStorage {
  private readonly values = new Map<string, string>();
  getItem(key: string) { return this.values.get(key) ?? null; }
  setItem(key: string, value: string) { this.values.set(key, value); }
  removeItem(key: string) { this.values.delete(key); }
}

function withStorage() {
  Object.defineProperty(globalThis, "window", { configurable: true, value: { localStorage: new MemoryStorage() } });
}

function removeWindow() {
  Reflect.deleteProperty(globalThis, "window");
}

test("career discoveries persist without duplicating routes or collections", () => {
  withStorage();
  try {
    const state = createGame("method", 7001);
    const first = recordCareerDiscovery(state);
    const second = recordCareerDiscovery(state);
    assert.deepEqual(second, first);
    assert.deepEqual(first.discoveries.roles, ["method"]);
    assert.ok(first.discoveries.cards.length >= state.masterDeck.length);
    assert.ok(first.discoveries.comments.includes(state.issue.commentId));
    assert.ok(first.discoveries.routes.includes(`${state.issue.commentId}:${state.issue.routeId}`));
  } finally {
    removeWindow();
  }
});

test("completed runs enter history once and unlock their decision letter", () => {
  withStorage();
  try {
    const active = createGame("clinical", 7002);
    const finished: GameState = {
      ...active,
      phase: "ended",
      rewardOffers: [],
      rewardReason: null,
      ending: { id: "accepted", stamp: "ACCEPT", title: "接收", titleEn: "Accepted", copy: "完成。", copyEn: "Done.", score: 4321 },
    };
    recordCompletedCareerRun(finished);
    recordCompletedCareerRun(finished);
    const profile = readCareer();
    assert.equal(profile.runs.length, 1);
    assert.equal(profile.runs[0].score, 4321);
    assert.ok(profile.discoveries.endings.includes("accepted"));
    clearCareer();
    assert.equal(readCareer().runs.length, 0);
  } finally {
    removeWindow();
  }
});

test("laboratory preferences round-trip and fill missing defaults", () => {
  withStorage();
  try {
    savePreferences({ ...DEFAULT_PREFERENCES, largeText: true, ambientGlow: false });
    assert.equal(readPreferences().largeText, true);
    assert.equal(readPreferences().ambientGlow, false);
    assert.equal(readPreferences().confirmQuestionable, true);
  } finally {
    removeWindow();
  }
});
