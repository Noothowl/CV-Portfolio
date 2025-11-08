type Props = {
  query: string;
  onQuery: (v: string) => void;
  tags: string[];
  activeTag: string | null;
  onTag: (t: string | null) => void;
};

export function FilterBar({ query, onQuery, tags, activeTag, onTag }: Props) {
  return (
    <div className="filterbar">
      <input
        placeholder="Project Name"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        className="input"
      />
      <div className="tag-row">
        <button className={`chip ${activeTag===null ? 'is-active':''}`} onClick={() => onTag(null)}>All</button>
        {tags.map(t => (
          <button key={t} className={`chip ${activeTag===t ? 'is-active':''}`} onClick={() => onTag(t)}>{t}</button>
        ))}
      </div>
    </div>
  );
}
