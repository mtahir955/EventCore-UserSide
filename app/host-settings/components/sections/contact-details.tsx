"use client";

import { MapPin } from "lucide-react";

export default function ContactDetailsSection({ host }: any) {
  return (
    <div className="w-full bg-white dark:bg-[#101010] rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 md:p-8 space-y-6">
      <div className="flex items-center gap-3">
        <MapPin size={24} className="text-gray-700 dark:text-white" />
        <h3 className="text-xl font-bold">Contact Details</h3>
      </div>

      <div className="space-y-2">
        <label>Phone Number</label>
        <div className="px-4 py-2 bg-gray-100 dark:bg-[#181818] border rounded-lg">
          {host.mobileNumber || "N/A"}
        </div>
      </div>

      <div className="space-y-2">
        <label>City</label>
        <div className="px-4 py-2 bg-gray-100 dark:bg-[#181818] border rounded-lg">
          {host.city || "N/A"}
        </div>
      </div>

      <div className="space-y-2">
        <label>Address</label>
        <div className="px-4 py-2 bg-gray-100 dark:bg-[#181818] border rounded-lg">
          {host.address || "N/A"}
        </div>
      </div>
    </div>
  );
}
