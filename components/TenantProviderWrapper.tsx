"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "@/config/apiConfig";
import { isAdminContext } from "@/config/isAdminContext";
import {
  getSavedTenantId,
  saveTenantId,
  getSavedAdminTenantId,
  saveAdminTenantId,
} from "@/config/tenantConfig";
import { getTenantSubdomainName } from "@/config/tenantSubdomain";

export default function TenantProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const resolveTenant = async () => {
      const adminMode = isAdminContext(pathname);

      // 1) already resolved for this context?
      const existing = adminMode ? getSavedAdminTenantId() : getSavedTenantId();
      if (existing) {
        if (!cancelled) setReady(true);
        return;
      }

      // 2) choose subdomain
      const subdomain = adminMode ? "admin" : getTenantSubdomainName();
      if (!subdomain) {
        if (!cancelled) setReady(true);
        return;
      }

      try {
        // ✅ IMPORTANT: use plain axios here (NO interceptors)
        const res = await axios.get(
          `${API_BASE_URL}/tenants/public/resolve?subdomain=${encodeURIComponent(
            subdomain
          )}`
        );

        const tenantId =
          res?.data?.data?.tenantId ||
          res?.data?.tenantId ||
          res?.data?.data?.tenant?.id ||
          res?.data?.tenant?.id ||
          res?.data?.data?.id ||
          res?.data?.id;

        if (tenantId) {
          if (adminMode) saveAdminTenantId(String(tenantId));
          else saveTenantId(String(tenantId));
        }
      } catch (err) {
        console.error("Tenant resolve failed:", err);
      } finally {
        if (!cancelled) setReady(true);
      }
    };

    resolveTenant();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  if (!ready) return null;
  return <>{children}</>;
}

// "use client";

// import { useEffect, useState } from "react";
// import { apiClient } from "@/lib/apiClient";
// import { getSavedTenantId, saveTenantId } from "@/config/tenantConfig";
// import { getTenantSubdomainName } from "@/config/tenantSubdomain";

// export default function TenantProviderWrapper({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     const resolveTenant = async () => {
//       // 1️⃣ already resolved
//       const existing = getSavedTenantId();
//       if (existing) {
//         setReady(true);
//         return;
//       }

//       // 2️⃣ detect subdomain (demo / goodlife / admin)
//       const subdomain = getTenantSubdomainName();
//       if (!subdomain) {
//         setReady(true); // allow app to load without tenant (public pages)
//         return;
//       }

//       try {
//         // 3️⃣ resolve tenantId from backend
//         const res = await apiClient.get(
//           `/tenants/public/resolve?subdomain=${encodeURIComponent(subdomain)}`
//         );

//         const tenantId =
//           res?.data?.data?.tenantId ||
//           res?.data?.tenantId ||
//           res?.data?.data?.tenant?.id ||
//           res?.data?.tenant?.id ||
//           res?.data?.data?.id ||
//           res?.data?.id;

//         if (tenantId) saveTenantId(String(tenantId));
//       } catch (err) {
//         console.error("Tenant resolve failed:", err);
//       } finally {
//         setReady(true);
//       }
//     };

//     resolveTenant();
//   }, []);

//   // ⛔ prevent API calls before tenant is resolved
//   if (!ready) return null;

//   return <>{children}</>;
// }

//------------------------------------

// "use client";

// /**
//  * ============================================================================
//  * TENANT PROVIDER WRAPPER
//  * ============================================================================
//  *
//  * Client-side wrapper for TenantProvider.
//  * Required because layout.tsx is a Server Component.
//  *
//  * ============================================================================
//  */

// import { TenantProvider } from "@/context/TenantContext";
// import React from "react";

// export default function TenantProviderWrapper({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return <TenantProvider>{children}</TenantProvider>;
// }
