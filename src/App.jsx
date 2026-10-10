import Nav from "./components/Nav";
import Hero from "./sections/Hero";
import Work from "./sections/Work";
import { useTheme } from "./hooks/useTheme";
import { sections, profile, hero, work } from "./content";

export default function App() {
  const { theme, toggle } = useTheme();
  return (
    <>
      <Nav sections={sections} theme={theme} onToggleTheme={toggle} />
      <main className="container">
        <Hero profile={profile} hero={hero} />
        <Work items={work} />
      </main>
    </>
  );
}
