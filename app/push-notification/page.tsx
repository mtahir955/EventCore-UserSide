"use client";

import { Sidebar } from "../admin/components/sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Bell, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { PushNotificationModal } from "../admin/components/push-notification-modal";

const notifications = [
  {
    id: 1,
    icon: "/icons/new-organizer-icon.png",
    title: "New Organizer Registered",
    description:
      "John Events Co. has registered as an organizer. Review their profile before approval.",
  },
  {
    id: 2,
    icon: "/icons/organizer-approved-icon.png",
    title: "Organizer Approved",
    description:
      "BrightStar Events has been successfully approved and can now publish events.",
  },
  {
    id: 3,
    icon: "/icons/glyph.png",
    title: "New Attendee Signup",
    description:
      "Emily Davis has joined Event Core. Welcome them to our community.",
  },
  {
    id: 4,
    icon: "/icons/new-organizer-icon.png",
    title: "New Organizer Registered",
    description:
      "John Events Co. has registered as an organizer. Review their profile before approval.",
  },
  {
    id: 5,
    icon: "/icons/organizer-approved-icon.png",
    title: "Organizer Approved",
    description:
      "BrightStar Events has been successfully approved and can now publish events.",
  },
  {
    id: 6,
    icon: "/icons/glyph.png",
    title: "New Attendee Signup",
    description:
      "Emily Davis has joined Event Core. Welcome them to our community.",
  },
];

export default function PushNotificationPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-secondary">
      {/* Sidebar */}
      <Sidebar activePage="Push Notification Center" />

      <main className="flex-1 overflow-auto lg:ml-[250px]">
        {/* ===== Header (Desktop) ===== */}
        <header className="hidden lg:flex bg-background border-b border-border px-8 py-6 items-center justify-between sticky top-0 z-30">
          <h1 className="text-3xl font-semibold text-foreground">
            Push Notification Center
          </h1>
          <div className="flex items-center gap-4">
            <Link href="/push-notification">
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-300">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
            </Link>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
              <User className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* ===== Page Content ===== */}
        <div className="p-4 sm:p-6 md:p-8">
          {/* ===== Push Notification Form ===== */}
          <div className="bg-background rounded-xl p-4 mt-14 sm:mt-0 sm:p-6 md:p-8 mb-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
              Push Notification Center
            </h2>

            <div className="space-y-5 sm:space-y-6">
              {/* Title Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Set Title
                </label>
                <Input
                  type="text"
                  placeholder="Limited Time Offer!"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-secondary border-border text-sm sm:text-base"
                />
              </div>

              {/* Message Field */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <Textarea
                  placeholder="Get 30% off a one month plan. Don't miss out!"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-secondary border-border min-h-[100px] sm:min-h-[120px] resize-none text-sm sm:text-base"
                />
              </div>

              {/* Send Button */}
              <Button
                onClick={() => setIsOpenModal(true)}
                className="text-white font-medium w-full sm:w-auto px-10 sm:px-16 py-4 sm:py-6 rounded-lg transition-colors duration-200 hover:opacity-90 text-sm sm:text-base"
                style={{ backgroundColor: "rgba(209, 149, 55, 1)" }}
              >
                Send
              </Button>
            </div>
          </div>

          {/* ===== Notifications List ===== */}
          <div className="bg-background rounded-lg p-4 sm:p-6 md:p-8 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6">
              Notifications
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  className="w-full flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-lg hover:bg-secondary transition-colors text-left"
                  onClick={() => {
                    if (notification.title === "New Attendee Signup") {
                      router.push("/user-management");
                    } else {
                      router.push("/host-request");
                    }
                  }}
                >
                  {/* Icon */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFF4E6] flex items-center justify-center flex-shrink-0">
                    <Image
                      src={notification.icon || "/placeholder.svg"}
                      alt={notification.title}
                      width={28}
                      height={28}
                      className="object-contain w-6 h-6 sm:w-7 sm:h-7"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1">
                    <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1">
                      {notification.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground leading-snug">
                      {notification.description}
                    </p>
                  </div>

                  {/* Chevron */}
                  <Image
                    src="/icons/chevron-right-icon.png"
                    alt="View details"
                    width={20}
                    height={20}
                    className="hidden sm:block opacity-100"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ===== Modal ===== */}
      <PushNotificationModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
      />
    </div>
  );
}
