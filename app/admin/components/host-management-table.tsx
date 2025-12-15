"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../config/apiConfig";
import { SAAS_Tenant_ID } from "@/config/sasTenantId";

interface Host {
  id: string;
  tenantName: string;
  email: string;
  category: string;
  subdomain: string;
  status: "Active" | "Banned";
  avatar: string;
}

// 🔐 Tenant header value (change if needed)
const TENANT_ID = "61b33c05-455f-43e6-89e4-e00a0f2a6c74";

interface HostManagementTableProps {
  searchQuery: string; // from parent
  statusFilter: string; // "all" | "active" | "banned"
}

export function HostManagementTable({
  searchQuery,
  statusFilter,
}: HostManagementTableProps) {
  const router = useRouter();

  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🔄 Fetch tenants whenever filters change
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🔥 Get token safely on client
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("adminToken")
            : null;

        if (!token) {
          console.warn("No token found — user may be logged out");
          setError("Authentication required");
          return;
        }

        const url = new URL(`${API_BASE_URL}/admin/tenants`);

        // Defaults
        url.searchParams.set("limit", "50");
        url.searchParams.set("page", "1");
        url.searchParams.set("sortOrder", "ASC");
        url.searchParams.set("sortBy", "name");

        if (searchQuery.trim() !== "") {
          url.searchParams.set("search", searchQuery.trim());
        }

        // Status mapping
        let apiStatus;
        if (statusFilter.toLowerCase() === "active") apiStatus = "ACTIVE";
        if (statusFilter.toLowerCase() === "banned") apiStatus = "SUSPENDED";

        if (apiStatus) {
          url.searchParams.set("status", apiStatus);
        }

        // 🔥 NOW INCLUDING TOKEN
        const res = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-tenant-id": SAAS_Tenant_ID,
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();
        console.log("Tenants API response:", data);

        // Handle different response shapes
        let tenantsRaw = [];

        if (Array.isArray(data)) tenantsRaw = data;
        else if (Array.isArray(data.items)) tenantsRaw = data.items;
        else if (Array.isArray(data.data)) tenantsRaw = data.data;
        else if (data.data && Array.isArray(data.data.items))
          tenantsRaw = data.data.items;

        const mappedHosts = tenantsRaw.map((t) => {
          const rawStatus = (t.status || "ACTIVE").toUpperCase();
          const uiStatus = rawStatus === "ACTIVE" ? "Active" : "Banned";

          return {
            id: t.id || t.tenantId || "",
            tenantName: t.name || t.tenantName || "Unnamed Tenant",
            email: t.email || "N/A",
            category: t.industry || "Event Organizer/Host",
            subdomain: t.subDomain || "",
            status: uiStatus,
            avatar: t.logoUrl || "/avatars/avatar-1.png",
          };
        });

        setHosts(mappedHosts);
      } catch (err) {
        console.error("Error fetching tenants:", err);
        setError("Failed to load hosts");
      } finally {
        setLoading(false);
      }
    };

    fetchTenants();
  }, [searchQuery, statusFilter]);

  // Extra client-side filter (in case backend doesn’t filter by search/status)
  const filteredHosts = hosts.filter((host) => {
    const matchesSearch =
      searchQuery === "" ||
      host.tenantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.id.includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" ||
      host.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // 🔹 Pagination (10 per page)
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 10;

  const indexOfLast = currentPage * entriesPerPage;
  const indexOfFirst = indexOfLast - entriesPerPage;

  const currentHosts = filteredHosts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredHosts.length / entriesPerPage);

  return (
    <div className="bg-background rounded-xl border border-border overflow-hidden overflow-x-auto">
      <table className="w-full text-center">
        <thead>
          <tr
            className="border-b border-border"
            style={{ background: "rgba(245, 237, 229, 1)" }}
          >
            <th className="text-center px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
              Tenant Name
            </th>
            <th className="text-center px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
              Email
            </th>
            <th className="text-center px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
              Category
            </th>
            <th className="text-center px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
              Sub-domain
            </th>
            <th className="text-center px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
              Status
            </th>
            <th className="text-center px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {/* Loading row */}
          {loading && (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-6 text-sm text-muted-foreground text-center"
              >
                Loading hosts...
              </td>
            </tr>
          )}

          {/* Error row */}
          {!loading && error && (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-6 text-sm text-red-600 text-center"
              >
                {error}
              </td>
            </tr>
          )}

          {/* No data row */}
          {!loading && !error && filteredHosts.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-6 text-sm text-muted-foreground text-center"
              >
                No hosts found.
              </td>
            </tr>
          )}

          {/* Data rows */}
          {!loading &&
            !error &&
            currentHosts.map((host, index) => (
              <tr
                key={`${host.id}-${index}`}
                onClick={() => router.push(`/host-management/${host.id}`)}
                className="border-b border-border last:border-b-0 hover:bg-secondary/50 cursor-pointer transition-colors"
              >
                <td className="pl-10 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-foreground overflow-hidden flex-shrink-0">
                      <Image
                        src={host.avatar || "/placeholder.svg"}
                        alt={host.tenantName}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm text-foreground font-medium">
                      {host.tenantName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {host.email}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {host.category}
                </td>
                <td className="px-6 py-4 text-sm text-foreground">
                  {host.subdomain ? (
                    <a
                      href={`https://${host.subdomain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0077F7] font-medium hover:underline"
                    >
                      {host.subdomain}
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "flex justify-center items-center px-3 py-1.5 rounded-full text-xs font-medium",
                      host.status === "Active"
                        ? "bg-[#e8f5e9] text-[#1b5e20]"
                        : "bg-[#ffebee] text-[#b71c1c]"
                    )}
                  >
                    {host.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    {/* Details Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/host-management/${host.id}`);
                      }}
                      className="
        px-4 py-1.5 
        text-sm font-medium 
        rounded-lg 
        bg-[#E8F0FE] 
        text-[#0077F7] 
        hover:bg-[#dbe7fd] 
        transition
      "
                    >
                      Events
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(
                          `/host-management/edit?tenantId=${host.id}`
                        );
                      }}
                      className="
        px-4 py-1.5 
        text-sm font-medium 
        rounded-lg 
        bg-[#0077F7] 
        text-white 
        hover:bg-blue-600 
        transition
      "
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 py-4">
          {/* Prev */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 border rounded-md disabled:opacity-40 dark:border-gray-700"
          >
            Prev
          </button>

          {/* Page numbers */}
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

          {/* Next */}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 border rounded-md disabled:opacity-40 dark:border-gray-700"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
