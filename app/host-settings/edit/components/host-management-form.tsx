"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import AccountSettingsSection from "./sections/account-settings";
import ContactDetailsSection from "./sections/contact-details";
import OtherPagesDataSection from "./sections/other-pages-data";
import SocialMediaLinksSection from "./sections/social-media-links";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function HostManagementForm() {
  const router = useRouter();

  const [hostData, setHostData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const accountRef = useRef();
  const contactRef = useRef();
  const otherRef = useRef();
  const socialRef = useRef();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        let token = localStorage.getItem("hostToken");

        try {
          const parsed = JSON.parse(token!);
          if (parsed?.token) token = parsed.token;
        } catch {}

        const res = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-tenant-id": HOST_Tenant_ID,
          },
        });

        setHostData(res.data.data);
      } catch (err) {
        console.log("❌ Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!hostData) return;

    const finalPayload = {
      ...accountRef.current?.getData?.(),
      ...contactRef.current?.getData?.(),
      ...socialRef.current?.getData?.(),
      ...otherRef.current?.getData?.(),
    };

    console.log("🔥 FINAL PAYLOAD SENT TO /users/me", finalPayload);

    let token = localStorage.getItem("hostToken");
    try {
      const parsed = JSON.parse(token!);
      if (parsed?.token) token = parsed.token;
    } catch {}

    try {
      const res = await axios.put(`${API_BASE_URL}/users/me`, finalPayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-tenant-id": HOST_Tenant_ID,
          "Content-Type": "application/json",
        },
      });

      toast.success("Updated successfully!");
      setHostData(res.data.data);
    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    }
  };

  if (loading || !hostData || !hostData.tenant) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  return (
    <div
      className="
        w-[329px]
        px-4 sm:px-6 lg:px-8 
        py-6 sm:py-8 
        mx-auto 
        space-y-6 
        sm:w-[95%] lg:w-[1170px] 
        sm:ml-0 lg:ml-[250px]
      "
    >
      {/* 🔙 BACK BUTTON */}
      {/* Desktop Button (md and up) */}
      <button
        onClick={() => router.push("/host-settings")}
        className="hidden md:flex items-center gap-2 text-gray-700 dark:text-gray-200 mb-6 hover:text-[#D19537] transition font-medium"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      {/* Mobile + Tablet Button (below md) */}
      <button
        onClick={() => router.push("/host-settings")}
        className="flex md:hidden mt-12 items-center gap-2 text-gray-700 dark:text-gray-200 mb-4 hover:text-[#D19537] transition font-medium"
      >
        <ArrowLeft size={18} />
        Go Back
      </button>

      {/* ⭐ Editable Sections */}
      <AccountSettingsSection ref={accountRef} host={hostData} />
      <ContactDetailsSection ref={contactRef} host={hostData} />
      <OtherPagesDataSection ref={otherRef} tenant={hostData.tenant} />
      <SocialMediaLinksSection ref={socialRef} tenant={hostData.tenant} />

      {/* ⭐ Save Button */}
      <div className="flex justify-end mt-4">
        <Button
          onClick={handleSave}
          className="bg-[#D19537] hover:bg-[#e59618] text-white font-medium px-6 py-4"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
