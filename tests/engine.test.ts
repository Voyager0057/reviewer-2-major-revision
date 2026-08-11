import assert from "node:assert/strict";
import test from "node:test";
import {
  CARD_BY_ID,
  CARDS,
  COMMENTS,
  EVENTS,
  RELICS,
  ROLES,
} from "../app/game/data";
import {
  canChooseEvent,
  createGame,
  gameReducer,
  getActiveEvent,
  getCardPreview,
  getCampaignConfig,
  getIssueRequirements,
  nextRandom,
} from "../app/game/engine";
import {
  cardRules,
  commentNote,
  commentQuote,
  eventChoiceText,
  eventDescription,
  eventTitle,
  roleText,
} from "../app/game/i18n";
import type { GameState } from "../app/game/types";

function acceptFirstReward(state: GameState) {
  if (state.phase !== "reward") return state;
  assert.ok(state.rewardOffers[0]);
  return gameReducer(state, { type: "CHOOSE_REWARD", offerId: state.rewardOffers[0].id });
}

function playableRun(roleId = "method", seed = 1) {
  return acceptFirstReward(createGame(roleId, seed));
}

test("the same seed and role produce exactly the same run and opening reward", () => {
  const first = createGame("method", 424242);
  const second = createGame("method", 424242);
  assert.deepEqual(first, second);
  assert.equal(first.phase, "reward");
  assert.equal(first.rewardOffers.length, 3);
  assert.notDeepEqual(first, createGame("method", 424243));
});

test("known RNG vector remains stable", () => {
  let state = 1;
  const values: number[] = [];
  for (let index = 0; index < 5; index += 1) {
    const [value, next] = nextRandom(state);
    values.push(value);
    state = next;
  }
  const expected = [
    0.6270739405881613,
    0.002735721180215478,
    0.5274470399599522,
    0.9810509674716741,
    0.9683778982143849,
  ];
  values.forEach((value, index) => assert.ok(Math.abs(value - expected[index]) < 1e-14));
});

test("opening reward adds one relic and cannot be claimed twice", () => {
  const state = createGame("clinical", 77);
  const offer = state.rewardOffers[0];
  const once = gameReducer(state, { type: "CHOOSE_REWARD", offerId: offer.id });
  const twice = gameReducer(once, { type: "CHOOSE_REWARD", offerId: offer.id });
  assert.equal(once.phase, "playing");
  assert.equal(once.relics.length, 1);
  assert.deepEqual(twice, once);
});

test("playing the same card instance twice is an atomic no-op", () => {
  const state = playableRun("clinical", 17);
  const instance = state.hand.find((card) => getCardPreview(state, card.instanceId).playable);
  assert.ok(instance);
  const before = structuredClone(state);
  const once = gameReducer(state, { type: "PLAY_CARD", instanceId: instance.instanceId });
  const twice = gameReducer(once, { type: "PLAY_CARD", instanceId: instance.instanceId });
  assert.deepEqual(twice, once);
  assert.deepEqual(state, before, "reducer must not mutate its input");
});

test("hard failure outranks solving the current comment", () => {
  const initial = playableRun("method", 9);
  const dangerousInstance = { instanceId: 9999, cardId: "hide-result" };
  const state: GameState = {
    ...initial,
    hand: [dangerousInstance],
    issue: { ...initial.issue, progress: initial.issue.difficulty - 1 },
    resources: { ...initial.resources, risk: 80, focus: 3 },
  };
  const result = gameReducer(state, { type: "PLAY_CARD", instanceId: 9999 });
  assert.equal(result.phase, "ended");
  assert.equal(result.ending?.id, "retracted");
});

test("the last day resolves into one stable editorial decision", () => {
  const initial = playableRun("clinical", 88);
  const state: GameState = {
    ...initial,
    resolved: initial.target - 2,
    stats: { novelty: 6, evidence: 7, clarity: 6, reproducibility: 7 },
    resources: { ...initial.resources, days: 1, mental: 15 },
    solvedThisTurn: 1,
  };
  const result = gameReducer(state, { type: "END_TURN", expectedTurn: state.turn });
  assert.equal(result.phase, "ended");
  assert.equal(result.ending?.id, "major_revision");
  assert.equal(result.resources.days, 0);
});

test("replaying an END_TURN token cannot consume a second day", () => {
  const state = playableRun("interdisciplinary", 123);
  const action = { type: "END_TURN" as const, expectedTurn: state.turn };
  const once = gameReducer(state, action);
  const twice = gameReducer(once, action);
  assert.deepEqual(twice, once);
  assert.equal(once.resources.days, state.resources.days - 1);
});

function autoplay(seed: number, roleId: string) {
  let state = createGame(roleId, seed);
  let steps = 0;
  while (state.phase !== "ended" && steps < 1500) {
    steps += 1;
    if (state.phase === "reward") {
      const offer = state.rewardOffers[0];
      assert.ok(offer);
      state = gameReducer(state, { type: "CHOOSE_REWARD", offerId: offer.id });
    } else if (state.phase === "event") {
      const event = getActiveEvent(state);
      assert.ok(event);
      const choice = event.choices.find((item) => canChooseEvent(state, item));
      assert.ok(choice);
      state = gameReducer(state, { type: "CHOOSE_EVENT", eventId: event.id, choiceId: choice.id });
    } else {
      const playable = state.hand
        .map((card) => ({ card, preview: getCardPreview(state, card.instanceId) }))
        .filter((item) => item.preview.playable)
        .sort((a, b) => b.preview.answer - a.preview.answer)[0];
      if (playable && (playable.preview.answer > 0 || state.resources.focus > 1)) {
        state = gameReducer(state, { type: "PLAY_CARD", instanceId: playable.card.instanceId });
      } else {
        state = gameReducer(state, { type: "END_TURN", expectedTurn: state.turn });
      }
    }

    assert.ok(state.resources.gpu >= 0);
    assert.ok(state.resources.funding >= 0);
    assert.ok(state.resources.mental >= 0);
    assert.ok(state.resources.days >= 0);
    assert.ok(state.resources.focus >= 0);
    assert.ok(state.resources.risk >= 0 && state.resources.risk <= 100);
    for (const value of Object.values(state.stats)) assert.ok(value >= 0 && value <= 15);
    for (const value of Object.values(state.conditions)) assert.ok(value >= 0 && value <= 5);
  }
  assert.ok(steps < 1500, `autoplay did not terminate for ${roleId}/${seed}`);
  assert.equal(state.phase, "ended");
  assert.ok(Number.isSafeInteger(state.ending?.score));
  return state;
}

test("many seeded runs terminate without violating resource or condition bounds", () => {
  const endings = new Set<string>();
  let richestRun = 0;
  let mostUpgrades = 0;
  for (const role of ROLES) {
    for (let seed = 1; seed <= 12; seed += 1) {
      const result = autoplay(seed * 7919, role.id);
      if (result.ending) endings.add(result.ending.id);
      richestRun = Math.max(richestRun, result.relics.length);
      mostUpgrades = Math.max(mostUpgrades, Object.values(result.cardLevels).filter((level) => level > 0).length);
    }
  }
  assert.ok(endings.size >= 3, `expected varied endings, got ${[...endings].join(", ")}`);
  assert.ok(richestRun >= 2, "at least one run should reach multiple relic rewards");
  assert.ok(mostUpgrades >= 1, "at least one run should reach a card upgrade reward");
});

test("expanded content is large, unique, linked, and fully bilingual", () => {
  assert.ok(CARDS.length >= 256);
  assert.ok(EVENTS.length >= 128);
  assert.ok(COMMENTS.length >= 160);
  assert.ok(ROLES.length >= 20);
  assert.ok(RELICS.length >= 48);

  for (const collection of [CARDS, EVENTS, COMMENTS, ROLES, RELICS]) {
    assert.equal(new Set(collection.map((item) => item.id)).size, collection.length);
  }
  assert.equal(Object.keys(CARD_BY_ID).length, CARDS.length);
  for (const stage of ["reviewer1", "reviewer2", "editor", "camera", "coauthor"]) {
    assert.ok(COMMENTS.some((comment) => comment.stage === stage));
  }

  const containsHan = (value: string) => /\p{Script=Han}/u.test(value);
  for (const role of ROLES) {
    assert.ok(!containsHan(roleText(role, "pitch", "en")));
    assert.ok(!containsHan(roleText(role, "passive", "en")));
    assert.ok(!containsHan(roleText(role, "weakness", "en")));
  }
  for (const card of CARDS) {
    assert.ok(!containsHan(cardRules(card, "en")), card.id);
    assert.ok(card.provides && Object.values(card.provides).some((value) => (value ?? 0) > 0), `${card.id} needs structured capabilities`);
  }
  for (const comment of COMMENTS) {
    assert.ok(commentQuote(comment, "zh").length > 0);
    assert.ok(!containsHan(commentNote(comment, "en")), comment.id);
    assert.equal(comment.routes?.length, 3, `${comment.id} needs three routes`);
    for (const route of comment.routes ?? []) {
      assert.ok(route.name.length > 0 && route.nameEn.length > 0);
      assert.ok(route.requirements.length >= 2);
      for (const requirement of route.requirements) {
        assert.ok(requirement.label.length > 0 && requirement.labelEn.length > 0);
        assert.ok(requirement.target > 0);
      }
    }
  }
  for (const event of EVENTS) {
    assert.ok(!containsHan(eventTitle(event, "en")), event.id);
    assert.ok(!containsHan(eventDescription(event, "en")), event.id);
    assert.equal(new Set(event.choices.map((choice) => choice.id)).size, event.choices.length);
    for (const choice of event.choices) {
      assert.ok(!containsHan(eventChoiceText(event, choice, "label", "en")), `${event.id}.${choice.id}`);
      assert.ok(!containsHan(eventChoiceText(event, choice, "hint", "en")), `${event.id}.${choice.id}`);
      assert.ok(!containsHan(eventChoiceText(event, choice, "result", "en")), `${event.id}.${choice.id}`);
    }
  }
});

test("the campaign and content pools are at least four times the previous game", () => {
  assert.deepEqual(getCampaignConfig(), { days: 48, target: 40, handSize: 7 });
  assert.equal(CARDS.length, 264);
  assert.equal(EVENTS.length, 128);
  assert.equal(COMMENTS.length, 160);
  assert.equal(ROLES.length, 20);
  assert.equal(RELICS.length, 48);
});

test("off-topic cards cannot damage a review task while matching cards advance exact steps", () => {
  const initial = playableRun("method", 701);
  const comment = COMMENTS.find((item) => item.id === "r1-figure");
  if (!comment) assert.fail("r1-figure comment is missing");
  assert.ok(comment.routes?.some((route) => route.id === "verify"));
  const state: GameState = {
    ...initial,
    phase: "playing",
    issue: {
      commentId: "r1-figure",
      routeId: "verify",
      progress: 0,
      difficulty: comment.difficulty,
      escalations: 0,
      capabilityProgress: {},
      extraRequirements: [],
      followUps: 0,
    },
    hand: [
      { instanceId: 9001, cardId: "stat-test" },
      { instanceId: 9002, cardId: "better-figure" },
    ],
    resources: { ...initial.resources, focus: 6, gpu: 20, funding: 20 },
  };
  const unrelated = getCardPreview(state, 9001);
  const matching = getCardPreview(state, 9002);
  assert.equal(unrelated.answer, 0);
  assert.equal(unrelated.matchLevel, "none");
  assert.ok(matching.answer > 0);
  assert.ok(matching.contributions?.some((item) => item.capability === "visualization"));
});

test("switching routes retains completed capability work and changes the checklist", () => {
  const initial = playableRun("method", 703);
  const progress = { claimFraming: 2, responseWriting: 1 } as const;
  const state: GameState = {
    ...initial,
    issue: { ...initial.issue, capabilityProgress: progress, routeId: "verify" },
  };
  const before = getIssueRequirements(state).map((item) => item.capability);
  const switched = gameReducer(state, { type: "CHOOSE_ROUTE", routeId: "scope" });
  const after = getIssueRequirements(switched).map((item) => item.capability);
  assert.equal(switched.issue.routeId, "scope");
  assert.deepEqual(switched.issue.capabilityProgress, progress);
  assert.notDeepEqual(after, before);
});

test("targeted research spends one Focus, finds a related card, and is limited to once per day", () => {
  const initial = playableRun("method", 709);
  const state: GameState = {
    ...initial,
    hand: initial.hand.slice(0, 2),
    resources: { ...initial.resources, focus: 4 },
    researchedThisTurn: false,
  };
  const once = gameReducer(state, { type: "RESEARCH" });
  const twice = gameReducer(once, { type: "RESEARCH" });
  assert.equal(once.resources.focus, 3);
  assert.equal(once.researchedThisTurn, true);
  assert.ok(once.hand.some((card) => getCardPreview(once, card.instanceId).answer > 0));
  assert.deepEqual(twice, once);
});

test("event choices cannot spend unavailable Focus", () => {
  const initial = playableRun("method", 719);
  const event = EVENTS.find((item) => item.id === "coffee-broken");
  const choice = event?.choices.find((item) => item.id === "repair");
  assert.ok(event && choice);
  const state: GameState = { ...initial, phase: "event", activeEventId: event.id, resources: { ...initial.resources, focus: 0 } };
  assert.equal(canChooseEvent(state, choice), false);
});
