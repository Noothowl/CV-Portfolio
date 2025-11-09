import Link from "next/link";

export function Navbar() {
  return (
    <nav className="nav">
      <div className="nav-left">
        {/* <a className="brand" href=".">Home</a> */}
      </div>
      <div className="nav-right">
        <a href="mailto:martinchipoco@gmail.com">Email</a>
        <a href="https://www.linkedin.com/in/martín-jesús-chipoco" target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="https://github.com/Noothowl" target="_blank" rel="noreferrer">GitHub</a>
        <a className="btn-primary" href="./cv.pdf" target="_blank" rel="noreferrer">Download CV (PDF)</a>
      </div>
    </nav>
  );
}
