import Image from "next/image";

export default function ContactDetails() {
  return (
    <div className="space-y-6 transition-colors duration-300 text-gray-900 dark:text-gray-100">
      {/* Phone / City / Pincode */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Phone Number */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            Phone Number:
          </label>
          <div className="flex h-12 items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] px-3 transition-colors">
            <div className="flex items-center gap-1">
              <Image
                src="/images/flag-us.png"
                width={20}
                height={20}
                alt="US flag"
                className="rounded-sm"
              />
              <span className="text-sm text-gray-800 dark:text-gray-100">+1</span>
            </div>
            <input
              defaultValue="125-559-8852"
              className="h-10 w-full bg-transparent outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-sm"
              aria-label="Phone number"
            />
          </div>
        </div>

        {/* City */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            City/Town:
          </label>
          <input
            defaultValue="California"
            className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 px-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
            aria-label="City or town"
          />
        </div>

        {/* Pincode */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            Pincode:
          </label>
          <input
            defaultValue="78680"
            className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 px-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
            aria-label="Pincode"
          />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <label className="text-sm text-gray-700 dark:text-gray-200">
          Address:
        </label>
        <textarea
          defaultValue="245 Event Street, Downtown Cityview, NY 10016, USA"
          rows={4}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 p-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
          aria-label="Address"
        />
      </div>

      {/* Website */}
      <div className="space-y-2">
        <label className="text-sm text-gray-700 dark:text-gray-200">
          Website (Optional):
        </label>
        <input
          defaultValue="https://viagoevents.com/"
          className="h-12 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 px-4 outline-none text-sm focus:ring-2 focus:ring-primary transition-colors"
          aria-label="Website"
        />
      </div>
    </div>
  );
}
