import './globals.css';
import Image from "next/image";
import type { Metadata } from 'next';

const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
<<<<<<< HEAD
  title: 'Martín Jesús Chipoco',
  description: 'Unreal Engine & Software Developer | Computer Engineer — Portfolio Site: Projects & CV',
  icons: { icon: '/icon.png' }, // sin base
=======
  title: 'Martín Jesús Chipoco — Portfolio',
  description: 'Unreal Engine / Software Engineer — Projects & CV',
  icons: { icon: `${base}/icon.png` },
>>>>>>> c6e9cfd (imgs fix)
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <div
          id="bg-blur"
          style={{
            background: `
<<<<<<< HEAD
              url("/images/bg.webp") center/cover no-repeat,
=======
              url("${base}/images/bg.webp") center/cover no-repeat,
>>>>>>> c6e9cfd (imgs fix)
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
