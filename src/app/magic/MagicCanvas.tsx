import { useEffect, useRef, useState } from "react";
import type { TokenEvent, SummaryEvent } from "@lib/contracts";

export default function MagicCanvas() {
  const [tokens, setTokens] = useState<TokenEvent[]>([]);
  const [summary, setSummary] = useState<SummaryEvent | null>(null);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource("/.netlify/functions/stream-analysis?text=" + encodeURIComponent(DEMO_TEXT));
    esRef.current = es;
    es.addEventListener("token", (e) => setTokens(t => [...t, JSON.parse((e as MessageEvent).data)]));
    es.addEventListener("summary", (e) => setSummary(JSON.parse((e as MessageEvent).data)));
    es.onerror = () => { es.close(); };
    return () => es.close();
  }, []);

  return (
    <div className="p-6 space-y-3">
      <div className="text-xl">Magic Mode</div>
      <div className="border rounded p-3 min-h-[200px]">
        {tokens.map((t,i) => (<span key={i} className="mr-1 underline-offset-2" title={`${t.a ?? ""} ${t.p}`}>{t.t}</span>))}
      </div>
      <pre className="bg-gray-50 p-3 rounded">{JSON.stringify(summary, null, 2)}</pre>
    </div>
  );
}

const DEMO_TEXT = "The interviewer was friendly and clear but scheduling was slow and I waited too long for updates.";
