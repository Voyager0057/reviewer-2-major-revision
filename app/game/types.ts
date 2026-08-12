export type Metric =
  | "novelty"
  | "evidence"
  | "clarity"
  | "reproducibility";

export type Locale = "en" | "zh" | "ja" | "ko" | "es";

export type CardRarity = "common" | "uncommon" | "rare";

export type Capability =
  | "comparison"
  | "ablation"
  | "statistics"
  | "uncertainty"
  | "visualization"
  | "protocol"
  | "dataIntegrity"
  | "externalValidation"
  | "robustness"
  | "calibration"
  | "efficiency"
  | "clinicalRelevance"
  | "fairness"
  | "causalReasoning"
  | "reproducibility"
  | "codeRelease"
  | "documentation"
  | "claimFraming"
  | "literature"
  | "responseWriting"
  | "ethics"
  | "formatting"
  | "theory"
  | "interpretability";

export type StageId =
  | "reviewer1"
  | "reviewer2"
  | "editor"
  | "coauthor"
  | "camera";

export type CardCategory =
  | "experiment"
  | "writing"
  | "rigor"
  | "support"
  | "questionable";

export type EndingId =
  | "accepted"
  | "best_paper"
  | "open_science"
  | "replication_legend"
  | "clean_review"
  | "speedrun"
  | "last_minute"
  | "survivor_accept"
  | "coauthor_ending"
  | "minor_revision"
  | "major_revision"
  | "revise_resubmit"
  | "desk_reject"
  | "rejected"
  | "burnout"
  | "retracted";

export type DifficultyId =
  | "friendly"
  | "constructive"
  | "major"
  | "reviewer_two"
  | "desk_reject";

export type CampaignLengthId =
  | "espresso"
  | "conference"
  | "standard"
  | "marathon"
  | "eternal"
  | "custom";

export interface RunSetup {
  difficultyId: DifficultyId;
  lengthId: CampaignLengthId;
  ironman: boolean;
  customDays?: number;
  customTarget?: number;
  customEventEvery?: number;
}

export interface CampaignConfig extends RunSetup {
  totalDays: number;
  baseTarget: number;
  eventEvery: number;
  issueModifier: number;
  pressureModifier: number;
  resourceMultiplier: number;
  scoreMultiplier: number;
}

export interface PaperStats {
  novelty: number;
  evidence: number;
  clarity: number;
  reproducibility: number;
}

export interface RunResources {
  gpu: number;
  funding: number;
  mental: number;
  risk: number;
  days: number;
  focus: number;
}

export interface Delta {
  stats?: Partial<PaperStats>;
  gpu?: number;
  funding?: number;
  mental?: number;
  risk?: number;
  days?: number;
  focus?: number;
}

export interface RoleDef {
  id: string;
  name: string;
  en: string;
  symbol: string;
  pitch: string;
  pitchEn?: string;
  passive: string;
  passiveEn?: string;
  weakness: string;
  weaknessEn?: string;
  stats: PaperStats;
  resources: Pick<RunResources, "gpu" | "funding" | "mental">;
  trait?: {
    category?: CardCategory;
    capability?: Capability;
    answerBonus?: number;
    costResource?: "focus" | "gpu" | "funding" | "mental" | "risk";
    costReduction?: number;
    extraDays?: number;
    extraHand?: number;
  };
}

export interface CardDef {
  id: string;
  name: string;
  en: string;
  category: CardCategory;
  flavor: string;
  flavorEn?: string;
  rules: string;
  rulesEn?: string;
  rarity?: CardRarity;
  focus: number;
  gpu?: number;
  funding?: number;
  mental?: number;
  risk?: number;
  delta?: Delta;
  answer?: number;
  tags: string[];
  volatile?: "coauthor" | "seed";
  shrinkIssue?: number;
  exhaust?: boolean;
  retain?: boolean;
  comboAfter?: CardCategory;
  comboAnswer?: number;
  condition?: Partial<ConditionState>;
  provides?: Partial<Record<Capability, number>>;
}

export interface CardInstance {
  instanceId: number;
  cardId: string;
}

export interface CommentDef {
  id: string;
  stage: StageId;
  quote: string;
  quoteZh?: string;
  note: string;
  noteEn?: string;
  primary: Metric;
  secondary?: Metric;
  difficulty: number;
  severity: 1 | 2 | 3;
  tags: string[];
  routes?: ResolutionRoute[];
}

export interface CapabilityRequirement {
  id: string;
  capability: Capability;
  label: string;
  labelEn: string;
  target: number;
}

export interface ResolutionRoute {
  id: "verify" | "scope" | "transparent";
  name: string;
  nameEn: string;
  summary: string;
  summaryEn: string;
  requirements: CapabilityRequirement[];
  resolutionDelta?: Delta;
  followUpChance: number;
  followUpCapability: Capability;
}

export interface IssueState {
  commentId: string;
  progress: number;
  difficulty: number;
  escalations: number;
  routeId: ResolutionRoute["id"];
  capabilityProgress: Partial<Record<Capability, number>>;
  extraRequirements: CapabilityRequirement[];
  followUps: number;
}

export interface EventChoice {
  id: string;
  label: string;
  labelEn?: string;
  hint: string;
  hintEn?: string;
  result: string;
  resultEn?: string;
  delta: Delta;
  effect?: EventEffect;
  story?: EventDialogueBeat[];
}

export interface EventDialogueBeat {
  speaker: string;
  speakerEn?: string;
  text: string;
  textEn?: string;
  aside?: string;
  asideEn?: string;
}

export interface EventDef {
  id: string;
  icon: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  choices: [EventChoice, EventChoice, ...EventChoice[]];
}

export interface ConditionState {
  caffeine: number;
  insight: number;
  technicalDebt: number;
  reviewerFavor: number;
  pageDebt: number;
  infrastructureDown: number;
  queueDelay: number;
  advisorPressure: number;
  coauthorTrust: number;
  auditTrail: number;
}

export interface EventEffect {
  conditions?: Partial<ConditionState>;
  addCard?: string;
  upgradeRandom?: boolean;
  removeQuestionable?: boolean;
  gainRelic?: string;
}

export interface RelicDef {
  id: string;
  icon: string;
  name: string;
  en: string;
  rules: string;
  rulesEn: string;
  rarity: "uncommon" | "rare";
  effect?: {
    category?: CardCategory;
    capability?: Capability;
    answerBonus?: number;
    costResource?: "focus" | "gpu" | "funding" | "mental" | "risk";
    costReduction?: number;
    daily?: Delta;
    eventShield?: number;
  };
}

export interface RewardOffer {
  id: string;
  kind: "card" | "upgrade" | "relic";
  contentId: string;
}

export interface RunEnding {
  id: EndingId;
  stamp: string;
  title: string;
  titleEn?: string;
  copy: string;
  copyEn?: string;
  score: number;
}

export interface RunStats {
  cardsPlayed: number;
  dangerousPlayed: number;
  perfectReplies: number;
  negativeResults: number;
  maxDailySolved: number;
  strangestEvent: string;
  eventsCompleted: number;
}

export interface LogEntry {
  id: number;
  tone: "good" | "bad" | "neutral" | "danger";
  text: string;
  textEn?: string;
}

export type TimelineKind = "submission" | "review" | "revision" | "event" | "decision" | "save";

export interface TimelineEntry {
  id: number;
  turn: number;
  daysRemaining: number;
  kind: TimelineKind;
  title: string;
  titleEn?: string;
  detail: string;
  detailEn?: string;
  tone: "good" | "bad" | "neutral" | "danger";
}

export interface EventFlowState {
  eventId: string;
  choiceId: string | null;
  beatIndex: number;
  status: "choice" | "dialogue" | "reveal";
  before?: EventOutcomeSnapshot;
}

export interface EventOutcomeSnapshot {
  stats: PaperStats;
  resources: RunResources;
  conditions: ConditionState;
  masterDeck: string[];
  cardLevels: Record<string, number>;
  relics: string[];
}

export interface GameState {
  engineVersion: 4;
  phase: "playing" | "event" | "reward" | "ended";
  seed: number;
  rngState: number;
  roleId: string;
  campaign: CampaignConfig;
  turn: number;
  stats: PaperStats;
  resources: RunResources;
  deck: string[];
  discard: string[];
  exhausted: string[];
  masterDeck: string[];
  hand: CardInstance[];
  cardLevels: Record<string, number>;
  relics: string[];
  conditions: ConditionState;
  rewardOffers: RewardOffer[];
  rewardReason: "opening" | "peer_review" | "stage_clear" | null;
  nextInstanceId: number;
  issue: IssueState;
  seenComments: string[];
  seenEvents: string[];
  resolved: number;
  target: number;
  solvedThisTurn: number;
  playedThisTurn: string[];
  researchedThisTurn: boolean;
  currentStage: StageId;
  hiddenBoss: boolean;
  coauthorChecked: boolean;
  activeEventId: string | null;
  eventFlow: EventFlowState | null;
  runStats: RunStats;
  logs: LogEntry[];
  nextLogId: number;
  timeline: TimelineEntry[];
  nextTimelineId: number;
  lastMessage: string;
  ending: RunEnding | null;
}

export type GameAction =
  | { type: "PLAY_CARD"; instanceId: number }
  | { type: "END_TURN"; expectedTurn: number }
  | { type: "CHOOSE_EVENT"; eventId: string; choiceId: string }
  | { type: "ADVANCE_EVENT" }
  | { type: "COMPLETE_EVENT" }
  | { type: "CHOOSE_REWARD"; offerId: string }
  | { type: "SKIP_REWARD" }
  | { type: "CHOOSE_ROUTE"; routeId: ResolutionRoute["id"] }
  | { type: "RESEARCH" };

export interface CapabilityContribution {
  capability: Capability;
  label: string;
  labelEn: string;
  amount: number;
  before: number;
  after: number;
  target: number;
}

export interface CardPreview {
  playable: boolean;
  reason: string;
  reasonEn?: string;
  answer: number;
  outcome: string;
  outcomeEn?: string;
  matchedTags?: Capability[];
  comboActive?: boolean;
  contributions?: CapabilityContribution[];
  matchLevel?: "strong" | "partial" | "none";
  completesIssue?: boolean;
}
