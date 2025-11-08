// apps/web/data/projects.ts

export type PillTone = "gray" | "green" | "yellow" | "red";

export type Project = {
  id: string;
  title: string;
  period?: { start: string; end?: string };
  thumbnail: string;
  summary: string;
  description: string;
  tags: Array<{ text: string; tone?: PillTone }>;
  tech?: string[];
  links?: { repo?: string; demo?: string; page?: string };
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: "licht-rayders",
    title: "Licht Rayders – UE",
    period: { start: "2025-05", end: "2025-06" },
    thumbnail: "images/placeholder.jpg",
    summary: "Short-form gameplay prototype demonstrating modular systems.",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.",
    tags: [
      { text: "Game", tone: "green" },
      { text: "Project", tone: "gray" },
      { text: "Technical", tone: "yellow" }
    ],
    tech: ["Unreal Engine", "GAS", "C++"],
    links: { demo: "#", repo: "#" },
    featured: true
  },
  {
    id: "noothowl-vault",
    title: "Noothowl Vault – Blender",
    period: { start: "2022", end: "2023" },
    thumbnail: "/images/placeholder.jpg",
    summary: "Stylized assets and quick prototyping vault.",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede.",
    tags: [
      { text: "Learning", tone: "yellow" },
      { text: "Personal", tone: "gray" }
    ],
    tech: ["Blender", "IbisPaintX"]
  }
];
