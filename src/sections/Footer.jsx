export default function Footer({ name }) {
  return (
    <footer className="footer mono">
      © {new Date().getFullYear()} {name}
    </footer>
  );
}
