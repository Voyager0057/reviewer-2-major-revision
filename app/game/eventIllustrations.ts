import infrastructure from "./assets/events/infrastructure.jpg";
import people from "./assets/events/people.jpg";
import data from "./assets/events/data.jpg";
import submission from "./assets/events/submission.jpg";
import type { EventDef } from "./types";

export type EventIllustrationTheme = "infrastructure" | "people" | "data" | "submission";

const INFRASTRUCTURE = /power|server|gpu|disk|cluster|storage|queue|network|cool|oom|electric|outage|maintenance|backup|cloud|hardware|lightning|breaker|vpn/;
const PEOPLE = /advisor|coauthor|collab|mentor|student|team|meeting|author|librarian|clinician|engineer|consortium|interview/;
const DATA = /data|statistic|experiment|result|fold|dataset|label|ethic|competition|preprint|negative|leak|analysis|model|auc|bias|fairness|clinical|reproduc|calibration/;

export function eventIllustrationFor(event: EventDef): { src: string; theme: EventIllustrationTheme } {
  const searchable = `${event.id} ${event.titleEn ?? ""}`.toLowerCase();
  if (INFRASTRUCTURE.test(searchable)) return { src: infrastructure, theme: "infrastructure" };
  if (PEOPLE.test(searchable)) return { src: people, theme: "people" };
  if (DATA.test(searchable)) return { src: data, theme: "data" };
  return { src: submission, theme: "submission" };
}
