// Minimal root layout. The site itself is static HTML served byte-identical by
// app/[[...slug]]/route.js (route handlers do not render through a layout);
// this exists only so app/not-found.js can render the designed 404.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="hub">{children}</body>
    </html>
  );
}
