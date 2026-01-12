/**
 * ============================================================================
 * TENANT CONTEXT PROVIDER
 * ============================================================================
 * 
 * Provides tenant state throughout the application.
 * 
 * USAGE:
 * // In layout.tsx
 * <TenantProvider>{children}</TenantProvider>
 * 
 * // In components
 * const { tenant, isSuperAdmin, isLoading } = useTenant();
 * 
 * ============================================================================
 */

"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  getTenantFromHostname, 
  isSuperAdmin as checkIsSuperAdmin,
  getMarketingUrl,
  SUPER_ADMIN_SUBDOMAIN 
} from '@/lib/tenant';
import { getStoredTenantId, clearAuthToken } from '@/lib/api-client';

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface TenantContextValue {
  /** Current tenant subdomain (e.g., "mansoor", "admin") */
  tenant: string | null;
  
  /** True if current subdomain is Super Admin */
  isSuperAdmin: boolean;
  
  /** True while resolving tenant */
  isLoading: boolean;
  
  /** Error message if tenant invalid */
  error: string | null;
}

// ─────────────────────────────────────────────────────────────
// CONTEXT
// ─────────────────────────────────────────────────────────────

const TenantContext = createContext<TenantContextValue | null>(null);

// ─────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initTenant = () => {
      setIsLoading(true);
      setError(null);

      try {
        // Extract tenant from subdomain
        const subdomain = getTenantFromHostname();

        // No subdomain and not on localhost → redirect to marketing
        if (!subdomain && typeof window !== 'undefined') {
          const hostname = window.location.hostname;
          if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
            console.log('[Tenant] No subdomain, redirecting to marketing site');
            window.location.href = getMarketingUrl();
            return;
          }
        }

        // Cross-tenant access prevention
        const storedTenant = getStoredTenantId();
        if (storedTenant && subdomain && storedTenant !== subdomain) {
          console.warn('[Tenant] Tenant mismatch! Clearing session.', {
            stored: storedTenant,
            current: subdomain,
          });
          clearAuthToken();
        }

        // Set tenant
        setTenant(subdomain);
        
        // Store for future cross-tenant checks
        if (subdomain && typeof window !== 'undefined') {
          localStorage.setItem('currentTenantId', subdomain);
        }

        console.log('[Tenant] Initialized:', subdomain || 'none (dev mode)');
      } catch (err) {
        console.error('[Tenant] Initialization error:', err);
        setError('Failed to initialize tenant');
      } finally {
        setIsLoading(false);
      }
    };

    initTenant();
  }, []);

  const value = useMemo(() => ({
    tenant,
    isSuperAdmin: tenant === SUPER_ADMIN_SUBDOMAIN,
    isLoading,
    error,
  }), [tenant, isLoading, error]);

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────

/**
 * Hook to access tenant context.
 */
export function useTenant(): TenantContextValue {
  const context = useContext(TenantContext);
  
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  
  return context;
}

/**
 * Hook to get just the tenant ID.
 */
export function useTenantId(): string | null {
  const { tenant, isLoading } = useTenant();
  return isLoading ? null : tenant;
}

export default TenantProvider;

