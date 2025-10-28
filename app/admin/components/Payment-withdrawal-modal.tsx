"use client";

import Image from "next/image";
import { X } from "lucide-react";

interface PaymentWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentWithdrawalModal({
  isOpen,
  onClose,
}: PaymentWithdrawalModalProps) {
  if (!isOpen) return null;

  const handleReject = () => {
    console.log("[v0] Withdrawal request rejected");
    onClose();
  };

  const handleAccept = () => {
    console.log("[v0] Withdrawal request accepted");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 sm:px-6">
      <div
        className="
          relative 
          bg-white 
          rounded-2xl 
          shadow-2xl 
          w-full 
          max-w-[650px] 
          max-h-[90vh] 
          
          p-6 sm:p-8 md:p-10
        "
      >
        {/* ===== Close Button ===== */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 hover:opacity-70 transition-opacity"
          aria-label="Close"
        >
          <X className="w-6 h-6 text-foreground" strokeWidth={3} />
        </button>

        {/* ===== Content ===== */}
        <div className="flex flex-col items-center text-center">
          {/* Profile Image */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden mb-4 sm:mb-6">
            <Image
              src="/avatars/daniel-carter.png"
              alt="Daniel Carter"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name */}
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Daniel Carter
          </h2>

          {/* ===== Balance ===== */}
          <div className="w-full mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3 text-left">
              Current Balance
            </h3>
            <p className="text-2xl sm:text-3xl text-black font-bold text-left">
              $67,000
            </p>
          </div>

          {/* ===== Basic Information ===== */}
          <div className="w-full mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6 text-left">
              Basic Information
            </h3>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-10 gap-y-4 sm:gap-y-6">
              {/* Email */}
              <div className="flex justify-between items-start sm:items-center">
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-sm sm:text-base text-foreground text-right">
                  info@gmail.com
                </p>
              </div>

              {/* Phone Number */}
              <div className="flex justify-between items-start sm:items-center">
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="text-sm sm:text-base text-foreground text-right">
                  +44 7412 558492
                </p>
              </div>

              {/* Payment Method */}
              <div className="flex justify-between items-start sm:items-center">
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="text-sm sm:text-base text-foreground text-right">
                  MasterCard
                </p>
              </div>

              {/* Address */}
              <div className="flex justify-between items-start sm:items-center">
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-sm sm:text-base text-foreground text-right">
                  1234 Sunset Blvd,
                  <br className="sm:hidden" />
                  Los Angeles, CA 90026
                </p>
              </div>
            </div>
          </div>

          {/* ===== Action Buttons ===== */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-auto">
            <button
              onClick={handleReject}
              className="py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#F5EDE5", color: "#000000" }}
            >
              Reject
            </button>
            <button
              onClick={handleAccept}
              className="py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium text-white transition-opacity hover:opacity-90"
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