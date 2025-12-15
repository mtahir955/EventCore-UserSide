"use client";

import { X } from "lucide-react";
import { useMemo, useState } from "react";
import type { RefundRequest } from "./payment-withdrawal-table";
import { AddCreditModal } from "./add-credit-modal";
import { UploadReceiptModal } from "./upload-receipt-modal";

interface PaymentWithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: RefundRequest | null;

  onDecision: (data: {
    refundRequestId: string;
    decision: "ACCEPT" | "DECLINE";
    note?: string;
  }) => void;

  onAddCredit: (data: {
    refundRequestId: string;
    buyerEmail: string;
    amount: number;
    reason: string;
    expiresAt: string;
  }) => void;

  onSendReceipt: (data: {
    refundRequestId: string;
    buyerEmail: string;
    message: string;
    receiptFileName?: string;
  }) => void;
}

export function PaymentWithdrawalModal({
  isOpen,
  onClose,
  request,
  onDecision,
  onAddCredit,
  onSendReceipt,
}: PaymentWithdrawalModalProps) {
  const [isAddCreditOpen, setIsAddCreditOpen] = useState(false);
  const [isUploadReceiptOpen, setIsUploadReceiptOpen] = useState(false);

  const title = useMemo(() => {
    if (!request) return "Refund Request";
    return `Refund Request • ${request.id}`;
  }, [request]);

  if (!isOpen) return null;

  const handleDecline = () => {
    if (!request) return;
    onDecision({ refundRequestId: request.id, decision: "DECLINE" });
    onClose();
  };

  const handleAccept = () => {
    if (!request) return;
    setIsUploadReceiptOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3 sm:px-6">
        <div className="relative bg-white dark:bg-[#101010] rounded-2xl shadow-2xl w-full max-w-[820px] max-h-[90vh] overflow-y-auto p-5 sm:p-8">
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 hover:opacity-70 transition-opacity"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-foreground" strokeWidth={3} />
          </button>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 pr-10">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                {title}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Review buyer details and take action.
              </p>
            </div>

            {/* Add Credit Button */}
            <button
              onClick={() => setIsAddCreditOpen(true)}
              className="self-start sm:self-auto rounded-full px-4 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: "#0077F7" }}
            >
              + Add Credit
            </button>
          </div>

          {/* Content */}
          {!request ? (
            <div className="mt-8 text-sm text-muted-foreground">
              No request selected.
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
              {/* Left: Buyer Info */}
              <div className="rounded-2xl border border-border dark:border-gray-800 p-5">
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-foreground">
                    {request.buyerName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {request.buyerEmail}
                  </p>
                </div>

                <div className="mt-4 space-y-3 text-sm">
                  <InfoRow label="Phone" value={request.buyerPhone} />
                  <InfoRow label="Event" value={request.eventName} />
                  <InfoRow label="Event Date" value={request.eventDate} />
                  <InfoRow
                    label="Refund Amount"
                    value={`$${request.amount.toFixed(2)}`}
                    strong
                  />
                </div>

                <div className="mt-5 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 px-3 py-2 text-[12px] text-blue-800 dark:text-blue-300">
                  Ensure the refund account and receipt proof are valid before
                  approving.
                </div>
              </div>

              {/* Right: Request Details */}
              <div className="rounded-2xl border border-border dark:border-gray-800 p-5">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  Request Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                  <InfoRow label="Ticket ID" value={request.ticketId} />

                  <InfoRow
                    label="Ticket Type"
                    value={request.ticketType}
                    badge
                    badgeTone={request.ticketType === "VIP" ? "purple" : "blue"}
                  />

                  <InfoRow
                    label="Ticket Price"
                    value={`$${request.ticketPrice.toFixed(2)}`}
                  />

                  <InfoRow label="Request Date" value={request.requestDate} />

                  <InfoRow
                    label="Payment Method"
                    value={request.paymentMethod}
                    badge
                    badgeTone={
                      request.paymentMethod === "Installments"
                        ? "orange"
                        : "green"
                    }
                  />

                  <InfoRow
                    label="Refund Account (Buyer)"
                    value={request.refundAccount}
                    mono
                  />
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <button
                    onClick={handleDecline}
                    className="w-full sm:w-1/2 py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#F5EDE5", color: "#000000" }}
                  >
                    Decline
                  </button>

                  <button
                    onClick={handleAccept}
                    className="w-full sm:w-1/2 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#D19537" }}
                  >
                    Accept
                  </button>
                </div>

                <p className="mt-3 text-xs text-muted-foreground">
                  Accepting will require you to upload a payment receipt for
                  proof and send a confirmation message to the buyer.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Credit Modal */}
      <AddCreditModal
        isOpen={isAddCreditOpen}
        onClose={() => setIsAddCreditOpen(false)}
        buyerEmail={request?.buyerEmail || ""}
        refundRequestId={request?.id || ""}
        totalTicketAmount={request?.ticketPrice || 0} // 👈 HERE
        onSubmit={(payload) => {
          onAddCredit(payload);
          setIsAddCreditOpen(false);
        }}
      />

      {/* Upload Receipt Modal */}
      <UploadReceiptModal
        isOpen={isUploadReceiptOpen}
        onClose={() => setIsUploadReceiptOpen(false)}
        buyerEmail={request?.buyerEmail || ""}
        refundRequestId={request?.id || ""}
        onDone={(payload) => {
          onSendReceipt(payload);
          if (request) {
            onDecision({ refundRequestId: request.id, decision: "ACCEPT" });
          }
          setIsUploadReceiptOpen(false);
          onClose();
        }}
      />
    </>
  );
}

/* ---------------- Helpers ---------------- */

function InfoRow({
  label,
  value,
  strong,
  mono,
  badge,
  badgeTone,
}: {
  label: string;
  value: string;
  strong?: boolean;
  mono?: boolean;
  badge?: boolean;
  badgeTone?: "blue" | "purple" | "green" | "orange";
}) {
  if (badge) {
    const tone =
      badgeTone === "purple"
        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
        : badgeTone === "green"
        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
        : badgeTone === "orange"
        ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";

    return (
      <div className="flex items-start justify-between gap-4">
        <p className="text-xs text-gray-500">{label}</p>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${tone}`}
        >
          {value}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-between gap-4">
      <p className="text-xs text-gray-500">{label}</p>
      <p
        className={`text-sm text-foreground text-right ${
          strong ? "font-semibold" : ""
        } ${mono ? "font-mono text-[12px] break-all" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}

// "use client";

// import Image from "next/image";
// import { X } from "lucide-react";

// interface PaymentWithdrawalModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// export function PaymentWithdrawalModal({
//   isOpen,
//   onClose,
// }: PaymentWithdrawalModalProps) {
//   if (!isOpen) return null;

//   const handleReject = () => {
//     console.log("[v0] Withdrawal request rejected");
//     onClose();
//   };

//   const handleAccept = () => {
//     console.log("[v0] Withdrawal request accepted");
//     onClose();
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 sm:px-6">
//       <div
//         className="
//           relative
//           bg-white
//           dark:bg-[#101010]
//           rounded-2xl
//           shadow-2xl
//           w-full
//           max-w-[650px]
//           max-h-[90vh]

//           p-6 sm:p-8 md:p-10
//         "
//       >
//         {/* ===== Close Button ===== */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 sm:top-6 sm:right-6 hover:opacity-70 transition-opacity"
//           aria-label="Close"
//         >
//           <X className="w-6 h-6 text-foreground" strokeWidth={3} />
//         </button>

//         {/* ===== Content ===== */}
//         <div className="flex flex-col items-center text-center">
//           {/* Profile Image */}
//           <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden mb-4 sm:mb-6">
//             <Image
//               src="/avatars/daniel-carter.png"
//               alt="Daniel Carter"
//               width={128}
//               height={128}
//               className="w-full h-full object-cover"
//             />
//           </div>

//           {/* Name */}
//           <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
//             Daniel Carter
//           </h2>

//           {/* ===== Balance ===== */}
//           <div className="w-full mb-4 sm:mb-6">
//             <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2 sm:mb-3 text-left">
//               Current Balance
//             </h3>
//             <p className="text-2xl sm:text-3xl text-black dark:text-white font-bold text-left">
//               $67,000
//             </p>
//           </div>

//           {/* ===== Basic Information ===== */}
//           <div className="w-full mb-6 sm:mb-8">
//             <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-6 text-left">
//               Basic Information
//             </h3>

//             {/* Information Grid */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 sm:gap-x-10 gap-y-4 sm:gap-y-6">
//               {/* Email */}
//               <div className="flex justify-between items-start sm:items-center">
//                 <p className="text-sm text-gray-500">Email</p>
//                 <p className="text-sm sm:text-base text-foreground text-right">
//                   info@gmail.com
//                 </p>
//               </div>

//               {/* Phone Number */}
//               <div className="flex justify-between items-start sm:items-center">
//                 <p className="text-sm text-gray-500">Phone Number</p>
//                 <p className="text-sm sm:text-base text-foreground text-right">
//                   +44 7412 558492
//                 </p>
//               </div>

//               {/* Payment Method */}
//               <div className="flex justify-between items-start sm:items-center">
//                 <p className="text-sm text-gray-500">Payment Method</p>
//                 <p className="text-sm sm:text-base text-foreground text-right">
//                   MasterCard
//                 </p>
//               </div>

//               {/* Address */}
//               <div className="flex justify-between items-start sm:items-center">
//                 <p className="text-sm text-gray-500">Address</p>
//                 <p className="text-sm sm:text-base text-foreground text-right">
//                   1234 Sunset Blvd,
//                   <br className="sm:hidden" />
//                   Los Angeles, CA 90026
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* ===== Action Buttons ===== */}
//           <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-auto">
//             <button
//               onClick={handleReject}
//               className="py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-opacity hover:opacity-80"
//               style={{ backgroundColor: "#F5EDE5", color: "#000000" }}
//             >
//               Reject
//             </button>
//             <button
//               onClick={handleAccept}
//               className="py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium text-white transition-opacity hover:opacity-90"
//               style={{ backgroundColor: "#D19537" }}
//             >
//               Accept
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
