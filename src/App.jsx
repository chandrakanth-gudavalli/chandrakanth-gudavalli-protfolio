import Nav from "./components/Nav";
import Hero from "./sections/Hero";
import { useTheme } from "./hooks/useTheme";
import { sections, profile, hero } from "./content";

export default function App() {
  const { theme, toggle } = useTheme();
  return (
    <>
      <Nav sections={sections} theme={theme} onToggleTheme={toggle} />
      <main className="container">
        <Hero profile={profile} hero={hero} />
      </main>
    </>
  );
}
