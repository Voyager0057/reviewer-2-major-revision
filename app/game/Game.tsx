"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CAPABILITY_META,
  CARD_BY_ID,
  CATEGORY_META,
  EVENT_BY_ID,
  METRICS,
  METRIC_META,
  RELIC_BY_ID,
  ROLE_BY_ID,
  ROLES,
  STAGE_META,
} from "./data";
import {
  canChooseEvent,
  cardDeltaSummary,
  createGame,
  gameReducer,
  getActiveEvent,
  getCardCosts,
  getCardPreview,
  getCurrentComment,
  getCurrentRoute,
  getIssueRequirements,
} from "./engine";
import {
  UI_COPY,
  cardRules,
  commentNote,
  commentQuote,
  eventChoiceText,
  eventDescription,
  eventTitle,
  roleText,
} from "./i18n";
import { clearRun, commitBest, loadRun, readBest, saveRun } from "./storage";
import type { BestRun } from "./storage";
import type { GameAction, GameState, Locale, Metric, RoleDef } from "./types";

type MenuScreen = "menu" | "roles";
type SoundKind = "paper" | "success" | "error" | "stamp";

const SOUND_KEY = "reviewer2:sound:v1";
const LOCALE_KEY = "reviewer2:locale:v1";

function MetricBar({
  metric,
  value,
  compact = false,
  locale,
}: {
  metric: Metric;
  value: number;
  compact?: boolean;
  locale: Locale;
}) {
  const meta = METRIC_META[metric];
  return (
    <div className={`metric-row ${compact ? "metric-row-compact" : ""}`}>
      <div className="metric-label">
        <span aria-hidden="true">{meta.icon}</span>
        <span>{locale === "zh" ? meta.label : meta.labelEn}</span>
        <strong>{value}</strong>
      </div>
      <div
        className="metric-track"
        role="progressbar"
        aria-label={`${locale === "zh" ? meta.label : meta.labelEn} ${value} / 15`}
        aria-valuemin={0}
        aria-valuemax={15}
        aria-valuenow={value}
      >
        <span style={{ width: `${Math.min(100, (value / 15) * 100)}%` }} />
      </div>
    </div>
  );
}

function RoleCard({
  role,
  selected,
  onSelect,
  locale,
}: {
  role: RoleDef;
  selected: boolean;
  onSelect: () => void;
  locale: Locale;
}) {
  const c = UI_COPY[locale];
  return (
    <button
      type="button"
      className={`role-card ${selected ? "is-selected" : ""}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span className="folder-tab">{role.en}</span>
      <span className="role-symbol" aria-hidden="true">
        {role.symbol}
      </span>
      <span className="role-heading">
        <strong>{locale === "zh" ? role.name : role.en}</strong>
        <small>{locale === "zh" ? role.en : role.name}</small>
      </span>
      <span className="role-pitch">{roleText(role, "pitch", locale)}</span>
      <span className="role-metrics">
        {METRICS.map((metric) => (
          <span key={metric}>
            {METRIC_META[metric].short}
            <b>{role.stats[metric]}</b>
          </span>
        ))}
      </span>
      <span className="role-passive">
        <b>{c.passive}</b> {roleText(role, "passive", locale)}
      </span>
      <span className="role-weakness">
        <b>{c.weakness}</b> {roleText(role, "weakness", locale)}
      </span>
      <span className="role-resources">
        <span>GPU {role.resources.gpu * 4}</span>
        <span>{c.funding} {role.resources.funding * 4}</span>
        <span>{c.mental} {Math.min(24, role.resources.mental + 8)}</span>
      </span>
    </button>
  );
}

function ResourceChip({
  icon,
  label,
  value,
  danger = false,
}: {
  icon: string;
  label: string;
  value: number | string;
  danger?: boolean;
}) {
  return (
    <span className={`resource-chip ${danger ? "is-danger" : ""}`}>
      <span aria-hidden="true">{icon}</span>
      <small>{label}</small>
      <strong>{value}</strong>
    </span>
  );
}

function safeSeed() {
  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    const values = new Uint32Array(1);
    window.crypto.getRandomValues(values);
    return values[0] || 20260812;
  }
  return 20260812;
}

function upgradeDescription(card: (typeof CARD_BY_ID)[string], locale: Locale) {
  const descriptions = {
    zh: {
      experiment: "升级：GPU 消耗 -1，回应 +1",
      writing: "升级：专注消耗 -1，回应 +2",
      rigor: "升级：经费消耗 -1，回应 +1，打出时风险 -3",
      support: "升级：专注消耗 -1，精神 +1，并抽 1 张牌",
      questionable: "升级：风险 -5，回应 +2",
    },
    en: {
      experiment: "Upgrade: GPU cost -1 and Response +1",
      writing: "Upgrade: Focus cost -1 and Response +2",
      rigor: "Upgrade: Funding cost -1, Response +1, and Risk -3 when played",
      support: "Upgrade: Focus cost -1, Mental +1, and draw 1 card",
      questionable: "Upgrade: Risk -5 and Response +2",
    },
  } as const;
  return descriptions[locale][card.category];
}

function reportText(game: GameState, locale: Locale) {
  if (!game.ending) return "";
  const role = ROLE_BY_ID[game.roleId];
  const stats = METRICS.map(
    (metric) => `${METRIC_META[metric].short}${game.stats[metric]}`,
  ).join("/");
  return [
    `《Reviewer #2: Major Revision》`,
    `${locale === "zh" ? role.name : role.en} · ${game.ending.stamp} · ${game.ending.score} ${locale === "zh" ? "分" : "pts"}`,
    locale === "zh"
      ? `解决 ${game.resolved}/${game.target} 条意见 · ${stats} · 撤稿风险 ${game.resources.risk}%`
      : `Resolved ${game.resolved}/${game.target} comments · ${stats} · Retraction Risk ${game.resources.risk}%`,
    `Seed ${game.seed}`,
    game.hiddenBoss
      ? locale === "zh" ? "合作者在截止前要求重写整篇，我还是活到了 Decision Letter。" : "The coauthor requested a complete rewrite before the deadline. I still reached the Decision Letter."
      : locale === "zh" ? `Reviewer #2 追加了 ${Math.max(0, game.resolved - 2)} 次要求，我活到了 ${STAGE_META[game.currentStage].en}。` : `Reviewer #2 moved the goalposts ${Math.max(0, game.resolved - 2)} times. I survived to ${STAGE_META[game.currentStage].en}.`,
  ].join("\n");
}

function drawShareCard(game: GameState, canvas: HTMLCanvasElement, locale: Locale) {
  if (!game.ending) return;
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const role = ROLE_BY_ID[game.roleId];

  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, "#09101e");
  gradient.addColorStop(1, "#172039");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 630);

  ctx.fillStyle = "rgba(255,255,255,.035)";
  for (let x = 0; x < 1200; x += 36) ctx.fillRect(x, 0, 1, 630);
  for (let y = 0; y < 630; y += 36) ctx.fillRect(0, y, 1200, 1);

  ctx.shadowColor = "rgba(0,0,0,.42)";
  ctx.shadowBlur = 36;
  ctx.fillStyle = "#f4efdf";
  ctx.fillRect(70, 52, 1060, 526);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#202633";
  ctx.font = "700 29px ui-monospace, monospace";
  ctx.fillText("DECISION LETTER · MR-2026-042", 112, 110);
  ctx.fillStyle = "#7a725f";
  ctx.font = "22px system-ui, sans-serif";
  ctx.fillText("Reviewer #2: Major Revision", 112, 148);

  ctx.fillStyle = "#202633";
  ctx.font = "800 48px system-ui, sans-serif";
  ctx.fillText(locale === "zh" ? game.ending.title : game.ending.titleEn ?? game.ending.title, 112, 224);
  ctx.font = "26px system-ui, sans-serif";
  ctx.fillStyle = "#565043";
  ctx.fillText(`${locale === "zh" ? role.name : role.en} · ${locale === "zh" ? role.en : role.name}`, 112, 267);

  const metricX = [112, 314, 516, 718];
  METRICS.forEach((metric, index) => {
    ctx.fillStyle = "#d9d1bc";
    ctx.fillRect(metricX[index], 322, 154, 10);
    ctx.fillStyle = index === 0 ? "#6f63cf" : index === 1 ? "#2f8f68" : index === 2 ? "#c38328" : "#327ca8";
    ctx.fillRect(metricX[index], 322, (154 * game.stats[metric]) / 15, 10);
    ctx.fillStyle = "#625b4d";
    ctx.font = "18px system-ui, sans-serif";
    ctx.fillText(locale === "zh" ? METRIC_META[metric].label : METRIC_META[metric].labelEn, metricX[index], 365);
    ctx.fillStyle = "#202633";
    ctx.font = "800 30px ui-monospace, monospace";
    ctx.fillText(String(game.stats[metric]), metricX[index] + 112, 365);
  });

  ctx.fillStyle = "#202633";
  ctx.font = "800 34px ui-monospace, monospace";
  ctx.fillText(`${game.ending.score.toLocaleString()} pts`, 112, 450);
  ctx.fillStyle = "#766e5e";
  ctx.font = "20px ui-monospace, monospace";
  ctx.fillText(`SOLVED ${game.resolved}/${game.target}  ·  RISK ${game.resources.risk}%  ·  SEED ${game.seed}`, 112, 493);
  ctx.fillStyle = "#887f6e";
  ctx.font = "19px system-ui, sans-serif";
  ctx.fillText(
    game.hiddenBoss
      ? locale === "zh" ? "截止前一天，合作者要求重写整篇。你还是提交了。" : "One day before the deadline, the coauthor requests a full rewrite. You still submit."
      : locale === "zh" ? "每次投稿都会构筑一套不同的回复策略。" : "Every submission builds a different rebuttal strategy.",
    112,
    538,
  );

  ctx.save();
  ctx.translate(981, 190);
  ctx.rotate(-0.12);
  ctx.strokeStyle = "#bd3d42";
  ctx.lineWidth = 8;
  ctx.strokeRect(-118, -54, 236, 108);
  ctx.fillStyle = "#bd3d42";
  ctx.textAlign = "center";
  ctx.font = "900 36px ui-monospace, monospace";
  ctx.fillText(game.ending.stamp, 0, 13);
  ctx.restore();
}

export default function Game() {
  const [locale, setLocale] = useState<Locale>("zh");
  const [screen, setScreen] = useState<MenuScreen>("menu");
  const [selectedRole, setSelectedRole] = useState("method");
  const [game, setGame] = useState<GameState | null>(null);
  const [savedRun, setSavedRun] = useState<GameState | null>(null);
  const [best, setBest] = useState<BestRun | null>(null);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(true);
  const [soundOn, setSoundOn] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const audioRef = useRef<AudioContext | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeSelectedCard =
    selectedCard !== null && game?.hand.some((card) => card.instanceId === selectedCard)
      ? selectedCard
      : null;
  const c = UI_COPY[locale];

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setBest(readBest());
      setSavedRun(loadRun());
      try {
        const stored = window.localStorage.getItem(SOUND_KEY);
        if (stored === "off") setSoundOn(false);
        const storedLocale = window.localStorage.getItem(LOCALE_KEY);
        if (storedLocale === "en" || storedLocale === "zh") setLocale(storedLocale);
      } catch {
        // Preferences are optional.
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

  useEffect(() => {
    if (!game) return;
    if (game.phase === "ended") {
      clearRun();
      const previousBest = readBest();
      const nextBest = commitBest(game);
      if (nextBest) {
        const newRecord = !previousBest || game.ending!.score > previousBest.score;
        window.queueMicrotask(() => {
          setBest(nextBest);
          setIsNewRecord(newRecord);
        });
      }
      return;
    }
    saveRun(game);
  }, [game]);

  const playSound = useCallback(
    (kind: SoundKind) => {
      if (!soundOn || typeof window === "undefined") return;
      try {
        const AudioCtor = window.AudioContext;
        const audio = audioRef.current ?? new AudioCtor();
        audioRef.current = audio;
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        const now = audio.currentTime;
        const config = {
          paper: { frequency: 190, duration: 0.06, type: "triangle" as OscillatorType },
          success: { frequency: 620, duration: 0.12, type: "sine" as OscillatorType },
          error: { frequency: 120, duration: 0.1, type: "sawtooth" as OscillatorType },
          stamp: { frequency: 72, duration: 0.16, type: "square" as OscillatorType },
        }[kind];
        oscillator.type = config.type;
        oscillator.frequency.setValueAtTime(config.frequency, now);
        if (kind === "success") oscillator.frequency.exponentialRampToValueAtTime(920, now + config.duration);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.07, now + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + config.duration);
        oscillator.connect(gain).connect(audio.destination);
        oscillator.start(now);
        oscillator.stop(now + config.duration);
      } catch {
        // Audio is a nonessential enhancement.
      }
    },
    [soundOn],
  );

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    try {
      window.localStorage.setItem(SOUND_KEY, next ? "on" : "off");
    } catch {
      // Preferences are optional.
    }
  };

  const toggleLocale = () => {
    const next: Locale = locale === "zh" ? "en" : "zh";
    setLocale(next);
    try {
      window.localStorage.setItem(LOCALE_KEY, next);
    } catch {
      // Language preference is optional.
    }
  };

  const startRun = useCallback(
    (roleId: string, seed = safeSeed()) => {
      clearRun();
      setSavedRun(null);
      setSelectedCard(null);
      setTutorialOpen(true);
      setIsNewRecord(false);
      setLogOpen(false);
      setGame(createGame(roleId, seed));
      playSound("paper");
    },
    [playSound],
  );

  const dispatch = useCallback(
    (action: GameAction) => {
      setGame((current) => (current ? gameReducer(current, action) : current));
      if (action.type === "PLAY_CARD") {
        setSelectedCard(null);
        playSound("paper");
      } else if (action.type === "CHOOSE_EVENT") {
        playSound("success");
      } else {
        playSound("paper");
      }
    },
    [playSound],
  );

  const selectedPreview = useMemo(() => {
    if (!game || activeSelectedCard === null) return null;
    return getCardPreview(game, activeSelectedCard);
  }, [activeSelectedCard, game]);

  const playSelected = useCallback(() => {
    if (!game || activeSelectedCard === null) return;
    const preview = getCardPreview(game, activeSelectedCard);
    if (!preview.playable) {
      playSound("error");
      return;
    }
    dispatch({ type: "PLAY_CARD", instanceId: activeSelectedCard });
  }, [activeSelectedCard, dispatch, game, playSound]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        event.repeat ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        target?.matches("input, textarea, select, button, a, [role='button'], [contenteditable='true']")
      ) {
        return;
      }
      if (event.key === "?") {
        event.preventDefault();
        setHelpOpen(true);
        return;
      }
      if (event.key === "Escape") {
        setHelpOpen(false);
        setLogOpen(false);
        return;
      }
      if (!game || game.phase !== "playing" || helpOpen) return;
      const number = Number(event.key);
      if (number >= 1 && number <= game.hand.length) {
        event.preventDefault();
        setSelectedCard(game.hand[number - 1].instanceId);
      } else if (event.key === "Enter" && activeSelectedCard !== null) {
        event.preventDefault();
        playSelected();
      } else if (event.key.toLowerCase() === "e") {
        event.preventDefault();
        dispatch({ type: "END_TURN", expectedTurn: game.turn });
      } else if (event.key.toLowerCase() === "l") {
        event.preventDefault();
        setLogOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeSelectedCard, dispatch, game, helpOpen, playSelected]);

  useEffect(() => {
    if (game?.phase === "ended") playSound("stamp");
  }, [game?.phase, playSound]);

  const copyReport = async () => {
    if (!game?.ending) return;
    try {
      await navigator.clipboard.writeText(reportText(game, locale));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const shareResult = async () => {
    if (!game?.ending) return;
    const canvas = canvasRef.current ?? document.createElement("canvas");
    canvasRef.current = canvas;
    drawShareCard(game, canvas, locale);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png", 0.94),
    );
    if (!blob) return;
    const file = new File([blob], `reviewer-2-${game.seed}.png`, {
      type: "image/png",
    });
    try {
      if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
        await navigator.share({
          title: "Reviewer #2: Major Revision",
          text: reportText(game, locale),
          files: [file],
        });
        return;
      }
    } catch {
      // A cancelled share falls back to a local download.
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!game && screen === "menu") {
    return (
      <main className="app-shell menu-shell">
        <div className="desk-grid" aria-hidden="true" />
        <div className="monitor-glow" aria-hidden="true" />
        <header className="site-header">
          <a className="brand-lockup" href="#main-menu" aria-label={c.home}>
            <span className="brand-mark">R2</span>
            <span>
              <strong>Reviewer #2</strong>
              <small>Major Revision</small>
            </span>
          </a>
          <div className="header-actions">
            <button type="button" className="language-toggle" onClick={toggleLocale} aria-label={locale === "zh" ? "Switch to English" : "切换到中文"}>
              {locale === "zh" ? "EN" : "中"}
            </button>
            <button type="button" className="icon-button" onClick={toggleSound} aria-label={soundOn ? c.soundOff : c.soundOn}>
              {soundOn ? "♪" : "×♪"}
            </button>
            <button type="button" className="icon-button" onClick={() => setHelpOpen(true)} aria-label={c.help}>
              ?
            </button>
          </div>
        </header>

        <section className="menu-stage" id="main-menu">
          <div className="cover-wrap">
            <article className="submission-cover">
              <div className="paper-grain" aria-hidden="true" />
              <p className="cover-kicker">MANUSCRIPT ID: MR-2026-042</p>
              <h1>
                REVIEWER <span>#2</span>
                <small>Major Revision</small>
              </h1>
              <p className="cover-abstract">
                {c.coverAbstract}
              </p>
              <div className="cover-meta">
                <span>{c.runTime}</span>
                <span>{c.browserPlay}</span>
                <span>{c.localSave}</span>
              </div>
              <div className="major-stamp" aria-hidden="true">
                MAJOR
                <br />
                REVISION
              </div>
              <div className="red-note" aria-hidden="true">
                Please add
                <br />
                more experiments!
                <span>↙</span>
              </div>
            </article>
            <div className="coffee-ring" aria-hidden="true" />
            <div className="paperclip" aria-hidden="true" />
          </div>

          <div className="menu-copy">
            <p className="eyebrow">ACADEMIC SURVIVAL DECKBUILDER</p>
            <h2>{c.menuTitle}</h2>
            <p>{c.menuDescription}</p>
            <div className="menu-actions">
              <button type="button" className="primary-button" onClick={() => setScreen("roles")}>
                {c.start} <span aria-hidden="true">→</span>
              </button>
              {savedRun && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setGame(savedRun);
                    setSavedRun(null);
                    playSound("paper");
                  }}
                >
                  {c.continue} · {savedRun.resources.days} {c.daysLeft}
                </button>
              )}
            </div>
            <div className="menu-records">
              <span>
                <small>{c.localHigh}</small>
                <strong>{best ? best.score.toLocaleString() : "—"}</strong>
              </span>
              <span>
                <small>{c.mayMeet}</small>
                <strong>{c.hiddenBoss}</strong>
              </span>
              <span>
                <small>{c.dangerous}</small>
                <strong>{c.consequences}</strong>
              </span>
            </div>
          </div>
        </section>

        <footer className="menu-footer">
          <span>{c.tagline}</span>
          <span>{c.version}</span>
        </footer>
        {helpOpen && <HelpModal locale={locale} onClose={() => setHelpOpen(false)} />}
      </main>
    );
  }

  if (!game && screen === "roles") {
    const role = ROLE_BY_ID[selectedRole];
    return (
      <main className="app-shell roles-shell">
        <header className="site-header">
          <button type="button" className="brand-lockup brand-button" onClick={() => setScreen("menu")}>
            <span className="brand-mark">R2</span>
            <span>
              <strong>{c.selectManuscript}</strong>
              <small>{c.chooseManuscript}</small>
            </span>
          </button>
          <div className="header-actions">
            <button type="button" className="language-toggle" onClick={toggleLocale}>
              {locale === "zh" ? "EN" : "中"}
            </button>
            <button type="button" className="text-button" onClick={() => setScreen("menu")}>
              {c.back}
            </button>
            <button type="button" className="icon-button" onClick={() => setHelpOpen(true)} aria-label={c.help}>
              ?
            </button>
          </div>
        </header>
        <section className="role-select-section">
          <div className="section-heading">
            <p className="eyebrow">SELECT A MANUSCRIPT</p>
            <h1>{c.roleHeading}</h1>
          </div>
          <div className="role-grid">
            {ROLES.map((item) => (
              <RoleCard
                role={item}
                selected={item.id === selectedRole}
                onSelect={() => setSelectedRole(item.id)}
                locale={locale}
                key={item.id}
              />
            ))}
          </div>
          <div className="role-confirm-bar">
            <div>
              <span className="confirm-symbol">{role.symbol}</span>
              <span>
                <small>{c.currentChoice}</small>
                <strong>{locale === "zh" ? role.name : role.en}</strong>
              </span>
            </div>
            <button type="button" className="primary-button" onClick={() => startRun(role.id)}>
              {c.submit} <span aria-hidden="true">→</span>
            </button>
          </div>
        </section>
        {helpOpen && <HelpModal locale={locale} onClose={() => setHelpOpen(false)} />}
      </main>
    );
  }

  if (!game) return null;

  const role = ROLE_BY_ID[game.roleId];
  const stage = STAGE_META[game.currentStage];
  const comment = getCurrentComment(game);
  const route = getCurrentRoute(game);
  const requirements = getIssueRequirements(game);
  const event = getActiveEvent(game);
  const selectedInstance = game.hand.find((card) => card.instanceId === activeSelectedCard);
  const selectedDefinition = selectedInstance ? CARD_BY_ID[selectedInstance.cardId] : null;
  const progressPercent = Math.min(100, (game.issue.progress / game.issue.difficulty) * 100);
  const mentalDanger = game.resources.mental <= 5;
  const riskDanger = game.resources.risk >= 60;
  const stages = ["reviewer1", "reviewer2", "editor", "camera"] as const;
  const stageIndex = Math.max(0, stages.indexOf(game.currentStage === "coauthor" ? "camera" : game.currentStage));
  const conditionLabels: Record<keyof GameState["conditions"], string> = {
    caffeine: c.caffeine,
    insight: c.insight,
    technicalDebt: c.technicalDebt,
    reviewerFavor: c.reviewerFavor,
    pageDebt: c.pageDebt,
    infrastructureDown: locale === "zh" ? "基础设施中断" : "Infrastructure Down",
    queueDelay: locale === "zh" ? "集群排队" : "Queue Delay",
    advisorPressure: locale === "zh" ? "导师压力" : "Advisor Pressure",
    coauthorTrust: locale === "zh" ? "合作者信任" : "Coauthor Trust",
    auditTrail: locale === "zh" ? "审计记录" : "Audit Trail",
  };
  const activeConditions = (Object.entries(game.conditions) as [keyof GameState["conditions"], number][]).filter(([, value]) => value > 0);

  return (
    <main className="app-shell game-shell">
      <header className="game-topbar">
        <div className="game-brand">
          <span className="brand-mark mini">R2</span>
          <span>
            <strong>{stage.en}</strong>
            <small>{locale === "zh" ? stage.label : stage.labelEn}</small>
          </span>
        </div>
        <div className="stage-progress" aria-label={`${locale === "zh" ? "当前阶段" : "Current stage"} ${locale === "zh" ? stage.label : stage.labelEn}`}>
          {stages.map((stageId, index) => (
            <span
              key={stageId}
              className={index < stageIndex ? "is-done" : index === stageIndex ? "is-current" : ""}
            >
              <i>{index < stageIndex ? "✓" : index + 1}</i>
              <small>{STAGE_META[stageId].initials}</small>
            </span>
          ))}
        </div>
        <div className="top-resources">
          <ResourceChip icon="◷" label={c.remaining} value={`${game.resources.days} ${c.daysLeft}`} danger={game.resources.days <= 3} />
          <ResourceChip icon="▰" label="GPU" value={game.resources.gpu} danger={game.resources.gpu <= 2} />
          <ResourceChip icon="¥" label={c.funding} value={game.resources.funding} danger={game.resources.funding <= 1} />
          <ResourceChip icon="●" label={c.focus} value={game.resources.focus} danger={game.resources.focus === 0} />
        </div>
        <div className="header-actions compact-actions">
          <button type="button" className="language-toggle compact-language" onClick={toggleLocale}>
            {locale === "zh" ? "EN" : "中"}
          </button>
          <button type="button" className="icon-button" onClick={() => setLogOpen((open) => !open)} aria-label={c.log}>
            ≡
          </button>
          <button type="button" className="icon-button" onClick={toggleSound} aria-label={soundOn ? c.soundOff : c.soundOn}>
            {soundOn ? "♪" : "×♪"}
          </button>
          <button type="button" className="icon-button" onClick={() => setHelpOpen(true)} aria-label={c.help}>
            ?
          </button>
        </div>
      </header>

      <section className="battle-grid">
        <aside className="reviewer-panel panel-dark">
          <div className={`reviewer-avatar avatar-${stage.color}`}>
            <span>{stage.initials}</span>
            <i aria-hidden="true">✎</i>
          </div>
          <p className="panel-eyebrow">{c.currentBoss.toUpperCase()}</p>
          <h2>{stage.en}</h2>
          <p className="reviewer-mood">
            {game.currentStage === "reviewer2"
              ? game.issue.escalations > 0
                ? locale === "zh" ? "正在移动球门……" : "Moving the goalposts…"
                : locale === "zh" ? "正在要求更多实验……" : "Requesting more experiments…"
              : game.currentStage === "coauthor"
                ? locale === "zh" ? "刚刚打开了全文修订" : "Opened full-document revision"
                : locale === "zh" ? "正在检查你的回复" : "Checking your response"}
          </p>
          <div className="reviewer-stat">
            <span>
              <small>{c.resolved}</small>
              <strong>
                {game.resolved}<i>/{game.target}</i>
              </strong>
            </span>
            <span>
              <small>{c.escalations}</small>
              <strong>{game.issue.escalations}</strong>
            </span>
          </div>
          <div className="boss-meter">
            <span style={{ width: `${Math.min(100, (game.resolved / game.target) * 100)}%` }} />
          </div>
          <div className="role-mini-card">
            <span className="confirm-symbol small">{role.symbol}</span>
            <span>
              <small>{c.yourPaper}</small>
              <strong>{locale === "zh" ? role.name : role.en}</strong>
            </span>
          </div>
          <button type="button" className="log-toggle" onClick={() => setLogOpen((open) => !open)}>
            {logOpen ? c.hideLog : c.viewLog} <span>{logOpen ? "−" : "+"}</span>
          </button>
          {logOpen && (
            <div className="battle-log" aria-label={c.actionLog}>
              {[...game.logs].reverse().map((entry) => (
                <p className={`log-${entry.tone}`} key={entry.id}>
                  {locale === "zh" ? entry.text : entry.textEn ?? entry.text}
                </p>
              ))}
            </div>
          )}
        </aside>

        <section className="review-workspace" aria-live="polite">
          <div className="paper-stack" aria-hidden="true" />
          <article className="review-paper">
            <div className="paper-heading">
              <span>REVIEW REPORT</span>
              <span>{c.round} {game.turn}</span>
            </div>
            <div className="comment-meta">
              <span className={`severity severity-${comment.severity}`}>
                {comment.severity === 3 ? c.major.toUpperCase() : comment.severity === 2 ? c.concern.toUpperCase() : c.comment.toUpperCase()}
              </span>
              <span>{locale === "zh" ? METRIC_META[comment.primary].label : METRIC_META[comment.primary].labelEn}</span>
              {comment.secondary && <span>+ {locale === "zh" ? METRIC_META[comment.secondary].label : METRIC_META[comment.secondary].labelEn}</span>}
            </div>
            <blockquote lang="en">“{comment.quote}”</blockquote>
            {locale === "zh" && <p className="issue-translation"><b>{c.translation}</b> · {commentQuote(comment, "zh")}</p>}
            <p className="mechanic-note"><b>{c.gameplay}</b> · {commentNote(comment, locale)}</p>
            <div className="requirement-row">
              <span>
                {c.primary} <b>{METRIC_META[comment.primary].short}</b>
              </span>
              {comment.secondary && (
                <span>
                  {c.secondary} <b>{METRIC_META[comment.secondary].short}</b>
                </span>
              )}
              <span>
                {c.severity} <b>{comment.severity}</b>
              </span>
            </div>

            <section className="route-planner" aria-label={locale === "zh" ? "解决路线" : "Resolution routes"}>
              <div className="route-planner-heading">
                <span>
                  <small>{locale === "zh" ? "修改策略" : "REVISION STRATEGY"}</small>
                  <strong>{locale === "zh" ? "选择一条可接受的解决路线" : "Choose an acceptable resolution route"}</strong>
                </span>
                <i>{game.issue.followUps > 0 ? `+${game.issue.followUps} ${locale === "zh" ? "次追问" : "follow-up"}` : locale === "zh" ? "进度跨路线保留" : "Progress carries across routes"}</i>
              </div>
              <div className="route-tabs">
                {comment.routes?.map((item) => {
                  const missing = item.requirements.filter((requirement) =>
                    !game.masterDeck.some((cardId) => (CARD_BY_ID[cardId].provides?.[requirement.capability] ?? 0) > 0),
                  );
                  return (
                    <button
                      type="button"
                      key={item.id}
                      className={game.issue.routeId === item.id ? "is-active" : ""}
                      aria-pressed={game.issue.routeId === item.id}
                      disabled={missing.length > 0}
                      title={missing.length > 0
                        ? locale === "zh" ? `当前牌组缺少：${missing.map((entry) => entry.label).join("、")}` : `Deck is missing: ${missing.map((entry) => entry.labelEn).join(", ")}`
                        : undefined}
                      onClick={() => dispatch({ type: "CHOOSE_ROUTE", routeId: item.id })}
                    >
                      <strong>{locale === "zh" ? item.name : item.nameEn}</strong>
                      <small>{missing.length > 0
                        ? locale === "zh" ? `🔒 缺少 ${missing.map((entry) => entry.label).join("、")}` : `🔒 Missing ${missing.map((entry) => entry.labelEn).join(", ")}`
                        : locale === "zh" ? item.summary : item.summaryEn}</small>
                    </button>
                  );
                })}
              </div>
              {route && (
                <div className="route-steps">
                  {requirements.map((item, index) => {
                    const before = Math.min(item.target, game.issue.capabilityProgress[item.capability] ?? 0);
                    const contribution = selectedPreview?.contributions?.find((entry) => entry.capability === item.capability)?.amount ?? 0;
                    const after = Math.min(item.target, before + contribution);
                    return (
                      <div className={`route-step ${before >= item.target ? "is-complete" : ""} ${contribution > 0 ? "has-preview" : ""}`} key={item.id}>
                        <span className="route-step-index">{before >= item.target ? "✓" : index + 1}</span>
                        <span className="route-step-copy">
                          <strong>{locale === "zh" ? item.label : item.labelEn}</strong>
                          <small>{CAPABILITY_META[item.capability].icon} {item.capability}</small>
                        </span>
                        <span className="route-step-progress">
                          <b>{before}</b>{contribution > 0 && <em>+{contribution}</em>}<small>/ {item.target}</small>
                          <i><span style={{ width: `${(after / item.target) * 100}%` }} /></i>
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <div className="response-block">
              <div className="response-label">
                <span>{c.responseProgress}</span>
                <strong>
                  {game.issue.progress} <small>/ {game.issue.difficulty}</small>
                </strong>
              </div>
              <div
                className="response-meter"
                role="progressbar"
                aria-label={`${c.responseProgress} ${game.issue.progress} / ${game.issue.difficulty}`}
                aria-valuemin={0}
                aria-valuemax={game.issue.difficulty}
                aria-valuenow={Math.min(game.issue.progress, game.issue.difficulty)}
              >
                <span style={{ width: `${progressPercent}%` }} />
              </div>
              <p>
                {game.issue.escalations > 0
                  ? locale === "zh" ? `已拖延 ${game.issue.escalations} ${c.delayed}` : `Delayed ${game.issue.escalations} ${c.delayed}`
                  : c.exactHint}
              </p>
            </div>

            <div className={`selection-preview ${selectedDefinition ? "has-selection" : ""}`}>
              {selectedDefinition && selectedPreview ? (
                <>
                  <div>
                    <span className={`preview-icon category-${selectedDefinition.category}`}>
                      {CATEGORY_META[selectedDefinition.category].icon}
                    </span>
                    <span>
                      <small>{c.ready}</small>
                      <strong>{locale === "zh" ? selectedDefinition.name : selectedDefinition.en}</strong>
                    </span>
                  </div>
                  <p className={selectedDefinition.category === "questionable" ? "danger-copy" : ""}>
                    {locale === "zh" ? selectedPreview.outcome : selectedPreview.outcomeEn ?? selectedPreview.outcome}
                  </p>
                  <div className="match-breakdown">
                    {selectedPreview.matchedTags?.slice(0, 3).map((tag) => <span key={tag}>✓ {locale === "zh" ? CAPABILITY_META[tag].label : CAPABILITY_META[tag].labelEn}</span>)}
                    {selectedPreview.comboActive && <span className="combo-chip">↻ {c.combo}</span>}
                    {(game.cardLevels[selectedDefinition.id] ?? 0) > 0 && <span>↑ {c.upgradedMark}</span>}
                  </div>
                  <button
                    type="button"
                    className={selectedDefinition.category === "questionable" ? "danger-button" : "execute-button"}
                    onClick={playSelected}
                    disabled={!selectedPreview.playable}
                  >
                    {selectedPreview.playable
                      ? selectedDefinition.category === "questionable"
                        ? c.riskExecute
                        : c.execute
                      : locale === "zh" ? selectedPreview.reason : selectedPreview.reasonEn ?? selectedPreview.reason}
                  </button>
                </>
              ) : (
                <p>{c.selectHint}</p>
              )}
            </div>
            <span className="reviewer-scribble" aria-hidden="true">
              more?
            </span>
          </article>
        </section>

        <aside className="metrics-panel panel-dark">
          <div className="metrics-heading">
            <span>
              <small>MANUSCRIPT</small>
              <strong>{c.manuscript}</strong>
            </span>
            <span className="seed-label">#{String(game.seed).slice(-5)}</span>
          </div>
          <div className="metrics-list">
            {METRICS.map((metric) => (
              <MetricBar metric={metric} value={game.stats[metric]} locale={locale} key={metric} />
            ))}
          </div>
          {(game.relics.length > 0 || activeConditions.length > 0) && (
            <div className="run-modifiers">
              {game.relics.length > 0 && (
                <div className="modifier-group">
                  <small>{c.relics}</small>
                  <div className="modifier-chips">
                    {game.relics.map((relicId) => {
                      const relic = RELIC_BY_ID[relicId];
                      return relic ? <span title={locale === "zh" ? relic.rules : relic.rulesEn} key={relicId}>{relic.icon} {locale === "zh" ? relic.name : relic.en}</span> : null;
                    })}
                  </div>
                </div>
              )}
              {activeConditions.length > 0 && (
                <div className="modifier-group">
                  <small>{c.activeEffects}</small>
                  <div className="modifier-chips condition-chips">
                    {activeConditions.map(([key, value]) => <span key={key}>{conditionLabels[key]} ×{value}</span>)}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="health-block">
            <div className="health-label">
              <span>{c.mentalState}</span>
              <strong className={mentalDanger ? "danger-text" : ""}>{game.resources.mental}/18</strong>
            </div>
            <div className="health-meter mental-meter">
              <span style={{ width: `${(game.resources.mental / 18) * 100}%` }} />
            </div>
          </div>
          <div className={`risk-block ${riskDanger ? "is-hot" : ""}`}>
            <div className="health-label">
              <span>
                {c.risk} <i title={c.riskTitle}>?</i>
              </span>
              <strong>{game.resources.risk}%</strong>
            </div>
            <div className="health-meter risk-meter">
              <span style={{ width: `${game.resources.risk}%` }} />
            </div>
            <p>
              {game.resources.risk < 30
                ? c.riskLow
                : game.resources.risk < 60
                  ? c.riskMid
                  : c.riskHigh}
            </p>
          </div>
          <button type="button" className="end-turn-button" onClick={() => dispatch({ type: "END_TURN", expectedTurn: game.turn })}>
            {c.endDay} <span>E</span>
          </button>
        </aside>
      </section>

      <section className="hand-section" aria-label={c.today}>
        <div className="hand-heading">
          <span>
            <strong>{c.today}</strong>
            <small>{c.cardHint} · 1–{game.hand.length}</small>
          </span>
          <span className="deck-count">
            {c.deck} {game.deck.length} · {c.discard} {game.discard.length} · {c.exhausted} {game.exhausted.length}
          </span>
          <button
            type="button"
            className="research-button"
            disabled={game.researchedThisTurn || game.resources.focus < 1}
            onClick={() => dispatch({ type: "RESEARCH" })}
          >
            ⌕ {game.researchedThisTurn
              ? locale === "zh" ? "今日已检索" : "Researched today"
              : locale === "zh" ? "定向检索相关牌 · 专注 −1" : "Find a relevant card · Focus −1"}
          </button>
        </div>
        <div className="card-hand">
          {game.hand.map((instance, index) => {
            const card = CARD_BY_ID[instance.cardId];
            const preview = getCardPreview(game, instance.instanceId);
            const costs = getCardCosts(game, card);
            const selected = activeSelectedCard === instance.instanceId;
            return (
              <button
                type="button"
                className={`action-card card-${card.category} ${selected ? "is-selected" : ""} ${!preview.playable ? "is-unplayable" : ""}`}
                onClick={() => setSelectedCard(instance.instanceId)}
                aria-pressed={selected}
                key={instance.instanceId}
              >
                <span className="key-hint">{index + 1}</span>
                <span className="card-topline">
                  <span className={`card-category category-${card.category}`}>
                    {CATEGORY_META[card.category].icon} {locale === "zh" ? CATEGORY_META[card.category].label : CATEGORY_META[card.category].labelEn}
                  </span>
                  <span className="focus-cost">● {costs.focus}</span>
                </span>
                <span className="card-name">
                  <strong>{locale === "zh" ? card.name : card.en}</strong>
                  <small>{locale === "zh" ? card.en : card.name}</small>
                </span>
                <span className="card-keywords">
                  {(card.rarity ?? "common") !== "common" && <i className={`rarity-${card.rarity}`}>{card.rarity === "rare" ? c.rarityRare : c.rarityUncommon}</i>}
                  {(game.cardLevels[card.id] ?? 0) > 0 && <i className="keyword-upgraded">↑ {c.upgradedMark}</i>}
                  {card.retain && <i>{c.retain}</i>}
                  {card.exhaust && <i>{c.exhaust}</i>}
                  {preview.comboActive && <i className="combo-chip">↻ {c.combo}</i>}
                </span>
                <span className="card-rules">{cardRules(card, locale)}</span>
                <span className="card-deltas">{cardDeltaSummary(card, locale)}</span>
                {preview.matchedTags && preview.matchedTags.length > 0 && (
                  <span className="tag-match-row">{preview.matchedTags.slice(0, 2).map((tag) => <i key={tag}>✓ {locale === "zh" ? CAPABILITY_META[tag].label : CAPABILITY_META[tag].labelEn}</i>)}</span>
                )}
                <span className="card-footer">
                  <span className="cost-list">
                    {costs.gpu > 0 && <i>GPU −{costs.gpu}</i>}
                    {costs.funding > 0 && <i>{c.funding} −{costs.funding}</i>}
                    {costs.mental > 0 && <i>{c.mental} −{costs.mental}</i>}
                    {costs.risk > 0 && <i className="risk-cost">{c.risk} +{costs.risk}</i>}
                  </span>
                  <b>{c.response} +{preview.answer}</b>
                </span>
                {!preview.playable && <span className="unplayable-reason">{locale === "zh" ? preview.reason : preview.reasonEn ?? preview.reason}</span>}
              </button>
            );
          })}
          {game.hand.length === 0 && (
            <div className="empty-hand">
              <span>{c.emptyHand}</span>
              <button type="button" onClick={() => dispatch({ type: "END_TURN", expectedTurn: game.turn })}>
                {c.endDay}
              </button>
            </div>
          )}
        </div>
      </section>

      {tutorialOpen && game.runStats.cardsPlayed === 0 && (
        <div className="tutorial-toast">
          <span>{c.tutorialTitle}</span>
          <p>{c.tutorial}</p>
          <button type="button" onClick={() => setTutorialOpen(false)} aria-label={c.closeTutorial}>
            ×
          </button>
        </div>
      )}

      <div className="sr-live" aria-live="polite">
        {locale === "zh" ? game.lastMessage : game.logs.at(-1)?.textEn ?? game.lastMessage}
      </div>

      {game.phase === "reward" && (
        <div className="modal-backdrop reward-backdrop">
          <section className="reward-dialog" role="dialog" aria-modal="true" aria-labelledby="reward-title">
            <p className="eyebrow">DECKBUILDING REWARD</p>
            <h2 id="reward-title">{c.rewardTitle}</h2>
            <p>{game.rewardReason === "opening"
              ? locale === "zh" ? "投稿前，选择一件会改变整局规则的研究优势。" : "Before submission, choose one research advantage that changes the rules of this run."
              : game.rewardReason === "stage_clear" ? c.rewardStage : c.rewardCard}</p>
            <small>{c.chooseOne}</small>
            <div className="reward-grid">
              {game.rewardOffers.map((offer) => {
                if (offer.kind === "relic") {
                  const relic = RELIC_BY_ID[offer.contentId];
                  if (!relic) return null;
                  return (
                    <button type="button" className="reward-option reward-relic" key={offer.id} onClick={() => dispatch({ type: "CHOOSE_REWARD", offerId: offer.id })}>
                      <span className="reward-icon">{relic.icon}</span>
                      <small>{c.gainRelic} · {relic.rarity === "rare" ? c.rarityRare : c.rarityUncommon}</small>
                      <strong>{locale === "zh" ? relic.name : relic.en}</strong>
                      <p>{locale === "zh" ? relic.rules : relic.rulesEn}</p>
                    </button>
                  );
                }
                const card = CARD_BY_ID[offer.contentId];
                if (!card) return null;
                const upgradedOffer = offer.kind === "upgrade";
                return (
                  <button type="button" className={`reward-option reward-card-option card-${card.category}`} key={offer.id} onClick={() => dispatch({ type: "CHOOSE_REWARD", offerId: offer.id })}>
                    <span className="reward-card-meta">
                      <i>{CATEGORY_META[card.category].icon} {locale === "zh" ? CATEGORY_META[card.category].label : CATEGORY_META[card.category].labelEn}</i>
                      <i>{upgradedOffer ? c.upgradeCard : c.addCard}</i>
                    </span>
                    <strong>{locale === "zh" ? card.name : card.en}</strong>
                    <small>{locale === "zh" ? card.en : card.name}</small>
                    <p>{upgradedOffer ? upgradeDescription(card, locale) : cardRules(card, locale)}</p>
                    <span className="reward-delta">{cardDeltaSummary(card, locale)}</span>
                  </button>
                );
              })}
            </div>
            {game.rewardReason !== "opening" && (
              <button type="button" className="reward-skip" onClick={() => dispatch({ type: "SKIP_REWARD" })}>{c.skipReward}</button>
            )}
          </section>
        </div>
      )}

      {game.phase === "event" && event && (
        <div className="modal-backdrop event-backdrop">
          <section className="event-dialog" role="dialog" aria-modal="true" aria-labelledby="event-title">
            <span className="event-label">{c.randomEvent.toUpperCase()} · {c.remaining.toUpperCase()} {game.resources.days}</span>
            <div className="event-icon" aria-hidden="true">
              {event.icon}
            </div>
            <h2 id="event-title">{eventTitle(event, locale)}</h2>
            <p>{eventDescription(event, locale)}</p>
            <div className="event-choices">
              {event.choices.map((choice) => {
                const playable = canChooseEvent(game, choice);
                return (
                  <button
                    type="button"
                    key={choice.id}
                    disabled={!playable}
                    onClick={() => dispatch({ type: "CHOOSE_EVENT", eventId: event.id, choiceId: choice.id })}
                  >
                    <strong>{eventChoiceText(event, choice, "label", locale)}</strong>
                    <span>{eventChoiceText(event, choice, "hint", locale)}</span>
                    {!playable && <small>{c.notEnough}</small>}
                  </button>
                );
              })}
            </div>
            <small className="event-footnote">{c.eventFootnote}</small>
          </section>
        </div>
      )}

      {game.phase === "ended" && game.ending && (
        <div className="modal-backdrop ending-backdrop">
          <section className="ending-letter" role="dialog" aria-modal="true" aria-labelledby="ending-title">
            <div className="decision-heading">
              <span>DECISION LETTER</span>
              <span>MR-2026-042</span>
            </div>
            <p>Dear Authors,</p>
            <h2 id="ending-title">{locale === "zh" ? game.ending.title : game.ending.titleEn ?? game.ending.title}</h2>
            <p>{locale === "zh" ? game.ending.copy : game.ending.copyEn ?? game.ending.copy}</p>
            <div className={`ending-stamp stamp-${game.ending.id}`}>{game.ending.stamp}</div>
            <div className="ending-score">
              <span>
                <small>{c.finalScore.toUpperCase()}</small>
                <strong>{game.ending.score.toLocaleString()}</strong>
              </span>
              <span>
                <small>{c.comments.toUpperCase()}</small>
                <strong>
                  {game.resolved}/{game.target}
                </strong>
              </span>
              <span>
                <small>{c.risk.toUpperCase()}</small>
                <strong>{game.resources.risk}%</strong>
              </span>
            </div>
            <div className="ending-metrics">
              {METRICS.map((metric) => (
                <span key={metric}>
                  {METRIC_META[metric].short}
                  <b>{game.stats[metric]}</b>
                </span>
              ))}
            </div>
            <div className="ending-flavor">
              <span>{locale === "zh" ? role.name : role.en}</span>
              <span>Seed {game.seed}</span>
              <span>{c.strangest}：{game.runStats.strangestEvent ? eventTitle(EVENT_BY_ID[game.runStats.strangestEvent], locale) : "—"}</span>
            </div>
            {isNewRecord && <div className="new-record">{c.newHigh.toUpperCase()}</div>}
            <div className="ending-actions">
              <button type="button" className="primary-button" onClick={shareResult}>
                {c.share}
              </button>
              <button type="button" className="secondary-button" onClick={copyReport}>
                {copied ? c.copied : c.copyReport}
              </button>
            </div>
            <div className="ending-restart">
              <button type="button" onClick={() => startRun(game.roleId)}>
                {c.retry}
              </button>
              <button type="button" onClick={() => startRun(game.roleId, game.seed)}>
                {c.retrySeed}
              </button>
              <button
                type="button"
                onClick={() => {
                  setGame(null);
                  setScreen("menu");
                }}
              >
                {c.returnHome}
              </button>
            </div>
          </section>
        </div>
      )}

      {helpOpen && <HelpModal locale={locale} onClose={() => setHelpOpen(false)} />}
      <canvas className="share-canvas" ref={canvasRef} aria-hidden="true" />
    </main>
  );
}

function HelpModal({ onClose, locale }: { onClose: () => void; locale: Locale }) {
  const c = UI_COPY[locale];
  return (
    <div className="modal-backdrop help-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="help-dialog" role="dialog" aria-modal="true" aria-labelledby="help-title">
        <button type="button" className="modal-close" onClick={onClose} aria-label={c.help}>
          ×
        </button>
        <p className="eyebrow">HOW TO SURVIVE PEER REVIEW</p>
        <h2 id="help-title">{c.helpTitle}</h2>
        <div className="help-grid">
          <article>
            <span>01</span>
            <h3>{c.readComments}</h3>
            <p>{c.readCommentsBody}</p>
          </article>
          <article>
            <span>02</span>
            <h3>{c.chooseActions}</h3>
            <p>{c.chooseActionsBody}</p>
          </article>
          <article>
            <span>03</span>
            <h3>{c.consequencesTitle}</h3>
            <p>{c.consequencesBody}</p>
          </article>
          <article>
            <span>04</span>
            <h3>{c.defeatRounds}</h3>
            <p>{c.defeatRoundsBody}</p>
          </article>
        </div>
        <div className="shortcut-list">
          <span>
            <kbd>1–6</kbd> {c.selectCard}
          </span>
          <span>
            <kbd>Enter</kbd> {c.playCard}
          </span>
          <span>
            <kbd>E</kbd> {c.endDay}
          </span>
          <span>
            <kbd>L</kbd> {c.showLog}
          </span>
          <span>
            <kbd>?</kbd> {c.help}
          </span>
        </div>
        <button type="button" className="primary-button" onClick={onClose}>
          {c.gotIt}
        </button>
      </section>
    </div>
  );
}
