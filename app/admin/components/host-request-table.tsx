"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { HostRequestModal } from "./host-request-modal";
// import { API_BASE_URL } from "../../../config/apiConfig";
// import { SAAS_Tenant_ID } from "../../../config/sasTenantId";
import apiClient from "@/lib/apiClient";

export interface Host {
  id: string;
  tenantName: string;
  email: string;
  category: string;
  subdomain: string;
  status: string;
  avatar?: string;
}

interface HostRequestTableProps {
  searchQuery: string;
  statusFilter: string;
}
// 🔥 UNIVERSAL FULL TOKEN CLEANER (Always works)
// function getCleanToken() {
//   if (typeof window === "undefined") return null;

//   let rawToken = localStorage.getItem("adminToken");
//   if (!rawToken) return null;

//   let token = rawToken;

//   // If token is a JSON object: { token: "..." }
//   try {
//     const parsed = JSON.parse(rawToken);
//     if (parsed?.token) {
//       token = parsed.token;
//     }
//   } catch (e) {
//     // not JSON → ignore
//   }

//   // Remove any random quotes added by backend or JSON.stringify
//   token = token.replace(/"/g, "").trim();

//   return token;
// }

export function HostRequestTable({
  searchQuery,
  statusFilter,
}: HostRequestTableProps) {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isHostRequestModalOpen, setIsHostRequestModalOpen] = useState(false);
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);

  // const token = getCleanToken(); // 🔥 Full clean token always

  // const fetchTenants = useCallback(async () => {
  //   if (!token) {
  //     setError("Admin token missing. Please log in again.");
  //     toast.error("Token missing.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);
  //     setError(null);

  //     const url = new URL(`${API_BASE_URL}/admin/tenants`);

  //     url.searchParams.set("limit", "50");
  //     url.searchParams.set("page", "1");
  //     url.searchParams.set("sortOrder", "ASC");
  //     url.searchParams.set("sortBy", "name");

  //     if (searchQuery.trim() !== "") {
  //       url.searchParams.set("search", searchQuery.trim());
  //     }

  //     let apiStatus: string | undefined;
  //     const sf = statusFilter.toLowerCase();

  //     if (sf === "active") apiStatus = "ACTIVE";
  //     else if (sf === "banned") apiStatus = "INACTIVE";

  //     if (apiStatus) url.searchParams.set("status", apiStatus);

  //     console.log("TOKEN SENT =", token);

  //     const res = await fetch(url.toString(), {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "x-tenant-id": SAAS_Tenant_ID,
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (!res.ok) {
  //       throw new Error(`Failed to fetch tenants (${res.status})`);
  //     }

  //     const json = await res.json();

  //     console.log("RAW TENANTS:", json);

  //     const tenantList: any[] = Array.isArray(json)
  //       ? json
  //       : json?.data || json?.items || [];

  //     const mappedHosts: Host[] = tenantList.map((tenant: any) => ({
  //       id: tenant.id || tenant.tenantId || "",
  //       tenantName: tenant.name || tenant.tenantName || "Unnamed Tenant",
  //       email: tenant.email || "—",
  //       category: tenant.industry || "Event Organizer/Host",
  //       subdomain:
  //         tenant.subDomain || tenant.subdomain || tenant.sub_domain || "",
  //       status: (tenant.status || "").toString(),
  //       avatar: tenant.logoUrl || tenant.logo || "/avatars/avatar-1.png",
  //     }));

  //     setHosts(mappedHosts);
  //   } catch (err: any) {
  //     console.error("Error fetching tenants:", err);
  //     setError(err.message || "Failed to fetch tenants");
  //     toast.error("Failed to load tenants");
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [searchQuery, statusFilter, token]);
  const fetchTenants = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        limit: 50,
        page: 1,
        sortOrder: "ASC",
        sortBy: "name",
      };

      if (searchQuery.trim() !== "") {
        params.search = searchQuery.trim();
      }

      const sf = statusFilter.toLowerCase();
      if (sf === "active") params.status = "ACTIVE";
      else if (sf === "banned") params.status = "INACTIVE";

      const res = await apiClient.get("/admin/tenants", { params });
      const json = res.data;

      console.log("RAW TENANTS:", json);

      const tenantList: any[] = Array.isArray(json)
        ? json
        : json?.data || json?.items || [];

      const mappedHosts: Host[] = tenantList.map((tenant: any) => ({
        id: tenant.id || tenant.tenantId || "",
        tenantName: tenant.name || tenant.tenantName || "Unnamed Tenant",
        email: tenant.email || "—",
        category: tenant.industry || "Event Organizer/Host",
        subdomain:
          tenant.subDomain || tenant.subdomain || tenant.sub_domain || "",
        status: (tenant.status || "").toString(),
        avatar: tenant.logoUrl || tenant.logo || "/avatars/avatar-1.png",
      }));

      setHosts(mappedHosts);
    } catch (err: any) {
      console.error("Error fetching tenants:", err);

      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load tenants";

      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const refreshAfterAction = async () => {
    await fetchTenants();
  };

  // const handleActivate = async (host: Host) => {
  //   if (!token) {
  //     toast.error("Token missing.");
  //     return;
  //   }

  //   try {
  //     const res = await fetch(`${API_BASE_URL}/tenants/${host.id}/activate`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "x-tenant-id": SAAS_Tenant_ID,
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (!res.ok) throw new Error(`Failed to activate (${res.status})`);

  //     toast.success("Tenant activated");
  //     await refreshAfterAction();
  //   } catch (err: any) {
  //     console.error("Activate error:", err);
  //     toast.error("Activation failed");
  //   }
  // };
  const handleActivate = async (host: Host) => {
    try {
      await apiClient.post(`/tenants/${host.id}/activate`);

      toast.success("Tenant activated successfully 🎉");
      await refreshAfterAction();
    } catch (err: any) {
      console.error("Activate error:", err);

      const msg =
        err?.response?.data?.message || err?.message || "Activation failed";

      toast.error(msg);
    }
  };

  // const handleDeactivate = async (host: Host) => {
  //   if (!token) {
  //     toast.error("Token missing.");
  //     return;
  //   }

  //   try {
  //     const res = await fetch(`${API_BASE_URL}/tenants/${host.id}/inactivate`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "x-tenant-id": SAAS_Tenant_ID,
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     if (!res.ok) throw new Error(`Failed to deactivate (${res.status})`);

  //     toast.success("Tenant deactivated");
  //     await refreshAfterAction();
  //   } catch (err: any) {
  //     console.error("Deactivate error:", err);
  //     toast.error("Deactivation failed");
  //   }
  // };
  const handleDeactivate = async (host: Host) => {
    try {
      await apiClient.post(`/tenants/${host.id}/inactivate`);

      toast.success("Tenant deactivated successfully 🎉");
      await refreshAfterAction();
    } catch (err: any) {
      console.error("Deactivate error:", err);

      const msg =
        err?.response?.data?.message || err?.message || "Deactivation failed";

      toast.error(msg);
    }
  };

  const openModalForHost = (host: Host) => {
    setSelectedHost(host);
    setIsHostRequestModalOpen(true);
  };

  const closeModal = () => {
    setIsHostRequestModalOpen(false);
    setSelectedHost(null);
  };

  // 🔹 Pagination (10 entries per page)
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;

  const currentHosts = hosts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(hosts.length / entriesPerPage);

  return (
    <div className="flex justify-center w-full">
      <div className="bg-background rounded-xl border border-border overflow-hidden overflow-x-auto w-full max-w-7xl">
        {loading && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Loading tenants...
          </div>
        )}

        {error && !loading && (
          <div className="p-4 text-center text-sm text-red-500">{error}</div>
        )}

        <table className="w-full text-center">
          <thead>
            <tr
              className="border-b border-border"
              style={{ background: "rgba(245, 237, 229, 1)" }}
            >
              <th className="px-6 py-4 text-sm font-semibold dark:text-black">
                Tenant Name
              </th>
              <th className="px-6 py-4 text-sm font-semibold dark:text-black">
                Email
              </th>
              <th className="px-6 py-4 text-sm font-semibold dark:text-black">
                Category
              </th>
              <th className="px-6 py-4 text-sm font-semibold dark:text-black">
                Sub-domain
              </th>
              <th className="px-6 py-4 text-sm font-semibold dark:text-black">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {hosts.length === 0 && !loading && !error && (
              <tr>
                <td colSpan={5} className="py-6 text-sm text-muted-foreground">
                  No tenants found.
                </td>
              </tr>
            )}

            {currentHosts.map((host) => {
              const isActive = host.status.toLowerCase() === "active";

              return (
                <tr
                  key={host.id}
                  onClick={() => openModalForHost(host)}
                  className="border-b border-border hover:bg-secondary/50 cursor-pointer"
                >
                  <td className="pl-10 py-4">
                    <div className="flex items-center gap-3">
                      {/* <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={host.avatar || "/avatars/avatar-1.png"}
                          alt={host.tenantName}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div> */}
                      <span className="text-sm font-medium">
                        {host.tenantName}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm">{host.email}</td>
                  <td className="px-6 py-4 text-sm">{host.category}</td>

                  <td className="px-6 py-4 text-sm">
                    {host.subdomain ? (
                      <a
                        href={`https://${host.subdomain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {host.subdomain}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-center">
                      {!isActive && (
                        <button
                          className="rounded-full px-6 py-1.5 text-sm text-white"
                          style={{ background: "#D19537" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleActivate(host);
                          }}
                        >
                          Activate
                        </button>
                      )}

                      {isActive && (
                        <button
                          className="rounded-full px-6 py-1.5 text-sm bg-accent"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeactivate(host);
                          }}
                        >
                          Deactivate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 py-4">
              {/* Prev Button */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 border rounded-md disabled:opacity-40 dark:border-gray-700"
              >
                Prev
              </button>

              {/* Page Numbers */}
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 border rounded-md ${
                    currentPage === i + 1
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "dark:border-gray-700 dark:bg-[#181818]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              {/* Next Button */}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 border rounded-md disabled:opacity-40 dark:border-gray-700"
              >
                Next
              </button>
            </div>
          )}
        </table>

        {/* <HostRequestModal
          isOpen={isHostRequestModalOpen}
          onClose={closeModal}
          host={selectedHost}
          onActivate={handleActivate}
          onDeactivate={handleDeactivate}
        /> */}
      </div>
    </div>
  );
}
