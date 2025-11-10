// apps/web/components/ProjectsOverlay.tsx
"use client";

import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { ProjectFrontMatter } from "@/types/projects";

export default function ProjectsOverlay({ metas }: { metas: ProjectFrontMatter[] }) {
  const sp = useSearchParams();
  const router = useRouter();
  const slug = sp.get("project") ?? "";

  const meta = useMemo(
    () => metas.find((m) => m.slug === slug) ?? null,
    [metas, slug]
  );

  if (!meta) return null;

  return (
    <div
      className="backdrop"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          router.push("/projects", { scroll: false });
        }
      }}
    >
      <div className="modal">
        <div className="modal-head">
           <h2 style={{ margin: 0, flex: 1 }}>{meta.title}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Link href={`/projects/${meta.slug}`} className="btn-primary">
                    Full Screen Display
                </Link>
                <button className="modal-close" onClick={close} aria-label="Close">
                    Close
                </button>
  </div>
        </div>

        <div className="modal-body">
          <div className="card__thumb" style={{ marginBottom: 12 }}>
            <img
              src={meta.media?.hero?.ref ?? "/images/placeholder.jpg"}
              alt={meta.title}
            />
          </div>

          <p className="card__meta">{meta.period}</p>

          {meta.tags?.length ? (
            <div className="tags" style={{ marginBottom: 12 }}>
              {meta.tags.map((t, i) => (
                <span key={i} className="pill gray">
                  {t}
                </span>
              ))}
            </div>
          ) : null}

          <p className="dim" style={{ marginBottom: 16 }}>
            {meta.shortDescription}
          </p>
        </div>
      </div>
    </div>
  );
}
