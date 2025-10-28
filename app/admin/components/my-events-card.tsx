"use client";

import { useState } from "react";

type Props = {
  imageSrc: string;
  price: string;
};

export function MyEventsCard({ imageSrc, price }: Props) {
  return (
    <>
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ height: 248 }}
      >
        <img
          src={imageSrc || "/placeholder.svg"}
          alt="event cover"
          className="h-full w-full object-cover"
        />
        {/* gradient overlay for legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.00) 20%, rgba(0,0,0,0.75) 100%)",
          }}
        />
        {/* top-right actions */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <div
            className="h-7 px-3 rounded-full text-[12px] grid place-items-center font-semibold"
            style={{
              background: "var(--brand, #D19537)",
              color: "var(--brand-on, #FFFFFF)",
            }}
          >
            {price}
          </div>
        </div>
        {/* content bottom-left */}
        <div className="absolute left-4 right-4 bottom-4 text-white">
          <div className="flex justify-between">
            <div>
              <div className="text-[11px] opacity-80">
                Host By : Eric Gryzbowski
              </div>
              <div className="mt-1 text-[18px] font-semibold">
                Starry Nights Music Fest
              </div>
            </div>
            <img
              src="/icons/star-icon.png"
              alt="interested"
              className="h-7 w-7"
            />{" "}
          </div>
          <div className="mt-1 text-[12px] opacity-90">
            A magical evening under the stars with live bands, food stalls, and
            an electric crowd.
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-[12px]">
            <span className="inline-flex items-center gap-1">
              <img src="/icons/audience-icon.png" className="h-3 w-3" alt="" />
              California
            </span>
            <span className="inline-flex items-center gap-1">
              <img src="/icons/location-icon.png" className="h-3 w-3" alt="" />
              13 June 2025
            </span>
            <span className="inline-flex items-center gap-1">
              <img src="/icons/time-icon.png" className="h-3 w-3" alt="" />
              150 Audience
            </span>
            <span className="inline-flex items-center gap-1">
              <img
                src="/icons/calendar-icon-gold.png"
                className="h-3 w-3"
                alt=""
              />
              08:00 PM - 09:00 PM
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
