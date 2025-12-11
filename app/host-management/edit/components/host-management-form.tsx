"use client";

import { useRef } from "react";
import BasicInformationSection from "./sections/basic-information";
import ContactDetailsSection from "./sections/contact-details";
import OtherPagesDataSection from "./sections/other-pages-data";
import SocialMediaLinksSection from "./sections/social-media-links";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../../../config/apiConfig";
import { SAAS_Tenant_ID } from "@/config/sasTenantId";

// ==============================
// TYPES
// ==============================
type SectionRef = {
  validate: () => boolean;
  getData: () => any;
};

// ==============================
// UNIVERSAL DEEP TRIM FUNCTION
// Trims all strings in any nested object
// ==============================
const deepTrim = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => deepTrim(item));
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, deepTrim(value)])
    );
  } else if (typeof obj === "string") {
    return obj.trim();
  }
  return obj;
};

export default function HostManagementForm() {
  // REFS
  const basicInfoRef = useRef<SectionRef>(null);
  const dbConfigRef = useRef<SectionRef>(null);
  const accountSettingsRef = useRef<SectionRef>(null);
  const contactDetailsRef = useRef<SectionRef>(null);
  const otherPagesRef = useRef<SectionRef>(null);
  const socialLinksRef = useRef<SectionRef>(null);

  // ==============================
  // CREATE TENANT HANDLER
  // ==============================
  const handleUpdateTenant = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

    if (!token) {
      toast.error("Session expired. Please login again.");
      return;
    }

    // VALIDATION
    const valid =
      basicInfoRef.current?.validate() &&
      contactDetailsRef.current?.validate() &&
      otherPagesRef.current?.validate() &&
      socialLinksRef.current?.validate();

    if (!valid) {
      toast.error(
        "Please fill all required fields before updating the tenant."
      );
      return;
    }

    // GET DATA
    const basic = basicInfoRef.current!.getData();
    const contact = contactDetailsRef.current!.getData();
    const other = otherPagesRef.current!.getData();
    const social = socialLinksRef.current!.getData();

    // BUILD UPDATE PAYLOAD
    const payload = {
      logoUrl: basic.logo,
      bannerUrl: basic.banner,

      // FEATURES
      passServiceFee: basic.passServiceFee,
      absorbFee: basic.absorbFee,
      allowTransfers: basic.allowTransfers,
      manualCreditAdjust: basic.manualCreditAdjust,
      paymentPlans: basic.paymentPlans,
      showLoginHelp: basic.showLoginHelp,
      creditExpiration: basic.creditExpiration,

      // OPTIONAL (only if you still want them editable)
      contactPhone: contact.phoneNumber,
      phoneCountryCode: contact.countryCode,
      city: contact.city,
      postalCode: contact.pincode,
      address: contact.address,
      nationalIdNumber: contact.nationalId,

      aboutPage: {
        title: other.formData.aboutTitle,
        subtitle: other.formData.aboutSubtitle,
        mainHeadline: other.formData.mainHeadline,
        description: other.formData.description,
      },

      privacyPolicies: other.privacyPolicies,
      termsAndConditions: other.termsAndConditions,
      faqs: other.faqs,

      socialFacebook: social.facebook,
      socialInstagram: social.instagram,
      socialTwitter: social.twitter,
      socialYoutube: social.youtube,
    };

    const trimmedPayload = deepTrim(payload);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/tenants/${tenantId}`, {
        method: "PUT",
        headers: {
          "x-tenant-id": SAAS_Tenant_ID,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trimmedPayload),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Tenant updated successfully 🎉");
      } else {
        toast.error(result.message || "Failed to update tenant.");
      }
    } catch (err) {
      console.error("FETCH ERROR:", err);
      toast.error("API request failed. Check server.");
    }
  };

  // ==============================
  // RENDER UI
  // ==============================
  return (
    <div className="w-[329px] dark:bg-[#101010] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mx-auto space-y-6 sm:w-[95%] lg:w-[1175px] sm:ml-0 lg:ml-[250px]">
      <BasicInformationSection ref={basicInfoRef} />
      <ContactDetailsSection ref={contactDetailsRef} />
      <OtherPagesDataSection ref={otherPagesRef} />
      <SocialMediaLinksSection ref={socialLinksRef} />

      <div className="flex justify-end">
        <Button
          onClick={handleUpdateTenant}
          className="bg-[#D19537] hover:bg-[#e59618] text-white font-medium px-6 py-6 rounded-lg transition"
        >
          Update Tenant
        </Button>
      </div>
    </div>
  );
}
