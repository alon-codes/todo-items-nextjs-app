/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Django backend
    NEXT_SERVICE_URL: "https://todo-items-django-server.vercel.app"
  }
}

module.exports = nextConfig

