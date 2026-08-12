"use client";

import { useMemo } from "react";
import { METRICS, METRIC_META, ROLE_BY_ID, ROLES } from "./data";
import { LANGUAGE_OPTIONS, localizedText, roleText } from "./i18n";
import { CAMPAIGN_LENGTHS, DIFFICULTIES, campaignLengthFor, difficultyFor, resolveCampaignConfig } from "./settings";
import type { ManualSaveMetadata, ManualSaveSlot } from "./storage";
import type { GameState, Locale, RunSetup } from "./types";

function t(locale: Locale, zh: string, en: string) {
  return localizedText(locale, zh, en);
}

export function LanguageSelector({ locale, onChange, compact = false }: { locale: Locale; onChange: (locale: Locale) => void; compact?: boolean }) {
  return (
    <select
      className={`language-select ${compact ? "compact-language" : ""}`}
      value={locale}
      onChange={(event) => onChange(event.target.value as Locale)}
      aria-label="Language"
    >
      {LANGUAGE_OPTIONS.map((option) => <option value={option.id} lang={option.lang} key={option.id}>{compact ? option.short : option.label}</option>)}
    </select>
  );
}

export function NewGameSetup({
  locale,
  setup,
  selectedRole,
  seed,
  onSetup,
  onRole,
  onSeed,
  onStart,
  onBack,
  onHelp,
  onLocaleChange,
}: {
  locale: Locale;
  setup: RunSetup;
  selectedRole: string;
  seed: string;
  onSetup: (setup: RunSetup) => void;
  onRole: (roleId: string) => void;
  onSeed: (seed: string) => void;
  onStart: () => void;
  onBack: () => void;
  onHelp: () => void;
  onLocaleChange: (locale: Locale) => void;
}) {
  const role = ROLE_BY_ID[selectedRole] ?? ROLES[0];
  const difficulty = DIFFICULTIES.find((item) => item.id === setup.difficultyId) ?? DIFFICULTIES[2];
  const campaign = resolveCampaignConfig(setup);
  const days = campaign.totalDays;
  const target = campaign.baseTarget;

  return (
    <main className="app-shell setup-shell">
      <div className="desk-grid" aria-hidden="true" />
      <header className="site-header setup-header">
        <button type="button" className="brand-lockup brand-button" onClick={onBack}>
          <span className="brand-mark">R2</span>
          <span><strong>{t(locale, "新投稿配置", "New Submission")}</strong><small>MANUSCRIPT SETUP FORM</small></span>
        </button>
        <div className="header-actions">
          <LanguageSelector locale={locale} onChange={onLocaleChange} />
          <button type="button" className="text-button" onClick={onHelp}>? {t(locale, "玩法帮助", "Help")}</button>
          <button type="button" className="text-button" onClick={onBack}>← {t(locale, "返回主菜单", "Main menu")}</button>
        </div>
      </header>

      <section className="setup-document">
        <aside className="setup-index">
          <p>SUBMISSION FORM · R4</p>
          <h1>{t(locale, "配置你的下一次学术危机", "Configure your next academic crisis")}</h1>
          <ol>
            <li className="is-active"><span>01</span>{t(locale, "论文档案", "Manuscript")}</li>
            <li><span>02</span>{t(locale, "评审强度", "Review intensity")}</li>
            <li><span>03</span>{t(locale, "返修周期", "Revision period")}</li>
            <li><span>04</span>{t(locale, "投稿规则", "Submission rules")}</li>
          </ol>
          <blockquote>
            “{t(locale, "所有模型都是错的，但有些模型能赶上截止日期。", "All models are wrong, but some meet the deadline.")}”
            <cite>— {t(locale, "匿名合作者，凌晨 02:17", "Anonymous coauthor, 02:17")}</cite>
          </blockquote>
        </aside>

        <div className="setup-form">
          <section className="setup-section paper-type-section">
            <div className="setup-section-heading"><span>§1</span><div><h2>{t(locale, "论文类型", "Manuscript archetype")}</h2><p>{t(locale, "二十种论文，二十种被精准攻击的方式。", "Twenty paper types; twenty ways to be precisely criticized.")}</p></div></div>
            <label className="academic-field">
              <span>{t(locale, "选择稿件", "Select manuscript")}</span>
              <select value={role.id} onChange={(event) => onRole(event.target.value)}>
                {ROLES.map((item) => <option value={item.id} key={item.id}>{locale === "zh" ? `${item.name} · ${item.en}` : item.en}</option>)}
              </select>
            </label>
            <article className="selected-paper-card">
              <span className="paper-monogram">{role.symbol}</span>
              <div>
                <small>{role.en}</small>
                <h3>{locale === "zh" ? role.name : role.en}</h3>
                <p>{roleText(role, "pitch", locale)}</p>
                <div className="setup-metrics">{METRICS.map((metric) => <span key={metric}>{METRIC_META[metric].short}<b>{role.stats[metric]}</b></span>)}</div>
              </div>
              <div className="paper-notes">
                <p><b>{t(locale, "被动", "Passive")}</b>{roleText(role, "passive", locale)}</p>
                <p><b>{t(locale, "审稿软肋", "Reviewer target")}</b>{roleText(role, "weakness", locale)}</p>
              </div>
            </article>
          </section>

          <section className="setup-section">
            <div className="setup-section-heading"><span>§2</span><div><h2>{t(locale, "评审强度", "Review intensity")}</h2><p>{t(locale, "越不讲道理，最终分数倍率越高。", "Less reasonable reviews grant a higher score multiplier.")}</p></div></div>
            <div className="difficulty-grid">
              {DIFFICULTIES.map((item, index) => (
                <button type="button" className={`setup-option ${setup.difficultyId === item.id ? "is-selected" : ""}`} onClick={() => onSetup({ ...setup, difficultyId: item.id })} key={item.id}>
                  <span className="option-check">{setup.difficultyId === item.id ? "✓" : index + 1}</span>
                  <strong>{locale === "zh" ? item.name : item.nameEn}</strong>
                  <small>{locale === "zh" ? item.subtitle : item.subtitleEn}</small>
                  <p>{locale === "zh" ? item.description : item.descriptionEn}</p>
                  <i>×{item.scoreMultiplier.toFixed(2)} {t(locale, "分数", "score")}</i>
                </button>
              ))}
            </div>
          </section>

          <section className="setup-section">
            <div className="setup-section-heading"><span>§3</span><div><h2>{t(locale, "返修周期", "Revision period")}</h2><p>{t(locale, "短局更密集，长局能构筑更完整的牌组。", "Short runs are denser; long runs support deeper deckbuilding.")}</p></div></div>
            <div className="duration-grid">
              {CAMPAIGN_LENGTHS.map((item) => (
                <button type="button" className={`duration-option ${setup.lengthId === item.id ? "is-selected" : ""}`} onClick={() => onSetup({ ...setup, lengthId: item.id })} key={item.id}>
                  <strong>{locale === "zh" ? item.name : item.nameEn}</strong>
                  <span>{item.days} {t(locale, "天", "days")} · {item.target} {t(locale, "条意见", "comments")}</span>
                  <small>{locale === "zh" ? item.subtitle : item.subtitleEn} · {item.estimatedMinutes} min</small>
                </button>
              ))}
              <button type="button" className={`duration-option custom-duration ${setup.lengthId === "custom" ? "is-selected" : ""}`} onClick={() => onSetup({ ...setup, lengthId: "custom", customDays: setup.customDays ?? 48, customTarget: setup.customTarget ?? 40, customEventEvery: setup.customEventEvery ?? 2 })}>
                <strong>{t(locale, "自定义审稿合同", "Custom Review Contract")}</strong>
                <span>{t(locale, "自己填写，后果自负", "Specify the terms; own the consequences")}</span>
                <small>CUSTOM</small>
              </button>
            </div>
            {setup.lengthId === "custom" && (
              <div className="custom-fields">
                <label><span>{t(locale, "剩余天数", "Days")}</span><input type="number" min={12} max={120} value={setup.customDays ?? 48} onChange={(event) => onSetup({ ...setup, customDays: Number(event.target.value) })} onBlur={() => onSetup({ ...setup, customDays: campaign.totalDays })} /></label>
                <label><span>{t(locale, "目标意见", "Comment target")}</span><input type="number" min={10} max={100} value={setup.customTarget ?? 40} onChange={(event) => onSetup({ ...setup, customTarget: Number(event.target.value) })} onBlur={() => onSetup({ ...setup, customTarget: campaign.baseTarget })} /></label>
                <label><span>{t(locale, "每几天一个事件", "Days between events")}</span><input type="number" min={1} max={6} value={setup.customEventEvery ?? 2} onChange={(event) => onSetup({ ...setup, customEventEvery: Number(event.target.value) })} onBlur={() => onSetup({ ...setup, customEventEvery: Math.min(6, Math.max(1, Math.round(setup.customEventEvery ?? 2))) })} /></label>
              </div>
            )}
          </section>

          <section className="setup-section rules-section">
            <div className="setup-section-heading"><span>§4</span><div><h2>{t(locale, "投稿规则", "Submission rules")}</h2><p>{t(locale, "签名前请阅读小字。审稿人不会。", "Read the fine print before signing. The reviewer will not.")}</p></div></div>
            <label className={`ironman-switch ${setup.ironman ? "is-on" : ""}`}>
              <input type="checkbox" checked={setup.ironman} onChange={(event) => onSetup({ ...setup, ironman: event.target.checked })} />
              <span className="ironman-mark">{setup.ironman ? "◆" : "◇"}</span>
              <span><strong>{t(locale, "不可撤回投稿（铁人模式）", "Irrevocable Submission (Ironman)")}</strong><small>{t(locale, "保留防崩溃自动存档，但禁用手动存档和回档。荣誉制——毕竟你仍能打开开发者工具。", "Keeps crash-safe autosave, but disables manual saves and rollback. Honor system—you still have developer tools.")}</small></span>
            </label>
            <label className="academic-field seed-field"><span>{t(locale, "随机种子（留空则随机）", "Seed (blank for random)")}</span><input value={seed} inputMode="numeric" placeholder="20260813" onChange={(event) => onSeed(event.target.value.replace(/\D/g, "").slice(0, 10))} /></label>
          </section>

          <footer className="setup-submit-bar">
            <div><small>{t(locale, "投稿摘要", "Submission summary")}</small><strong>{locale === "zh" ? role.name : role.en} · {locale === "zh" ? difficulty.name : difficulty.nameEn} · {days} {t(locale, "天", "days")} / {target} {t(locale, "条", "comments")}</strong></div>
            <button type="button" className="primary-button submit-manuscript-button" onClick={onStart}>{t(locale, "签字并投稿", "Sign & Submit")} <span>→</span></button>
          </footer>
        </div>
      </section>
    </main>
  );
}

export function SaveManagerModal({
  locale,
  mode,
  game,
  saves,
  onClose,
  onSave,
  onLoad,
  onDelete,
}: {
  locale: Locale;
  mode: "save" | "load";
  game: GameState | null;
  saves: ManualSaveMetadata[];
  onClose: () => void;
  onSave: (slot: ManualSaveSlot) => void;
  onLoad: (slot: ManualSaveSlot) => void;
  onDelete: (slot: ManualSaveSlot) => void;
}) {
  const bySlot = useMemo(() => new Map(saves.map((save) => [save.slot, save])), [saves]);
  return (
    <div className="modal-backdrop archive-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="archive-dialog" role="dialog" aria-modal="true" aria-labelledby="archive-title">
        <button type="button" className="modal-close" onClick={onClose}>×</button>
        <p className="eyebrow">LOCAL MANUSCRIPT ARCHIVE</p>
        <h2 id="archive-title">{mode === "save" ? t(locale, "保存当前返修", "Save Current Revision") : t(locale, "读取投稿档案", "Load Submission Archive")}</h2>
        <p>{t(locale, "存档只保存在这台设备的浏览器中，不会上传论文或数据。", "Saves remain in this browser on this device. No manuscript or data is uploaded.")}</p>
        {game?.campaign.ironman && <div className="ironman-warning">◆ {t(locale, "铁人模式禁止手动存档。自动存档仍会防止浏览器崩溃。", "Ironman disables manual saves. Crash-safe autosave remains active.")}</div>}
        <div className="save-slot-grid">
          {([1, 2, 3] as ManualSaveSlot[]).map((slot) => {
            const save = bySlot.get(slot);
            const savedDifficulty = save ? difficultyFor(save.difficultyId) : null;
            const savedLength = save ? campaignLengthFor(save.lengthId) : null;
            return (
              <article className={`save-slot ${save ? "is-occupied" : "is-empty"}`} key={slot}>
                <header><span>ARCHIVE {String(slot).padStart(2, "0")}</span><i>{save ? t(locale, "已归档", "FILED") : t(locale, "空白", "EMPTY")}</i></header>
                {save ? <>
                  <strong>{locale === "zh" ? ROLE_BY_ID[save.roleId]?.name : ROLE_BY_ID[save.roleId]?.en}</strong>
                  <p>{save.resolved}/{save.target} {t(locale, "条意见", "comments")} · {save.daysRemaining} {t(locale, "天剩余", "days left")}</p>
                  <small>{save.ironman ? "◆ IRONMAN · " : ""}{save.lengthId === "custom" ? t(locale, "自定义周期", "Custom campaign") : locale === "zh" ? savedLength?.name : savedLength?.nameEn} · {locale === "zh" ? savedDifficulty?.name : savedDifficulty?.nameEn}</small>
                  <small>{new Date(save.savedAt).toLocaleString(LANGUAGE_OPTIONS.find((option) => option.id === locale)?.lang ?? "en")} · Seed {save.seed}</small>
                </> : <><strong>{t(locale, "尚无稿件", "No manuscript filed")}</strong><p>{t(locale, "这里安静得不像投稿系统。", "Suspiciously quiet for a submission portal.")}</p></>}
                <div className="save-slot-actions">
                  {mode === "save" && <button type="button" disabled={!game || game.campaign.ironman} onClick={() => onSave(slot)}>{save ? t(locale, "覆盖存档", "Overwrite") : t(locale, "保存到此处", "Save here")}</button>}
                  {mode === "load" && <button type="button" disabled={!save} onClick={() => onLoad(slot)}>{t(locale, "读取", "Load")}</button>}
                  {save && <button type="button" className="delete-save" onClick={() => onDelete(slot)}>{t(locale, "删除", "Delete")}</button>}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export function TimelineDrawer({ game, locale, onClose }: { game: GameState; locale: Locale; onClose: () => void }) {
  return (
    <div className="timeline-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="timeline-drawer" aria-label={t(locale, "投稿时间线", "Submission timeline")}>
        <header><div><p className="eyebrow">MANUSCRIPT CHRONOLOGY</p><h2>{t(locale, "投稿时间线", "Submission Timeline")}</h2></div><button type="button" onClick={onClose}>×</button></header>
        <p className="timeline-intro">{t(locale, "这里只记录真正改变投稿命运的节点；每次点击卡牌的挣扎仍留在行动日志里。", "Only events that change the fate of the submission appear here. Every card-sized struggle remains in the action log.")}</p>
        <div className="timeline-list">
          {[...game.timeline].reverse().map((entry) => {
            const elapsed = Math.max(1, entry.turn);
            return <article className={`timeline-entry tone-${entry.tone}`} key={entry.id}>
              <div className="timeline-node"><i>{entry.kind === "event" ? "!" : entry.kind === "decision" ? "✓" : entry.kind === "review" ? "R" : "§"}</i></div>
              <div><small>{t(locale, `第 ${elapsed} 天`, `Day ${elapsed}`)} · {entry.daysRemaining} {t(locale, "天剩余", "days left")}</small><h3>{locale === "zh" ? entry.title : entry.titleEn ?? entry.title}</h3><p>{locale === "zh" ? entry.detail : entry.detailEn ?? entry.detail}</p></div>
            </article>;
          })}
        </div>
      </aside>
    </div>
  );
}

export function PauseModal({ locale, game, onContinue, onSave, onLoad, onTimeline, onHelp, onTitle }: {
  locale: Locale;
  game: GameState;
  onContinue: () => void;
  onSave: () => void;
  onLoad: () => void;
  onTimeline: () => void;
  onHelp: () => void;
  onTitle: () => void;
}) {
  return <div className="modal-backdrop pause-backdrop"><section className="pause-dialog" role="dialog" aria-modal="true">
    <p className="eyebrow">REVISION PAUSED</p><h2>{t(locale, "先把邮件放一会儿", "Leave the email alone for a moment")}</h2>
    <p>{t(locale, `自动存档已记录第 ${game.turn} 天。Reviewer #2 不会因为你打开菜单而停止打字。`, `Autosave has recorded day ${game.turn}. Reviewer #2 does not stop typing while the menu is open.`)}</p>
    <div className="pause-actions">
      <button type="button" className="primary-button" onClick={onContinue}>{t(locale, "继续返修", "Continue revision")}</button>
      <button type="button" onClick={onSave} disabled={game.campaign.ironman}>{game.campaign.ironman ? t(locale, "铁人模式：不可手动存档", "Ironman: manual saves disabled") : t(locale, "保存到档案槽", "Save to archive slot")}</button>
      <button type="button" onClick={onLoad} disabled={game.campaign.ironman}>{game.campaign.ironman ? t(locale, "铁人模式：不可回档", "Ironman: loading disabled") : t(locale, "读取档案槽", "Load an archive slot")}</button>
      <button type="button" onClick={onTimeline}>{t(locale, "查看投稿时间线", "View submission timeline")}</button>
      <button type="button" onClick={onHelp}>{t(locale, "玩法与结局说明", "Rules and endings")}</button>
      <button type="button" className="return-title" onClick={onTitle}>{t(locale, "保存并返回主菜单", "Save & return to title")}</button>
    </div>
  </section></div>;
}
