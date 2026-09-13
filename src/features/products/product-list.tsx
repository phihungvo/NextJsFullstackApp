"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  EmptyState,
  ErrorState,
  ForbiddenState,
  LoadingState,
  UnauthorizedState,
} from "@/components/ui/states";
import { useAuth } from "@/features/auth/auth-provider";
import { can } from "@/features/auth/permissions";
import {
  apiList,
  apiRequest,
  ApiClientError,
  queryString,
  type ApiListResult,
} from "@/lib/api/client";
import type { Product } from "@/lib/api/types";

function statusClass(status: Product["status"]): string {
  return status === "PUBLISHED"
    ? "badge-success"
    : status === "ARCHIVED"
      ? "badge-danger"
      : "badge-warning";
}

export function ProductList() {
  const { user } = useAuth();
  const [result, setResult] = useState<ApiListResult<Product> | null>(null);
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiClientError | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    const url = `/api/v1/products${queryString({ page, pageSize: 10, search: submittedSearch, sortBy: "updatedAt", sortOrder: "desc" })}`;
    void apiList<Product>(url)
      .then((next) => {
        if (active) setResult(next);
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof ApiClientError ? reason : new ApiClientError(0, {}));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page, refreshKey, submittedSearch]);

  async function archiveProduct(id: string) {
    if (!window.confirm("Bạn có chắc muốn archive sản phẩm này?")) return;
    setDeletingId(id);
    try {
      await apiRequest<{ id: string; archived: true }>(`/api/v1/products/${id}`, {
        method: "DELETE",
      });
      setResult((current) =>
        current ? { ...current, data: current.data.filter((item) => item.id !== id) } : current,
      );
    } catch (reason: unknown) {
      setError(reason instanceof ApiClientError ? reason : new ApiClientError(0, {}));
    } finally {
      setDeletingId(null);
    }
  }

  if (!user) return null;
  if (loading && !result) return <LoadingState label="Đang tải danh sách sản phẩm…" />;
  if (error && !result) {
    if (error.status === 401) return <UnauthorizedState />;
    if (error.status === 403) return <ForbiddenState />;
    return (
      <ErrorState
        description={error.message}
        onRetry={() => {
          setLoading(true);
          setError(null);
          setRefreshKey((key) => key + 1);
        }}
      />
    );
  }
  const items = result?.data ?? [];
  const meta = result?.meta;

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1>Sản phẩm</h1>
          <p>Quản lý catalog theo lifecycle và visibility đã được API bảo vệ.</p>
        </div>
        {can(user.permissions, "PRODUCT_CREATE") ? (
          <Link className="button button-primary" href="/dashboard/products/new">
            Tạo sản phẩm
          </Link>
        ) : null}
      </div>
      <div className="panel">
        <div className="panel-header">
          <h2>Danh sách sản phẩm</h2>
          <span className="badge">{meta?.total ?? 0} mục</span>
        </div>
        <div className="panel-body">
          <form
            className="toolbar"
            onSubmit={(event) => {
              event.preventDefault();
              setLoading(true);
              setError(null);
              setPage(1);
              setSubmittedSearch(search.trim());
            }}
          >
            <label className="toolbar-search">
              <span className="sr-only">Tìm kiếm sản phẩm</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm theo tên hoặc slug…"
              />
            </label>
            <div className="toolbar-actions">
              <button className="button button-secondary button-small" type="submit">
                Tìm kiếm
              </button>
              {search ? (
                <button
                  className="button button-quiet button-small"
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setLoading(true);
                    setError(null);
                    setSubmittedSearch("");
                    setPage(1);
                  }}
                >
                  Xóa lọc
                </button>
              ) : null}
            </div>
          </form>
          {error ? (
            <p className="form-alert" role="alert">
              {error.message}
            </p>
          ) : null}
          {items.length === 0 ? (
            <EmptyState
              title="Chưa có sản phẩm"
              description={
                submittedSearch
                  ? "Không tìm thấy sản phẩm phù hợp."
                  : "Tạo sản phẩm đầu tiên để bắt đầu catalog."
              }
              action={
                can(user.permissions, "PRODUCT_CREATE")
                  ? { href: "/dashboard/products/new", label: "Tạo sản phẩm" }
                  : undefined
              }
            />
          ) : (
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Giá</th>
                    <th>Trạng thái</th>
                    <th>Visibility</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <Link className="table-primary" href={`/dashboard/products/${product.id}`}>
                          {product.name}
                        </Link>
                        <span className="table-secondary">{product.slug}</span>
                      </td>
                      <td>
                        {product.price} {product.currency}
                      </td>
                      <td>
                        <span className={`badge ${statusClass(product.status)}`}>
                          {product.status}
                        </span>
                      </td>
                      <td>
                        <span className="badge">{product.visibility}</span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <Link
                            className="button button-secondary button-small"
                            href={`/dashboard/products/${product.id}`}
                          >
                            Xem
                          </Link>
                          {can(user.permissions, "PRODUCT_UPDATE") ? (
                            <Link
                              className="button button-secondary button-small"
                              href={`/dashboard/products/${product.id}/edit`}
                            >
                              Sửa
                            </Link>
                          ) : null}
                          {can(user.permissions, "PRODUCT_DELETE") &&
                          product.status !== "ARCHIVED" ? (
                            <button
                              className="button button-danger button-small"
                              type="button"
                              onClick={() => void archiveProduct(product.id)}
                              disabled={deletingId === product.id}
                            >
                              {deletingId === product.id ? "Đang xử lý…" : "Archive"}
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {meta && meta.totalPages > 1 ? (
          <div className="pagination">
            <p>
              Trang {meta.page} / {meta.totalPages}
            </p>
            <div className="pagination-actions">
              <button
                className="button button-secondary button-small"
                type="button"
                disabled={meta.page <= 1 || loading}
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  setPage((current) => current - 1);
                }}
              >
                Trước
              </button>
              <button
                className="button button-secondary button-small"
                type="button"
                disabled={meta.page >= meta.totalPages || loading}
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  setPage((current) => current + 1);
                }}
              >
                Sau
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
