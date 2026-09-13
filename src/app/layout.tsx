import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Next.js Fullstack App",
    template: "%s | Next.js Fullstack App",
  },
  description:
    "Application foundation — product metadata will be finalized after discovery sign-off.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
