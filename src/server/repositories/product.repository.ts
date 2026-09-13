import "server-only";

import type { Prisma, ProductStatus, ProductVisibility } from "@/generated/prisma/client";
import { prisma } from "@/lib/db/prisma";

export type ProductListQuery = {
  readonly page: number;
  readonly pageSize: number;
  readonly search?: string;
  readonly status?: ProductStatus;
  readonly visibility?: ProductVisibility;
  readonly sortBy: "name" | "slug" | "price" | "status" | "createdAt" | "updatedAt";
  readonly sortOrder: "asc" | "desc";
};

const productSelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  price: true,
  currency: true,
  status: true,
  visibility: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProductSelect;

export type ProductRecord = Prisma.ProductGetPayload<{ select: typeof productSelect }>;

export async function listProducts(query: ProductListQuery): Promise<{
  readonly items: readonly ProductRecord[];
  readonly total: number;
}> {
  const where: Prisma.ProductWhereInput = {
    deletedAt: null,
    ...(query.status ? { status: query.status } : {}),
    ...(query.visibility ? { visibility: query.visibility } : {}),
    ...(query.search
      ? {
          OR: [{ name: { contains: query.search } }, { slug: { contains: query.search } }],
        }
      : {}),
  };
  const orderBy = { [query.sortBy]: query.sortOrder } as Prisma.ProductOrderByWithRelationInput;

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
      select: productSelect,
    }),
    prisma.product.count({ where }),
  ]);

  return { items, total };
}

export async function findProductById(id: string): Promise<ProductRecord | null> {
  return prisma.product.findFirst({ where: { id, deletedAt: null }, select: productSelect });
}

export type ProductWriteData = {
  readonly name: string;
  readonly slug: string;
  readonly description: string | null;
  readonly price: string;
  readonly currency: string;
  readonly status: ProductStatus;
  readonly visibility: ProductVisibility;
};

export async function createProduct(data: ProductWriteData): Promise<ProductRecord> {
  return prisma.product.create({ data, select: productSelect });
}

export async function updateProduct(
  id: string,
  data: Partial<ProductWriteData>,
): Promise<ProductRecord | null> {
  const existing = await findProductById(id);
  if (!existing) return null;

  return prisma.product.update({ where: { id }, data, select: productSelect });
}

export async function archiveProduct(id: string): Promise<ProductRecord | null> {
  const existing = await findProductById(id);
  if (!existing) return null;

  return prisma.product.update({
    where: { id },
    data: { status: "ARCHIVED", visibility: "PRIVATE", deletedAt: new Date() },
    select: productSelect,
  });
}
