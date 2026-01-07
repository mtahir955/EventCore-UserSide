"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";

export function HeroSection() {
  const [heroImage, setHeroImage] = useState<string>("/images/bg-hero.png");

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/tenants/public/about`, {
          headers: { "X-Tenant-ID": HOST_Tenant_ID },
        });

        const banner =
          res.data?.data?.bannerUrl || res.data?.data?.hero?.backgroundImage;

        // ✅ normalize banner safely
        if (typeof banner === "string" && banner.trim()) {
          const normalized = banner.trim();

          // If already absolute URL, keep it. If relative, make absolute with base.
          const absoluteUrl = normalized.startsWith("http")
            ? normalized
            : new URL(normalized, API_BASE_URL).toString();

          setHeroImage(absoluteUrl);
        }
      } catch (err) {
        console.error("❌ Failed to load hero image:", err);
      }
    };

    fetchHero();
  }, []);

  return (
    <section className="relative w-full h-[500px] overflow-hidden bg-white dark:bg-[#212121] transition-colors duration-300">
      <div className="absolute inset-0">
        <Image
          src={heroImage}
          alt="Hero banner"
          fill
          className="object-cover transition-all duration-500"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Desktop content */}
      <div className="relative z-10 h-full hidden md:flex items-center justify-start mt-[180px] ml-[60px]">
        <div className="flex gap-4">
          <Link href="/events">
            <Button className="bg-[#0077F7] hover:bg-[#0066D6] text-white px-8 py-6 text-lg rounded-full">
              View Events
            </Button>
          </Link>

          <Link href="/about-us">
            <Button
              variant="outline"
              className="bg-white text-black px-8 py-6 text-lg rounded-full"
            >
              About Us
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile */}
      <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-4 px-4 w-full justify-center">
        <Link href="/events" className="w-full sm:w-auto">
          <Button className="bg-[#0077F7] text-white w-full px-8 py-5 rounded-full">
            View Events
          </Button>
        </Link>
        <Link href="/about-us" className="w-full sm:w-auto">
          <Button
            variant="outline"
            className="bg-white text-black w-full px-8 py-5 rounded-full"
          >
            About Us
          </Button>
        </Link>
      </div>
    </section>
  );
}

// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// export function HeroSection() {
//   return (
//     <section className="relative w-full h-[500px] overflow-hidden bg-white dark:bg-[#212121] transition-colors duration-300">
//       {/* Background image */}
//       <div className="absolute inset-0">
//         <Image
//           src="/images/bg-hero.png"
//           alt="Event venue"
//           fill
//           className="object-cover transition-all duration-500"
//           priority
//         />
//         {/* Overlay (same for both modes) */}
//         <div className="absolute inset-0 bg-black/40" />
//       </div>

//       {/* Desktop content */}
//       <div className="relative z-10 h-full hidden md:flex items-center justify-start mt-[180px] ml-[60px]">
//         <div className="flex gap-4">
//           {/* View Events button */}
//           <Link href="/events">
//             <Button className="bg-[#0077F7] hover:bg-[#0066D6] dark:bg-[#3399FF] dark:hover:bg-[#4DA3FF] text-white px-8 py-6 text-lg rounded-full font-medium transition-colors">
//               View Events
//             </Button>
//           </Link>

//           {/* About Us button (white even in dark mode) */}
//           <Link href="/about-us">
//             <Button
//               variant="outline"
//               className="bg-white hover:bg-gray-100 text-[#000000] dark:bg-white dark:hover:bg-gray-200 dark:text-[#000000] px-8 py-6 text-lg rounded-full font-medium transition-colors"
//             >
//               About Us
//             </Button>
//           </Link>
//         </div>
//       </div>

//       {/* Mobile & Tablet content */}
//       <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-row sm:flex-row items-center gap-4 px-4 w-full justify-center">
//         <Link href="/events" className="w-full sm:w-auto flex justify-center">
//           <Button className="bg-[#0077F7] hover:bg-[#0066D6] dark:bg-[#3399FF] dark:hover:bg-[#4DA3FF] text-white w-full sm:w-auto px-8 py-5 text-base rounded-full font-medium transition-colors">
//             View Events
//           </Button>
//         </Link>
//         <Link href="/about-us" className="w-full sm:w-auto flex justify-center">
//           <Button
//             variant="outline"
//             className="bg-white hover:bg-gray-100 text-[#000000] dark:bg-white dark:hover:bg-gray-200 dark:text-[#000000] w-full sm:w-auto px-8 py-5 text-base rounded-full font-medium transition-colors"
//           >
//             About Us
//           </Button>
//         </Link>
//       </div>
//     </section>
//   );
// }
