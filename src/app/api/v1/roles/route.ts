import { getQueryObject } from "@/lib/api/query";
import { apiSuccess } from "@/lib/api/response";
import { PERMISSIONS } from "@/server/authorization/permissions";
import { requirePermission } from "@/server/authorization/service";
import { apiInvalidJson, apiList, apiRouteError, apiValidationError } from "@/server/api/route";
import { roleCreateSchema, roleListQuerySchema } from "@/server/api/schemas";
import { createRoleService, listRoleService } from "@/server/services/role.service";

const PATH = "/api/v1/roles";

export async function GET(request: Request): Promise<Response> {
  try {
    await requirePermission(PERMISSIONS.ROLE_VIEW);
    const parsedQuery = roleListQuerySchema.safeParse(getQueryObject(request));
    if (!parsedQuery.success) return apiValidationError(PATH, parsedQuery.error);
    const result = await listRoleService(parsedQuery.data);
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
  const parsed = roleCreateSchema.safeParse(body);
  if (!parsed.success) return apiValidationError(PATH, parsed.error);

  try {
    await requirePermission(PERMISSIONS.ROLE_CREATE);
    return apiSuccess(await createRoleService(parsed.data), 201);
  } catch (error) {
    return apiRouteError(PATH, error);
  }
}
