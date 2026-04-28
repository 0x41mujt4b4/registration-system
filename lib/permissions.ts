/** Must match `vision_gateway` student route decorators (`Permissions`). */
export const STUDENTS_READ = "students:read";
export const STUDENTS_CREATE = "students:create";
export const USERS_READ = "users:read";
export const USERS_CREATE = "users:create";
export const TENANTS_READ = "tenants:read";
export const TENANTS_CREATE = "tenants:create";

export function hasPermission(permissions: string[] | undefined | null, permission: string): boolean {
  return Array.isArray(permissions) && permissions.includes(permission);
}

export function canAccessDashboard(permissions: string[] | undefined | null): boolean {
  return hasPermission(permissions, STUDENTS_READ);
}

export function canAccessRegistration(permissions: string[] | undefined | null): boolean {
  return hasPermission(permissions, STUDENTS_CREATE);
}

export function canReadUsers(permissions: string[] | undefined | null): boolean {
  return hasPermission(permissions, USERS_READ);
}

export function canCreateUsers(permissions: string[] | undefined | null): boolean {
  return hasPermission(permissions, USERS_CREATE);
}

export function canReadTenants(permissions: string[] | undefined | null): boolean {
  return hasPermission(permissions, TENANTS_READ);
}

export function canCreateTenants(permissions: string[] | undefined | null): boolean {
  return hasPermission(permissions, TENANTS_CREATE);
}

export function canManageUsers(role: string | undefined | null, permissions: string[] | undefined | null): boolean {
  return role === "admin" && canReadUsers(permissions);
}

export function canManageTenants(
  role: string | undefined | null,
  permissions: string[] | undefined | null,
  isMasterTenant: boolean | undefined | null,
): boolean {
  return role === "admin" && Boolean(isMasterTenant) && canReadTenants(permissions);
}

export function canAccessAdminPanel(
  role: string | undefined | null,
  permissions: string[] | undefined | null,
  isMasterTenant: boolean | undefined | null,
): boolean {
  return canManageUsers(role, permissions) || canManageTenants(role, permissions, isMasterTenant);
}

/**
 * Default landing path after login or visiting `/` while authenticated.
 * Prefer dashboard when both are granted.
 */
export function getPostLoginPath(
  permissions: string[] | undefined | null,
  role?: string | null,
  isMasterTenant?: boolean | null,
): string {
  if (canAccessAdminPanel(role, permissions, isMasterTenant)) return "/admin-panel";
  const read = canAccessDashboard(permissions);
  const create = canAccessRegistration(permissions);
  if (read && create) return "/dashboard";
  if (read) return "/dashboard";
  if (create) return "/registration";
  return "/no-access";
}
