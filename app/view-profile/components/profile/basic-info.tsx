function splitFullName(fullName?: string) {
  const parts = (fullName || "").trim().split(" ").filter(Boolean);

  return {
    firstName: parts[0] || "",
    lastName: parts.length > 1 ? parts.slice(1).join(" ") : "",
  };
}

function formatBirthday(value?: string) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function BasicInfo({ data }: any) {
  if (!data) return null;

  const fallbackName = splitFullName(data.fullName);
  const firstName = data.firstName || fallbackName.firstName;
  const lastName = data.lastName || fallbackName.lastName;
  const accountType = data.accountType || "";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-gray-900 dark:text-gray-100">
      <div className="space-y-2">
        <label className="text-sm text-gray-700 dark:text-gray-200">
          First Name:
        </label>
        <div className="h-12 flex items-center rounded-lg border px-4 text-sm font-medium bg-gray-50 dark:bg-[#181818]">
          {firstName}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-700 dark:text-gray-200">
          Last Name:
        </label>
        <div className="h-12 flex items-center rounded-lg border px-4 text-sm font-medium bg-gray-50 dark:bg-[#181818]">
          {lastName}
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
          Birthday:
        </label>
        <div className="h-12 flex items-center rounded-lg border px-4 text-sm font-medium bg-gray-50 dark:bg-[#181818]">
          {formatBirthday(data.birthday || data.dateOfBirth)}
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

      <div className="space-y-2">
        <label className="text-sm text-gray-700 dark:text-gray-200">
          Account Type:
        </label>
        <div className="h-12 flex items-center rounded-lg border px-4 text-sm font-medium bg-gray-50 dark:bg-[#181818] capitalize">
          {accountType || "Not selected"}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-700 dark:text-gray-200">
          Ambassador ID Number:
        </label>
        <div className="h-12 flex items-center rounded-lg border px-4 text-sm font-medium bg-gray-50 dark:bg-[#181818]">
          {data.ambassadorId || "Not added"}
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
