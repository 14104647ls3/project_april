/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/pages/index',
        destination: '/',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
