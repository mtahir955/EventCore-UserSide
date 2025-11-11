"use client";
import BasicInformationSection from "./sections/basic-information";
import AccountSettingsSection from "./sections/account-settings";
import ContactDetailsSection from "./sections/contact-details";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HostManagementForm() {
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
      {/* Save Button */}
      <div className="flex justify-end">
        <Link href="/host-settings/edit">
        <Button className="bg-[#D19537] hover:bg-[#e59618] text-white font-medium px-6 py-6 rounded-lg transition">
          Edit
        </Button>
        </Link>
      </div>
      {/* Basic Information */}
      <BasicInformationSection />
      
      {/* Account Settings */}
      <AccountSettingsSection />

      {/* Contact Details */}
      <ContactDetailsSection />
    </div>
  );
}
