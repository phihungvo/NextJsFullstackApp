import type { ReactNode } from "react";
import Link from "next/link";

export default function PublicLayout({ children }: { readonly children: ReactNode }) {
  return (
    <div className="public-shell">
      <header className="public-header">
        <Link className="public-brand" href="/">
          <span className="brand-mark" aria-hidden="true">
            N
          </span>
          <span>Catalog Admin</span>
        </Link>
        <nav aria-label="Điều hướng chính">
          <Link href="/login">Đăng nhập</Link>
        </nav>
      </header>
      <main id="main-content">{children}</main>
      <footer className="public-footer">
        Nền tảng quản trị sản phẩm — implementation baseline.
      </footer>
    </div>
  );
}
