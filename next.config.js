// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
// }

// module.exports = nextConfig

module.exports = {
  
  devIndicators: {},
  reactStrictMode: true,
  swcMinify: true,
  staticPageGenerationTimeout: 500,
  publicRuntimeConfig: {
    // Available on both server and client
    theme: "DEFAULT",
  },
  images: {
    domains: ["127.0.0.1"],
  },
};
