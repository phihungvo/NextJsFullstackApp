"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

import { ErrorState, LoadingState, UnauthorizedState } from "@/components/ui/states";
import { can } from "@/features/auth/permissions";
import { useAuth } from "@/features/auth/auth-provider";
import { ApiClientError } from "@/lib/api/client";

type NavigationItem = {
  readonly href: string;
  readonly label: string;
  readonly permission?: string;
};

const navigation: readonly NavigationItem[] = [
  { href: "/dashboard", label: "Tổng quan" },
  { href: "/dashboard/products", label: "Sản phẩm", permission: "PRODUCT_VIEW" },
  { href: "/dashboard/users", label: "Người dùng", permission: "USER_VIEW" },
  { href: "/dashboard/roles", label: "Vai trò", permission: "ROLE_VIEW" },
  { href: "/dashboard/permissions", label: "Quyền", permission: "PERMISSION_VIEW" },
];

function isCurrentPath(pathname: string, href: string): boolean {
  return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
}

export function DashboardShell({ children }: { readonly children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, error, reload, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  if (loading) {
    return (
      <main id="main-content" className="page-frame page-frame-centered">
        <LoadingState label="Đang kiểm tra phiên đăng nhập…" />
      </main>
    );
  }
  if (error) {
    return (
      <main className="page-frame page-frame-centered">
        <ErrorState description={error.message} onRetry={reload} />
      </main>
    );
  }
  if (!user)
    return (
      <main className="page-frame page-frame-centered">
        <UnauthorizedState />
      </main>
    );

  const visibleNavigation = navigation.filter(
    (item) => !item.permission || can(user.permissions, item.permission),
  );

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await logout();
      router.replace("/login");
      router.refresh();
    } catch (reason: unknown) {
      setLoggingOut(false);
      if (reason instanceof ApiClientError && reason.status === 401) {
        router.replace("/login");
      }
    }
  }

  return (
    <div className="dashboard-shell">
      <button
        className="mobile-menu-button"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="dashboard-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span aria-hidden="true">☰</span> Menu
      </button>
      <aside id="dashboard-navigation" className={`dashboard-sidebar${menuOpen ? " is-open" : ""}`}>
        <Link className="dashboard-brand" href="/dashboard" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark" aria-hidden="true">
            N
          </span>
          <span>Catalog Admin</span>
        </Link>
        <nav aria-label="Điều hướng quản trị">
          <ul className="dashboard-nav">
            {visibleNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  className={isCurrentPath(pathname, item.href) ? "is-active" : ""}
                  href={item.href}
                  aria-current={isCurrentPath(pathname, item.href) ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="sidebar-footer">
          <span className="sidebar-caption">Đang đăng nhập</span>
          <strong>{user.name}</strong>
          <span className="sidebar-email">{user.email}</span>
        </div>
      </aside>
      <div className="dashboard-content">
        <header className="dashboard-topbar">
          <div>
            <span className="topbar-kicker">Workspace</span>
            <span className="topbar-title">Quản trị sản phẩm</span>
          </div>
          <button
            className="button button-quiet"
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Đang thoát…" : "Đăng xuất"}
          </button>
        </header>
        <main id="main-content" className="page-frame">
          {children}
        </main>
      </div>
    </div>
  );
}
