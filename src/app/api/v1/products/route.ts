import { apiInvalidJson, apiList, apiRouteError, apiValidationError } from "@/server/api/route";
import { productCreateSchema, productListQuerySchema } from "@/server/api/schemas";
import { getQueryObject } from "@/lib/api/query";
import { apiSuccess } from "@/lib/api/response";
import { requirePermission } from "@/server/authorization/service";
import { PERMISSIONS } from "@/server/authorization/permissions";
import { createProductService, listProductService } from "@/server/services/product.service";

const PATH = "/api/v1/products";

export async function GET(request: Request): Promise<Response> {
  try {
    await requirePermission(PERMISSIONS.PRODUCT_VIEW);
    const parsedQuery = productListQuerySchema.safeParse(getQueryObject(request));
    if (!parsedQuery.success) return apiValidationError(PATH, parsedQuery.error);

    const result = await listProductService(parsedQuery.data);
    return apiList(result.items, result.meta);
  } catch (error) {
    return apiRouteError(PATH, error);
  }
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiInvalidJson(PATH);
  }

  const parsed = productCreateSchema.safeParse(body);
  if (!parsed.success) return apiValidationError(PATH, parsed.error);

  try {
    await requirePermission(PERMISSIONS.PRODUCT_CREATE);
    const product = await createProductService(parsed.data);
    return apiSuccess(product, 201);
  } catch (error) {
    return apiRouteError(PATH, error);
  }
}
