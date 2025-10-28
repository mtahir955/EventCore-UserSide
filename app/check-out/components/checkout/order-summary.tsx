"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export default function OrderSummary() {
  const [type, setType] = useState<"general" | "vip">("general");
  const [qty, setQty] = useState(1);
  const router = useRouter();

  const price = type === "general" ? 199.99 : 299.99;
  const serviceFee = 3.75;
  const processingFee = 1.61;
  const total = useMemo(
    () => price * qty + serviceFee + processingFee,
    [price, qty]
  );

  return (
    <div className="min-h-screen bg-[#0077F71A] dark:bg-[#101010] rounded-2xl flex justify-center py-8 px-4 transition-colors duration-300">
      <div className="w-full max-w-md space-y-4 overflow-y-auto text-gray-900 dark:text-gray-100">
        {/* Event card */}
        <div className="rounded-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] p-4 shadow-sm transition-colors">
          <div className="relative mb-3 overflow-hidden rounded-[12px]">
            <Image
              src="/images/event.jpg"
              alt="Starry Nights Music Fest"
              width={360}
              height={200}
              className="h-[120px] w-full object-cover"
              priority
            />
            <Image
              src="/images/icon-close.png"
              alt="Remove"
              width={26}
              height={26}
              className="absolute right-3 top-3 h-[26px] w-[26px] cursor-pointer"
            />
          </div>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[15px] font-medium text-gray-900 dark:text-gray-100">
                Starry Nights Music Fest
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {formatter.format(price)}
              </p>
            </div>
          </div>
        </div>

        {/* Ticket type + qty */}
        <div className="rounded-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] p-4 transition-colors">
          <fieldset className="space-y-3">
            <label className="flex cursor-pointer items-center justify-between rounded-md px-1 py-1 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="ticket"
                  className="h-4 w-4 accent-blue-500"
                  checked={type === "general"}
                  onChange={() => setType("general")}
                />
                <span className="text-[15px]">General Ticket</span>
              </div>
              <div className="text-right">
                <div className="text-[15px]">
                  {formatter.format(199.99)}{" "}
                  <span className="text-gray-400 line-through">$299.99</span>
                </div>
              </div>
            </label>

            <label className="flex cursor-pointer items-center justify-between rounded-md px-1 py-1 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="ticket"
                  className="h-4 w-4 accent-blue-500"
                  checked={type === "vip"}
                  onChange={() => setType("vip")}
                />
                <span className="text-[15px]">VIP Ticket</span>
              </div>
              <div className="text-right">
                <div className="text-[15px]">
                  {formatter.format(299.99)}{" "}
                  <span className="text-gray-400 line-through">$399.99</span>
                </div>
              </div>
            </label>
          </fieldset>

          {/* Quantity stepper */}
          <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-[15px]">No of Tickets</span>
              <div className="flex items-center gap-3">
                <button
                  aria-label="decrease"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-6 w-6"
                >
                  <Image
                    src="/images/icon-minus.png"
                    alt="-"
                    width={26}
                    height={26}
                  />
                </button>
                <span className="w-6 text-center text-[15px]">{qty}</span>
                <button
                  aria-label="increase"
                  onClick={() => setQty((q) => q + 1)}
                  className="h-6 w-6"
                >
                  <Image
                    src="/images/icon-plus.png"
                    alt="+"
                    width={26}
                    height={26}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment breakdown */}
        <div className="rounded-[12px] border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] p-4 relative transition-colors">
          <h3 className="mb-2 text-[15px] font-medium text-gray-900 dark:text-gray-100">
            Payment Details
          </h3>
          <div className="space-y-2 text-sm">
            <Row label="Ticket" value={formatter.format(price * qty)} />
            <Row label="Service Fee" value={formatter.format(serviceFee)} />
            <Row
              label="Processing Fee"
              value={formatter.format(processingFee)}
            />
            <div className="border-t border-gray-200 dark:border-gray-700 pt-2"></div>
            <Row label="Total" value={formatter.format(total)} bold />
          </div>
        </div>

        {/* Sticky Pay Now Button */}
        <Button
          className="w-full h-11 rounded-[10px] bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
          onClick={() => router.push("/check-out/payment")}
        >
          Pay Now
        </Button>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={
          bold
            ? "font-semibold text-gray-900 dark:text-gray-100"
            : "text-gray-600 dark:text-gray-300"
        }
      >
        {label}
      </span>
      <span
        className={
          bold
            ? "font-semibold text-gray-900 dark:text-gray-100"
            : "text-gray-800 dark:text-gray-200"
        }
      >
        {value}
      </span>
    </div>
  );
}
