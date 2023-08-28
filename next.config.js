/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: '*.hdslb.com',
            }
        ]
    },
    reactStrictMode: false,
}

module.exports = nextConfig
