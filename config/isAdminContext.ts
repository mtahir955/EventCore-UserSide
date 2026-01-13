// src/config/isAdminContext.ts

/**
 * Admin context detection (route-based)
 * - Used for localhost routing (same host, different context)
 * - Also works in production regardless of subdomain
 */
const ADMIN_ROUTE_PREFIXES = [
  "/sign-in-admin",
  "/admin",
  "/tenant-management",
//   "/profile-settings-admin",
  "/host-management",
  "/system-settings",
  "/push-notification",
  "/tenant-form",
];

export function isAdminContext(pathname?: string | null): boolean {
  const path = pathname || (typeof window !== "undefined" ? window.location.pathname : "");
  if (!path) return false;

  return ADMIN_ROUTE_PREFIXES.some((prefix) => path === prefix || path.startsWith(prefix + "/"));
}
