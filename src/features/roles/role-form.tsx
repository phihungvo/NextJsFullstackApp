"use client";

import { useState, type FormEvent } from "react";

import { apiRequest, ApiClientError } from "@/lib/api/client";
import type { Permission, Role } from "@/lib/api/types";

export function RoleForm({
  role,
  permissions,
  onSaved,
  onCancel,
}: {
  readonly role?: Role;
  readonly permissions: readonly Permission[];
  readonly onSaved: () => void;
  readonly onCancel: () => void;
}) {
  const editing = Boolean(role);
  const [name, setName] = useState(role?.name ?? "");
  const [code, setCode] = useState(role?.code ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [selectedPermissions, setSelectedPermissions] = useState<readonly string[]>(
    role?.permissionCodes ?? [],
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function togglePermission(permissionCode: string) {
    setSelectedPermissions((current) =>
      current.includes(permissionCode)
        ? current.filter((codeValue) => codeValue !== permissionCode)
        : [...current, permissionCode],
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await apiRequest<Role>(editing ? `/api/v1/roles/${role?.id}` : "/api/v1/roles", {
        method: editing ? "PATCH" : "POST",
        body: JSON.stringify({
          name,
          code: code.toUpperCase(),
          description: description || null,
          permissionCodes: selectedPermissions,
        }),
      });
      onSaved();
    } catch (reason: unknown) {
      setError(reason instanceof ApiClientError ? reason.message : "Không thể lưu vai trò.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="panel form-panel" onSubmit={submit} noValidate>
      <h2>{editing ? "Chỉnh sửa vai trò" : "Tạo vai trò"}</h2>
      {error ? (
        <p className="form-alert" role="alert">
          {error}
        </p>
      ) : null}
      <div className="form-grid">
        <label className="field">
          <span>Tên vai trò</span>
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label className="field">
          <span>Code</span>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            disabled={role?.code === "ADMIN" || role?.code === "USER"}
            required
          />
          <span className="field-hint">Chữ in hoa, số và dấu gạch dưới.</span>
        </label>
        <label className="field field-full">
          <span>Mô tả</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={500}
          />
        </label>
        <div className="field field-full">
          <span>Permissions</span>
          <div className="checkbox-grid">
            {permissions.map((permission) => (
              <label className="checkbox-label" key={permission.id}>
                <input
                  type="checkbox"
                  checked={selectedPermissions.includes(permission.code)}
                  onChange={() => togglePermission(permission.code)}
                />
                <span>
                  {permission.code}
                  <small className="table-secondary">{permission.name}</small>
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="form-actions">
        <button className="button button-secondary" type="button" onClick={onCancel}>
          Hủy
        </button>
        <button className="button button-primary" type="submit" disabled={saving}>
          {saving ? "Đang lưu…" : editing ? "Lưu thay đổi" : "Tạo vai trò"}
        </button>
      </div>
    </form>
  );
}
