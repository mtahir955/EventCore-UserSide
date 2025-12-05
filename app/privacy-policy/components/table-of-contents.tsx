"use client";

import { useEffect, useState } from "react";

export function TableOfContents({ policies = [] }: { policies: any[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // ⭐ Build dynamic sections from backend titles
  const sections =
    policies.length > 0
      ? policies.map((p, index) => ({
          id: `policy-${index}`,
          label: p.title,
        }))
      : [];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => {
      const element = document.getElementById(s.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <>
      {/* Desktop Table Of Contents */}
      <div className="hidden lg:block bg-[#E8F4FF] dark:bg-[#181818] rounded-lg p-6 sticky top-8 transition-colors duration-300">
        <h3 className="text-[18px] font-semibold text-black dark:text-white mb-4">
          Table of Contents
        </h3>
        <nav className="space-y-3">
          {sections.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`block w-full text-left text-[15px] transition-colors ${
                activeId === item.id
                  ? "text-[#0077F7] font-semibold"
                  : "text-black dark:text-gray-300 hover:text-[#0077F7] dark:hover:text-[#0077F7]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Dropdown */}
      <div className="block lg:hidden mb-8">
        <div className="bg-[#E8F4FF] dark:bg-[#181818] rounded-lg overflow-hidden transition-colors duration-300">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex justify-between items-center px-4 py-3 text-[15px] font-medium text-black dark:text-gray-100"
          >
            {activeId
              ? sections.find((s) => s.id === activeId)?.label
              : sections[0]?.label || "Privacy Policy"}
            <span
              className={`transform transition-transform ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            >
              ▼
            </span>
          </button>

          {isOpen && (
            <div className="border-t border-gray-200 dark:border-gray-700">
              {sections.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-4 py-3 text-[14px] transition-colors ${
                    activeId === item.id
                      ? "text-[#0077F7] font-semibold"
                      : "text-black dark:text-gray-300 hover:text-[#0077F7] dark:hover:text-[#0077F7]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// //code before integration

// "use client";

// import { useEffect, useState } from "react";

// export function TableOfContents() {
//   const [activeId, setActiveId] = useState<string | null>(null);
//   const [isOpen, setIsOpen] = useState(false);

//   const sections = [
//     { id: "information-we-collect", label: "Information We Collect" },
//     { id: "how-event-core-uses", label: "How Event Core Uses Your Information" },
//     { id: "sharing-your-information", label: "Sharing Your Information" },
//     { id: "cookies-and-tracking", label: "Cookies and Tracking Technologies" },
//   ];

//   const scrollToSection = (id: string) => {
//     const el = document.getElementById(id);
//     if (el) {
//       el.scrollIntoView({ behavior: "smooth", block: "start" });
//       setIsOpen(false);
//     }
//   };

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) setActiveId(entry.target.id);
//         });
//       },
//       { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
//     );

//     sections.forEach((s) => {
//       const element = document.getElementById(s.id);
//       if (element) observer.observe(element);
//     });

//     return () => observer.disconnect();
//   }, []);

//   return (
//     <>
//       {/* Desktop Table of Contents */}
//       <div className="hidden lg:block bg-[#E8F4FF] dark:bg-[#181818] rounded-lg p-6 sticky top-8 transition-colors duration-300">
//         <h3 className="text-[18px] font-semibold text-black dark:text-white mb-4">
//           Table of Contents
//         </h3>
//         <nav className="space-y-3">
//           {sections.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => scrollToSection(item.id)}
//               className={`block w-full text-left text-[15px] transition-colors ${
//                 activeId === item.id
//                   ? "text-[#0077F7] font-semibold"
//                   : "text-black dark:text-gray-300 hover:text-[#0077F7] dark:hover:text-[#0077F7]"
//               }`}
//             >
//               {item.label}
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* Mobile Dropdown */}
//       <div className="block lg:hidden mb-8">
//         <div className="bg-[#E8F4FF] dark:bg-[#181818] rounded-lg overflow-hidden transition-colors duration-300">
//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="w-full flex justify-between items-center px-4 py-3 text-[15px] font-medium text-black dark:text-gray-100"
//           >
//             {activeId
//               ? sections.find((s) => s.id === activeId)?.label
//               : "Information We Collect"}
//             <span
//               className={`transform transition-transform ${
//                 isOpen ? "rotate-180" : "rotate-0"
//               }`}
//             >
//               ▼
//             </span>
//           </button>
//           {isOpen && (
//             <div className="border-t border-gray-200 dark:border-gray-700">
//               {sections.map((item) => (
//                 <button
//                   key={item.id}
//                   onClick={() => scrollToSection(item.id)}
//                   className={`block w-full text-left px-4 py-3 text-[14px] transition-colors ${
//                     activeId === item.id
//                       ? "text-[#0077F7] font-semibold"
//                       : "text-black dark:text-gray-300 hover:text-[#0077F7] dark:hover:text-[#0077F7]"
//                   }`}
//                 >
//                   {item.label}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }
