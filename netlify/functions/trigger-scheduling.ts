import { postToSlack, postToTeams, redactEvidence } from "../../src/lib/alerts";

type SchedPayload = {
  org: string;
  team: string;
  stage: string;
  reschedule_rate: number;   // 0..1
  baseline_rate: number;     // 0..1
  tz_mismatch_rate?: number; // 0..1
  k?: number;
  evidence?: string[];
  template?: string;
};

export default async (req: Request): Promise<Response> => {
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  const body = (await req.json().catch(() => ({}))) as Partial<SchedPayload>;
  const p = normalize(body);

  const spike = isSpike(p.reschedule_rate, p.baseline_rate) || (p.tz_mismatch_rate ?? 0) > 0.15;
  if (!spike) return json({ ok: true, message: "no spike" });

  const quotes = redactEvidence(p.evidence, p.k);
  const reasons = [
    `Reschedules: ${(p.reschedule_rate * 100).toFixed(1)}% vs baseline ${(p.baseline_rate * 100).toFixed(1)}%`,
    p.tz_mismatch_rate ? `TZ mismatches: ${(p.tz_mismatch_rate * 100).toFixed(1)}%` : null
  ].filter(Boolean).join(" | ");

  const action = p.template
    ? `Use suggested block/template:\n${p.template}`
    : "Action: consolidate interviewer blocks and share a one-click link for candidates in conflicting time zones.";

  const lines = [
    `*CXI Scheduling Friction* — ${p.org} / ${p.team} / ${p.stage}`,
    `• ${reasons}`,
    quotes.length ? `• Evidence:\n> ${quotes.join("\n> ")}` : "• Evidence: (redacted; k < 5)",
    `• ${action}`
  ];
  const text = lines.join("\n");
  await Promise.all([postToSlack(text), postToTeams(text)]);
  return json({ ok: true, sent: true });
};

function isSpike(current: number, baseline: number) {
  if (!isFinite(current) || !isFinite(baseline)) return false;
  const rel = current > baseline * 1.5;
  const abs = current - baseline > 0.10; // +10 percentage points
  return rel || abs;
}

function normalize(inp: Partial<SchedPayload>): Required<SchedPayload> {
  return {
    org: inp.org ?? "Org",
    team: inp.team ?? "Team",
    stage: inp.stage ?? "Stage",
    reschedule_rate: Number(inp.reschedule_rate ?? 0),
    baseline_rate: Number(inp.baseline_rate ?? 0),
    tz_mismatch_rate: Number(inp.tz_mismatch_rate ?? 0),
    k: Number(inp.k ?? 0),
    evidence: inp.evidence ?? [],
    template: inp.template ?? ""
  };
}

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}

