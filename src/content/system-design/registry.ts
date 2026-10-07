import type { SystemDesign } from "./types";
import { dukaandost } from "./dukaandost";
import { opensourceBuddy } from "./opensource-buddy";
import { voxtube } from "./voxtube";
import { squadup } from "./squadup";
import { littlebits } from "./littlebits";
import { campusTour } from "./campus-tour";
import { cyberRunner } from "./cyber-runner";

export const designs: Record<string, SystemDesign> = {
  "dukaandost-ai": dukaandost,
  "opensource-buddy": opensourceBuddy,
  voxtube,
  squadup,
  littlebits,
  "campus-tour": campusTour,
  "cyber-runner": cyberRunner,
};
