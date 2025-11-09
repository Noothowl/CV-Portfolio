/** @type {import('next').NextConfig} */
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
