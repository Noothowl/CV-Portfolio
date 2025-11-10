// apps/web/app/components/HomeClient.tsx
"use client";

import { useMemo, useState } from "react";
import type { LegacyProject } from "@/types/projects";
import { Card } from "@/components/Card";
import { FilterBar } from "@/components/FilterBar";

export default function HomeClient({
  projects,
  allTags,
}: {
  projects: LegacyProject[];
  allTags: string[];
}) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects
      .filter((p) =>
        !q ||
        (p.title + p.summary + (p.tech ?? []).join(" "))
          .toLowerCase()
          .includes(q)
      )
      .filter((p) => !activeTag || p.tags?.some((t) => t.text === activeTag));
  }, [projects, query, activeTag]);

  return (
    <>
      <FilterBar
        query={query}
        onQuery={setQuery}
        tags={allTags}
        activeTag={activeTag}
        onTag={setActiveTag}
      />

      <div className="projects-grid">
        {list.map((p) => (
          <Card
            key={p.id}
            title={p.title}
            thumbnail={p.thumbnail}
            period={p.period?.start}
            tags={p.tags}
            href={`/?project=${p.id}`}   // ← overlay en Home
          />
        ))}
      </div>
    </>
  );
}
