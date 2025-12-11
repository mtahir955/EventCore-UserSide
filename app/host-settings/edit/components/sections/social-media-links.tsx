"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { Share2 } from "lucide-react";

const SocialMediaLinksSection = forwardRef(({ tenant }: any, ref) => {
  const [links, setLinks] = useState({
    socialFacebook: tenant.socialFacebook || "",
    socialTwitter: tenant.socialTwitter || "",
    socialInstagram: tenant.socialInstagram || "",
    socialYoutube: tenant.socialYoutube || "",
  });

  useImperativeHandle(ref, () => ({
    getData: () => ({
      socialFacebook: links.socialFacebook.trim(),
      socialTwitter: links.socialTwitter.trim(),
      socialInstagram: links.socialInstagram.trim(),
      socialYoutube: links.socialYoutube.trim(),
    }),
  }));

  const updateLink = (key: string, value: string) => {
    setLinks((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full bg-white dark:bg-[#101010] rounded-2xl border p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <Share2 size={24} className="text-gray-700 dark:text-white" />
        <h3 className="text-xl font-bold whitespace-nowrap">
          Social Media Links
        </h3>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {Object.entries(links).map(([key, value]) => (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium capitalize whitespace-nowrap">
              {key.replace("social", "")}
            </label>

            <input
              className="
                w-full 
                px-4 py-2 
                border rounded 
                bg-gray-100 dark:bg-[#181818] 
                text-sm 
                break-all 
                focus:outline-none focus:ring-2 focus:ring-[#D19537]
              "
              value={value}
              onChange={(e) => updateLink(key, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
});

export default SocialMediaLinksSection;

// "use client";

// import { Share2 } from "lucide-react";

// export default function SocialMediaLinksSection({ tenant }: any) {
//   const links = {
//     Facebook: tenant.socialFacebook,
//     Twitter: tenant.socialTwitter,
//     Instagram: tenant.socialInstagram,
//     Youtube: tenant.socialYoutube,
//   };

//   return (
//     <div className="w-full bg-white dark:bg-[#101010] rounded-2xl border p-6 sm:p-8 space-y-6">
//       <div className="flex items-center gap-3">
//         <Share2 size={24} className="text-gray-700 dark:text-white" />
//         <h3 className="text-xl font-bold">Social Media Links</h3>
//       </div>

//       {/* 2 in one row */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//         {Object.entries(links).map(([key, value], index) => (
//           <div key={index} className="space-y-2">
//             <label className="block text-sm font-medium">{key}</label>
//             <div className="px-4 py-2 bg-gray-100 dark:bg-[#181818] border rounded-lg break-all">
//               {value || "N/A"}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // import { forwardRef, useImperativeHandle, useState } from "react";
// // import { Share2 } from "lucide-react";

// // const SocialMediaLinksSection = forwardRef((props, ref) => {
// //   // 🔒 Fixed data (non-editable)
// //   const [links] = useState({
// //     facebook: "https://facebook.com/yourpage",
// //     instagram: "https://instagram.com/yourprofile",
// //     twitter: "https://twitter.com/yourhandle",
// //     youtube: "https://youtube.com/@yourchannel",
// //   });

// //   // Expose readonly data to parent
// //   useImperativeHandle(ref, () => ({
// //     getData: () => links,
// //   }));

// //   return (
// //     <div className="w-full bg-white dark:bg-[#101010] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6 shadow-sm transition-all">
// //       {/* Header */}
// //       <div className="flex items-center gap-3">
// //         <Share2 size={24} className="text-gray-700 dark:text-white" />
// //         <h3 className="text-xl font-bold text-gray-900 dark:text-white">
// //           Social Media Links
// //         </h3>
// //       </div>

// //       {/* Display Fields */}
// //       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
// //         {/* Facebook */}
// //         <div className="space-y-2">
// //           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
// //             Facebook
// //           </label>
// //           <div
// //             className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700
// //             bg-gray-100 dark:bg-[#181818] rounded-lg text-gray-900
// //             dark:text-gray-300 select-none cursor-not-allowed break-all"
// //           >
// //             {links.facebook}
// //           </div>
// //         </div>

// //         {/* Instagram */}
// //         <div className="space-y-2">
// //           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
// //             Instagram
// //           </label>
// //           <div
// //             className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700
// //             bg-gray-100 dark:bg-[#181818] rounded-lg text-gray-900
// //             dark:text-gray-300 select-none cursor-not-allowed break-all"
// //           >
// //             {links.instagram}
// //           </div>
// //         </div>

// //         {/* Twitter */}
// //         <div className="space-y-2">
// //           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
// //             Twitter / X
// //           </label>
// //           <div
// //             className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700
// //             bg-gray-100 dark:bg-[#181818] rounded-lg text-gray-900
// //             dark:text-gray-300 select-none cursor-not-allowed break-all"
// //           >
// //             {links.twitter}
// //           </div>
// //         </div>

// //         {/* YouTube */}
// //         <div className="space-y-2">
// //           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
// //             YouTube
// //           </label>
// //           <div
// //             className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700
// //             bg-gray-100 dark:bg-[#181818] rounded-lg text-gray-900
// //             dark:text-gray-300 select-none cursor-not-allowed break-all"
// //           >
// //             {links.youtube}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // });

// // SocialMediaLinksSection.displayName = "SocialMediaLinksSection";
// // export default SocialMediaLinksSection;
