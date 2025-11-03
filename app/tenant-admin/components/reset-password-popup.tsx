"use client";

import type React from "react";
import { useState } from "react";

type AuthView = "signup" | "signin" | "forgot-password" | "reset-password";

interface ResetPasswordPopupProps {
  onNavigate: (view: AuthView) => void;
}

export default function ResetPasswordPopup({
  onNavigate,
}: ResetPasswordPopupProps) {
  const [formData, setFormData] = useState({
    password: "",
    resetPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const [errors, setErrors] = useState({
    password: false,
    resetPassword: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      password: formData.password.trim() === "",
      resetPassword: formData.resetPassword.trim() === "",
    };

    setErrors(newErrors);

    // if both filled, proceed
    if (!newErrors.password && !newErrors.resetPassword) {
      onNavigate("signin");
    }
  };

  return (
    <div className="w-full max-w-[596px] h-auto md:h-[435px] bg-white dark:bg-[#212121] rounded-lg shadow-xl p-4 sm:p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="mb-6 sm:mb-8 text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
          Event Core
        </h1>
        <h2 className="text-sm sm:text-base font-bold text-gray-700 dark:text-gray-300 leading-tight mb-2">
          Reset your password
        </h2>
      </div>

      {/* Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* New Password Field */}
        <div>
          <label className="block text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value });
                if (e.target.value.trim() !== "")
                  setErrors({ ...errors, password: false });
              }}
              placeholder="Enter new password"
              className={`w-full h-10 rounded-lg px-4 pr-12 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium text-sm sm:text-base focus:outline-none focus:ring-2 ${
                errors.password
                  ? "bg-red-50 border border-red-500 focus:ring-red-500"
                  : "bg-gray-100 dark:bg-gray-800 focus:ring-[#D19537]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              {showPassword ? (
                // Hide (eye with slash)
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                // Show (open eye)
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showResetPassword ? "text" : "password"}
              value={formData.resetPassword}
              onChange={(e) => {
                setFormData({ ...formData, resetPassword: e.target.value });
                if (e.target.value.trim() !== "")
                  setErrors({ ...errors, resetPassword: false });
              }}
              placeholder="Confirm new password"
              className={`w-full h-10 rounded-lg px-4 pr-12 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium text-sm sm:text-base focus:outline-none focus:ring-2 ${
                errors.resetPassword
                  ? "bg-red-50 border border-red-500 focus:ring-red-500"
                  : "bg-gray-100 dark:bg-gray-800 focus:ring-[#D19537]"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowResetPassword(!showResetPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              {showResetPassword ? (
                // Hide (eye with slash)
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                // Show (open eye)
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full h-12 rounded-lg font-bold text-white uppercase tracking-wide transition-colors text-sm sm:text-base mt-6 sm:mt-8"
          style={{ backgroundColor: "#0077F7" }}
        >
          Continue to Login
        </button>
      </form>

      <p className="text-center text-xs sm:text-sm text-gray-700 dark:text-gray-400 mt-6 sm:mt-8">
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
