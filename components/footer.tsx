"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";

type SocialLinks = {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
};

export function Footer() {
  const [tenantLogo, setTenantLogo] = useState<string | null>(null);
  const [socials, setSocials] = useState<SocialLinks>({});

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/tenants/public/about`, {
          headers: {
            "X-Tenant-ID": HOST_Tenant_ID,
          },
        });

        const json = await res.json();

        if (json?.success && json?.data) {
          const logoUrl = json.data.logoUrl;
          if (logoUrl) {
            const fullLogo = logoUrl.startsWith("http")
              ? logoUrl
              : `${API_BASE_URL}${logoUrl}`;

            setTenantLogo(fullLogo);
          }

          setSocials({
            facebook: json.data.socialFacebook || undefined,
            instagram: json.data.socialInstagram || undefined,
            twitter: json.data.socialTwitter || undefined,
            youtube: json.data.socialYoutube || undefined,
          });
        }
      } catch (err) {
        console.error("Failed to load footer tenant data", err);
      }
    };

    fetchTenantData();
  }, []);

  return (
    <footer className="w-full bg-[#000000] text-white py-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-8 text-left items-start justify-items-start">
          {/* Logo */}
          <div className="flex flex-col items-start">
            <Image
              src={tenantLogo || "/images/footer-logo.png"}
              alt="Tenant Logo"
              width={180}
              height={50}
              priority
              className="h-20 w-[240px] mb-4 mr-2 object-contain"
            />
          </div>

          {/* Company Info */}
          <div className="flex flex-col items-start">
            <h3 className="text-white font-bold text-lg mb-4">Company Info</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Contact us
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div className="flex flex-col items-start">
            <h3 className="text-white font-bold text-lg mb-4">Help</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link
                  href="/faqs"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-services"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="flex flex-col items-start">
            <h3 className="text-white font-bold text-lg mb-4">Follow Us</h3>
            <ul className="space-y-2 sm:space-y-3">
              {socials.facebook && (
                <li>
                  <Link
                    href={socials.facebook}
                    target="_blank"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Facebook
                  </Link>
                </li>
              )}
              {socials.instagram && (
                <li>
                  <Link
                    href={socials.instagram}
                    target="_blank"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Instagram
                  </Link>
                </li>
              )}
              {socials.twitter && (
                <li>
                  <Link
                    href={socials.twitter}
                    target="_blank"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    Twitter
                  </Link>
                </li>
              )}
              {socials.youtube && (
                <li>
                  <Link
                    href={socials.youtube}
                    target="_blank"
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    YouTube
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-center text-gray-400 text-xs sm:text-sm">
            ©2025 Event Core. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// import Image from "next/image";
// import Link from "next/link";

// export function Footer() {
//   return (
//     <footer className="w-full bg-[#000000] text-white py-8">
//       <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-8 text-left items-start justify-items-start">
//           {/* Logo and description */}
//           <div className="flex flex-col items-start">
//             <Image
//               src="/images/footer-logo.png"
//               alt="Good Life Trainings"
//               width={180}
//               height={50}
//               className="h-20 w-[240px] mb-4 mr-2"
//             />
//             {/* <p className="text-gray-400 text-sm leading-relaxed mb-2 max-w-[260px]">
//               Vivamus tristique odio sit amet velit semper,
//             </p>
//             <p className="text-gray-400 text-sm leading-relaxed mb-2 max-w-[260px]">
//               eu posuere turpis interdum.
//             </p>
//             <p className="text-gray-400 text-sm leading-relaxed max-w-[260px]">
//               Cras egestas purus
//             </p> */}
//           </div>

//           {/* Company Info */}
//           <div className="flex flex-col items-start">
//             <h3 className="text-white font-bold text-lg mb-4">Company Info</h3>
//             <ul className="space-y-2 sm:space-y-3">
//               <li>
//                 <Link
//                   href="/#"
//                   className="text-gray-400 hover:text-white transition-colors text-sm"
//                 >
//                   Home
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/events"
//                   className="text-gray-400 hover:text-white transition-colors text-sm"
//                 >
//                   Events
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/about-us"
//                   className="text-gray-400 hover:text-white transition-colors text-sm"
//                 >
//                   About
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/contact-us"
//                   className="text-gray-400 hover:text-white transition-colors text-sm"
//                 >
//                   Contact us
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Help */}
//           <div className="flex flex-col items-start">
//             <h3 className="text-white font-bold text-lg mb-4">Help</h3>
//             <ul className="space-y-2 sm:space-y-3">
//               <li>
//                 <Link
//                   href="/FAQ,s"
//                   className="text-gray-400 hover:text-white transition-colors text-sm"
//                 >
//                   FAQs
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/terms-of-services"
//                   className="text-gray-400 hover:text-white transition-colors text-sm"
//                 >
//                   Terms of Service
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="/privacy-policy"
//                   className="text-gray-400 hover:text-white transition-colors text-sm"
//                 >
//                   Privacy Policy
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Follow Us */}
//           <div className="flex flex-col items-start">
//             <h3 className="text-white font-bold text-lg mb-4">Follow Us</h3>
//             <ul className="space-y-2 sm:space-y-3">
//               <li>
//                 <Link
//                   href="#"
//                   className="text-gray-400 hover:text-white transition-colors text-sm"
//                 >
//                   Facebook
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="#"
//                   className="text-gray-400 hover:text-white transition-colors text-sm"
//                 >
//                   Instagram
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="#"
//                   className="text-gray-400 hover:text-white transition-colors text-sm"
//                 >
//                   Twitter
//                 </Link>
//               </li>
//               <li>
//                 <Link
//                   href="#"
//                   className="text-gray-400 hover:text-white transition-colors text-sm"
//                 >
//                   YouTube
//                 </Link>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Copyright */}
//         <div className="border-t border-gray-800 pt-8">
//           <p className="text-center text-gray-400 text-xs sm:text-sm">
//             ©2025 Event Core. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// }
