/**
 * @link https://nextjs.org/docs/api-reference/next.config.js/introduction
 */

/** @type {import("next").NextConfig} */
const config = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/app',
        permanent: true,
      },
    ];
  },
};

module.exports = config;
