import { z } from "zod";
export const Aspect = z.enum(["communication","speed","clarity","professionalism","logistics","tech"]);
export type Aspect = z.infer<typeof Aspect>;

export const TokenEvent = z.object({ t: z.string(), p: z.number().min(-1).max(1), a: Aspect.nullish(), i: z.number().int().min(0) });
export const SummaryEvent = z.object({ nss: z.number().min(-100).max(100), vader: z.number().min(-1).max(1), absa: z.record(Aspect, z.number().min(-1).max(1)), cxi: z.number().min(0).max(100) });
export type TokenEvent = z.infer<typeof TokenEvent>;
export type SummaryEvent = z.infer<typeof SummaryEvent>;
