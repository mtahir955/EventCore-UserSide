"use client";

import Image from "next/image";
import { X } from "lucide-react";

interface HostRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HostManagementModal({
  isOpen,
  onClose,
}: HostRequestModalProps) {
  if (!isOpen) return null;

  const handleReject = () => {
    console.log("[v0] Host request rejected");
    onClose();
  };

  const handleAccept = () => {
    console.log("[v0] Host request accepted");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className="relative bg-white rounded-2xl shadow-2xl"
        style={{ width: "720px", height: "567px" }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 hover:opacity-70 transition-opacity"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-foreground" strokeWidth={2} />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center px-12 pt-10 pb-8 h-full">
          {/* Profile Image */}
          <div className="w-32 h-32 rounded-full overflow-hidden mb-6">
            <Image
              src="/avatars/daniel-carter.png"
              alt="Daniel Carter"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name */}
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Daniel Carter
          </h2>

          {/* Basic Information Section */}
          <div className="w-full mb-8">
            <h3 className="text-xl font-bold text-foreground mb-6">
              Basic Information
            </h3>

            {/* Information Grid */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              {/* Email */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="text-base text-foreground">info@gmail.com</p>
              </div>

              {/* Phone Number */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                <p className="text-base text-foreground">+44 7412 558492</p>
              </div>

              {/* Payment Method */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                <p className="text-base text-foreground">MasterCard</p>
              </div>

              {/* Profile Status */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Profile Status</p>
                <span
                  className="inline-block px-4 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: "#F5EDE5", color: "#D19537" }}
                >
                  Pending
                </span>
              </div>

              {/* Gender */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Gender</p>
                <p className="text-base text-foreground">Male</p>
              </div>

              {/* Address */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Address</p>
                <p className="text-base text-foreground">
                  1234 Sunset Blvd,
                  <br />
                  Los Angeles, CA 90026
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full grid grid-cols-2 gap-4 mt-auto">
            <button
              onClick={handleReject}
              className="py-3 rounded-lg text-base font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#F5EDE5", color: "#000000" }}
            >
              Reject
            </button>
            <button
              onClick={handleAccept}
              className="py-3 rounded-lg text-base font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#D19537" }}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
