"use client";

import { useRef, useEffect, useState } from "react";
import BasicInformationSection from "./sections/basic-information";
import ContactDetailsSection from "./sections/contact-details";
import OtherPagesDataSection from "./sections/other-pages-data";
import SocialMediaLinksSection from "./sections/social-media-links";
import EventcorePercentageSection from "./sections/eventcore-percentage";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../../../config/apiConfig";
import { SAAS_Tenant_ID } from "@/config/sasTenantId";
import { useRouter, useSearchParams } from "next/navigation";

/* =====================================================
   TYPES
===================================================== */
type SectionRef = {
  validate: () => boolean;
  getData: () => any;
  setData?: (data: any) => void;
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
  const searchParams = useSearchParams();
  const tenantId = searchParams.get("tenantId");

  const [loading, setLoading] = useState(true);

  /* =====================================================
     GET TENANT DATA (EDIT MODE)
  ===================================================== */
  useEffect(() => {
    if (!tenantId) {
      toast.error("Tenant ID missing");
      return;
    }

    const fetchTenant = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) return toast.error("Session expired");

      try {
        const res = await fetch(`${API_BASE_URL}/admin/tenants/${tenantId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-tenant-id": SAAS_Tenant_ID,
          },
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.message);

        const data = result.data;

        // 🔥 HYDRATE ALL SECTIONS
        basicInfoRef.current?.setData?.(data);
        contactDetailsRef.current?.setData?.(data);
        otherPagesRef.current?.setData?.(data);
        socialLinksRef.current?.setData?.(data);

        if (data.eventcorePercentage !== undefined) {
          eventcorePercentageRef.current?.setData?.({
            eventcorePercentage: data.eventcorePercentage,
          });
        }
      } catch (err: any) {
        toast.error(err.message || "Failed to load tenant");
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, [tenantId]);

  /* =====================================================
     UPDATE TENANT HANDLER (PUT)
  ===================================================== */
  const handleUpdateTenant = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) return toast.error("Session expired");

    const valid =
      basicInfoRef.current?.validate() &&
      contactDetailsRef.current?.validate() &&
      otherPagesRef.current?.validate() &&
      socialLinksRef.current?.validate() &&
      eventcorePercentageRef.current?.validate();

    if (!valid) {
      toast.error("Fix validation errors first");
      return;
    }

    const basic = basicInfoRef.current!.getData();
    const contact = contactDetailsRef.current!.getData();
    const other = otherPagesRef.current!.getData();
    const social = socialLinksRef.current!.getData();
    const eventcore = eventcorePercentageRef.current!.getData();

    const payload = deepTrim({
      logoUrl: basic.logo,
      bannerUrl: basic.banner,

      eventcorePercentage: eventcore.eventcorePercentage,

      features: {
        serviceFee: {
          enabled: basic.serviceFee,
          type: basic.serviceFeeType,
          value: Number(basic.serviceFeeValue),
          defaultHandling: basic.defaultFeeHandling,
        },

        allowTransfers: {
          enabled: basic.allowTransfers,
          maxMonths: basic.allowTransfers
            ? Number(basic.transferExpiryMonths)
            : null,
        },

        // ✅ CREDIT SYSTEM (ONLY TOGGLE)
        creditSystem: {
          enabled: basic.creditAdjust ?? false,
        },

        // ✅ PAYMENT PLANS (WITH MAX INSTALLMENTS)
        paymentPlans: {
          enabled: basic.paymentPlans ?? false,
          maxInstallments: {
            enabled: basic.maxInstallmentsEnabled ?? false,
            value: basic.maxInstallmentsEnabled
              ? Number(basic.maxInstallments)
              : null,
          },
        },

        showLoginHelp: basic.showLoginHelp,
      },

      contact: {
        phone: contact.phoneNumber,
        countryCode: contact.countryCode,
        city: contact.city,
        postalCode: contact.pincode,
        address: contact.address,
        nationalIdNumber: contact.nationalId || null,
      },

      aboutPage: {
        title: other.formData.aboutTitle,
        subtitle: other.formData.aboutSubtitle,
        mainHeadline: other.formData.mainHeadline,
        description: other.formData.description,
      },

      privacyPolicies: other.privacyPolicies,
      faqs: other.faqs,
      termsAndConditions: other.termsAndConditions,

      socialLinks: social,
    });

    try {
      const res = await fetch(`${API_BASE_URL}/admin/tenants/${tenantId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "x-tenant-id": SAAS_Tenant_ID,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      toast.success("Tenant updated successfully 🎉");
      router.back();
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    }
  };

  /* =====================================================
     UI
  ===================================================== */
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading tenant data...
      </div>
    );
  }

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
