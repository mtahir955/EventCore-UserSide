"use client";

import { useState } from "react";
import Image from "next/image";

type AuthView = "signup" | "signin" | "forgot-password" | "reset-password";

interface SignupPopupProps {
  onNavigate: (view: AuthView) => void;
}

export default function SignupPopup({ onNavigate }: SignupPopupProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "Alizebth Quen",
    email: "alizebthquen@email.com",
    password: "••••••••••••••••••",
  });

  return (
    <div className="w-full max-w-[596px] h-auto md:h-[640px] bg-white dark:bg-[#212121] rounded-lg shadow-xl p-4 sm:p-6 md:p-8 font-sans">
      {/* Header */}
      <div className="mb-2 text-center md:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">
          Event Core
        </h1>
        <h2 className="text-sm sm:text-base font-bold text-black dark:text-white leading-tight mb-4">
          <span style={{ color: "#0077F7" }}>Sign Up</span> for Free and Start
          Exploring Amazing Events Today
        </h2>
        <p className="text-gray-700 dark:text-gray-400 text-[11px] sm:text-[12px] leading-relaxed">
          Join now to discover concerts, festivals, and experiences you'll love
          – all in one place.
        </p>
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
          <span className="text-black dark:text-white font-medium text-[13px]">
            Sign up with Google
          </span>
        </button>

        <button className="w-full h-10 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center justify-center gap-3 transition-colors">
          <Image
            src="/images/apple-icon.png"
            alt="Apple"
            width={20}
            height={20}
          />
          <span className="text-black dark:text-white font-medium text-[13px]">
            Sign up with Apple
          </span>
        </button>
      </div>

      {/* Divider */}
      <div className="text-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-2">
        Or use Email
      </div>

      {/* Form */}
      <form className="space-y-2">
        {/* Name Field */}
        <div>
          <label className="block text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Enter Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full h-10 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#D19537]"
          />
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full h-10 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#D19537]"
          />
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full h-10 bg-gray-100 dark:bg-gray-800 rounded-lg px-4 pr-12 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#D19537]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              {showPassword ? (
                // Hide icon (eye with slash)
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2.99902 3L20.999 21M9.8433 9.91364C9.32066 10.4536 8.99902 11.1892 8.99902 12C8.99902 13.6569 10.3422 15 11.999 15C12.8215 15 13.5667 14.669 14.1086 14.133M6.49902 6.64715C4.59972 7.90034 3.15305 9.78394 2.45703 12C3.73128 16.0571 7.52159 19 11.9992 19C13.9881 19 15.8414 18.4194 17.3988 17.4184M10.999 5.04939C11.328 5.01673 11.6617 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C21.2607 12.894 20.8577 13.7338 20.3522 14.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                // Show icon (open eye)
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2.45703 12C3.73128 7.94288 7.52159 5 11.9992 5C16.4769 5 20.2672 7.94291 21.5414 12C20.2672 16.0571 16.4769 19 11.9992 19C7.52159 19 3.73128 16.0571 2.45703 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.9992 15C13.6561 15 14.9992 13.6569 14.9992 12C14.9992 10.3431 13.6561 9 11.9992 9C10.3424 9 8.99924 10.3431 8.99924 12C8.99924 13.6569 10.3424 15 11.9992 15Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full h-12 rounded-lg font-bold text-white uppercase tracking-wide transition-colors text-sm sm:text-base"
          style={{ backgroundColor: "#0077F7" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#0077F7")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#0077F7")
          }
        >
          START MY FREE TRIAL
        </button>
      </form>

      {/* Legal Text */}
      <p className="text-[10px] sm:text-[11px] text-gray-600 dark:text-gray-400 text-center mt-2 leading-relaxed">
        By Signing up to uBrand, means you agree to our Privacy Policy and Terms
        of Service
      </p>

      {/* Login Link */}
      <p className="text-center text-xs sm:text-sm text-gray-700 dark:text-gray-400 mt-1">
        Already a Member?{" "}
        <button
          className="font-medium hover:underline"
          style={{ color: "#0077F7" }}
          onClick={() => onNavigate("signin")}
        >
          Log In
        </button>
      </p>
    </div>
  );
}
