import type { CardDef, CommentDef, EventChoice, EventDef, Locale, RoleDef } from "./types";

const BASE_UI_COPY = {
  zh: {
    home: "Reviewer #2 首页", soundOff: "关闭声音", soundOn: "开启声音", help: "打开玩法说明",
    coverAbstract: "一款关于有限 GPU、无限意见，以及在截止日期前保持科研诚信的卡牌 Roguelike。",
    runTime: "12–150 分钟可选战役", browserPlay: "浏览器即玩", localSave: "自动存档 + 3 个手动槽",
    menuTitle: "论文能不能收，先看你能不能活到截止日。",
    menuDescription: "从精简牌组起步，在评审途中选择新卡、升级行动、收集遗物并承受持续状态。正规操作会慢慢变强，危险捷径会让数字立刻好看——直到撤稿风险追上你。",
    start: "开始完整投稿战役", continue: "继续 Revision", daysLeft: "天", localHigh: "本地最高分", mayMeet: "行动卡池", hiddenBoss: "528 张卡", dangerous: "互动故事池", consequences: "256 个事件",
    tagline: "5 档难度、6 种周期、16 个结局；每次投稿都有不同的故事。", version: "v4.1 · The Archive Update",
    selectManuscript: "选择论文流派", chooseManuscript: "选择你的论文", back: "返回", roleHeading: "每种论文都有优势。Reviewer #2 会找到它的弱点。", currentChoice: "当前选择", submit: "以此论文投稿",
    passive: "被动", weakness: "弱点", funding: "经费", mental: "精神", remaining: "剩余", focus: "专注", log: "打开行动记录",
    currentBoss: "当前 Boss", resolved: "已解决意见", escalations: "追加次数", yourPaper: "你的论文", hideLog: "收起记录", viewLog: "查看行动记录", actionLog: "行动记录",
    round: "轮次", major: "严重", concern: "关注", comment: "意见", original: "审稿原文", translation: "中文译文", gameplay: "规则解读",
    primary: "主要求", secondary: "次要求", severity: "严重度", responseProgress: "路线进度", delayed: "回合：步骤标准已上升。", exactHint: "只有能力匹配的行动才会推进路线步骤；精准填满可返还专注。",
    ready: "准备执行", riskExecute: "承担风险并执行", execute: "执行行动", selectHint: "先选择解决路线，再从手牌寻找能推进具体步骤的行动。",
    manuscript: "论文状态", mentalState: "精神状态", risk: "撤稿风险", riskTitle: "达到 100% 会立即失败", riskLow: "研究记录尚且干净。", riskMid: "短期数字变好，审计压力正在积累。", riskHigh: "高风险：复现与审计意见会更难。", endDay: "结束今天",
    today: "今日行动", cardHint: "点击选牌，再执行", deck: "牌库", discard: "弃牌", exhausted: "本日耗尽", response: "回应", emptyHand: "手牌已空", notEnough: "资源不足",
    tutorialTitle: "4 步上手", tutorial: "读意见 → 选解决路线 → 找能力匹配卡 → 完成全部步骤", closeTutorial: "关闭教程",
    randomEvent: "互动事件",
    finalScore: "最终分数", comments: "意见", strangest: "最离谱事件", newHigh: "新的本地最高分", share: "下载 / 分享结局卡", copied: "已复制", copyReport: "复制战报", retry: "再投一次", retrySeed: "相同 Seed 重试", returnHome: "返回首页",
    rewardTitle: "修改获得新方向", rewardStage: "阶段奖励：选择一件遗物", rewardCard: "构筑奖励：加入新卡或升级旧卡", chooseOne: "三选一，本次选择会改变后续牌组。", addCard: "加入牌组", upgradeCard: "升级卡牌", gainRelic: "获得遗物", skipReward: "跳过并回复 2 精神", upgraded: "已升级", rarityCommon: "普通", rarityUncommon: "进阶", rarityRare: "稀有",
    activeEffects: "本局效果", relics: "遗物", noRelics: "尚未获得遗物", caffeine: "咖啡因", insight: "洞见", technicalDebt: "技术债", reviewerFavor: "审稿人好感", pageDebt: "版面债",
    keywordMatch: "命中", combo: "连锁", retain: "保留", exhaust: "耗尽", questionable: "危险", upgradedMark: "升级",
    helpTitle: "活到 Decision Letter", readComments: "拆解意见", readCommentsBody: "每条意见有三条解决路线，每条路线包含明确能力步骤。离题卡不会再造成通用伤害。", chooseActions: "构筑行动", chooseActionsBody: "每解决四条意见会获得新卡或升级；跨过评审阶段会获得遗物。定向检索可用 1 专注换取相关卡。", consequencesTitle: "承担后果", consequencesBody: "拖延会掉精神并提高步骤标准；风险达到 100% 会立即撤稿。", defeatRounds: "制造连锁", defeatRoundsBody: "严谨→实验、实验→写作等组合会强化已匹配的步骤；状态与遗物会继续改变规则。", selectCard: "选牌", playCard: "执行", showLog: "日志", gotIt: "我已阅读审稿意见",
  },
  en: {
    home: "Reviewer #2 home", soundOff: "Mute sound", soundOn: "Enable sound", help: "Open game guide",
    coverAbstract: "A card roguelike about finite GPUs, infinite reviewer comments, and keeping your research integrity before the deadline.",
    runTime: "12–150 minute campaigns", browserPlay: "Play in browser", localSave: "Autosave + 3 manual slots",
    menuTitle: "Before the paper survives review, you have to survive the deadline.",
    menuDescription: "Start with a focused deck, draft new cards, upgrade actions, collect relics, and manage persistent conditions. Honest work compounds slowly. Questionable shortcuts look brilliant—until Retraction Risk catches up.",
    start: "Begin Full Submission Campaign", continue: "Continue Revision", daysLeft: "days", localHigh: "Local high score", mayMeet: "Action card pool", hiddenBoss: "528 cards", dangerous: "Interactive story pool", consequences: "256 events",
    tagline: "5 difficulties, 6 campaign lengths, and 16 endings. Every submission tells a different story.", version: "v4.1 · The Archive Update",
    selectManuscript: "Select a Paper Archetype", chooseManuscript: "Choose your manuscript", back: "Back", roleHeading: "Every paper has strengths. Reviewer #2 will find the weakness.", currentChoice: "Current choice", submit: "Submit this manuscript",
    passive: "Passive", weakness: "Weakness", funding: "Funding", mental: "Mental", remaining: "Days", focus: "Focus", log: "Open action log",
    currentBoss: "Current Boss", resolved: "Comments resolved", escalations: "Escalations", yourPaper: "Your paper", hideLog: "Hide action log", viewLog: "View action log", actionLog: "Action log",
    round: "Round", major: "Major", concern: "Concern", comment: "Comment", original: "Original comment", translation: "Translation", gameplay: "Gameplay note",
    primary: "Primary", secondary: "Secondary", severity: "Severity", responseProgress: "Route progress", delayed: "turn(s): step standards have increased.", exactHint: "Only capability-matched actions advance route steps. A precise reply refunds Focus.",
    ready: "Ready to play", riskExecute: "Accept risk and play", execute: "Play card", selectHint: "Choose a resolution route, then find actions that advance its specific steps.",
    manuscript: "Manuscript status", mentalState: "Mental Health", risk: "Retraction Risk", riskTitle: "Reaching 100% immediately ends the run", riskLow: "The research record is still clean.", riskMid: "Short-term numbers improve while audit pressure accumulates.", riskHigh: "High risk: audit and reproducibility comments become harder.", endDay: "End Day",
    today: "Today's actions", cardHint: "Select a card, then play it", deck: "Deck", discard: "Discard", exhausted: "Exhausted today", response: "Response", emptyHand: "Your hand is empty", notEnough: "Not enough resources",
    tutorialTitle: "4 quick steps", tutorial: "Read the issue → choose a route → match capabilities → complete every step", closeTutorial: "Close tutorial",
    randomEvent: "Interactive Event",
    finalScore: "Final Score", comments: "Comments", strangest: "Strangest event", newHigh: "New Local High Score", share: "Download / Share Result Card", copied: "Copied", copyReport: "Copy Run Report", retry: "Submit Again", retrySeed: "Retry Same Seed", returnHome: "Return Home",
    rewardTitle: "The Revision Opens a New Direction", rewardStage: "Stage reward: choose one relic", rewardCard: "Deck reward: add a card or upgrade one", chooseOne: "Choose one. It will shape the rest of this run.", addCard: "Add to deck", upgradeCard: "Upgrade card", gainRelic: "Take relic", skipReward: "Skip and restore 2 Mental", upgraded: "Upgraded", rarityCommon: "Common", rarityUncommon: "Uncommon", rarityRare: "Rare",
    activeEffects: "Run effects", relics: "Relics", noRelics: "No relics yet", caffeine: "Caffeine", insight: "Insight", technicalDebt: "Technical Debt", reviewerFavor: "Reviewer Favor", pageDebt: "Page Debt",
    keywordMatch: "Match", combo: "Combo", retain: "Retain", exhaust: "Exhaust", questionable: "Questionable", upgradedMark: "Upgraded",
    helpTitle: "Survive to the Decision Letter", readComments: "Decompose the issue", readCommentsBody: "Every comment has three routes with explicit capability steps. Off-topic cards no longer deal generic damage.", chooseActions: "Build your deck", chooseActionsBody: "Every four resolved comments grants a card or upgrade; stage clears grant relics. Targeted research trades 1 Focus for a relevant card.", consequencesTitle: "Own the consequences", consequencesBody: "Delays cost Mental Health and raise step standards. At 100% Risk, the paper is withdrawn.", defeatRounds: "Create combos", defeatRoundsBody: "Sequences such as Rigor → Experiment or Experiment → Writing strengthen matched steps. Conditions and relics keep changing the rules.", selectCard: "Select card", playCard: "Play", showLog: "Log", gotIt: "I have read the reviewer comments",
  },
};

type ExtraLocale = Exclude<Locale, "en" | "zh">;
type UIKey = keyof typeof BASE_UI_COPY.en;

const EXTRA_UI_COPY: Record<ExtraLocale, Partial<Record<UIKey, string>>> = {
  ja: {
    home: "Reviewer #2 ホーム", soundOff: "サウンドをミュート", soundOn: "サウンドを有効化", help: "ゲームガイドを開く",
    coverAbstract: "有限のGPU、無限の査読コメント、締切前の研究公正をめぐるカード・ローグライク。",
    runTime: "12～150分のキャンペーン", browserPlay: "ブラウザですぐ遊べる", localSave: "自動保存＋手動3スロット",
    menuTitle: "論文が査読を生き延びる前に、あなたが締切を生き延びなければならない。",
    menuDescription: "小さなデッキから始め、カードを獲得・強化し、遺物と継続効果を管理します。誠実な研究はゆっくり積み上がり、危険な近道は撤回リスクとなって戻ってきます。",
    continue: "修正を続ける", daysLeft: "日", localHigh: "ローカル最高得点", mayMeet: "アクションカード", dangerous: "インタラクティブ物語",
    tagline: "難易度5段階、期間6種類、エンディング16種。投稿ごとに異なる物語。",
    funding: "研究費", mental: "メンタル", remaining: "残り", focus: "集中力", log: "行動ログを開く",
    currentBoss: "現在のボス", resolved: "解決済みコメント", escalations: "追加要求", yourPaper: "あなたの論文", hideLog: "ログを閉じる", viewLog: "ログを見る", actionLog: "行動ログ",
    round: "ラウンド", major: "重大", concern: "懸念", comment: "コメント", original: "原文", translation: "翻訳", gameplay: "ゲーム解説",
    primary: "主要求", secondary: "副要求", severity: "深刻度", responseProgress: "対応ルート", delayed: "ターン遅延：基準が上昇しました。", exactHint: "能力が一致する行動だけが手順を進めます。正確な回答は集中力を返還します。",
    ready: "実行準備", riskExecute: "リスクを受け入れて実行", execute: "カードを使う", selectHint: "対応ルートを選び、必要な能力を持つカードを探してください。",
    manuscript: "論文ステータス", mentalState: "メンタルヘルス", risk: "撤回リスク", riskTitle: "100%で即座に失敗", riskLow: "研究記録はまだクリーンです。", riskMid: "短期的な数字とともに監査圧力が上昇中。", riskHigh: "高リスク：監査と再現性の要求が厳しくなります。", endDay: "一日を終える",
    today: "今日の行動", cardHint: "カードを選んで実行", deck: "山札", discard: "捨て札", exhausted: "本日の消耗", response: "対応", emptyHand: "手札がありません", notEnough: "リソース不足",
    tutorialTitle: "4ステップ", tutorial: "問題を読む → ルート選択 → 能力を合わせる → 全手順を完了", closeTutorial: "チュートリアルを閉じる",
    randomEvent: "インタラクティブイベント",
    finalScore: "最終スコア", comments: "コメント", strangest: "最も奇妙な事件", newHigh: "ローカル新記録", share: "結果カードを保存／共有", copied: "コピー済み", copyReport: "戦績をコピー", retry: "もう一度投稿", retrySeed: "同じSeedで再挑戦", returnHome: "ホームへ戻る",
    rewardTitle: "修正から新しい研究方針が生まれた", rewardStage: "ステージ報酬：遺物を1つ選択", rewardCard: "デッキ報酬：カード追加または強化", chooseOne: "1つ選択してください。以後の戦略が変化します。", addCard: "デッキに追加", upgradeCard: "カード強化", gainRelic: "遺物を獲得", skipReward: "スキップしてメンタルを2回復", upgraded: "強化済み", rarityCommon: "一般", rarityUncommon: "上級", rarityRare: "希少",
    activeEffects: "進行中の効果", relics: "遺物", noRelics: "遺物なし", caffeine: "カフェイン", insight: "洞察", technicalDebt: "技術的負債", reviewerFavor: "査読者の好感", pageDebt: "ページ超過",
    keywordMatch: "一致", combo: "コンボ", retain: "保持", exhaust: "消耗", questionable: "危険", upgradedMark: "強化",
    helpTitle: "Decision Letterまで生き残る", readComments: "コメントを分解", readCommentsBody: "各コメントには、必要能力が明示された3つの対応ルートがあります。無関係なカードでは進みません。", chooseActions: "デッキを構築", chooseActionsBody: "コメント4件ごとにカード追加または強化。ステージ突破で遺物を獲得します。", consequencesTitle: "結果を引き受ける", consequencesBody: "遅延はメンタルを削り基準を上げます。リスク100%で論文は撤回されます。", defeatRounds: "コンボを作る", defeatRoundsBody: "厳密性→実験、実験→執筆などの連鎖で一致した手順を強化できます。", selectCard: "カード選択", playCard: "実行", showLog: "ログ", gotIt: "査読コメントを確認しました",
  },
  ko: {
    home: "Reviewer #2 홈", soundOff: "소리 끄기", soundOn: "소리 켜기", help: "게임 도움말 열기",
    coverAbstract: "한정된 GPU, 끝없는 심사 의견, 마감 전 연구 윤리를 다루는 카드 로그라이크.",
    runTime: "12~150분 캠페인", browserPlay: "브라우저에서 바로 플레이", localSave: "자동 저장 + 수동 슬롯 3개",
    menuTitle: "논문이 심사를 통과하기 전에, 당신이 마감일까지 살아남아야 합니다.",
    menuDescription: "작은 덱으로 시작해 카드를 획득하고 강화하며 유물과 지속 효과를 관리하세요. 정직한 연구는 천천히 쌓이고, 위험한 지름길은 철회 위험으로 돌아옵니다.",
    continue: "수정 계속하기", daysLeft: "일", localHigh: "로컬 최고 점수", mayMeet: "행동 카드", dangerous: "인터랙티브 스토리",
    tagline: "난이도 5단계, 기간 6종, 결말 16종. 투고마다 다른 이야기가 펼쳐집니다.",
    funding: "연구비", mental: "정신력", remaining: "남은 기간", focus: "집중력", log: "행동 기록 열기",
    currentBoss: "현재 보스", resolved: "해결한 의견", escalations: "추가 요구", yourPaper: "내 논문", hideLog: "기록 닫기", viewLog: "기록 보기", actionLog: "행동 기록",
    round: "라운드", major: "중대", concern: "우려", comment: "의견", original: "원문", translation: "번역", gameplay: "게임 설명",
    primary: "주요 요구", secondary: "보조 요구", severity: "심각도", responseProgress: "대응 경로", delayed: "턴 지연: 기준이 상승했습니다.", exactHint: "능력이 일치하는 행동만 단계를 진행합니다. 정확한 답변은 집중력을 돌려줍니다.",
    ready: "실행 준비", riskExecute: "위험을 감수하고 실행", execute: "카드 사용", selectHint: "대응 경로를 고르고 필요한 능력의 카드를 찾으세요.",
    manuscript: "논문 상태", mentalState: "정신 건강", risk: "철회 위험", riskTitle: "100%가 되면 즉시 실패", riskLow: "연구 기록은 아직 깨끗합니다.", riskMid: "단기 성과와 함께 감사 압력이 쌓입니다.", riskHigh: "고위험: 감사와 재현성 요구가 더 어려워집니다.", endDay: "하루 종료",
    today: "오늘의 행동", cardHint: "카드를 선택한 뒤 사용", deck: "덱", discard: "버린 카드", exhausted: "오늘 소진", response: "대응", emptyHand: "손에 카드가 없습니다", notEnough: "자원 부족",
    tutorialTitle: "4단계 시작", tutorial: "의견 읽기 → 경로 선택 → 능력 맞추기 → 모든 단계 완료", closeTutorial: "튜토리얼 닫기",
    randomEvent: "인터랙티브 이벤트",
    finalScore: "최종 점수", comments: "의견", strangest: "가장 이상한 사건", newHigh: "새 로컬 최고 기록", share: "결과 카드 저장／공유", copied: "복사됨", copyReport: "전적 복사", retry: "다시 투고", retrySeed: "같은 Seed 재도전", returnHome: "홈으로",
    rewardTitle: "수정에서 새로운 연구 방향이 열렸습니다", rewardStage: "단계 보상: 유물 하나 선택", rewardCard: "덱 보상: 카드 추가 또는 강화", chooseOne: "하나를 선택하세요. 이후 전략이 달라집니다.", addCard: "덱에 추가", upgradeCard: "카드 강화", gainRelic: "유물 획득", skipReward: "건너뛰고 정신력 2 회복", upgraded: "강화됨", rarityCommon: "일반", rarityUncommon: "고급", rarityRare: "희귀",
    activeEffects: "진행 효과", relics: "유물", noRelics: "유물 없음", caffeine: "카페인", insight: "통찰", technicalDebt: "기술 부채", reviewerFavor: "심사자 호감", pageDebt: "페이지 초과",
    keywordMatch: "일치", combo: "콤보", retain: "유지", exhaust: "소진", questionable: "위험", upgradedMark: "강화",
    helpTitle: "Decision Letter까지 살아남기", readComments: "의견 분해", readCommentsBody: "각 의견에는 필요한 능력이 명시된 세 가지 대응 경로가 있습니다. 관련 없는 카드는 진행되지 않습니다.", chooseActions: "덱 구성", chooseActionsBody: "의견 네 개마다 카드 추가 또는 강화, 단계 통과 시 유물을 얻습니다.", consequencesTitle: "결과 감당하기", consequencesBody: "지연은 정신력을 낮추고 기준을 높입니다. 위험 100%에서 논문이 철회됩니다.", defeatRounds: "콤보 만들기", defeatRoundsBody: "엄밀성→실험, 실험→글쓰기 같은 연계로 일치 단계를 강화합니다.", selectCard: "카드 선택", playCard: "사용", showLog: "기록", gotIt: "심사 의견을 확인했습니다",
  },
  es: {
    home: "Inicio de Reviewer #2", soundOff: "Silenciar", soundOn: "Activar sonido", help: "Abrir la guía",
    coverAbstract: "Un roguelike de cartas sobre GPU limitadas, revisiones infinitas e integridad científica antes de la fecha límite.",
    runTime: "Campañas de 12–150 minutos", browserPlay: "Juega en el navegador", localSave: "Autoguardado + 3 ranuras manuales",
    menuTitle: "Antes de que el artículo sobreviva a la revisión, tú debes sobrevivir a la fecha límite.",
    menuDescription: "Empieza con un mazo compacto, consigue y mejora cartas, reúne reliquias y gestiona efectos persistentes. El trabajo honesto crece despacio; los atajos peligrosos vuelven como riesgo de retractación.",
    continue: "Continuar revisión", daysLeft: "días", localHigh: "Récord local", mayMeet: "Cartas de acción", dangerous: "Historias interactivas",
    tagline: "5 dificultades, 6 duraciones y 16 finales. Cada envío cuenta una historia diferente.",
    funding: "Fondos", mental: "Salud mental", remaining: "Restante", focus: "Concentración", log: "Abrir registro",
    currentBoss: "Jefe actual", resolved: "Comentarios resueltos", escalations: "Exigencias nuevas", yourPaper: "Tu artículo", hideLog: "Ocultar registro", viewLog: "Ver registro", actionLog: "Registro de acciones",
    round: "Ronda", major: "Mayor", concern: "Problema", comment: "Comentario", original: "Texto original", translation: "Traducción", gameplay: "Nota de juego",
    primary: "Principal", secondary: "Secundario", severity: "Gravedad", responseProgress: "Ruta de respuesta", delayed: "turnos: el estándar ha aumentado.", exactHint: "Solo las acciones con capacidades pertinentes avanzan la ruta. Una respuesta precisa devuelve Concentración.",
    ready: "Lista para jugar", riskExecute: "Aceptar el riesgo y jugar", execute: "Jugar carta", selectHint: "Elige una ruta y busca cartas que cumplan sus pasos.",
    manuscript: "Estado del manuscrito", mentalState: "Salud mental", risk: "Riesgo de retractación", riskTitle: "Al llegar al 100% pierdes la partida", riskLow: "El expediente científico sigue limpio.", riskMid: "Los números mejoran mientras crece la presión de auditoría.", riskHigh: "Riesgo alto: las auditorías y la reproducibilidad serán más difíciles.", endDay: "Terminar día",
    today: "Acciones de hoy", cardHint: "Selecciona una carta y juégala", deck: "Mazo", discard: "Descarte", exhausted: "Agotadas hoy", response: "Respuesta", emptyHand: "No tienes cartas", notEnough: "Recursos insuficientes",
    tutorialTitle: "4 pasos rápidos", tutorial: "Lee el problema → elige una ruta → combina capacidades → completa todos los pasos", closeTutorial: "Cerrar tutorial",
    randomEvent: "Evento interactivo",
    finalScore: "Puntuación final", comments: "Comentarios", strangest: "Evento más extraño", newHigh: "Nuevo récord local", share: "Descargar／compartir resultado", copied: "Copiado", copyReport: "Copiar informe", retry: "Enviar de nuevo", retrySeed: "Reintentar la misma semilla", returnHome: "Volver al inicio",
    rewardTitle: "La revisión abre una nueva dirección", rewardStage: "Recompensa de fase: elige una reliquia", rewardCard: "Recompensa de mazo: añade o mejora una carta", chooseOne: "Elige una. Cambiará el resto de la partida.", addCard: "Añadir al mazo", upgradeCard: "Mejorar carta", gainRelic: "Obtener reliquia", skipReward: "Omitir y recuperar 2 de Salud mental", upgraded: "Mejorada", rarityCommon: "Común", rarityUncommon: "Poco común", rarityRare: "Rara",
    activeEffects: "Efectos activos", relics: "Reliquias", noRelics: "Sin reliquias", caffeine: "Cafeína", insight: "Perspicacia", technicalDebt: "Deuda técnica", reviewerFavor: "Favor del revisor", pageDebt: "Exceso de páginas",
    keywordMatch: "Coincide", combo: "Combo", retain: "Conservar", exhaust: "Agotar", questionable: "Cuestionable", upgradedMark: "Mejorada",
    helpTitle: "Sobrevive hasta la carta de decisión", readComments: "Desglosa el problema", readCommentsBody: "Cada comentario ofrece tres rutas con capacidades explícitas. Las cartas irrelevantes no avanzan.", chooseActions: "Construye tu mazo", chooseActionsBody: "Cada cuatro comentarios obtienes una carta o mejora; superar una fase concede una reliquia.", consequencesTitle: "Asume las consecuencias", consequencesBody: "Los retrasos reducen la salud mental y elevan el estándar. Al 100% de riesgo, el artículo se retira.", defeatRounds: "Crea combos", defeatRoundsBody: "Secuencias como Rigor → Experimento o Experimento → Escritura refuerzan los pasos pertinentes.", selectCard: "Elegir carta", playCard: "Jugar", showLog: "Registro", gotIt: "He leído los comentarios",
  },
};

export const UI_COPY: Record<Locale, Record<UIKey, string>> = {
  en: BASE_UI_COPY.en,
  zh: BASE_UI_COPY.zh,
  ja: { ...BASE_UI_COPY.en, ...EXTRA_UI_COPY.ja },
  ko: { ...BASE_UI_COPY.en, ...EXTRA_UI_COPY.ko },
  es: { ...BASE_UI_COPY.en, ...EXTRA_UI_COPY.es },
};

export const DEFAULT_LOCALE: Locale = "en";

export const LANGUAGE_OPTIONS: ReadonlyArray<{ id: Locale; label: string; short: string; lang: string }> = [
  { id: "en", label: "English", short: "EN", lang: "en" },
  { id: "zh", label: "简体中文", short: "中", lang: "zh-CN" },
  { id: "ja", label: "日本語", short: "日", lang: "ja" },
  { id: "ko", label: "한국어", short: "한", lang: "ko" },
  { id: "es", label: "Español", short: "ES", lang: "es" },
];

export function isLocale(value: unknown): value is Locale {
  return LANGUAGE_OPTIONS.some((option) => option.id === value);
}

export function documentLanguage(locale: Locale) {
  return LANGUAGE_OPTIONS.find((option) => option.id === locale)?.lang ?? "en";
}

const PHRASE_TRANSLATIONS: Record<ExtraLocale, Record<string, string>> = {
  ja: {
    "Continue the Revision": "修正を続ける", "Submit Another Paper": "もう一本投稿する", "Submission Archive": "投稿アーカイブ", "Graduate Survival Manual": "大学院生サバイバルガイド", "Tune the Laboratory": "研究室設定", "Authors & Acknowledgements": "著者と謝辞", "Leave the Lab": "今日はここまで",
    "New Game · Configure Submission": "新規ゲーム · 投稿設定", "Load Archive": "アーカイブ読込", "Help & Ending Archive": "ヘルプとエンディング", "Exit Game": "ゲーム終了", "cards": "枚", "stories": "物語",
    "New Submission": "新規投稿", "Help": "ヘルプ", "Main menu": "メインメニュー", "Configure your next academic crisis": "次の学術危機を設定する",
    "Manuscript": "論文", "Review intensity": "査読強度", "Revision period": "修正期間", "Submission rules": "投稿ルール",
    "Manuscript archetype": "論文タイプ", "Twenty paper types; twenty ways to be precisely criticized.": "20種類の論文、20通りの正確な批判。", "Select manuscript": "論文を選択",
    "Passive": "パッシブ", "Reviewer target": "査読上の弱点", "Less reasonable reviews grant a higher score multiplier.": "理不尽な査読ほどスコア倍率が高くなります。",
    "Short runs are denser; long runs support deeper deckbuilding.": "短期戦は濃密、長期戦はより深いデッキ構築が可能です。", "days": "日", "comments": "コメント",
    "Custom Review Contract": "カスタム査読契約", "Specify the terms; own the consequences": "条件を決め、その結果を引き受ける", "Days": "日数", "Comment target": "目標コメント", "Days between events": "イベント間隔（日）",
    "Read the fine print before signing. The reviewer will not.": "署名前に細則を読んでください。査読者は読みません。", "Irrevocable Submission (Ironman)": "撤回不能投稿（アイアンマン）",
    "Keeps crash-safe autosave, but disables manual saves and rollback. Honor system—you still have developer tools.": "クラッシュ対策の自動保存は維持しますが、手動保存と巻き戻しは禁止。名誉制です。",
    "Seed (blank for random)": "Seed（空欄でランダム）", "Submission summary": "投稿概要", "Sign & Submit": "署名して投稿",
    "Save Current Revision": "現在の修正を保存", "Load Submission Archive": "投稿アーカイブを読み込む", "Saves remain in this browser on this device. No manuscript or data is uploaded.": "保存データはこの端末のブラウザ内だけに保持され、論文やデータは送信されません。",
    "Ironman disables manual saves. Crash-safe autosave remains active.": "アイアンマンでは手動保存できません。クラッシュ対策の自動保存は有効です。", "FILED": "保存済み", "EMPTY": "空", "days left": "日残り",
    "No manuscript filed": "保存された論文なし", "Suspiciously quiet for a submission portal.": "投稿システムとは思えない静けさ。", "Overwrite": "上書き", "Save here": "ここに保存", "Load": "読み込む", "Delete": "削除",
    "Submission Timeline": "投稿タイムライン", "Only events that change the fate of the submission appear here. Every card-sized struggle remains in the action log.": "投稿の運命を変えた出来事だけを記録します。カードごとの奮闘は行動ログに残ります。", "Day": "日目",
    "Leave the email alone for a moment": "メールを少し放置する", "Continue revision": "修正を続ける", "Save to archive slot": "アーカイブに保存", "Load an archive slot": "アーカイブを読み込む", "View submission timeline": "投稿タイムラインを見る", "Rules and endings": "ルールとエンディング", "Save & return to title": "保存してタイトルへ",
  },
  ko: {
    "Continue the Revision": "수정 계속하기", "Submit Another Paper": "논문 한 편 더 투고", "Submission Archive": "투고 보관실", "Graduate Survival Manual": "대학원생 생존 안내서", "Tune the Laboratory": "연구실 설정", "Authors & Acknowledgements": "저자 및 감사의 글", "Leave the Lab": "오늘은 여기까지",
    "New Game · Configure Submission": "새 게임 · 투고 설정", "Load Archive": "보관함 불러오기", "Help & Ending Archive": "도움말과 결말", "Exit Game": "게임 종료", "cards": "장", "stories": "개 이야기",
    "New Submission": "새 투고", "Help": "도움말", "Main menu": "메인 메뉴", "Configure your next academic crisis": "다음 학술 위기를 설정하세요",
    "Manuscript": "논문", "Review intensity": "심사 강도", "Revision period": "수정 기간", "Submission rules": "투고 규칙",
    "Manuscript archetype": "논문 유형", "Twenty paper types; twenty ways to be precisely criticized.": "스무 가지 논문, 스무 가지 정확한 비판 방식.", "Select manuscript": "논문 선택",
    "Passive": "패시브", "Reviewer target": "심사 약점", "Less reasonable reviews grant a higher score multiplier.": "불합리한 심사일수록 점수 배율이 높습니다.",
    "Short runs are denser; long runs support deeper deckbuilding.": "짧은 게임은 밀도가 높고, 긴 게임은 더 깊은 덱 구성이 가능합니다.", "days": "일", "comments": "의견",
    "Custom Review Contract": "사용자 지정 심사 계약", "Specify the terms; own the consequences": "조건을 정하고 결과를 감당하세요", "Days": "일수", "Comment target": "목표 의견", "Days between events": "이벤트 간격(일)",
    "Read the fine print before signing. The reviewer will not.": "서명 전에 작은 글씨를 읽으세요. 심사자는 읽지 않습니다.", "Irrevocable Submission (Ironman)": "철회 불가 투고(아이언맨)",
    "Keeps crash-safe autosave, but disables manual saves and rollback. Honor system—you still have developer tools.": "충돌 방지 자동 저장은 유지하지만 수동 저장과 되돌리기는 비활성화됩니다. 명예 규칙입니다.",
    "Seed (blank for random)": "Seed(비워두면 무작위)", "Submission summary": "투고 요약", "Sign & Submit": "서명하고 투고",
    "Save Current Revision": "현재 수정 저장", "Load Submission Archive": "투고 보관함 불러오기", "Saves remain in this browser on this device. No manuscript or data is uploaded.": "저장은 이 기기의 브라우저에만 남으며 논문이나 데이터는 업로드되지 않습니다.",
    "Ironman disables manual saves. Crash-safe autosave remains active.": "아이언맨은 수동 저장을 금지하지만 충돌 방지 자동 저장은 유지됩니다.", "FILED": "저장됨", "EMPTY": "비어 있음", "days left": "일 남음",
    "No manuscript filed": "저장된 논문 없음", "Suspiciously quiet for a submission portal.": "투고 시스템치고는 수상할 만큼 조용합니다.", "Overwrite": "덮어쓰기", "Save here": "여기에 저장", "Load": "불러오기", "Delete": "삭제",
    "Submission Timeline": "투고 타임라인", "Only events that change the fate of the submission appear here. Every card-sized struggle remains in the action log.": "투고의 운명을 바꾼 사건만 기록합니다. 카드 단위의 분투는 행동 기록에 남습니다.", "Day": "일차",
    "Leave the email alone for a moment": "잠시 이메일에서 벗어나기", "Continue revision": "수정 계속", "Save to archive slot": "보관함에 저장", "Load an archive slot": "보관함 불러오기", "View submission timeline": "투고 타임라인 보기", "Rules and endings": "규칙과 결말", "Save & return to title": "저장하고 타이틀로",
  },
  es: {
    "Continue the Revision": "Continuar la revisión", "Submit Another Paper": "Enviar otro artículo", "Submission Archive": "Archivo de envíos", "Graduate Survival Manual": "Manual de supervivencia doctoral", "Tune the Laboratory": "Ajustar el laboratorio", "Authors & Acknowledgements": "Autores y agradecimientos", "Leave the Lab": "Cerrar el laboratorio",
    "New Game · Configure Submission": "Nueva partida · Configurar envío", "Load Archive": "Cargar archivo", "Help & Ending Archive": "Ayuda y finales", "Exit Game": "Salir", "cards": "cartas", "stories": "historias",
    "New Submission": "Nuevo envío", "Help": "Ayuda", "Main menu": "Menú principal", "Configure your next academic crisis": "Configura tu próxima crisis académica",
    "Manuscript": "Manuscrito", "Review intensity": "Intensidad de revisión", "Revision period": "Periodo de revisión", "Submission rules": "Reglas del envío",
    "Manuscript archetype": "Tipo de manuscrito", "Twenty paper types; twenty ways to be precisely criticized.": "Veinte tipos de artículo; veinte formas de recibir críticas precisas.", "Select manuscript": "Seleccionar manuscrito",
    "Passive": "Pasiva", "Reviewer target": "Punto débil", "Less reasonable reviews grant a higher score multiplier.": "Las revisiones menos razonables conceden un multiplicador mayor.",
    "Short runs are denser; long runs support deeper deckbuilding.": "Las partidas cortas son más intensas; las largas permiten mazos más profundos.", "days": "días", "comments": "comentarios",
    "Custom Review Contract": "Contrato de revisión personalizado", "Specify the terms; own the consequences": "Define las condiciones y asume las consecuencias", "Days": "Días", "Comment target": "Objetivo de comentarios", "Days between events": "Días entre eventos",
    "Read the fine print before signing. The reviewer will not.": "Lee la letra pequeña antes de firmar. El revisor no lo hará.", "Irrevocable Submission (Ironman)": "Envío irrevocable (Ironman)",
    "Keeps crash-safe autosave, but disables manual saves and rollback. Honor system—you still have developer tools.": "Conserva el autoguardado de emergencia, pero desactiva guardado manual y retroceso. Es un sistema de honor.",
    "Seed (blank for random)": "Semilla (vacía = aleatoria)", "Submission summary": "Resumen del envío", "Sign & Submit": "Firmar y enviar",
    "Save Current Revision": "Guardar revisión actual", "Load Submission Archive": "Cargar archivo de envíos", "Saves remain in this browser on this device. No manuscript or data is uploaded.": "Las partidas se guardan solo en este navegador. No se sube ningún manuscrito ni dato.",
    "Ironman disables manual saves. Crash-safe autosave remains active.": "Ironman desactiva los guardados manuales, pero mantiene el autoguardado de emergencia.", "FILED": "ARCHIVADO", "EMPTY": "VACÍO", "days left": "días restantes",
    "No manuscript filed": "Ningún manuscrito guardado", "Suspiciously quiet for a submission portal.": "Demasiado tranquilo para ser un portal de envíos.", "Overwrite": "Sobrescribir", "Save here": "Guardar aquí", "Load": "Cargar", "Delete": "Eliminar",
    "Submission Timeline": "Cronología del envío", "Only events that change the fate of the submission appear here. Every card-sized struggle remains in the action log.": "Aquí aparecen solo los eventos que cambian el destino del envío. Cada lucha con las cartas queda en el registro.", "Day": "Día",
    "Leave the email alone for a moment": "Deja el correo por un momento", "Continue revision": "Continuar revisión", "Save to archive slot": "Guardar en una ranura", "Load an archive slot": "Cargar una ranura", "View submission timeline": "Ver cronología", "Rules and endings": "Reglas y finales", "Save & return to title": "Guardar y volver al título",
  },
};

export function localizedText(locale: Locale, zh: string, en: string) {
  if (locale === "zh") return zh;
  if (locale === "en") return en;
  if (en.startsWith("Load Archive · ")) {
    return `${PHRASE_TRANSLATIONS[locale]["Load Archive"] ?? "Load Archive"} · ${en.slice("Load Archive · ".length)}`;
  }
  return PHRASE_TRANSLATIONS[locale][en] ?? en;
}

const ROLE_EN: Record<string, { pitch: string; passive: string; weakness: string }> = {
  method: { pitch: "The idea is novel; the experiment table is always one row short.", passive: "Your first Experiment card each day gains +1 Response.", weakness: "Clinical and external-validation comments are 1 point harder." },
  clinical: { pitch: "The data are credible. The reviewer only wants to know what is new.", passive: "Your first Rigor card each day gains +1 Response and restores 1 Mental Health.", weakness: "Novelty comments are 1 point harder." },
  foundation: { pitch: "Many parameters, little memory, and an abstract that reads like a moon landing.", passive: "GPU cards cost 1 less GPU; your first Experiment card each day gains +1 Response.", weakness: "Formatting and reproducibility comments are 1 point harder." },
};

const CARD_RULES_EN: Record<string, string> = {
  ablation: "Evidence +2 and Reproducibility +1; strong against ablation and novelty concerns.", baseline: "Evidence +2; strong against comparison comments.",
  "external-validation": "Evidence +3 and Reproducibility +1. Powerful and expensive.", "rewrite-intro": "Novelty +2 and Clarity +2.", "stat-test": "Evidence +2 and Reproducibility +2.", "better-figure": "Clarity +3; strong against figure comments.",
  "ask-coauthor": "Uncertain: sometimes a critical edit, sometimes only 'Looks good.'", sleep: "Mental Health +7 and Risk -3; consumes all Focus for the day.", "tune-seed": "55% chance of a large Evidence gain; failure loses Evidence and Mental Health. Risk +12.", "hide-result": "Evidence +3, Clarity +1, and +4 Response; Risk +25.",
  "release-code": "Reproducibility +3 and Risk -6.", "seed-everything": "Reproducibility +3 and Evidence +1.", "power-analysis": "Evidence +3 and Reproducibility +1.", "error-analysis": "Evidence +2 and Clarity +1.", "rebuttal-letter": "Clarity +2 and +3 base Response against any comment.", "related-work": "Novelty +2 and Clarity +1.", "cite-recent": "Novelty +1 and Clarity +1; costs no Focus but requires Funding.",
  "simplify-claim": "Clarity +2, Novelty -1, Risk -2; current difficulty -1.", appendix: "Clarity +1 and Reproducibility +2.", "clean-split": "Reproducibility +3 and Evidence +1.", "cross-validation": "Evidence +3 and Reproducibility +2.", "ask-labmate": "Clarity +1, Mental Health +2, and refund 1 Focus.", coffee: "Focus +1, Mental Health +1, and Risk +2.", "cut-scope": "Clarity +2, Novelty -1, regain 1 day; current difficulty -2.", "smaller-model": "GPU +3, Reproducibility +2, and Evidence -1.", "cloud-gpu": "Funding -3, GPU +7, and Risk +3.", "negative-results": "Evidence +1, Reproducibility +3, Novelty -1, and Risk -10.", "reproduce-baseline": "Evidence +2 and Reproducibility +3.", "latex-exorcism": "Clarity +4; strong against camera-ready and formatting comments.", "take-walk": "Mental Health +5 and Risk -2.",
};

const COMMENT_ZH: Record<string, string> = {
  "r1-baseline": "与成熟基线的比较并不完整。", "r1-stats": "没有提供统计显著性检验。", "r1-figure": "图 2 难以理解。", "r1-split": "请说明训练/测试划分和随机种子。", "r1-ablation": "各组件的贡献仍不明确。", "r2-novelty": "创新性有限。", "r2-recent": "缺少与近期方法的比较。", "r2-leakage": "无法排除潜在数据泄漏。", "r2-mask": "为什么选择这一掩码比例？", "r2-datasets": "请在另外三个数据集上增加实验。", "r2-vit": "为完整性，请与 ViT-Large 比较。", "r2-clinical": "临床相关性没有得到充分证明。", "r2-contradiction": "请简化方法，同时增加更多组件。", "r2-selfcite": "请引用这六篇高度相关的论文。", "editor-claims": "论文主张似乎强于现有证据。", "editor-balance": "各项关切没有得到均衡回应。", "editor-ethics": "数据治理和伦理声明需要澄清。", "editor-impact": "尚不清楚该进展是否足够实质。", "camera-pages": "稿件超出页数限制 1.7 页。", "camera-figure": "图片未达到所需分辨率。", "camera-repo": "匿名仓库包含身份信息。", "camera-refs": "若干参考文献缺失或格式错误。", "coauthor-rewrite": "合作者：我们应该重写整篇论文。", "coauthor-title": "合作者：标题需要完全不同的叙事框架。",
};

const COMMENT_NOTE_EN: Record<string, string> = {
  "r1-baseline": "Add a strong baseline—not only your own three-month-old version.", "r1-stats": "Needs statistical evidence, not 'visibly better.'", "r1-figure": "Save at least two of the legend, font size, and palette.", "r1-split": "Reproducibility details cannot be replaced by 'see code,' especially when the code is private.", "r1-ablation": "Prove each module exists for more than filling the architecture diagram.", "r2-novelty": "The classic two-word verdict. Defend the contribution and explain it clearly.", "r2-recent": "'Recent' means the preprint uploaded last night.", "r2-leakage": "High-risk concern: audit the split, code, and logs.", "r2-mask": "'We used the default' is not a methodological explanation.", "r2-datasets": "The reviewer provides neither datasets, compute, nor three extra months.", "r2-vit": "Completeness is inversely proportional to available VRAM.", "r2-clinical": "There is a bridge between better metrics and real-world value.", "r2-contradiction": "The mutually exclusive requests have passed peer review.", "r2-selfcite": "All six papers happen to share one corresponding author.", "editor-claims": "The editor is counting adjectives per experiment.", "editor-balance": "Only adding experiments or only editing prose will not be enough.", "editor-ethics": "This time, 'see supplement' is not enough.", "editor-impact": "The editor draws a line between interesting and interesting enough.", "camera-pages": "The algorithm cannot go. Neither can the acknowledgements.", "camera-figure": "The cost of pasting screenshots has arrived.", "camera-repo": "Git history is more honest than the author list.", "camera-refs": "BibTeX becomes self-aware on the final day.", "coauthor-rewrite": "One day before the deadline, the hidden boss joins the meeting.", "coauthor-title": "Change the title and the entire narrative changes with it.",
};

type EventEnglish = { title: string; description: string; choices: Record<string, { label: string; hint: string; result: string }> };
const EVENT_EN: Record<string, EventEnglish> = {
  "gpu-oom": { title: "GPU OOM", description: "At 3 a.m., training hits 99% and runs out of memory.", choices: { rerun: { label: "Reduce batch size and rerun", hint: "GPU -2 · Evidence +1", result: "It finishes, only four times slower." }, debug: { label: "Fix the memory leak", hint: "Mental -2 · Repro +2", result: "Every tensor was being cached. You grow older and wiser." } } },
  "disk-full": { title: "The Server Disk Is Full", description: "274 checkpoints named final_final_v3 occupy the shared drive.", choices: { cleanup: { label: "Clean the experiment directory", hint: "Mental -1 · Repro +2", result: "You delete 86 GB and finally understand your own folders." }, storage: { label: "Buy temporary storage", hint: "Funding -2 · GPU +2", result: "The problem is renewed, not solved." } } },
  "new-method": { title: "A New Method Appears First", description: "One day before submission, arXiv produces a title 73% similar to yours.", choices: { differentiate: { label: "Differentiate overnight", hint: "GPU -2 · Mental -2 · Novelty +2", result: "Related Work gains the longest contrastive sentence of your career." }, narrow: { label: "Narrow the claim honestly", hint: "Novelty -1 · Clarity +3 · Risk -4", result: "Less dramatic, finally accurate." } } },
  "sensitivity-zero": { title: "One Fold Has Sensitivity 0", description: "The average survives, but the zero looks like a black hole in the table.", choices: { report: { label: "Report it honestly", hint: "Evidence -1 · Repro +3 · Risk -8", result: "The figure looks worse. The rest becomes believable." }, rerun: { label: "Rerun with another seed", hint: "GPU -3 · Evidence +2 · Risk +12", result: "It is no longer zero. You decide not to ask why." } } },
  "looks-good": { title: "Coauthor: Looks good to me", description: "You sent 17 concrete questions. Four words arrive 11 seconds later.", choices: { chase: { label: "Request substantive edits", hint: "Mental -2 · Clarity +2", result: "They change one comma and one critical argument." }, accept: { label: "Take it as a blessing", hint: "Mental +2", result: "At least nobody added a requirement." } } },
  "self-citations": { title: "The Reviewer Requests Six Citations", description: "The corresponding-author initials mysteriously match the review signature.", choices: { cite: { label: "Add them strategically", hint: "Clarity +2 · Risk +6", result: "Related Work grows half a page. Satisfaction may also grow." }, decline: { label: "Decline politely", hint: "Mental -2 · Novelty +2", result: "Three airtight paragraphs explain why they are irrelevant." } } },
  "auc-drop": { title: "The Requested Experiment Lowers AUC", description: "Reviewer #2's experiment confirms Reviewer #2's concern.", choices: { honest: { label: "Discuss the failure mode", hint: "Evidence +1 · Repro +2 · Risk -6", result: "The result weakens. The paper strengthens." }, tune: { label: "Tune one more round", hint: "GPU -3 · Evidence +2 · Mental -2", result: "AUC returns. The weekend does not." } } },
  "latex-table": { title: "The LaTeX Table Exceeds Two Columns", description: "Only by 4 mm, which the system treats as a character flaw.", choices: { rewrite: { label: "Rebuild the table", hint: "Mental -1 · Clarity +3", result: "It becomes readable without resizebox." }, tiny: { label: "Use 4 pt text", hint: "Clarity -1 · Gain 1 day", result: "It meets the format, not human vision." } } },
  "free-cluster": { title: "The Cluster Is Suddenly Free", description: "The lab is at a meeting. Eight GPUs wait in the night.", choices: { sweep: { label: "Run the full sweep", hint: "GPU +4 · Evidence +2", result: "A progress bar appears without OOM." }, rest: { label: "Back up and go home", hint: "Mental +4 · Repro +1", result: "Both server and researcher receive maintenance." } } },
  "license-update": { title: "The Dataset License Changes", description: "README contains a restriction you never saw before submission.", choices: { audit: { label: "Redo the compliance audit", hint: "Lose 1 day · Repro +3", result: "Painful, but the governance section survives questions." }, ignore: { label: "Pretend you missed it", hint: "Risk +18 · Evidence +1", result: "The submit button turns green. The risk bar turns red." } } },
  "useful-edits": { title: "The Coauthor Sends Real Edits", description: "A tracked-changes document. Not 'Looks good.' This is not a drill.", choices: { merge: { label: "Merge every edit", hint: "Clarity +3 · Mental +2", result: "Some sentences are understandable on the first reading." }, learn: { label: "Rebuild the argument too", hint: "Novelty +2 · Clarity +2 · Mental -1", result: "The paper gains a spine. You lose a night." } } },
  "reviewer-appendix": { title: "The Reviewer Actually Read the Appendix", description: "They quote Appendix C.4 exactly. This was not in the disaster plan.", choices: { polish: { label: "Complete the details", hint: "Repro +3 · Mental -1", result: "For once, 'see appendix' solves the problem." }, celebrate: { label: "Celebrate being read", hint: "Mental +4 · Clarity +1", result: "Careful review feels moving. Slightly." } } },
};

export function roleText(role: RoleDef, field: "pitch" | "passive" | "weakness", locale: Locale) {
  if (locale === "zh") return role[field];
  return role[`${field}En` as keyof RoleDef] as string | undefined ?? ROLE_EN[role.id]?.[field] ?? role[field];
}

export function cardRules(card: CardDef, locale: Locale) {
  return locale === "zh" ? card.rules : card.rulesEn ?? CARD_RULES_EN[card.id] ?? card.rules;
}

export function cardFlavor(card: CardDef, locale: Locale) {
  return locale === "zh" ? card.flavor : card.flavorEn ?? card.flavor;
}

export function commentQuote(comment: CommentDef, locale: Locale) {
  return locale === "zh" ? comment.quoteZh ?? COMMENT_ZH[comment.id] ?? comment.quote : comment.quote;
}

export function commentNote(comment: CommentDef, locale: Locale) {
  return locale === "zh" ? comment.note : comment.noteEn ?? COMMENT_NOTE_EN[comment.id] ?? comment.note;
}

export function eventTitle(event: EventDef, locale: Locale) {
  return locale === "zh" ? event.title : event.titleEn ?? EVENT_EN[event.id]?.title ?? event.title;
}

export function eventDescription(event: EventDef, locale: Locale) {
  return locale === "zh" ? event.description : event.descriptionEn ?? EVENT_EN[event.id]?.description ?? event.description;
}

export function eventChoiceText(event: EventDef, choice: EventChoice, field: "label" | "hint" | "result", locale: Locale) {
  if (locale === "zh") return choice[field];
  const direct = choice[`${field}En` as keyof EventChoice];
  return typeof direct === "string" ? direct : EVENT_EN[event.id]?.choices[choice.id]?.[field] ?? choice[field];
}
