import { getQueryObject } from "@/lib/api/query";
import { apiSuccess } from "@/lib/api/response";
import { PERMISSIONS } from "@/server/authorization/permissions";
import { requirePermission } from "@/server/authorization/service";
import { apiInvalidJson, apiList, apiRouteError, apiValidationError } from "@/server/api/route";
import { userCreateSchema, userListQuerySchema } from "@/server/api/schemas";
import { createUserService, listUserService } from "@/server/services/user.service";

const PATH = "/api/v1/users";

export async function GET(request: Request): Promise<Response> {
  try {
    await requirePermission(PERMISSIONS.USER_VIEW);
    const parsedQuery = userListQuerySchema.safeParse(getQueryObject(request));
    if (!parsedQuery.success) return apiValidationError(PATH, parsedQuery.error);
    const result = await listUserService(parsedQuery.data);
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
  const parsed = userCreateSchema.safeParse(body);
  if (!parsed.success) return apiValidationError(PATH, parsed.error);

  try {
    await requirePermission(PERMISSIONS.USER_CREATE);
    return apiSuccess(await createUserService(parsed.data), 201);
  } catch (error) {
    return apiRouteError(PATH, error);
  }
}
