"use client";

import { X, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => void;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
  onSubmit,
}: ChangePasswordModalProps) {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
    mismatch: false,
  });

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    let newErrors = {
      currentPassword: form.currentPassword.trim() === "",
      newPassword: form.newPassword.trim() === "",
      confirmPassword: form.confirmPassword.trim() === "",
      mismatch: false,
    };

    // Password mismatch check
    if (
      form.newPassword.trim() !== "" &&
      form.confirmPassword.trim() !== "" &&
      form.newPassword !== form.confirmPassword
    ) {
      newErrors.mismatch = true;
    }

    setErrors(newErrors);

    // ❌ if any error exists → block submit
    if (
      newErrors.currentPassword ||
      newErrors.newPassword ||
      newErrors.confirmPassword ||
      newErrors.mismatch
    ) {
      return;
    }

    // ✅ submit
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* MODAL BOX */}
      <div className="relative w-[90%] sm:w-[450px] bg-white dark:bg-[#101010] p-6 rounded-2xl shadow-xl">
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-black text-white hover:bg-gray-800"
          onClick={onClose}
        >
          <X className="size-4" />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-6">
          Change Password
        </h2>

        {/* INPUTS */}
        <div className="space-y-4">
          {/* Current Password */}
          <div className="space-y-1">
            <label className="text-sm text-gray-700 dark:text-gray-200">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={form.currentPassword}
                onChange={(e) =>
                  setForm({ ...form, currentPassword: e.target.value })
                }
                className={`h-12 w-full rounded-lg px-4 pr-12 outline-none bg-white dark:bg-[#101010] 
                text-gray-900 dark:text-gray-100
                border ${
                  errors.currentPassword
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-700"
                }`}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1">
            <label className="text-sm text-gray-700 dark:text-gray-200">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={form.newPassword}
                onChange={(e) =>
                  setForm({ ...form, newPassword: e.target.value })
                }
                className={`h-12 w-full rounded-lg px-4 pr-12 outline-none bg-white dark:bg-[#101010] 
                text-gray-900 dark:text-gray-100
                border ${
                  errors.newPassword
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-700"
                }`}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-sm text-gray-700 dark:text-gray-200">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                className={`h-12 w-full rounded-lg px-4 pr-12 outline-none bg-white dark:bg-[#101010] 
                text-gray-900 dark:text-gray-100
                border ${
                  errors.confirmPassword || errors.mismatch
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-700"
                }`}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Password mismatch error */}
            {errors.mismatch && (
              <p className="text-xs text-red-500 mt-1">
                New password and Confirm password do not match.
              </p>
            )}
          </div>
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          className="mt-6 w-full h-12 rounded-full bg-[#0077F7] hover:bg-blue-600 text-white font-medium transition"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}
