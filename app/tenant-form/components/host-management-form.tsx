"use client";

import { useRef } from "react";
import BasicInformationSection from "./sections/basic-information";
import DatabaseConfigurationSection from "./sections/database-configuration";
import AccountSettingsSection from "./sections/account-settings";
import ContactDetailsSection from "./sections/contact-details";
import OtherPagesDataSection from "./sections/other-pages-data";
import SocialMediaLinksSection from "./sections/social-media-links";
import EventcorePercentageSection from "./sections/eventcore-percentage";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../../../config/apiConfig";
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
  const eventcorePercentageRef = useRef<SectionRef>(null);

  // ==============================
  // CREATE TENANT HANDLER
  // ==============================
  const handleCreateTenant = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

    if (!token) {
      toast.error("Session expired. Please login again.");
      return;
    }

    // VALIDATION
    const valid =
      basicInfoRef.current?.validate() &&
      dbConfigRef.current?.validate() &&
      accountSettingsRef.current?.validate() &&
      contactDetailsRef.current?.validate() &&
      eventcorePercentageRef.current?.validate() &&
      otherPagesRef.current?.validate() &&
      socialLinksRef.current?.validate();
    if (!valid) {
      toast.error(
        "Please fill all required fields before creating the tenant."
      );
      return;
    }

    // GET SECTION DATA
    const basic = basicInfoRef.current!.getData();
    const db = dbConfigRef.current!.getData();
    const account = accountSettingsRef.current!.getData();
    const contact = contactDetailsRef.current!.getData();
    const other = otherPagesRef.current!.getData();
    const social = socialLinksRef.current!.getData();
    const eventcore = eventcorePercentageRef.current!.getData();

    // ==============================
    // SERVICE FEE VALIDATION (IMPORTANT)
    // ==============================
    if (
      basic.serviceFee &&
      (basic.serviceFeeType == null ||
        basic.serviceFeeValue == null ||
        Number(basic.serviceFeeValue) <= 0)
    ) {
      toast.error("Please enter a valid service fee value");
      return;
    }
    // ==============================
    // BUILD RAW PAYLOAD
    // ==============================
    const payload = {
      name: basic.tenantName,
      email: basic.email,
      subDomain: basic.subdomain,
      logoUrl: basic.logo,
      bannerUrl: basic.banner,

      // GENDER (Uppercase for backend)
      gender: basic.gender?.toUpperCase() || "NOT_SPECIFIED",

      // Database
      dbName: db.dbName,
      dbUsername: db.dbUsername,
      dbPassword: db.dbPassword,
      dbSmtp: db.dbSmtp,

      // Account Settings
      status: account.accountStatus?.toUpperCase() || "ACTIVE",
      theme: account.themeStatus?.toLowerCase() || "light",

      // ==============================
      // FEATURES & PAYMENT RULES
      // ==============================

      // Service Fee
      serviceFee: basic.serviceFee
        ? {
            enabled: true,
            type: basic.serviceFeeType,
            value: Number(basic.serviceFeeValue), // ✅ force number
            defaultHandling: {
              passToBuyer: basic.defaultFeeHandling?.passToBuyer ?? false,
              absorbByTenant: basic.defaultFeeHandling?.absorbByTenant ?? false,
            },
          }
        : {
            enabled: false,
          },

      // Ticket Transfers
      allowTransfers: {
        enabled: basic.allowTransfers ?? false,
        maxMonths: basic.allowTransfers
          ? Number(basic.transferExpiryMonths ?? null)
          : null,
      },

      // Credit System (ONLY enable / disable)
      creditSystem: {
        enabled: basic.creditAdjust ?? false,
      },

      // Payment Plans (WITH max installments)
      paymentPlans: {
        enabled: basic.paymentPlans ?? false,

        maxInstallments: {
          enabled: basic.maxInstallmentsEnabled ?? false,
          value: basic.maxInstallmentsEnabled
            ? String(basic.maxInstallments)
            : null,
        },
      },

      // UI Helpers
      showLoginHelp: basic.showLoginHelp,

      // EventCore Percentage (applies to each event)
      eventcorePercentage: eventcore.eventcorePercentage,

      // Contact
      contactPhone: contact.phoneNumber,
      phoneCountryCode: contact.countryCode,
      city: contact.city,
      postalCode: contact.pincode,
      address: contact.address,
      nationalIdNumber: contact.nationalId,

      // About Page
      aboutPage: {
        title: other.formData?.aboutTitle || "",
        subtitle: other.formData?.aboutSubtitle || "",
        mainHeadline: other.formData?.mainHeadline || "",
        description: other.formData?.description || "",
      },

      privacyPolicies: other.privacyPolicies,
      faqs: other.faqs,
      termsAndConditions: other.termsAndConditions,

      // Social Links
      socialFacebook: social.facebook,
      socialInstagram: social.instagram,
      socialTwitter: social.twitter,
      socialYoutube: social.youtube,
    };

    // ==============================
    // TRIM PAYLOAD BEFORE SENDING
    // ==============================
    const trimmedPayload = deepTrim(payload);

    console.log("FINAL TRIMMED PAYLOAD:", trimmedPayload);

    // ==============================
    // SEND API REQUEST
    // ==============================
    try {
      const res = await fetch(`${API_BASE_URL}/admin/tenants`, {
        method: "POST",
        headers: {
          "x-tenant-id": SAAS_Tenant_ID,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trimmedPayload),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Tenant created successfully 🎉");
      } else {
        toast.error(result.message || "Failed to create tenant.");
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
    <div className="w-[329px] dark:bg-[#101010] sm:mt-14 lg:mt-0 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mx-auto space-y-6 sm:w-[95%] lg:w-[1175px] sm:ml-0 lg:ml-[250px]">
      <BasicInformationSection ref={basicInfoRef} />
      <DatabaseConfigurationSection ref={dbConfigRef} />
      <AccountSettingsSection ref={accountSettingsRef} />
      <ContactDetailsSection ref={contactDetailsRef} />
      <EventcorePercentageSection ref={eventcorePercentageRef} />
      <OtherPagesDataSection ref={otherPagesRef} />
      <SocialMediaLinksSection ref={socialLinksRef} />

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

// "use client";

// import { useRef } from "react";
// import BasicInformationSection from "./sections/basic-information";
// import DatabaseConfigurationSection from "./sections/database-configuration";
// import AccountSettingsSection from "./sections/account-settings";
// import ContactDetailsSection from "./sections/contact-details";
// import OtherPagesDataSection from "./sections/other-pages-data";
// import SocialMediaLinksSection from "./sections/social-media-links";
// import { Button } from "@/components/ui/button";
// import toast from "react-hot-toast";

// // ✅ TYPE FOR ALL SECTION REFS
// type SectionRef = {
//   validate: () => boolean;
//   getData: () => any;
// };

// export default function HostManagementForm() {
//   // ✅ TYPED REFS (NO MORE TS ERRORS)
//   const basicInfoRef = useRef<SectionRef>(null);
//   const dbConfigRef = useRef<SectionRef>(null);
//   const accountSettingsRef = useRef<SectionRef>(null);
//   const contactDetailsRef = useRef<SectionRef>(null);
//   const otherPagesRef = useRef<SectionRef>(null);
//   const socialLinksRef = useRef<SectionRef>(null);
//   const token = localStorage.getItem("adminToken");

//   const handleCreateTenant = async () => {
//     // Safe way to read token
//     const token =
//       typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

//     if (!token) {
//       toast.error("Session expired. Please login again.");
//       return;
//     }

//     // VALIDATE SECTIONS
//     const valid =
//       basicInfoRef.current?.validate() &&
//       dbConfigRef.current?.validate() &&
//       accountSettingsRef.current?.validate() &&
//       contactDetailsRef.current?.validate() &&
//       otherPagesRef.current?.validate() &&
//       socialLinksRef.current?.validate();

//     if (!valid) {
//       toast.error(
//         "Please fill all required fields before creating the tenant."
//       );
//       return;
//     }

//     // 2️⃣ GET DATA FROM ALL SECTIONS
//     const basic = basicInfoRef.current!.getData();
//     const db = dbConfigRef.current!.getData();
//     const account = accountSettingsRef.current!.getData();
//     const contact = contactDetailsRef.current!.getData();
//     const other = otherPagesRef.current!.getData();
//     const social = socialLinksRef.current!.getData();

//     // 3️⃣ BUILD FINAL PAYLOAD ACCORDING TO GIVEN JSON STRUCTURE
//     const payload = {
//       name: basic.tenantName,
//       email: basic.email,
//       subDomain: basic.subdomain,
//       logoUrl: basic.logo,
//       bannerUrl: basic.banner,
//       // GENDER — NOW ADDED ✔
//       gender: basic.gender?.toUpperCase() || "NOT_SPECIFIED",

//       // Database
//       dbName: db.dbName,
//       dbUsername: db.dbUsername,
//       dbPassword: db.dbPassword,
//       dbSmtp: db.dbSmtp,

//       // Account Settings
//       status: account.accountStatus?.toUpperCase() || "ACTIVE",
//       theme: account.themeStatus?.toLowerCase() || "light",

//       // Contact
//       contactPhone: contact.phoneNumber,
//       phoneCountryCode: contact.countryCode,
//       city: contact.city,
//       postalCode: contact.pincode,
//       address: contact.address,
//       nationalIdNumber: contact.nationalId,

//       // About Page Data
//       aboutPage: {
//         title: other.formData?.aboutTitle || "",
//         subtitle: other.formData?.aboutSubtitle || "",
//         mainHeadline: other.formData?.mainHeadline || "",
//         description: other.formData?.description || "",
//       },

//       privacyPolicies: other.privacyPolicies,
//       faqs: other.faqs,
//       termsAndConditions: other.formData?.termsAndConditions || "",

//       // Social Links
//       socialFacebook: social.facebook,
//       socialInstagram: social.instagram,
//       socialTwitter: social.twitter,
//       socialYoutube: social.youtube,
//     };

//     console.log("FINAL PAYLOAD:", payload);

//     // 4️⃣ SEND API REQUEST
//     try {
//       const res = await fetch("http://192.168.18.185:8080/admin/tenants", {
//         method: "POST",
//         headers: {
//           "x-tenant-id": "fc36df79-3157-44fb-9c5a-fbc938f2fda7",
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(payload),
//       });

//       const result = await res.json();

//       if (res.ok) {
//         toast.success("Tenant created successfully 🎉");
//       } else {
//         toast.error(result.message || "Failed to create tenant.");
//       }
//     } catch (err) {
//       console.error("FETCH ERROR:", err);
//       toast.error("API request failed. Check server.");
//     }
//   };

//   return (
//     <div className="w-[329px] px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mx-auto space-y-6 sm:w-[95%] lg:w-[1170px] sm:ml-0 lg:ml-[250px]">
//       <BasicInformationSection ref={basicInfoRef} />
//       <DatabaseConfigurationSection ref={dbConfigRef} />
//       <AccountSettingsSection ref={accountSettingsRef} />
//       <ContactDetailsSection ref={contactDetailsRef} />
//       <OtherPagesDataSection ref={otherPagesRef} />
//       <SocialMediaLinksSection ref={socialLinksRef} />

//       <div className="flex justify-end">
//         <Button
//           onClick={handleCreateTenant}
//           className="bg-[#D19537] hover:bg-[#e59618] text-white font-medium px-6 py-6 rounded-lg transition"
//         >
//           Create Tenant
//         </Button>
//       </div>
//     </div>
//   );
// }
