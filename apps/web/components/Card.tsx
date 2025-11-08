type Props = {
  title: string;
  thumbnail: string;
  period?: string;
  tags?: Array<{ text: string; tone?: "gray" | "green" | "yellow" | "red" }>;
  onOpen?: () => void;
};

export function Card({ title, thumbnail, period, tags = [], onOpen }: Props) {
  return (
    <article
      className="card"
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen?.()}
    >
      <img className="card-thumb" src={thumbnail} alt="" />
      <div className="card-body">
        <div className="card-title">{title}</div>
        {period && <div className="card-meta">{period}</div>}
        {tags.length > 0 && (
          <div className="pills">
            {tags.map((t, i) => (
              <span key={i} className={`pill pill--${t.tone ?? "gray"}`}>
                {t.text}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
