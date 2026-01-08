"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { TableOfContents } from "./components/table-of-contents";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";

export default function PrivacyPolicyPage() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ⭐ Fetch privacy policies
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/tenants/public/about`, {
        headers: { "X-Tenant-ID": HOST_Tenant_ID },
      })
      .then((res) => {
        setPolicies(res.data.data?.privacyPolicies || []);
      })
      .catch((err) => console.error("❌ Privacy Policy Error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#101010] transition-colors duration-300">
      <Header />

      <main className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 lg:px-24 py-10 sm:py-14 md:py-16 text-black dark:text-gray-100">
        {/* Page Title */}
        <div className="mb-10 sm:mb-12 text-left">
          <h1 className="text-3xl sm:text-4xl md:text-[40px] font-bold leading-tight mb-3 sm:mb-4">
            <span className="text-[#89FC00] font-passionate font-serif">Privacy</span>{" "}
            <span className="text-black dark:text-white">Policy</span>
          </h1>

          <p className="text-sm sm:text-base font-semibold text-black dark:text-gray-400">
            Effective date: August 31, 2025
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 md:gap-12">
          {/* Table of Contents (NOW DYNAMIC) */}
          <aside>
            <TableOfContents policies={policies} />
          </aside>

          {/* Main Content */}
          <div className="space-y-12">
            {!loading && policies.length > 0
              ? policies.map((item, index) => (
                  <section
                    key={index}
                    id={`policy-${index}`}
                    className="scroll-mt-24"
                  >
                    <h2 className="text-xl sm:text-[28px] font-bold text-black dark:text-white mb-4 sm:mb-6">
                      {item.title}
                    </h2>

                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                  </section>
                ))
              : !loading && (
                  <p className="text-gray-500 dark:text-gray-400">
                    No privacy policies available.
                  </p>
                )}
          </div>

          {/* CTA */}
          <section className="pt-8 sm:pt-12">
            <h2 className="text-2xl sm:text-[30px] font-bold text-black dark:text-white mb-3 sm:mb-4">
              Get Started Now
            </h2>
            <p className="text-sm sm:text-[14px] text-gray-700 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
              Reach out to us today and take the first step toward your goals.
            </p>
            <Link href="/contact-us">
              <Button className="bg-[#0077F7] hover:bg-[#0066DD] text-white px-6 py-3 text-[15px] sm:text-[16px] font-semibold rounded-full h-auto">
                Get Started
              </Button>
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// //code before integration

// "use client";

// import { Header } from "@/components/header";
// import { Footer } from "@/components/footer";
// import { Button } from "@/components/ui/button";
// import { TableOfContents } from "./components/table-of-contents";
// import Link from "next/link";

// export default function PrivacyPolicyPage() {
//   return (
//     <div className="min-h-screen bg-white dark:bg-[#101010] transition-colors duration-300">
//       <Header />

//       <main className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 lg:px-24 py-10 sm:py-14 md:py-16 text-black dark:text-gray-100">
//         {/* Page Title */}
//         <div className="mb-10 sm:mb-12 text-left">
//           <h1 className="text-3xl sm:text-4xl md:text-[40px] font-bold leading-tight mb-3 sm:mb-4">
//             <span className="text-[#89FC00] italic font-serif">Privacy</span>{" "}
//             <span className="text-black dark:text-white">Policy</span>
//           </h1>
//           <p className="text-sm sm:text-base font-semibold text-black dark:text-gray-400">
//             Effective date: August 31, 2025
//           </p>
//         </div>

//         {/* Layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 md:gap-12">
//           {/* Table of Contents */}
//           <aside>
//             <TableOfContents />
//           </aside>

//           {/* Main Content */}
//           <div className="space-y-12">
//             {/* Section 1 */}
//             <section id="information-we-collect">
//               <h2 className="text-xl sm:text-[28px] font-bold text-black dark:text-white mb-4 sm:mb-6">
//                 Information We Collect
//               </h2>
//               <p className="text-sm sm:text-base text-gray-700 dark:text-gray-400 leading-relaxed">
//                 Eget quis mi enim, leo lacinia pharetra, semper. Eget in
//                 volutpat mollis at volutpat lectus velit, sed auctor. Porttitor
//                 fames arcu quis fusce augue enim. Quis at habitant diam at.
//                 Suscipit tristique risus, at donec. In turpis vel et quam
//                 imperdiet. Ipsum molestie aliquet sodales id est ac volutpat.
//               </p>
//             </section>

//             {/* Section 2 */}
//             <section id="how-event-core-uses">
//               <h2 className="text-xl sm:text-[28px] font-bold text-black dark:text-white mb-4 sm:mb-6">
//                 How Event Core Uses Your Information
//               </h2>
//               <p className="text-sm sm:text-base text-gray-700 dark:text-gray-400 leading-relaxed">
//                 Eget quis mi enim, leo lacinia pharetra, semper. Eget in
//                 volutpat mollis at volutpat lectus velit, sed auctor. Porttitor
//                 fames arcu quis fusce augue enim. Quis at habitant diam at.
//                 Suscipit tristique risus, at donec. In turpis vel et quam
//                 imperdiet. Ipsum molestie aliquet sodales id est ac volutpat.
//               </p>
//             </section>

//             {/* Section 3 */}
//             <section id="sharing-your-information">
//               <h2 className="text-xl sm:text-[28px] font-bold text-black dark:text-white mb-4 sm:mb-6">
//                 Sharing Your Information
//               </h2>
//               <p className="text-sm sm:text-base text-gray-700 dark:text-gray-400 leading-relaxed">
//                 Morbi sed imperdiet in ipsum, adipiscing elit dui lectus. Tellus
//                 id scelerisque est ultricies ultricies. Duis est sit sed leo
//                 nisl, blandit elit sagittis. Quisque tristique consequat quam
//                 sed. Nisl at scelerisque amet nulla purus habitasse.
//               </p>
//             </section>

//             {/* Section 4 */}
//             <section id="cookies-and-tracking">
//               <h2 className="text-xl sm:text-[28px] font-bold text-black dark:text-white mb-4 sm:mb-6">
//                 Cookies and Tracking Technologies
//               </h2>
//               <p className="text-sm sm:text-base text-gray-700 dark:text-gray-400 leading-relaxed mb-6">
//                 Morbi sed imperdiet in ipsum, adipiscing elit dui lectus. Tellus
//                 id scelerisque est ultricies ultricies. Duis est sit sed leo
//                 nisl, blandit elit sagittis. Quisque tristique consequat quam
//                 sed. Nisl at scelerisque amet nulla purus habitasse.
//               </p>

//               <blockquote className="border-l-4 border-black dark:border-[#0077F7] pl-4 sm:pl-6 py-2 italic text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
//                 “Ipsum sit mattis nulla quam nulla. Gravida id gravida ac enim
//                 mauris id. Non pellentesque congue eget consectetur turpis.
//                 Sapien, dictum molestie sem tempor. Diam elit, orci, tincidunt
//                 aenean tempus.”
//               </blockquote>
//             </section>
//           </div>

//           {/* CTA */}
//           <section className="pt-8 sm:pt-12">
//             <h2 className="text-2xl sm:text-[30px] font-bold text-black dark:text-white mb-3 sm:mb-4">
//               Get Started Now
//             </h2>
//             <p className="text-sm sm:text-[14px] text-gray-700 dark:text-gray-400 mb-6 sm:mb-8 leading-relaxed">
//               Reach out to us today and take the first step toward your goals.
//             </p>
//             <Link href="/contact-us">
//             <Button className="bg-[#0077F7] hover:bg-[#0066DD] text-white px-6 py-3 text-[15px] sm:text-[16px] font-semibold rounded-full h-auto">
//               Get Started
//             </Button>
//             </Link>
//           </section>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }
