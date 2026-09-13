import { apiSuccess } from "@/lib/api/response";
import { PERMISSIONS } from "@/server/authorization/permissions";
import { requirePermission } from "@/server/authorization/service";
import { apiRouteError, apiValidationError } from "@/server/api/route";
import { resourceIdSchema } from "@/server/api/schemas";
import { getPermissionService } from "@/server/services/permission.service";

const PATH = "/api/v1/permissions/[id]";
type RouteContext = { readonly params: Promise<{ readonly id: string }> };

export async function GET(_request: Request, context: RouteContext): Promise<Response> {
  try {
    const { id } = await context.params;
    const parsedId = resourceIdSchema.safeParse(id);
    if (!parsedId.success) return apiValidationError(PATH, parsedId.error);
    await requirePermission(PERMISSIONS.PERMISSION_VIEW);
    return apiSuccess(await getPermissionService(parsedId.data));
  } catch (error) {
    return apiRouteError(PATH, error);
  }
}
