"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import ProfileHeader from "./components/profile/profile-header";
import SectionCard from "./components/profile/section-card";
import BasicInfo from "./components/profile/basic-info";
import ContactDetails from "./components/profile/contact-details";
import PaymentDetails from "./components/profile/payment-details";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";

export default function Page() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("buyerToken"); // 🔥 must exist

    axios
      .get(`${API_BASE_URL}/users/buyer/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-tenant-id": HOST_Tenant_ID,
        },
      })
      .then((res) => {
        setProfile(res.data.data);
      })
      .catch((err) => {
        console.log("Profile fetch error:", err);
      });
  }, []);

  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1425px] min-h-[1520px] bg-background">
        <Header />

        <div className="px-4 sm:px-8 md:px-10">
          <ProfileHeader profilePhoto={profile?.profilePhoto} />

          <div className="mt-8 mb-8 sm:mt-12 space-y-8 sm:space-y-10">
            <SectionCard title="Basic Information">
              <BasicInfo data={profile?.basicInfo} />
            </SectionCard>

            <SectionCard title="Contact Details">
              <ContactDetails data={profile?.contactDetails} />
            </SectionCard>

            {/* <SectionCard title="Payment Details">
              <PaymentDetails data={profile?.paymentDetails} />
            </SectionCard> */}
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
}

//code before integration

// "use client";

// import { cn } from "@/lib/utils";
// import { Header } from "@/components/header";
// import { Footer } from "@/components/footer";
// import ProfileHeader from "./components/profile/profile-header";
// import SectionCard from "./components/profile/section-card";
// import BasicInfo from "./components/profile/basic-info";
// import ContactDetails from "./components/profile/contact-details";
// import PaymentDetails from "./components/profile/payment-details";
// import Link from "next/link";

// export default function Page() {
//   return (
//     <main className="bg-background text-foreground">
//       <div className="mx-auto w-full max-w-[1425px] min-h-[2010px] bg-background">
//         <Header />

//         {/* Page content */}
//         <div className="px-4 sm:px-8 md:px-10">
//           <ProfileHeader />

//           <div className="mt-8 mb-8 sm:mt-12 space-y-8 sm:space-y-10">
//             <SectionCard title="Basic Information">
//               <BasicInfo />
//             </SectionCard>

//             <SectionCard title="Contact Details">
//               <ContactDetails />
//             </SectionCard>

//             <SectionCard title="Payment Details">
//               <PaymentDetails />
//             </SectionCard>
//           </div>
//         </div>

//         <Footer />
//       </div>
//     </main>
//   );
// }
