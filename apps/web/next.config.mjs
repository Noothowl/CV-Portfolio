/** @type {import('next').NextConfig} */
<<<<<<< HEAD
<<<<<<< HEAD
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  basePath: isProd ? "/CV-Portfolio" : "",
  assetPrefix: isProd ? "/CV-Portfolio/" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

=======
export default {
  output: 'export',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH ? `${process.env.NEXT_PUBLIC_BASE_PATH}/` : undefined,
  images: { unoptimized: true },
};
>>>>>>> c6e9cfd (imgs fix)
=======
export default {
  output: 'export',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH ? `${process.env.NEXT_PUBLIC_BASE_PATH}/` : undefined,
  images: { unoptimized: true },
};
>>>>>>> c6e9cfd (imgs fix)
