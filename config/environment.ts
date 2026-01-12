/**
 * ============================================================================
 * ENVIRONMENT CONFIGURATION
 * ============================================================================
 * 
 * Centralized environment configuration.
 * 
 * REQUIRED ENV VARS (.env.local):
 * NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
 * NEXT_PUBLIC_ROOT_DOMAIN=eventcoresolutions.com
 * 
 * OPTIONAL:
 * NEXT_PUBLIC_DEV_TENANT=demo (for local testing without subdomain)
 * 
 * NOTE: Admin tenant ID (SAAS_TENANT_ID) is now fetched dynamically from
 * backend API endpoint: GET /tenants/public/resolve?subdomain=admin
 * 
 * ============================================================================
 */

// API - DEPRECATED: Use API_BASE_URL from @/config/apiConfig instead
// This export is kept for backward compatibility but should not be used in new code
// Import from @/config/apiConfig to get the runtime fallback logic
export { API_BASE_URL } from './apiConfig';

// Domain
export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'eventcoresolutions.com';
export const COOKIE_DOMAIN = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || '.eventcoresolutions.com';

// Environment
export const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV || 'development';
export const IS_PRODUCTION = APP_ENV === 'production';
export const IS_DEVELOPMENT = APP_ENV === 'development';

// Development
// ✅ This is subdomain name for localhost testing (e.g. "demo")
export const DEV_TENANT = process.env.NEXT_PUBLIC_DEV_TENANT || null;
