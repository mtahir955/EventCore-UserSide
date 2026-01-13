/**
 * ============================================================================
 * CENTRALIZED API CLIENT
 * ============================================================================
 * 
 * Axios instance that automatically:
 * 1. Injects X-Tenant-ID header from subdomain
 * 2. Injects Authorization header if authenticated
 * 3. Handles 401 responses globally
 * 
 * USAGE:
 * import { apiClient } from '@/lib/api-client';
 * 
 * const response = await apiClient.get('/events');
 * const result = await apiClient.post('/auth/login', { email, password });
 * 
 * ============================================================================
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getTenantFromHostname, isSuperAdmin, SUPER_ADMIN_SUBDOMAIN } from './tenant';
import { API_BASE_URL } from '@/config/apiConfig'; // Use centralized config with runtime fallback

// ─────────────────────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────────────────────

// NOTE: API_BASE_URL is now imported from @/config/apiConfig
// This ensures we use the same runtime fallback logic everywhere

// Cache for tenant IDs (both admin and regular tenants)
const tenantIdCache: Map<string, string> = new Map();
const tenantIdPromises: Map<string, Promise<string | null>> = new Map();

/**
 * Fetches tenant ID from backend API for any subdomain (admin or regular tenant).
 * Caches the result to avoid repeated API calls.
 */
async function fetchTenantId(subdomain: string): Promise<string | null> {
  // Only run in browser (not SSR)
  if (typeof window === 'undefined') {
    return null;
  }

  // Return cached value if available
  if (tenantIdCache.has(subdomain)) {
    return tenantIdCache.get(subdomain) || null;
  }

  // Return existing promise if already fetching
  if (tenantIdPromises.has(subdomain)) {
    return tenantIdPromises.get(subdomain) || null;
  }

  // Create new fetch promise
  const fetchPromise = (async () => {
    try {
      // HARDCODED: Always use production API endpoint for tenant resolution
      const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
      const isProductionDomain = hostname.includes('eventcoresolutions.com') && !hostname.startsWith('api.');
      
      // HARDCODED API endpoint
      const hardcodedApiUrl = isProductionDomain 
        ? 'https://api.eventcoresolutions.com' 
        : (API_BASE_URL || 'http://localhost:8080');
      
      // HARDCODED: Tenant resolution endpoint
      const url = `${hardcodedApiUrl}/tenants/public/resolve?subdomain=${subdomain}`;
      console.log('[API] Fetching tenant ID from HARDCODED URL:', url);
      
      const response = await fetch(url);

      if (!response.ok) {
        console.error('[API] Failed to resolve tenant ID:', response.status, response.statusText);
        return null;
      }

      const data = await response.json();
      if (data && data.tenantId) {
        tenantIdCache.set(subdomain, data.tenantId);
        return data.tenantId;
      }
      
      console.error('[API] Invalid response format when resolving tenant ID:', data);
      return null;
    } catch (error) {
      console.error('[API] Error fetching tenant ID:', error);
      return null;
    } finally {
      tenantIdPromises.delete(subdomain);
    }
  })();

  tenantIdPromises.set(subdomain, fetchPromise);
  return fetchPromise;
}

// ─────────────────────────────────────────────────────────────
// TOKEN MANAGEMENT
// ─────────────────────────────────────────────────────────────

/**
 * Gets authentication token from localStorage.
 * Checks multiple keys for backward compatibility.
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;

  // Check role-specific tokens
  const keys = ['authToken', 'buyerToken', 'hostToken', 'staffToken', 'adminToken'];
  
  for (const key of keys) {
    const token = localStorage.getItem(key);
    if (token) {
      // Handle JSON-wrapped tokens
      if (token.startsWith('{')) {
        try {
          const parsed = JSON.parse(token);
          return parsed.token || parsed.access_token || null;
        } catch {
          continue;
        }
      }
      return token;
    }
  }
  
  return null;
}

/**
 * Stores authentication token with tenant association.
 */
export function setAuthToken(token: string, tenantId?: string): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('authToken', token);
  if (tenantId) {
    localStorage.setItem('currentTenantId', tenantId);
  }
}

/**
 * Clears all authentication data.
 */
export function clearAuthToken(): void {
  if (typeof window === 'undefined') return;

  const keys = ['authToken', 'buyerToken', 'hostToken', 'staffToken', 'adminToken', 
                'userData', 'hostUser', 'adminUser', 'staffUser', 'currentTenantId'];
  keys.forEach(key => localStorage.removeItem(key));
}

/**
 * Gets stored tenant ID for cross-tenant detection.
 */
export function getStoredTenantId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('currentTenantId');
}

// ─────────────────────────────────────────────────────────────
// AXIOS INSTANCE
// ─────────────────────────────────────────────────────────────

function createApiClient(): AxiosInstance {
  // HARDCODED: Ensure baseURL is always valid in production
  let baseURL: string;
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isProductionDomain = hostname.includes('eventcoresolutions.com') && !hostname.startsWith('api.');
    
    // HARDCODED: Always use production API when on production domain
    if (isProductionDomain) {
      baseURL = 'https://api.eventcoresolutions.com';
    } else {
      baseURL = API_BASE_URL || 'http://localhost:8080';
    }
  } else {
    // SSR fallback
    baseURL = API_BASE_URL || 'http://localhost:8080';
  }
  
  // Final validation - ensure baseURL is never empty or "/"
  if (!baseURL || baseURL === '/' || baseURL === '' || (!baseURL.startsWith('http://') && !baseURL.startsWith('https://'))) {
    baseURL = 'https://api.eventcoresolutions.com'; // Last resort hardcode
    console.error('[API Client] CRITICAL: baseURL was invalid, using hardcoded fallback:', baseURL);
  }
  
  console.log('[API Client] Creating Axios client with baseURL:', baseURL);
  
  const client = axios.create({
    baseURL: baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // REQUEST INTERCEPTOR
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // CRITICAL: Ensure baseURL is always valid
      if (!config.baseURL || config.baseURL === '/' || config.baseURL === '') {
        const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
        const isProductionDomain = hostname.includes('eventcoresolutions.com') && !hostname.startsWith('api.');
        config.baseURL = isProductionDomain ? 'https://api.eventcoresolutions.com' : (API_BASE_URL || 'http://localhost:8080');
        console.warn('[API Client] baseURL was invalid, using fallback:', config.baseURL);
      }
      
      // CRITICAL: Ensure URL is not empty or "/"
      if (!config.url || config.url === '/' || config.url === '') {
        console.error('[API Client] CRITICAL: Request URL is empty or "/"!', {
          method: config.method,
          url: config.url,
          baseURL: config.baseURL
        });
        return Promise.reject(new Error('Invalid API request: URL cannot be empty or "/"'));
      }
      
      const tenant = getTenantFromHostname();
      const fullUrl = `${config.baseURL}${config.url}`;
      
      // Validate full URL is absolute
      if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
        console.error('[API Client] CRITICAL: Full URL is not absolute!', {
          baseURL: config.baseURL,
          url: config.url,
          fullUrl: fullUrl
        });
        return Promise.reject(new Error(`Invalid API URL: ${fullUrl}`));
      }
      
      // Log all API requests
      console.log('[API Client] Making request:', {
        method: config.method,
        url: config.url,
        baseURL: config.baseURL,
        fullUrl: fullUrl,
        tenant: tenant
      });
      
      // Inject X-Tenant-ID header
      if (tenant) {
        // HARDCODED: Always resolve tenant ID from API for ALL tenants (admin and regular)
        const tenantId = await fetchTenantId(tenant);
        if (tenantId) {
          config.headers['X-Tenant-ID'] = tenantId;
        } else {
          console.warn('[API] Tenant ID not available for:', tenant);
          // Don't set header - backend will use default super admin tenant ID
        }
      }

      // Inject Authorization header
      const token = getAuthToken();
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // RESPONSE INTERCEPTOR
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;

      // Handle 401 Unauthorized
      if (status === 401) {
        console.warn('[API] 401 Unauthorized - Clearing auth');
        clearAuthToken();

        if (typeof window !== 'undefined') {
          const path = window.location.pathname;
          const tenant = getTenantFromHostname();
          
          // Redirect based on context
          if (tenant === SUPER_ADMIN_SUBDOMAIN) {
            window.location.href = '/sign-in-admin';
          } else if (path.startsWith('/host-')) {
            window.location.href = '/sign-in-host';
          } else if (path.startsWith('/staff-')) {
            window.location.href = '/sign-in-staff';
          } else {
            window.location.href = '/login';
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return client;
}

export const apiClient = createApiClient();

// ─────────────────────────────────────────────────────────────
// CONVENIENCE METHODS
// ─────────────────────────────────────────────────────────────

export const get = <T = any>(url: string, config?: any) => 
  apiClient.get<T>(url, config).then(r => r.data);

export const post = <T = any>(url: string, data?: any, config?: any) => 
  apiClient.post<T>(url, data, config).then(r => r.data);

export const put = <T = any>(url: string, data?: any, config?: any) => 
  apiClient.put<T>(url, data, config).then(r => r.data);

export const patch = <T = any>(url: string, data?: any, config?: any) => 
  apiClient.patch<T>(url, data, config).then(r => r.data);

export const del = <T = any>(url: string, config?: any) => 
  apiClient.delete<T>(url, config).then(r => r.data);

