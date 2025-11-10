// Reworked pill
import React from "react";
import type { ProjectStatus } from "../types/projects";

type PillTone = "gray" | "green" | "yellow" | "red";

interface TagPillProps {
  children: React.ReactNode;
  tone?: PillTone;          // Compatibility with old tags
  status?: ProjectStatus;   // new color status
  active?: boolean;
  onClick?: () => void;
}

export function TagPill({ children, tone = "gray", status, active, onClick }: TagPillProps) {
  // Map by status with CSS vars 
  const style =
    status === "Finished"
      ? { background: "var(--tag-finished-bg)", color: "var(--tag-finished-text)" }
      : status === "Development"
      ? { background: "var(--tag-development-bg)", color: "var(--tag-development-text)" }
      : status === "Paused"
      ? { background: "var(--tag-paused-bg)", color: "var(--tag-paused-text)" }
      : undefined;

  const className = [
    "pill",
    status ? "pill--status" : `pill--${tone}`,
    active ? "is-active" : ""
  ].join(" ").trim();

  return (
    <button className={className} style={style} onClick={onClick}>
      {children}
    </button>
  );
}
