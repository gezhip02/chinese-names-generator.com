/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
      DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    },
  }
  
  module.exports = nextConfig