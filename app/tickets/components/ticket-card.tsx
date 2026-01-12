"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TransferTicketModal } from "../components/transfer-ticket-modal";
import { RefundRequestModal } from "../components/refund-request-modal";
// import axios from "axios";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";
import { useToast } from "@/components/ui/use-toast";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import QRCode from "qrcode";
import { apiClient } from "@/lib/apiClient";

type TicketProps = {
  eventId: string;
  userTicketId: string;
  purchaseId: string;

  date: { day: string; month: string; weekday: string; time: string };
  title: string;
  location: string;
  type: string;
  price: string;

  quantity: number;
  originalQuantity?: number;

  ended?: boolean;
  highlight?: boolean;

  isReceived?: boolean;
  canTransfer?: boolean;

  transferredOut?: boolean;

  badge?: {
    variant: "IN" | "OUT";
    label: "Transferred From" | "Transferred To";
    fullName: string;
    email?: string;
  };

  /* 🔥 NEW */
  status: "ACTIVE" | "USED";
  verifiedAt?: string;

  issuedTickets?: { id: string; ticketNumber: number }[];
  confirmationNumber?: string;
};

export function TicketCard({
  eventId,
  userTicketId,
  purchaseId,
  date,
  title,
  location,
  type,
  price,
  quantity,
  originalQuantity = quantity,
  ended = false,
  highlight = false,
  isReceived = false,
  canTransfer = true,
  transferredOut = false,
  badge,

  /* 🔥 ADD THESE */
  status,
  verifiedAt,

  issuedTickets = [],
  confirmationNumber = "",
}: TicketProps) {
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [refundModalOpen, setRefundModalOpen] = useState(false);

  const isUsed = status === "USED";
  const isLocked = isUsed || ended;

  const { toast } = useToast();

  const getToken = () =>
    localStorage.getItem("buyerToken") ||
    localStorage.getItem("staffToken") ||
    localStorage.getItem("hostToken") ||
    localStorage.getItem("token");

  const canDownload = useMemo(() => {
    return (
      !isLocked &&
      !transferredOut &&
      issuedTickets.length > 0 &&
      !!confirmationNumber
    );
  }, [isLocked, transferredOut, issuedTickets.length, confirmationNumber]);

  const handleDownloadTickets = () => {
    if (!canDownload) {
      toast({
        variant: "destructive",
        title: "Download unavailable",
        description: "Ticket download data is not available yet.",
      });
      return;
    }

    downloadTicketsZip({
      issuedTickets,
      confirmationNumber,
      getToken,
    });
  };

  const showTransferActions = !isLocked && !transferredOut && !isReceived;
  const transferDisabled = isLocked || !canTransfer || quantity <= 0;

  const submitRefundRequest = async (data: {
    reason: string;
    refundMedium: string;
    refundQuantity: number;
    requestedAt: string;
  }) => {
    const token = getToken();
    if (!token) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to request a refund.",
      });
      return;
    }

    try {
      const payload = {
        purchaseId,
        userTicketId,
        refundQuantity: data.refundQuantity,
        reason: data.reason,
        refundMedium: data.refundMedium,
        requestedAt: data.requestedAt,
      };

      // const res = await axios.post(
      //   `${API_BASE_URL}/tickets/refund-request`,
      //   payload,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "X-Tenant-ID": HOST_Tenant_ID,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );

      const res = await apiClient.post(`/tickets/refund-request`, payload);

      toast({
        title: "Refund request submitted",
        description:
          res.data?.message ||
          "Your refund request has been sent successfully.",
      });

      setRefundModalOpen(false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to create refund request";

      toast({
        variant: "destructive",
        title: "Refund request failed",
        description: msg,
      });
    }
  };

  const downloadEventTicketsZip = async (eventId: string) => {
    try {
      const raw =
        localStorage.getItem("buyerToken") ||
        localStorage.getItem("staffToken") ||
        localStorage.getItem("hostToken") ||
        localStorage.getItem("token");

      if (!raw) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please login again to download tickets.",
        });
        return;
      }

      const token = raw.startsWith("{") ? JSON.parse(raw)?.token : raw;

      // const res = await axios.get(
      //   `${API_BASE_URL}/tickets/event/${eventId}/qr`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "X-Tenant-ID": HOST_Tenant_ID,
      //     },
      //   }
      // );

      const res = await apiClient.get(`/tickets/event/${eventId}/qr`);

      const tickets = Array.isArray(res.data?.data) ? res.data.data : [];
      if (!tickets.length) {
        toast({
          variant: "destructive",
          title: "Download failed",
          description: "No tickets found for this event",
        });
        return;
      }

      const zip = new JSZip();
      const folder = zip.folder("tickets");

      await Promise.all(
        tickets.map(async (ticket: any, index: number) => {
          /* ───────────────── Canvas Setup ───────────────── */
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          const width = 900;
          const height = 420;
          canvas.width = width;
          canvas.height = height;

          /* ───────────────── Colors ───────────────── */
          const leftBg = "#ffffff";
          const rightBg = "#0B132B";
          const textDark = "#0f172a";
          const textMuted = "#475569";

          /* ───────────────── Background ───────────────── */
          ctx.fillStyle = leftBg;
          ctx.fillRect(0, 0, 600, height);

          ctx.fillStyle = rightBg;
          ctx.fillRect(600, 0, 300, height);

          /* ───────────────── Left Content ───────────────── */
          ctx.fillStyle = textDark;

          // Event title
          ctx.font = "bold 28px Arial";
          ctx.fillText(ticket.metadata.eventName, 40, 55);

          ctx.font = "16px Arial";
          ctx.fillStyle = textMuted;
          ctx.fillText(`📍 Location: ${ticket.metadata.location}`, 40, 100);
          ctx.fillText(
            `📅 Date: ${new Date(ticket.metadata.date).toLocaleDateString()}`,
            40,
            130
          );
          ctx.fillText(`⏰ Time: ${ticket.metadata.time}`, 40, 160);

          // Divider
          ctx.strokeStyle = "#e5e7eb";
          ctx.beginPath();
          ctx.moveTo(40, 185);
          ctx.lineTo(560, 185);
          ctx.stroke();

          // Ticket details
          ctx.fillStyle = textDark;
          ctx.font = "bold 18px Arial";
          ctx.fillText(`🎟 Ticket: ${ticket.metadata.ticketName}`, 40, 225);

          ctx.font = "16px Arial";
          ctx.fillText(`Type: ${ticket.metadata.ticketType}`, 40, 255);
          ctx.fillText(`Price: $${ticket.metadata.price}`, 40, 285);

          ctx.font = "bold 16px Arial";
          ctx.fillText(`Ticket No: #${index + 1}`, 40, 325);
          ctx.fillText(`Ticket Code: ${ticket.metadata.ticketCode}`, 40, 355);

          /* ───────────────── QR Code ───────────────── */
          const qrDataUrl = await QRCode.toDataURL(ticket.qrCode, {
            width: 300,
            margin: 1,
          });

          const qrImg = new window.Image();
          qrImg.src = qrDataUrl;
          await new Promise((resolve) => (qrImg.onload = resolve));

          const qrSize = 180;
          const qrX = 600 + (300 - qrSize) / 2;
          const qrY = 95;
          ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

          // Scan text
          ctx.fillStyle = "#ffffff";
          ctx.font = "14px Arial";
          ctx.textAlign = "center";
          ctx.fillText("Scan at Entry", 750, qrY + qrSize + 28);
          ctx.textAlign = "left";

          /* ───────────────── Save PNG ───────────────── */
          const base64 = canvas
            .toDataURL("image/png")
            .replace(/^data:image\/png;base64,/, "");

          folder?.file(`ticket-${index + 1}.png`, base64, {
            base64: true,
          });
        })
      );

      const blob = await zip.generateAsync({ type: "blob" });
      saveAs(blob, `event-${eventId}-tickets.zip`);
    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Download failed",
        description: "Failed to download tickets",
      });
    }
  };

  return (
    <>
      {/* Ticket Card */}
      <div
        className={cn(
          "rounded-xl border border-border dark:border-gray-700",
          "bg-card dark:bg-[#181818] text-card-foreground dark:text-gray-100",
          "overflow-hidden flex flex-col sm:flex-row",
          "transition hover:shadow-lg dark:hover:shadow-blue-500/10"
        )}
      >
        {/* Date Rail */}
        <div
          className={cn(
            "w-full sm:w-[120px] shrink-0",
            "flex flex-row sm:flex-col items-center justify-between sm:justify-center",
            "p-3 sm:p-4 text-center",
            highlight
              ? "bg-[#0077F7] text-white"
              : "bg-[#EDEDED] text-black dark:bg-[#222222] dark:text-gray-100"
          )}
        >
          <div>
            <div className="text-[18px] sm:text-[22px] font-semibold">
              {date.day}
            </div>
            <div className="text-[11px] uppercase tracking-wide">
              {date.month}
            </div>
          </div>

          <div className="hidden sm:block mt-4 text-[11px] font-medium">
            <div>{date.weekday}</div>
            <div>{date.time}</div>
          </div>

          <div className="block sm:hidden text-[11px] font-medium text-right">
            {date.weekday}, {date.time}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <div className="space-y-2">
              <h3 className="text-[16px] sm:text-[20px] font-semibold">
                {title}
              </h3>

              {/* ✅ USED & VERIFIED BADGE — ADD HERE */}
              {isUsed && (
                <div className="flex flex-col gap-1">
                  <span
                    className="
          inline-flex items-center gap-1
          w-fit
          px-3 py-1 rounded-full
          text-[11px] font-semibold
          bg-green-100 text-green-800
          dark:bg-green-900/30 dark:text-green-300
        "
                  >
                    ✅ Used & Verified
                  </span>

                  {verifiedAt && (
                    <span className="text-[11px] text-gray-500 dark:text-gray-400">
                      Verified on {new Date(verifiedAt).toLocaleString()}
                    </span>
                  )}
                </div>
              )}

              <div className="space-y-1 text-[13px] sm:text-[14px]">
                <div className="flex items-center gap-2">
                  <Image
                    src="/icons/location.png"
                    width={15}
                    height={15}
                    alt=""
                    className="dark:invert"
                  />
                  <span>{location}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Image
                    src="/icons/ticket.png"
                    width={15}
                    height={15}
                    alt=""
                    className="dark:invert"
                  />
                  <span>{type}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Image
                    src="/icons/ticket.png"
                    width={15}
                    height={15}
                    alt=""
                    className="dark:invert"
                  />
                  <span>
                    {quantity} {quantity === 1 ? "Ticket" : "Tickets"}
                    {originalQuantity !== quantity && (
                      <span className="text-gray-500 dark:text-gray-400">
                        {" "}
                        / {originalQuantity}
                      </span>
                    )}
                  </span>
                </div>

                {/* Transfer badge */}
                {badge && (
                  <div className="pt-1">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold",
                        badge.variant === "IN"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                      )}
                      title={badge.email || ""}
                    >
                      {badge.label}: {badge.fullName}
                    </span>

                    {isReceived && (
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                        This ticket was received via transfer.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Price + Actions */}
            <div className="flex flex-col sm:items-end gap-3">
              {showTransferActions && (
                <div className="relative flex items-center gap-2">
                  <button
                    disabled={transferDisabled}
                    onClick={() => setTransferModalOpen(true)}
                    className={cn(
                      "rounded-full px-4 py-1.5 text-[11px] text-white",
                      transferDisabled
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-black dark:bg-[#0077F7]"
                    )}
                  >
                    Transfer
                  </button>

                  <button
                    onClick={() => setMenuOpen((p) => !p)}
                    className="h-8 w-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    ⋯
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-10 w-44 bg-white dark:bg-[#1f1f1f] border rounded-lg shadow-lg z-50">
                      <button
                        onClick={() => {
                          setRefundModalOpen(true);
                          setMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        Request Refund
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className="text-[16px] sm:text-[22px] font-semibold">
                {price}
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="flex flex-wrap gap-2">
            {transferredOut ? (
              <span className="h-8 px-4 rounded-full text-[12px] bg-purple-600 text-white">
                Transferred
              </span>
            ) : isUsed ? (
              <span
                className="h-8 px-4 rounded-full text-[12px]
    bg-green-600 text-white"
              >
                Used Ticket
              </span>
            ) : ended ? (
              <span
                className="h-8 px-4 rounded-full text-[12px]
    bg-gray-300 dark:bg-[#333] text-gray-700"
              >
                Event Ended
              </span>
            ) : (
              <button
                onClick={() => downloadEventTicketsZip(eventId)}
                className="h-8 px-4 rounded-full text-[12px] text-white bg-[#0077F7]"
              >
                Download Tickets
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Transfer Ticket Modal */}
      <TransferTicketModal
        open={transferModalOpen}
        onOpenChange={setTransferModalOpen}
        ticket={{
          purchaseId, // ✅ IMPORTANT
          maxQuantity: quantity, // ✅ enforce transfer quantity <= owned quantity
          date,
          title,
          location,
          type,
          price,
        }}
      />

      {/* Refund Request Modal */}
      <RefundRequestModal
        open={refundModalOpen}
        ticketQuantity={quantity}
        onClose={() => setRefundModalOpen(false)}
        onSubmit={submitRefundRequest}
      />
    </>
  );
}

// "use client";

// import { useMemo, useState } from "react";
// import Image from "next/image";
// import { cn } from "@/lib/utils";
// import { TransferTicketModal } from "../components/transfer-ticket-modal";
// import { RefundRequestModal } from "../components/refund-request-modal";
// import { downloadTicketsZip } from "@/lib/downloadTicketsZip";

// type TicketProps = {
//   // IDs
//   userTicketId: string; // ownership identity (React key)
//   purchaseId: string; // IMPORTANT: used for transfer payload (sent as ticketId)

//   // UI basics
//   date: { day: string; month: string; weekday: string; time: string };
//   title: string;
//   location: string;
//   type: string;
//   price: string;

//   // quantities
//   quantity: number;
//   originalQuantity?: number;

//   // flags
//   ended?: boolean;
//   highlight?: boolean;

//   // backend-driven transfer rules
//   isReceived?: boolean;
//   canTransfer?: boolean;

//   // transferred tab item
//   transferredOut?: boolean;

//   // badges
//   badge?: {
//     variant: "IN" | "OUT";
//     label: "Transferred From" | "Transferred To";
//     fullName: string;
//     email?: string;
//   };

//   // download (optional for now)
//   issuedTickets?: { id: string; ticketNumber: number }[];
//   confirmationNumber?: string;
// };

// export function TicketCard({
//   userTicketId,
//   purchaseId,
//   date,
//   title,
//   location,
//   type,
//   price,
//   quantity,
//   originalQuantity = quantity,
//   ended = false,
//   highlight = false,
//   isReceived = false,
//   canTransfer = true,
//   transferredOut = false,
//   badge,
//   issuedTickets = [],
//   confirmationNumber = "",
// }: TicketProps) {
//   const [transferModalOpen, setTransferModalOpen] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [refundModalOpen, setRefundModalOpen] = useState(false);

//   const getToken = () =>
//     localStorage.getItem("buyerToken") ||
//     localStorage.getItem("staffToken") ||
//     localStorage.getItem("hostToken") ||
//     localStorage.getItem("token");

//   const canDownload = useMemo(() => {
//     // Only possible if backend provides issuedTickets + confirmationNumber.
//     return (
//       !ended &&
//       !transferredOut &&
//       issuedTickets.length > 0 &&
//       !!confirmationNumber
//     );
//   }, [ended, transferredOut, issuedTickets.length, confirmationNumber]);

//   const handleDownloadTickets = () => {
//     if (!canDownload) {
//       alert("Ticket download data is not available yet.");
//       return;
//     }

//     downloadTicketsZip({
//       issuedTickets,
//       confirmationNumber,
//       getToken,
//     });
//   };

//   // Transfer button should be hidden/disabled based on backend flags
//   // const showTransferActions = !ended && !transferredOut;
//   const showTransferActions = !ended && !transferredOut && !isReceived; // 🔴 IMPORTANT: hide actions for "Transferred From"

//   const transferDisabled = !canTransfer || quantity <= 0;

//   return (
//     <>
//       {/* Ticket Card */}
//       <div
//         className={cn(
//           "rounded-xl border border-border dark:border-gray-700",
//           "bg-card dark:bg-[#181818] text-card-foreground dark:text-gray-100",
//           "overflow-hidden flex flex-col sm:flex-row",
//           "transition hover:shadow-lg dark:hover:shadow-blue-500/10"
//         )}
//       >
//         {/* Date Rail */}
//         <div
//           className={cn(
//             "w-full sm:w-[120px] shrink-0",
//             "flex flex-row sm:flex-col items-center justify-between sm:justify-center",
//             "p-3 sm:p-4 text-center",
//             highlight
//               ? "bg-[#0077F7] text-white"
//               : "bg-[#EDEDED] text-black dark:bg-[#222222] dark:text-gray-100"
//           )}
//         >
//           <div>
//             <div className="text-[18px] sm:text-[22px] font-semibold">
//               {date.day}
//             </div>
//             <div className="text-[11px] uppercase tracking-wide">
//               {date.month}
//             </div>
//           </div>

//           <div className="hidden sm:block mt-4 text-[11px] font-medium">
//             <div>{date.weekday}</div>
//             <div>{date.time}</div>
//           </div>

//           <div className="block sm:hidden text-[11px] font-medium text-right">
//             {date.weekday}, {date.time}
//           </div>
//         </div>

//         {/* Content */}
//         <div className="flex-1 p-4 sm:p-6 flex flex-col gap-4">
//           <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
//             <div className="space-y-2">
//               <h3 className="text-[16px] sm:text-[20px] font-semibold">
//                 {title}
//               </h3>

//               <div className="space-y-1 text-[13px] sm:text-[14px]">
//                 <div className="flex items-center gap-2">
//                   <Image
//                     src="/icons/location.png"
//                     width={15}
//                     height={15}
//                     alt=""
//                     className="dark:invert"
//                   />
//                   <span>{location}</span>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <Image
//                     src="/icons/ticket.png"
//                     width={15}
//                     height={15}
//                     alt=""
//                     className="dark:invert"
//                   />
//                   <span>{type}</span>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <Image
//                     src="/icons/ticket.png"
//                     width={15}
//                     height={15}
//                     alt=""
//                     className="dark:invert"
//                   />
//                   <span>
//                     {quantity} {quantity === 1 ? "Ticket" : "Tickets"}
//                     {originalQuantity !== quantity && (
//                       <span className="text-gray-500 dark:text-gray-400">
//                         {" "}
//                         / {originalQuantity}
//                       </span>
//                     )}
//                   </span>
//                 </div>

//                 {/* Transfer badge */}
//                 {badge && (
//                   <div className="pt-1">
//                     <span
//                       className={cn(
//                         "inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold",
//                         badge.variant === "IN"
//                           ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
//                           : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
//                       )}
//                       title={badge.email || ""}
//                     >
//                       {badge.label}: {badge.fullName}
//                     </span>

//                     {isReceived && (
//                       <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
//                         This ticket was received via transfer.
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Price + Actions */}
//             <div className="flex flex-col sm:items-end gap-3">
//               {showTransferActions && (
//                 <div className="relative flex items-center gap-2">
//                   <button
//                     disabled={transferDisabled}
//                     onClick={() => setTransferModalOpen(true)}
//                     className={cn(
//                       "rounded-full px-4 py-1.5 text-[11px] text-white",
//                       transferDisabled
//                         ? "bg-gray-400 cursor-not-allowed"
//                         : "bg-black dark:bg-[#0077F7]"
//                     )}
//                   >
//                     Transfer
//                   </button>

//                   <button
//                     onClick={() => setMenuOpen((p) => !p)}
//                     className="h-8 w-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
//                   >
//                     ⋯
//                   </button>

//                   {menuOpen && (
//                     <div className="absolute right-0 top-10 w-44 bg-white dark:bg-[#1f1f1f] border rounded-lg shadow-lg z-50">
//                       <button
//                         onClick={() => {
//                           setRefundModalOpen(true);
//                           setMenuOpen(false);
//                         }}
//                         className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800"
//                       >
//                         Request Refund
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}

//               <div className="text-[16px] sm:text-[22px] font-semibold">
//                 {price}
//               </div>
//             </div>
//           </div>

//           {/* Bottom CTA */}
//           <div className="flex flex-wrap gap-2">
//             {transferredOut ? (
//               <span className="h-8 px-4 rounded-full text-[12px] bg-purple-600 text-white">
//                 Transferred
//               </span>
//             ) : ended ? (
//               <span className="h-8 px-4 rounded-full text-[12px] bg-gray-300 dark:bg-[#333] text-gray-700">
//                 Event Ended
//               </span>
//             ) : (
//               <button
//                 onClick={handleDownloadTickets}
//                 disabled={!canDownload}
//                 className={cn(
//                   "h-8 px-4 rounded-full text-[12px] text-white",
//                   canDownload
//                     ? "bg-[#0077F7]"
//                     : "bg-gray-400 cursor-not-allowed"
//                 )}
//               >
//                 Download Tickets
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Transfer Ticket Modal */}
//       <TransferTicketModal
//         open={transferModalOpen}
//         onOpenChange={setTransferModalOpen}
//         ticket={{
//           purchaseId, // ✅ IMPORTANT
//           maxQuantity: quantity, // ✅ enforce transfer quantity <= owned quantity
//           date,
//           title,
//           location,
//           type,
//           price,
//         }}
//       />

//       {/* <RefundRequestModal
//         open={refundModalOpen}
//         onClose={() => setRefundModalOpen(false)}
//         onSubmit={(data) =>
//           console.log("REFUND REQUEST:", {
//             ticketTitle: title,
//             purchaseId,
//             userTicketId,
//             ...data,
//           })
//         }
//       /> */}

//       <RefundRequestModal
//         open={refundModalOpen}
//         ticketQuantity={quantity} // ✅ CORRECT
//         onClose={() => setRefundModalOpen(false)}
//         onSubmit={(data) =>
//           console.log("REFUND REQUEST PAYLOAD", {
//             ticketTitle: title,
//             purchaseId,
//             userTicketId,
//             ...data,
//           })
//         }
//       />
//     </>
//   );
// }

// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { cn } from "@/lib/utils";
// import { TransferTicketModal } from "../components/transfer-ticket-modal";
// import { RefundRequestModal } from "../components/refund-request-modal";
// import { downloadTicketsZip } from "@/lib/downloadTicketsZip";

// type TicketProps = {
//   ticketId: string; // ✅ REQUIRED
//   date: { day: string; month: string; weekday: string; time: string };
//   title: string;
//   location: string;
//   type: string;
//   price: string;
//   quantity: number;
//   cta?: string;
//   ended?: boolean;
//   highlight?: boolean;
//   transferred?: boolean;
//   issuedTickets: { id: string; ticketNumber: number }[];
//   confirmationNumber: string;
// };

// export function TicketCard({
//   ticketId, // ✅ destructured
//   date,
//   title,
//   location,
//   type,
//   price,
//   quantity,
//   cta = "View Ticket",
//   ended = false,
//   highlight = false,
//   transferred = false,
//   issuedTickets,
//   confirmationNumber,
// }: TicketProps) {
//   const [transferModalOpen, setTransferModalOpen] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [refundModalOpen, setRefundModalOpen] = useState(false);

//   const getToken = () =>
//     localStorage.getItem("buyerToken") ||
//     localStorage.getItem("staffToken") ||
//     localStorage.getItem("hostToken") ||
//     localStorage.getItem("token");

//   const handleDownloadTickets = () => {
//     downloadTicketsZip({
//       issuedTickets,
//       confirmationNumber,
//       getToken,
//     });
//   };

//   return (
//     <>
//       {/* Ticket Card */}
//       <div
//         className={cn(
//           "rounded-xl border border-border dark:border-gray-700",
//           "bg-card dark:bg-[#181818] text-card-foreground dark:text-gray-100",
//           "overflow-hidden flex flex-col sm:flex-row",
//           "transition hover:shadow-lg dark:hover:shadow-blue-500/10"
//         )}
//       >
//         {/* Date Rail */}
//         <div
//           className={cn(
//             "w-full sm:w-[120px] shrink-0",
//             "flex flex-row sm:flex-col items-center justify-between sm:justify-center",
//             "p-3 sm:p-4 text-center",
//             highlight
//               ? "bg-[#0077F7] text-white"
//               : "bg-[#EDEDED] text-black dark:bg-[#222222] dark:text-gray-100"
//           )}
//         >
//           <div>
//             <div className="text-[18px] sm:text-[22px] font-semibold">
//               {date.day}
//             </div>
//             <div className="text-[11px] uppercase tracking-wide">
//               {date.month}
//             </div>
//           </div>

//           <div className="hidden sm:block mt-4 text-[11px] font-medium">
//             <div>{date.weekday}</div>
//             <div>{date.time}</div>
//           </div>

//           <div className="block sm:hidden text-[11px] font-medium text-right">
//             {date.weekday}, {date.time}
//           </div>
//         </div>

//         {/* Content */}
//         <div className="flex-1 p-4 sm:p-6 flex flex-col gap-4">
//           <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
//             <div className="space-y-2">
//               <h3 className="text-[16px] sm:text-[20px] font-semibold">
//                 {title}
//               </h3>

//               <div className="space-y-1 text-[13px] sm:text-[14px]">
//                 <div className="flex items-center gap-2">
//                   <Image
//                     src="/icons/location.png"
//                     width={15}
//                     height={15}
//                     alt=""
//                     className="dark:invert"
//                   />
//                   <span>{location}</span>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <Image
//                     src="/icons/ticket.png"
//                     width={15}
//                     height={15}
//                     alt=""
//                     className="dark:invert"
//                   />
//                   <span>{type}</span>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <Image
//                     src="/icons/ticket.png"
//                     width={15}
//                     height={15}
//                     alt=""
//                     className="dark:invert"
//                   />
//                   <span>
//                     {quantity} {quantity === 1 ? "Ticket" : "Tickets"}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Price + Actions */}
//             <div className="flex flex-col sm:items-end gap-3">
//               {!ended && (
//                 <div className="relative flex items-center gap-2">
//                   <button
//                     onClick={() => setTransferModalOpen(true)}
//                     className="rounded-full px-4 py-1.5 text-[11px] text-white bg-black dark:bg-[#0077F7]"
//                   >
//                     Transfer
//                   </button>

//                   <button
//                     onClick={() => setMenuOpen((p) => !p)}
//                     className="h-8 w-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
//                   >
//                     ⋯
//                   </button>

//                   {menuOpen && (
//                     <div className="absolute right-0 top-10 w-44 bg-white dark:bg-[#1f1f1f] border rounded-lg shadow-lg z-50">
//                       <button
//                         onClick={() => {
//                           setRefundModalOpen(true);
//                           setMenuOpen(false);
//                         }}
//                         className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800"
//                       >
//                         Request Refund
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}

//               <div className="text-[16px] sm:text-[22px] font-semibold">
//                 {price}
//               </div>
//             </div>
//           </div>

//           {/* Bottom CTA */}
//           <div className="flex flex-wrap gap-2">
//             {transferred ? (
//               <span className="h-8 px-4 rounded-full text-[12px] bg-purple-600 text-white">
//                 Transferred
//               </span>
//             ) : ended ? (
//               <span className="h-8 px-4 rounded-full text-[12px] bg-gray-300 dark:bg-[#333] text-gray-700">
//                 Event Ended
//               </span>
//             ) : (
//               <button
//                 onClick={handleDownloadTickets}
//                 className="h-8 px-4 rounded-full text-[12px] bg-[#0077F7] text-white"
//               >
//                 Download Tickets
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ✅ FIXED: ticketId passed */}
//       <TransferTicketModal
//         open={transferModalOpen}
//         onOpenChange={setTransferModalOpen}
//         ticket={{
//           ticketId,
//           date,
//           title,
//           location,
//           type,
//           price,
//         }}
//       />

//       <RefundRequestModal
//         open={refundModalOpen}
//         onClose={() => setRefundModalOpen(false)}
//         onSubmit={(data) =>
//           console.log("REFUND REQUEST:", { ticketTitle: title, ...data })
//         }
//       />
//     </>
//   );
// }

// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { cn } from "@/lib/utils";
// import { TransferTicketModal } from "../components/transfer-ticket-modal";
// import { RefundRequestModal } from "../components/refund-request-modal";
// import { downloadTicketsZip } from "@/lib/downloadTicketsZip";

// type TicketProps = {
//   date: { day: string; month: string; weekday: string; time: string };
//   title: string;
//   location: string;
//   type: string;
//   price: string;
//   quantity: number;
//   cta?: string;
//   ended?: boolean;
//   highlight?: boolean;
//   transferred?: boolean;
//   issuedTickets: { id: string; ticketNumber: number }[];
//   confirmationNumber: string;
// };

// export function TicketCard({
//   date,
//   title,
//   location,
//   type,
//   price,
//   quantity,
//   cta = "View Ticket",
//   ended = false,
//   highlight = false,
//   transferred = false,
// }: TicketProps) {
//   const [transferModalOpen, setTransferModalOpen] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [refundModalOpen, setRefundModalOpen] = useState(false);

//   const handleDownloadTickets = () => {
//     const downloadUrl = `/api/tickets/download?title=${encodeURIComponent(
//       title
//     )}`;

//     const link = document.createElement("a");
//     link.href = downloadUrl;
//     link.download = `${title}-tickets.pdf`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <>
//       {/* Ticket Card */}
//       <div
//         className={cn(
//           "rounded-xl border border-border dark:border-gray-700",
//           "bg-card dark:bg-[#181818] text-card-foreground dark:text-gray-100",
//           "overflow-hidden flex flex-col sm:flex-row",
//           "transition hover:shadow-lg dark:hover:shadow-blue-500/10"
//         )}
//       >
//         {/* Date Rail */}
//         <div
//           className={cn(
//             "w-full sm:w-[120px] shrink-0",
//             "flex flex-row sm:flex-col items-center justify-between sm:justify-center",
//             "p-3 sm:p-4 text-center",
//             highlight
//               ? "bg-[#0077F7] text-white"
//               : "bg-[#EDEDED] text-black dark:bg-[#222222] dark:text-gray-100"
//           )}
//         >
//           <div>
//             <div className="text-[18px] sm:text-[22px] font-semibold">
//               {date.day}
//             </div>
//             <div className="text-[11px] uppercase tracking-wide">
//               {date.month}
//             </div>
//           </div>

//           {/* Desktop only */}
//           <div className="hidden sm:block mt-4 text-[11px] font-medium">
//             <div>{date.weekday}</div>
//             <div>{date.time}</div>
//           </div>

//           {/* Mobile only */}
//           <div className="block sm:hidden text-[11px] font-medium text-right">
//             {date.weekday}, {date.time}
//           </div>
//         </div>

//         {/* Content */}
//         <div className="flex-1 p-4 sm:p-6 flex flex-col gap-4">
//           {/* Top */}
//           <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
//             <div className="space-y-2">
//               <h3 className="text-[16px] sm:text-[20px] font-semibold leading-tight">
//                 {title}
//               </h3>

//               <div className="space-y-1 text-[13px] sm:text-[14px]">
//                 <div className="flex items-center gap-2">
//                   <Image
//                     src="/icons/location.png"
//                     width={15}
//                     height={15}
//                     alt=""
//                     className="dark:invert"
//                   />
//                   <span className="break-words">{location}</span>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <Image
//                     src="/icons/ticket.png"
//                     width={15}
//                     height={15}
//                     alt=""
//                     className="dark:invert"
//                   />
//                   <span>{type}</span>
//                 </div>

//                 <div className="flex items-center gap-2">
//                   <Image
//                     src="/icons/ticket.png"
//                     width={15}
//                     height={15}
//                     alt=""
//                     className="dark:invert"
//                   />
//                   <span>
//                     {quantity} {quantity === 1 ? "Ticket" : "Tickets"}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Price + Actions */}
//             <div className="flex flex-col sm:items-end gap-3">
//               {!ended && (
//                 <div className="relative flex items-center gap-2">
//                   <button
//                     onClick={() => setTransferModalOpen(true)}
//                     className="rounded-full px-4 py-1.5 text-[11px] sm:text-[12px] text-white bg-black dark:bg-[#0077F7]"
//                   >
//                     Transfer
//                   </button>

//                   <button
//                     onClick={() => setMenuOpen((p) => !p)}
//                     className="h-8 w-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center"
//                   >
//                     ⋯
//                   </button>

//                   {menuOpen && (
//                     <div className="absolute right-0 top-10 w-44 bg-white dark:bg-[#1f1f1f] border rounded-lg shadow-lg z-50">
//                       <button
//                         onClick={() => {
//                           setRefundModalOpen(true);
//                           setMenuOpen(false);
//                         }}
//                         className="w-full px-4 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-800"
//                       >
//                         Request Refund
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}

//               <div className="text-[16px] sm:text-[22px] font-semibold">
//                 {price}
//               </div>
//             </div>
//           </div>

//           {/* Bottom CTA */}
//           <div className="flex flex-wrap gap-2">
//             {transferred ? (
//               <span className="h-8 sm:h-9 px-4 rounded-full text-[12px] sm:text-[14px] font-semibold bg-purple-600 text-white grid place-items-center">
//                 Transferred
//               </span>
//             ) : ended ? (
//               <span className="h-8 sm:h-9 px-4 rounded-full text-[12px] sm:text-[14px] font-semibold bg-gray-300 dark:bg-[#333] text-gray-700 dark:text-gray-400 grid place-items-center">
//                 Event Ended
//               </span>
//             ) : (
//               <button
//                 onClick={handleDownloadTickets}
//                 className="h-8 sm:h-9 px-4 rounded-full text-[12px] sm:text-[14px] font-medium bg-[#0077F7] text-white hover:opacity-90 transition"
//               >
//                 Download Tickets
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Modals */}
//       <TransferTicketModal
//         open={transferModalOpen}
//         onOpenChange={setTransferModalOpen}
//         ticket={{ date, title, location, type, price }}
//       />

//       <RefundRequestModal
//         open={refundModalOpen}
//         onClose={() => setRefundModalOpen(false)}
//         onSubmit={(data) => {
//           console.log("REFUND REQUEST:", {
//             ticketTitle: title,
//             ...data,
//           });
//         }}
//       />
//     </>
//   );
// }

// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { cn } from "@/lib/utils";
// import { TransferTicketModal } from "../components/transfer-ticket-modal";
// import { RefundRequestModal } from "../components/refund-request-modal";

// type TicketProps = {
//   date: { day: string; month: string; weekday: string; time: string };
//   title: string;
//   location: string;
//   type: string;
//   price: string;
//   quantity: number; // ✅ NEW
//   cta?: string;
//   ended?: boolean;
//   highlight?: boolean;
//   transferred?: boolean;
// };

// export function TicketCard({
//   date,
//   title,
//   location,
//   type,
//   price,
//   quantity,
//   cta = "View Ticket",
//   ended = false,
//   highlight = false,
//   transferred = false,
// }: TicketProps) {
//   const [transferModalOpen, setTransferModalOpen] = useState(false);

//   const [menuOpen, setMenuOpen] = useState(false);
//   const [refundModalOpen, setRefundModalOpen] = useState(false);

//   const handleDownloadTickets = () => {
//     // Example: backend-generated PDF/ZIP per order
//     // Replace with your real API endpoint
//     const downloadUrl = `/api/tickets/download?title=${encodeURIComponent(
//       title
//     )}`;

//     const link = document.createElement("a");
//     link.href = downloadUrl;
//     link.download = `${title}-tickets.pdf`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <>
//       {/* Ticket card */}
//       <div
//         className={cn(
//           "rounded-xl border border-border dark:border-gray-700 bg-card dark:bg-[#181818] text-card-foreground dark:text-gray-100 overflow-hidden flex flex-col sm:flex-row transition-colors duration-300 hover:shadow-lg dark:hover:shadow-blue-500/10"
//         )}
//       >
//         {/* Left date rail */}
//         <div
//           className={cn(
//             "w-full sm:w-[120px] shrink-0 text-center p-3 sm:p-4 flex sm:block items-center justify-around sm:justify-center",
//             highlight
//               ? "bg-[#0077F7] text-white"
//               : "bg-[#EDEDED] text-black dark:bg-[#222222] dark:text-gray-100"
//           )}
//         >
//           <div className="text-[18px] sm:text-[22px] font-semibold">
//             {date.day}
//           </div>
//           <div className="text-[11px] sm:text-[12px] uppercase tracking-wide">
//             {date.month}
//           </div>
//           <div className="hidden sm:block mt-6 text-[11px] font-medium">
//             {date.weekday}
//           </div>
//           <div className="hidden sm:block text-[11px] font-medium">
//             {date.time}
//           </div>
//           {/* Mobile-only stacked date */}
//           <div className="block sm:hidden text-[10px] font-medium">
//             {date.weekday}, {date.time}
//           </div>
//         </div>

//         {/* Content */}
//         <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
//           <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
//             <div className="space-y-1 sm:space-y-2">
//               <h3 className="text-[16px] sm:text-[20px] font-semibold leading-tight">
//                 {title}
//               </h3>

//               <div className="mt-2 space-y-1 sm:space-y-2 text-[13px] sm:text-[14px]">
//                 {/* Location */}
//                 <div className="flex items-center gap-2">
//                   <Image
//                     src="/icons/location.png"
//                     width={15}
//                     height={15}
//                     alt=""
//                     className="dark:invert"
//                   />
//                   <span>{location}</span>
//                 </div>

//                 {/* Ticket Type */}
//                 <div className="flex items-center gap-2">
//                   <Image
//                     src="/icons/ticket.png"
//                     width={15}
//                     height={15}
//                     alt=""
//                     className="dark:invert"
//                   />
//                   <span>{type}</span>
//                 </div>
//                 {/* Ticket Quantity */}
//                 <div className="flex items-center gap-2">
//                   <Image
//                     src="/icons/ticket.png"
//                     width={15}
//                     height={15}
//                     alt=""
//                     className="dark:invert"
//                   />
//                   <span>
//                     {quantity} {quantity === 1 ? "Ticket" : "Tickets"}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Price + Buttons */}
//             <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:gap-3 gap-2 mt-2 sm:mt-0">
//               {!ended && (
//                 <div className="relative flex items-center gap-2">
//                   {/* Transfer */}
//                   <button
//                     onClick={() => setTransferModalOpen(true)}
//                     className="rounded-full text-white px-3 sm:px-4 py-1 text-[11px] sm:text-[12px] bg-black dark:bg-[#0077F7]"
//                   >
//                     Transfer
//                   </button>

//                   {/* 3-dot menu */}
//                   <button
//                     onClick={() => setMenuOpen((p) => !p)}
//                     className="h-8 w-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center"
//                   >
//                     ⋯
//                   </button>

//                   {/* Dropdown */}
//                   {menuOpen && (
//                     <div className="absolute right-0 top-9 w-44 bg-white dark:bg-[#1f1f1f] border rounded-lg shadow-lg z-50">
//                       <button
//                         onClick={() => {
//                           setRefundModalOpen(true);
//                           setMenuOpen(false);
//                         }}
//                         className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
//                       >
//                         Request Refund
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}

//               <div className="text-[16px] sm:text-[22px] font-semibold">
//                 {price}
//               </div>
//               {/* Ticket Status Button */}
//               {transferred ? (
//                 <span className="h-8 sm:h-9 rounded-full px-4 text-[12px] sm:text-[14px] font-semibold bg-purple-600 text-white grid place-items-center">
//                   Transferred
//                 </span>
//               ) : ended ? (
//                 <span className="h-8 sm:h-9 rounded-full px-4 text-[12px] sm:text-[14px] font-semibold bg-gray-300 dark:bg-[#333] text-gray-700 dark:text-gray-400 grid place-items-center">
//                   Event Ended
//                 </span>
//               ) : (
//                 <button
//                   disabled={ended || transferred}
//                   onClick={handleDownloadTickets}
//                   className={`h-8 sm:h-9 rounded-full px-4 text-[12px] sm:text-[14px] font-medium transition
//     ${
//       ended || transferred
//         ? "bg-gray-400 cursor-not-allowed"
//         : "bg-[#0077F7] text-white hover:opacity-90"
//     }
//   `}
//                 >
//                   Download Tickets
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Transfer Modal */}
//       <TransferTicketModal
//         open={transferModalOpen}
//         onOpenChange={setTransferModalOpen}
//         ticket={{ date, title, location, type, price }}
//       />

//       <RefundRequestModal
//         open={refundModalOpen}
//         onClose={() => setRefundModalOpen(false)}
//         onSubmit={(data) => {
//           console.log("REFUND REQUEST:", {
//             ticketTitle: title,
//             ...data,
//           });

//           // later:
//           // axios.post("/tickets/refund-request", payload)
//         }}
//       />
//     </>
//   );
// }
