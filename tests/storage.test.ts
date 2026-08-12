import assert from "node:assert/strict";
import test from "node:test";
import { createGame } from "../app/game/engine";
import {
  deleteManualRun,
  listManualRuns,
  loadManualRun,
  loadRun,
  normalizeStoredRun,
  saveManualRun,
} from "../app/game/storage";

class MemoryStorage {
  private readonly values = new Map<string, string>();

  get length() {
    return this.values.size;
  }

  clear() {
    this.values.clear();
  }

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  key(index: number) {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }
}

function withStorage() {
  const localStorage = new MemoryStorage();
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage },
  });
  return localStorage;
}

function removeWindow() {
  Reflect.deleteProperty(globalThis, "window");
}

test("three manual save slots round-trip independently and list stable metadata", () => {
  const storage = withStorage();
  try {
    const first = createGame("method", 101);
    const third = createGame("clinical", 303);
    const expectedFirst = normalizeStoredRun(first);
    const expectedThird = normalizeStoredRun(third);
    assert.ok(expectedFirst);
    assert.ok(expectedThird);
    storage.setItem("reviewer2:save:v3", JSON.stringify(first));
    storage.setItem("reviewer2:highscore:v3", "existing-best-data");

    const thirdMetadata = saveManualRun(3, third);
    const firstMetadata = saveManualRun(1, first);
    assert.ok(firstMetadata);
    assert.ok(thirdMetadata);
    assert.equal(firstMetadata.slot, 1);
    assert.equal(firstMetadata.roleId, "method");
    assert.equal(firstMetadata.daysRemaining, first.resources.days);
    assert.equal(loadManualRun(2), null);
    assert.deepEqual(loadManualRun(1), JSON.parse(JSON.stringify(expectedFirst)));
    assert.deepEqual(loadManualRun(3), JSON.parse(JSON.stringify(expectedThird)));
    assert.deepEqual(listManualRuns().map((entry) => entry.slot), [1, 3]);

    assert.equal(deleteManualRun(1), true);
    assert.equal(deleteManualRun(1), false);
    assert.equal(loadManualRun(1), null);
    assert.deepEqual(loadRun(), JSON.parse(JSON.stringify(expectedFirst)));
    assert.equal(storage.getItem("reviewer2:highscore:v3"), "existing-best-data");
  } finally {
    removeWindow();
  }
});

test("corrupt manual saves are ignored but never deleted implicitly", () => {
  const storage = withStorage();
  try {
    const corrupt = "{not-json";
    storage.setItem("reviewer2:manual-save:v1:2", corrupt);
    assert.equal(loadManualRun(2), null);
    assert.deepEqual(listManualRuns(), []);
    assert.equal(storage.getItem("reviewer2:manual-save:v1:2"), corrupt);
  } finally {
    removeWindow();
  }
});

test("a prerelease direct-state slot remains readable", () => {
  const storage = withStorage();
  try {
    const state = createGame("small-data", 404);
    const expected = normalizeStoredRun(state);
    assert.ok(expected);
    storage.setItem("reviewer2:manual-save:v1:2", JSON.stringify(state));
    assert.deepEqual(loadManualRun(2), JSON.parse(JSON.stringify(expected)));
    assert.equal(listManualRuns()[0]?.savedAt, 0);
  } finally {
    removeWindow();
  }
});

test("version 3 automatic saves migrate in memory without overwriting the original", () => {
  const storage = withStorage();
  try {
    const current = createGame("method", 606) as unknown as Record<string, unknown>;
    const legacy: Record<string, unknown> = { ...current, engineVersion: 3 };
    delete legacy.campaign;
    delete legacy.eventFlow;
    delete legacy.timeline;
    delete legacy.nextTimelineId;
    legacy.runStats = { ...(legacy.runStats as Record<string, unknown>) };
    delete (legacy.runStats as Record<string, unknown>).eventsCompleted;
    const raw = JSON.stringify(legacy);
    storage.setItem("reviewer2:save:v3", raw);

    const loaded = loadRun();
    assert.ok(loaded);
    assert.equal(loaded.engineVersion, 4);
    assert.equal(loaded.campaign.difficultyId, "major");
    assert.deepEqual(loaded.timeline, []);
    assert.equal(loaded.runStats.eventsCompleted, loaded.seenEvents.length);
    assert.equal(storage.getItem("reviewer2:save:v3"), raw);
  } finally {
    removeWindow();
  }
});

test("storage APIs safely degrade when localStorage is unavailable", () => {
  removeWindow();
  const state = createGame("method", 505);
  assert.equal(saveManualRun(1, state), null);
  assert.equal(loadManualRun(1), null);
  assert.equal(deleteManualRun(1), false);
  assert.deepEqual(listManualRuns(), []);
  assert.equal(loadRun(), null);
});
