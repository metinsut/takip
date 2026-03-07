const favicons = [
  {
    sizes: "192x192",
    href: "/android-chrome-192x192.png",
  },
  {
    sizes: "512x512",
    href: "/android-chrome-512x512.png",
  },
  {
    sizes: "180x180",
    href: "/apple-touch-icon.png",
  },
  {
    sizes: "32x32",
    href: "/favicon-32x32.png",
  },
  {
    sizes: "16x16",
    href: "/favicon-16x16.png",
  },
] as const;

export function AppMetadata() {
  return (
    <>
      {favicons.map(({ sizes, href }) => (
        <link key={sizes} rel="icon" type="image/png" sizes={sizes} href={href} />
      ))}
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#ffffff" />
    </>
  );
}
