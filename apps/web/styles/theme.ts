export const theme = {
  colors: {
    canvas: "#0d1117",
    subtle: "#161b22",
    border: "#30363d",
    fg: "#c9d1d9",
    muted: "#8b949e",
    accent: "#2f81f7",
    pills: {
      gray:   { fg: "#c9d1d9", bg: "#30363d" },
      green:  { fg: "#c9f0d0", bg: "#23863626", border: "#238636" },
      yellow: { fg: "#d29922", bg: "#d2992226", border: "#9e6a03" },
      red:    { fg: "#f85149", bg: "#f8514926", border: "#8e1519" }
    }
  },
} as const;

export type PillTone = "gray" | "green" | "yellow" | "red";
