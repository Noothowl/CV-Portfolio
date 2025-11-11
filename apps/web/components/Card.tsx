// apps/web/components/Card.tsx
import Link from "next/link";

type PillTone = "gray" | "green" | "yellow" | "red";

type CardProps = {
  title: string;
  thumbnail: string;
  period?: string;
  tags?: Array<{ text: string; tone?: PillTone }>;
  href?: string;
};

export function Card({ title, thumbnail, period, tags = [], href }: CardProps) {
  const Inner = () => (
    <>
      <div className="card__thumb">
        <img src={thumbnail} alt={title} />
      </div>

      <div className="card__body">
        <h3 className="card__title">{title}</h3>
        {period ? <p className="card__meta">{period}</p> : null}

        {tags.length ? (
          <div className="tags">
            {tags.map((t, i) => (
              <span key={i} className={`pill ${t.tone ?? "gray"}`}>
                {t.text}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );

  // Linkeable o no linkeable, según `href`
  return href ? (
    <Link className="card card--link" href={href} aria-label={title} scroll={false}>
      <Inner />
    </Link>
  ) : (
    <article className="card">
      <Inner />
    </article>
  );
}
