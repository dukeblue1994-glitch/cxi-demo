import { postToSlack, postToTeams, redactEvidence } from "../../src/lib/alerts";

type SlaPayload = {
  org: string;
  team: string;
  stage: string;
  avg_reply_hours?: number;
  avg_feedback_delay_hours?: number;
  threshold_hours?: number;
  k?: number;
  evidence?: string[];
};

export default async (req: Request): Promise<Response> => {
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  const body = (await req.json().catch(() => ({}))) as Partial<SlaPayload>;
  const p = normalize(body);

  const breaches: string[] = [];
  if (p.avg_reply_hours > p.threshold_hours) {
    breaches.push(`Reply SLA ${p.avg_reply_hours}h > ${p.threshold_hours}h`);
  }
  if (p.avg_feedback_delay_hours > p.threshold_hours) {
    breaches.push(`Feedback SLA ${p.avg_feedback_delay_hours}h > ${p.threshold_hours}h`);
  }

  if (!breaches.length) return json({ ok: true, message: "no breach" });

  const quotes = redactEvidence(p.evidence, p.k);
  const lines = [
    `*CXI SLA Watchdog* — ${p.org} / ${p.team} / ${p.stage}`,
    `• ${breaches.join(" & ")}`,
    quotes.length ? `• Evidence:\n> ${quotes.join("\n> ")}` : "• Evidence: (redacted; k < 5)",
    `• Action: nudge panel chair and recruiter to close feedback loops today.`
  ];
  const text = lines.join("\n");
  await Promise.all([postToSlack(text), postToTeams(text)]);
  return json({ ok: true, breaches, sent: true });
};

function normalize(inp: Partial<SlaPayload>): Required<SlaPayload> {
  return {
    org: inp.org ?? "Org",
    team: inp.team ?? "Team",
    stage: inp.stage ?? "Stage",
    avg_reply_hours: Number(inp.avg_reply_hours ?? 0),
    avg_feedback_delay_hours: Number(inp.avg_feedback_delay_hours ?? 0),
    threshold_hours: Number(inp.threshold_hours ?? 24),
    k: Number(inp.k ?? 0),
    evidence: inp.evidence ?? []
  };
}

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}


