// import { Search, MapPin, Calendar } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// export function SearchSection() {
//   return (
//     <section className="w-full bg-white dark:bg-[#101010] py-8 transition-colors duration-300">
//       <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
//         <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-gray-50 dark:bg-[#1A1A1A] rounded-xl shadow-lg p-4 transition-colors duration-300">
//           {/* Search events */}
//           <div className="flex-1 px-0 md:px-4 py-2 md:py-3 border-b md:border-b-0 md:border-r border-gray-200 dark:border-[#2A2A2A] transition-colors duration-300">
//             <div className="relative bg-white dark:bg-[#101010] rounded-lg md:rounded-none transition-colors duration-300">
//               <Input
//                 type="text"
//                 placeholder="Search events"
//                 className="w-full pr-10 border-0 bg-transparent text-base text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-300" />
//             </div>
//           </div>

//           {/* Select Location */}
//           <div className="flex-1 px-0 md:px-4 py-2 md:py-3 border-b md:border-b-0 md:border-r border-gray-200 dark:border-[#2A2A2A] transition-colors duration-300">
//             <div className="relative bg-white dark:bg-[#101010] rounded-lg md:rounded-none transition-colors duration-300">
//               <Input
//                 type="text"
//                 placeholder="Select Location"
//                 className="w-full pr-10 border-0 bg-transparent text-base text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-300" />
//             </div>
//           </div>

//           {/* Select Date */}
//           <div className="flex-1 px-0 md:px-4 py-2 md:py-3 border-b md:border-b-0 border-gray-200 dark:border-[#2A2A2A] transition-colors duration-300">
//             <div className="relative bg-white dark:bg-[#101010] rounded-lg md:rounded-none transition-colors duration-300">
//               <Input
//                 type="text"
//                 placeholder="Select Date"
//                 className="w-full pr-10 border-0 bg-transparent text-base text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0"
//               />
//               <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-300" />
//             </div>
//           </div>

//           {/* Search button */}
//           <div className="w-full md:w-auto pt-2 md:pt-0">
//             <Button className="w-full md:w-auto bg-[#0077F7] hover:bg-[#0066D6] text-white px-12 py-4 md:py-6 text-base rounded-lg font-medium transition-colors">
//               Search
//             </Button>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

"use client";

import { useState } from "react";
import { Search, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { format } from "date-fns";

export function SearchSection({
  onSearch,
}: {
  onSearch: (query: { eventName: string; location: string; date: string | null }) => void;
}) {
  const [eventName, setEventName] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showLocations, setShowLocations] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const locations = [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Miami",
    "San Francisco",
    "Las Vegas",
    "Seattle",
  ];

  const handleSearch = () => {
    onSearch({
      eventName,
      location: selectedLocation,
      date: selectedDate ? format(selectedDate, "PPP") : null,
    });
  };

  return (
    <section className="w-full bg-white dark:bg-[#101010] py-8 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-gray-50 dark:bg-[#1A1A1A] rounded-xl shadow-lg p-4 transition-colors duration-300">

          {/* Search Event */}
          <div className="flex-1 px-0 md:px-4 py-2 md:py-3 border-b md:border-b-0 md:border-r border-gray-200 dark:border-[#2A2A2A] transition-colors duration-300">
            <div className="relative bg-white dark:bg-[#101010] rounded-lg md:rounded-none transition-colors duration-300">
              <Input
                type="text"
                placeholder="Search events"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="w-full pr-10 border-0 bg-transparent text-base text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:ring-0"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-300" />
            </div>
          </div>

          {/* Select Location */}
          <div className="flex-1 relative px-0 md:px-4 py-2 md:py-3 border-b md:border-b-0 md:border-r border-gray-200 dark:border-[#2A2A2A]">
            <div
              className="relative bg-white dark:bg-[#101010] rounded-lg md:rounded-none cursor-pointer"
              onClick={() => setShowLocations(!showLocations)}
            >
              <Input
                readOnly
                value={selectedLocation}
                placeholder="Select Location"
                className="w-full pr-10 border-0 bg-transparent text-base text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 cursor-pointer"
              />
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-300" />
            </div>

            {showLocations && (
              <ul className="absolute z-10 mt-2 w-full bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#2A2A2A] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                {locations.map((loc) => (
                  <li
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setShowLocations(false);
                    }}
                    className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#2A2A2A] cursor-pointer transition"
                  >
                    {loc}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Select Date */}
          <div className="flex-1 px-0 md:px-4 py-2 md:py-3 border-b md:border-b-0 border-gray-200 dark:border-[#2A2A2A]">
            <Popover>
              <PopoverTrigger asChild>
                <div className="relative bg-white dark:bg-[#101010] rounded-lg md:rounded-none cursor-pointer">
                  <Input
                    readOnly
                    value={selectedDate ? format(selectedDate, "PPP") : ""}
                    placeholder="Select Date"
                    className="w-full pr-10 border-0 bg-transparent text-base text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 cursor-pointer"
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-300" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-0 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-[#2A2A2A] rounded-xl">
                <DatePicker
                  mode="single"
                  selected={selectedDate || undefined}
                  onSelect={setSelectedDate}
                  className="rounded-md"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Search Button */}
          <div className="w-full md:w-auto pt-2 md:pt-0">
            <Button
              onClick={handleSearch}
              className="w-full md:w-auto bg-[#0077F7] hover:bg-[#0066D6] text-white px-12 py-4 md:py-6 text-base rounded-lg font-medium transition-colors"
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

