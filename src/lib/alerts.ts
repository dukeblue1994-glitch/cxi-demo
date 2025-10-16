export async function postToSlack(text: string) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return { ok: true, skipped: "slack" };
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  return { ok: true };
}

export async function postToTeams(text: string) {
  const url = process.env.TEAMS_WEBHOOK_URL;
  if (!url) return { ok: true, skipped: "teams" };
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });
  return { ok: true };
}

export function redactEvidence(quotes: string[] = [], k = 0): string[] {
  if (k < 5) return [];
  return quotes.slice(0, 2).map(q => (q.length > 220 ? q.slice(0, 217) + "…" : q));
}


