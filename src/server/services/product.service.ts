import "server-only";

import { Prisma, type ProductStatus, type ProductVisibility } from "@/generated/prisma/client";
import { createListMeta, type ListMeta } from "@/lib/api/query";
import { ERROR_CODES, ApplicationError } from "@/lib/api/errors";
import {
  archiveProduct,
  createProduct,
  findProductById,
  listProducts,
  updateProduct,
  type ProductListQuery,
  type ProductRecord,
  type ProductWriteData,
} from "@/server/repositories/product.repository";

export type ProductInput = {
  readonly name: string;
  readonly slug: string;
  readonly description?: string | null;
  readonly price: string;
  readonly currency: string;
  readonly status: ProductStatus;
  readonly visibility: ProductVisibility;
};

export type ProductUpdateInput = Partial<ProductInput>;

export type ProductDto = {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly description: string | null;
  readonly price: string;
  readonly currency: string;
  readonly status: ProductStatus;
  readonly visibility: ProductVisibility;
  readonly createdAt: string;
  readonly updatedAt: string;
};

function toProductDto(product: ProductRecord): ProductDto {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price.toString(),
    currency: product.currency,
    status: product.status,
    visibility: product.visibility,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

function toWriteData(input: ProductInput): ProductWriteData {
  return {
    ...input,
    description: input.description ?? null,
  };
}

function isUniqueConstraintError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export async function listProductService(query: ProductListQuery): Promise<{
  readonly items: readonly ProductDto[];
  readonly meta: ListMeta;
}> {
  const result = await listProducts(query);
  return {
    items: result.items.map(toProductDto),
    meta: createListMeta(query.page, query.pageSize, result.total),
  };
}

export async function getProductService(id: string): Promise<ProductDto> {
  const product = await findProductById(id);
  if (!product) throw new ApplicationError(ERROR_CODES.NOT_FOUND);
  return toProductDto(product);
}

export async function createProductService(input: ProductInput): Promise<ProductDto> {
  try {
    return toProductDto(await createProduct(toWriteData(input)));
  } catch (error) {
    if (isUniqueConstraintError(error)) throw new ApplicationError(ERROR_CODES.CONFLICT);
    throw error;
  }
}

export async function updateProductService(
  id: string,
  input: ProductUpdateInput,
): Promise<ProductDto> {
  try {
    const product = await updateProduct(id, {
      ...input,
      ...(input.description !== undefined ? { description: input.description ?? null } : {}),
    });
    if (!product) throw new ApplicationError(ERROR_CODES.NOT_FOUND);
    return toProductDto(product);
  } catch (error) {
    if (isUniqueConstraintError(error)) throw new ApplicationError(ERROR_CODES.CONFLICT);
    throw error;
  }
}

export async function archiveProductService(
  id: string,
): Promise<{ readonly id: string; readonly archived: true }> {
  const product = await archiveProduct(id);
  if (!product) throw new ApplicationError(ERROR_CODES.NOT_FOUND);
  return { id: product.id, archived: true };
}
