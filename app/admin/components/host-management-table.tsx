"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Host {
  id: string;
  tenantName: string;
  email: string;
  category: string;
  subdomain: string;
  status: "Active" | "Banned";
  avatar: string;
}

const hosts: Host[] = [
  {
    id: "1",
    tenantName: "Tenant name",
    email: "info@example.com",
    category: "Event Organizer/Host",
    subdomain: "example.eventcore.com",
    status: "Active",
    avatar: "/avatars/avatar-1.png",
  },

  {
    id: "2",
    tenantName: "Tenant name",
    email: "info@example.com",
    category: "Event Organizer/Host",
    subdomain: "example.eventcore.com",
    status: "Banned",
    avatar: "/avatars/avatar-1.png",
  },

  {
    id: "3",
    tenantName: "Tenant name",
    email: "info@example.com",
    category: "Event Organizer/Host",
    subdomain: "example.eventcore.com",
    status: "Active",
    avatar: "/avatars/avatar-1.png",
  },

  {
    id: "4",
    tenantName: "Tenant name",
    email: "info@example.com",
    category: "Event Organizer/Host",
    subdomain: "example.eventcore.com",
    status: "Active",
    avatar: "/avatars/avatar-1.png",
  },

  {
    id: "5",
    tenantName: "Tenant name",
    email: "info@example.com",
    category: "Event Organizer/Host",
    subdomain: "example.eventcore.com",
    status: "Banned",
    avatar: "/avatars/avatar-1.png",
  },
];

interface HostManagementTableProps {
  searchQuery: string;
  statusFilter: string;
}

export function HostManagementTable({
  searchQuery,
  statusFilter,
}: HostManagementTableProps) {
  const router = useRouter();

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
          </tr>
        </thead>
        <tbody>
          {filteredHosts.map((host, index) => (
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
                <a
                  href={`https://${host.subdomain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0077F7] font-medium hover:underline"
                >
                  {host.subdomain}
                </a>
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
