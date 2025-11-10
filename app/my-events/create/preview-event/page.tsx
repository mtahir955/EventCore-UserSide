"use client";

import { Sidebar } from "../../../host-dashboard/components/sidebar";
import { EventSuccessModal } from "../../../host-dashboard/components/event-success-modal";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { EditStaffModal } from "../../../host-dashboard/components/edit-staff-modal";
import { Facebook, Instagram, Linkedin } from "lucide-react";

type SetImagesPageProps = {
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
};

export default function PreviewEventPage({
  setActivePage,
}: SetImagesPageProps) {
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [iseditstaffmodalopen, setIseditstaffmodalopen] = useState(false);

  return (
    <>
      <div className="px-4 sm:px-8 md:px-12 lg:px-16 py-6 md:py-8">
        <div
          className="rounded-2xl p-6 sm:p-8 mx-auto bg-white dark:bg-[#191919]"
          style={{ maxWidth: 1200 }}
        >
          {/* Hero Image */}
          <div className="w-full mb-6">
            <img
              src="/images/event-venue.png"
              alt="Event venue"
              className="w-full h-[220px] sm:h-[300px] md:h-[350px] lg:h-[400px] object-cover rounded-lg"
            />
          </div>

          {/* Two Column Layout */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-14">
            {/* Left Column - Event Details */}
            <div className="flex-1 lg:w-1/2 w-full">
              <h1 className="text-[26px] sm:text-[32px] md:text-[36px] lg:text-[40px] font-bold mb-6 leading-tight">
                Starry Nights Music Fest
              </h1>

              {/* Date and Time Section */}
              <div className="mb-6">
                <h3 className="text-[18px] sm:text-[20px] font-semibold mb-4">
                  Date and Time
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 mb-4 items-center justify-items-start">
                  {/* Location */}
                  <div className="flex items-center gap-2">
                    <img
                      src="/images/icons/location-new.png"
                      alt="location"
                      className="h-5 w-5"
                    />
                    <span className="text-[15px] sm:text-[16px]">
                      California
                    </span>
                  </div>

                  {/* Audience */}
                  <div className="flex items-center gap-2">
                    <img
                      src="/images/icons/people-new.png"
                      alt="audience"
                      className="h-5 w-5"
                    />
                    <span className="text-[15px] sm:text-[16px]">
                      150 Audience
                    </span>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2">
                    <img
                      src="/images/icons/calendar-icon.png"
                      alt="date"
                      className="h-5 w-5"
                    />
                    <span className="text-[15px] sm:text-[16px]">
                      13 June 2025
                    </span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-2">
                    <img
                      src="/images/icons/clock-icon.png"
                      alt="time"
                      className="h-5 w-5"
                    />
                    <span className="text-[15px] sm:text-[16px]">
                      08:00 PM - 09:00 PM
                    </span>
                  </div>
                </div>

                <button
                  className="px-5 py-2 rounded-lg text-white font-medium text-[15px] sm:text-[16px]"
                  style={{ backgroundColor: "#D19537" }}
                >
                  + Add to Calendar
                </button>
              </div>

              {/* Event Description */}
              <div className="mb-6">
                <h3 className="text-[18px] sm:text-[20px] font-semibold mb-4">
                  Event Description
                </h3>
                <div className="space-y-4 text-[15px] sm:text-[16px] leading-relaxed text-gray-700 dark:text-gray-400">
                  <p>
                    Get ready to kick off the Christmas season in Mumbai with
                    SOUND OF CHRISTMAS - your favourite LIVE Christmas concert!
                  </p>
                  <p>
                    City Youth Movement invites you to the 4th edition of our
                    annual Christmas festivities - by the youth and for the
                    youth! Feat. your favourite worship leaders, carols, quizzes
                    and some exciting surprises!
                  </p>
                  <p>
                    Bring your family and friends and sing along your favourite
                    Christmas carols on the 2nd of December, 6:30 PM onwards at
                    the Balgandharva Rang Mandir, Bandra West. Book your tickets
                    now!
                  </p>
                  <div>
                    <p className="font-semibold mb-2">
                      3 Reasons to attend the event:
                    </p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>The FIRST Christmas concert of Mumbai!</li>
                      <li>A special Christmas Choir!</li>
                      <li>
                        Special Dance performances and many more surprises!
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Hosted By */}
              <div className="mb-2">
                <h3 className="text-[18px] sm:text-[20px] font-semibold mb-4">
                  Hosted by
                </h3>
                <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                  <img
                    src="/images/host-profile.png"
                    alt="Host"
                    className="h-20 w-20 sm:h-24 sm:w-24 rounded-full"
                  />
                  <div className="flex flex-col justify-start gap-3 w-full sm:w-auto">
                    <p className="text-[16px] sm:text-[18px] font-semibold">
                      City Youth Movement
                    </p>
                    <button className="px-6 py-2 rounded-lg bg-black text-white font-medium text-[15px] sm:text-[16px]">
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:w-1/2 w-full lg:pl-8 mt-8 lg:mt-0">
              {/* Event Location */}
              <div className="mb-6">
                <h3 className="text-[17px] sm:text-[18px] font-semibold mb-3">
                  Event Location
                </h3>
                <img
                  src="/images/event-map.png"
                  alt="Event location map"
                  className="w-full h-[180px] sm:h-[200px] md:h-[250px] rounded-lg mb-3 object-cover"
                />
                <p className="text-[15px] sm:text-[16px] font-semibold mb-1">
                  Dream world wide in jakatra
                </p>
                <p className="text-[13px] sm:text-[14px] text-gray-600">
                  Dummy location generation model by RSU ... Our approach
                  generates more realistic dummy locations
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Trainers
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {[
                    {
                      name: "Ethan Brooks",
                      role: "Lead Motivational Coach",
                      image: "/images/pic1.png",
                      bio: "Certified personal trainer with 8 years of experience helping athletes improve endurance and muscle strength.",
                      socials: {
                        facebook: "https://facebook.com/",
                        instagram: "https://instagram.com/",
                        linkedin: "https://linkedin.com/",
                      },
                    },
                    {
                      name: "Sophia Hayes",
                      role: "Wellness & Lifestyle Mentor",
                      image: "/images/pic2.png",
                      bio: "Passionate about holistic fitness, mindfulness, and flexibility training. Certified Yoga instructor since 2016.",
                      socials: {
                        facebook: "https://facebook.com/",
                        instagram: "https://instagram.com/",
                        linkedin: "https://linkedin.com/",
                      },
                    },
                    {
                      name: "Olivia Grant",
                      role: "Corporate Leadership Coach",
                      image: "/images/pic4.png",
                      bio: "Nutrition specialist focusing on balanced diets, weight management, and overall wellness transformation.",
                      socials: {
                        facebook: "https://facebook.com/",
                        instagram: "https://instagram.com/",
                        linkedin: "https://linkedin.com/",
                      },
                    },
                    {
                      name: "Daniel Carter",
                      role: "Fitness & Performance Trainer",
                      image: "/images/pic5.png",
                      bio: "Energetic HIIT coach dedicated to helping clients achieve peak physical performance through high-intensity training.",
                      socials: {
                        facebook: "https://facebook.com/",
                        instagram: "https://instagram.com/",
                        linkedin: "https://linkedin.com/",
                      },
                    },
                  ].map((trainer, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-[#191919] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-5 flex flex-col items-center text-center transition hover:shadow-md hover:-translate-y-1 duration-300"
                    >
                      <img
                        src={trainer.image}
                        alt={trainer.name}
                        className="h-12 w-12 rounded-full object-cover mb-3"
                      />
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {trainer.name}
                      </h4>
                      <p className="text-sm text-[#D19537] mb-2">
                        {trainer.role}
                      </p>
                      {/* <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {trainer.bio}
                      </p> */}

                      <div className="flex items-center gap-3">
                        <a
                          href={trainer.socials.facebook}
                          target="_blank"
                          className="h-8 w-8 rounded-full bg-gray-100 dark:bg-[#222] grid place-items-center hover:bg-[#0077F7] hover:text-white transition"
                        >
                          <Facebook className="h-4 w-4 text-gray-700 hover:text-white dark:text-white" />
                        </a>
                        <a
                          href={trainer.socials.instagram}
                          target="_blank"
                          className="h-8 w-8 rounded-full bg-gray-100 dark:bg-[#222] grid place-items-center hover:bg-[#0077F7] hover:text-white transition"
                        >
                          <Instagram className="h-4 w-4 text-gray-700 hover:text-white dark:text-white" />
                        </a>
                        <a
                          href={trainer.socials.linkedin}
                          target="_blank"
                          className="h-8 w-8 rounded-full bg-gray-100 dark:bg-[#222] grid place-items-center hover:bg-[#0077F7] hover:text-white transition"
                        >
                          <Linkedin className="h-4 w-4 text-gray-700 hover:text-white dark:text-white" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share with friends */}
              <div className="mb-6">
                <h3 className="text-[17px] sm:text-[18px] font-semibold mb-3">
                  Share with friends
                </h3>
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                  <img
                    src="/images/social/facebook.png"
                    alt="Facebook"
                    className="h-9 w-9 sm:h-10 sm:w-10 cursor-pointer"
                  />
                  <img
                    src="/images/social/whatsapp.png"
                    alt="WhatsApp"
                    className="h-9 w-9 sm:h-10 sm:w-10 cursor-pointer"
                  />
                  <img
                    src="/images/social/linkedin.png"
                    alt="LinkedIn"
                    className="h-9 w-9 sm:h-10 sm:w-10 cursor-pointer"
                  />
                  <img
                    src="/images/social/twitter.png"
                    alt="Twitter"
                    className="h-9 w-9 sm:h-10 sm:w-10 cursor-pointer"
                  />
                  <img
                    src="/images/icons/more-icon.png"
                    alt="More"
                    className="h-9 w-9 sm:h-10 sm:w-10 cursor-pointer"
                  />
                </div>
              </div>

              {/* Price Per Ticket */}
              <div className="mb-6">
                <h3 className="text-[17px] sm:text-[18px] font-semibold mb-4">
                  Price Per Ticket:
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] sm:text-[16px]">
                      General Ticket
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] sm:text-[16px] font-semibold">
                        $199.99
                      </span>
                      <span className="text-[13px] sm:text-[14px] text-gray-400 line-through">
                        $229.99
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] sm:text-[16px]">
                      VIP Ticket
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[15px] sm:text-[16px] font-semibold">
                        $299.99
                      </span>
                      <span className="text-[13px] sm:text-[14px] text-gray-400 line-through">
                        $339.99
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className="w-full mt-4 px-6 py-3 rounded-lg text-white font-medium text-[15px] sm:text-[16px]"
                  style={{ backgroundColor: "#D19537" }}
                >
                  Save my Spot
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4 px-4 sm:px-8 py-6 bg-white dark:bg-[#191919] border-t mt-6">
          <button
            className="w-full sm:w-auto px-8 py-3 rounded-lg font-medium text-[15px] sm:text-[16px]"
            style={{ backgroundColor: "#FFF4E6", color: "#D19537" }}
            onClick={() => router.push("/my-events")}
          >
            Discard
          </button>
          <button
            type="button"
            className="w-full sm:w-auto px-8 py-3 rounded-lg text-white font-medium text-[15px] sm:text-[16px]"
            style={{ backgroundColor: "#D19537" }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowSuccessModal(true);
            }}
          >
            Publish Event
          </button>
        </div>
      </div>

      {showSuccessModal && (
        <EventSuccessModal
          isOpen={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          setIseditstaffmodalopen={setIseditstaffmodalopen}
        />
      )}

      <EditStaffModal
        isOpen={iseditstaffmodalopen}
        onClose={() => setIseditstaffmodalopen(false)}
      />
    </>
  );
}
