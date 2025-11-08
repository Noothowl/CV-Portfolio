export function Footer() {
  return (
    <footer className="footer">
      <div>© {new Date().getFullYear()} Martín Jesús Chipoco</div>
      <div className="dim">Built with Next.js • Deployed via GitHub Actions → Pages</div>
    </footer>
  );
}
