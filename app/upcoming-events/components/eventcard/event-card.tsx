"use client";
import { useRouter } from "next/navigation";
import InfoRow from "../eventcard/info-row";
import Pill from "../eventcard/pill";
import TicketDialog from "../eventcard/ticket-dialog";
import SharePopover from "../eventcard/share-popover";
import { MapPin, Calendar, Users, Clock } from "lucide-react";

export default function EventCard({
  cta = "View Ticket",
  purchased,
}: {
  cta?: string;
  purchased?: boolean;
}) {
  const router = useRouter();

  // ✅ Navigate to /details when the card is clicked
  const handleCardClick = () => {
    router.push("/details");
  };

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
            alt="Event"
            className="h-[180px] sm:h-[200px] w-full sm:w-[220px] rounded-xl object-cover"
          />
          <span className="absolute right-3 top-3 rounded-full bg-muted px-3 py-[4px] sm:py-[6px] text-[10px] sm:text-xs shadow">
            {purchased ? "Purchased" : "$99.99"}
          </span>
        </div>

        {/* Event Info */}
        <div className="pr-1 sm:pr-2 mt-3 sm:mt-0">
          <div className="flex items-center justify-between">
            <p className="text-[10px] sm:text-xs text-foreground/60">
              Host By : Eric Gryzbowski
            </p>
            <button
              aria-label="favorite"
              onClick={(e) => e.stopPropagation()} // prevent navigation
            >
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Star%202-x7Lbp8OQCj3N5KoX4MIL7N7S5HVuEh.png"
                alt="star"
                className="h-4 w-4"
              />
            </button>
          </div>

          <h3 className="mt-1 text-base sm:text-xl font-semibold">
            Starry Nights Music Fest
          </h3>
          <p className="mt-1 text-[12px] sm:text-sm text-foreground/70">
            A magical evening under the stars with live bands, food stalls, and
            an electric crowd.
          </p>

          <InfoRow>
            <Pill>
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="text-[11px] sm:text-sm">California</span>
            </Pill>
            <Pill>
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="text-[11px] sm:text-sm">13 June 2025</span>
            </Pill>
            <Pill>
              <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="text-[11px] sm:text-sm">150 Audience</span>
            </Pill>
          </InfoRow>

          <InfoRow>
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="text-[11px] sm:text-sm">08:00 PM - 09:00 PM</span>
          </InfoRow>

          <div
            className="mt-3 sm:mt-4 flex items-center justify-between gap-3 sm:gap-4"
            onClick={(e) => e.stopPropagation()} // prevent nav when clicking buttons
          >
            <TicketDialog cta={cta} />
            <SharePopover />
          </div>
        </div>
      </div>
    </article>
  );
}

