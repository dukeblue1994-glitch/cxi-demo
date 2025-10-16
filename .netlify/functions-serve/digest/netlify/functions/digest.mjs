
import {createRequire as ___nfyCreateRequire} from "module";
import {fileURLToPath as ___nfyFileURLToPath} from "url";
import {dirname as ___nfyPathDirname} from "path";
let __filename=___nfyFileURLToPath(import.meta.url);
let __dirname=___nfyPathDirname(___nfyFileURLToPath(import.meta.url));
let require=___nfyCreateRequire(import.meta.url);


// netlify/functions/digest.ts
var digest_default = async (req, _ctx) => {
  const dry = new URL(req.url).searchParams.get("dry") === "1";
  const body = await req.json().catch(() => ({}));
  const summary = body?.summary ?? { cxi: 78, top: ["speed", "communication"], sample: "Candidates mention delays in scheduling and unclear updates." };
  if (dry)
    return json({ ok: true, preview: summary });
  const slack = process.env.SLACK_WEBHOOK_URL;
  const teams = process.env.TEAMS_WEBHOOK_URL;
  if (slack)
    await fetch(slack, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: `CXI weekly: ${summary.cxi}
Top issues: ${summary.top.join(", ")}` }) });
  if (teams)
    await fetch(teams, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: `CXI weekly: ${summary.cxi} | Top: ${summary.top.join(", ")}` }) });
  return json({ ok: true });
};
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}
export {
  digest_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibmV0bGlmeS9mdW5jdGlvbnMvZGlnZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJpbXBvcnQgdHlwZSB7IEhhbmRsZXJDb250ZXh0IH0gZnJvbSBcIkBuZXRsaWZ5L2Z1bmN0aW9uc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyAocmVxOiBSZXF1ZXN0LCBfY3R4OiBIYW5kbGVyQ29udGV4dCkgPT4ge1xuICBjb25zdCBkcnkgPSBuZXcgVVJMKHJlcS51cmwpLnNlYXJjaFBhcmFtcy5nZXQoXCJkcnlcIikgPT09IFwiMVwiO1xuICBjb25zdCBib2R5ID0gYXdhaXQgcmVxLmpzb24oKS5jYXRjaCgoKSA9PiAoe30pKTtcbiAgY29uc3Qgc3VtbWFyeSA9IGJvZHk/LnN1bW1hcnkgPz8geyBjeGk6IDc4LCB0b3A6IFtcInNwZWVkXCIsXCJjb21tdW5pY2F0aW9uXCJdLCBzYW1wbGU6IFwiQ2FuZGlkYXRlcyBtZW50aW9uIGRlbGF5cyBpbiBzY2hlZHVsaW5nIGFuZCB1bmNsZWFyIHVwZGF0ZXMuXCIgfTtcbiAgaWYgKGRyeSkgcmV0dXJuIGpzb24oeyBvazogdHJ1ZSwgcHJldmlldzogc3VtbWFyeSB9KTtcblxuICBjb25zdCBzbGFjayA9IHByb2Nlc3MuZW52LlNMQUNLX1dFQkhPT0tfVVJMOyBjb25zdCB0ZWFtcyA9IHByb2Nlc3MuZW52LlRFQU1TX1dFQkhPT0tfVVJMO1xuICBpZiAoc2xhY2spIGF3YWl0IGZldGNoKHNsYWNrLCB7IG1ldGhvZDogXCJQT1NUXCIsIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSwgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB0ZXh0OiBgQ1hJIHdlZWtseTogJHtzdW1tYXJ5LmN4aX1cXG5Ub3AgaXNzdWVzOiAke3N1bW1hcnkudG9wLmpvaW4oXCIsIFwiKX1gIH0pIH0pO1xuICBpZiAodGVhbXMpIGF3YWl0IGZldGNoKHRlYW1zLCB7IG1ldGhvZDogXCJQT1NUXCIsIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSwgYm9keTogSlNPTi5zdHJpbmdpZnkoeyB0ZXh0OiBgQ1hJIHdlZWtseTogJHtzdW1tYXJ5LmN4aX0gfCBUb3A6ICR7c3VtbWFyeS50b3Auam9pbihcIiwgXCIpfWAgfSkgfSk7XG4gIHJldHVybiBqc29uKHsgb2s6IHRydWUgfSk7XG59O1xuXG5mdW5jdGlvbiBqc29uKG9iajogdW5rbm93biwgc3RhdHVzPTIwMCkgeyByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KG9iaiksIHsgc3RhdHVzLCBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0gfSk7IH1cbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7QUFFQSxJQUFPLGlCQUFRLE9BQU8sS0FBYyxTQUF5QjtBQUMzRCxRQUFNLE1BQU0sSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFLGFBQWEsSUFBSSxLQUFLLE1BQU07QUFDekQsUUFBTSxPQUFPLE1BQU0sSUFBSSxLQUFLLEVBQUUsTUFBTSxPQUFPLENBQUMsRUFBRTtBQUM5QyxRQUFNLFVBQVUsTUFBTSxXQUFXLEVBQUUsS0FBSyxJQUFJLEtBQUssQ0FBQyxTQUFRLGVBQWUsR0FBRyxRQUFRLCtEQUErRDtBQUNuSixNQUFJO0FBQUssV0FBTyxLQUFLLEVBQUUsSUFBSSxNQUFNLFNBQVMsUUFBUSxDQUFDO0FBRW5ELFFBQU0sUUFBUSxRQUFRLElBQUk7QUFBbUIsUUFBTSxRQUFRLFFBQVEsSUFBSTtBQUN2RSxNQUFJO0FBQU8sVUFBTSxNQUFNLE9BQU8sRUFBRSxRQUFRLFFBQVEsU0FBUyxFQUFFLGdCQUFnQixtQkFBbUIsR0FBRyxNQUFNLEtBQUssVUFBVSxFQUFFLE1BQU0sZUFBZSxRQUFRLEdBQUc7QUFBQSxjQUFpQixRQUFRLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUN0TSxNQUFJO0FBQU8sVUFBTSxNQUFNLE9BQU8sRUFBRSxRQUFRLFFBQVEsU0FBUyxFQUFFLGdCQUFnQixtQkFBbUIsR0FBRyxNQUFNLEtBQUssVUFBVSxFQUFFLE1BQU0sZUFBZSxRQUFRLEdBQUcsV0FBVyxRQUFRLElBQUksS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUNoTSxTQUFPLEtBQUssRUFBRSxJQUFJLEtBQUssQ0FBQztBQUMxQjtBQUVBLFNBQVMsS0FBSyxLQUFjLFNBQU8sS0FBSztBQUFFLFNBQU8sSUFBSSxTQUFTLEtBQUssVUFBVSxHQUFHLEdBQUcsRUFBRSxRQUFRLFNBQVMsRUFBRSxnQkFBZ0IsbUJBQW1CLEVBQUUsQ0FBQztBQUFHOyIsCiAgIm5hbWVzIjogW10KfQo=
