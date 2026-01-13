"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { Button } from "@/components/ui/button";

type SectionRef = {
  validate: () => boolean;
  getData: () => any;
};

const EventcorePercentageSection = forwardRef<SectionRef>((_, ref) => {
  const [percentage, setPercentage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  // 🔐 Validation (used by parent form)
  const validate = () => {
    if (percentage === "") {
      setError(false);
      return true; // optional
    }

    const value = Number(percentage);
    const isValid = !isNaN(value) && value >= 0 && value <= 100;

    setError(!isValid);
    return isValid;
  };

  // 📤 Expose data to parent
  const getData = () => ({
    eventcorePercentage: percentage === "" ? null : Number(percentage),
  });

  useImperativeHandle(ref, () => ({
    validate,

    getData,

    setData: (data: any) => {
      setPercentage(
        data?.eventcorePercentage !== null &&
          data?.eventcorePercentage !== undefined
          ? String(data.eventcorePercentage)
          : ""
      );
      setError(false);
    },
  }));

  // 🟡 Local Save handler (same idea as AccountSettings)
  const handleSave = () => {
    const isValid = validate();

    if (isValid) {
      console.log("✅ EventCore Percentage Saved:", {
        eventcorePercentage: percentage === "" ? null : Number(percentage),
      });
    } else {
      console.log("⚠️ Invalid EventCore Percentage");
    }
  };

  return (
    <div className="bg-white dark:bg-[#101010] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6 shadow-sm transition-all">
      {/* Header */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Platform Percentage
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Platform earning configuration
        </p>
      </div>

      {/* Input */}
      <div
        className={`max-w-sm rounded-lg p-3 ${
          error ? "border border-red-500" : ""
        }`}
      >
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Percentage <span className="text-red-500">*</span>
        </label>

        <div className="relative">
          <input
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={percentage}
            onChange={(e) => {
              setPercentage(e.target.value);
              setError(false);
            }}
            placeholder="e.g. 10"
            className="
              w-full
              pr-10
              px-4
              py-3
              rounded-lg
              border border-gray-300 dark:border-gray-600
              bg-white dark:bg-[#101010]
              text-gray-900 dark:text-white
              focus:outline-none
              focus:ring-2
              focus:ring-[#0077F7]/40
            "
          />

          {/* % Symbol */}
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            %
          </span>
        </div>

        {/* Note */}
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          This percentage is applied to all ticket sales across each event.
        </p>
      </div>

      {/* Debug Info (optional, matches AccountSettings style) */}
      <div className="mt-2 p-3 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] text-sm text-gray-700 dark:text-gray-300">
        <p>
          <strong>Current Value:</strong>{" "}
          {percentage ? `${percentage}%` : "Not set"}
        </p>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-[#D19537] hover:bg-[#e59618] text-white font-medium px-6 py-2 rounded-lg transition"
        >
          Save
        </Button>
      </div>
    </div>
  );
});

EventcorePercentageSection.displayName = "EventcorePercentageSection";

export default EventcorePercentageSection;
