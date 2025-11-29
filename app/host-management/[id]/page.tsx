"use client";

import { Sidebar } from "../../admin/components/sidebar";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { MyEventsCard } from "../../admin/components/my-events-card";
import Link from "next/link";
import { Bell, X, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { API_BASE_URL } from "../../../config/apiConfig";
import LogoutModal from "@/components/modals/LogoutModal";
import { SAAS_Tenant_ID } from "@/config/sasTenantId";

// -----------------------------------------
// Skeleton Component
// -----------------------------------------
const SkeletonBlock = ({ className }: { className?: string }) => (
  <div
    className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded-md ${className}`}
  />
);

export default function HostDetailsPage() {
  const router = useRouter();
  const { id: tenantId } = useParams(); // dynamic route: /host-management/{id}

  const [tenant, setTenant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme, theme, setTheme } = useTheme();
  const [adminName, setAdminName] = useState("Admin");

  // -----------------------------------------
  // FETCH TENANT DETAILS
  // -----------------------------------------
  useEffect(() => {
    if (!tenantId) return;

    const fetchTenant = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("adminToken");

        const res = await fetch(`${API_BASE_URL}/admin/tenants/${tenantId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "x-tenant-id": SAAS_Tenant_ID,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch tenant details");

        const data = await res.json();
        setTenant(data?.data || data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTenant();
  }, [tenantId]);

  // -----------------------------------------
  // CLICK OUTSIDE TO CLOSE DROPDOWN
  // -----------------------------------------
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -----------------------------------------
  // LOADING SKELETON
  // -----------------------------------------
  if (loading) {
    return (
      <div className="flex min-h-screen bg-secondary dark:bg-[#101010]">
        <Sidebar activePage="Tenant Host" />

        <main className="flex-1 overflow-auto lg:ml-[250px] p-6">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center mb-8">
            <SkeletonBlock className="h-9 w-48" />
            <div className="flex items-center gap-4">
              <SkeletonBlock className="h-8 w-8 rounded-full" />
              <SkeletonBlock className="h-8 w-8 rounded-full" />
            </div>
          </div>

          {/* Back Button Skeleton */}
          <SkeletonBlock className="h-4 w-20 mb-6" />

          {/* Profile Section */}
          <div className="flex flex-col items-center mb-10">
            <SkeletonBlock className="w-32 h-32 rounded-full mb-4" />
            <SkeletonBlock className="h-6 w-40 mb-2" />
          </div>

          {/* Basic Information Skeleton */}
          <div className="bg-background dark:bg-[#181818] rounded-lg p-6 mb-10">
            <SkeletonBlock className="h-6 w-40 mb-6" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <SkeletonBlock className="h-4 w-32" />
                  <SkeletonBlock className="h-5 w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl overflow-hidden bg-background dark:bg-[#181818] p-4"
              >
                <SkeletonBlock className="w-full h-40 mb-4" />
                <SkeletonBlock className="h-4 w-24 mb-2" />
                <SkeletonBlock className="h-4 w-16" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // -----------------------------------------
  // ERROR UI
  // -----------------------------------------
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500 text-xl">
        Failed to load tenant details: {error}
      </div>
    );
  }

  // -----------------------------------------
  // MAIN FINAL PAGE
  // -----------------------------------------
  return (
    <div className="flex min-h-screen bg-secondary">
      <Sidebar activePage="Tenant Host" />

      <main className="flex-1 overflow-auto lg:ml-[250px] dark:bg-[#101010]">
        {/* Header */}
        <header className="hidden lg:flex bg-background border-b border-border px-8 py-6 items-center justify-between sticky top-0 z-30">
          <h1 className="text-3xl font-semibold text-foreground">
            Tenant Host
          </h1>

          <div className="flex items-center gap-4">
            <Link href="/push-notification">
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-300">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative flex items-center gap-2" ref={profileRef}>
              <span className="hidden sm:block font-semibold text-black dark:text-white">
                {adminName}
              </span>

              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="bg-black border h-9 w-9 flex justify-center items-center rounded-full hover:opacity-90"
                >
                  <img
                    src="/images/icons/profile-user.png"
                    alt="profile"
                    className="h-4 w-4"
                  />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#101010] shadow-lg border border-gray-200 dark:border-gray-800 rounded-xl z-50 py-2">
                    <Link href="/tenant-form">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg">
                        Create Tenant
                      </button>
                    </Link>

                    <Link href="/host-management">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg">
                        Tenant Host
                      </button>
                    </Link>

                    <Link href="/tenant-management">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg">
                        Tenant Management
                      </button>
                    </Link>

                    <Link href="/system-settings">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg">
                        System Settings
                      </button>
                    </Link>

                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 md:p-8 pt-2 mt-8 sm:mt-0 max-w-[1440px] mx-auto">
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="hover:opacity-70 transition-opacity hover:cursor-pointer mb-4"
          >
            <Image
              src="/icons/back-arrow.png"
              alt="Back"
              width={12}
              height={12}
            />
          </button>

          {/* Profile */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden mb-4">
              <Image
                src={tenant?.logoUrl || "/avatars/avatar-1.png"}
                alt={tenant?.name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center">
              {tenant?.name}
            </h2>
          </div>

          {/* Basic Info */}
          <div className="bg-background rounded-lg p-4 sm:p-6 mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-6">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-y-6 sm:gap-x-12 lg:gap-x-40">
              {[
                ["Email", tenant?.email || "N/A"],
                ["Phone Number", tenant?.phoneNumber || "N/A"],
                ["No. of Events Conducted", tenant?.eventCount || "0"],
                ["Tickets Sold", tenant?.ticketsSold || "0"],
                ["Payment Status", tenant?.monthlyPaymentStatus || "N/A"],
                // ["Profile Status", tenant?.status || "N/A"],
                [
                  "Profile Status",
                  (() => {
                    const raw =
                      tenant?.status ||
                      tenant?.tenantStatus || // possible name
                      tenant?.accountStatus || // possible name
                      tenant?.profileStatus || // possible name
                      tenant?.state || // some APIs use this
                      null;

                    if (!raw) return "N/A";

                    const s = raw.toString().toUpperCase();

                    if (s === "ACTIVE") return "Active";
                    if (s === "SUSPENDED") return "Banned";
                    if (s === "INACTIVE") return "Inactive";
                    if (s === "TRIAL") return "Trial";

                    return raw; // fallback
                  })(),
                ],

                // ["Gender", tenant?.gender || "N/A"],
                [
                  "Gender",
                  (() => {
                    const raw = tenant?.gender;

                    if (!raw) return "N/A"; // null, undefined, empty

                    const v = raw.toString().trim().toLowerCase();

                    if (v === "male" || v === "m") return "Male";
                    if (v === "female" || v === "f") return "Female";

                    return raw; // fallback if backend uses another value
                  })(),
                ],

                ["Address", tenant?.address || "N/A"],
              ].map(([label, value], index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between"
                >
                  <p className="text-sm sm:text-md text-muted-foreground mb-1 sm:mb-0">
                    {label}
                  </p>
                  <p
                    className={`text-base text-foreground ${
                      label === "Profile Status"
                        ? "text-[#b71c1c] font-medium"
                        : ""
                    } text-right sm:text-left`}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Static Events For Now */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            {[1, 2, 3, 4].map((id) => (
              <MyEventsCard
                key={id}
                imageSrc="/purple-lit-event-venue-with-tables.jpg"
                price="$99.99"
              />
            ))}
          </div>

          {/* Back Button */}
          <div className="flex justify-center sm:justify-end">
            <button
              onClick={() => router.back()}
              className="px-10 sm:px-16 py-3 bg-[#D19537] text-white rounded-full font-medium hover:opacity-90 transition-opacity w-full sm:w-auto"
            >
              Go Back
            </button>
          </div>
        </div>
      </main>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onLogout={() => {
          localStorage.clear();
          window.location.href = "/sign-in-admin";
        }}
      />
    </div>
  );
}

// "use client";

// import { Sidebar } from "../../admin/components/sidebar";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useState, useRef, useEffect } from "react";
// import { MyEventsCard } from "../../admin/components/my-events-card";
// import Link from "next/link";
// import { Bell, User, X, LogOut, Moon, Sun } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useTheme } from "next-themes";

// interface Event {
//   id: string;
//   title: string;
//   description: string;
//   image: string;
//   price: string;
//   host: string;
//   location: string;
//   date: string;
//   audience: string;
//   time: string;
// }

// const events: Event[] = [
//   {
//     id: "1",
//     title: "Starry Nights Music Fest",
//     description:
//       "A magical evening under the stars with live bands, food stalls, and an electric crowd.",
//     image: "/purple-lit-event-venue-with-tables.jpg",
//     price: "$99.99",
//     host: "Eric Gryzibowski",
//     location: "California",
//     date: "13 June 2025",
//     audience: "150 Audience",
//     time: "08:00 PM - 09:00 PM",
//   },
//   {
//     id: "2",
//     title: "Starry Nights Music Fest",
//     description:
//       "A magical evening under the stars with live bands, food stalls, and an electric crowd.",
//     image: "/red-stage-lights-concert.jpg",
//     price: "$99.99",
//     host: "Eric Gryzibowski",
//     location: "California",
//     date: "13 June 2025",
//     audience: "150 Audience",
//     time: "08:00 PM - 09:00 PM",
//   },
//   {
//     id: "3",
//     title: "Starry Nights Music Fest",
//     description:
//       "A magical evening under the stars with live bands, food stalls, and an electric crowd.",
//     image: "/purple-lit-event-venue-with-tables.jpg",
//     price: "$99.99",
//     host: "Eric Gryzibowski",
//     location: "California",
//     date: "13 June 2025",
//     audience: "150 Audience",
//     time: "08:00 PM - 09:00 PM",
//   },
//   {
//     id: "4",
//     title: "Starry Nights Music Fest",
//     description:
//       "A magical evening under the stars with live bands, food stalls, and an electric crowd.",
//     image: "/blue-silhouette-speaker-audience.jpg",
//     price: "$99.99",
//     host: "Eric Gryzibowski",
//     location: "California",
//     date: "13 June 2025",
//     audience: "150 Audience",
//     time: "08:00 PM - 09:00 PM",
//   },
// ];

// export default function HostDetailsPage() {
//   const router = useRouter();
//   const [isHostRequestModalOpen, setIsHostRequestModalOpen] = useState(false);

//   const [showLogoutModal, setShowLogoutModal] = useState(false);
//   const [showProfileDropdown, setShowProfileDropdown] = useState(false);
//   const profileRef = useRef<HTMLDivElement>(null);

//   // Click outside handler
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (
//         profileRef.current &&
//         !profileRef.current.contains(e.target as Node)
//       ) {
//         setShowProfileDropdown(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const { resolvedTheme, theme, setTheme } = useTheme();
//   const [adminName, setAdminName] = useState("Admin");

//   return (
//     <div className="flex min-h-screen bg-secondary">
//       {/* Sidebar (responsive behavior handled inside component) */}
//       <Sidebar activePage="Tenant Host" />

//       <main className="flex-1 overflow-auto lg:ml-[250px] dark:bg-[#101010]">
//         {/* ===== Desktop Header ===== */}
//         <header className="hidden lg:flex bg-background border-b border-border px-8 py-6 items-center justify-between sticky top-0 z-30">
//           <h1 className="text-3xl font-semibold text-foreground">
//             Tenant Host
//           </h1>
//           <div className="flex items-center gap-4">
//             {/* Light/Dark toggle */}
//             {/* <Button
//               onClick={() =>
//                 setTheme(resolvedTheme === "light" ? "dark" : "light")
//               }
//               variant="ghost"
//               size="sm"
//               className="hidden lg:flex text-gray-600 dark:text-gray-300 gap-2 hover:text-[#0077F7]"
//             >
//               {theme === "light" ? (
//                 <>
//                   <Moon className="h-4 w-4" /> Dark Mode
//                 </>
//               ) : (
//                 <>
//                   <Sun className="h-4 w-4" /> Light Mode
//                 </>
//               )}
//             </Button> */}

//             {/* Mobile toggle */}
//             {/* <button
//               onClick={() =>
//                 setTheme(resolvedTheme === "light" ? "dark" : "light")
//               }
//               className="lg:hidden p-1 text-gray-700 dark:text-gray-300 hover:text-[#0077F7] flex-shrink-0"
//             >
//               {theme === "light" ? (
//                 <Moon className="h-5 w-5 sm:h-6 sm:w-6" />
//               ) : (
//                 <Sun className="h-5 w-5 sm:h-6 sm:w-6" />
//               )}
//             </button> */}
//             <Link href="/push-notification">
//               <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-300">
//                 <Bell className="h-5 w-5 text-gray-600" />
//               </button>
//             </Link>
//             {/* Profile Name + Icon + Dropdown */}
//             <div className="relative flex items-center gap-2" ref={profileRef}>
//               {/* Admin Name */}
//               <span className="hidden sm:block font-semibold text-black dark:text-white">
//                 {adminName}
//               </span>

//               {/* Profile Icon Wrapper for relative dropdown */}
//               <div className="relative">
//                 <button
//                   onClick={() => setShowProfileDropdown(!showProfileDropdown)}
//                   className="bg-black border h-9 w-9 flex justify-center items-center rounded-full hover:opacity-90"
//                 >
//                   <img
//                     src="/images/icons/profile-user.png"
//                     alt="profile"
//                     className="h-4 w-4"
//                   />
//                 </button>

//                 {/* Dropdown — Positioned relative to icon */}
//                 {showProfileDropdown && (
//                   <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#101010] shadow-lg border border-gray-200 dark:border-gray-800 rounded-xl z-50 py-2">
//                     <Link href="/host-management">
//                       <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg">
//                         Host Management
//                       </button>
//                     </Link>

//                     <Link href="/host-request">
//                       <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg">
//                         Host Request
//                       </button>
//                     </Link>

//                     <Link href="/payment-withdrawal">
//                       <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg">
//                         Payment Withdrawal
//                       </button>
//                     </Link>

//                     <Link href="/system-settings">
//                       <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg">
//                         System Settings
//                       </button>
//                     </Link>

//                     <button
//                       onClick={() => setShowLogoutModal(true)}
//                       className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800 rounded-lg"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Spacer for mobile navbar */}
//         <div className="lg:hidden h-[56px]" />

//         {/* ===== Content ===== */}
//         <div className="p-4 sm:p-6 md:p-8 pt-2 max-w-[1440px] mx-auto">
//           {/* Back Button */}
//           <button
//             onClick={() => router.back()}
//             className="hover:opacity-70 transition-opacity hover:cursor-pointer mb-4"
//           >
//             <Image
//               src="/icons/back-arrow.png"
//               alt="Back"
//               width={12}
//               height={12}
//             />
//           </button>

//           {/* Profile Section */}
//           <div className="flex flex-col items-center mb-8">
//             <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden mb-4">
//               <Image
//                 src="/avatars/daniel-carter.png"
//                 alt="Daniel Carter"
//                 width={128}
//                 height={128}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//             <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-center">
//               Daniel Carter
//             </h2>
//           </div>

//           {/* Basic Information */}
//           <div className="bg-background rounded-lg p-4 sm:p-6 mb-8">
//             <h3 className="text-lg sm:text-xl font-bold text-foreground mb-6">
//               Basic Information
//             </h3>

//             {/* Info grid responsive */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-y-6 sm:gap-x-12 lg:gap-x-40">
//               {[
//                 ["Email", "info@gmail.com"],
//                 ["Phone Number", "+44 7412 558492"],
//                 ["No. of Events Conducted", "20"],
//                 ["Tickets Sold", "20012"],
//                 ["Payment Method", "MasterCard"],
//                 ["Profile Status", "Banned"],
//                 ["Gender", "Male"],
//                 ["Address", "1234 Sunset Blvd, Los Angeles, CA 90026"],
//               ].map(([label, value], index) => (
//                 <div
//                   key={index}
//                   className="flex flex-col sm:flex-row sm:items-center justify-between"
//                 >
//                   <p className="text-sm sm:text-md text-muted-foreground mb-1 sm:mb-0">
//                     {label}
//                   </p>
//                   <p
//                     className={`text-base text-foreground ${
//                       label === "Profile Status"
//                         ? "text-[#b71c1c] font-medium"
//                         : ""
//                     } text-right sm:text-left`}
//                   >
//                     {value}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Events Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
//             {events.map((event) => (
//               <Link key={event.id} href={`/host-management-details`}>
//                 <MyEventsCard imageSrc={event.image} price={event.price} />
//               </Link>
//             ))}
//           </div>

//           {/* Go Back Button */}
//           <div className="flex justify-center sm:justify-end">
//             <button
//               onClick={() => router.back()}
//               className="px-10 sm:px-16 py-3 bg-[#D19537] text-white rounded-full font-medium hover:opacity-90 transition-opacity w-full sm:w-auto"
//             >
//               Go Back
//             </button>
//           </div>
//         </div>
//       </main>

//       {/* Logout Modal */}
//       {showLogoutModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           <div
//             className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
//             onClick={() => setShowLogoutModal(false)}
//           />
//           <div
//             className="relative flex w-[90%] flex-col items-center justify-center bg-white dark:bg-[#101010] p-8 shadow-xl sm:w-[500px]"
//             style={{ height: "auto", borderRadius: "16px" }}
//           >
//             <button
//               onClick={() => setShowLogoutModal(false)}
//               className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-gray-800"
//             >
//               <X className="size-4" />
//             </button>
//             <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-gray-300">
//               <div className="flex size-12 items-center justify-center rounded-full bg-[#D19537]">
//                 <LogOut className="size-6 text-white" />
//               </div>
//             </div>
//             <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 dark:text-white">
//               Are you sure you want to log out?
//             </h2>
//             <p className="mb-8 text-center text-gray-600 dark:text-gray-400">
//               {"You'll be signed out from your account."}
//             </p>
//             <div className="flex w-full flex-col gap-4 sm:flex-row">
//               <button
//                 onClick={() => setShowLogoutModal(false)}
//                 className="h-14 w-full bg-gray-100 font-medium text-[#D19537] transition-colors hover:bg-gray-200 sm:w-[212px]"
//                 style={{ borderRadius: "50px" }}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={() => {
//                   console.log("Logging out...");
//                   setShowLogoutModal(false);
//                 }}
//                 className="h-14 w-full bg-[#D19537] font-medium text-white transition-colors hover:bg-[#e99714] sm:w-[212px]"
//                 style={{ borderRadius: "50px" }}
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
