"use client";

import { useCallback, useEffect, useState } from "react";

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
import type { User } from "@/lib/api/types";
import { UserForm } from "./user-form";

function statusClass(status: User["status"]): string {
  return status === "ACTIVE"
    ? "badge-success"
    : status === "SUSPENDED"
      ? "badge-warning"
      : "badge-danger";
}

export function UserList() {
  const { user: actor } = useAuth();
  const [result, setResult] = useState<ApiListResult<User> | null>(null);
  const [selected, setSelected] = useState<User | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiClientError | null>(null);

  const fetchData = useCallback(
    () =>
      apiList<User>(
        `/api/v1/users${queryString({ page: 1, pageSize: 50, search: submittedSearch, sortBy: "name", sortOrder: "asc" })}`,
      ),
    [submittedSearch],
  );

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    void fetchData()
      .then(setResult)
      .catch((reason: unknown) =>
        setError(reason instanceof ApiClientError ? reason : new ApiClientError(0, {})),
      )
      .finally(() => setLoading(false));
  }, [fetchData]);

  useEffect(() => {
    let active = true;
    void fetchData()
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
  }, [fetchData]);

  async function remove(target: User) {
    if (target.id === actor?.id || !window.confirm(`Archive ${target.name}?`)) return;
    try {
      await apiRequest(`/api/v1/users/${target.id}`, { method: "DELETE" });
      load();
    } catch (reason: unknown) {
      setError(reason instanceof ApiClientError ? reason : new ApiClientError(0, {}));
    }
  }

  if (!actor) return null;
  if (loading && !result) return <LoadingState label="Đang tải danh sách người dùng…" />;
  if (error && !result) {
    if (error.status === 401) return <UnauthorizedState />;
    if (error.status === 403) return <ForbiddenState />;
    return <ErrorState description={error.message} onRetry={load} />;
  }
  const items = result?.data ?? [];

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Access</p>
          <h1>Người dùng</h1>
          <p>Quản lý tài khoản, trạng thái và role assignment.</p>
        </div>
        {can(actor.permissions, "USER_CREATE") ? (
          <button
            className="button button-primary"
            type="button"
            onClick={() => {
              setSelected(undefined);
              setShowForm(true);
            }}
          >
            Tạo người dùng
          </button>
        ) : null}
      </div>
      {showForm && can(actor.permissions, selected ? "USER_UPDATE" : "USER_CREATE") ? (
        <div id="user-form">
          <UserForm
            key={selected?.id ?? "new"}
            user={selected}
            onSaved={() => {
              setShowForm(false);
              setSelected(undefined);
              load();
            }}
            onCancel={() => {
              setShowForm(false);
              setSelected(undefined);
            }}
          />
        </div>
      ) : null}
      <div className="panel">
        <div className="panel-header">
          <h2>Danh sách người dùng</h2>
          <span className="badge">{result?.meta.total ?? 0} mục</span>
        </div>
        <div className="panel-body">
          <form
            className="toolbar"
            onSubmit={(event) => {
              event.preventDefault();
              setSubmittedSearch(search.trim());
            }}
          >
            <label className="toolbar-search">
              <span className="sr-only">Tìm kiếm người dùng</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Tìm theo tên hoặc email…"
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
              title="Chưa có người dùng"
              description="Không có tài khoản phù hợp với bộ lọc."
            />
          ) : (
            <div className="data-table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Người dùng</th>
                    <th>Role</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <strong>{item.name}</strong>
                        <span className="table-secondary">{item.email}</span>
                      </td>
                      <td>
                        <div className="table-actions">
                          {item.roles.map((role) => (
                            <span className="badge" key={role}>
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${statusClass(item.status)}`}>{item.status}</span>
                      </td>
                      <td>
                        <div className="table-actions">
                          {can(actor.permissions, "USER_UPDATE") ? (
                            <button
                              className="button button-secondary button-small"
                              type="button"
                              onClick={() => {
                                setSelected(item);
                                setShowForm(true);
                              }}
                            >
                              Sửa
                            </button>
                          ) : null}
                          {can(actor.permissions, "USER_DELETE") && item.id !== actor.id ? (
                            <button
                              className="button button-danger button-small"
                              type="button"
                              onClick={() => void remove(item)}
                            >
                              Archive
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
      </div>
    </section>
  );
}
