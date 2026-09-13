import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Đăng nhập",
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { readonly children: ReactNode }) {
  return (
    <main id="main-content" className="auth-shell">
      <div className="auth-brand">
        <Link className="public-brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            N
          </span>
          <span>Catalog Admin</span>
        </Link>
      </div>
      {children}
    </main>
  );
}
