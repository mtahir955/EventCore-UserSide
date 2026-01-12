/**
 * ============================================================================
 * TENANT RESOLUTION UTILITY
 * ============================================================================
 * 
 * Extracts tenant identifier from subdomain for multi-tenant architecture.
 * 
 * ROUTING:
 * - eventcoresolutions.com              → Marketing (no tenant)
 * - admin.eventcoresolutions.com        → Super Admin (special tenant)
 * - {tenant}.eventcoresolutions.com     → Tenant app
 * 
 * LOCAL DEVELOPMENT:
 * - localhost:3001                      → Use NEXT_PUBLIC_DEV_TENANT
 * - {tenant}.localhost:3001             → Tenant from subdomain
 * 
 * ============================================================================
 */

// Domain configuration
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'eventcoresolutions.com';

// Reserved subdomains that have special handling
const RESERVED_SUBDOMAINS = ['www', 'api', 'mail', 'smtp', 'ftp', 'cdn', 'static'];

// Super Admin subdomain - treated as special tenant
export const SUPER_ADMIN_SUBDOMAIN = 'admin';

/**
 * Extracts tenant identifier from the current hostname.
 * 
 * @returns {string | null} Tenant subdomain or null if on root domain
 * 
 * @example
 * // On mansoor.eventcoresolutions.com
 * getTenantFromHostname() // Returns: "mansoor"
 * 
 * // On admin.eventcoresolutions.com
 * getTenantFromHostname() // Returns: "admin"
 * 
 * // On eventcoresolutions.com (marketing)
 * getTenantFromHostname() // Returns: null
 */
export function getTenantFromHostname(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const hostname = window.location.hostname.toLowerCase();

  // ─────────────────────────────────────────────────────────────
  // LOCAL DEVELOPMENT
  // ─────────────────────────────────────────────────────────────
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Use environment variable for local testing
    return process.env.NEXT_PUBLIC_DEV_TENANT || null;
  }

  // Subdomain on localhost (e.g., mansoor.localhost)
  if (hostname.endsWith('.localhost')) {
    const subdomain = hostname.replace('.localhost', '');
    if (subdomain && !RESERVED_SUBDOMAINS.includes(subdomain)) {
      return subdomain;
    }
    return null;
  }

  // ─────────────────────────────────────────────────────────────
  // PRODUCTION
  // ─────────────────────────────────────────────────────────────

  // Root domain → no tenant (marketing site)
  if (hostname === ROOT_DOMAIN || hostname === `www.${ROOT_DOMAIN}`) {
    return null;
  }

  // Extract subdomain from *.eventcoresolutions.com
  if (hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    const subdomain = hostname.replace(`.${ROOT_DOMAIN}`, '');
    
    // Skip reserved subdomains (except admin which is valid)
    if (RESERVED_SUBDOMAINS.includes(subdomain)) {
      return null;
    }

    // Validate format (alphanumeric + hyphens)
    if (/^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/.test(subdomain)) {
      return subdomain;
    }
  }

  return null;
}

/**
 * Checks if current subdomain is Super Admin.
 */
export function isSuperAdmin(): boolean {
  const tenant = getTenantFromHostname();
  return tenant === SUPER_ADMIN_SUBDOMAIN;
}

/**
 * Checks if on root domain (marketing site).
 */
export function isRootDomain(): boolean {
  if (typeof window === 'undefined') return true;
  
  const hostname = window.location.hostname.toLowerCase();
  return (
    hostname === ROOT_DOMAIN ||
    hostname === `www.${ROOT_DOMAIN}` ||
    hostname === 'localhost' ||
    hostname === '127.0.0.1'
  );
}

// Cache for admin tenant ID to avoid repeated API calls
let adminTenantIdCache: string | null = null;
let adminTenantIdPromise: Promise<string | null> | null = null;

/**
 * Fetches admin tenant ID from backend API.
 * Caches the result to avoid repeated API calls.
 */
async function fetchAdminTenantId(): Promise<string | null> {
  // Return cached value if available
  if (adminTenantIdCache) {
    return adminTenantIdCache;
  }

  // Return existing promise if already fetching
  if (adminTenantIdPromise) {
    return adminTenantIdPromise;
  }

  // Create new fetch promise
  adminTenantIdPromise = (async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
      const response = await fetch(
        `${API_BASE_URL}/tenants/public/resolve?subdomain=${SUPER_ADMIN_SUBDOMAIN}`
      );

      if (!response.ok) {
        console.error('[Tenant] Failed to resolve admin tenant ID:', response.statusText);
        return null;
      }

      const data = await response.json();
      adminTenantIdCache = data.tenantId || null;
      return adminTenantIdCache;
    } catch (error) {
      console.error('[Tenant] Error fetching admin tenant ID:', error);
      return null;
    } finally {
      adminTenantIdPromise = null;
    }
  })();

  return adminTenantIdPromise;
}

/**
 * Gets the tenant ID to send to backend.
 * For Super Admin, fetches tenant ID from API.
 * For regular tenants, resolves from backend by subdomain.
 */
export async function getTenantIdForApi(): Promise<string | null> {
  const tenant = getTenantFromHostname();
  
  if (!tenant) return null;
  
  // Super Admin - fetch tenant ID from API
  if (tenant === SUPER_ADMIN_SUBDOMAIN) {
    return await fetchAdminTenantId();
  }
  
  // For regular tenants, the subdomain IS the tenant identifier
  // Backend will resolve subdomain → tenant UUID
  return tenant;
}

/**
 * Synchronous version - returns subdomain (for regular tenants) or null (for admin).
 * For admin, you need to use getTenantIdForApi() async version or X-Tenant-ID header from API interceptor.
 */
export function getTenantIdForApiSync(): string | null {
  const tenant = getTenantFromHostname();
  
  if (!tenant) return null;
  
  // For admin, return null (use async version or API interceptor)
  if (tenant === SUPER_ADMIN_SUBDOMAIN) {
    return null;
  }
  
  // For regular tenants, return subdomain
  return tenant;
}

/**
 * Generates URL for a specific tenant subdomain.
 */
export function getTenantUrl(tenant: string, path: string = ''): string {
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const port = process.env.NODE_ENV === 'production' ? '' : ':3001';
  const domain = process.env.NODE_ENV === 'production' ? ROOT_DOMAIN : 'localhost';
  
  return `${protocol}://${tenant}.${domain}${port}${path}`;
}

/**
 * Generates marketing site URL.
 */
export function getMarketingUrl(path: string = ''): string {
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  return `${protocol}://${ROOT_DOMAIN}${path}`;
}

