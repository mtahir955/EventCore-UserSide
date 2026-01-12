/**
 * ============================================================================
 * USE TENANT API HOOK
 * ============================================================================
 * 
 * Combines tenant context with API client for easy usage.
 * 
 * USAGE:
 * const { get, post, tenant, isSuperAdmin } = useTenantApi();
 * const events = await get('/events');
 * 
 * ============================================================================
 */

"use client";

import { useCallback, useMemo } from 'react';
import { useTenant } from '@/context/TenantContext';
import { 
  apiClient, 
  getAuthToken, 
  setAuthToken, 
  clearAuthToken,
  API_BASE_URL 
} from '@/lib/api-client';
import type { AxiosRequestConfig } from 'axios';

export function useTenantApi() {
  const { tenant, isSuperAdmin, isLoading, error } = useTenant();

  const get = useCallback(async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  }, []);

  const post = useCallback(async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  }, []);

  const put = useCallback(async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  }, []);

  const patch = useCallback(async <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  }, []);

  const del = useCallback(async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  }, []);

  return useMemo(() => ({
    tenant,
    isSuperAdmin,
    isLoading,
    error,
    baseUrl: API_BASE_URL,
    get,
    post,
    put,
    patch,
    del,
    getToken: getAuthToken,
    setToken: (token: string) => setAuthToken(token, tenant || undefined),
    clearAuth: clearAuthToken,
  }), [tenant, isSuperAdmin, isLoading, error, get, post, put, patch, del]);
}

export default useTenantApi;

