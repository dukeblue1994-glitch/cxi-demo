import type { HandlerContext } from "@netlify/functions";

export default async (req: Request, _ctx: HandlerContext) => {
  const dry = new URL(req.url).searchParams.get("dry") === "1";
  const body = await req.json().catch(() => ({}));
  const summary = body?.summary ?? { cxi: 78, top: ["speed","communication"], sample: "Candidates mention delays in scheduling and unclear updates." };
  if (dry) return json({ ok: true, preview: summary });

  const slack = process.env.SLACK_WEBHOOK_URL; const teams = process.env.TEAMS_WEBHOOK_URL;
  if (slack) await fetch(slack, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: `CXI weekly: ${summary.cxi}\nTop issues: ${summary.top.join(", ")}` }) });
  if (teams) await fetch(teams, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: `CXI weekly: ${summary.cxi} | Top: ${summary.top.join(", ")}` }) });
  return json({ ok: true });
};

function json(obj: unknown, status=200) { return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } }); }
