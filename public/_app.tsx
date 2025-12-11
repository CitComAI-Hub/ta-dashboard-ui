import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script src="/env.js" strategy="beforeInteractive" />
        {/* ...otros head... */}
      </head>
      <body>{children}</body>
    </html>
  );
} 