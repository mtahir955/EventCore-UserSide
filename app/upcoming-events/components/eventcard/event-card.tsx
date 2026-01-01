"use client";
import { useRouter } from "next/navigation";
import InfoRow from "../eventcard/info-row";
import Pill from "../eventcard/pill";
import TicketDialog from "../eventcard/ticket-dialog";
import SharePopover from "../eventcard/share-popover";
import { MapPin, Calendar, Users, Clock } from "lucide-react";

export interface EventType {
  id: number;
  title: string;
  type: "in-person" | "virtual";
  date: number;
  location: string;
  description?: string;
  audience?: number;
  time?: string;
  purchased?: boolean;
  cta?: string;
}

export default function EventCard({
  event,
  cta = "View Ticket",
  purchased,
}: {
  event: EventType;
  cta?: string;
  purchased?: boolean;
}) {
  const router = useRouter();

  const handleCardClick = () => router.push("/details");
  const handleCTAClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cta === "Join Event") router.push("/check-out");
  };

  // ✅ Format date (for readability)
  const monthName = new Date(2025, new Date().getMonth(), 1).toLocaleString(
    "default",
    { month: "long" }
  );
  const formattedDate = `${event.date} ${monthName} 2025`;

  return (
    <article
      onClick={handleCardClick}
      className="rounded-2xl border bg-card p-3 sm:p-4 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
    >
      <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-3 sm:gap-4 items-center">
        {/* Image + Status */}
        <div className="relative w-full sm:w-auto">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rectangle%2034628257%20%283%29-ATpyQmMccIZZ2rjDpou9xj3PV81VU4.png"
            alt={event.title}
            className="h-[180px] sm:h-[200px] w-full sm:w-[220px] rounded-xl object-cover"
          />
          <span className="absolute right-3 top-3 rounded-full bg-muted px-3 py-[4px] sm:py-[6px] text-[10px] sm:text-xs shadow">
            {purchased ? "Purchased" : "$99.99"}
          </span>
        </div>

        {/* Event Info */}
        <div className="pr-1 sm:pr-2 mt-3 sm:mt-0">
          <div className="flex items-center justify-between">
          </div>

          <h3 className="mt-1 text-base sm:text-xl font-semibold">
            {event.title}
          </h3>

          <p className="mt-1 text-[12px] sm:text-sm text-foreground/70 line-clamp-2">
            {event.description ||
              "Join this amazing event to connect, learn, and have fun!"}
          </p>

          <InfoRow>
            <Pill>
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="text-[11px] sm:text-sm">{event.location}</span>
            </Pill>
            <Pill>
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="text-[11px] sm:text-sm">{formattedDate}</span>
            </Pill>
            
          </InfoRow>

          <InfoRow>
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="text-[11px] sm:text-sm">
              {event.time || "08:00 PM - 09:00 PM"}
            </span>
          </InfoRow>

          <div
            className="mt-3 sm:mt-4 flex items-center justify-between gap-3 sm:gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {cta === "Join Event" ? (
              <button
                onClick={handleCTAClick}
                className="w-full py-3 rounded-lg bg-[#0077F7] text-white font-medium text-sm hover:bg-[#0b7df7] transition"
              >
                Join Event
              </button>
            ) : (
              <TicketDialog cta={cta} />
            )
            }
            {/* <SharePopover /> */}
          </div>
        </div>
      </div>
    </article>
  );
}

// "use client";
// import { useRouter } from "next/navigation";
// import InfoRow from "../eventcard/info-row";
// import Pill from "../eventcard/pill";
// import TicketDialog from "../eventcard/ticket-dialog";
// import SharePopover from "../eventcard/share-popover";
// import { MapPin, Calendar, Users, Clock } from "lucide-react";

// interface EventData {
//   id: number;
//   title: string;
//   type: "in-person" | "virtual";
//   date: number;
//   location: string;
//   description?: string;
//   audience?: number;
//   time?: string;
// }

// export default function EventCard({
//   event = {
//     id: 0,
//     title: "Untitled Event",
//     type: "in-person",
//     date: 0,
//     location: "Unknown",
//     description: "",
//     audience: 0,
//     time: "",
//   },
//   cta = "View Ticket",
//   purchased,
// }: {
//   event?: {
//     id: number;
//     title: string;
//     type: "in-person" | "virtual";
//     date: number;
//     location: string;
//     description?: string;
//     audience?: number;
//     time?: string;
//   };
//   cta?: string;
//   purchased?: boolean;
// }) {
//   const router = useRouter();

//   // ✅ Navigate to details page
//   const handleCardClick = () => {
//     router.push("/details");
//   };

//   const handleCTAClick = (e: React.MouseEvent) => {
//     e.stopPropagation();
//     if (cta === "Join Event") {
//       router.push("/check-out");
//     }
//   };

//   return (
//     <article
//       onClick={handleCardClick}
//       className="rounded-2xl border bg-card p-3 sm:p-4 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.01]"
//     >
//       <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-3 sm:gap-4 items-center">
//         {/* Event Image */}
//         <div className="relative w-full sm:w-auto">
//           <img
//             src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rectangle%2034628257%20%283%29-ATpyQmMccIZZ2rjDpou9xj3PV81VU4.png"
//             alt={event.title}
//             className="h-[180px] sm:h-[200px] w-full sm:w-[220px] rounded-xl object-cover"
//           />
//           <span className="absolute right-3 top-3 rounded-full bg-muted px-3 py-[4px] sm:py-[6px] text-[10px] sm:text-xs shadow">
//             {purchased ? "Purchased" : "$99.99"}
//           </span>
//         </div>

//         {/* Event Info */}
//         <div className="pr-1 sm:pr-2 mt-3 sm:mt-0">
//           <div className="flex items-center justify-between">
//             <p className="text-[10px] sm:text-xs text-foreground/60">
//               Host By : Event Organizer
//             </p>
//             <button onClick={(e) => e.stopPropagation()}>
//               <img
//                 src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Star%202-x7Lbp8OQCj3N5KoX4MIL7N7S5HVuEh.png"
//                 alt="star"
//                 className="h-4 w-4"
//               />
//             </button>
//           </div>

//           <h3 className="mt-1 text-base sm:text-xl font-semibold">
//             {event.title}
//           </h3>
//           <p className="mt-1 text-[12px] sm:text-sm text-foreground/70">
//             {event.description ??
//               "Join us for an amazing experience at this exclusive event."}
//           </p>

//           <InfoRow>
//             <Pill>
//               <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
//               <span className="text-[11px] sm:text-sm">{event.location}</span>
//             </Pill>
//             <Pill>
//               <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
//               <span className="text-[11px] sm:text-sm">
//                 {`${event.date} June 2025`}
//               </span>
//             </Pill>
//             <Pill>
//               <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
//               <span className="text-[11px] sm:text-sm">
//                 {event.audience ?? 150} Audience
//               </span>
//             </Pill>
//           </InfoRow>

//           <InfoRow>
//             <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
//             <span className="text-[11px] sm:text-sm">
//               {event.time ?? "08:00 PM - 09:00 PM"}
//             </span>
//           </InfoRow>

//           <div
//             className="mt-3 sm:mt-4 flex items-center justify-between gap-3 sm:gap-4"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {cta === "Join Event" ? (
//               <button
//                 onClick={handleCTAClick}
//                 className="w-full py-3 rounded-lg bg-[#0077F7] text-white font-medium text-sm hover:bg-[#0b7df7] transition"
//               >
//                 Join Event
//               </button>
//             ) : (
//               <TicketDialog cta={cta} />
//             )}
//             <SharePopover />
//           </div>
//         </div>
//       </div>
//     </article>
//   );
// }
