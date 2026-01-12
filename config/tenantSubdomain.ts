import { DEV_TENANT, ROOT_DOMAIN } from "@/config/environment";

/**
 * Returns tenant subdomain name
 * - localhost → DEV_TENANT (demo)
 * - prod → goodlife.eventcoresolutions.com → goodlife
 */
export const getTenantSubdomainName = (): string | null => {
  if (typeof window === "undefined") return null;

  const hostname = window.location.hostname;

  const isLocalhost =
    hostname === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname);

  if (isLocalhost) return DEV_TENANT;

  if (hostname.endsWith(ROOT_DOMAIN)) {
    const parts = hostname.split(".");
    if (parts.length >= 3) return parts[0];
  }

  return null;
};
