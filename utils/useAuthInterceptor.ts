"use client";

import axios from "axios";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useAuthInterceptor(role: "admin" | "host" | "staff" | "buyer") {
  const router = useRouter();

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,

      (error) => {
        const status = error?.response?.status;

        if (status === 401) {
          console.warn("❌ 401 detected → redirecting user");

          // Remove token based on user role
          switch (role) {
            case "admin":
              localStorage.removeItem("adminToken");
              router.push("/sign-in-admin");
              break;

            case "host":
              localStorage.removeItem("hostToken");
              router.push("/sign-in-host");
              break;

            case "staff":
              localStorage.removeItem("staffToken");
              router.push("/sign-in-staff");
              break;

            case "buyer":
              localStorage.removeItem("buyerToken");
              router.push("/sign-up");
              break;
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [role, router]);
}
