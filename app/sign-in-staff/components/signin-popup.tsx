"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";

type AuthView = "signin" | "signup" | "forgot-password" | "reset-password";

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

  // ⭐ FULL BACKEND LOGIN (same as Admin + Host)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      email: formData.email.trim() === "",
      password: formData.password.trim() === "",
    };

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.18.185:8080/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "x-tenant-id": "883e6f70-8923-4c72-bf04-66905d24d736",
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Login Successful! 🎉");

      console.log("Staff Login Response:", response.data);

      if (response.data?.accessToken) {
        localStorage.setItem("staffToken", response.data.accessToken); // ⭐ staff token
      }

      // Redirect to staff dashboard
      window.location.href = "/staff-dashboard";
    } catch (error: any) {
      console.error("Staff Login Error:", error);

      toast.error(error?.response?.data?.message || "Invalid credentials");

      setErrors({
        email: true,
        password: true,
      });
    }
  };

  return (
    <div className="w-full max-w-[596px] h-auto md:h-[420px] bg-white dark:bg-[#212121] rounded-lg shadow-xl p-4 sm:p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="mb-2 text-center md:text-left">
        <h1 className="text-2xl sm:text-4xl text-center font-bold text-[#0077F7] dark:text-white mb-2">
          Log In
        </h1>
        <p className="text-[12px] sm:text-[16px] text-center text-gray-600 dark:text-gray-400 mb-2">
          WELCOME BACK STAFF 👋
        </p>
      </div>

      <form className="space-y-2" onSubmit={handleSubmit}>
        {/* Email */}
        <div>
          <label className="block text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
            Email/Username
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

        {/* Submit */}
        <button
          type="submit"
          className="w-full h-12 mt-3 rounded-lg font-bold text-white uppercase tracking-wide transition-colors text-sm sm:text-base"
          style={{ backgroundColor: "#0077F7" }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
