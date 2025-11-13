"use client";

import { useRouter } from "next/navigation";
import BasicInformationSection from "./sections/basic-information";
import AccountSettingsSection from "./sections/account-settings";
import ContactDetailsSection from "./sections/contact-details";
import OtherPagesDataSection from "./sections/other-pages-data";
import SocialMediaLinksSection from "./sections/social-media-links";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function HostManagementForm() {
  const router = useRouter();

  const handleCreateTenant = () => {
    toast.success("Save changes successfully 🎉", {
      duration: 4000,
      position: "bottom-right",
      style: {
        background: "#101010",
        color: "#fff",
        border: "1px solid #D19537",
      },
      iconTheme: {
        primary: "#D19537",
        secondary: "#fff",
      },
    });
  };

  const handleBack = () => {
    router.push("/host-settings");
  };

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
      {/* 🔙 Back Button */}
      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={handleBack}
          variant="outline"
          className="flex items-center gap-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white hover:bg-[#D19537]/10"
        >
          <ArrowLeft size={18} />
          Back
        </Button>
      </div>

      {/* 🧩 Basic Information */}
      <BasicInformationSection />

      {/* ⚙️ Account Settings */}
      <AccountSettingsSection />

      {/* ☎️ Contact Details */}
      <ContactDetailsSection />

      {/* 📄 Other Pages Data */}
      <OtherPagesDataSection />

      {/* 🌐 Social Links */}
      <SocialMediaLinksSection />

      {/* 💾 Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleCreateTenant}
          className="bg-[#D19537] hover:bg-[#e59618] text-white font-medium px-6 py-6 rounded-lg transition"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
