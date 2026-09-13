import { getQueryObject } from "@/lib/api/query";
import { PERMISSIONS } from "@/server/authorization/permissions";
import { requirePermission } from "@/server/authorization/service";
import { apiList, apiRouteError, apiValidationError } from "@/server/api/route";
import { permissionListQuerySchema } from "@/server/api/schemas";
import { listPermissionService } from "@/server/services/permission.service";

const PATH = "/api/v1/permissions";

export async function GET(request: Request): Promise<Response> {
  try {
    await requirePermission(PERMISSIONS.PERMISSION_VIEW);
    const parsedQuery = permissionListQuerySchema.safeParse(getQueryObject(request));
    if (!parsedQuery.success) return apiValidationError(PATH, parsedQuery.error);
    const result = await listPermissionService(parsedQuery.data);
    return apiList(result.items, result.meta);
  } catch (error) {
    return apiRouteError(PATH, error);
  }
}
