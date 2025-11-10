// apps/web/types/projects.ts
export type ProjectStatus = "Development" | "Finished" | "Paused";

export type MediaBlock =
  | { type: "gif"; src: string; alt: string }
  | { type: "image"; src: string; alt: string }
  | { type: "gallery"; items: Array<{ src: string; alt: string }> }
  | { type: "youtube"; id: string; title?: string; startSeconds?: number };

export interface ProjectFrontMatter {
  title: string;
  slug: string;
  shortDescription: string;
  period: string;
  tags: string[];
  status: ProjectStatus;

  featured?: boolean;

  media?: {
    hero?: { ref: string };
    gallery?: Array<{ src: string; alt: string }>;
  };
  links?: Array<{ label: string; url: string; kind?: string }>;
}

export type PillTone = "gray" | "green" | "yellow" | "red";
export type LegacyProject = {
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
