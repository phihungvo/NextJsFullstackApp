export function can(permissions: readonly string[], required: string | readonly string[]): boolean {
  const requiredPermissions = typeof required === "string" ? [required] : required;
  return requiredPermissions.every((permission) => permissions.includes(permission));
}
