"use client";

import { useEffect, useState } from "react";

import {
  EmptyState,
  ErrorState,
  ForbiddenState,
  LoadingState,
  UnauthorizedState,
} from "@/components/ui/states";
import { useAuth } from "@/features/auth/auth-provider";
import { apiList, ApiClientError, queryString, type ApiListResult } from "@/lib/api/client";
import type { Permission } from "@/lib/api/types";

export function PermissionList() {
  const { user } = useAuth();
  const [result, setResult] = useState<ApiListResult<Permission> | null>(null);
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiClientError | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;
    void apiList<Permission>(
      `/api/v1/permissions${queryString({ page: 1, pageSize: 100, search: submittedSearch, sortBy: "code", sortOrder: "asc" })}`,
    )
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
  }, [refreshKey, submittedSearch]);

  if (!user) return null;
  if (loading && !result) return <LoadingState label="Đang tải permissions…" />;
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

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Authorization</p>
          <h1>Permissions</h1>
          <p>Catalog quyền hệ thống được dùng khi cấu hình role.</p>
        </div>
      </div>
      <div className="panel">
        <div className="panel-header">
          <h2>Permission catalog</h2>
          <span className="badge">{result?.meta.total ?? 0} mục</span>
        </div>
        <div className="panel-body">
          <form
            className="toolbar"
            onSubmit={(event) => {
              event.preventDefault();
              setLoading(true);
              setError(null);
              setSubmittedSearch(search.trim());
              setRefreshKey((key) => key + 1);
            }}
          >
            <label className="toolbar-search">
              <span className="sr-only">Tìm kiếm permission</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm theo code hoặc tên…"
              />
            </label>
            <button className="button button-secondary button-small" type="submit">
              Tìm kiếm
            </button>
          </form>
          {error ? (
            <p className="form-alert" role="alert">
              {error.message}
            </p>
          ) : null}
          {items.length === 0 ? (
            <EmptyState
              title="Không có permission"
              description="Không tìm thấy permission phù hợp."
            />
          ) : (
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Tên</th>
                    <th>Mô tả</th>
                    <th>Cập nhật</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((permission) => (
                    <tr key={permission.id}>
                      <td>
                        <span className="badge">{permission.code}</span>
                      </td>
                      <td>
                        <strong>{permission.name}</strong>
                      </td>
                      <td>{permission.description || "—"}</td>
                      <td>{new Date(permission.updatedAt).toLocaleDateString("vi-VN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
