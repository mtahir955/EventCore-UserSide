import axios from "axios";
import { API_BASE_URL } from "@/config/apiConfig";
import { resolveTenantId } from "@/config/tenantConfig";

const getToken = () => {
  if (typeof window === "undefined") return null;

  const raw =
    localStorage.getItem("buyerToken") ||
    localStorage.getItem("userToken") ||
    localStorage.getItem("staffToken") ||
    localStorage.getItem("hostToken") ||
    localStorage.getItem("token");

  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return parsed?.token || parsed;
  } catch {
    return raw;
  }
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const tenantId = resolveTenantId();
  if (tenantId) {
    config.headers = config.headers || {};
    config.headers["X-Tenant-ID"] = tenantId;
  }

  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


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
//   // Attach tenant header
//   const tenantId = resolveTenantId();
//   if (tenantId) {
//     config.headers = config.headers || {};
//     config.headers["X-Tenant-ID"] = tenantId;
//   }

//   // Attach Authorization token (if any)
//   const token = getToken();
//   if (token) {
//     config.headers = config.headers || {};
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   return config;
// });
