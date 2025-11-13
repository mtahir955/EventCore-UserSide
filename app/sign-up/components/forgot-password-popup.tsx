"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";

type AuthView = "signup" | "signin" | "forgot-password" | "reset-password";

interface ForgotPasswordPopupProps {
  onNavigate: (view: AuthView) => void;
}

export default function ForgotPasswordPopup({
  onNavigate,
}: ForgotPasswordPopupProps) {
  const [formData, setFormData] = useState({
    email: "",
  });

  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.email.trim() === "") {
      setError(true);
      return;
    }

    setError(false);
    onNavigate("reset-password");
  };

  return (
    <div className="w-full max-w-[596px] h-auto md:h-[450px] bg-white dark:bg-[#212121] rounded-lg shadow-xl p-4 sm:p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="mb-6 sm:mb-8 flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0077F7] dark:text-white">
          Forgot your password?
        </h1>

        {/* 🔙 Back Button */}
        <button
          onClick={() => onNavigate("signin")}
          className="text-[#0077F7] dark:text-[#D19537] text-sm font-medium hover:underline transition-colors"
        >
          ← Back
        </button>
      </div>

      {/* Social Login Buttons */}
      <div className="space-y-3 sm:space-y-4 mb-2">
        <button className="w-full h-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center gap-3 transition-colors">
          <Image
            src="/images/google-icon.png"
            alt="Google"
            width={20}
            height={20}
          />
          <span className="text-black dark:text-white font-medium text-sm sm:text-base">
            Sign In with Google
          </span>
        </button>

        <button className="w-full h-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center gap-3 transition-colors">
          <Image
            src="/images/apple-icon.png"
            alt="Apple"
            width={20}
            height={20}
          />
          <span className="text-black dark:text-white font-medium text-sm sm:text-base">
            Sign In with Apple
          </span>
        </button>
      </div>

      {/* Divider */}
      <div className="text-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3">
        Or use Email
      </div>

      {/* Form */}
      <form className="space-y-2" onSubmit={handleSubmit}>
        <div>
          <label className="block text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (e.target.value.trim() !== "") setError(false);
            }}
            placeholder="Enter your email"
            className={`w-full h-10 rounded-lg px-4 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium text-sm sm:text-base focus:outline-none focus:ring-2 ${
              error
                ? "bg-red-50 border border-red-500 focus:ring-red-500"
                : "bg-gray-100 dark:bg-gray-800 focus:ring-[#D19537]"
            }`}
          />
        </div>

        <button
          type="submit"
          className="w-full h-12 rounded-lg font-bold text-white uppercase tracking-wide transition-colors text-sm sm:text-base mt-3"
          style={{ backgroundColor: "#0077F7" }}
        >
          Reset Password
        </button>
      </form>

      {/* Signup Link */}
      <p className="text-center text-xs sm:text-sm text-gray-700 dark:text-gray-400 mt-3">
        Are you a Newbie?{" "}
        <button
          className="font-medium hover:underline"
          style={{ color: "#0077F7" }}
          onClick={() => onNavigate("signup")}
        >
          GET STARTED - IT'S FREE
        </button>
      </p>
    </div>
  );
}
