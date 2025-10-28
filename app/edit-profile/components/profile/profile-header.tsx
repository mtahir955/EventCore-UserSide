// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { Pencil } from "lucide-react";

// export default function ProfileHeader() {
//   const [profilePic, setProfilePic] = useState("/images/profile.jpg");

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setProfilePic(imageUrl);
//     }
//   };

//   return (
//     <section className="pt-10">
//       <h1 className="text-[32px] font-semibold">Edit Information</h1>

//       <div className="mt-8 border-t border-border" />

//       <div className="flex flex-col items-center">
//         <p className="mt-6 text-lg font-medium">Profile Photo</p>

//         {/* Profile Image Container */}
//         <div className="relative mt-4">
//           {/* Profile Image */}
//           <div className="h-28 w-28 overflow-hidden rounded-full ring-1 ring-border">
//             <Image
//               src={profilePic}
//               width={112}
//               height={112}
//               alt="Profile"
//               className="h-full w-full object-cover"
//             />
//           </div>

//           {/* Hidden File Input */}
//           <input
//             type="file"
//             accept="image/*"
//             id="profile-upload"
//             className="hidden"
//             onChange={handleImageChange}
//           />

//           {/* Edit Icon positioned OUTSIDE the picture */}
//           <label
//             htmlFor="profile-upload"
//             className="absolute -bottom-0.5 -right-0.5 bg-white border border-gray-200 shadow-md rounded-full p-2 cursor-pointer hover:bg-gray-100 transition"
//           >
//             <Pencil className="w-4 h-4 text-gray-700" />
//           </label>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useState } from "react";
import Image from "next/image";
import { Pencil } from "lucide-react";

export default function ProfileHeader() {
  const [profilePic, setProfilePic] = useState("/images/profile.jpg");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfilePic(imageUrl);
    }
  };

  return (
    <section className="pt-8 sm:pt-10 text-center">
      <h1 className="text-[24px] sm:text-[32px] sm:text-left font-semibold mb-4 sm:mb-0">
        Edit Information
      </h1>

      <div className="flex flex-col items-center">
        <p className="mt-4 text-lg font-medium">Profile Photo</p>

        <div className="relative mt-4">
          <div className="h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-full ring-1 ring-border bg-gray-100 flex items-center justify-center">
            <Image
              src={profilePic}
              width={128}
              height={128}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>

          <input
            type="file"
            accept="image/*"
            id="profile-upload"
            className="hidden"
            onChange={handleImageChange}
          />

          {/* Green Edit Icon */}
          <label
            htmlFor="profile-upload"
            className="absolute bottom-1 right-1 bg-[#89FC00] border border-white shadow-md rounded-full p-1 cursor-pointer hover:bg-lime-400 transition"
          >
            <Pencil className="w-4 h-4 text-white" />
          </label>
        </div>
      </div>
    </section>
  );
}

