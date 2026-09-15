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
      // 2026-09-15: /index served the home page as a second URL (200 live and local).
      { source: "/index", destination: "/", permanent: true },
      { source: "/:path*.html", destination: "/:path*", permanent: true },
      // 2026-09-12: the agency moved under /studio when the site became the
      // Excellence Studio umbrella. Every URL that was ever public for it 301s
      // to its new home so inbound links and the old sitemap keep resolving.
      { source: "/about", destination: "/studio/about", permanent: true },
      { source: "/contact", destination: "/studio/contact", permanent: true },
      { source: "/work", destination: "/studio/work", permanent: true },
      { source: "/how-we-work", destination: "/studio/how-we-work", permanent: true },
      { source: "/blog", destination: "/studio/blog", permanent: true },
      { source: "/blog/:path*", destination: "/studio/blog/:path*", permanent: true },
      { source: "/case-studies", destination: "/studio/case-studies", permanent: true },
      { source: "/case-studies/:path*", destination: "/studio/case-studies/:path*", permanent: true },
      { source: "/systems", destination: "/studio/systems", permanent: true },
      { source: "/systems/:path*", destination: "/studio/systems/:path*", permanent: true }
    ];
  },

  async headers() {
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      // No page uses a camera, a microphone or location; say so. A Content-Security-Policy
      // is deliberately NOT set here: the pages carry inline scripts and the lead form would
      // need nonces first (2026-09-15).
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" }
    ];
    return [
      { source: "/:path*", headers: security },
      { source: "/assets/frames/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      { source: "/fonts/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] }
    ];
  }
};

export default nextConfig;
