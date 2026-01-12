"use client";

import { useEffect } from "react";
import { apiClient } from "@/lib/apiClient";
import { getSavedTenantId, saveTenantId } from "@/config/tenantConfig";
import { getTenantSubdomainName } from "@/config/tenantSubdomain";

/**
 * On app load:
 * - detects tenant subdomain name (goodlife / demo)
 * - calls backend to resolve tenantId UUID
 * - saves tenantId -> used in apiClient interceptor
 */
export default function TenantBootstrap() {
  useEffect(() => {
    const run = async () => {
      // already set
      if (getSavedTenantId()) return;

      const subdomain = getTenantSubdomainName();
      if (!subdomain) return;

      try {
        const res = await apiClient.get(
          `/tenants/public/resolve?subdomain=${encodeURIComponent(subdomain)}`
        );

        // ✅ Adjust if your backend returns different keys
        const tenantId =
          res?.data?.data?.tenantId ||
          res?.data?.tenantId ||
          res?.data?.data?.tenant?.id ||
          res?.data?.tenant?.id ||
          res?.data?.data?.id ||
          res?.data?.id;

        if (tenantId) saveTenantId(String(tenantId));
      } catch (e) {
        console.log("TenantBootstrap: resolve failed", e);
      }
    };

    run();
  }, []);

  return null;
}
