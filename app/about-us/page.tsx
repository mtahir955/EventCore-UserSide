"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch About Page Data
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/tenants/public/about`, {
        headers: { "X-Tenant-ID": HOST_Tenant_ID },
      })
      .then((res) => {
        setAboutData(res.data.data);
      })
      .catch((err) => console.error("❌ Error loading about page:", err))
      .finally(() => setLoading(false));
  }, []);

  const hero = aboutData?.hero;
  const about = aboutData?.aboutSection;
  const testimonial = aboutData?.testimonial;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#101010] text-black dark:text-white transition-colors duration-300">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[400px] sm:h-[450px] flex items-center justify-center">
        <div className="absolute inset-0">
          {/* STATIC HERO IMAGE (AS YOU REQUESTED) */}
          <Image
            src="/images/about-hero.jpg"
            alt="Hero background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white px-4 sm:px-8 max-w-4xl mx-auto">
          {/* ONLY TITLE (NO HIGHLIGHT SPLIT) */}
          <h1 className=" font-passionate text-[#89FD00] text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            {hero?.title || "LIVIN' THE GOOD LIFE"}
          </h1>

          {/* ONLY SUBTITLE */}
          <p className="text-base sm:text-lg md:text-xl text-white/95 leading-relaxed">
            {hero?.subtitle ||
              "Discover the essential solutions that power every successful event."}
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-10 md:px-16 py-12 sm:py-20 md:py-24 transition-colors duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* ABOUT TEXT SECTION */}
          <div className="order-2 md:order-1">
            {/* ONLY TITLE (NO HIGHLIGHT SPLIT) */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8">
              {about?.title}
            </h2>

            {/* PARAGRAPHS ONLY */}
            {about?.paragraphs?.length > 0 ? (
              about.paragraphs.map((para: string, i: number) => (
                <p
                  key={i}
                  className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-8"
                >
                  {para}
                </p>
              ))
            ) : (
              <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-8">
                No description available.
              </p>
            )}

            {/* CTA BUTTON (IF CTA EXISTS) */}
            {about?.ctaText && about?.ctaLink && (
              <Link href={about?.ctaLink}>
                <Button className="bg-[#0077F7] hover:bg-[#0066DD] text-white px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-lg rounded-full">
                  {about?.ctaText}
                </Button>
              </Link>
            )}
          </div>

          {/* STATIC ABOUT IMAGE (AS REQUESTED) */}
          <div className="relative h-[280px] sm:h-[400px] md:h-[600px] order-1 md:order-2">
            <Image
              src="/images/about.png"
              alt="About section image"
              fill
              className="object-cover rounded-2xl"
            />
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="bg-gray-50 dark:bg-[#1A1A1A] py-12 sm:py-16 md:py-20 transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 md:px-16 text-center">
          {/* Stars */}
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 sm:w-6 sm:h-6 fill-[#FFD700] text-[#FFD700]"
              />
            ))}
          </div>

          {/* Quote */}
          <blockquote className="text-lg sm:text-xl md:text-2xl text-gray-900 dark:text-gray-100 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-2">
            &quot;
            {testimonial?.quote ||
              "Good Life Training made our conference seamless and stress-free!"}
            &quot;
          </blockquote>

          {/* Author Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            <div className="flex items-center gap-4">
              <Image
                src={
                  testimonial?.authorImage ||
                  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Avatar%20Image-vhwVQXvTh84eptfz94cJWsdilwjBAV.png"
                }
                alt="Author"
                width={56}
                height={56}
                className="rounded-full"
              />

              <div className="text-left">
                <div className="font-semibold text-gray-900 dark:text-white">
                  {testimonial?.authorName || "Olivia Grant"}
                </div>
                <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                  {testimonial?.authorRole || "Mindset & Growth Expert"}
                </div>
              </div>
            </div>

            <div className="hidden sm:block h-12 w-px bg-gray-300 dark:bg-gray-700" />

            <Image
              src={
                testimonial?.companyLogo ||
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/webflow-Logo-UGcKFzTTM8HxjXdtPhHmsBqmivFi2O.png"
              }
              alt="Company Logo"
              width={90}
              height={24}
              className="h-6 w-auto opacity-90 dark:opacity-100"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

//code before integration

// "use client";

// import Image from "next/image";
// import { Button } from "@/components/ui/button";
// import { Star } from "lucide-react";
// import { Header } from "@/components/header";
// import { Footer } from "@/components/footer";
// import Link from "next/link";

// export default function AboutPage() {
//   return (
//     <div className="min-h-screen flex flex-col bg-white dark:bg-[#101010] text-black dark:text-white transition-colors duration-300">
//       <Header />

//       {/* Hero Section */}
//       <section className="relative h-[400px] sm:h-[450px] flex items-center justify-center">
//         <div className="absolute inset-0">
//           <Image
//             src="/images/about-hero.jpg"
//             alt="Hero background"
//             fill
//             className="object-cover"
//             priority
//           />
//           {/* Keep overlay same brightness in both modes */}
//           <div className="absolute inset-0 bg-black/40" />
//         </div>

//         <div className="relative z-10 text-center text-white px-4 sm:px-8 max-w-4xl mx-auto">
//           <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
//             LIVIN&apos; THE{" "}
//             <span className="text-[#89FC00] italic font-serif">Good Life</span>
//           </h1>
//           <p className="text-base sm:text-lg md:text-xl text-white/95 leading-relaxed">
//             Discover the essential solutions that power every successful event,
//             from planning to unforgettable experiences.
//           </p>
//         </div>
//       </section>

//       {/* About Section */}
//       <section className="max-w-[1440px] mx-auto px-5 sm:px-10 md:px-16 py-12 sm:py-20 md:py-24 transition-colors duration-300">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
//           {/* Text Content */}
//           <div className="order-2 md:order-1">
//             <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8">
//               About{" "}
//               <span className="text-[#89FC00] italic font-serif">
//                 Good Life Training
//               </span>
//             </h2>

//             <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6">
//               Goodlife Trainings is an international movement built to elevate
//               the way you think, work, and live — all while exploring the world.
//               Our mission is to empower individuals to unlock their potential
//               through transformative education rooted in clarity, confidence,
//               and personal evolution.
//             </p>

//             <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-8">
//               We deliver powerful, results-driven trainings across business,
//               personal development, and mental mastery, paired with immersive
//               global experiences. From world-class seminars to destination-based
//               events, every program is designed to help you grow while
//               connecting with new cultures, new perspectives, and new levels of
//               yourself.
//             </p>

//             <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-8">
//               Each training is led by top-tier coaches, mentors, and industry
//               experts — the best in the business — chosen for their proven track
//               records and their ability to inspire true, lasting transformation.
//               Our trainers don’t just teach; they elevate, challenge, and guide
//               you into breakthroughs that carry far beyond the event.
//             </p>

//             <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-8">
//               At Goodlife Trainings, we believe growth is not an event — it’s a
//               lifestyle. And travel is one of the greatest catalysts for that
//               growth. Whether you’re scaling your business, strengthening your
//               mindset, expanding your network worldwide, or stepping into your
//               next level of leadership, we provide the tools, environments, and
//               world-class mentorship to help you rise.
//             </p>

//             <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-8">
//               This is where your journey to your best life begins — and where
//               extraordinary becomes your new normal.
//             </p>

//             <Link href="/contact-us">
//               <Button className="bg-[#0077F7] hover:bg-[#0066DD] text-white px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-lg rounded-full">
//                 Get Started
//               </Button>
//             </Link>
//           </div>

//           {/* Image */}
// <div className="relative h-[280px] sm:h-[400px] md:h-[600px] order-1 md:order-2">
//   <Image
//     src="/images/about.png"
//     alt="Team meeting"
//     fill
//     className="object-cover rounded-2xl"
//   />
// </div>
//         </div>
//       </section>

//       {/* Testimonial Section */}
//       <section className="bg-gray-50 dark:bg-[#1A1A1A] py-12 sm:py-16 md:py-20 transition-colors duration-300">
//         <div className="max-w-[1440px] mx-auto px-5 sm:px-10 md:px-16 text-center">
//           {/* Stars */}
//           <div className="flex justify-center gap-2 mb-6">
//             {[...Array(5)].map((_, i) => (
//               <Star
//                 key={i}
//                 className="w-5 h-5 sm:w-6 sm:h-6 fill-[#FFD700] text-[#FFD700]"
//               />
//             ))}
//           </div>

//           {/* Quote */}
//           <blockquote className="text-lg sm:text-xl md:text-2xl text-gray-900 dark:text-gray-100 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-2">
//             &quot;
//             <span className="text-[#89FC00] italic font-serif">
//               Good Life Training
//             </span>{" "}
//             made our conference seamless and stress-free. Everything was
//             perfectly organized, and our guests loved the experience!&quot;
//           </blockquote>

//           {/* Author Row */}
//           <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
//             {/* Avatar + Name */}
//             <div className="flex items-center gap-4">
//               <Image
//                 src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Avatar%20Image-vhwVQXvTh84eptfz94cJWsdilwjBAV.png"
//                 alt="Olivia Grant"
//                 width={56}
//                 height={56}
//                 className="rounded-full"
//               />
//               <div className="text-left">
//                 <div className="font-semibold text-gray-900 dark:text-white">
//                   Olivia Grant
//                 </div>
//                 <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
//                   Mindset & Growth Expert
//                 </div>
//               </div>
//             </div>

//             {/* Divider (hidden on mobile) */}
//             <div className="hidden sm:block h-12 w-px bg-gray-300 dark:bg-gray-700" />

//             {/* Logo */}
//             <Image
//               src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/webflow-Logo-UGcKFzTTM8HxjXdtPhHmsBqmivFi2O.png"
//               alt="Webflow"
//               width={90}
//               height={24}
//               className="h-6 w-auto opacity-90 dark:opacity-100"
//             />
//           </div>
//         </div>
//       </section>

//       <Footer />
//     </div>
//   );
// }
