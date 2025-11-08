"use client";

import { useMemo, useState } from "react";
import { projects } from "../data/projects";
import { Card } from "../components/Card";
import { Modal } from "../components/Modal";
import { TagPill } from "../components/TagPill";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { FilterBar } from "../components/FilterBar";

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    projects.forEach(p => p.tags.forEach(t => s.add(t.text)));
    return Array.from(s).sort();
  }, []);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects
      .filter(p => !q || (p.title + p.summary + (p.tech ?? []).join(" ")).toLowerCase().includes(q))
      .filter(p => !activeTag || p.tags.some(t => t.text === activeTag))
      .sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  }, [query, activeTag]);

  const opened = projects.find(p => p.id === openId) ?? null;

  return (
    <div>
      <Navbar />

      {/* About */}
      <section className="about">
        <div>
          <h1 className="display">Martín Jesús Chipoco - Portfolio</h1>
          <p className="dim">Unreal Engine & Software Developer | Computer Engineer</p>
          <div className="bullet-card">
            <strong>Highlights</strong>
            <ul>
              <li>VoD Framework — custom modular UE5 build (GAS, data-driven assets, debug tooling).</li>
              <li>Hospital Gustavo Fricke — WhatsApp contactability (Express + Prisma + PostgreSQL + React).</li>
              <li>Licht Rayders — UE5 indie MVP prototype with modular patterns.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Filters */}
      <FilterBar
        query={query}
        onQuery={setQuery}
        tags={allTags}
        activeTag={activeTag}
        onTag={setActiveTag}
      />

      {/* Grid */}
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

      {/* Modal */}
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

      <Footer />
    </div>
  );
}

function formatPeriod(p: {start: string; end?: string}) {
  return p.end ? `${p.start} – ${p.end}` : p.start;
}
