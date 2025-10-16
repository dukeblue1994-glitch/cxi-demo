import type { Aspect } from "./contracts";
export type KeywordLex = Record<Aspect, string[]>;
export const lexicon: KeywordLex = {
  communication: ["communicat", "response", "update"],
  speed: ["slow", "delay", "wait", "SLA"],
  clarity: ["clear", "expectation", "role"],
  professionalism: ["respect", "rude", "friendly"],
  logistics: ["schedule", "reschedule", "timezone"],
  tech: ["zoom", "teams", "mic", "camera"]
};
