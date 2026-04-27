/** Must match `vision_gateway` student route decorators (`Permissions`). */
export const STUDENTS_READ = "students:read";
export const STUDENTS_CREATE = "students:create";

export function hasPermission(permissions: string[] | undefined | null, permission: string): boolean {
  return Array.isArray(permissions) && permissions.includes(permission);
}

export function canAccessDashboard(permissions: string[] | undefined | null): boolean {
  return hasPermission(permissions, STUDENTS_READ);
}

export function canAccessRegistration(permissions: string[] | undefined | null): boolean {
  return hasPermission(permissions, STUDENTS_CREATE);
}

/**
 * Default landing path after login or visiting `/` while authenticated.
 * Prefer dashboard when both are granted.
 */
export function getPostLoginPath(permissions: string[] | undefined | null): string {
  const read = canAccessDashboard(permissions);
  const create = canAccessRegistration(permissions);
  if (read && create) return "/dashboard";
  if (read) return "/dashboard";
  if (create) return "/registration";
  return "/no-access";
}
