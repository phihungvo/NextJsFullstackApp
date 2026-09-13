import Link from "next/link";
import type { ReactNode } from "react";

type StateAction = {
  readonly href?: string;
  readonly label: string;
  readonly onClick?: () => void;
};

function Action({ action }: { readonly action: StateAction }): ReactNode {
  if (action.href) {
    return (
      <Link className="button button-primary" href={action.href}>
        {action.label}
      </Link>
    );
  }

  return (
    <button className="button button-primary" type="button" onClick={action.onClick}>
      {action.label}
    </button>
  );
}

export function LoadingState({ label = "Đang tải dữ liệu…" }: { readonly label?: string }) {
  return (
    <div className="state-card" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  readonly title: string;
  readonly description: string;
  readonly action?: StateAction;
}) {
  return (
    <div className="state-card">
      <span className="state-icon" aria-hidden="true">
        ∅
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      {action ? <Action action={action} /> : null}
    </div>
  );
}

export function ErrorState({
  title = "Không thể tải dữ liệu",
  description,
  onRetry,
}: {
  readonly title?: string;
  readonly description?: string;
  readonly onRetry?: () => void;
}) {
  return (
    <div className="state-card state-card-error" role="alert">
      <span className="state-icon" aria-hidden="true">
        !
      </span>
      <h2>{title}</h2>
      <p>{description ?? "Vui lòng thử lại sau ít phút."}</p>
      {onRetry ? <Action action={{ label: "Thử lại", onClick: onRetry }} /> : null}
    </div>
  );
}

export function UnauthorizedState() {
  return (
    <div className="state-card" role="alert">
      <span className="state-icon" aria-hidden="true">
        401
      </span>
      <h1>Phiên đăng nhập không còn hợp lệ</h1>
      <p>Hãy đăng nhập lại để tiếp tục sử dụng khu vực quản trị.</p>
      <Action action={{ href: "/login?next=/dashboard", label: "Đăng nhập" }} />
    </div>
  );
}

export function ForbiddenState() {
  return (
    <div className="state-card" role="alert">
      <span className="state-icon" aria-hidden="true">
        403
      </span>
      <h1>Không có quyền truy cập</h1>
      <p>Tài khoản của bạn chưa được cấp quyền cho màn hình này.</p>
      <Action action={{ href: "/dashboard", label: "Về dashboard" }} />
    </div>
  );
}

export function NotFoundState({
  title = "Không tìm thấy dữ liệu",
  description = "Mục này có thể đã bị xóa hoặc không còn khả dụng.",
}: {
  readonly title?: string;
  readonly description?: string;
}) {
  return (
    <div className="state-card" role="alert">
      <span className="state-icon" aria-hidden="true">
        404
      </span>
      <h1>{title}</h1>
      <p>{description}</p>
      <Action action={{ href: "/dashboard/products", label: "Về danh sách" }} />
    </div>
  );
}
