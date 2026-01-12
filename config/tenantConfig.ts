/**
 * Tenant ID Storage + Resolution
 */

const TENANT_STORAGE_KEY = "tenantId";

export const saveTenantId = (tenantId: string) => {
  if (typeof window === "undefined") return;
  if (!tenantId) return;
  localStorage.setItem(TENANT_STORAGE_KEY, tenantId);
};

export const getSavedTenantId = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TENANT_STORAGE_KEY);
};

export const getTenantFromQuery = (): string | null => {
  if (typeof window === "undefined") return null;
  const url = new URL(window.location.href);
  // optional debug: ?tenant=<TENANT_ID_UUID>
  return url.searchParams.get("tenant");
};

/**
 * Resolve tenantId (UUID) for API headers.
 * Source priority:
 * 1) localStorage tenantId
 * 2) ?tenant=<uuid> query (debug)
 * Otherwise null (Bootstrap will set it)
 */
export const resolveTenantId = (): string | null => {
  const saved = getSavedTenantId();
  if (saved) return saved;

  const q = getTenantFromQuery();
  if (q) return q;

  return null;
};


// /**
//  * Tenant ID Resolution (Multi-tenant)
//  *
//  * Goal: Don't hardcode tenant ids in separate files.
//  * Resolve tenant id dynamically (domain/subdomain) + allow fallbacks:
//  * 1) localStorage (saved after login or tenant public call)
//  * 2) subdomain mapping (optional)
//  * 3) query param (?tenant=...)
//  * 4) fallback to env or null
//  */

// const TENANT_STORAGE_KEY = "tenantId";

// /**
//  * Optional: if you have known subdomains for production tenants
//  * Example:
//  *  - goodlife.eventcoresolutions.com -> <tenant-id>
//  *  - mma.eventcoresolutions.com -> <tenant-id>
//  *
//  * If you don't want mapping, keep it empty and rely on /tenants/public/about.
//  */
// const TENANT_MAP: Record<string, string> = {
//   // "goodlife": "6b36e1fa-b520-4858-a60d-8fade294ac0d",
//   // "mma": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
// };

// export const saveTenantId = (tenantId: string) => {
//   if (typeof window === "undefined") return;
//   if (!tenantId) return;
//   localStorage.setItem(TENANT_STORAGE_KEY, tenantId);
// };

// export const getSavedTenantId = (): string | null => {
//   if (typeof window === "undefined") return null;
//   return localStorage.getItem(TENANT_STORAGE_KEY);
// };

// export const getTenantFromQuery = (): string | null => {
//   if (typeof window === "undefined") return null;
//   const url = new URL(window.location.href);
//   return url.searchParams.get("tenant");
// };

// export const getSubdomain = (): string | null => {
//   if (typeof window === "undefined") return null;

//   const hostname = window.location.hostname; // e.g. goodlife.eventcoresolutions.com
//   const parts = hostname.split(".");

//   // localhost or IP
//   if (hostname === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) return null;

//   // Expecting something like subdomain.eventcoresolutions.com
//   if (parts.length >= 3) return parts[0];

//   return null;
// };

// // export const resolveTenantId = (): string | null => {
// //   // 1) saved
// //   const saved = getSavedTenantId();
// //   if (saved) return saved;

// //   // 2) query param
// //   const q = getTenantFromQuery();
// //   if (q) return q;

// //   // 3) subdomain map
// //   const sub = getSubdomain();
// //   if (sub && TENANT_MAP[sub]) return TENANT_MAP[sub];

// //   // 4) env fallback (optional)
// //   // NOTE: Next.js bakes NEXT_PUBLIC_* at build time.
// //   const envTenant = process.env.NEXT_PUBLIC_TENANT_ID;
// //   if (envTenant) return envTenant;

// //   return null;
// // };

// export const resolveTenantId = (): string | null => {
//   if (typeof window === "undefined") return null;

//   const hostname = window.location.hostname;

//   // 1) localStorage always wins (login/public call can save it)
//   const saved = getSavedTenantId();
//   if (saved) return saved;

//   // 2) Query param (useful for QA/testing)
//   const q = getTenantFromQuery();
//   if (q) return q;

//   // ✅ DEV ONLY: localhost / IP fallback
//   const isLocalhost =
//     hostname === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname);

//   if (isLocalhost) {
//     const devTenant = process.env.NEXT_PUBLIC_DEV_TENANT_ID;
//     return devTenant || null;
//   }

//   // ✅ PROD: subdomain-based
//   const sub = getSubdomain(); // e.g. goodlife from goodlife.eventcoresolutions.com
//   if (sub && TENANT_MAP[sub]) return TENANT_MAP[sub];

//   // Optional fallback for production (only if you want it)
//   const envTenant = process.env.NEXT_PUBLIC_TENANT_ID;
//   if (envTenant) return envTenant;

//   return null;
// };
