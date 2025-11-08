import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Martín Jesús Chipoco",
  description: "Unreal Engine / Software Engineer — Projects & CV",
  icons: { icon: "/icon.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div id="bg-blur" />
        {/* 👇 root flex column a toda altura */}
        <div id="root-col">
          <div className="container">{children}</div>
        </div>
      </body>
    </html>
  );
}
