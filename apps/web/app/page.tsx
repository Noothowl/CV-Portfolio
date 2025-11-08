"use client";

import { useMemo, useState } from "react";
import { projects } from "../data/projects";
import { Card } from "../components/Card";
import { Modal } from "../components/Modal";
import { TagPill } from "../components/TagPill";

export default function Home() {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects
      .filter(p => !q || (p.title + p.summary + (p.tech ?? []).join(" ")).toLowerCase().includes(q))
      .sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  }, [query]);

  const opened = projects.find(p => p.id === openId) ?? null;

  return (
    <div>
      <header style={{display:"flex",gap:16,alignItems:"center",marginBottom:16}}>
        <h1 style={{fontSize:24, fontWeight:800, marginRight:"auto"}}>Portfolio</h1>
        <input
          placeholder="Buscar proyectos…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            background:"var(--bg-subtle)", color:"var(--fg-default)",
            border:"1px solid var(--border-subtle)", borderRadius:10, padding:"8px 12px"
          }}
        />
        <a href="./cv.pdf" target="_blank" rel="noreferrer"
           style={{padding:"8px 12px", border:"1px solid var(--border-subtle)",
                   borderRadius:10, textDecoration:"none"}}>Ver CV</a>
      </header>

      <div className="grid">
        {list.map(p => (
          <Card key={p.id}
            title={p.title}
            thumbnail={p.thumbnail}
            period={p.period ? formatPeriod(p.period) : undefined}
            tags={p.tags}
            onOpen={() => setOpenId(p.id)}
          />
        ))}
      </div>

      <Modal open={!!opened} onClose={() => setOpenId(null)} title={opened?.title}>
        {opened && (
          <div style={{display:"grid", gap:16}}>
            <img src={opened.thumbnail} alt="" style={{width:240, borderRadius:12}} />
            <div style={{color:"var(--fg-muted)"}}>{opened.period && formatPeriod(opened.period)}</div>
            <div className="pills">{opened.tags.map((t,i)=><TagPill key={i} tone={t.tone}>{t.text}</TagPill>)}</div>
            <p style={{whiteSpace:"pre-wrap", lineHeight:1.6}}>{opened.description}</p>
            {opened.tech && (<div><strong>Technologies:</strong> {opened.tech.join(", ")}</div>)}
            {opened.links && (
              <div style={{display:"flex", gap:12, flexWrap:"wrap"}}>
                {opened.links.demo && <a href={opened.links.demo} target="_blank" rel="noreferrer">Demo</a>}
                {opened.links.repo && <a href={opened.links.repo} target="_blank" rel="noreferrer">Repository</a>}
                {opened.links.page && <a href={opened.links.page} target="_blank" rel="noreferrer">Page</a>}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function formatPeriod(p: {start: string; end?: string}) {
  return p.end ? `${p.start} – ${p.end}` : p.start;
}
