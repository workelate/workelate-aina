/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // Canonical URLs are extensionless with no trailing slash (matches sitemap.xml
  // and every <link rel="canonical">). Next 308-redirects the trailing-slash form.
  trailingSlash: false,

  // Safety net: bundle the generated site + frame deck into the function trace so
  // the catch-all resolves even outside the prerender cache.
  outputFileTracingIncludes: {
    "/[[...slug]]": ["./site/**/*", "./assets/**/*"]
  },

  async redirects() {
    return [
      // Kill duplicate-content: legacy .html paths 301 to the clean URL.
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/:path*.html", destination: "/:path*", permanent: true }
    ];
  },

  async headers() {
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }
    ];
    return [
      { source: "/:path*", headers: security },
      { source: "/assets/frames/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/fonts/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] }
    ];
  }
};

export default nextConfig;
