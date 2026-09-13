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
import { apiList, apiRequest, ApiClientError, type ApiListResult } from "@/lib/api/client";
import type { Permission, Role } from "@/lib/api/types";
import { RoleForm } from "./role-form";

export function RoleList() {
  const { user: actor } = useAuth();
  const [roles, setRoles] = useState<ApiListResult<Role> | null>(null);
  const [permissions, setPermissions] = useState<readonly Permission[]>([]);
  const [selected, setSelected] = useState<Role | undefined>();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiClientError | null>(null);

  const fetchData = useCallback(
    () =>
      Promise.all([
        apiList<Role>("/api/v1/roles?page=1&pageSize=100&sortBy=name&sortOrder=asc"),
        apiList<Permission>("/api/v1/permissions?page=1&pageSize=100&sortBy=code&sortOrder=asc"),
      ]),
    [],
  );

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    void fetchData()
      .then(([roleResult, permissionResult]) => {
        setRoles(roleResult);
        setPermissions(permissionResult.data);
      })
      .catch((reason: unknown) =>
        setError(reason instanceof ApiClientError ? reason : new ApiClientError(0, {})),
      )
      .finally(() => setLoading(false));
  }, [fetchData]);

  useEffect(() => {
    let active = true;
    void fetchData()
      .then(([roleResult, permissionResult]) => {
        if (!active) return;
        setRoles(roleResult);
        setPermissions(permissionResult.data);
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

  async function remove(role: Role) {
    if (!window.confirm(`Xóa vai trò ${role.name}?`)) return;
    try {
      await apiRequest(`/api/v1/roles/${role.id}`, { method: "DELETE" });
      load();
    } catch (reason: unknown) {
      setError(reason instanceof ApiClientError ? reason : new ApiClientError(0, {}));
    }
  }

  if (!actor) return null;
  if (loading && !roles) return <LoadingState label="Đang tải vai trò và permissions…" />;
  if (error && !roles) {
    if (error.status === 401) return <UnauthorizedState />;
    if (error.status === 403) return <ForbiddenState />;
    return <ErrorState description={error.message} onRetry={load} />;
  }
  const items = roles?.data ?? [];

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Authorization</p>
          <h1>Vai trò</h1>
          <p>Gán permission theo role; system role được bảo vệ ở backend.</p>
        </div>
        {can(actor.permissions, "ROLE_CREATE") ? (
          <button
            className="button button-primary"
            type="button"
            onClick={() => {
              setSelected(undefined);
              setShowForm(true);
            }}
          >
            Tạo vai trò
          </button>
        ) : null}
      </div>
      {showForm && can(actor.permissions, selected ? "ROLE_UPDATE" : "ROLE_CREATE") ? (
        <RoleForm
          key={selected?.id ?? "new"}
          role={selected}
          permissions={permissions}
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
      ) : null}
      <div className="panel">
        <div className="panel-header">
          <h2>Danh sách vai trò</h2>
          <span className="badge">{roles?.meta.total ?? 0} mục</span>
        </div>
        {items.length === 0 ? (
          <EmptyState title="Chưa có vai trò" description="Chưa có role nào trong catalog." />
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Vai trò</th>
                  <th>Permissions</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {items.map((role) => (
                  <tr key={role.id}>
                    <td>
                      <strong>{role.name}</strong>
                      <span className="table-secondary">
                        {role.code}
                        {role.description ? ` — ${role.description}` : ""}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        {role.permissionCodes.map((permission) => (
                          <span className="badge" key={permission}>
                            {permission}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className="table-actions">
                        {can(actor.permissions, "ROLE_UPDATE") ? (
                          <button
                            className="button button-secondary button-small"
                            type="button"
                            onClick={() => {
                              setSelected(role);
                              setShowForm(true);
                            }}
                          >
                            Sửa
                          </button>
                        ) : null}
                        {can(actor.permissions, "ROLE_DELETE") ? (
                          <button
                            className="button button-danger button-small"
                            type="button"
                            onClick={() => void remove(role)}
                          >
                            Xóa
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
    </section>
  );
}
