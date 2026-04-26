/** @type {import('next').NextConfig} */

// Set NEXT_PUBLIC_BASE_PATH (e.g. "/balticway") in the Vercel project that
// is exposed under a subpath of ericblo.com. Leave it unset in the v0
// preview / root-domain deployment so the app serves from "/".
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""

const nextConfig = {
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: false,
}

export default nextConfig
