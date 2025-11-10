export function TagPill({ children, tone = "gray" }) {
  return <span className={`pill pill--${tone}`}>{children}</span>;
}
