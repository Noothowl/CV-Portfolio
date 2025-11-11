"use client";

import { publicPath } from "@/lib/publicPath";
import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { ProjectFrontMatter } from "@/types/projects";

export default function HomeOverlay({ metas }: { metas: ProjectFrontMatter[] }) {
  const sp = useSearchParams();
  const router = useRouter();
  const slug = sp.get("project") ?? "";

  const meta = useMemo(() => metas.find((m) => m.slug === slug) ?? null, [metas, slug]);
  if (!meta) return null;

  const close = () => router.push("/", { scroll: false });

  return (
    <div
      className="backdrop"
      role="dialog"
      aria-modal="true"
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div className="modal">
        <div className="modal-head">
          <h2 style={{ margin: 0, flex: 1 }}>{meta.title}</h2>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link href={`/projects/${meta.slug}`} className="btn-primary">Full Screen Display</Link>
            <button className="btn-secondary" onClick={close}>Close</button>
          </div>
        </div>

        <div className="modal-body">
          <div className="card__thumb" style={{ marginBottom: 12 }}>
            <img
                  src={publicPath(meta.media?.hero?.ref) || publicPath("/images/placeholder.jpg")}
                  alt={meta.title}
             loading="lazy" decoding="async" draggable="false"/>
          </div>

          <p className="card__meta">{meta.period}</p>

          {meta.tags?.length ? (
            <div className="tags tags--mb">
              {meta.tags.map((t, i) => (
                <span key={i} className="pill gray">{t}</span>
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
