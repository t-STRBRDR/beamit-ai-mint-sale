/** @type {import('next').NextConfig} */
const withSerwist = require("@serwist/next").default;
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "career-utility.dedicateddevelopers.us"
      }
    ]
  },
  compress: true,
  devIndicators: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
  },
  env: {
    NEXT_APP_BASE_URL: process.env.NEXT_APP_BASE_URL,
    NEXT_APP_PROJECT_NAME: process.env.NEXT_APP_PROJECT_NAME
  }
};

module.exports = process.env.NODE_ENV === "development"
  ? nextConfig
  : withSerwist({
      swSrc: "app/sw.ts",
      swDest: "public/sw.js",
      disable: process.env.NODE_ENV === "development"
    })(nextConfig);
