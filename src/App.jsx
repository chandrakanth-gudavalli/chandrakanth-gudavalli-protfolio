import Nav from "./components/Nav";
import { useTheme } from "./hooks/useTheme";
import { sections } from "./content";

export default function App() {
  const { theme, toggle } = useTheme();
  return (
    <>
      <Nav sections={sections} theme={theme} onToggleTheme={toggle} />
      <main className="container">
        <h1>Chandrakanth Gudavalli</h1>
      </main>
    </>
  );
}
