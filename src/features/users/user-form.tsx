"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { apiRequest, ApiClientError } from "@/lib/api/client";
import type { User, UserStatus } from "@/lib/api/types";

export function UserForm({
  user,
  onSaved,
  onCancel,
}: {
  readonly user?: User;
  readonly onSaved: () => void;
  readonly onCancel: () => void;
}) {
  const editing = Boolean(user);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<UserStatus>(user?.status ?? "ACTIVE");
  const [roleCodes, setRoleCodes] = useState(user?.roles.join(", ") ?? "USER");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const roles = roleCodes
      .split(",")
      .map((role) => role.trim().toUpperCase())
      .filter(Boolean);
    const body = editing
      ? { name, status, ...(password ? { password } : {}), roleCodes: roles }
      : { name, email, password, status, roleCodes: roles };
    try {
      await apiRequest<User>(editing ? `/api/v1/users/${user?.id}` : "/api/v1/users", {
        method: editing ? "PATCH" : "POST",
        body: JSON.stringify(body),
      });
      onSaved();
    } catch (reason: unknown) {
      setError(reason instanceof ApiClientError ? reason.message : "Không thể lưu người dùng.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="panel form-panel" onSubmit={submit} noValidate>
      <h2>{editing ? "Chỉnh sửa người dùng" : "Tạo người dùng"}</h2>
      {error ? (
        <p className="form-alert" role="alert">
          {error}
        </p>
      ) : null}
      <div className="form-grid">
        <label className="field">
          <span>Họ và tên</span>
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label className="field">
          <span>Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={editing}
            required={!editing}
          />
        </label>
        <label className="field">
          <span>Mật khẩu {editing ? "mới" : ""}</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={12}
            required={!editing}
            placeholder={editing ? "Để trống nếu không đổi" : "Tối thiểu 12 ký tự"}
          />
        </label>
        <label className="field">
          <span>Trạng thái</span>
          <select value={status} onChange={(event) => setStatus(event.target.value as UserStatus)}>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </label>
        <label className="field field-full">
          <span>Role codes</span>
          <input
            value={roleCodes}
            onChange={(event) => setRoleCodes(event.target.value)}
            placeholder="USER, OPERATOR"
          />
          <span className="field-hint">Phân tách nhiều role bằng dấu phẩy.</span>
        </label>
      </div>
      <div className="form-actions">
        <button className="button button-secondary" type="button" onClick={onCancel}>
          Hủy
        </button>
        <button className="button button-primary" type="submit" disabled={saving}>
          {saving ? "Đang lưu…" : editing ? "Lưu thay đổi" : "Tạo người dùng"}
        </button>
      </div>
    </form>
  );
}

export function UserFormLink() {
  return (
    <Link className="button button-primary" href="#user-form">
      Tạo người dùng
    </Link>
  );
}
