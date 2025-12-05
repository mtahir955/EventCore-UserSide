"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Moon, Sun, X, Menu, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Linkedin, Instagram } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePathname } from "next/navigation";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import axios from "axios";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";

export default function TrainersPage() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [apiTrainers, setApiTrainers] = useState<any[]>([]);
  const [fetchingTrainers, setFetchingTrainers] = useState(true);

  const { resolvedTheme, theme, setTheme } = useTheme();

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 💥 Fetch Trainers From Backend
  const fetchTrainers = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/events/trainers?page=1&limit=20`,
        {
          headers: {
            "X-Tenant-ID": HOST_Tenant_ID,
          },
        }
      );

      const data = res.data;

      const trainersArray =
        data?.data?.trainers ||
        data?.data ||
        data?.trainers ||
        (Array.isArray(data) ? data : []);

      setApiTrainers(Array.isArray(trainersArray) ? trainersArray : []);
    } catch (err) {
      console.error("❌ Error loading trainers:", err);
    } finally {
      setFetchingTrainers(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="mb-16">
          <h1 className="text-5xl font-bold text-black dark:text-white mb-4">
            Meet Our <span className="text-[#0077F7]">Trainers</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl">
            Meet our trainers and get inspired by the experts who lead with
            passion and experience.
          </p>
        </div>

        {/* Trainers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {/* Loading State */}
          {fetchingTrainers && (
            <p className="text-gray-600 dark:text-gray-400">
              Loading trainers...
            </p>
          )}

          {/* Empty State */}
          {!fetchingTrainers && apiTrainers.length === 0 && (
            <p className="text-gray-600 dark:text-gray-400">
              No trainers available right now.
            </p>
          )}

          {/* Dynamic Trainers */}
          {apiTrainers.map((trainer: any, idx: number) => (
            <Card
              key={idx}
              className="p-0 overflow-hidden bg-white dark:bg-[#212121] border-0 shadow-lg"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-48 h-64 relative flex-shrink-0">
                  <Image
                    src={trainer.image}
                    alt={trainer.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1 p-6">
                  <h3 className="text-2xl font-bold text-black dark:text-white mb-2">
                    {trainer.name}
                  </h3>

                  <p className="text-[#0077F7] font-medium mb-4">
                    {trainer.role}
                  </p>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
                    {trainer.bio}
                  </p>

                  <div className="flex space-x-3">
                    {trainer.socials?.linkedin && (
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                        <Linkedin className="w-5 h-5 text-black dark:text-white" />
                      </div>
                    )}

                    {trainer.socials?.twitter && (
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                        <Image
                          src="/icons/twitter.png"
                          alt="Custom Icon"
                          width={16}
                          height={18}
                        />
                      </div>
                    )}

                    {trainer.socials?.instagram && (
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
                        <Instagram className="w-5 h-5 text-black dark:text-white" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Get Started */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-black dark:text-white mb-4">
            Get Started Now
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
            Reach out to us today and take the first step toward your goals.
          </p>

          <Link href="/contact-us">
            <Button className="bg-[#0077F7] hover:bg-[#3195ff] text-white px-8 py-6 text-lg rounded-full">
              Get in Touch
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// //code before integration

// "use client";

// import { useState } from "react";
// import { useTheme } from "next-themes";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Moon, Sun, X, Menu, Mail } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { Linkedin, Instagram } from "lucide-react";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { usePathname } from "next/navigation";
// import { Header } from "../../components/header";
// import { Footer } from "../../components/footer";

// export default function TrainersPage() {
//   const pathname = usePathname(); // ⬅️ Detect current route
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [showModal, setShowModal] = useState(false);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const { resolvedTheme, theme, setTheme } = useTheme();

//   const [formData, setFormData] = useState({
//     name: "",
//     company: "",
//     phone: "",
//     email: "",
//     message: "",
//   });

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await fetch("/api/contact", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();
//       if (data.success) {
//         setIsPopupOpen(true);
//         setShowModal(false);
//         setFormData({
//           name: "",
//           company: "",
//           phone: "",
//           email: "",
//           message: "",
//         });
//       } else {
//         alert("❌ Failed to send message. Please try again.");
//       }
//     } catch (err) {
//       console.error("Error submitting form:", err);
//       alert("❌ Something went wrong.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const navItems = [
//     { name: "Home", href: "/" },
//     { name: "Events", href: "/events" },
//     { name: "About", href: "/about-us" },
//     { name: "Trainers", href: "/trainers" },
//     { name: "Calendar", href: "/calendar" },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-black">
//       {/* Header */}
//       <Header />

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-6 py-16">

//         {/* Hero Section */}
//         <div className="mb-16">
//           <h1 className="text-5xl font-bold text-black dark:text-white mb-4">
//             Meet Our <span className="text-[#0077F7]">Trainers</span>
//           </h1>
//           <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl">
//             Meet our trainers and get inspired by the experts who lead with
//             passion and experience.
//           </p>
//         </div>

//         {/* Trainers Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
//           {[
//             {
//               name: "Ethan Brooks",
//               role: "Lead Motivational Coach",
//               img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/f8768ef3f78745594c938bf9a6fef7cb9901b437-kG5E41FN3SiWTZDTQjRU7f7NTuG8Tt.png",
//             },
//             {
//               name: "Sophia Hayes",
//               role: "Wellness & Lifestyle Mentor",
//               img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3a8781b84e4190fb95a41700165989f9815ebb63-qF9WDwVoDMFM593D62D6oPgEzthE17.png",
//             },
//             {
//               name: "Olivia Grant",
//               role: "Corporate Leadership Coach",
//               img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/25b7cfe69d9510a7736c6d7ddab9ab9a49425fc2-6TXbeVKsOJLD9uxuC4G7EICBXcP6WC.png",
//             },
//             {
//               name: "Daniel Carter",
//               role: "Fitness & Performance Trainer",
//               img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/166378978fd07021f2d7014ab91a2b2b97a33d6c-WFEzEHH6HRYSQD3p02I0ZoepqcH5MR.png",
//             },
//             {
//               name: "Maya Collins",
//               role: "Mindfulness & Meditation Coach",
//               img: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7f5b8dcf83a398ed2e4d3e7bc47fe5b342230b0a-1HcEQyf7Fdqcqul1dvlOu53DLleHRS.png",
//             },
//           ].map((trainer, idx) => (
//             <Card
//               key={idx}
//               className="p-0 overflow-hidden bg-white dark:bg-[#212121] border-0 shadow-lg"
//             >
//               <div className="flex flex-col sm:flex-row">
//                 <div className="w-full sm:w-48 h-64 relative flex-shrink-0">
//                   <Image
//                     src={trainer.img}
//                     alt={trainer.name}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//                 <div className="flex-1 p-6">
//                   <h3 className="text-2xl font-bold text-black dark:text-white mb-2">
//                     {trainer.name}
//                   </h3>
//                   <p className="text-[#0077F7] font-medium mb-4">
//                     {trainer.role}
//                   </p>
//                   <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
//                     Inspires you with proven strategies and empowering sessions.
//                     Every interaction leaves you motivated and ready for action.
//                   </p>
//                   <div className="flex space-x-3">
//                     <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
//                       <Linkedin className="w-5 h-5 text-black dark:text-white" />
//                     </div>
//                     <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
//                       <Image
//                         src="/icons/twitter.png"
//                         alt="Custom Icon"
//                         width={16}
//                         height={18}
//                       />
//                     </div>
//                     <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center">
//                       <Instagram className="w-5 h-5 text-black dark:text-white" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </Card>
//           ))}
//         </div>

//         {/* Get Started Section */}
//         <div className="mb-20">
//           <h2 className="text-4xl font-bold text-black dark:text-white mb-4">
//             Get Started Now
//           </h2>
//           <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
//             Reach out to us today and take the first step toward your goals.
//           </p>
//           <Link href="/contact-us">
//           <Button
//             className="bg-[#0077F7] hover:bg-[#3195ff] text-white px-8 py-6 text-lg rounded-full"
//           >
//             Get in Touch
//           </Button>
//           </Link>
//         </div>
//       </main>

//       {/* Footer */}
//       <Footer/>
//     </div>
//   );
// }
