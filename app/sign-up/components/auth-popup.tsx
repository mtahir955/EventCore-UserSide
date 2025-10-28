"use client";

import { useState } from "react";
import SignupPopup from "./signup-popup";
import SigninPopup from "./signin-popup";
import ForgotPasswordPopup from "./forgot-password-popup";
import ResetPasswordPopup from "./reset-password-popup";
import { X } from "lucide-react";
import { useTheme } from "next-themes";

type AuthView = "signup" | "signin" | "forgot-password" | "reset-password";

export default function AuthPopup() {
  const [isOpen, setIsOpen] = useState(true);
  const [view, setView] = useState<AuthView>("signup");
  const { resolvedTheme } = useTheme();

  const renderView = () => {
    switch (view) {
      case "signin":
        return <SigninPopup onNavigate={setView} />;
      case "forgot-password":
        return <ForgotPasswordPopup onNavigate={setView} />;
      case "reset-password":
        return <ResetPasswordPopup onNavigate={setView} />;
      default:
        return <SignupPopup onNavigate={setView} />;
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
        onClick={() => setIsOpen(false)}
        className="absolute top-6 right-6 bg-black dark:bg-white text-white dark:text-black p-2 rounded-full shadow-md hover:opacity-80 transition"
      >
        <X size={20} />
      </button>

      {/* Popup Content */}
      <div className="w-full max-w-lg">{renderView()}</div>
    </div>
  );
}
