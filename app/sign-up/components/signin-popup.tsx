"use client";

import { useState } from "react";
import Image from "next/image";

type AuthView = "signup" | "signin" | "forgot-password" | "reset-password";

interface SigninPopupProps {
  onNavigate: (view: AuthView) => void;
}

export default function SigninPopup({ onNavigate }: SigninPopupProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      email: formData.email.trim() === "",
      password: formData.password.trim() === "",
    };

    setErrors(newErrors);

    // No alert or disabled button, just red highlight
    // Proceed with login logic here if needed
  };

  return (
    <div className="w-full max-w-[596px] h-auto md:h-[580px] bg-white dark:bg-[#212121] rounded-lg shadow-xl p-4 sm:p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="mb-2 text-center md:text-left">
        <h1 className="text-2xl sm:text-4xl font-bold text-black dark:text-white mb-2">
          Event Core
        </h1>
        <p className="text-[12px] sm:text-[16px] text-gray-600 dark:text-gray-400 mb-2">
          WELCOME BACK 👋
        </p>
        <h2 className="text-sm sm:text-base font-bold text-black dark:text-white leading-tight">
          <span style={{ color: "#0077F7" }}>Sign In</span> to Continue your
          Account.
        </h2>
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
      <div className="text-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-2">
        Or use Email
      </div>

      {/* Form */}
      <form className="space-y-2" onSubmit={handleSubmit}>
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
            className={`w-full h-12 mb-4 rounded-lg px-4 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium text-sm sm:text-base focus:outline-none focus:ring-2 ${
              errors.email
                ? "bg-red-50 border border-red-500 focus:ring-red-500"
                : "bg-gray-100 dark:bg-gray-800 focus:ring-[#D19537]"
            }`}
            placeholder="Enter your email"
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
              placeholder="Enter your password"
              className={`w-full h-12 rounded-lg px-4 pr-12 text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-500 font-medium text-sm sm:text-base focus:outline-none focus:ring-2 ${
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
                // Hide icon (eye with slash)
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M2.999 3L21 21M9.843 9.914C9.321 10.454 9 11.189 9 12c0 1.657 1.343 3 3 3 .823 0 1.568-.331 2.11-.867M6.499 6.647C4.6 7.9 3.153 9.784 2.457 12c1.274 4.057 5.065 7 9.542 7 1.989 0 3.842-.581 5.399-1.582M11 5.049C11.329 5.017 11.662 5 12 5c4.478 0 8.268 2.943 9.542 7-.281.894-.684 1.734-1.19 2.5"
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
                    d="M2.457 12C3.731 7.943 7.522 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.269-2.943-9.543-7Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 15c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3Z"
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

        {/* Forgot Password Link */}
        <div className="text-right">
          <button
            type="button"
            className="text-xs sm:text-sm text-gray-700 dark:text-gray-400 hover:underline"
            onClick={() => onNavigate("forgot-password")}
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full h-12 rounded-lg font-bold text-white uppercase tracking-wide transition-colors text-sm sm:text-base"
          style={{ backgroundColor: "#0077F7" }}
        >
          Login
        </button>
      </form>

      {/* Sign Up Link */}
      <p className="text-center text-xs sm:text-sm text-gray-700 dark:text-gray-400 mt-2 sm:mt-4">
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
