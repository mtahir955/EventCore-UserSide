"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

export default function SharePopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="inline-flex h-8 sm:h-10 w-10 sm:w-12 items-center justify-center rounded-full border text-lg sm:text-xl"
          aria-label="More options"
        >
          {"•••"}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        side="top"
        sideOffset={8}
        className="p-0 w-[200px] sm:w-[239px] h-[150px] sm:h-[168px] rounded-xl border shadow-lg overflow-hidden bg-background"
      >
        <ul className="h-full text-[13px] sm:text-[15px]">
          <li>
            <button className="w-full h-[45px] sm:h-[56px] px-3 sm:px-4 text-left flex items-center bg-primary/10">
              Remove from calendar
            </button>
          </li>

          <li>
            <Dialog>
              <DialogTrigger asChild>
                <button className="w-full h-[45px] sm:h-[56px] px-3 sm:px-4 text-left flex items-center hover:bg-primary/10 transition">
                  Share with friends
                </button>
              </DialogTrigger>

              <DialogContent
                aria-describedby={undefined}
                className="p-0 rounded-2xl border-0 shadow-2xl"
                style={{
                  width: "90%",
                  maxWidth: 480,
                  height: "auto",
                  background: "#FFFFFF",
                }}
              >
                {/* Header */}
                <div className="relative py-4 sm:py-5">
                  <DialogTitle className="sr-only">
                    Share with friends
                  </DialogTitle>
                  <div className="flex items-center justify-center">
                    <h2 className="text-lg sm:text-2xl font-semibold text-black">
                      Share with friends
                    </h2>
                  </div>
                  <DialogClose asChild>
                    <button
                      aria-label="Close share modal"
                      className="absolute right-3 top-3 sm:right-4 sm:top-4 h-6 sm:h-8 w-6 sm:w-8 flex items-center justify-center"
                    >
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Close%20button-J27RdFO6C4MxBhIxZY1nsyZ6C3HTmi.png"
                        alt="Close"
                        className="h-4 sm:h-6 w-4 sm:w-6"
                      />
                    </button>
                  </DialogClose>
                </div>

                {/* Image Preview */}
                <div className="px-3 sm:px-5">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rectangle%2034628257%20%284%29-nTCTbf41OfiBuRyVLG0fsdyKa62Gw0.png"
                    alt="Event preview"
                    className="h-[140px] sm:h-[184px] w-full rounded-[12px] object-cover"
                  />
                </div>

                {/* Social Icons */}
                <div className="mt-2 sm:mt-3 flex items-center justify-center gap-3 sm:gap-4">
                  {[
                    "logos_facebook-Jtw5MId1zN6F2CaO7jdeBLZnsp1Tfo.png",
                    "devicon_twitter-XIKmcJqnv48zaeoNmUGkIwXCyqTUUL.png",
                    "logos_whatsapp-icon-42dAiekQtKgMVQ4IshlAJYT8fk1Tzj.png",
                    "devicon_linkedin-M4x4xBEND56ARk8e2Pf80IJKHrpm8C.png",
                  ].map((icon, i) => (
                    <span
                      key={i}
                      className="h-[35px] sm:h-[45px] w-[35px] sm:w-[45px] rounded-full grid place-items-center bg-[#F9FAFB]"
                    >
                      <img
                        src={`https://hebbkx1anhila5yf.public.blob.vercel-storage.com/${icon}`}
                        alt="social"
                        className="h-[18px] sm:h-[25px] w-[18px] sm:w-[25px] object-contain"
                      />
                    </span>
                  ))}
                </div>

                {/* URL Field */}
                <div className="px-3 sm:px-5 pt-2 sm:pt-3 pb-4">
                  <div className="rounded-[12px] p-3 sm:p-4 bg-[#F9FAFB]">
                    <div className="text-xs sm:text-sm font-medium text-black mb-1">
                      Event URL
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] sm:text-[14px] text-black/70 truncate">
                        https://www.myevent.com/event-name
                      </div>
                      <button
                        aria-label="Copy event URL"
                        className="ml-2 sm:ml-3 h-8 sm:h-9 w-8 sm:w-9 rounded-full flex items-center justify-center bg-white"
                        onClick={() =>
                          navigator.clipboard.writeText(
                            "https://www.myevent.com/event-name"
                          )
                        }
                      >
                        <img
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Copy%20icon-dBRhBr2ZrSz1ZI6i77Au5Y9JjqFhY4.png"
                          alt="Copy"
                          className="h-[14px] sm:h-[18px] w-[14px] sm:w-[18px]"
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </li>

          <li>
            <button className="w-full h-[45px] sm:h-[56px] px-3 sm:px-4 text-left flex items-center hover:bg-primary/10 transition">
              Set reminders
            </button>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}

