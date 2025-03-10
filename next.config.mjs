/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "11.fesp.shop",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
