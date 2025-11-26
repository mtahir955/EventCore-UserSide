"use client";

import { X, LogOut } from "lucide-react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function LogoutModal({
  isOpen,
  onClose,
  onLogout,
}: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL BOX */}
      <div
        className="relative flex w-[90%] flex-col items-center justify-center bg-white dark:bg-[#101010] p-8 shadow-xl sm:w-[500px]"
        style={{ height: "auto", borderRadius: "16px" }}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-gray-800"
        >
          <X className="size-4" />
        </button>

        {/* ICON */}
        <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-gray-300">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#D19537]">
            <LogOut className="size-6 text-white" />
          </div>
        </div>

        {/* HEADING */}
        <h2 className="mb-4 text-center text-2xl font-bold text-gray-900 dark:text-white">
          Are you sure you want to log out?
        </h2>

        {/* TEXT */}
        <p className="mb-8 text-center text-gray-600 dark:text-gray-400">
          You'll be signed out from your account.
        </p>

        {/* BUTTONS */}
        <div className="flex w-full flex-col gap-4 sm:flex-row">
          {/* CANCEL */}
          <button
            onClick={onClose}
            className="h-14 w-full bg-gray-100 font-medium text-[#D19537] transition-colors hover:bg-gray-200 sm:w-[212px]"
            style={{ borderRadius: "50px" }}
          >
            Cancel
          </button>

          {/* LOGOUT */}
          <button
            onClick={onLogout}
            className="h-14 w-full bg-[#D19537] font-medium text-white transition-colors hover:bg-[#e99714] sm:w-[212px]"
            style={{ borderRadius: "50px" }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
