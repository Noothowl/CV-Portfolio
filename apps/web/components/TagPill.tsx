import * as React from "react";

type TagTone = "gray" | "green" | "yellow" | "red" | "blue" | "purple";

interface TagPillProps {
  children: React.ReactNode;
  tone?: TagTone;
  className?: string;
}

export function TagPill({ children, tone = "gray", className }: TagPillProps) {
  return (
    <span className={`pill pill--${tone}${className ? ` ${className}` : ""}`}>
      {children}
    </span>
  );
}
