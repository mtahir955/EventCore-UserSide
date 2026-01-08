"use client";

import Image from "next/image";
import { X, Mail } from "lucide-react";
import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function Page() {
  return (
    <main className="flex justify-center bg-white dark:bg-[#101010] text-black dark:text-gray-100 transition-colors duration-300">
      <div className="w-full max-w-[1440px] min-h-[100vh]">
        <Header />

        {/* ================= MAIN CONTENT ================= */}
        <section className="mx-auto grid w-full grid-cols-1 gap-12 px-4 sm:px-6 md:px-20 pb-20 pt-10 md:grid-cols-[1fr_350px]">
          {/* LEFT — TEXT CONTENT ONLY */}
          <div className="max-w-[700px] leading-relaxed space-y-6">
            <h1 className="text-[28px] sm:text-[34px] md:text-[42px] font-passionate text-[#89FD00] font-semibold leading-tight">
              Contact Us
            </h1>

            <p className="text-[15px] sm:text-[16px] text-gray-700 dark:text-gray-300">
              We proudly power the complete event ticketing experience for our
              partners. If you have questions about an event for which you have
              purchased tickets, please contact the event organizer directly via
              the contact details they have provided.
            </p>

            <p className="text-[15px] sm:text-[16px] text-gray-700 dark:text-gray-300">
              However, if you'd like to contact us - we'd love to help! You can
              email us anytime a {""}
              <a
                href="mailto:support@example.com"
                className="font-semibold text-[#0077F7] hover:underline"
              >
                support@example.com
              </a>
              , and a member of our team will get back to you within
              <span className="font-semibold"> 2 business days. </span>
            </p>

            <div className="pt-4">
              <h2 className="text-[18px] sm:text-[20px] font-semibold mb-1">
                Event Core Support Hours
              </h2>
              <p className="text-[15px] sm:text-[16px] text-gray-700 dark:text-gray-300">
                Monday – Friday
                <br />
                8:00 AM – 5:00 PM (EST)
              </p>
            </div>
          </div>

          {/* RIGHT — CONTACT CARDS ONLY */}
          <div className="grid grid-cols-1 gap-6 sm:h-4">
            <ContactCard
              icon="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/call-WjJ4Udc3rGCToeCmk6tYBqbDDavef7.png"
              title="Phone"
              value="+1 (555) 000-0000"
            />

            <ContactCard
              icon="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mail-4kEuVpSBHgiINMa7wSoNmDRIhax4Ai.png"
              title="Email"
              value="support@eventcore.com"
            />
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}

/* ============ Contact Card Component ============ */

function ContactCard({
  icon,
  title,
  value,
}: {
  icon: string;
  title: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-black/10 dark:border-gray-700 bg-white dark:bg-[#181818] p-5 sm:p-6 transition-colors duration-300">
      <Image
        src={icon}
        alt={`${title} icon`}
        width={55}
        height={55}
        className="w-[45px] sm:w-[55px]"
      />
      <div>
        <div className="text-[15px] sm:text-[16px] font-semibold">{title}</div>
        <div className="text-[15px] sm:text-[16px] text-gray-700 dark:text-gray-300 break-all">
          {value}
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { Mail, X } from "lucide-react";
// import { Header } from "@/components/header";
// import { Footer } from "@/components/footer";
// import { Button } from "@/components/ui/button";

// export default function Page() {
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [popupType, setPopupType] = useState<"success" | "error">("success");
//   const [popupMsg, setPopupMsg] = useState("");

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setPopupType("success");
//       setPopupMsg(
//         "Thank you for contacting us. We've received your message and will respond as soon as possible."
//       );
//     } catch {
//       setPopupType("error");
//       setPopupMsg("Oops! Something went wrong. Please try again later.");
//     } finally {
//       setIsPopupOpen(true);
//     }
//   };

//   return (
//     <main className="flex justify-center bg-white dark:bg-[#101010] text-black dark:text-gray-100 transition-colors duration-300">
//       <div
//         className="w-full max-w-[1440px] min-h-[1244px]"
//         role="document"
//         aria-label="Contact Us Page"
//       >
//         <Header />

//         {/* Main Content */}
//         <section className="mx-auto grid w-full grid-cols-1 gap-10 px-4 sm:px-6 md:px-10 pb-14 pt-6 md:grid-cols-[1fr_420px]">
//           {/* Left: Form */}
//           {/* <div>
//             <div className="mb-8">
//               <h1 className="text-[28px] sm:text-[34px] md:text-[42px] leading-[1.2] font-medium">
//                 <span className="block text-[#89FC00] font-medium italic mb-1 sm:mb-2">
//                   Get in touch
//                 </span>
//                 with us. We're here to assist you.
//               </h1>
//             </div> */}

//           {/* <form
//               className="flex flex-col gap-4"
//               onSubmit={handleSubmit}
//               aria-label="Contact Form"
//             > */}
//           {/* Name & Company */}
//           {/* <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
//                 <InputField
//                   label="Full Name"
//                   id="fullName"
//                   placeholder="Enter Your Name"
//                 />
//                 <InputField
//                   label="Company Name"
//                   id="company"
//                   placeholder="Enter Your Company Name"
//                 />
//               </div> */}

//           {/* Phone & Email */}
//           {/* <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
//                 <InputField
//                   label="Phone Number"
//                   id="phone"
//                   placeholder="Enter Your Number"
//                 />
//                 <InputField
//                   label="Email"
//                   id="email"
//                   type="email"
//                   placeholder="Enter Your Email"
//                 />
//               </div> */}

//           {/* Message */}
//           {/* <div className="flex flex-col gap-2">
//                 <label className="text-sm" htmlFor="message">
//                   Message
//                 </label>
//                 <textarea
//                   id="message"
//                   name="message"
//                   placeholder="Start Typing Your Message"
//                   className="min-h-[140px] sm:min-h-[156px] rounded-lg border border-black/10 dark:border-gray-700 bg-white dark:bg-[#181818] p-4 text-[15px] outline-none focus:ring-2 focus:ring-[#0077F7] transition"
//                 />
//               </div> */}

//           {/* Submit */}
//           {/* <div className="pt-2 flex justify-center sm:justify-start">
//                 <Button
//                   type="submit"
//                   className="bg-[#0077F7] hover:bg-[#0066DD] text-white px-8 py-5 sm:py-6 rounded-full w-full sm:w-auto"
//                 >
//                   Leave us a Message
//                 </Button>
//               </div>
//             </form>
//           </div> */}

//           {/* Right: Location Card */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             <ContactCard
//               icon="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/call-WjJ4Udc3rGCToeCmk6tYBqbDDavef7.png"
//               title="Phone"
//               value="+1 (555) 000-0000"
//             />
//             <ContactCard
//               icon="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mail-4kEuVpSBHgiINMa7wSoNmDRIhax4Ai.png"
//               title="Email"
//               value="email@example.com"
//             />
//           </div>
//         </section>

//         {/* Contact Info Row */}
//         <section className="mx-auto w-full px-4 sm:px-6 md:px-10 pb-14">
//           {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             <ContactCard
//               icon="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/call-WjJ4Udc3rGCToeCmk6tYBqbDDavef7.png"
//               title="Phone"
//               value="+1 (555) 000-0000"
//             />
//             <ContactCard
//               icon="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mail-4kEuVpSBHgiINMa7wSoNmDRIhax4Ai.png"
//               title="Email"
//               value="email@example.com"
//             />
//           </div> */}
//         </section>

//         <Footer />
//       </div>

//       {/* Popup Modal */}
//       {isPopupOpen && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
//           <div className="bg-white dark:bg-[#212121] rounded-2xl shadow-xl relative w-full max-w-[90%] sm:max-w-md p-6 sm:p-8 transition-colors duration-300">
//             <button
//               onClick={() => setIsPopupOpen(false)}
//               className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors"
//             >
//               <X size={24} />
//             </button>

//             <div className="flex flex-col items-center justify-center text-center">
//               <div
//                 className={`w-16 sm:w-20 h-16 sm:h-20 rounded-full flex items-center justify-center mb-6 ${
//                   popupType === "success" ? "bg-[#0077F7]" : "bg-red-500"
//                 }`}
//               >
//                 <Mail size={28} color="white" />
//               </div>

//               <h2
//                 className={`text-[20px] sm:text-[24px] font-bold mb-4 ${
//                   popupType === "success"
//                     ? "text-gray-900 dark:text-white"
//                     : "text-red-600 dark:text-red-400"
//                 }`}
//               >
//                 {popupType === "success" ? "Message Sent" : "Error"}
//               </h2>

//               <p className="text-gray-600 dark:text-gray-300 text-[14px] sm:text-[15px] leading-relaxed mb-8">
//                 {popupMsg}
//               </p>

//               <button
//                 onClick={() => setIsPopupOpen(false)}
//                 className="w-full py-3 px-6 rounded-xl text-white font-medium hover:opacity-90 transition-opacity text-[14px] sm:text-[15px]"
//                 style={{
//                   backgroundColor:
//                     popupType === "success" ? "#0077F7" : "#0077F7",
//                 }}
//               >
//                 Done
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }

// /* Subcomponents */
// function InputField({
//   label,
//   id,
//   type = "text",
//   placeholder,
// }: {
//   label: string;
//   id: string;
//   type?: string;
//   placeholder: string;
// }) {
//   return (
//     <div className="flex flex-col gap-2">
//       <label className="text-sm" htmlFor={id}>
//         {label}
//       </label>
//       <input
//         id={id}
//         name={id}
//         type={type}
//         placeholder={placeholder}
//         className="h-11 sm:h-12 rounded-lg border border-black/10 dark:border-gray-700 bg-white dark:bg-[#181818] px-4 text-[15px] outline-none focus:ring-2 focus:ring-[#0077F7] transition"
//         required
//       />
//     </div>
//   );
// }

// function ContactCard({
//   icon,
//   title,
//   value,
// }: {
//   icon: string;
//   title: string;
//   value: string;
// }) {
//   return (
//     <div className="flex items-center gap-4 rounded-2xl border border-black/10 dark:border-gray-700 bg-white dark:bg-[#181818] p-5 sm:p-6 transition-colors duration-300">
//       <Image
//         src={icon}
//         alt={`${title} icon`}
//         width={55}
//         height={55}
//         className="w-[45px] sm:w-[55px]"
//       />
//       <div>
//         <div className="text-[15px] sm:text-[16px] font-semibold">{title}</div>
//         <div className="text-[15px] sm:text-[16px] text-gray-700 dark:text-gray-300 break-all">
//           {value}
//         </div>
//       </div>
//     </div>
//   );
// }
