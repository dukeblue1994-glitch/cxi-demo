import type { HandlerContext } from "@netlify/functions";
import { lexicon } from "../../src/lib/aspects";
import { compositeCXI, nss } from "../../src/lib/scoring";
import { SummaryEvent } from "../../src/lib/contracts";

export default async (req: Request, _ctx: HandlerContext) => {
  const url = new URL(req.url);
  const text = (url.searchParams.get("text") || "This interview felt a bit slow but the recruiter was very friendly and clear about the role.").trim();
  const words = text.split(/\s+/);

  let pos = 0, neg = 0; const absa: Record<string, number[]> = {};
  for (const k of Object.keys(lexicon)) absa[k] = [];

  const enc = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(enc.encode(`event: ${event}\n`));
        controller.enqueue(enc.encode(`data: ${JSON.stringify(data)}\n\n`));
      };
      const keep = setInterval(() => controller.enqueue(enc.encode(`:keepalive\n\n`)), 10000);
      let i = 0;
      const timer = setInterval(() => {
        if (i >= words.length) {
          clearInterval(timer); clearInterval(keep);
          const vader = (pos - neg) / Math.max(1, pos + neg);
          const means = Object.fromEntries(Object.entries(absa).map(([k,v]) => [k, v.length ? v.reduce((a,b)=>a+b,0)/v.length : 0]));
          const payload = { nss: nss(pos, neg), vader, absa: means, cxi: compositeCXI(nss(pos,neg), vader, means as any) };
          const parsed = SummaryEvent.parse(payload);
          send("summary", parsed);
          controller.close();
          return;
        }
        const w = words[i++];
        const pol = mockPolarity(w);
        if (pol > 0) pos++; else if (pol < 0) neg++;
        const asp = inferAspect(w);
        if (asp) absa[asp].push(pol);
        send("token", { t: w, p: pol, a: asp, i });
      }, 50);
      // @ts-ignore - req is a standard Request with AbortSignal available in Netlify runtime
      req.signal.addEventListener("abort", () => { clearInterval(timer); clearInterval(keep); controller.close(); });
    }
  });

  return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", "Connection": "keep-alive" } });
};

function inferAspect(word: string) {
  const w = word.toLowerCase();
  for (const [aspect, keys] of Object.entries(lexicon)) {
    if (keys.some(k => w.includes(k))) return aspect;
  }
  return null;
}

function mockPolarity(word: string) {
  const wl = word.toLowerCase();
  if (/good|great|clear|friendly|respect/i.test(wl)) return 0.6;
  if (/bad|slow|delay|rude|confus/i.test(wl)) return -0.6;
  return 0;
}
