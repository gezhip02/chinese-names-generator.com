/** @type {import('next').NextConfig} */
const nextConfig = {
  serverRuntimeConfig: {
    API_URL: process.env.API_URL,
    API_KEY: process.env.API_KEY,
  },
  publicRuntimeConfig: {
    // 如果有需要公开的环境变量可以在这里定义
  },
}
  
  module.exports = nextConfig