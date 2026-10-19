const OWNER = /(C\. Gudavalli)/;

export function renderAuthors(authors) {
  return authors
    .split(OWNER)
    .map((part, i) =>
      OWNER.test(part) ? <strong key={i}>{part}</strong> : part,
    );
}

export default function PubItem({ title, authors, venue, href, type }) {
  return (
    <li className="pub">
      <div className="pub-title">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {title}
          </a>
        ) : (
          <span>{title}</span>
        )}
        {type === "patent" && <span className="tag mono">patent</span>}
      </div>
      <div className="pub-authors">{renderAuthors(authors)}</div>
      <div className="pub-venue mono">{venue}</div>
    </li>
  );
}
