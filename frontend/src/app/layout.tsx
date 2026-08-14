import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "EV-JARVIS",
  description: "EV-JARVIS vehicle intelligence platform",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
