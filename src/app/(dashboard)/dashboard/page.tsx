"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { ErrorState, LoadingState } from "@/components/ui/states";
import { useAuth } from "@/features/auth/auth-provider";
import { can } from "@/features/auth/permissions";
import { apiList, ApiClientError } from "@/lib/api/client";
import type { Product } from "@/lib/api/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<readonly Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiClientError | null>(null);

  useEffect(() => {
    let active = true;
    void apiList<Product>("/api/v1/products?page=1&pageSize=5&sortBy=updatedAt&sortOrder=desc")
      .then((result) => {
        if (active) setProducts(result.data);
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
  }, []);

  if (!user) return null;

  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Chào {user.name}</h1>
          <p>Đây là tổng quan nhanh của workspace quản trị.</p>
        </div>
        {can(user.permissions, "PRODUCT_CREATE") ? (
          <div className="heading-actions">
            <Link className="button button-primary" href="/dashboard/products/new">
              Tạo sản phẩm
            </Link>
          </div>
        ) : null}
      </div>
      <div className="metrics-grid">
        <article className="metric-card">
          <span className="metric-label">Quyền hiện có</span>
          <strong className="metric-value">{user.permissions.length}</strong>
        </article>
        <article className="metric-card">
          <span className="metric-label">Vai trò</span>
          <strong className="metric-value">{user.roles.length}</strong>
        </article>
        <article className="metric-card">
          <span className="metric-label">Sản phẩm gần đây</span>
          <strong className="metric-value">{loading ? "—" : products.length}</strong>
        </article>
      </div>
      <section className="panel" aria-labelledby="recent-products-title">
        <div className="panel-header">
          <h2 id="recent-products-title">Sản phẩm cập nhật gần đây</h2>
          <Link className="button button-secondary button-small" href="/dashboard/products">
            Xem tất cả
          </Link>
        </div>
        {loading ? (
          <LoadingState label="Đang tải sản phẩm…" />
        ) : error ? (
          <ErrorState description={error.message} />
        ) : products.length === 0 ? (
          <p className="panel-body">Chưa có sản phẩm nào.</p>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Trạng thái</th>
                  <th>Cập nhật</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <Link className="table-primary" href={`/dashboard/products/${product.id}`}>
                        {product.name}
                      </Link>
                      <span className="table-secondary">{product.slug}</span>
                    </td>
                    <td>
                      <span
                        className={`badge ${product.status === "PUBLISHED" ? "badge-success" : product.status === "ARCHIVED" ? "badge-danger" : "badge-warning"}`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td>{new Date(product.updatedAt).toLocaleDateString("vi-VN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
