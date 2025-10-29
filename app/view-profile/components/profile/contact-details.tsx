import Image from "next/image";

export default function ContactDetails() {
  const data = {
    phone: "+1 125-559-8852",
    city: "California",
    pincode: "78680",
    address: "245 Event Street, Downtown Cityview, NY 10016, USA",
    website: "https://viagoevents.com/",
  };

  return (
    <div className="space-y-6 transition-colors duration-300 text-gray-900 dark:text-gray-100">
      {/* Phone / City / Pincode */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {/* Phone Number */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            Phone Number:
          </label>
          <div className="flex h-12 items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#181818] px-3">
            <Image
              src="/images/flag-us.png"
              width={20}
              height={20}
              alt="US flag"
              className="rounded-sm"
            />
            <span className="text-sm font-medium">{data.phone}</span>
          </div>
        </div>

        {/* City */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            City/Town:
          </label>
          <div className="h-12 flex items-center rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#181818] px-4 text-sm font-medium">
            {data.city}
          </div>
        </div>

        {/* Pincode */}
        <div className="space-y-2">
          <label className="text-sm text-gray-700 dark:text-gray-200">
            Pincode:
          </label>
          <div className="h-12 flex items-center rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#181818] px-4 text-sm font-medium">
            {data.pincode}
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <label className="text-sm text-gray-700 dark:text-gray-200">
          Address:
        </label>
        <div className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#181818] p-4 text-sm font-medium leading-relaxed">
          {data.address}
        </div>
      </div>

      {/* Website */}
      <div className="space-y-2">
        <label className="text-sm text-gray-700 dark:text-gray-200">
          Website (Optional):
        </label>
        <div className="h-12 flex items-center rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#181818] px-4 text-sm font-medium break-words">
          <a
            href={data.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {data.website}
          </a>
        </div>
      </div>
    </div>
  );
}
