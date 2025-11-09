import './globals.css';
import Image from "next/image";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Martín Jesús Chipoco',
  description: 'Unreal Engine & Software Developer | Computer Engineer — Portfolio Site: Projects & CV',
  icons: { icon: '/icon.png' }, // sin base
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div
          id="bg-blur"
          style={{
            background: `
              url("/images/bg.webp") center/cover no-repeat,
              radial-gradient(1200px 800px at 20% 10%, rgba(47,129,247,.15), transparent 60%),
              radial-gradient(1000px 700px at 80% 20%, rgba(40,200,120,.12), transparent 60%),
              radial-gradient(1200px 900px at 60% 90%, rgba(200,120,240,.10), transparent 60%)
            `,
          }}
        />
        <div id="root-col">
          <div className="container">{children}</div>
        </div>
      </body>
    </html>
  );
}
