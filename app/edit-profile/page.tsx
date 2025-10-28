// import { cn } from "@/lib/utils";
// import { Header } from "../../components/header";
// import { Footer } from "../../components/footer";
// import ProfileHeader from "../edit-profile/components/profile/profile-header";
// import SectionCard from "../edit-profile/components/profile/section-card";
// import BasicInfo from "../edit-profile/components/profile/basic-info";
// import ContactDetails from "../edit-profile/components/profile/contact-details";
// import PaymentDetails from "../edit-profile/components/profile/payment-details";

// export default function Page() {
//   return (
//     <main className="bg-background text-foreground">
//       {/* Fixed design canvas: 1440 x 2570 */}
//       <div className="mx-auto w-[1425px] min-h-[2070px] bg-background">
//         <Header />

//         {/* Page content */}
//         <div className="px-10">
//           <ProfileHeader />

//           <div className="mt-12 space-y-10">
//             <SectionCard title="Basic Information">
//               <BasicInfo />
//             </SectionCard>

//             <SectionCard title="Contact Details">
//               <ContactDetails />
//             </SectionCard>

//             <SectionCard title="Payment Details">
//               <PaymentDetails />
//             </SectionCard>

//             <div className="flex justify-end gap-4 pt-2 mb-4">
//               <button
//                 className={cn(
//                   "inline-flex items-center justify-center",
//                   "h-12 rounded-xl px-6",
//                   "bg-black hover:bg-gray-600 text-white",
//                   "font-medium"
//                 )}
//                 aria-label="Discard Changes"
//               >
//                 Discard
//               </button>

//               <button
//                 className={cn(
//                   "inline-flex items-center justify-center",
//                   "h-12 rounded-xl px-6",
//                   "bg-[#0077F7] hover:bg-blue-600 text-white",
//                   "font-medium"
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
//     </main>
//   );
// }

"use client";

import { cn } from "@/lib/utils";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import ProfileHeader from "./components/profile/profile-header";
import SectionCard from "./components/profile/section-card";
import BasicInfo from "./components/profile/basic-info";
import ContactDetails from "./components/profile/contact-details";
import PaymentDetails from "./components/profile/payment-details";

export default function Page() {
  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1425px] min-h-screen bg-background">
        <Header />

        <div className="px-4 sm:px-8 md:px-10">
          <ProfileHeader />

          <div className="mt-8 sm:mt-12 space-y-8 sm:space-y-10">
            <SectionCard title="Basic Information">
              <BasicInfo />
            </SectionCard>

            <SectionCard title="Contact Details">
              <ContactDetails />
            </SectionCard>

            <SectionCard title="Payment Details">
              <PaymentDetails />
            </SectionCard>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-4 pt-2 mb-10">
              <button
                className={cn(
                  "inline-flex items-center justify-center h-12 rounded-xl px-8",
                  "bg-black hover:bg-gray-700 text-white font-medium w-full sm:w-auto"
                )}
                aria-label="Discard Changes"
              >
                Discard
              </button>

              <button
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
    </main>
  );
}
