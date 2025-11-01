"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HostRequestModal } from "./host-request-modal";

interface Host {
  id: string;
  name: string;
  email: string;
  category: string;
  address: string;
  status: "Active" | "Banned";
  avatar: string;
}

const hosts: Host[] = [
  {
    id: "1",
    name: "Daniel Carter",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    status: "Banned",
    avatar: "/avatars/avatar-1.png",
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    status: "Active",
    avatar: "/avatars/avatar-1.png",
  },
  {
    id: "3",
    name: "Emily Carter",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    status: "Active",
    avatar: "/avatars/avatar-1.png",
  },
  {
    id: "4",
    name: "Nathan Blake",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    status: "Banned",
    avatar: "/avatars/avatar-1.png",
  },
  {
    id: "5",
    name: "Taylor Morgan",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    status: "Banned",
    avatar: "/avatars/avatar-1.png",
  },
  {
    id: "6",
    name: "Daniel Carter",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    status: "Active",
    avatar: "/avatars/avatar-1.png",
  },
  {
    id: "7",
    name: "Sarah Mitchell",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    status: "Active",
    avatar: "/avatars/avatar-1.png",
  },
  {
    id: "8",
    name: "Emily Carter",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    status: "Banned",
    avatar: "/avatars/avatar-1.png",
  },
  {
    id: "9",
    name: "Nathan Blake",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    status: "Active",
    avatar: "/avatars/avatar-1.png",
  },
  {
    id: "10",
    name: "Taylor Morgan",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    status: "Active",
    avatar: "/avatars/avatar-1.png",
  },
  {
    id: "11",
    name: "Daniel Carter",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    status: "Banned",
    avatar: "/avatars/avatar-1.png",
  },
  {
    id: "12",
    name: "Daniel Carter",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    status: "Active",
    avatar: "/avatars/avatar-1.png",
  },
  {
    id: "13",
    name: "Sarah Mitchell",
    email: "Info@gmail.com",
    category: "Organizer/Host",
    address: "Washington DC, USA",
    status: "Active",
    avatar: "/avatars/avatar-1.png",
  },
];

interface HostRequestTableProps {
  searchQuery: string;
  statusFilter: string;
}

export function HostRequestTable({
  searchQuery,
  statusFilter,
}: HostRequestTableProps) {
  const filteredHosts = hosts.filter((host) => {
    const matchesSearch =
      searchQuery === "" ||
      host.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      host.id.includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" ||
      host.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });
  const [isHostRequestModalOpen, setIsHostRequestModalOpen] = useState(false);
  return (
    <div className="flex justify-center w-full">
      <div className="bg-background rounded-xl border border-border overflow-hidden overflow-x-auto w-full max-w-7xl">
        <table className="w-full text-center">
          <thead>
            <tr
              className="border-b border-border"
              style={{ background: "rgba(245, 237, 229, 1)" }}
            >
              <th className="text-center px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
                Name
              </th>
              <th className="text-center px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
                Email
              </th>
              <th className="text-center px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
                Category
              </th>
              <th className="text-center px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
                Address
              </th>
              <th className="text-center px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredHosts.map((host, index) => (
              <tr
                key={`${host.id}-${index}`}
                onClick={() => {
                  setIsHostRequestModalOpen(true);
                }}
                className="border-b border-border last:border-b-0 hover:bg-secondary/50 cursor-pointer transition-colors"
              >
                <td className="pl-10 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-foreground overflow-hidden flex-shrink-0">
                      <Image
                        src={host.avatar || "/placeholder.svg"}
                        alt={host.name}
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm text-foreground font-medium">
                      {host.name}
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
                  {host.address}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 justify-center">
                    <button
                      className="rounded-full px-6 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
                      style={{ background: "rgba(209, 149, 55, 1)" }}
                    >
                      Accept
                    </button>
                    <button className="rounded-full bg-accent px-6 py-1.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90">
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <HostRequestModal
          isOpen={isHostRequestModalOpen}
          onClose={() => setIsHostRequestModalOpen(false)}
        />
      </div>
    </div>
  );
}
