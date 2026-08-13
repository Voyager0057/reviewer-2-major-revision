import infrastructure from "./assets/events/infrastructure.jpg";
import people from "./assets/events/people.jpg";
import data from "./assets/events/data.jpg";
import submission from "./assets/events/submission.jpg";
import administration from "./assets/events-v2/administration-maze.jpg";
import advisor from "./assets/events-v2/advisor-rewrite.jpg";
import competition from "./assets/events-v2/competing-preprint.jpg";
import ethics from "./assets/events-v2/ethics-board.jpg";
import wellbeing from "./assets/events-v2/lab-wellbeing.jpg";
import collaboration from "./assets/events-v2/open-collaboration.jpg";
import publicity from "./assets/events-v2/publicity-crisis.jpg";
import server from "./assets/events-v2/server-maintenance.jpg";
import cameraReady from "./assets/events-v2/camera-ready-chaos.jpg";
import clinicalValidation from "./assets/events-v2/clinical-validation.jpg";
import dataLeakage from "./assets/events-v2/data-leakage-audit.jpg";
import fundingFreeze from "./assets/events-v2/funding-freeze.jpg";
import missingCoauthor from "./assets/events-v2/missing-coauthor.jpg";
import type { EventDef } from "./types";

export type EventIllustrationTheme = "infrastructure" | "people" | "data" | "submission" | "server" | "advisor" | "ethics" | "wellbeing" | "competition" | "administration" | "publicity" | "collaboration" | "camera-ready" | "clinical" | "data-leakage" | "funding" | "missing-coauthor";

const GRAND_FAMILY_ART: Record<string, { src: string; theme: EventIllustrationTheme }> = {
  power: { src: infrastructure, theme: "infrastructure" },
  server: { src: server, theme: "server" },
  advisor: { src: advisor, theme: "advisor" },
  coauthor: { src: missingCoauthor, theme: "missing-coauthor" },
  data: { src: dataLeakage, theme: "data-leakage" },
  compute: { src: server, theme: "server" },
  statistics: { src: data, theme: "data" },
  venue: { src: cameraReady, theme: "camera-ready" },
  ethics: { src: ethics, theme: "ethics" },
  funding: { src: fundingFreeze, theme: "funding" },
  community: { src: collaboration, theme: "collaboration" },
  wellbeing: { src: wellbeing, theme: "wellbeing" },
  competition: { src: competition, theme: "competition" },
  collaboration: { src: collaboration, theme: "collaboration" },
  publicity: { src: publicity, theme: "publicity" },
  institution: { src: administration, theme: "administration" },
};

const INFRASTRUCTURE = /power|server|gpu|disk|cluster|storage|queue|network|cool|oom|electric|outage|maintenance|backup|cloud|hardware|lightning|breaker|vpn/;
const PEOPLE = /advisor|coauthor|collab|mentor|student|team|meeting|author|librarian|clinician|engineer|consortium|interview/;
const DATA = /data|statistic|experiment|result|fold|dataset|label|ethic|competition|preprint|negative|leak|analysis|model|auc|bias|fairness|clinical|reproduc|calibration/;

export function eventIllustrationFor(event: EventDef): { src: string; theme: EventIllustrationTheme } {
  const searchable = `${event.id} ${event.titleEn ?? ""}`.toLowerCase();
  if (/external.validation|multi.?site|hospital|clinician|clinical|consortium/.test(searchable)) return { src: clinicalValidation, theme: "clinical" };
  const grandFamily = /^grand-event-([a-z]+)-/.exec(event.id)?.[1];
  if (grandFamily && GRAND_FAMILY_ART[grandFamily]) return GRAND_FAMILY_ART[grandFamily];
  if (/ethic|irb|consent|license/.test(searchable)) return { src: ethics, theme: "ethics" };
  if (/advisor|mentor|rewrite|causal-advisor/.test(searchable)) return { src: advisor, theme: "advisor" };
  if (/camera|format|supplement|zip|title-typo|two-column|resolution|margin|submission|portal/.test(searchable)) return { src: cameraReady, theme: "camera-ready" };
  if (/leak|split|duplicate|provenance|audit|label|data.integrity/.test(searchable)) return { src: dataLeakage, theme: "data-leakage" };
  if (/fund|finance|budget|grant|expense|invoice|reimburse/.test(searchable)) return { src: fundingFreeze, theme: "funding" };
  if (/coauthor|vacation|auto.?reply|unanswered|missing.author/.test(searchable)) return { src: missingCoauthor, theme: "missing-coauthor" };
  if (/deadline/.test(searchable)) return { src: submission, theme: "submission" };
  if (/public|press|viral|tweet|podcast|meme|interview|citation|poster/.test(searchable)) return { src: publicity, theme: "publicity" };
  if (/preprint|benchmark|leaderboard|competition|sota|survey/.test(searchable)) return { src: competition, theme: "competition" };
  if (/institution|admin|office|stamp|training|signature|fund|finance|vpn/.test(searchable)) return { src: administration, theme: "administration" };
  if (/wellbeing|coffee|allnighter|weekend|meal|flu|fire-drill|quiet/.test(searchable)) return { src: wellbeing, theme: "wellbeing" };
  if (/community|collaboration|consortium|open|anonymous|reproduction|fork/.test(searchable)) return { src: collaboration, theme: "collaboration" };
  if (/maintenance|queue|cluster|scheduler|compute|cooling/.test(searchable)) return { src: server, theme: "server" };
  if (INFRASTRUCTURE.test(searchable)) return { src: infrastructure, theme: "infrastructure" };
  if (PEOPLE.test(searchable)) return { src: people, theme: "people" };
  if (DATA.test(searchable)) return { src: data, theme: "data" };
  return { src: submission, theme: "submission" };
}

export const EVENT_ILLUSTRATION_COUNT = 17;
