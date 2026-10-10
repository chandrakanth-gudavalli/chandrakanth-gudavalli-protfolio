export default function ThemeToggle({ theme, onToggle }) {
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={`Switch to ${next} theme`}
    >
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
}
