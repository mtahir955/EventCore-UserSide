"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import ProfileHeader from "./components/profile/profile-header";
import SectionCard from "./components/profile/section-card";
import BasicInfo from "./components/profile/basic-info";
import ContactDetails from "./components/profile/contact-details";
import PaymentDetails from "./components/profile/payment-details";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";

export default function Page() {
  const [showToast, setShowToast] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);

  // refs to call getValues / getFile from children
  const basicInfoRef = useRef<any>(null);
  const contactDetailsRef = useRef<any>(null);
  const paymentDetailsRef = useRef<any>(null);
  const profileHeaderRef = useRef<any>(null);

  // ⭐ Fetch existing profile data for autofill
  useEffect(() => {
    const token = localStorage.getItem("buyerToken");
    if (!token) return;

    const saved = localStorage.getItem("buyerProfile");
    if (saved) {
      setProfileData(JSON.parse(saved));
    }

    axios
      .get(`${API_BASE_URL}/users/buyer/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-tenant-id": HOST_Tenant_ID,
        },
      })
      .then((res) => {
        setProfileData(res.data.data);

        // ⭐ Save profile in local storage for frontend usage
        localStorage.setItem("buyerProfile", JSON.stringify(res.data.data));
      })
      .catch((err) => {
        console.error("Error fetching buyer profile:", err);
      });
  }, []);

  const handleSave = async () => {
    try {
      const basicInfo = basicInfoRef.current?.getValues();
      const contactDetails = contactDetailsRef.current?.getValues();
      const paymentDetails = paymentDetailsRef.current?.getValues();
      const profileFile = profileHeaderRef.current?.getFile?.();

      const token = localStorage.getItem("buyerToken");
      if (!token) {
        console.error("No buyer token found in localStorage");
        return;
      }

      const payload = {
        basicInfo,
        contactDetails,
        paymentDetails,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));
      if (profileFile) {
        formData.append("profilePhoto", profileFile);
      }

      const response = await axios.put(
        `${API_BASE_URL}/users/buyer/profile`,
        formData,
        {
          headers: {
            "x-tenant-id": HOST_Tenant_ID,
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // ⭐ UPDATE STATE WITH NEW PHOTO URL
      setProfileData(response.data.data);

      // ⭐ Optionally persist to localStorage
      localStorage.setItem("buyerProfile", JSON.stringify(response.data.data));

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error("Error updating buyer profile:", error);
    }
  };

  return (
    <main className="bg-background text-foreground relative">
      <div className="mx-auto w-full max-w-[1425px] min-h-screen bg-background">
        <Header />

        <div className="px-4 sm:px-8 md:px-10">
          {/* Profile photo + title (with existing photo) */}
          <ProfileHeader
            ref={profileHeaderRef}
            existingPhoto={profileData?.profilePhoto}
          />

          <div className="mt-8 sm:mt-12 space-y-8 sm:space-y-10">
            <SectionCard title="Basic Information">
              <BasicInfo ref={basicInfoRef} existing={profileData?.basicInfo} />
            </SectionCard>

            <SectionCard title="Contact Details">
              <ContactDetails
                ref={contactDetailsRef}
                existing={profileData?.contactDetails}
              />
            </SectionCard>

            <SectionCard title="Payment Details">
              <PaymentDetails
                ref={paymentDetailsRef}
                existing={profileData?.paymentDetails}
              />
            </SectionCard>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-4 pt-2 mb-10">
              <Link href="/view-profile">
                <button
                  className={cn(
                    "inline-flex items-center justify-center h-12 rounded-xl px-8",
                    "bg-black hover:bg-gray-700 text-white font-medium w-full sm:w-auto"
                  )}
                  aria-label="Discard Changes"
                >
                  Discard
                </button>
              </Link>

              <button
                onClick={handleSave}
                className={cn(
                  "inline-flex items-center justify-center h-12 rounded-xl px-8",
                  "bg-[#0077F7] hover:bg-blue-600 text-white font-medium w-full sm:w-auto"
                )}
                aria-label="Save Profile"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>

      {/* ✅ Bottom-right Toast */}
      {showToast && (
        <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fadeIn z-[9999]">
          <CheckCircle className="w-5 h-5" />
          <span className="text-sm font-medium">
            Changes saved successfully!
          </span>
        </div>
      )}
    </main>
  );
}

//code before integration

// "use client";

// import { useState } from "react";
// import { cn } from "@/lib/utils";
// import { Header } from "@/components/header";
// import { Footer } from "@/components/footer";
// import ProfileHeader from "./components/profile/profile-header";
// import SectionCard from "./components/profile/section-card";
// import BasicInfo from "./components/profile/basic-info";
// import ContactDetails from "./components/profile/contact-details";
// import PaymentDetails from "./components/profile/payment-details";
// import Link from "next/link";
// import { CheckCircle } from "lucide-react";

// export default function Page() {
//   const [showToast, setShowToast] = useState(false);

//   const handleSave = () => {
//     // ✅ Show confirmation toast
//     setShowToast(true);

//     // Hide after 3 seconds
//     setTimeout(() => setShowToast(false), 3000);
//   };

//   return (
//     <main className="bg-background text-foreground relative">
//       <div className="mx-auto w-full max-w-[1425px] min-h-screen bg-background">
//         <Header />

//         <div className="px-4 sm:px-8 md:px-10">
//           <ProfileHeader />

//           <div className="mt-8 sm:mt-12 space-y-8 sm:space-y-10">
//             <SectionCard title="Basic Information">
//               <BasicInfo />
//             </SectionCard>

//             <SectionCard title="Contact Details">
//               <ContactDetails />
//             </SectionCard>

//             <SectionCard title="Payment Details">
//               <PaymentDetails />
//             </SectionCard>

//             {/* Buttons */}
//             <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-4 pt-2 mb-10">
//               <Link href="/view-profile">
//                 <button
//                   className={cn(
//                     "inline-flex items-center justify-center h-12 rounded-xl px-8",
//                     "bg-black hover:bg-gray-700 text-white font-medium w-full sm:w-auto"
//                   )}
//                   aria-label="Discard Changes"
//                 >
//                   Discard
//                 </button>
//               </Link>

//               <button
//                 onClick={handleSave}
//                 className={cn(
//                   "inline-flex items-center justify-center h-12 rounded-xl px-8",
//                   "bg-[#0077F7] hover:bg-blue-600 text-white font-medium w-full sm:w-auto"
//                 )}
//                 aria-label="Save Profile"
//               >
//                 Save Details
//               </button>
//             </div>
//           </div>
//         </div>

//         <Footer />
//       </div>

//       {/* ✅ Bottom-right Toast */}
//       {showToast && (
//         <div className="fixed bottom-5 right-5 bg-green-600 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fadeIn z-[9999]">
//           <CheckCircle className="w-5 h-5" />
//           <span className="text-sm font-medium">
//             Changes saved successfully!
//           </span>
//         </div>
//       )}
//     </main>
//   );
// }
