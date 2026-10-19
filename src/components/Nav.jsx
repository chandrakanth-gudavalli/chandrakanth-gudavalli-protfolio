import ThemeToggle from "./ThemeToggle";
import { useActiveSection } from "../hooks/useActiveSection";

export default function Nav({ sections, theme, onToggleTheme }) {
  const active = useActiveSection(sections.map((s) => s.id));
  return (
    <nav className="nav" aria-label="Sections">
      <div className="nav-inner">
        <a className="nav-brand mono" href="#top" aria-label="Back to top">
          ~/cg
        </a>
        <div className="nav-links mono">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              aria-current={active === s.id ? "true" : undefined}
            >
              {s.label}
            </a>
          ))}
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>
    </nav>
  );
}
