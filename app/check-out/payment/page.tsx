"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Header } from "../../../components/header";
import { Footer } from "../../../components/footer";
import { CalendarModal } from "../components/calendar-modal";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";
import axios from "axios";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";

export default function PaymentSuccessPage() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  const [qrCode, setQrCode] = useState<string | null>(null);

  // Load confirmed purchase response from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("confirmedPurchase");
    if (stored) {
      const parsed = JSON.parse(stored);
      setPaymentData(parsed?.data);
    }
  }, []);

  const getToken = () => {
    if (typeof window === "undefined") return null;

    const raw =
      localStorage.getItem("buyerToken") ||
      localStorage.getItem("staffToken") ||
      localStorage.getItem("hostToken") ||
      localStorage.getItem("token");

    return raw || null; // 🔥 DO NOT PARSE
  };

  useEffect(() => {
    if (!paymentData) return;

    const fetchQr = async () => {
      try {
        const token = getToken(); // 🔥 Use raw token string

        const res = await axios.get(
          `${API_BASE_URL}/payments/purchase/${paymentData.purchaseId}/qrcode`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant-ID": HOST_Tenant_ID,
            },
          }
        );

        setQrCode(res.data?.data?.qrCode || null);
      } catch (err) {
        console.error("QR Code fetch failed:", err);
      }
    };

    fetchQr();
  }, [paymentData]);

  return (
    <main className="bg-white text-black dark:bg-[#101010] dark:text-gray-100 transition-colors duration-300">
      {/* Header */}
      <Header />

      {/* Main section */}
      <section className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-8 py-10 md:py-20">
        {/* Success heading */}
        <div className="text-center mb-10 sm:mb-14">
          <h1 className="text-[24px] sm:text-[30px] md:text-[36px] font-semibold text-[#89FC00] italic">
            Payment Successful!
          </h1>
          <p className="mt-2 text-[14px] sm:text-[16px] text-gray-700 dark:text-gray-300">
            {paymentData?.event?.name
              ? `You got your ticket for ${paymentData.event.name}. Download it here.`
              : "You got your ticket. Download it here."}
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10">
          {/* Left Column */}
          <div className="px-2 sm:px-4 lg:pl-8 lg:pr-4">
            <h2 className="text-[18px] sm:text-[22px] font-bold mb-2">
              Congratulations!
            </h2>

            <p className="text-[14px] sm:text-[16px] text-gray-700 dark:text-gray-300 leading-relaxed mb-6 sm:mb-8">
              You’ve successfully purchased the ticket for:
              <br />
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {paymentData?.event?.name || "Event Name"}
              </span>
            </p>

            <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-700 mb-4 sm:mb-6" />

            {/* Item Details */}
            <div className="mb-6 sm:mb-10">
              <h3 className="text-[16px] sm:text-[18px] font-semibold mb-3 sm:mb-4">
                Item Details
              </h3>
              <div className="space-y-1 sm:space-y-2 text-[14px] sm:text-[15px]">
                <Line label="Item" value={paymentData?.event?.name || "N/A"} />
                <Line
                  label="Ticket"
                  value={paymentData?.ticket?.name || "N/A"}
                />
                <Line
                  label="Quantity"
                  value={
                    paymentData?.ticket?.quantity
                      ? `${paymentData.ticket.quantity} Ticket(s)`
                      : "N/A"
                  }
                />
                <Line
                  label="Amount"
                  value={
                    paymentData?.payment?.totalAmount
                      ? `$${paymentData.payment.totalAmount}`
                      : "$0"
                  }
                />
              </div>
            </div>

            <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-700 mb-4 sm:mb-6" />

            {/* Customer Details */}
            <div className="mb-8 sm:mb-12">
              <h3 className="text-[16px] sm:text-[18px] font-semibold mb-3 sm:mb-4">
                Customer details
              </h3>
              <div className="space-y-1 sm:space-y-2 text-[14px] sm:text-[15px]">
                <Line label="Name" value={paymentData?.buyer?.name || "N/A"} />
                <Line
                  label="Email"
                  value={paymentData?.buyer?.email || "N/A"}
                />
                {/* <Line label="Contact Number" value="Not Provided" /> */}
              </div>
            </div>

            <p className="text-[16px] sm:text-[20px] leading-relaxed">
              Thank you for choosing us
            </p>
          </div>

          {/* Right Column - Ticket Card */}
          <aside className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[380px]">
              {/* Ticket Card */}
              <div className="rounded-[18px] bg-[#0077F7] p-5 sm:p-6 text-white shadow-lg">
                <h4 className="text-[16px] sm:text-[18px] font-semibold mb-1">
                  Download Your Tickets!
                </h4>

                <p className="text-xs sm:text-sm text-white/90 mb-3 sm:mb-4">
                  {paymentData?.event?.name || "Event Name"}
                </p>

                {/* QR */}
                <div className="flex flex-col items-center mb-3 sm:mb-4">
                  {qrCode ? (
                    // <Image
                    //   src={qrCode}
                    //   alt="Ticket QR Code"
                    //   width={180}
                    //   height={180}
                    //   className="h-[150px] sm:h-[200px] w-[150px] sm:w-[200px] object-contain"
                    // />
                    <img
                      src={qrCode}
                      alt="QR Code"
                      className="h-[150px] sm:h-[200px] w-[150px] sm:w-[200px] object-contain"
                    />
                  ) : (
                    <p className="text-white/80 text-sm">Loading QR Code...</p>
                  )}

                  <p className="mt-2 sm:mt-3 text-center text-[10px] sm:text-[12px] tracking-wider text-white/80">
                    {paymentData?.confirmationNumber || "TCK-XXXXXX"}
                  </p>
                </div>

                {/* Ticket Info */}
                <div className="text-[12px] sm:text-[14px] space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      {paymentData?.ticket?.quantity || 1} Ticket(s)
                    </span>
                    <span className="font-semibold">
                      ${paymentData?.payment?.totalAmount || "0.00"}
                    </span>
                  </div>

                  <p className="font-semibold">
                    Event:{" "}
                    <span className="font-normal">
                      {paymentData?.event?.name || "N/A"}
                    </span>
                  </p>

                  <p className="font-semibold">
                    Status:{" "}
                    <span className="font-normal capitalize">
                      {paymentData?.status || "Succeeded"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
                <button className="h-9 sm:h-10 w-full flex-1 rounded-[10px] bg-[#0077F7] sm:text-[12px] text-[10px] font-medium text-white hover:bg-[#0066D6] transition">
                  Download Ticket
                </button>

                <Link href="/tickets">
                  <button className="h-9 sm:h-10 w-[90px] sm:w-[110px] flex-1 rounded-[10px] bg-black dark:bg-gray-200 sm:text-[12px] text-[10px] font-medium text-white dark:text-black hover:bg-black/90 dark:hover:bg-gray-300 transition">
                    My Tickets
                  </button>
                </Link>

                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="h-9 sm:h-10 w-full flex-1 rounded-[10px] bg-[#E5EBF3] dark:bg-gray-800 sm:text-[12px] text-[10px] font-medium text-black dark:text-gray-100 hover:bg-[#d6dee7] dark:hover:bg-gray-700 transition"
                >
                  Share Ticket
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Calendar Modal */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        eventTitle={paymentData?.event?.name || "Event"}
        eventDescription="Enjoy your event!"
        eventImage="/images/hero-image.png"
        initialDate={new Date()}
      />

      {/* Share Ticket Modal */}
      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent
          aria-describedby={undefined}
          className="p-0 border-0 rounded-[20px] sm:rounded-[24px] shadow-2xl overflow-hidden transition-colors duration-300 bg-white dark:bg-[#1a1a1a]"
          style={{ width: "95%", maxWidth: 504 }}
        >
          <div className="relative py-3">
            <DialogTitle className="sr-only">Share with friends</DialogTitle>
            <h2 className="text-center text-[16px] sm:text-[20px] font-semibold text-black dark:text-gray-100">
              Share with friends
            </h2>
          </div>

          {/* Blue Ticket */}
          <div className="px-4 sm:px-8 pb-6 sm:pb-8">
            <div className="rounded-[16px] sm:rounded-[24px] px-5 sm:px-10 pt-2 pb-4 bg-[#0077F7]">
              <p className="text-[14px] sm:text-[18px] font-semibold text-center text-white">
                Download Your Tickets!
              </p>
              <p className="mt-1 text-[11px] sm:text-sm text-center text-[#E6F0FF]">
                {paymentData?.event?.name || "Event Name"}
              </p>

              <div className="mt-3 sm:mt-2 flex items-center justify-center">
                <img
                  src="/images/qr.png"
                  alt="Ticket QR"
                  className="h-[120px] sm:h-[160px] w-[150px] sm:w-[200px] object-contain"
                />
              </div>

              <p className="mt-3 sm:mt-4 text-center text-[9px] sm:text-[10px] text-[#E6F0FF]">
                {paymentData?.confirmationNumber || "TCK-XXXXXX"}
              </p>

              <div className="mt-2 grid grid-cols-2 gap-y-1 sm:gap-y-2 text-[12px] sm:text-[15px] font-semibold text-white">
                <p>{paymentData?.ticket?.quantity || 1} Ticket(s)</p>
                <p className="text-right">
                  ${paymentData?.payment?.totalAmount || "0.00"}
                </p>
                <p>Event: {paymentData?.event?.name || "N/A"}</p>
                <span />
                <p>Status: {paymentData?.status || "Succeeded"}</p>
                <p className="text-right"></p>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-4">
              <button className="h-[36px] sm:h-[38px] rounded-[12px] sm:rounded-[16px] text-[13px] sm:text-[16px] font-medium bg-[#0077F7] text-white hover:bg-[#0066D6] transition">
                Download Ticket
              </button>
              <button
                className="h-[36px] sm:h-[38px] rounded-[12px] sm:rounded-[16px] text-[13px] sm:text-[16px] font-medium bg-black text-white dark:bg-gray-200 dark:text-black"
                onClick={() => {
                  setIsCalendarOpen(true);
                  setIsShareModalOpen(false);
                }}
              >
                Add to Calendar
              </button>
            </div>

            {/* Social Icons */}
            <div className="mt-3 flex items-center justify-center gap-3 sm:gap-4">
              {[
                {
                  src: "logos_facebook-Jtw5MId1zN6F2CaO7jdeBLZnsp1Tfo.png",
                  alt: "Facebook",
                },
                {
                  src: "devicon_twitter-XIKmcJqnv48zaeoNmUGkIwXCyqTUUL.png",
                  alt: "Twitter",
                },
                {
                  src: "logos_whatsapp-icon-42dAiekQtKgMVQ4IshlAJYT8fk1Tzj.png",
                  alt: "WhatsApp",
                },
                {
                  src: "devicon_linkedin-M4x4xBEND56ARk8e2Pf80IJKHrpm8C.png",
                  alt: "LinkedIn",
                },
              ].map((icon, i) => (
                <span
                  key={i}
                  className="h-[32px] sm:h-[40px] w-[32px] sm:w-[40px] rounded-full grid place-items-center bg-[#F9FAFB]"
                >
                  <img
                    src={`https://hebbkx1anhila5yf.public.blob.vercel-storage.com/${icon.src}`}
                    alt={icon.alt}
                    className="h-[16px] sm:h-[20px] w-[16px] sm:w-[20px] object-contain"
                  />
                </span>
              ))}
            </div>

            {/* Event URL */}
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 rounded-[12px] pl-4 sm:pl-5 pr-3 sm:pr-4 py-3 sm:py-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#101010] shadow-sm transition-colors">
              <div className="flex-1">
                <p className="text-[12px] sm:text-[14px] font-medium text-black dark:text-gray-100">
                  Event URL
                </p>
                <p className="mt-[2px] text-[12px] sm:text-[14px] text-black dark:text-gray-300 truncate">
                  https://event.com/{paymentData?.event?.id || ""}
                </p>
              </div>
              <button
                aria-label="Copy event URL"
                onClick={() =>
                  navigator.clipboard.writeText(
                    `https://event.com/${paymentData?.event?.id || ""}`
                  )
                }
                className="h-[38px] sm:h-[44px] w-[40px] sm:w-[45px] rounded-full grid place-items-center border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Copy%20icon-hLC2rCxtTJjCbcRBhJtTz8ILcRgA3h.png"
                  alt="Copy"
                  className="h-[18px] sm:h-[24px] w-[18px] sm:w-[24px]"
                />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

/* Reusable text line */
function Line({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-gray-700 dark:text-gray-300 text-[14px] sm:text-[15px]">
      <span className="font-normal">{label}:</span> {value}
    </p>
  );
}
