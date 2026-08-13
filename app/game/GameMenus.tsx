"use client";

import { useEffect, useMemo, useState } from "react";
import { CARDS, COMMENTS, COMMENT_BY_ID, EVENTS, EVENT_BY_ID, METRICS, METRIC_META, RELICS, ROLE_BY_ID, ROLES } from "./data";
import { ENDING_IDS } from "./engine";
import { LANGUAGE_OPTIONS, UI_COPY, eventTitle, localizedText, roleText } from "./i18n";
import { MENU_ILLUSTRATIONS } from "./menuIllustrations";
import { CAMPAIGN_LENGTHS, DIFFICULTIES, campaignLengthFor, difficultyFor, resolveCampaignConfig } from "./settings";
import type { CareerProfile } from "./career";
import type { GamePreferences } from "./preferences";
import type { BestRun, ManualSaveMetadata, ManualSaveSlot } from "./storage";
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

export function PauseModal({ locale, game, onContinue, onSave, onLoad, onTimeline, onHelp, onSettings, onTitle }: {
  locale: Locale;
  game: GameState;
  onContinue: () => void;
  onSave: () => void;
  onLoad: () => void;
  onTimeline: () => void;
  onHelp: () => void;
  onSettings: () => void;
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
      <button type="button" onClick={onHelp}>{t(locale, "研究生生存手册", "Graduate survival manual")}</button>
      <button type="button" onClick={onSettings}>{t(locale, "调整实验室参数", "Tune the laboratory")}</button>
      <button type="button" className="return-title" onClick={onTitle}>{t(locale, "保存并返回主菜单", "Save & return to title")}</button>
    </div>
  </section></div>;
}

export type MainMenuView = "desk" | "archive" | "help" | "settings" | "credits";

const FAILED_ENDINGS = new Set(["desk_reject", "rejected", "burnout", "retracted"]);

function endingLabel(id: string) {
  return id.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function PreferenceToggle({ checked, label, detail, onChange }: { checked: boolean; label: string; detail: string; onChange: (checked: boolean) => void }) {
  return <label className={`preference-toggle ${checked ? "is-on" : ""}`}>
    <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    <span className="preference-switch"><i /></span>
    <span><strong>{label}</strong><small>{detail}</small></span>
  </label>;
}

export function SettingsPanel({ locale, preferences, soundOn, onPreference, onSound, onLocale, onResetPreferences, onExportArchive, onResetArchive }: {
  locale: Locale;
  preferences: GamePreferences;
  soundOn: boolean;
  onPreference: (key: keyof GamePreferences, value: boolean) => void;
  onSound: (value: boolean) => void;
  onLocale: (locale: Locale) => void;
  onResetPreferences?: () => void;
  onExportArchive?: () => void;
  onResetArchive?: () => void;
}) {
  return <section className="menu-document settings-document">
    <header><p className="eyebrow">LABORATORY CONTROL PANEL</p><h2>{t(locale, "调整实验室参数", "Tune the Laboratory")}</h2><p>{t(locale, "这些设置对主菜单和正在进行的返修同时生效。审稿难度仍然不能在中途偷偷修改。", "These preferences affect both the title screen and active revisions. Review difficulty still cannot be quietly changed mid-run.")}</p></header>
    <div className="settings-group">
      <h3>{t(locale, "语言与声音", "Language & sound")}</h3>
      <label className="settings-language"><span>{t(locale, "界面语言", "Interface language")}</span><LanguageSelector locale={locale} onChange={onLocale} /></label>
      <PreferenceToggle checked={soundOn} onChange={onSound} label={t(locale, "实验室音效", "Laboratory sound")} detail={t(locale, "卡牌、盖章和错误提示音。", "Card, stamp, and warning sounds.")} />
    </div>
    <div className="settings-group">
      <h3>{t(locale, "显示与可访问性", "Display & accessibility")}</h3>
      <PreferenceToggle checked={preferences.reducedMotion} onChange={(value) => onPreference("reducedMotion", value)} label={t(locale, "减少动画", "Reduce motion")} detail={t(locale, "关闭纸张飞入、悬浮和环境脉冲。", "Disable paper entrances, hover travel, and ambient pulses.")} />
      <PreferenceToggle checked={preferences.highContrast} onChange={(value) => onPreference("highContrast", value)} label={t(locale, "高对比度批注", "High-contrast annotations")} detail={t(locale, "提高正文、边框和红笔标记的可读性。", "Increase contrast for text, borders, and red annotations.")} />
      <PreferenceToggle checked={preferences.largeText} onChange={(value) => onPreference("largeText", value)} label={t(locale, "放大正文", "Larger reading text")} detail={t(locale, "增大事件、帮助与审稿正文。", "Enlarge event, help, and review copy.")} />
      <PreferenceToggle checked={preferences.paperTexture} onChange={(value) => onPreference("paperTexture", value)} label={t(locale, "论文纸张纹理", "Manuscript paper texture")} detail={t(locale, "保留纸张颗粒和横线。", "Keep paper grain and ruled manuscript lines.")} />
      <PreferenceToggle checked={preferences.ambientGlow} onChange={(value) => onPreference("ambientGlow", value)} label={t(locale, "深夜显示器光晕", "Late-night monitor glow")} detail={t(locale, "主菜单背景的环境灯光。", "Ambient lighting on the title screen.")} />
    </div>
    <div className="settings-group">
      <h3>{t(locale, "操作偏好", "Play preferences")}</h3>
      <PreferenceToggle checked={preferences.compactCards} onChange={(value) => onPreference("compactCards", value)} label={t(locale, "紧凑手牌", "Compact hand")} detail={t(locale, "隐藏卡牌情景句，减少卡牌高度。", "Hide card vignettes and reduce card height.")} />
      <PreferenceToggle checked={preferences.confirmQuestionable} onChange={(value) => onPreference("confirmQuestionable", value)} label={t(locale, "危险操作二次确认", "Confirm questionable actions")} detail={t(locale, "打出调种子、藏结果等危险牌前再问一次。", "Ask once more before seed tuning, hidden results, and similar shortcuts.")} />
    </div>
    <div className="settings-utilities">
      {onResetPreferences && <button type="button" onClick={onResetPreferences}>{t(locale, "恢复默认设置", "Restore defaults")}</button>}
      {onExportArchive && <button type="button" onClick={onExportArchive}>{t(locale, "导出投稿档案", "Export submission archive")}</button>}
      {onResetArchive && <button type="button" className="is-danger" onClick={onResetArchive}>{t(locale, "清空历史与图鉴", "Erase history & discoveries")}</button>}
    </div>
  </section>;
}

function HelpPanel({ locale }: { locale: Locale }) {
  const c = UI_COPY[locale];
  const items = [
    ["01", c.readComments, c.readCommentsBody],
    ["02", c.chooseActions, c.chooseActionsBody],
    ["03", c.consequencesTitle, c.consequencesBody],
    ["04", t(locale, "把意见和卡牌对上", "Match the actual concern"), t(locale, "每条意见包含三条解决路线；只有提供对应能力的卡牌才推进具体步骤。", "Every comment offers three routes. Only cards providing the required capabilities advance its steps.")],
    ["05", t(locale, "经历互动事件", "Live through story events"), t(locale, "先选择处理方法，再做两次现场决定。人物反应结束后才会看到这段经历带来的改变。", "Choose an approach, make two decisions as the scene develops, and learn what changed after the characters respond.")],
    ["06", t(locale, "保存你的返修", "Save the revision"), t(locale, "游戏自动存档，也提供三个手动槽；铁人模式只保留防崩溃存档。", "The game autosaves and provides three manual slots. Ironman keeps crash recovery only.")],
  ];
  return <section className="menu-document help-document"><header><p className="eyebrow">GRADUATE SURVIVAL MANUAL</p><h2>{t(locale, "研究生生存手册", "Graduate Survival Manual")}</h2><p>{t(locale, "这里只有玩法。结局、事件和路线收藏已经搬进投稿档案室。", "Rules only. Endings, events, and route discoveries now live in the Submission Archive.")}</p></header><div className="manual-grid">{items.map(([index, title, detail]) => <article key={index}><span>{index}</span><h3>{title}</h3><p>{detail}</p></article>)}</div><div className="shortcut-strip"><kbd>1–7</kbd>{c.selectCard}<kbd>Enter</kbd>{c.playCard}<kbd>E</kbd>{c.endDay}<kbd>L</kbd>{c.showLog}<kbd>?</kbd>{c.help}</div></section>;
}

function ArchivePanel({ locale, career, saves, best, onLoad }: { locale: Locale; career: CareerProfile; saves: ManualSaveMetadata[]; best: BestRun | null; onLoad: () => void }) {
  const [tab, setTab] = useState<"overview" | "runs" | "discoveries">("overview");
  const completed = career.runs.length;
  const accepted = career.runs.filter((run) => !FAILED_ENDINGS.has(run.endingId)).length;
  const totalCards = career.runs.reduce((sum, run) => sum + run.cardsPlayed, 0);
  const totalEvents = career.runs.reduce((sum, run) => sum + run.eventsCompleted, 0);
  const discoveredRoutes = career.discoveries.routes.map((key) => {
    const splitAt = key.lastIndexOf(":");
    const comment = COMMENT_BY_ID[key.slice(0, splitAt)];
    const route = comment?.routes?.find((item) => item.id === key.slice(splitAt + 1));
    return route ? locale === "zh" ? route.name : route.nameEn : key;
  });
  return <section className="menu-document archive-document">
    <header><div><p className="eyebrow">LOCAL SUBMISSION ARCHIVE</p><h2>{t(locale, "投稿档案室", "Submission Archive")}</h2><p>{t(locale, "这里保存论文的命运，不保存论文文件。所有记录只留在当前浏览器。", "This room stores the fate of manuscripts, not manuscript files. Everything remains in this browser.")}</p></div><button type="button" className="archive-load-button" disabled={saves.length === 0} onClick={onLoad}>{t(locale, `读取返修存档 · ${saves.length}/3`, `Load active revision · ${saves.length}/3`)}</button></header>
    <nav className="archive-tabs"><button className={tab === "overview" ? "is-active" : ""} onClick={() => setTab("overview")}>{t(locale, "生涯统计", "Career")}</button><button className={tab === "runs" ? "is-active" : ""} onClick={() => setTab("runs")}>{t(locale, "历史战役", "Past runs")}</button><button className={tab === "discoveries" ? "is-active" : ""} onClick={() => setTab("discoveries")}>{t(locale, "研究图鉴", "Discoveries")}</button></nav>
    {tab === "overview" && <><div className="career-stat-grid">
      <article><small>{t(locale, "完成投稿", "Completed runs")}</small><strong>{completed}</strong><span>{accepted} {t(locale, "次活着离开", "survived")}</span></article>
      <article><small>{t(locale, "最高分", "Best score")}</small><strong>{best?.score.toLocaleString() ?? "—"}</strong><span>{best ? `Seed ${best.seed}` : t(locale, "档案柜还很空", "The cabinet is still empty")}</span></article>
      <article><small>{t(locale, "打出行动卡", "Cards played")}</small><strong>{totalCards}</strong><span>{t(locale, "每一张都写进了回复信", "every one entered the rebuttal")}</span></article>
      <article><small>{t(locale, "处理事件", "Events handled")}</small><strong>{totalEvents}</strong><span>{t(locale, "服务器仍未道歉", "the server has not apologized")}</span></article>
    </div><div className="archive-progress-list">
      <p><span>{t(locale, "结局档案", "Endings")}</span><b>{career.discoveries.endings.length}/{ENDING_IDS.length}</b><i style={{ width: `${career.discoveries.endings.length / ENDING_IDS.length * 100}%` }} /></p>
      <p><span>{t(locale, "事件记录", "Events")}</span><b>{career.discoveries.events.length}/{EVENTS.length}</b><i style={{ width: `${career.discoveries.events.length / EVENTS.length * 100}%` }} /></p>
      <p><span>{t(locale, "解决路线", "Response routes")}</span><b>{career.discoveries.routes.length}/{COMMENTS.length * 3}</b><i style={{ width: `${career.discoveries.routes.length / (COMMENTS.length * 3) * 100}%` }} /></p>
      <p><span>{t(locale, "行动卡", "Action cards")}</span><b>{career.discoveries.cards.length}/{CARDS.length}</b><i style={{ width: `${career.discoveries.cards.length / CARDS.length * 100}%` }} /></p>
    </div></>}
    {tab === "runs" && <div className="career-run-list">{career.runs.length === 0 ? <div className="empty-archive"><b>∅</b><h3>{t(locale, "还没有归档的 Decision Letter", "No decision letters filed yet")}</h3><p>{t(locale, "完成第一局后，论文会自动装订并送到这里。", "Finish a run and its manuscript will be bound and placed here.")}</p></div> : career.runs.map((run) => <article key={run.id}><div className="run-spine"><i>{run.stamp}</i><small>{new Date(run.finishedAt).toLocaleDateString()}</small></div><div><small>{ROLE_BY_ID[run.roleId]?.en} · Seed {run.seed}</small><h3>{locale === "zh" ? run.endingTitle : run.endingTitleEn}</h3><p>{run.resolved}/{run.target} {t(locale, "条意见", "comments")} · {run.eventsCompleted} {t(locale, "个事件", "events")} · Risk {run.finalRisk}%</p></div><strong>{run.score.toLocaleString()}</strong></article>)}</div>}
    {tab === "discoveries" && <div className="discovery-sections">
      <section><h3>{t(locale, "结局档案", "Decision letters")}</h3><div className="ending-cabinet">{ENDING_IDS.map((id, index) => { const unlocked = career.discoveries.endings.includes(id); return <span className={unlocked ? "is-unlocked" : ""} key={id}><b>{unlocked ? endingLabel(id) : "REDACTED"}</b><small>{unlocked ? `FILE ${String(index + 1).padStart(2, "0")}` : "? ? ?"}</small></span>; })}</div></section>
      <section><h3>{t(locale, "最近发现的事件", "Recently discovered events")}</h3><div className="discovery-tags">{career.discoveries.events.slice(-14).reverse().map((id) => <span key={id}>{eventTitle(EVENT_BY_ID[id], locale)}</span>)}{career.discoveries.events.length === 0 && <em>{t(locale, "第一场危机正在路上。", "The first crisis is already on its way.")}</em>}</div></section>
      <section><h3>{t(locale, "走过的解决路线", "Response routes taken")}</h3><div className="discovery-tags">{discoveredRoutes.slice(-18).reverse().map((name, index) => <span key={`${name}:${index}`}>{name}</span>)}{discoveredRoutes.length === 0 && <em>{t(locale, "尚未留下路线记录。", "No route has entered the record.")}</em>}</div></section>
      <section className="collection-summary"><span>{career.discoveries.roles.length}/{ROLES.length} {t(locale, "论文类型", "paper types")}</span><span>{career.discoveries.relics.length}/{RELICS.length} {t(locale, "遗物", "relics")}</span><span>{career.discoveries.comments.length}/{COMMENTS.length} {t(locale, "审稿意见", "comments")}</span></section>
    </div>}
  </section>;
}

function CreditsPanel({ locale }: { locale: Locale }) {
  return <section className="menu-document credits-document"><header><p className="eyebrow">AUTHORS & ACKNOWLEDGEMENTS</p><h2>{t(locale, "作者与致谢", "Authors & Acknowledgements")}</h2><p>{t(locale, "献给所有在截止日期前发现最后一个实验其实跑错了的人。", "For everyone who discovered, just before the deadline, that the final experiment used the wrong split.")}</p></header><div className="credit-paper"><p>Reviewer #2: Major Revision</p><h3>{t(locale, "一款学术生存卡牌 Roguelike", "An academic-survival deckbuilding roguelike")}</h3><dl><div><dt>{t(locale, "制作与维护", "Created & maintained by")}</dt><dd>Voyager0057</dd></div><div><dt>{t(locale, "代码与反馈", "Source & feedback")}</dt><dd><a href="https://github.com/Voyager0057/reviewer-2-major-revision" target="_blank" rel="noreferrer">GitHub Repository</a> · <a href="https://github.com/Voyager0057/reviewer-2-major-revision/issues" target="_blank" rel="noreferrer">Issue Tracker</a></dd></div><div><dt>{t(locale, "特别感谢", "Special thanks")}</dt><dd>{t(locale, "深夜 GPU 队列、失控的 LaTeX 表格，以及那句永恒的 Looks good to me。", "Late-night GPU queues, unruly LaTeX tables, and the immortal phrase “Looks good to me.”")}</dd></div></dl><pre>{`@game{reviewer2_major_revision,\n  title = {Reviewer #2: Major Revision},\n  note = {No reviewers were satisfied during development}\n}`}</pre></div></section>;
}

export function MainMenu({ locale, view, savedRun, saves, career, best, soundOn, preferences, exitNotice, onView, onContinue, onNew, onLoad, onHelp, onSettings, onExit, onLocale, onSound, onPreference, onResetPreferences, onExportArchive, onResetArchive }: {
  locale: Locale;
  view: MainMenuView;
  savedRun: GameState | null;
  saves: ManualSaveMetadata[];
  career: CareerProfile;
  best: BestRun | null;
  soundOn: boolean;
  preferences: GamePreferences;
  exitNotice: boolean;
  onView: (view: MainMenuView) => void;
  onContinue: () => void;
  onNew: () => void;
  onLoad: () => void;
  onHelp: () => void;
  onSettings: () => void;
  onExit: () => void;
  onLocale: (locale: Locale) => void;
  onSound: (value: boolean) => void;
  onPreference: (key: keyof GamePreferences, value: boolean) => void;
  onResetPreferences: () => void;
  onExportArchive: () => void;
  onResetArchive: () => void;
}) {
  const [heroSlide, setHeroSlide] = useState(0);
  const [heroPaused, setHeroPaused] = useState(false);
  useEffect(() => {
    if (view !== "desk" || heroPaused || preferences.reducedMotion) return;
    const timer = window.setInterval(() => setHeroSlide((current) => (current + 1) % MENU_ILLUSTRATIONS.length), 8000);
    return () => window.clearInterval(timer);
  }, [heroPaused, preferences.reducedMotion, view]);
  const activeIllustration = MENU_ILLUSTRATIONS[heroSlide];
  const nav = [
    { id: "continue", icon: "▶", label: t(locale, "继续抢救论文", "Continue the Revision"), detail: savedRun ? t(locale, `还剩 ${savedRun.resources.days} 天`, `${savedRun.resources.days} days remain`) : t(locale, "暂无自动存档", "No autosave on file"), action: onContinue, disabled: !savedRun },
    { id: "new", icon: "+", label: t(locale, "再投一篇试试", "Submit Another Paper"), detail: t(locale, "配置一场新的学术危机", "Configure a new academic crisis"), action: onNew },
    { id: "archive", icon: "▤", label: t(locale, "投稿档案室", "Submission Archive"), detail: t(locale, `${career.runs.length} 局历史 · ${career.discoveries.endings.length} 个结局`, `${career.runs.length} runs · ${career.discoveries.endings.length} endings`), action: () => onView("archive") },
    { id: "help", icon: "?", label: t(locale, "研究生生存手册", "Graduate Survival Manual"), detail: t(locale, "只讲怎么活下来", "Rules for staying alive"), action: onHelp },
    { id: "settings", icon: "⌘", label: t(locale, "调整实验室参数", "Tune the Laboratory"), detail: t(locale, "显示、声音与操作偏好", "Display, sound, and play preferences"), action: onSettings },
    { id: "credits", icon: "§", label: t(locale, "作者与致谢", "Authors & Acknowledgements"), detail: t(locale, "联系方式与特别感谢", "Contact and special thanks"), action: () => onView("credits") },
    { id: "exit", icon: "☾", label: t(locale, "今天先到这里", "Leave the Lab"), detail: t(locale, "保存，然后关灯", "Save, then turn out the lights"), action: onExit },
  ];
  return <main className={`app-shell title-menu-shell view-${view}`} id="main-menu">
    <div className="title-ambient" aria-hidden="true" />
    <aside className="title-menu-sidebar">
      <button type="button" className="title-brand" onClick={() => onView("desk")}><span>R2</span><strong>Reviewer #2<small>MAJOR REVISION</small></strong></button>
      <nav>{nav.map((item) => <button type="button" key={item.id} disabled={item.disabled} className={(view === item.id || (view === "desk" && item.id === (savedRun ? "continue" : "new"))) ? "is-active" : ""} onClick={item.action}><i>{item.icon}</i><span><strong>{item.label}</strong><small>{item.detail}</small></span></button>)}</nav>
      <footer><LanguageSelector locale={locale} onChange={onLocale} compact /><span>v4.1 · ARCHIVE UPDATE</span></footer>
    </aside>
    <section className="title-menu-content">
      {view === "desk" && <div className="lab-hero">
        <div className="menu-illustration-reel" aria-hidden="true">
          {MENU_ILLUSTRATIONS.map((illustration, index) => <img src={illustration.src} className={index === heroSlide ? "is-active" : ""} alt="" key={illustration.id} />)}
        </div>
        <div className="menu-scene-caption" aria-live="polite">
          <small>{activeIllustration.kicker}</small>
          <strong>{locale === "zh" ? activeIllustration.title : activeIllustration.titleEn}</strong>
          <span>{locale === "zh" ? activeIllustration.caption : activeIllustration.captionEn}</span>
        </div>
        <div className="menu-reel-controls" aria-label={t(locale, "主菜单场景", "Title-screen scenes")}>
          <button type="button" className="reel-step" onClick={() => setHeroSlide((heroSlide + MENU_ILLUSTRATIONS.length - 1) % MENU_ILLUSTRATIONS.length)} aria-label={t(locale, "上一幕", "Previous scene")}>←</button>
          <div>{MENU_ILLUSTRATIONS.map((illustration, index) => <button type="button" className={index === heroSlide ? "is-active" : ""} onClick={() => setHeroSlide(index)} aria-label={`${t(locale, "场景", "Scene")} ${index + 1}`} key={illustration.id}><i /></button>)}</div>
          <button type="button" onClick={() => setHeroPaused((paused) => !paused)} aria-label={heroPaused ? t(locale, "继续轮播", "Resume slideshow") : t(locale, "暂停轮播", "Pause slideshow")}>{heroPaused ? "▶" : "Ⅱ"}</button>
          <button type="button" className="reel-step" onClick={() => setHeroSlide((heroSlide + 1) % MENU_ILLUSTRATIONS.length)} aria-label={t(locale, "下一幕", "Next scene")}>→</button>
        </div>
        <div className="hero-docket"><p className="eyebrow">ACADEMIC SURVIVAL DECKBUILDER</p><h1>{savedRun ? t(locale, "返修还没有结束。", "The revision is still alive.") : t(locale, "论文能不能收，先看你能不能活到截止日。", "Before the paper survives review, survive the deadline.")}</h1><p>{savedRun ? t(locale, `自动存档停在第 ${savedRun.turn} 天：已解决 ${savedRun.resolved}/${savedRun.target} 条意见，Reviewer #2 仍在输入。`, `Autosave waits on day ${savedRun.turn}: ${savedRun.resolved}/${savedRun.target} comments resolved, and Reviewer #2 is still typing.`) : t(locale, "有限的 GPU、无限的审稿意见，以及一套会记住每次失败的投稿档案。", "Finite GPUs, infinite reviewer comments, and a submission archive that remembers every failure.")}</p><div className="hero-stat-row"><span><small>{t(locale, "最高分", "High score")}</small><strong>{best?.score.toLocaleString() ?? "—"}</strong></span><span><small>{t(locale, "已发现事件", "Events found")}</small><strong>{career.discoveries.events.length}/{EVENTS.length}</strong></span><span><small>{t(locale, "结局档案", "Endings filed")}</small><strong>{career.discoveries.endings.length}/{ENDING_IDS.length}</strong></span></div></div>
        {exitNotice && <div className="lights-out-note"><b>{t(locale, "灯已经关了。", "The lab lights are off.")}</b><span>{t(locale, "自动存档已完成，现在可以安心关闭标签页。", "Autosave is complete. It is safe to close this tab.")}</span></div>}
      </div>}
      {view === "archive" && <ArchivePanel locale={locale} career={career} saves={saves} best={best} onLoad={onLoad} />}
      {view === "help" && <HelpPanel locale={locale} />}
      {view === "settings" && <SettingsPanel locale={locale} preferences={preferences} soundOn={soundOn} onPreference={onPreference} onSound={onSound} onLocale={onLocale} onResetPreferences={onResetPreferences} onExportArchive={onExportArchive} onResetArchive={onResetArchive} />}
      {view === "credits" && <CreditsPanel locale={locale} />}
    </section>
  </main>;
}
