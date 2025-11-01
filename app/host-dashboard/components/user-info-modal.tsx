"use client";

import type React from "react";

import { useEffect } from "react";
import Image from "next/image";

type UserInfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
    phone: string;
    gender: string;
    address: string;
    avatar: string;
  };
  onAccept: () => void;
  onReject: () => void;
};

export function UserInfoModal({
  isOpen,
  onClose,
  user,
  onAccept,
  onReject,
}: UserInfoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleBackdropClick}
    >
      <div
        className="relative bg-[#FBFBF9] dark:bg-[#101010] rounded-2xl shadow-2xl"
        style={{ width: 420, height: 450 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1 hover:opacity-70 transition-opacity"
        >
          <Image
            src="/images/icons/close-icon-dark.png"
            alt="Close"
            width={24}
            height={24}
          />
        </button>

        {/* Profile Photo */}
        <div className="flex justify-center pt-8 pb-4">
          <Image
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
            width={96}
            height={96}
            className="rounded-full object-cover"
          />
        </div>

        {/* Basic Information */}
        <div className="px-8 pb-6">
          <h2 className="text-[18px] font-bold text-foreground mb-4">
            Basic Information
          </h2>

          <div className="space-y-3">
            {/* Full Name */}
            <div className="flex items-start">
              <div className="w-32 text-[14px] text-gray-600 dark:text-gray-400">Full Name</div>
              <div className="flex-1 text-[14px] text-foreground font-medium">
                {user.name}
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start">
              <div className="w-32 text-[14px] text-gray-600 dark:text-gray-400">Email</div>
              <div className="flex-1 text-[14px] text-foreground font-medium">
                {user.email}
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex items-start">
              <div className="w-32 text-[14px] text-gray-600 dark:text-gray-400">Phone Number</div>
              <div className="flex-1 text-[14px] text-foreground font-medium">
                {user.phone}
              </div>
            </div>

            {/* Gender */}
            <div className="flex items-start">
              <div className="w-32 text-[14px] text-gray-600 dark:text-gray-400">Gender</div>
              <div className="flex-1 text-[14px] text-foreground font-medium">
                {user.gender}
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start">
              <div className="w-32 text-[14px] text-gray-600 dark:text-gray-400">Address</div>
              <div className="flex-1 text-[14px] text-foreground font-medium">
                {user.address}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-8 pb-8 flex gap-3">
          <button
            onClick={() => {
              onReject();
              onClose();
            }}
            className="flex-1 h-12 rounded-xl font-medium text-[14px] transition-colors hover:opacity-80"
            style={{
              backgroundColor: "rgba(209, 149, 55, 0.1)",
              color: "#D19537",
            }}
          >
            Reject
          </button>
          <button
            onClick={() => {
              onAccept();
              onClose();
            }}
            className="flex-1 h-12 rounded-xl text-white font-medium text-[14px] transition-colors hover:opacity-90"
            style={{ backgroundColor: "#D19537" }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
