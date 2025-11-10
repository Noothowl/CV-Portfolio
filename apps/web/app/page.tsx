// apps/web/app/page.tsx
export const dynamic = "force-static";

import { getAllProjectFrontMatters } from "@/lib/projects-content";
import type { ProjectFrontMatter, LegacyProject } from "@/types/projects";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import HomeClient from "@/components/HomeClient";
import HomeOverlay from "@/components/HomeOverlay";

function mapMetaToLegacy(meta: ProjectFrontMatter): LegacyProject {
  const thumbnail = meta.media?.hero?.ref ?? "/images/placeholder.jpg";
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

export default function Home() {
  const metas = getAllProjectFrontMatters();

  const sorted = [...metas].sort(
    (a, b) =>
      (Number((b as any).featured ?? 0) - Number((a as any).featured ?? 0)) ||
      (b.period || "").localeCompare(a.period || "")
  );

  const projects: LegacyProject[] = sorted.map(mapMetaToLegacy);
  const allTags = Array.from(
    new Set(sorted.flatMap((m) => m.tags ?? []))
  ).sort();

  return (
    <div>
      <Navbar />

      {/* About */}
      <section className="about">
        <div>
          <div className="bullet-card">
            <strong>About Me</strong>
            <p>
                Hey there! Welcome to my portfolio. Here, I’m showcasing the projects that truly define my skills and my passion for game development.
                I'm a 23-year-old developer actively seeking my first professional experience—a lifelong dream I’ve pursued since I was 6. My passion quickly evolved, leading me to experiment with programming tools and create game mods by the age of 13. Since then, I've developed a strong foundation in GameMaker and Robotics.
                My core focus is on designing dynamic, modular, and scalable game systems. This approach not only offers players diverse possibilities but also ensures efficient content creation. My philosophy is heavily influenced by my love for roguelikes and looters, as I prioritize meaningful progression over excessive grinding.
                Crucially, I blend programming proficiency with a solid foundation in artistic skills like 3D modeling and animation. This mix of technical and creative talent allows me to effectively bridge the gap between code and art and communicate smoothly with every team member.
                I hope you enjoy exploring the interactive project cards below!
            </p>
          </div>
        </div>
      </section>

      {/* Filters + Grid on client */}
      <HomeClient projects={projects} allTags={allTags} />

      {/* Overlay controlled by client (/?project=slug) */}
      <HomeOverlay metas={metas} />

      <Footer />
    </div>
  );
}
