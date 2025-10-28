export default function BasicInfo() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 transition-colors duration-300">
      {/* First Name */}
      <div className="space-y-2">
        <label className="text-sm text-gray-700 dark:text-gray-200">
          First Name:
        </label>
        <input
          placeholder="Enter first name"
          className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 px-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
          aria-label="First name"
        />
      </div>

      {/* Last Name */}
      <div className="space-y-2">
        <label className="text-sm text-gray-700 dark:text-gray-200">
          Last Name:
        </label>
        <input
          placeholder="Enter last name"
          className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 px-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
          aria-label="Last name"
        />
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Gender:
        </label>
        <select
          className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-800 dark:text-gray-100 px-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
          aria-label="Gender"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm text-gray-700 dark:text-gray-200">
          Email:
        </label>
        <input
          placeholder="Enter email"
          className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 px-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
          aria-label="Email"
        />
      </div>
    </div>
  );
}
