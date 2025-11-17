"use client";

import { useState, useMemo } from "react";
import { Header } from "../../../components/header";
import { EventCard } from "../components/event-card";
import { Footer } from "../../../components/footer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 🗺️ All US Markets (States) with some major cities
const usMarkets: Record<
  string,
  {
    label: string;
    cities: string[];
  }
> = {
  alabama: {
    label: "Alabama",
    cities: ["Birmingham", "Montgomery", "Mobile", "Huntsville", "Tuscaloosa"],
  },
  alaska: {
    label: "Alaska",
    cities: ["Anchorage", "Fairbanks", "Juneau", "Sitka", "Ketchikan"],
  },
  arizona: {
    label: "Arizona",
    cities: ["Phoenix", "Tucson", "Mesa", "Scottsdale", "Tempe"],
  },
  arkansas: {
    label: "Arkansas",
    cities: [
      "Little Rock",
      "Fayetteville",
      "Fort Smith",
      "Springdale",
      "Jonesboro",
    ],
  },
  california: {
    label: "California",
    cities: [
      "Los Angeles",
      "San Diego",
      "San Francisco",
      "San Jose",
      "Sacramento",
    ],
  },
  colorado: {
    label: "Colorado",
    cities: ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Boulder"],
  },
  connecticut: {
    label: "Connecticut",
    cities: ["Bridgeport", "New Haven", "Hartford", "Stamford", "Waterbury"],
  },
  delaware: {
    label: "Delaware",
    cities: ["Wilmington", "Dover", "Newark", "Middletown", "Smyrna"],
  },
  florida: {
    label: "Florida",
    cities: ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale"],
  },
  georgia: {
    label: "Georgia",
    cities: ["Atlanta", "Savannah", "Augusta", "Columbus", "Macon"],
  },
  hawaii: {
    label: "Hawaii",
    cities: ["Honolulu", "Hilo", "Kailua", "Kaneohe", "Lahaina"],
  },
  idaho: {
    label: "Idaho",
    cities: ["Boise", "Idaho Falls", "Nampa", "Pocatello", "Meridian"],
  },
  illinois: {
    label: "Illinois",
    cities: ["Chicago", "Aurora", "Naperville", "Joliet", "Springfield"],
  },
  indiana: {
    label: "Indiana",
    cities: [
      "Indianapolis",
      "Fort Wayne",
      "Evansville",
      "South Bend",
      "Carmel",
    ],
  },
  iowa: {
    label: "Iowa",
    cities: [
      "Des Moines",
      "Cedar Rapids",
      "Davenport",
      "Sioux City",
      "Iowa City",
    ],
  },
  kansas: {
    label: "Kansas",
    cities: ["Wichita", "Overland Park", "Kansas City", "Topeka", "Olathe"],
  },
  kentucky: {
    label: "Kentucky",
    cities: [
      "Louisville",
      "Lexington",
      "Bowling Green",
      "Owensboro",
      "Covington",
    ],
  },
  louisiana: {
    label: "Louisiana",
    cities: [
      "New Orleans",
      "Baton Rouge",
      "Shreveport",
      "Lafayette",
      "Lake Charles",
    ],
  },
  maine: {
    label: "Maine",
    cities: ["Portland", "Bangor", "Lewiston", "South Portland", "Auburn"],
  },
  maryland: {
    label: "Maryland",
    cities: [
      "Baltimore",
      "Annapolis",
      "Rockville",
      "Silver Spring",
      "Frederick",
    ],
  },
  massachusetts: {
    label: "Massachusetts",
    cities: ["Boston", "Worcester", "Springfield", "Cambridge", "Lowell"],
  },
  michigan: {
    label: "Michigan",
    cities: ["Detroit", "Grand Rapids", "Ann Arbor", "Lansing", "Flint"],
  },
  minnesota: {
    label: "Minnesota",
    cities: ["Minneapolis", "Saint Paul", "Rochester", "Duluth", "Bloomington"],
  },
  mississippi: {
    label: "Mississippi",
    cities: ["Jackson", "Gulfport", "Biloxi", "Hattiesburg", "Southaven"],
  },
  missouri: {
    label: "Missouri",
    cities: [
      "St. Louis",
      "Kansas City",
      "Springfield",
      "Columbia",
      "Independence",
    ],
  },
  montana: {
    label: "Montana",
    cities: ["Billings", "Missoula", "Bozeman", "Great Falls", "Helena"],
  },
  nebraska: {
    label: "Nebraska",
    cities: ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney"],
  },
  nevada: {
    label: "Nevada",
    cities: ["Las Vegas", "Reno", "Henderson", "Carson City", "Sparks"],
  },
  "new-hampshire": {
    label: "New Hampshire",
    cities: ["Manchester", "Nashua", "Concord", "Dover", "Rochester"],
  },
  "new-jersey": {
    label: "New Jersey",
    cities: ["Newark", "Jersey City", "Paterson", "Elizabeth", "Trenton"],
  },
  "new-mexico": {
    label: "New Mexico",
    cities: ["Albuquerque", "Santa Fe", "Las Cruces", "Roswell", "Rio Rancho"],
  },
  "new-york": {
    label: "New York",
    cities: ["New York City", "Buffalo", "Rochester", "Albany", "Syracuse"],
  },
  "north-carolina": {
    label: "North Carolina",
    cities: ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem"],
  },
  "north-dakota": {
    label: "North Dakota",
    cities: ["Fargo", "Bismarck", "Grand Forks", "Minot", "West Fargo"],
  },
  ohio: {
    label: "Ohio",
    cities: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron"],
  },
  oklahoma: {
    label: "Oklahoma",
    cities: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Edmond"],
  },
  oregon: {
    label: "Oregon",
    cities: ["Portland", "Salem", "Eugene", "Gresham", "Beaverton"],
  },
  pennsylvania: {
    label: "Pennsylvania",
    cities: ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading"],
  },
  "rhode-island": {
    label: "Rhode Island",
    cities: [
      "Providence",
      "Warwick",
      "Cranston",
      "Pawtucket",
      "East Providence",
    ],
  },
  "south-carolina": {
    label: "South Carolina",
    cities: [
      "Charleston",
      "Columbia",
      "Greenville",
      "Myrtle Beach",
      "Spartanburg",
    ],
  },
  "south-dakota": {
    label: "South Dakota",
    cities: ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings", "Watertown"],
  },
  tennessee: {
    label: "Tennessee",
    cities: ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Clarksville"],
  },
  texas: {
    label: "Texas",
    cities: ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth"],
  },
  utah: {
    label: "Utah",
    cities: ["Salt Lake City", "Provo", "Ogden", "Sandy", "St. George"],
  },
  vermont: {
    label: "Vermont",
    cities: [
      "Burlington",
      "South Burlington",
      "Rutland",
      "Barre",
      "Montpelier",
    ],
  },
  virginia: {
    label: "Virginia",
    cities: [
      "Virginia Beach",
      "Norfolk",
      "Richmond",
      "Arlington",
      "Alexandria",
    ],
  },
  washington: {
    label: "Washington",
    cities: ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue"],
  },
  "west-virginia": {
    label: "West Virginia",
    cities: [
      "Charleston",
      "Huntington",
      "Morgantown",
      "Parkersburg",
      "Wheeling",
    ],
  },
  wisconsin: {
    label: "Wisconsin",
    cities: ["Milwaukee", "Madison", "Green Bay", "Kenosha", "Racine"],
  },
  wyoming: {
    label: "Wyoming",
    cities: ["Cheyenne", "Casper", "Laramie", "Gillette", "Rock Springs"],
  },
};

// Collect all cities (for when no market is selected)
const allCities = Array.from(
  new Set(
    Object.values(usMarkets)
      .map((m) => m.cities)
      .flat()
  )
);

// Helper arrays for dummy data
const statuses = ["training", "trips", "fun", "past"] as const;
const modes = ["online", "offline", "hybrid"] as const;
const priceTypes = ["Standard", "Early Bird", "VIP", "Premium"] as const;
const sampleHosts = [
  "Eric Gryzbowski",
  "Samantha Grey",
  "Dr. Amanda Cruz",
  "Michael Dean",
  "Alex Parker",
  "Jessica Miller",
];

// Generate dummy events across all states and cities
let globalEventId = 1;
const allEvents = Object.entries(usMarkets).flatMap(
  ([marketSlug, marketData]) =>
    marketData.cities.map((city, cityIndex) => {
      const status = statuses[(globalEventId + cityIndex) % statuses.length];
      const mode = modes[(globalEventId + cityIndex) % modes.length];
      const priceType =
        priceTypes[(globalEventId + cityIndex) % priceTypes.length];
      const host =
        sampleHosts[(globalEventId + cityIndex) % sampleHosts.length];

      // distribute price into ranges 20-150
      const basePrices = [29, 39, 49, 69, 79, 89, 119, 139];
      const numericPrice =
        basePrices[(globalEventId + cityIndex) % basePrices.length];

      const event = {
        id: globalEventId++,
        image:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6045dd738fe45e727c1239fb3a7b66f91989e5b5.png-k9TiGoVFNHSExbP7R1kalr7nZfx0gp.jpeg",
        host,
        title: `${marketData.label} ${city} Experience #${cityIndex + 1}`,
        description:
          "A powerful live experience combining learning, networking, and unforgettable moments.",
        location: city, // city
        market: marketData.label, // state name
        marketSlug, // for filtering
        date: "13 June 2025",
        audience: 100 + (cityIndex + 1) * 10,
        time: "08:00 PM - 09:00 PM",
        price: `$${numericPrice.toFixed(2)}`,
        status,
        mode,
        priceType,
      };

      return event;
    })
);

// Add a couple of custom highlighted events on top (optional)
allEvents.unshift(
  {
    id: 0,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6045dd738fe45e727c1239fb3a7b66f91989e5b5.png-k9TiGoVFNHSExbP7R1kalr7nZfx0gp.jpeg",
    host: "Eric Gryzbowski",
    title: "Starry Nights Music Fest",
    description:
      "A magical evening under the stars with live bands, food stalls, and an electric crowd.",
    location: "Los Angeles",
    market: "California",
    marketSlug: "california",
    date: "13 June 2025",
    audience: 150,
    time: "08:00 PM - 09:00 PM",
    price: "$99.99",
    status: "training",
    mode: "offline",
    priceType: "Standard",
  },
  {
    id: -1,
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6045dd738fe45e727c1239fb3a7b66f91989e5b5.png-k9TiGoVFNHSExbP7R1kalr7nZfx0gp.jpeg",
    host: "Samantha Grey",
    title: "Tech Future Virtual Expo",
    description: "Explore AI and blockchain innovations with top speakers.",
    location: "New York City",
    market: "New York",
    marketSlug: "new-york",
    date: "18 Nov 2025",
    audience: 300,
    time: "04:00 PM - 06:00 PM",
    price: "$49.00",
    status: "training",
    mode: "online",
    priceType: "Early Bird",
  }
);

type StatusFilter = "all" | "training" | "trips" | "fun" | "past";
type ModeFilter = "all" | "online" | "offline" | "hybrid";
type PriceRangeFilter = "all" | "20-50" | "60-100" | "110-150";

export function EventsPage() {
  const [filters, setFilters] = useState<{
    status: StatusFilter;
    market: string;
    location: string;
    priceRange: PriceRangeFilter;
    mode: ModeFilter;
  }>({
    status: "all",
    market: "all",
    location: "all",
    priceRange: "all",
    mode: "all",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6;

  // 🔁 Dynamic city options based on selected market
  const cityOptions =
    filters.market === "all"
      ? allCities
      : usMarkets[filters.market]?.cities || [];

  const filteredEvents = useMemo(() => {
    return allEvents.filter((event) => {
      const matchesStatus =
        filters.status === "all" ? true : event.status === filters.status;

      const matchesMarket =
        filters.market === "all" ? true : event.marketSlug === filters.market;

      const matchesLocation =
        filters.location === "all" ? true : event.location === filters.location;

      const matchesMode =
        filters.mode === "all" ? true : event.mode === filters.mode;

      // Price range filter
      const numericPrice = parseFloat(event.price.replace(/[^0-9.]/g, ""));

      let matchesPrice = true;
      if (filters.priceRange !== "all") {
        const [min, max] = filters.priceRange.split("-").map((n) => Number(n));
        matchesPrice = numericPrice >= min && numericPrice <= max;
      }

      return (
        matchesStatus &&
        matchesMarket &&
        matchesLocation &&
        matchesMode &&
        matchesPrice
      );
    });
  }, [filters]);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(
    indexOfFirstEvent,
    indexOfLastEvent
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#101010] text-black dark:text-gray-100 transition-colors duration-300">
      <Header />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-gray-900 dark:text-white">
          Events
        </h1>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {/* Event Status */}
          <Select
            value={filters.status}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                status: value as StatusFilter,
              }))
            }
          >
            <SelectTrigger className="bg-gray-50 dark:bg-[#181818] w-full rounded-full border border-gray-200 dark:border-gray-700 text-black dark:text-gray-200 font-semibold">
              <SelectValue placeholder="Event Status" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-[#1a1a1a] text-black dark:text-gray-100 border-gray-200 dark:border-gray-700">
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="training">Trainings</SelectItem>
              <SelectItem value="trips">Escapes</SelectItem>
              <SelectItem value="fun">Traincations</SelectItem>
              <SelectItem value="past">Excursions</SelectItem>
              <SelectItem value="past">Training Room Blocks</SelectItem>
            </SelectContent>
          </Select>

          {/* Market (State) */}
          <Select
            value={filters.market}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                market: value,
                location: "all", // reset city when market changes
              }))
            }
          >
            <SelectTrigger className="bg-gray-50 dark:bg-[#181818] w-full rounded-full border border-gray-200 dark:border-gray-700 text-black dark:text-gray-200 font-semibold">
              <SelectValue placeholder="Market (State)" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-[#1a1a1a] text-black dark:text-gray-100 border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto">
              <SelectItem value="all">All Markets</SelectItem>
              {Object.entries(usMarkets).map(([slug, market]) => (
                <SelectItem key={slug} value={slug}>
                  {market.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Location (City) */}
          <Select
            value={filters.location}
            onValueChange={(value) =>
              setFilters((prev) => ({ ...prev, location: value }))
            }
          >
            <SelectTrigger className="bg-gray-50 dark:bg-[#181818] w-full rounded-full border border-gray-200 dark:border-gray-700 text-black dark:text-gray-200 font-semibold">
              <SelectValue placeholder="Location (City)" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-[#1a1a1a] text-black dark:text-gray-100 border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto">
              <SelectItem value="all">All Cities</SelectItem>
              {cityOptions.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Price Range */}
          <Select
            value={filters.priceRange}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                priceRange: value as PriceRangeFilter,
              }))
            }
          >
            <SelectTrigger className="bg-gray-50 dark:bg-[#181818] w-full rounded-full border border-gray-200 dark:border-gray-700 text-black dark:text-gray-200 font-semibold">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-[#1a1a1a] text-black dark:text-gray-100 border-gray-200 dark:border-gray-700">
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="20-50">$20 - $50</SelectItem>
              <SelectItem value="60-100">$60 - $100</SelectItem>
              <SelectItem value="110-150">$110 - $150</SelectItem>
            </SelectContent>
          </Select>

          {/* Mode */}
          <Select
            value={filters.mode}
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                mode: value as ModeFilter,
              }))
            }
          >
            <SelectTrigger className="bg-gray-50 dark:bg-[#181818] w-full rounded-full border border-gray-200 dark:border-gray-700 text-black dark:text-gray-200 font-semibold">
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-[#1a1a1a] text-black dark:text-gray-100 border-gray-200 dark:border-gray-700">
              <SelectItem value="all">All Modes</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {currentEvents.length > 0 ? (
            currentEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 col-span-full py-10">
              No events found for the selected filters.
            </p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-4">
          {/* Previous */}
          <Button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`w-24 h-10 text-sm sm:text-base rounded-md transition-colors ${
              currentPage === 1
                ? "bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-[#0066FF] hover:bg-[#0052CC] text-white"
            }`}
          >
            Previous
          </Button>

          {/* Dynamic Pagination */}
          {(() => {
            const pages: (number | string)[] = [];
            const totalNumbersToShow = 3; // how many pages near current

            // Always show page 1
            pages.push(1);

            // Show left ellipsis if needed
            if (currentPage > totalNumbersToShow + 2) {
              pages.push("...");
            }

            // Middle pages
            const start = Math.max(2, currentPage - totalNumbersToShow);
            const end = Math.min(
              totalPages - 1,
              currentPage + totalNumbersToShow
            );

            for (let i = start; i <= end; i++) {
              pages.push(i);
            }

            // Show right ellipsis if needed
            if (currentPage < totalPages - (totalNumbersToShow + 1)) {
              pages.push("...");
            }

            // Always show last page (if more than 1)
            if (totalPages > 1) {
              pages.push(totalPages);
            }

            return pages.map((p, index) => {
              if (p === "...") {
                return (
                  <span
                    key={index}
                    className="px-2 text-gray-500 dark:text-gray-400"
                  >
                    ...
                  </span>
                );
              }

              return (
                <Button
                  key={index}
                  onClick={() => handlePageChange(p as number)}
                  variant={currentPage === p ? "default" : "ghost"}
                  size="icon"
                  className={`w-10 h-10 rounded-md transition-colors ${
                    currentPage === p
                      ? "bg-[#0066FF] text-white hover:bg-[#0052CC]"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {p}
                </Button>
              );
            });
          })()}

          {/* Next */}
          <Button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`w-24 h-10 text-sm sm:text-base rounded-md transition-colors ${
              currentPage === totalPages
                ? "bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
                : "bg-[#0066FF] hover:bg-[#0052CC] text-white"
            }`}
          >
            Next
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// "use client";

// import { useState, useMemo } from "react";
// import { Header } from "../../../components/header";
// import { EventCard } from "../components/event-card";
// import { Footer } from "../../../components/footer";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const allEvents = [
//   {
//     id: 1,
//     image:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6045dd738fe45e727c1239fb3a7b66f91989e5b5.png-k9TiGoVFNHSExbP7R1kalr7nZfx0gp.jpeg",
//     host: "Eric Gryzbowski",
//     title: "Starry Nights Music Fest",
//     description:
//       "A magical evening under the stars with live bands, food stalls, and an electric crowd that will amaze.",
//     location: "california",
//     date: "13 June 2025",
//     audience: 150,
//     time: "08:00 PM - 09:00 PM",
//     price: "$99.99",
//     status: "training",
//     mode: "offline",
//     priceType: "paid",
//   },
//   {
//     id: 2,
//     image:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6045dd738fe45e727c1239fb3a7b66f91989e5b5.png-k9TiGoVFNHSExbP7R1kalr7nZfx0gp.jpeg",
//     host: "Samantha Grey",
//     title: "Live Rock Bash",
//     description: "Join the biggest rock event in Texas!",
//     location: "texas",
//     date: "25 Oct 2025",
//     audience: 400,
//     time: "07:00 PM - 10:00 PM",
//     price: "$99.99",
//     status: "fun",
//     mode: "offline",
//     priceType: "paid",
//   },
//   {
//     id: 3,
//     image:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6045dd738fe45e727c1239fb3a7b66f91989e5b5.png-k9TiGoVFNHSExbP7R1kalr7nZfx0gp.jpeg",
//     host: "Dr. Amanda Cruz",
//     title: "Online Business Growth Summit",
//     description:
//       "Learn the secrets of scaling your business from experts worldwide.",
//     location: "new-york",
//     date: "21 Oct 2025",
//     audience: 1200,
//     time: "05:00 PM - 07:00 PM",
//     price: "$49.00",
//     status: "training",
//     mode: "online",
//     priceType: "paid",
//   },
//   {
//     id: 4,
//     image:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6045dd738fe45e727c1239fb3a7b66f91989e5b5.png-k9TiGoVFNHSExbP7R1kalr7nZfx0gp.jpeg",
//     host: "Michael Dean",
//     title: "Downtown Jazz Festival",
//     description: "An elegant evening of jazz music and cultural performances.",
//     location: "california",
//     date: "10 May 2025",
//     audience: 200,
//     time: "06:00 PM - 08:00 PM",
//     price: "$79.00",
//     status: "trips",
//     mode: "offline",
//     priceType: "paid",
//   },
//   {
//     id: 5,
//     image:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6045dd738fe45e727c1239fb3a7b66f91989e5b5.png-k9TiGoVFNHSExbP7R1kalr7nZfx0gp.jpeg",
//     host: "Alex Parker",
//     title: "Tech Future Virtual Expo",
//     description: "Explore AI and blockchain innovations with top speakers.",
//     location: "texas",
//     date: "18 Nov 2025",
//     audience: 300,
//     time: "04:00 PM - 06:00 PM",
//     price: "$99.99",
//     status: "training",
//     mode: "online",
//     priceType: "paid",
//   },
//   {
//     id: 6,
//     image:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6045dd738fe45e727c1239fb3a7b66f91989e5b5.png-k9TiGoVFNHSExbP7R1kalr7nZfx0gp.jpeg",
//     host: "Jessica Miller",
//     title: "Startup Networking Meetup",
//     description:
//       "A casual offline meetup for founders, investors, and developers.",
//     location: "new-york",
//     date: "14 Oct 2025",
//     audience: 80,
//     time: "03:00 PM - 05:00 PM",
//     price: "$29.00",
//     status: "trips",
//     mode: "hybrid",
//     priceType: "paid",
//   },
//   ...Array.from({ length: 9 }, (_, i) => ({
//     id: i + 7,
//     image:
//       "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6045dd738fe45e727c1239fb3a7b66f91989e5b5.png-k9TiGoVFNHSExbP7R1kalr7nZfx0gp.jpeg",
//     host: "Eric Gryzbowski",
//     title: `Music Event #${i + 7}`,
//     description:
//       "A magical evening under the stars with live bands, food stalls, and an electric crowd that will amaze.",
//     location: i % 2 === 0 ? "texas" : "california",
//     date: "13 June 2025",
//     audience: 150,
//     time: "08:00 PM - 09:00 PM",
//     price: "$99.99",
//     status: i % 3 === 0 ? "fun" : "past",
//     mode: i % 2 === 0 ? "online" : "offline",
//     priceType: "paid",
//   })),
// ];

// export function EventsPage() {
//   const [filters, setFilters] = useState({
//     status: "all",
//     location: "all",
//     price: "all",
//     mode: "all",
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const eventsPerPage = 6;

//   const filteredEvents = useMemo(() => {
//     return allEvents.filter((event) => {
//       const matchStatus =
//         filters.status === "all" ? true : event.status === filters.status;
//       const matchLocation =
//         filters.location === "all" ? true : event.location === filters.location;
//       const matchPrice =
//         filters.price === "all" ? true : event.priceType === filters.price;
//       const matchMode =
//         filters.mode === "all" ? true : event.mode === filters.mode;

//       return matchStatus && matchLocation && matchPrice && matchMode;
//     });
//   }, [filters]);

//   const indexOfLastEvent = currentPage * eventsPerPage;
//   const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
//   const currentEvents = filteredEvents.slice(
//     indexOfFirstEvent,
//     indexOfLastEvent
//   );
//   const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleNext = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage((prev) => prev + 1);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   const handlePrev = () => {
//     if (currentPage > 1) {
//       setCurrentPage((prev) => prev - 1);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-white dark:bg-[#101010] text-black dark:text-gray-100 transition-colors duration-300">
//       <Header />

//       <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 md:px-8 py-6 sm:py-8">
//         <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-gray-900 dark:text-white">
//           Events
//         </h1>

//         {/* Filters */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
//           {/* Event Status */}
//           <Select
//             value={filters.status}
//             onValueChange={(value) =>
//               setFilters((prev) => ({ ...prev, status: value }))
//             }
//           >
//             <SelectTrigger className="bg-gray-50 dark:bg-[#181818] w-full rounded-full border border-gray-200 dark:border-gray-700 text-black dark:text-gray-200 font-semibold">
//               <SelectValue placeholder="Event Status" />
//             </SelectTrigger>
//             <SelectContent className="bg-white dark:bg-[#1a1a1a] text-black dark:text-gray-100 border-gray-200 dark:border-gray-700">
//               <SelectItem value="all">All Events</SelectItem>
//               <SelectItem value="training">Training Events</SelectItem>
//               <SelectItem value="trips">Trips</SelectItem>
//               <SelectItem value="fun">Fun Events</SelectItem>
//             </SelectContent>
//           </Select>

//           {/* Location */}
//           <Select
//             value={filters.location}
//             onValueChange={(value) =>
//               setFilters((prev) => ({ ...prev, location: value }))
//             }
//           >
//             <SelectTrigger className="bg-gray-50 dark:bg-[#181818] w-full rounded-full border border-gray-200 dark:border-gray-700 text-black dark:text-gray-200 font-semibold">
//               <SelectValue placeholder="Location" />
//             </SelectTrigger>
//             <SelectContent className="bg-white dark:bg-[#1a1a1a] text-black dark:text-gray-100 border-gray-200 dark:border-gray-700">
//               <SelectItem value="all">Locations</SelectItem>
//               <SelectItem value="california">California</SelectItem>
//               <SelectItem value="new-york">New York</SelectItem>
//               <SelectItem value="texas">Texas</SelectItem>
//             </SelectContent>
//           </Select>

//           {/* Price */}
//           <Select
//             value={filters.price}
//             onValueChange={(value) =>
//               setFilters((prev) => ({ ...prev, price: value }))
//             }
//           >
//             <SelectTrigger className="bg-gray-50 dark:bg-[#181818] w-full rounded-full border border-gray-200 dark:border-gray-700 text-black dark:text-gray-200 font-semibold">
//               <SelectValue placeholder="Price" />
//             </SelectTrigger>
//             <SelectContent className="bg-white dark:bg-[#1a1a1a] text-black dark:text-gray-100 border-gray-200 dark:border-gray-700">
//               <SelectItem value="all">Prices</SelectItem>
//               <SelectItem value="free">Free</SelectItem>
//               <SelectItem value="paid">Paid</SelectItem>
//             </SelectContent>
//           </Select>

//           {/* Mode */}
//           <Select
//             value={filters.mode}
//             onValueChange={(value) =>
//               setFilters((prev) => ({ ...prev, mode: value }))
//             }
//           >
//             <SelectTrigger className="bg-gray-50 dark:bg-[#181818] w-full rounded-full border border-gray-200 dark:border-gray-700 text-black dark:text-gray-200 font-semibold">
//               <SelectValue placeholder="Mode" />
//             </SelectTrigger>
//             <SelectContent className="bg-white dark:bg-[#1a1a1a] text-black dark:text-gray-100 border-gray-200 dark:border-gray-700">
//               <SelectItem value="all">Mode</SelectItem>
//               <SelectItem value="online">Online</SelectItem>
//               <SelectItem value="offline">Offline</SelectItem>
//               <SelectItem value="hybrid">Hybrid</SelectItem>
//             </SelectContent>
//           </Select>
//         </div>

//         {/* Event Cards Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
//           {currentEvents.length > 0 ? (
//             currentEvents.map((event) => (
//               <EventCard key={event.id} event={event} />
//             ))
//           ) : (
//             <p className="text-center text-gray-500 dark:text-gray-400 col-span-full py-10">
//               No events found for the selected filters.
//             </p>
//           )}
//         </div>

//         {/* Pagination */}
//         <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mt-4">
//           <Button
//             onClick={handlePrev}
//             disabled={currentPage === 1}
//             className={`w-24 h-10 text-sm sm:text-base rounded-md transition-colors ${
//               currentPage === 1
//                 ? "bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
//                 : "bg-[#0066FF] hover:bg-[#0052CC] text-white"
//             }`}
//           >
//             Previous
//           </Button>

//           {Array.from({ length: totalPages }, (_, index) => (
//             <Button
//               key={index}
//               onClick={() => handlePageChange(index + 1)}
//               variant={currentPage === index + 1 ? "default" : "ghost"}
//               size="icon"
//               className={`w-10 h-10 rounded-md transition-colors ${
//                 currentPage === index + 1
//                   ? "bg-[#0066FF] text-white hover:bg-[#0052CC]"
//                   : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
//               }`}
//             >
//               {index + 1}
//             </Button>
//           ))}

//           <Button
//             onClick={handleNext}
//             disabled={currentPage === totalPages}
//             className={`w-24 h-10 text-sm sm:text-base rounded-md transition-colors ${
//               currentPage === totalPages
//                 ? "bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed"
//                 : "bg-[#0066FF] hover:bg-[#0052CC] text-white"
//             }`}
//           >
//             Next
//           </Button>
//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }
