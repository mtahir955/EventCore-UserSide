"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SigninPopup from "./signin-popup";
import { X } from "lucide-react";
import { useTheme } from "next-themes";

type AuthView = "signin" | "signup" | "forgot-password" | "reset-password";

export default function AuthPopup() {
  const [isOpen, setIsOpen] = useState(true);
  const [view, setView] = useState<AuthView>("signin");
  const { resolvedTheme } = useTheme();
  const router = useRouter(); // ✅ for redirection

  const handleClose = () => {
    setIsOpen(false);
    router.push("/"); // ✅ redirect to homepage
  };

  const renderView = () => {
    switch (view) {
      case "signin":
        return <SigninPopup onNavigate={setView} />;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 px-4"
      style={{
        backgroundColor:
          resolvedTheme === "dark" ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.5)",
      }}
    >
      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-6 right-6 bg-black dark:bg-white text-white dark:text-black p-2 rounded-full shadow-md hover:opacity-80 transition"
      >
        <X size={20} />
      </button>

      {/* Popup Content */}
      <div className="w-full max-w-lg">{renderView()}</div>
    </div>
  );
}
