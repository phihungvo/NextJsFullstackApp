"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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
import { ProductForm } from "@/features/products/product-form";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiClientError | null>(null);

  useEffect(() => {
    let active = true;
    void apiRequest<Product>(`/api/v1/products/${params.id}`)
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
  }, [params.id]);

  if (!user || loading) return loading ? <LoadingState label="Đang tải sản phẩm…" /> : null;
  if (error) {
    if (error.status === 401) return <UnauthorizedState />;
    if (error.status === 403) return <ForbiddenState />;
    if (error.status === 404) return <NotFoundState />;
    return <ErrorState description={error.message} />;
  }
  if (!can(user.permissions, "PRODUCT_UPDATE")) return <ForbiddenState />;
  if (!product) return <NotFoundState />;

  return (
    <section>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1>Chỉnh sửa sản phẩm</h1>
          <p>Cập nhật thông tin và lifecycle của {product.name}.</p>
        </div>
      </div>
      <ProductForm product={product} />
    </section>
  );
}
