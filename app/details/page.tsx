"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, Calendar, Users, Clock } from "lucide-react";
import { Header } from "../../components/header";
import { CountdownTimer } from "../details/components/countdown-timer";
import { ExploreEvents } from "../details/components/explore-events";
import { Footer } from "../../components/footer";
import { CalendarModal } from "../details/components/calendar-modal";
import { Button } from "@/components/ui/button";

export default function EventDetailPage() {
  const eventDate = new Date("2025-06-13T20:00:00");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-[#101010] text-black dark:text-white transition-colors duration-300">
      <Header />

      <main>
        {/* Hero Section with Countdown */}
        <section className="relative max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 py-6 md:py-8">
          <div className="relative h-[220px] sm:h-[300px] md:h-[400px] rounded-2xl overflow-hidden">
            <Image
              src="/images/hero-image.png"
              alt="Starry Nights Music Fest"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
              <CountdownTimer targetDate={eventDate} />
            </div>
          </div>
        </section>

        {/* Event Details Section */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 py-6 md:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Event Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                  Starry Nights Music Fest
                </h1>

                <div className="space-y-4">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Date and Time
                  </h2>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">California</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">150 Audience</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">13 June 2025</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-sm sm:text-base">
                        08:00 PM - 09:00 PM
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={() => setIsCalendarOpen(true)}
                    className="bg-[#0077F7] hover:bg-[#0066D6] text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-light"
                  >
                    + Add to Calendar
                  </Button>
                </div>
              </div>

              {/* Event Description */}
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
                  Event Description
                </h2>
                <div className="space-y-3 sm:space-y-4 text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    Get ready to kick off the Christmas season in Mumbai with
                    SOUND OF CHRISTMAS - your favourite LIVE Christmas concert!
                  </p>
                  <p>
                    City Youth Movement invites you to the 4th edition of our
                    annual Christmas festivities - by the youth and for the
                    youth! Feat. your favourite worship leaders, carols, quizzes
                    and some surprises!
                  </p>
                  <p>
                    Bring your family and friends and sing along your favourite
                    Christmas carols on the 2nd of December, 6:30 PM onwards at
                    the Balgandharva Rang Mandir, Bandra West. Book your tickets
                    now!
                  </p>
                  <p className="font-medium">3 Reasons to attend the event:</p>
                  <ol className="list-decimal list-inside space-y-1 sm:space-y-2 ml-3 sm:ml-4">
                    <li>The FIRST Christmas concert of Mumbai!</li>
                    <li>A special Christmas Choir!</li>
                    <li>Special Dance performances and many more surprises!</li>
                  </ol>
                </div>
              </div>

              {/* Hosted By */}
              <div className="mt-6 sm:mt-8">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
                  Hosted by
                </h2>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                  <Image
                    src="/images/host-profile.png"
                    alt="City Youth Movement"
                    width={90}
                    height={90}
                    className="rounded-full object-cover w-[70px] h-[70px] sm:w-[90px] sm:h-[90px]"
                  />
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
                      City Youth Movement
                    </h3>
                    <Button className="bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 text-white px-6 sm:px-8 py-2 rounded-lg text-sm font-medium transition-colors">
                      Contact
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4">
                Event location
              </h3>
              <div className="relative h-[180px] sm:h-[200px] rounded-xl overflow-hidden mb-3 sm:mb-4">
                <Image
                  src="/images/map.png"
                  alt="Event Location"
                  fill
                  className="object-cover"
                />
              </div>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 sm:mb-2">
                Dream world wide in Jakarta
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Dummy location generation model by RSU ... Our approach
                generates more realistic dummy locations
              </p>

              {/* Share Section */}
              {/* Share Section */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Share with friends
              </h3>
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-lg bg-[#1877F2] hover:opacity-90 transition-opacity flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button className="w-10 h-10 rounded-lg bg-[#25D366] hover:opacity-90 transition-opacity flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </button>
                <button className="w-10 h-10 rounded-lg bg-[#0A66C2] hover:opacity-90 transition-opacity flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </button>
                <button className="w-10 h-10 rounded-lg bg-[#1DA1F2] hover:opacity-90 transition-opacity flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </button>
                <button className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="19" cy="12" r="1" />
                    <circle cx="5" cy="12" r="1" />
                  </svg>
                </button>
              </div>

              {/* Price Section */}
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mt-6 sm:mt-8 mb-4">
                Price Per Ticket:
              </h3>
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                {[
                  { type: "General Ticket", price: "$199.99", old: "$229.99" },
                  { type: "VIP Ticket", price: "$349.99", old: "$429.99" },
                ].map((t, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm sm:text-base"
                  >
                    <span className="font-semibold text-gray-900 dark:text-gray-200">
                      {t.type}
                    </span>
                    <div className="text-right">
                      <span className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                        {t.price}
                      </span>
                      <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-through ml-1 sm:ml-2">
                        /{t.old}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <Button className="w-full sm:w-[180px] h-[44px] sm:h-[50px] bg-[#0077F7] hover:bg-[#0066D6] text-white rounded-lg text-sm sm:text-base font-semibold transition-colors">
                Save my Spot
              </Button>
            </div>
          </div>
        </section>

        <ExploreEvents />
      </main>

      <Footer />

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        eventTitle="Starry Nights Music Fest"
        eventDescription="A magical evening under the stars with live bands, food stalls, and an electric crowd."
        eventImage="/images/hero-image.png"
        initialDate={new Date(2025, 5, 10)}
      />
    </div>
  );
}
