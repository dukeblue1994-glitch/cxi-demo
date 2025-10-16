
import {createRequire as ___nfyCreateRequire} from "module";
import {fileURLToPath as ___nfyFileURLToPath} from "url";
import {dirname as ___nfyPathDirname} from "path";
let __filename=___nfyFileURLToPath(import.meta.url);
let __dirname=___nfyPathDirname(___nfyFileURLToPath(import.meta.url));
let require=___nfyCreateRequire(import.meta.url);


// src/lib/aspects.ts
var lexicon = {
  communication: ["communicat", "response", "update"],
  speed: ["slow", "delay", "wait", "SLA"],
  clarity: ["clear", "expectation", "role"],
  professionalism: ["respect", "rude", "friendly"],
  logistics: ["schedule", "reschedule", "timezone"],
  tech: ["zoom", "teams", "mic", "camera"]
};

// src/lib/scoring.ts
function nss(posCount, negCount) {
  const total = Math.max(1, posCount + negCount);
  return (posCount - negCount) / total * 100;
}
function compositeCXI(nssVal, vader, absa) {
  const absaVals = Object.values(absa);
  const absaMean = absaVals.length ? absaVals.reduce((a, b) => a + b, 0) / absaVals.length : 0;
  const raw = 0.4 * (nssVal / 100) + 0.3 * absaMean + 0.3 * vader;
  const clamped = Math.max(-1, Math.min(1, raw));
  return Math.round((clamped + 1) / 2 * 100);
}

// src/lib/contracts.ts
import { z } from "zod";
var Aspect = z.enum(["communication", "speed", "clarity", "professionalism", "logistics", "tech"]);
var TokenEvent = z.object({ t: z.string(), p: z.number().min(-1).max(1), a: Aspect.nullish(), i: z.number().int().min(0) });
var SummaryEvent = z.object({ nss: z.number().min(-100).max(100), vader: z.number().min(-1).max(1), absa: z.record(Aspect, z.number().min(-1).max(1)), cxi: z.number().min(0).max(100) });

// netlify/functions/stream-analysis.ts
var stream_analysis_default = async (req, _ctx) => {
  const url = new URL(req.url);
  const text = (url.searchParams.get("text") || "This interview felt a bit slow but the recruiter was very friendly and clear about the role.").trim();
  const words = text.split(/\s+/);
  let pos = 0, neg = 0;
  const absa = {};
  for (const k of Object.keys(lexicon))
    absa[k] = [];
  const enc = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const send = (event, data) => {
        controller.enqueue(enc.encode(`event: ${event}
`));
        controller.enqueue(enc.encode(`data: ${JSON.stringify(data)}

`));
      };
      const keep = setInterval(() => controller.enqueue(enc.encode(`:keepalive

`)), 1e4);
      let i = 0;
      const timer = setInterval(() => {
        if (i >= words.length) {
          clearInterval(timer);
          clearInterval(keep);
          const vader = (pos - neg) / Math.max(1, pos + neg);
          const means = Object.fromEntries(Object.entries(absa).map(([k, v]) => [k, v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0]));
          const payload = { nss: nss(pos, neg), vader, absa: means, cxi: compositeCXI(nss(pos, neg), vader, means) };
          const parsed = SummaryEvent.parse(payload);
          send("summary", parsed);
          controller.close();
          return;
        }
        const w = words[i++];
        const pol = mockPolarity(w);
        if (pol > 0)
          pos++;
        else if (pol < 0)
          neg++;
        const asp = inferAspect(w);
        if (asp)
          absa[asp].push(pol);
        send("token", { t: w, p: pol, a: asp, i });
      }, 50);
      req.signal.addEventListener("abort", () => {
        clearInterval(timer);
        clearInterval(keep);
        controller.close();
      });
    }
  });
  return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", "Connection": "keep-alive" } });
};
function inferAspect(word) {
  const w = word.toLowerCase();
  for (const [aspect, keys] of Object.entries(lexicon)) {
    if (keys.some((k) => w.includes(k)))
      return aspect;
  }
  return null;
}
function mockPolarity(word) {
  const wl = word.toLowerCase();
  if (/good|great|clear|friendly|respect/i.test(wl))
    return 0.6;
  if (/bad|slow|delay|rude|confus/i.test(wl))
    return -0.6;
  return 0;
}
export {
  stream_analysis_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2xpYi9hc3BlY3RzLnRzIiwgInNyYy9saWIvc2NvcmluZy50cyIsICJzcmMvbGliL2NvbnRyYWN0cy50cyIsICJuZXRsaWZ5L2Z1bmN0aW9ucy9zdHJlYW0tYW5hbHlzaXMudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB0eXBlIHsgQXNwZWN0IH0gZnJvbSBcIi4vY29udHJhY3RzXCI7XG5leHBvcnQgdHlwZSBLZXl3b3JkTGV4ID0gUmVjb3JkPEFzcGVjdCwgc3RyaW5nW10+O1xuZXhwb3J0IGNvbnN0IGxleGljb246IEtleXdvcmRMZXggPSB7XG4gIGNvbW11bmljYXRpb246IFtcImNvbW11bmljYXRcIiwgXCJyZXNwb25zZVwiLCBcInVwZGF0ZVwiXSxcbiAgc3BlZWQ6IFtcInNsb3dcIiwgXCJkZWxheVwiLCBcIndhaXRcIiwgXCJTTEFcIl0sXG4gIGNsYXJpdHk6IFtcImNsZWFyXCIsIFwiZXhwZWN0YXRpb25cIiwgXCJyb2xlXCJdLFxuICBwcm9mZXNzaW9uYWxpc206IFtcInJlc3BlY3RcIiwgXCJydWRlXCIsIFwiZnJpZW5kbHlcIl0sXG4gIGxvZ2lzdGljczogW1wic2NoZWR1bGVcIiwgXCJyZXNjaGVkdWxlXCIsIFwidGltZXpvbmVcIl0sXG4gIHRlY2g6IFtcInpvb21cIiwgXCJ0ZWFtc1wiLCBcIm1pY1wiLCBcImNhbWVyYVwiXVxufTtcbiIsICJpbXBvcnQgdHlwZSB7IEFzcGVjdCB9IGZyb20gXCIuL2NvbnRyYWN0c1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gbnNzKHBvc0NvdW50OiBudW1iZXIsIG5lZ0NvdW50OiBudW1iZXIpIHtcbiAgY29uc3QgdG90YWwgPSBNYXRoLm1heCgxLCBwb3NDb3VudCArIG5lZ0NvdW50KTtcbiAgcmV0dXJuICgocG9zQ291bnQgLSBuZWdDb3VudCkgLyB0b3RhbCkgKiAxMDA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wb3NpdGVDWEkobnNzVmFsOiBudW1iZXIsIHZhZGVyOiBudW1iZXIsIGFic2E6IFJlY29yZDxBc3BlY3QsIG51bWJlcj4pIHtcbiAgY29uc3QgYWJzYVZhbHMgPSBPYmplY3QudmFsdWVzKGFic2EpO1xuICBjb25zdCBhYnNhTWVhbiA9IGFic2FWYWxzLmxlbmd0aCA/IGFic2FWYWxzLnJlZHVjZSgoYSxiKT0+YStiLDApL2Fic2FWYWxzLmxlbmd0aCA6IDA7XG4gIGNvbnN0IHJhdyA9IDAuNCAqIChuc3NWYWwvMTAwKSArIDAuMyAqIGFic2FNZWFuICsgMC4zICogdmFkZXI7IC8vIC0xLi4xXG4gIGNvbnN0IGNsYW1wZWQgPSBNYXRoLm1heCgtMSwgTWF0aC5taW4oMSwgcmF3KSk7XG4gIHJldHVybiBNYXRoLnJvdW5kKCgoY2xhbXBlZCArIDEpIC8gMikgKiAxMDApO1xufVxuIiwgImltcG9ydCB7IHogfSBmcm9tIFwiem9kXCI7XG5leHBvcnQgY29uc3QgQXNwZWN0ID0gei5lbnVtKFtcImNvbW11bmljYXRpb25cIixcInNwZWVkXCIsXCJjbGFyaXR5XCIsXCJwcm9mZXNzaW9uYWxpc21cIixcImxvZ2lzdGljc1wiLFwidGVjaFwiXSk7XG5leHBvcnQgdHlwZSBBc3BlY3QgPSB6LmluZmVyPHR5cGVvZiBBc3BlY3Q+O1xuXG5leHBvcnQgY29uc3QgVG9rZW5FdmVudCA9IHoub2JqZWN0KHsgdDogei5zdHJpbmcoKSwgcDogei5udW1iZXIoKS5taW4oLTEpLm1heCgxKSwgYTogQXNwZWN0Lm51bGxpc2goKSwgaTogei5udW1iZXIoKS5pbnQoKS5taW4oMCkgfSk7XG5leHBvcnQgY29uc3QgU3VtbWFyeUV2ZW50ID0gei5vYmplY3QoeyBuc3M6IHoubnVtYmVyKCkubWluKC0xMDApLm1heCgxMDApLCB2YWRlcjogei5udW1iZXIoKS5taW4oLTEpLm1heCgxKSwgYWJzYTogei5yZWNvcmQoQXNwZWN0LCB6Lm51bWJlcigpLm1pbigtMSkubWF4KDEpKSwgY3hpOiB6Lm51bWJlcigpLm1pbigwKS5tYXgoMTAwKSB9KTtcbmV4cG9ydCB0eXBlIFRva2VuRXZlbnQgPSB6LmluZmVyPHR5cGVvZiBUb2tlbkV2ZW50PjtcbmV4cG9ydCB0eXBlIFN1bW1hcnlFdmVudCA9IHouaW5mZXI8dHlwZW9mIFN1bW1hcnlFdmVudD47XG4iLCAiaW1wb3J0IHR5cGUgeyBIYW5kbGVyQ29udGV4dCB9IGZyb20gXCJAbmV0bGlmeS9mdW5jdGlvbnNcIjtcbmltcG9ydCB7IGxleGljb24gfSBmcm9tIFwiLi4vLi4vc3JjL2xpYi9hc3BlY3RzXCI7XG5pbXBvcnQgeyBjb21wb3NpdGVDWEksIG5zcyB9IGZyb20gXCIuLi8uLi9zcmMvbGliL3Njb3JpbmdcIjtcbmltcG9ydCB7IFN1bW1hcnlFdmVudCB9IGZyb20gXCIuLi8uLi9zcmMvbGliL2NvbnRyYWN0c1wiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyAocmVxOiBSZXF1ZXN0LCBfY3R4OiBIYW5kbGVyQ29udGV4dCkgPT4ge1xuICBjb25zdCB1cmwgPSBuZXcgVVJMKHJlcS51cmwpO1xuICBjb25zdCB0ZXh0ID0gKHVybC5zZWFyY2hQYXJhbXMuZ2V0KFwidGV4dFwiKSB8fCBcIlRoaXMgaW50ZXJ2aWV3IGZlbHQgYSBiaXQgc2xvdyBidXQgdGhlIHJlY3J1aXRlciB3YXMgdmVyeSBmcmllbmRseSBhbmQgY2xlYXIgYWJvdXQgdGhlIHJvbGUuXCIpLnRyaW0oKTtcbiAgY29uc3Qgd29yZHMgPSB0ZXh0LnNwbGl0KC9cXHMrLyk7XG5cbiAgbGV0IHBvcyA9IDAsIG5lZyA9IDA7IGNvbnN0IGFic2E6IFJlY29yZDxzdHJpbmcsIG51bWJlcltdPiA9IHt9O1xuICBmb3IgKGNvbnN0IGsgb2YgT2JqZWN0LmtleXMobGV4aWNvbikpIGFic2Fba10gPSBbXTtcblxuICBjb25zdCBlbmMgPSBuZXcgVGV4dEVuY29kZXIoKTtcbiAgY29uc3Qgc3RyZWFtID0gbmV3IFJlYWRhYmxlU3RyZWFtPFVpbnQ4QXJyYXk+KHtcbiAgICBzdGFydChjb250cm9sbGVyKSB7XG4gICAgICBjb25zdCBzZW5kID0gKGV2ZW50OiBzdHJpbmcsIGRhdGE6IHVua25vd24pID0+IHtcbiAgICAgICAgY29udHJvbGxlci5lbnF1ZXVlKGVuYy5lbmNvZGUoYGV2ZW50OiAke2V2ZW50fVxcbmApKTtcbiAgICAgICAgY29udHJvbGxlci5lbnF1ZXVlKGVuYy5lbmNvZGUoYGRhdGE6ICR7SlNPTi5zdHJpbmdpZnkoZGF0YSl9XFxuXFxuYCkpO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IGtlZXAgPSBzZXRJbnRlcnZhbCgoKSA9PiBjb250cm9sbGVyLmVucXVldWUoZW5jLmVuY29kZShgOmtlZXBhbGl2ZVxcblxcbmApKSwgMTAwMDApO1xuICAgICAgbGV0IGkgPSAwO1xuICAgICAgY29uc3QgdGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGlmIChpID49IHdvcmRzLmxlbmd0aCkge1xuICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpOyBjbGVhckludGVydmFsKGtlZXApO1xuICAgICAgICAgIGNvbnN0IHZhZGVyID0gKHBvcyAtIG5lZykgLyBNYXRoLm1heCgxLCBwb3MgKyBuZWcpO1xuICAgICAgICAgIGNvbnN0IG1lYW5zID0gT2JqZWN0LmZyb21FbnRyaWVzKE9iamVjdC5lbnRyaWVzKGFic2EpLm1hcCgoW2ssdl0pID0+IFtrLCB2Lmxlbmd0aCA/IHYucmVkdWNlKChhLGIpPT5hK2IsMCkvdi5sZW5ndGggOiAwXSkpO1xuICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSB7IG5zczogbnNzKHBvcywgbmVnKSwgdmFkZXIsIGFic2E6IG1lYW5zLCBjeGk6IGNvbXBvc2l0ZUNYSShuc3MocG9zLG5lZyksIHZhZGVyLCBtZWFucyBhcyBhbnkpIH07XG4gICAgICAgICAgY29uc3QgcGFyc2VkID0gU3VtbWFyeUV2ZW50LnBhcnNlKHBheWxvYWQpO1xuICAgICAgICAgIHNlbmQoXCJzdW1tYXJ5XCIsIHBhcnNlZCk7XG4gICAgICAgICAgY29udHJvbGxlci5jbG9zZSgpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB3ID0gd29yZHNbaSsrXTtcbiAgICAgICAgY29uc3QgcG9sID0gbW9ja1BvbGFyaXR5KHcpO1xuICAgICAgICBpZiAocG9sID4gMCkgcG9zKys7IGVsc2UgaWYgKHBvbCA8IDApIG5lZysrO1xuICAgICAgICBjb25zdCBhc3AgPSBpbmZlckFzcGVjdCh3KTtcbiAgICAgICAgaWYgKGFzcCkgYWJzYVthc3BdLnB1c2gocG9sKTtcbiAgICAgICAgc2VuZChcInRva2VuXCIsIHsgdDogdywgcDogcG9sLCBhOiBhc3AsIGkgfSk7XG4gICAgICB9LCA1MCk7XG4gICAgICAvLyBAdHMtaWdub3JlIC0gcmVxIGlzIGEgc3RhbmRhcmQgUmVxdWVzdCB3aXRoIEFib3J0U2lnbmFsIGF2YWlsYWJsZSBpbiBOZXRsaWZ5IHJ1bnRpbWVcbiAgICAgIHJlcS5zaWduYWwuYWRkRXZlbnRMaXN0ZW5lcihcImFib3J0XCIsICgpID0+IHsgY2xlYXJJbnRlcnZhbCh0aW1lcik7IGNsZWFySW50ZXJ2YWwoa2VlcCk7IGNvbnRyb2xsZXIuY2xvc2UoKTsgfSk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gbmV3IFJlc3BvbnNlKHN0cmVhbSwgeyBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwidGV4dC9ldmVudC1zdHJlYW1cIiwgXCJDYWNoZS1Db250cm9sXCI6IFwibm8tY2FjaGVcIiwgXCJDb25uZWN0aW9uXCI6IFwia2VlcC1hbGl2ZVwiIH0gfSk7XG59O1xuXG5mdW5jdGlvbiBpbmZlckFzcGVjdCh3b3JkOiBzdHJpbmcpIHtcbiAgY29uc3QgdyA9IHdvcmQudG9Mb3dlckNhc2UoKTtcbiAgZm9yIChjb25zdCBbYXNwZWN0LCBrZXlzXSBvZiBPYmplY3QuZW50cmllcyhsZXhpY29uKSkge1xuICAgIGlmIChrZXlzLnNvbWUoayA9PiB3LmluY2x1ZGVzKGspKSkgcmV0dXJuIGFzcGVjdDtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gbW9ja1BvbGFyaXR5KHdvcmQ6IHN0cmluZykge1xuICBjb25zdCB3bCA9IHdvcmQudG9Mb3dlckNhc2UoKTtcbiAgaWYgKC9nb29kfGdyZWF0fGNsZWFyfGZyaWVuZGx5fHJlc3BlY3QvaS50ZXN0KHdsKSkgcmV0dXJuIDAuNjtcbiAgaWYgKC9iYWR8c2xvd3xkZWxheXxydWRlfGNvbmZ1cy9pLnRlc3Qod2wpKSByZXR1cm4gLTAuNjtcbiAgcmV0dXJuIDA7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7O0FBRU8sSUFBTSxVQUFzQjtBQUFBLEVBQ2pDLGVBQWUsQ0FBQyxjQUFjLFlBQVksUUFBUTtBQUFBLEVBQ2xELE9BQU8sQ0FBQyxRQUFRLFNBQVMsUUFBUSxLQUFLO0FBQUEsRUFDdEMsU0FBUyxDQUFDLFNBQVMsZUFBZSxNQUFNO0FBQUEsRUFDeEMsaUJBQWlCLENBQUMsV0FBVyxRQUFRLFVBQVU7QUFBQSxFQUMvQyxXQUFXLENBQUMsWUFBWSxjQUFjLFVBQVU7QUFBQSxFQUNoRCxNQUFNLENBQUMsUUFBUSxTQUFTLE9BQU8sUUFBUTtBQUN6Qzs7O0FDUE8sU0FBUyxJQUFJLFVBQWtCLFVBQWtCO0FBQ3RELFFBQU0sUUFBUSxLQUFLLElBQUksR0FBRyxXQUFXLFFBQVE7QUFDN0MsVUFBUyxXQUFXLFlBQVksUUFBUztBQUMzQztBQUVPLFNBQVMsYUFBYSxRQUFnQixPQUFlLE1BQThCO0FBQ3hGLFFBQU0sV0FBVyxPQUFPLE9BQU8sSUFBSTtBQUNuQyxRQUFNLFdBQVcsU0FBUyxTQUFTLFNBQVMsT0FBTyxDQUFDLEdBQUUsTUFBSSxJQUFFLEdBQUUsQ0FBQyxJQUFFLFNBQVMsU0FBUztBQUNuRixRQUFNLE1BQU0sT0FBTyxTQUFPLE9BQU8sTUFBTSxXQUFXLE1BQU07QUFDeEQsUUFBTSxVQUFVLEtBQUssSUFBSSxJQUFJLEtBQUssSUFBSSxHQUFHLEdBQUcsQ0FBQztBQUM3QyxTQUFPLEtBQUssT0FBUSxVQUFVLEtBQUssSUFBSyxHQUFHO0FBQzdDOzs7QUNiQSxTQUFTLFNBQVM7QUFDWCxJQUFNLFNBQVMsRUFBRSxLQUFL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
