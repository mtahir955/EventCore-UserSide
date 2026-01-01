"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BasicInformationSection from "./sections/basic-information";
import AccountSettingsSection from "./sections/account-settings";
import ContactDetailsSection from "./sections/contact-details";
import OtherPagesDataSection from "./sections/other-pages-data";
import SocialMediaLinksSection from "./sections/social-media-links";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";
import HostDashboardHelpModal from "../../help/HostDashboardHelpModal";

export default function HostManagementForm() {
  const [hostData, setHostData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const fetchHostData = async () => {
      try {
        let rawToken = localStorage.getItem("hostToken");
        if (!rawToken) {
          window.location.href = "/sign-in-host";
          return;
        }

        let token = rawToken;
        try {
          const parsed = JSON.parse(rawToken);
          if (parsed?.token) token = parsed.token;
        } catch {}

        const res = await axios.get(`${API_BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-tenant-id": HOST_Tenant_ID,
            "Content-Type": "application/json",
          },
        });

        setHostData(res.data.data || res.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem("hostToken");
          window.location.href = "/sign-in-host";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHostData();
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  return (
    <>
      {/* Help Modal */}
      <HostDashboardHelpModal
        open={showHelp}
        onClose={() => setShowHelp(false)}
      />

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
        {/* Header Buttons */}
        <div className="flex justify-between items-center w-full">
          {/* Help Button (Left) */}
          <Button
            onClick={() => setShowHelp(true)}
            variant="outline"
            className="border-[#D19537] text-[#D19537] hover:bg-[#D19537] hover:text-white px-6 py-4 rounded-lg"
          >
            Help
          </Button>

          {/* Edit Button (Right) */}
          <Link href="/host-settings/edit">
            <Button className="bg-[#D19537] hover:bg-[#e59618] text-white font-medium px-6 py-4 rounded-lg">
              Edit
            </Button>
          </Link>
        </div>

        {/* Mobile Edit Button */}
        <div className="flex justify-end w-full sm:hidden mt-2">
          <Link href="/host-settings/edit">
            <Button className="bg-[#D19537] hover:bg-[#e59618] text-white font-medium px-5 py-3 rounded-lg text-sm">
              Edit
            </Button>
          </Link>
        </div>

        {/* Sections */}
        <BasicInformationSection host={hostData} />
        <AccountSettingsSection host={hostData} />
        <ContactDetailsSection host={hostData} />
        <OtherPagesDataSection tenant={hostData.tenant} />
        <SocialMediaLinksSection tenant={hostData.tenant} />
      </div>
    </>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import BasicInformationSection from "./sections/basic-information";
// import AccountSettingsSection from "./sections/account-settings";
// import ContactDetailsSection from "./sections/contact-details";
// import OtherPagesDataSection from "./sections/other-pages-data";
// import SocialMediaLinksSection from "./sections/social-media-links";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";

// export default function HostManagementForm() {
//   // 🔵 HOST DATA from API
//   const [hostData, setHostData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);

//   // 🔥 FETCH HOST PROFILE
//   useEffect(() => {
//     const fetchHostData = async () => {
//       try {
//         let rawToken = localStorage.getItem("hostToken");

//         if (!rawToken) {
//           console.log("❌ No host token found");
//           window.location.href = "/sign-in-host";
//           return;
//         }

//         // Clean token if stored as JSON or plain text
//         let token = rawToken;
//         try {
//           const parsed = JSON.parse(rawToken);
//           if (parsed?.token) token = parsed.token;
//         } catch {}

//         console.log("🔥 Sending Token:", token);

//         const res = await axios.get(`${API_BASE_URL}/users/me`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "x-tenant-id": HOST_Tenant_ID,
//             "Content-Type": "application/json",
//           },
//         });

//         console.log("🔥 HOST DATA:", res.data);
//         setHostData(res.data.data || res.data);
//       } catch (err: any) {
//         console.error("❌ Error fetching host data:", err.response);
//         if (err.response?.status === 401) {
//           console.log("❌ Token expired or invalid. Redirecting...");
//           localStorage.removeItem("hostToken");
//           window.location.href = "/sign-in-host";
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHostData();
//   }, []);

//   if (loading) {
//     return <p className="text-center mt-10 text-gray-500">Loading...</p>;
//   }

//   return (
//     <div
//       className="
//         w-[329px]
//         px-4 sm:px-6 lg:px-8
//         py-6 sm:py-8
//         mx-auto
//         space-y-6
//         sm:w-[95%] lg:w-[1170px]
//         sm:ml-0 lg:ml-[250px]
//       "
//     >
//       {/* Save Button */}
//       <div className="flex justify-end w-full flex-shrink-0">
//         <Link href="/host-settings/edit">
//           <Button className="bg-[#D19537] sm:mt-10 lg:mt-0 hover:bg-[#e59618] text-white font-medium px-6 py-4 rounded-lg transition">
//             Edit
//           </Button>
//         </Link>
//       </div>
//       <div className="flex justify-end w-full sm:hidden mt-2">
//         <Link href="/host-settings/edit">
//           <Button className="bg-[#D19537] hover:bg-[#e59618] text-white font-medium px-5 py-3 rounded-lg text-sm transition">
//             Edit
//           </Button>
//         </Link>
//       </div>

//       {/* Pass DATA into each section */}
//       <BasicInformationSection host={hostData} />
//       <AccountSettingsSection host={hostData} />
//       <ContactDetailsSection host={hostData} />

//       {/* <OtherPagesDataSection /> */}
//       {/* <SocialMediaLinksSection /> */}
//       <OtherPagesDataSection tenant={hostData.tenant} />
//       <SocialMediaLinksSection tenant={hostData.tenant} />
//     </div>
//   );
// }
