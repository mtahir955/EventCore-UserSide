"use client";

import Image from "next/image";

type NotificationItemProps = {
  title: string;
  description: string;
  iconUrl: string;
};

export function NotificationItem({
  title,
  description,
  iconUrl,
}: NotificationItemProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-12 py-4 sm:py-5  transition-colors">
        {/* Left Section */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Icon */}
          <Image
            src={iconUrl || "/placeholder.svg"}
            alt={title}
            width={44}
            height={44}
            className="w-[40px] h-[40px] sm:w-[48px] sm:h-[48px] rounded-full"
          />

          {/* Text Content */}
          <div className="flex flex-col">
            <h3 className="text-[15px] sm:text-[17px] dark:text-white font-semibold text-gray-900">
              {title}
            </h3>
            <p className="text-[13px] sm:text-[14px] text-gray-600 leading-snug">
              {description}
            </p>
          </div>
        </div>

        {/* Chevron Icon */}
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="text-gray-500 shrink-0"
        >
          <path
            d="M9 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mx-4 sm:mx-6 lg:mx-12" />
    </div>
  );
}
