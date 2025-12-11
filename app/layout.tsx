import Script from "next/script";
import "./globals.css";
import AuthGate from "./AuthGate";
import type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script src="/env.js" strategy="beforeInteractive" />
      </head>
      <body>
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}
