"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { apiRequest, ApiClientError } from "@/lib/api/client";
import type { Product, ProductStatus, ProductVisibility } from "@/lib/api/types";

type ProductFormValues = {
  name: string;
  slug: string;
  description: string;
  price: string;
  currency: string;
  status: ProductStatus;
  visibility: ProductVisibility;
};

function valuesFromProduct(product?: Product): ProductFormValues {
  return {
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    price: product?.price ?? "",
    currency: product?.currency ?? "USD",
    status: product?.status ?? "DRAFT",
    visibility: product?.visibility ?? "PRIVATE",
  };
}

export function ProductForm({ product }: { readonly product?: Product }) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(() => valuesFromProduct(product));
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const editing = Boolean(product);

  function updateValue<Key extends keyof ProductFormValues>(
    key: Key,
    value: ProductFormValues[Key],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const endpoint = editing ? `/api/v1/products/${product?.id}` : "/api/v1/products";

    try {
      const saved = await apiRequest<Product>(endpoint, {
        method: editing ? "PATCH" : "POST",
        body: JSON.stringify({ ...values, description: values.description || null }),
      });
      router.push(`/dashboard/products/${saved.id}`);
      router.refresh();
    } catch (reason: unknown) {
      setError(reason instanceof ApiClientError ? reason.message : "Không thể lưu sản phẩm.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="panel form-panel" onSubmit={handleSubmit} noValidate>
      <h2>{editing ? "Thông tin sản phẩm" : "Thông tin sản phẩm mới"}</h2>
      {error ? (
        <p className="form-alert" role="alert">
          {error}
        </p>
      ) : null}
      <div className="form-grid">
        <label className="field field-full">
          <span>Tên sản phẩm</span>
          <input
            value={values.name}
            onChange={(event) => updateValue("name", event.target.value)}
            required
            maxLength={200}
          />
        </label>
        <label className="field">
          <span>Slug</span>
          <input
            value={values.slug}
            onChange={(event) => updateValue("slug", event.target.value)}
            placeholder="ten-san-pham"
            required
            maxLength={220}
          />
          <span className="field-hint">Chỉ dùng chữ thường, số và dấu gạch ngang.</span>
        </label>
        <label className="field">
          <span>Giá</span>
          <input
            inputMode="decimal"
            value={values.price}
            onChange={(event) => updateValue("price", event.target.value)}
            placeholder="19.99"
            required
          />
        </label>
        <label className="field">
          <span>Currency</span>
          <input
            value={values.currency}
            onChange={(event) => updateValue("currency", event.target.value.toUpperCase())}
            maxLength={3}
            required
          />
        </label>
        <label className="field">
          <span>Trạng thái</span>
          <select
            value={values.status}
            onChange={(event) => updateValue("status", event.target.value as ProductStatus)}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </label>
        <label className="field">
          <span>Visibility</span>
          <select
            value={values.visibility}
            onChange={(event) => updateValue("visibility", event.target.value as ProductVisibility)}
          >
            <option value="PRIVATE">Private</option>
            <option value="PUBLIC">Public</option>
          </select>
        </label>
        <label className="field field-full">
          <span>Mô tả</span>
          <textarea
            value={values.description}
            onChange={(event) => updateValue("description", event.target.value)}
            maxLength={10_000}
          />
        </label>
      </div>
      <div className="form-actions">
        <Link
          className="button button-secondary"
          href={product ? `/dashboard/products/${product.id}` : "/dashboard/products"}
        >
          Hủy
        </Link>
        <button className="button button-primary" type="submit" disabled={submitting}>
          {submitting ? "Đang lưu…" : editing ? "Lưu thay đổi" : "Tạo sản phẩm"}
        </button>
      </div>
    </form>
  );
}
