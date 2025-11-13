"use client";

import { useRef } from "react";
import BasicInformationSection from "./sections/basic-information";
import DatabaseConfigurationSection from "./sections/database-configuration";
import AccountSettingsSection from "./sections/account-settings";
import ContactDetailsSection from "./sections/contact-details";
import OtherPagesDataSection from "./sections/other-pages-data";
import SocialMediaLinksSection from "./sections/social-media-links";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

/**
 * ✅ Approach:
 * Each section exposes a ref with a `validate()` method.
 * The `Create Tenant` button runs all validations before success toast.
 */
export default function HostManagementForm() {
  // Refs to child sections
  const basicInfoRef = useRef<{ validate: () => boolean }>(null);
  const dbConfigRef = useRef<{ validate: () => boolean }>(null);
  const accountSettingsRef = useRef<{ validate: () => boolean }>(null);
  const contactDetailsRef = useRef<{ validate: () => boolean }>(null);
  const otherPagesDataSectionRef = useRef<{ validate: () => boolean }>(null);
  const socialMediaLinksRef = useRef<{ validate: () => boolean }>(null);

  const handleCreateTenant = () => {
    // Run validation for each section
    const isBasicInfoValid = basicInfoRef.current?.validate() ?? false;
    const isDBValid = dbConfigRef.current?.validate() ?? false;
    const isAccountValid = accountSettingsRef.current?.validate() ?? false;
    const isContactValid = contactDetailsRef.current?.validate() ?? false;

    // If all valid → success
    if (isBasicInfoValid && isDBValid && isAccountValid && isContactValid) {
      toast.success("Tenant created successfully 🎉", {
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
    } else {
      toast.error(
        "Please fill all required fields before creating the tenant.",
        {
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
        }
      );
    }
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
      {/* Basic Information */}
      <BasicInformationSection ref={basicInfoRef} />

      {/* Database Configuration */}
      <DatabaseConfigurationSection ref={dbConfigRef} />

      {/* Account Settings */}
      <AccountSettingsSection ref={accountSettingsRef} />

      {/* Contact Details */}
      <ContactDetailsSection ref={contactDetailsRef} />

      {/* Other Pages Data */}
      <OtherPagesDataSection ref={otherPagesDataSectionRef} />

       {/* Social Links */}
       <SocialMediaLinksSection ref={socialMediaLinksRef} />

      {/* Create Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleCreateTenant}
          className="bg-[#D19537] hover:bg-[#e59618] text-white font-medium px-6 py-6 rounded-lg transition"
        >
          Create Tenant
        </Button>
      </div>
    </div>
  );
}
