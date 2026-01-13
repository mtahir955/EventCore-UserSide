// src/lib/apiClient.ts
import axios from "axios";
import { API_BASE_URL } from "@/config/apiConfig";
import { isAdminContext } from "@/config/isAdminContext";
import { getSavedTenantId, getSavedAdminTenantId } from "@/config/tenantConfig";

const getToken = () => {
  if (typeof window === "undefined") return null;

  const adminMode = isAdminContext(window.location.pathname);

  const raw = adminMode
    ? localStorage.getItem("adminToken")
    : localStorage.getItem("buyerToken") ||
      localStorage.getItem("userToken") ||
      localStorage.getItem("staffToken") ||
      localStorage.getItem("hostToken") ||
      localStorage.getItem("token"); // fallback

  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return parsed?.token ?? parsed ?? raw;
  } catch {
    return raw;
  }
};

// ✅ keep named export (old imports)
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    config.headers = config.headers ?? {};
    const headers: any = config.headers as any;

    // ✅ Tenant: read from storage only (no async)
    const adminMode =
      typeof window !== "undefined" && isAdminContext(window.location.pathname);

    const tenantId = adminMode ? getSavedAdminTenantId() : getSavedTenantId();

    // only set if not already set
    if (!headers["X-Tenant-ID"] && !headers["x-tenant-id"] && tenantId) {
      headers["X-Tenant-ID"] = tenantId;
    }

    // ✅ Auth
    const token = getToken();
    if (token && !headers["Authorization"]) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ also default export
export default apiClient;



// import axios from "axios";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { resolveTenantId } from "@/config/tenantConfig";

// const getToken = () => {
//   if (typeof window === "undefined") return null;

//   // ✅ Priority: Admin → Staff → Host → Buyer/User → fallback token
//   const raw =
//     localStorage.getItem("adminToken") || // ✅ NEW
//     localStorage.getItem("buyerToken") ||
//     localStorage.getItem("userToken") ||
//     localStorage.getItem("staffToken") ||
//     localStorage.getItem("hostToken") ||
//     localStorage.getItem("token");

//   if (!raw) return null;

//   try {
//     const parsed = JSON.parse(raw);
//     return parsed?.token || parsed; // supports { token } or plain string
//   } catch {
//     return raw;
//   }
// };

// export const apiClient = axios.create({
//   baseURL: API_BASE_URL,
// });

// apiClient.interceptors.request.use((config) => {
//   const tenantId = resolveTenantId();
//   config.headers = config.headers || {};

//   // ✅ Always send tenant
//   if (tenantId) {
//     config.headers["X-Tenant-ID"] = tenantId;
//   }

//   // ✅ Always send token if exists
//   const token = getToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });


// import axios from "axios";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { resolveTenantId } from "@/config/tenantConfig";

// const getToken = () => {
//   if (typeof window === "undefined") return null;

//   const raw =
//     localStorage.getItem("buyerToken") ||
//     localStorage.getItem("userToken") ||
//     localStorage.getItem("staffToken") ||
//     localStorage.getItem("hostToken") ||
//     localStorage.getItem("token");

//   if (!raw) return null;

//   try {
//     const parsed = JSON.parse(raw);
//     return parsed?.token || parsed;
//   } catch {
//     return raw;
//   }
// };

// export const apiClient = axios.create({
//   baseURL: API_BASE_URL,
// });

// apiClient.interceptors.request.use((config) => {
//   const tenantId = resolveTenantId();
//   if (tenantId) {
//     config.headers = config.headers || {};
//     config.headers["X-Tenant-ID"] = tenantId;
//   }

//   const token = getToken();
//   if (token) {
//     config.headers = config.headers || {};
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });