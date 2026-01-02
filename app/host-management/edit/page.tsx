"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "../../admin/components/sidebar";
import HostManagementForm from "./components/host-management-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Bell } from "lucide-react";
import Link from "next/link";
import LogoutModal from "@/components/modals/LogoutModal";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/config/apiConfig";
import { SAAS_Tenant_ID } from "@/config/sasTenantId";

export default function Home() {
  /* =====================================================
     STATE
  ===================================================== */
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const { theme, setTheme } = useTheme();
  const [adminName, setAdminName] = useState("Admin");

  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenantId");

  const [tenantData, setTenantData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  /* =====================================================
     LOAD ADMIN NAME (ONCE)
  ===================================================== */
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("adminUser");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setAdminName(parsed.userName || "Admin");
      }
    }
  }, []);

  /* =====================================================
     CLOSE PROFILE DROPDOWN ON OUTSIDE CLICK
  ===================================================== */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* =====================================================
     GET TENANT DATA
  ===================================================== */
  useEffect(() => {
    if (!tenantId) {
      toast.error("Tenant ID missing");
      setLoading(false);
      return;
    }

    const fetchTenant = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          toast.error("Session expired. Please login again.");
          return;
        }

        const res = await fetch(`${API_BASE_URL}/admin/tenants/${tenantId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "x-tenant-id": SAAS_Tenant_ID,
          },
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || "Failed to fetch tenant");
        }

        setTenantData(result.data || result);
      } catch (err: any) {
        toast.error(err.message || "Failed to load tenant data");
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, [tenantId]);

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar activePage="Tenant Host" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="hidden lg:flex bg-background border-b border-border px-8 py-6 items-center justify-between sticky top-0 z-30">
          <h1 className="text-3xl ml-62 font-semibold text-black dark:text-white ">
            Tenant Host
          </h1>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <Link href="/push-notification">
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-300">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
            </Link>

            {/* Profile */}
            <div className="relative flex items-center gap-2" ref={profileRef}>
              {/* Admin Name */}
              <span className="hidden sm:block font-semibold text-black dark:text-white">
                {adminName}
              </span>

              {/* Profile Icon */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="bg-black border h-9 w-9 flex justify-center items-center rounded-full hover:opacity-90"
                >
                  <img
                    src="/images/icons/profile-user.png"
                    alt="profile"
                    className="h-4 w-4"
                  />
                </button>

                {/* Dropdown */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#101010] shadow-lg border border-gray-200 dark:border-gray-800 rounded-xl z-50 py-2">
                    <Link href="/tenant-form">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg">
                        Create Tenant
                      </button>
                    </Link>

                    <Link href="/host-management">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg">
                        Tenant Host
                      </button>
                    </Link>

                    <Link href="/tenant-management">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg">
                        Tenant Management
                      </button>
                    </Link>

                    <Link href="/system-settings">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg">
                        System Settings
                      </button>
                    </Link>

                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

          {/* Page Content */}
          <div className="flex-1 overflow-auto bg-neutral-100 dark:bg-[#080808]">
            {loading ? (
              <div className="p-6 text-sm">Loading tenant data...</div>
            ) : (
              <HostManagementForm
                tenantId={tenantId!}
                initialData={tenantData}
              />
            )}
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onLogout={() => {
          localStorage.clear();
          window.location.href = "/sign-in-admin";
        }}
      />
    </div>
  );
}
