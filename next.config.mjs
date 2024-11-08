/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gist.github.com",
        
      },
      {
        protocol: "https",
        hostname: "deodap.in",
      },
    ],
  },
};

export default nextConfig;
