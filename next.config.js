/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      CHAT_USERNAME: process.env.CHAT_USERNAME,
    }
}

module.exports = nextConfig
