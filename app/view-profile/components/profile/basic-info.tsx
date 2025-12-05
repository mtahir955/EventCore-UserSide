export default function BasicInfo({ data }: any) {
  if (!data) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-gray-900 dark:text-gray-100">
      <div className="space-y-2">
        <label className="text-sm text-gray-700 dark:text-gray-200">
          First Name:
        </label>
        <div className="h-12 flex items-center rounded-lg border px-4 text-sm font-medium bg-gray-50 dark:bg-[#181818]">
          {data.firstName}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-700 dark:text-gray-200">
          Last Name:
        </label>
        <div className="h-12 flex items-center rounded-lg border px-4 text-sm font-medium bg-gray-50 dark:bg-[#181818]">
          {data.lastName}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-700 dark:text-gray-200">
          Gender:
        </label>
        <div className="h-12 flex items-center rounded-lg border px-4 text-sm font-medium bg-gray-50 dark:bg-[#181818]">
          {data.gender}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-700 dark:text-gray-200">
          Email:
        </label>
        <div className="h-12 flex items-center rounded-lg border px-4 text-sm font-medium bg-gray-50 dark:bg-[#181818] break-words">
          {data.email}
        </div>
      </div>
    </div>
  );
}

// //code before integration

// export default function BasicInfo() {
//   const data = {
//     firstName: "Jasmine",
//     lastName: "Marina",
//     gender: "Female",
//     email: "jasmine@gmail.com",
//   };

//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 transition-colors duration-300 text-gray-900 dark:text-gray-100">
//       {/* First Name */}
//       <div className="space-y-2">
//         <label className="text-sm text-gray-700 dark:text-gray-200">
//           First Name:
//         </label>
//         <div className="h-12 w-full flex items-center rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#181818] px-4 text-sm font-medium">
//           {data.firstName}
//         </div>
//       </div>

//       {/* Last Name */}
//       <div className="space-y-2">
//         <label className="text-sm text-gray-700 dark:text-gray-200">
//           Last Name:
//         </label>
//         <div className="h-12 w-full flex items-center rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#181818] px-4 text-sm font-medium">
//           {data.lastName}
//         </div>
//       </div>

//       {/* Gender */}
//       <div className="space-y-2">
//         <label className="text-sm text-gray-700 dark:text-gray-200">
//           Gender:
//         </label>
//         <div className="h-12 w-full flex items-center rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#181818] px-4 text-sm font-medium">
//           {data.gender}
//         </div>
//       </div>

//       {/* Email */}
//       <div className="space-y-2">
//         <label className="text-sm text-gray-700 dark:text-gray-200">
//           Email:
//         </label>
//         <div className="h-12 w-full flex items-center rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#181818] px-4 text-sm font-medium break-words">
//           {data.email}
//         </div>
//       </div>
//     </div>
//   );
// }
