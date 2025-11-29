"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const SocialMediaLinksSection = forwardRef((props, ref) => {
  const [links, setLinks] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // 🧩 Validation Regex for URLs
  const urlPattern =
    /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z]{2,63}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

  // 🧠 Expose methods to parent
  useImperativeHandle(ref, () => ({
    getData: () => ({
      socialFacebook: links.facebook,
      socialInstagram: links.instagram,
      socialTwitter: links.twitter,
      socialYoutube: links.youtube,
    }),
  }));

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLinks((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  // 🧠 Save (local validation log)
  const handleSave = () => {
    if (Object.keys(errors).length === 0) {
      console.log("✅ Saved Social Media Links:", links);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#101010] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6 shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Share2 size={24} className="text-gray-700 dark:text-white" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Social Media Links
        </h3>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Facebook */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Facebook
          </label>
          <input
            type="url"
            name="facebook"
            placeholder="https://facebook.com/yourpage"
            value={links.facebook}
            onChange={handleChange}
            className={`w-full rounded-lg px-4 py-2 border ${
              errors.facebook
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            } bg-white dark:bg-[#101010] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D19537]`}
          />
          {errors.facebook && (
            <p className="text-xs text-red-500 mt-1">
              Please enter a valid Facebook URL.
            </p>
          )}
        </div>

        {/* Instagram */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Instagram
          </label>
          <input
            type="url"
            name="instagram"
            placeholder="https://instagram.com/yourprofile"
            value={links.instagram}
            onChange={handleChange}
            className={`w-full rounded-lg px-4 py-2 border ${
              errors.instagram
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            } bg-white dark:bg-[#101010] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D19537]`}
          />
          {errors.instagram && (
            <p className="text-xs text-red-500 mt-1">
              Please enter a valid Instagram URL.
            </p>
          )}
        </div>

        {/* Twitter */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            Twitter / X
          </label>
          <input
            type="url"
            name="twitter"
            placeholder="https://twitter.com/yourhandle"
            value={links.twitter}
            onChange={handleChange}
            className={`w-full rounded-lg px-4 py-2 border ${
              errors.twitter
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            } bg-white dark:bg-[#101010] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D19537]`}
          />
          {errors.twitter && (
            <p className="text-xs text-red-500 mt-1">
              Please enter a valid Twitter/X URL.
            </p>
          )}
        </div>

        {/* YouTube */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
            YouTube
          </label>
          <input
            type="url"
            name="youtube"
            placeholder="https://youtube.com/@yourchannel"
            value={links.youtube}
            onChange={handleChange}
            className={`w-full rounded-lg px-4 py-2 border ${
              errors.youtube
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            } bg-white dark:bg-[#101010] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D19537]`}
          />
          {errors.youtube && (
            <p className="text-xs text-red-500 mt-1">
              Please enter a valid YouTube URL.
            </p>
          )}
        </div>
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

SocialMediaLinksSection.displayName = "SocialMediaLinksSection";
export default SocialMediaLinksSection;
