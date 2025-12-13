"use client";

import { useRef } from "react";
import BasicInformationSection from "./sections/basic-information";
import ContactDetailsSection from "./sections/contact-details";
import OtherPagesDataSection from "./sections/other-pages-data";
import SocialMediaLinksSection from "./sections/social-media-links";
import EventcorePercentageSection from "./sections/eventcore-percentage";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../../../config/apiConfig";
import { SAAS_Tenant_ID } from "@/config/sasTenantId";
import { useRouter, useParams } from "next/navigation";

/* =====================================================
   TYPES
===================================================== */
type SectionRef = {
  validate: () => boolean;
  getData: () => any;
};

/* =====================================================
   UNIVERSAL DEEP TRIM
===================================================== */
const deepTrim = (obj: any): any => {
  if (Array.isArray(obj)) return obj.map(deepTrim);
  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, deepTrim(v)])
    );
  }
  if (typeof obj === "string") return obj.trim();
  return obj;
};

export default function HostManagementForm() {
  /* =====================================================
     REFS
  ===================================================== */
  const basicInfoRef = useRef<SectionRef>(null);
  const contactDetailsRef = useRef<SectionRef>(null);
  const otherPagesRef = useRef<SectionRef>(null);
  const socialLinksRef = useRef<SectionRef>(null);
  const eventcorePercentageRef = useRef<SectionRef>(null);

  const router = useRouter();
  const params = useParams();
  const tenantId = params?.tenantId as string;

  /* =====================================================
     UPDATE TENANT HANDLER
  ===================================================== */
  const handleUpdateTenant = async () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      toast.error("Session expired. Please login again.");
      return;
    }

    const valid =
      basicInfoRef.current?.validate() &&
      contactDetailsRef.current?.validate() &&
      otherPagesRef.current?.validate() &&
      socialLinksRef.current?.validate() &&
      eventcorePercentageRef.current?.validate();

    if (!valid) {
      toast.error("Please fix validation errors before updating.");
      return;
    }

    /* =====================================================
       COLLECT DATA
    ===================================================== */
    const basic = basicInfoRef.current!.getData();
    const contact = contactDetailsRef.current!.getData();
    const other = otherPagesRef.current!.getData();
    const social = socialLinksRef.current!.getData();
    const eventcore = eventcorePercentageRef.current!.getData();

    /* =====================================================
       FINAL UPDATE PAYLOAD (FULLY ALIGNED)
    ===================================================== */
    const payload = {
      /* ---------------- BASIC MEDIA ---------------- */
      logoUrl: basic.logoUrl,
      bannerUrl: basic.bannerUrl,

      /* ---------------- FEATURES ---------------- */
      features: {
        serviceFee: {
          enabled: basic.features.serviceFee.enabled,
          type: basic.features.serviceFee.type,
          value: basic.features.serviceFee.value,
          defaultHandling: {
            passToBuyer: basic.features.serviceFee.defaultHandling.passToBuyer,
            absorbByTenant:
              basic.features.serviceFee.defaultHandling.absorbByTenant,
          },
        },

        allowTransfers: basic.features.allowTransfers,

        creditSystem: {
          enabled: basic.features.creditSystem.enabled,
          minOrderEligibility: {
            enabled: basic.features.creditSystem.minOrderEligibility.enabled,
            value: basic.features.creditSystem.minOrderEligibility.value,
          },
          maxInstallments: {
            enabled: basic.features.creditSystem.maxInstallments.enabled,
            value: basic.features.creditSystem.maxInstallments.value,
          },
        },

        paymentPlans: {
          enabled: basic.features.paymentPlans.enabled,
          creditExpiry: {
            enabled: basic.features.paymentPlans.creditExpiry.enabled,
            duration: basic.features.paymentPlans.creditExpiry.duration,
            unit: basic.features.paymentPlans.creditExpiry.unit,
          },
        },

        showLoginHelp: basic.features.showLoginHelp,
      },

      /* ---------------- EVENTCORE ---------------- */
      eventcorePercentage: eventcore.eventcorePercentage,

      /* ---------------- CONTACT ---------------- */
      contact: {
        phone: contact.phoneNumber,
        countryCode: contact.countryCode,
        city: contact.city,
        postalCode: contact.pincode,
        address: contact.address,
        nationalIdNumber: contact.nationalId || null,
      },

      /* ---------------- ABOUT PAGE ---------------- */
      aboutPage: {
        title: other.formData.aboutTitle,
        subtitle: other.formData.aboutSubtitle,
        mainHeadline: other.formData.mainHeadline,
        description: other.formData.description,
      },

      /* ---------------- POLICIES ---------------- */
      privacyPolicies: other.privacyPolicies,
      termsAndConditions: other.termsAndConditions,
      faqs: other.faqs,

      /* ---------------- SOCIAL LINKS ---------------- */
      socialLinks: {
        facebook: social.facebook || null,
        instagram: social.instagram || null,
        twitter: social.twitter || null,
        youtube: social.youtube || null,
      },
    };

    const trimmedPayload = deepTrim(payload);

    /* =====================================================
       API CALL
    ===================================================== */
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
        router.back();
      } else {
        toast.error(result.message || "Failed to update tenant.");
      }
    } catch (err) {
      console.error("UPDATE ERROR:", err);
      toast.error("API request failed. Check server.");
    }
  };

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div className="w-[329px] px-4 sm:px-6 lg:px-8 py-6 mx-auto space-y-6 sm:w-[95%] lg:w-[1175px] lg:ml-[250px]">
      <BasicInformationSection ref={basicInfoRef} />
      <ContactDetailsSection ref={contactDetailsRef} />
      <EventcorePercentageSection ref={eventcorePercentageRef} />
      <OtherPagesDataSection ref={otherPagesRef} />
      <SocialMediaLinksSection ref={socialLinksRef} />

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={() => router.back()}>
          ← Back
        </Button>

        <Button
          onClick={handleUpdateTenant}
          className="bg-[#D19537] hover:bg-[#e59618] text-white px-6 py-6"
        >
          Update Tenant
        </Button>
      </div>
    </div>
  );
}
