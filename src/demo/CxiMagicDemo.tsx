import React, { useEffect, useMemo, useRef, useState } from 'react';

const demo = {
  text: 'Recruiter followed up fast but the technical interview felt disorganized and I never got clear next steps.',
  tokens: [
    { t:'Recruiter', aspect:'communication', pol:+0.4, conf:0.82 },
    { t:'followed', aspect:'communication', pol:+0.6, conf:0.86 },
    { t:'up', aspect:'communication', pol:+0.6, conf:0.86 },
    { t:'fast', aspect:'communication', pol:+0.8, conf:0.89 },
    { t:'but', aspect:null, pol:0, conf:1.0 },
    { t:'the', aspect:null, pol:0, conf:1.0 },
    { t:'technical', aspect:'rigor', pol:-0.2, conf:0.74 },
    { t:'interview', aspect:'rigor', pol:-0.2, conf:0.74 },
    { t:'felt', aspect:'rigor', pol:-0.4, conf:0.78 },
    { t:'disorganized', aspect:'clarity', pol:-0.9, conf:0.91 },
    { t:'and', aspect:null, pol:0, conf:1.0 },
    { t:'I', aspect:null, pol:0, conf:1.0 },
    { t:'never', aspect:'followup', pol:-0.7, conf:0.88 },
    { t:'got', aspect:'followup', pol:-0.6, conf:0.86 },
    { t:'clear', aspect:'clarity', pol:-0.7, conf:0.9 },
    { t:'next', aspect:'followup', pol:-0.6, conf:0.86 },
    { t:'steps.', aspect:'followup', pol:-0.6, conf:0.86 }
  ],
  nss: 0.12,
  vader: 0.05,
  aspects: {
    communication: { score: 0.65, samples: 14 },
    clarity: { score: -0.62, samples: 9 },
    fairness: { score: 0.1, samples: 3 },
    rigor: { score: -0.28, samples: 7 },
    followup: { score: -0.61, samples: 11 }
  }
};

function color(pol:number){ if(pol>0.2) return 'text-green'; if(pol<-0.2) return 'text-red'; return 'text-amber'; }
function pct(v:number){ return Math.round(((v+1)/2)*100); }

function MatrixBG(){
  const ref = useRef<HTMLCanvasElement|null>(null);
  useEffect(()=>{
    const c = ref.current!; const x = c.getContext('2d')!; let r=0;
    const glyphs = 'アカサタナハマヤラワ0123456789$#@*/=+'.split('');
    const cols = 80; const drops = new Array(cols).fill(0).map(()=>Math.random()*50);
    const resize = ()=>{ c.width = window.innerWidth; c.height = Math.max(window.innerHeight*0.4,300); };
    resize(); window.addEventListener('resize', resize);
    const draw = ()=>{ x.fillStyle='rgba(2,6,23,0.2)'; x.fillRect(0,0,c.width,c.height); x.fillStyle='rgba(16,185,129,0.75)'; x.font='14px ui-monospace,monospace'; const cw=c.width/cols;
      for(let i=0;i<cols;i++){ const ch=glyphs[Math.floor(Math.random()*glyphs.length)]; const X=i*cw; const Y=drops[i]*18; x.fillText(ch,X,Y); if(Y>c.height&&Math.random()>0.975)drops[i]=0; drops[i]++; }
      r=requestAnimationFrame(draw);
    };
    draw(); return ()=>{ cancelAnimationFrame(r); window.removeEventListener('resize', resize); };
  },[]);
  return <canvas ref={ref} className="matrix" aria-hidden/>;
}

function TokenStream({tokens}:{tokens:{t:string;pol:number;conf:number;aspect:string|null}[]}){
  const [i,setI]=useState(0);
  useEffect(()=>{ const id=setInterval(()=>setI(v=>Math.min(v+1,tokens.length)),80); return ()=>clearInterval(id); },[tokens.length]);
  return <p className="font-mono" aria-live="polite">
    {tokens.slice(0,i).map((w,idx)=> <span key={idx} className={`token ${color(w.pol)}`} title={`${w.aspect??'context'} • pol ${w.pol.toFixed(2)} • conf ${Math.round(w.conf*100)}%`}>{w.t}</span>)}
    {i<tokens.length && <span className="token text-green">▍</span>}
  </p>;
}

function Meter({v}:{v:number}){ return <div className="bar"><i style={{width:`${pct(v)}%`}}/></div>; }

function Aspect({name,score,n}:{name:string;score:number;n:number}){
  return (
    <div className="badge">
      <strong style={{textTransform:'capitalize'}}>{name}</strong>
      <Meter v={score}/>
      <span className="font-mono" style={{fontSize:12}}>{(score>=0?'+':'')+score.toFixed(2)}</span>
      <span style={{opacity:.6,fontSize:10}}>n={n}</span>
    </div>
  );
}

export default function CxiMagicDemo({data=demo}:{data?:typeof demo}){
  const aspects = useMemo(()=>Object.entries(data.aspects),[data.aspects]);
  return (
    <div style={{position:'relative'}}>
      <MatrixBG/>
      <section className="card" style={{position:'relative', zIndex:2, maxWidth:960}}>
        <div className="header">
          <h1>CXI — Candidate Experience <span style={{color:'var(--emerald)'}}>Intelligence</span></h1>
          <p>A 90-second post-interview pulse that turns words into <em>intelligence</em>.
             This demo shows the analysis <strong>as it happens</strong>.</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12,marginTop:16}}>
          <div className="card"><div style={{opacity:.6,fontSize:12,textTransform:'uppercase'}}>NSS</div><div style={{display:'flex',alignItems:'end',gap:8}}><div style={{fontSize:28,fontWeight:800}}>{pct(data.nss)}%</div><div style={{opacity:.6,fontSize:12}}>net polarity</div></div><Meter v={data.nss}/></div>
          <div className="card"><div style={{opacity:.6,fontSize:12,textTransform:'uppercase'}}>VADER</div><div style={{display:'flex',alignItems:'end',gap:8}}><div style={{fontSize:28,fontWeight:800}}>{pct(data.vader)}%</div><div style={{opacity:.6,fontSize:12}}>lexicon compound</div></div><Meter v={data.vader}/></div>
          <div className="card"><div style={{opacity:.6,fontSize:12,textTransform:'uppercase'}}>ABSA (avg)</div><div style={{display:'flex',alignItems:'end',gap:8}}><div style={{fontSize:28,fontWeight:800}}>{pct(aspects.reduce((a,[,v])=>a+v.score,0)/aspects.length)}%</div><div style={{opacity:.6,fontSize:12}}>mean aspect</div></div><Meter v={aspects.reduce((a,[,v])=>a+v.score,0)/aspects.length}/></div>
        </div>
        <div style={{marginTop:16}}>
          <div style={{opacity:.6,fontSize:12,textTransform:'uppercase',marginBottom:6}}>Streaming analysis</div>
          <TokenStream tokens={data.tokens}/>
          <div style={{opacity:.6,fontSize:12,marginTop:6}}>Hover tokens for aspect • polarity • confidence.</div>
        </div>
        <div style={{marginTop:16}}>
          <div style={{opacity:.6,fontSize:12,textTransform:'uppercase',marginBottom:6}}>Aspect intelligence</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:10}}>
            {aspects.map(([k,v])=> <Aspect key={k} name={k} score={v.score} n={v.samples}/>) }
          </div>
        </div>
        <div style={{marginTop:18, display:'flex', gap:8, flexWrap:'wrap'}}>
          <button className="btn">Run on my data</button>
          <button className="btn ghost">See ATS webhook flow</button>
          <button className="btn ghost">Export sample PDF</button>
        </div>
        <p style={{opacity:.6,fontSize:12,marginTop:12}}>Demo illustrates NSS, VADER, and ABSA. In production, data is anonymous by default; webhooks are HMAC-verified; per-tenant salts protect identifiers.</p>
      </section>
    </div>
  );
}
