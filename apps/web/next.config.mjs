/** @type {import('next').NextConfig} */
const isProjectPage = process.env.GITHUB_REPOSITORY && !/^[^/]+\/[^/]+\.github\.io$/.test(process.env.GITHUB_REPOSITORY);
const repoName = isProjectPage ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}` : '';

export default {
  output: 'export',
  images: { unoptimized: true },
  basePath: repoName,
  assetPrefix: repoName ? `${repoName}/` : undefined
};
