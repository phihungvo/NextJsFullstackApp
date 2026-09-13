import "server-only";

import { z } from "zod";

import { paginationQuerySchema } from "@/lib/api/query";

const sortOrderSchema = z.enum(["asc", "desc"]).default("desc");
const codeSchema = z
  .string()
  .trim()
  .min(1)
  .max(100)
  .regex(/^[A-Z][A-Z0-9_]*$/, "Code chỉ được chứa chữ in hoa, số và dấu gạch dưới.");
const roleCodesSchema = z.array(codeSchema).max(20).default(["USER"]);
const optionalRoleCodesSchema = z.array(codeSchema).max(20).optional();
const permissionCodesSchema = z.array(codeSchema).max(100).default([]);
const optionalPermissionCodesSchema = z.array(codeSchema).max(100).optional();

const productFields = {
  name: z.string().trim().min(1).max(200),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(220)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug không hợp lệ."),
  description: z.string().trim().max(10_000).nullable().optional(),
  price: z
    .union([z.string(), z.number().finite().nonnegative()])
    .transform(String)
    .refine((value) => /^(0|[1-9]\d{0,9})(\.\d{1,2})?$/.test(value), {
      message: "Price phải là số không âm, tối đa 10 chữ số nguyên và 2 chữ số thập phân.",
    }),
  currency: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{3}$/, "Currency phải gồm đúng 3 chữ cái.")
    .default("USD"),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  visibility: z.enum(["PRIVATE", "PUBLIC"]).default("PRIVATE"),
};

export const productCreateSchema = z.object(productFields).strict();
export const productUpdateSchema = z
  .object({
    name: productFields.name.optional(),
    slug: productFields.slug.optional(),
    description: productFields.description,
    price: productFields.price.optional(),
    currency: productFields.currency.optional(),
    status: productFields.status.optional(),
    visibility: productFields.visibility.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Phải có ít nhất một field để cập nhật.",
    path: ["body"],
  });

export const productListQuerySchema = paginationQuerySchema.extend({
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  visibility: z.enum(["PRIVATE", "PUBLIC"]).optional(),
  sortBy: z
    .enum(["name", "slug", "price", "status", "createdAt", "updatedAt"])
    .default("createdAt"),
  sortOrder: sortOrderSchema,
});

export const userCreateSchema = z
  .object({
    email: z.email().transform((value) => value.toLowerCase()),
    name: z.string().trim().min(1).max(120),
    password: z.string().min(12).max(128),
    status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).default("ACTIVE"),
    roleCodes: roleCodesSchema,
  })
  .strict();

export const userUpdateSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    password: z.string().min(12).max(128).optional(),
    status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
    roleCodes: optionalRoleCodesSchema,
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Phải có ít nhất một field để cập nhật.",
    path: ["body"],
  });

export const userListQuerySchema = paginationQuerySchema.extend({
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
  sortBy: z.enum(["email", "name", "status", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: sortOrderSchema,
});

export const roleCreateSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    code: codeSchema,
    description: z.string().trim().max(500).nullable().optional(),
    permissionCodes: permissionCodesSchema,
  })
  .strict();

export const roleUpdateSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    code: codeSchema.optional(),
    description: z.string().trim().max(500).nullable().optional(),
    permissionCodes: optionalPermissionCodesSchema,
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "Phải có ít nhất một field để cập nhật.",
    path: ["body"],
  });

export const roleListQuerySchema = paginationQuerySchema.extend({
  sortBy: z.enum(["name", "code", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: sortOrderSchema,
});

export const permissionListQuerySchema = paginationQuerySchema.extend({
  sortBy: z.enum(["name", "code", "createdAt", "updatedAt"]).default("createdAt"),
  sortOrder: sortOrderSchema,
});

export const resourceIdSchema = z.string().trim().min(1).max(30);
