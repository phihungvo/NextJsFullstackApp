import { apiSuccess } from "@/lib/api/response";
import { PERMISSIONS } from "@/server/authorization/permissions";
import { requirePermission } from "@/server/authorization/service";
import { apiInvalidJson, apiRouteError, apiValidationError } from "@/server/api/route";
import { resourceIdSchema, userUpdateSchema } from "@/server/api/schemas";
import {
  deleteUserService,
  getUserService,
  updateUserService,
} from "@/server/services/user.service";

const PATH = "/api/v1/users/[id]";
type RouteContext = { readonly params: Promise<{ readonly id: string }> };

async function parseId(context: RouteContext): Promise<string | Response> {
  const { id } = await context.params;
  const parsed = resourceIdSchema.safeParse(id);
  return parsed.success ? parsed.data : apiValidationError(PATH, parsed.error);
}

export async function GET(_request: Request, context: RouteContext): Promise<Response> {
  try {
    const id = await parseId(context);
    if (id instanceof Response) return id;
    await requirePermission(PERMISSIONS.USER_VIEW);
    return apiSuccess(await getUserService(id));
  } catch (error) {
    return apiRouteError(PATH, error);
  }
}

export async function PATCH(request: Request, context: RouteContext): Promise<Response> {
  const id = await parseId(context);
  if (id instanceof Response) return id;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiInvalidJson(PATH);
  }
  const parsed = userUpdateSchema.safeParse(body);
  if (!parsed.success) return apiValidationError(PATH, parsed.error);

  try {
    const actor = await requirePermission(PERMISSIONS.USER_UPDATE);
    return apiSuccess(await updateUserService(id, parsed.data, actor.id));
  } catch (error) {
    return apiRouteError(PATH, error);
  }
}

export async function DELETE(_request: Request, context: RouteContext): Promise<Response> {
  try {
    const id = await parseId(context);
    if (id instanceof Response) return id;
    const actor = await requirePermission(PERMISSIONS.USER_DELETE);
    return apiSuccess(await deleteUserService(id, actor.id));
  } catch (error) {
    return apiRouteError(PATH, error);
  }
}
