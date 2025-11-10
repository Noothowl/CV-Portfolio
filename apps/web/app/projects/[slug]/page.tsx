import { listProjectSlugs, readProjectFrontMatter, getAllProjectFrontMatters } from "@/lib/projects-content";
import type { ProjectFrontMatter, LegacyProject } from "@/types/projects";
import { publicPath } from "@/lib/publicPath";
import { Card } from "@/components/Card";
import { Navbar } from "@/components//Navbar";
import { Footer } from "@/components//Footer";
import BackButton from "@/components/BackButton";

type Params = { params: { slug: string } };

export function generateStaticParams() {
  const slugs = listProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}


function mapMetaToLegacy(meta: ProjectFrontMatter): LegacyProject {
  const thumbnail = meta.media?.hero?.ref
    ? publicPath(meta.media.hero.ref)      // 👈 aquí
    : publicPath("/images/placeholder.jpg");

  return {
    id: meta.slug,
    title: meta.title,
    period: { start: meta.period },
    thumbnail,
    summary: meta.shortDescription,
    description: "",
    tags: meta.tags.map((t) => ({ text: t })),
    links: { page: `/projects/${meta.slug}` },
  };
}


export default function ProjectDetail({ params }: Params) {
  const slug = decodeURIComponent((params?.slug ?? "").toString());
  const meta = readProjectFrontMatter(slug);
  if (!meta) return <div style={{ padding: 24 }}>Project not found.</div>;

  return (
    <main className="container">
      {
        //ToDO: Navbar
      }
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <BackButton fallback="/projects" />
        <h1 className="card__title" style={{ margin: 0 }}>{meta.title}</h1>
      </div>

      {
        //ToDO: Hero/Container
      }
      <div className="card">
        <div className="card__thumb">
          <img src={meta.media?.hero?.ref ?? "/images/placeholder.jpg"} alt={meta.title} />
        </div>
        <div className="card__body">
          <p className="card__meta">{meta.period}</p>
          {meta.tags?.length ? (
            <div className="tags" style={{ marginBottom: 12 }}>
              {meta.tags.map((t, i) => <span key={i} className="pill gray">{t}</span>)}
            </div>
          ) : null}
          <p className="dim">{meta.shortDescription}</p>
        </div>
      </div>
    </main>
  );
}