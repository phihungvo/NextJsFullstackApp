"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ErrorState,
  ForbiddenState,
  LoadingState,
  NotFoundState,
  UnauthorizedState,
} from "@/components/ui/states";
import { useAuth } from "@/features/auth/auth-provider";
import { can } from "@/features/auth/permissions";
import { apiRequest, ApiClientError } from "@/lib/api/client";
import type { Product } from "@/lib/api/types";

export function ProductDetail({ productId }: { readonly productId: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiClientError | null>(null);
  const [archiving, setArchiving] = useState(false);

  useEffect(() => {
    let active = true;
    void apiRequest<Product>(`/api/v1/products/${productId}`)
      .then((result) => {
        if (active) setProduct(result);
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
  }, [productId]);

  async function archive() {
    if (!product || !window.confirm("Bạn có chắc muốn archive sản phẩm này?")) return;
    setArchiving(true);
    try {
      await apiRequest(`/api/v1/products/${product.id}`, { method: "DELETE" });
      router.push("/dashboard/products");
      router.refresh();
    } catch (reason: unknown) {
      setError(reason instanceof ApiClientError ? reason : new ApiClientError(0, {}));
      setArchiving(false);
    }
  }

  if (!user || loading)
    return loading ? <LoadingState label="Đang tải chi tiết sản phẩm…" /> : null;
  if (error) {
    if (error.status === 401) return <UnauthorizedState />;
    if (error.status === 403) return <ForbiddenState />;
    if (error.status === 404) return <NotFoundState />;
    return <ErrorState description={error.message} />;
  }
  if (!product) return <NotFoundState />;

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Product detail</p>
          <h1>{product.name}</h1>
          <p>{product.slug}</p>
        </div>
        <div className="heading-actions">
          <Link className="button button-secondary" href="/dashboard/products">
            Quay lại
          </Link>
          {can(user.permissions, "PRODUCT_UPDATE") ? (
            <Link className="button button-primary" href={`/dashboard/products/${product.id}/edit`}>
              Chỉnh sửa
            </Link>
          ) : null}
          {can(user.permissions, "PRODUCT_DELETE") && product.status !== "ARCHIVED" ? (
            <button
              className="button button-danger"
              type="button"
              onClick={() => void archive()}
              disabled={archiving}
            >
              {archiving ? "Đang archive…" : "Archive"}
            </button>
          ) : null}
        </div>
      </div>
      <div className="detail-grid">
        <article className="panel">
          <div className="panel-header">
            <h2>Thông tin chính</h2>
            <span
              className={`badge ${product.status === "PUBLISHED" ? "badge-success" : product.status === "ARCHIVED" ? "badge-danger" : "badge-warning"}`}
            >
              {product.status}
            </span>
          </div>
          <div className="panel-body">
            <dl className="detail-list">
              <div>
                <dt>Mô tả</dt>
                <dd>{product.description || "Chưa có mô tả."}</dd>
              </div>
              <div>
                <dt>Giá</dt>
                <dd>
                  {product.price} {product.currency}
                </dd>
              </div>
              <div>
                <dt>Visibility</dt>
                <dd>{product.visibility}</dd>
              </div>
            </dl>
          </div>
        </article>
        <aside className="panel">
          <div className="panel-header">
            <h2>Metadata</h2>
          </div>
          <div className="panel-body">
            <dl className="detail-list">
              <div>
                <dt>ID</dt>
                <dd>{product.id}</dd>
              </div>
              <div>
                <dt>Tạo lúc</dt>
                <dd>{new Date(product.createdAt).toLocaleString("vi-VN")}</dd>
              </div>
              <div>
                <dt>Cập nhật</dt>
                <dd>{new Date(product.updatedAt).toLocaleString("vi-VN")}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </section>
  );
}
