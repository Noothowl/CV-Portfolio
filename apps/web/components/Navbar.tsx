// apps/web/components/Navbar.tsx
import Link from "next/link";
import { publicPath } from "../lib/publicPath";

export function Navbar() {
  return (
    <nav className="nav">
      <div>
        <div> <h1 className="display brand">Martín Jesús Chipoco - Portfolio</h1></div>
        <div> <p className="dim">Unreal Engine & Software Developer | Computer Engineer</p></div>
      </div>
      <div className="nav-right">
        <a href="mailto:martinchipoco@gmail.com">Email</a>
        <a href="https://www.linkedin.com/in/martín-jesús-chipoco" target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="https://github.com/Noothowl" target="_blank" rel="noreferrer">GitHub</a>
        <a className="btn-primary" href={publicPath("/cv.pdf")} target="_blank" rel="noreferrer">Download CV (PDF)</a>

      </div>
    </nav>
  );
}
