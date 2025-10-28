"use client";

import { useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type UserInfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function UserInfoModal_UserManagement({
  isOpen,
  onClose,
}: UserInfoModalProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  // ✅ Hardcoded user data
  const user = {
    fullname: "Sarah Mitchell",
    email: "info@gmail.com",
    phone: "+44 7412 558492",
    gender: "Female",
    address: "1234 Sunset Blvd, Los Angeles, CA 90026",
    profilestatus: "Active",
    avatar: "/avatars/daniel-carter.png", // replace with your actual image path
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleBackdropClick}
    >
      <div
        className="relative bg-[#FBFBF9] rounded-2xl shadow-2xl sm:w-[400px] w-[330px] sm:h-[520px] h-[540px]"
        // style={{ width: 420, height: 530 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1 hover:opacity-70 transition-opacity"
        >
          <Image
            src="/icons/close-icon.png"
            alt="Close"
            width={24}
            height={24}
          />
        </button>

        {/* Profile Photo */}
        <div className="flex justify-center pt-8 pb-4">
          <Image
            src={user.avatar}
            alt={user.fullname}
            width={96}
            height={96}
            className="rounded-full object-cover"
          />
        </div>

        {/* Basic Information */}
        <div className="px-8">
          <h2 className="text-[18px] font-bold text-foreground mb-4">
            Basic Information
          </h2>

          <div className="space-y-5">
            <div className="flex items-start">
              <div className="w-32 text-[14px] text-gray-600">Full Name</div>
              <div className="flex-1 text-[14px] text-foreground font-medium">
                {user.fullname}
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-32 text-[14px] text-gray-600">Email</div>
              <div className="flex-1 text-[14px] text-foreground font-medium">
                {user.email}
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-32 text-[14px] text-gray-600">Phone Number</div>
              <div className="flex-1 text-[14px] text-foreground font-medium">
                {user.phone}
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-32 text-[14px] text-gray-600">Gender</div>
              <div className="flex-1 text-[14px] text-foreground font-medium">
                {user.gender}
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-32 text-[14px] text-gray-600">
                Profile Status
              </div>
              <div
                className={cn(
                  "flex items-center px-4 py-1 justify-between border rounded-full",
                  user.profilestatus === "Active"
                    ? "bg-[#e8f5e9] text-[#1b5e20]"
                    : "bg-[#ffebee] text-[#b71c1c]"
                )}
              >
                <div
                  className={cn(
                    "flex-1 text-[14px] font-medium",
                    user.profilestatus === "Active"
                      ? "text-[#096910FF]"
                      : "text-[#570D0DFF]"
                  )}
                >
                  {user.profilestatus}
                </div>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-32 text-[14px] text-gray-600">Address</div>
              <div className="flex-1 text-[14px] text-foreground font-medium">
                {user.address}
              </div>
            </div>
            <div className="flex justify-end w-full">
              <div
                className="flex items-center justify-end px-4 py-3 w-1/2 rounded-full"
                style={{ background: "rgba(255, 235, 238, 1)" }}
              >
                <div
                  className="flex-1 flex items-center justify-center text-[14px] font-medium"
                  style={{ color: "rgba(183, 28, 28, 1)" }}
                >
                  Banned User
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
