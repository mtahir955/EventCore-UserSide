import Image from "next/image";
import Link from "next/link";

export default function ProfileHeader({ profilePhoto }: any) {
  return (
    <section className="pt-8 sm:pt-10 text-center">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[24px] sm:text-[32px] font-semibold">My Profile</h1>

        <Link href="/edit-profile">
          <button className="inline-flex items-center justify-center h-12 rounded-xl px-6 bg-[#0077F7] hover:bg-blue-600 text-white font-medium">
            Edit Profile
          </button>
        </Link>
      </div>

      <div className="flex flex-col items-center mt-2 sm:mt-6">
        <p className="text-lg font-medium mb-3">Profile Photo</p>

        <div className="h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-full bg-gray-100">
          <Image
            src={profilePhoto || "/images/profile.jpeg"}
            width={112}
            height={112}
            alt="Profile"
            className="object-cover h-full w-full"
          />
        </div>
      </div>
    </section>
  );
}

// //code before integration

// import Image from "next/image";
// import { cn } from "@/lib/utils";
// import Link from "next/link";

// export default function ProfileHeader() {
//   return (
//     <section className="pt-8 sm:pt-10 text-center">
//       <div className="flex items-center justify-between mb-8">
//         <h1 className="text-[24px] sm:text-[32px] font-semibold">My Profile</h1>

//         <Link href="/edit-profile">
//           <button
//             className={cn(
//               "inline-flex items-center justify-center h-12 rounded-xl px-6",
//               "bg-[#0077F7] hover:bg-blue-600 dark:text-white text-primary-foreground font-medium"
//             )}
//             aria-label="Edit Profile"
//           >
//             Edit Profile
//           </button>
//         </Link>
//       </div>

//       <div className="flex flex-col items-center mt-2 sm:mt-6">
//         <p className="text-lg font-medium mb-3">Profile Photo</p>
//         <div className="h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-full ring-1 ring-border bg-gray-100 flex items-center justify-center">
//           <Image
//             src="/images/profile.jpeg"
//             width={112}
//             height={112}
//             alt="Profile"
//             className="h-full w-full object-cover"
//           />
//         </div>
//       </div>
//     </section>
//   );
// }
