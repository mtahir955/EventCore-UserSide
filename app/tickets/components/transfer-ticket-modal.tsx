"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
// import axios from "axios";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";
import { TransferSuccessModal } from "../components/transfer-success-modal";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/apiClient";

type TransferTicketModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: {
    purchaseId: string; // ✅ IMPORTANT: used in payload as ticketId (backend requirement)
    maxQuantity: number; // ✅ enforce limit
    date: { day: string; month: string; weekday: string; time: string };
    title: string;
    location: string;
    type: string;
    price: string;
  };
  onTransferred?: () => void; // optional: refresh tickets after success
};

export function TransferTicketModal({
  open,
  onOpenChange,
  ticket,
  onTransferred,
}: TransferTicketModalProps) {
  const [ticketCount, setTicketCount] = useState(1);
  const [successOpen, setSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const fields = [
    { label: "Full Name", name: "fullName", required: true },
    { label: "Phone Number", name: "phone", required: true },
    { label: "Email", name: "email", required: true },
  ];

  const getToken = () =>
    localStorage.getItem("buyerToken") ||
    localStorage.getItem("staffToken") ||
    localStorage.getItem("hostToken") ||
    localStorage.getItem("token");

  useEffect(() => {
    if (!open) return;

    // reset each time modal opens
    setTicketCount(1);
    setSubmitted(false);
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      message: "",
    });
  }, [open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const allFilled = fields.every(
      (f) =>
        !f.required ||
        (formData[f.name as keyof typeof formData] &&
          formData[f.name as keyof typeof formData].trim() !== "")
    );

    if (!allFilled) return;

    const token = getToken();
    if (!token) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please log in to transfer tickets.",
      });
      return;
    }

    const maxQ = Math.max(1, Number(ticket.maxQuantity || 1));
    if (ticketCount < 1 || ticketCount > maxQ) {
      toast({
        variant: "destructive",
        title: "Invalid ticket quantity",
        description: `You can transfer between 1 and ${maxQ} ticket(s).`,
      });
      return;
    }

    if (!ticket.purchaseId) {
      toast({
        variant: "destructive",
        title: "Missing purchase ID",
        description: "Please refresh the page and try again.",
      });
      return;
    }

    try {
      setLoading(true);

      // ✅ Backend requirement:
      // request field is named "ticketId" but it must contain purchaseId
      // await axios.post(
      //   `${API_BASE_URL}/users/tickets/transfer`,
      //   {
      //     ticketId: ticket.purchaseId,
      //     quantity: ticketCount,
      //     transferTo: {
      //       fullName: formData.fullName,
      //       phone: formData.phone,
      //       email: formData.email,
      //       message: formData.message,
      //     },
      //   },
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //       "X-Tenant-ID": HOST_Tenant_ID,
      //     },
      //   }
      // );

      await apiClient.post(`/users/tickets/transfer`, {
        ticketId: ticket.purchaseId,
        quantity: ticketCount,
        transferTo: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          message: formData.message,
        },
      });

      toast({
        title: "Ticket transferred",
        description: "Your ticket has been transferred successfully.",
      });

      setSuccessOpen(true);
      onOpenChange(false);

      // refresh parent list
      onTransferred?.();
    } catch (error: any) {
      console.error("Ticket transfer failed:", error);
      toast({
        variant: "destructive",
        title: "Transfer failed",
        description:
          error?.response?.data?.message ||
          "Failed to transfer ticket. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const maxQuantity = Math.max(1, Number(ticket.maxQuantity || 1));

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="p-0 rounded-[20px] md:rounded-[24px] border-0 shadow-xl w-[90vw] max-w-[420px] md:max-w-[504px] bg-white dark:bg-[#181818]"
          showCloseButton={false}
        >
          {/* Header */}
          <div className="relative flex items-center justify-center border-b py-3">
            <DialogTitle className="text-[18px] md:text-[22px] font-semibold">
              Transfer Ticket
            </DialogTitle>
            <button
              onClick={() => onOpenChange(false)}
              className="absolute right-3 top-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-4 py-3 space-y-2">
            <form
              id="transferForm"
              onSubmit={handleTransfer}
              className="space-y-2"
            >
              {fields.map((field) => {
                const value = formData[field.name as keyof typeof formData];
                const isError =
                  submitted &&
                  field.required &&
                  (!value || value.trim() === "");

                return (
                  <div key={field.name}>
                    <label className="text-[12px] font-medium">
                      {field.label} *
                    </label>
                    <input
                      name={field.name}
                      value={value}
                      onChange={handleChange}
                      className={`w-full h-9 rounded-lg border px-3 text-sm ${
                        isError ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                  </div>
                );
              })}

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message (optional)"
                rows={2}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />

              {/* Quantity */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">No of Tickets *</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTicketCount((p) => Math.max(1, p - 1))}
                    className="w-6 h-6 border rounded-full"
                  >
                    −
                  </button>

                  <span className="w-6 text-center">{ticketCount}</span>

                  <button
                    type="button"
                    disabled={ticketCount >= maxQuantity}
                    onClick={() =>
                      setTicketCount((p) => Math.min(maxQuantity, p + 1))
                    }
                    className={`w-6 h-6 rounded-full ${
                      ticketCount >= maxQuantity
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-[#0077F7] text-white"
                    }`}
                  >
                    +
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                You can transfer up to <b>{maxQuantity}</b> ticket(s).
              </p>
            </form>
          </div>

          {/* Footer */}
          <div className="flex gap-2 border-t px-4 py-3">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 h-9 rounded-full bg-black text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="transferForm"
              disabled={loading}
              className="flex-1 h-9 rounded-full bg-[#0077F7] text-white"
            >
              {loading ? "Transferring..." : "Transfer Ticket"}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <TransferSuccessModal open={successOpen} onOpenChange={setSuccessOpen} />
    </>
  );
}

// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
// import { X } from "lucide-react";
// import axios from "axios";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";
// import { TransferSuccessModal } from "../components/transfer-success-modal";

// type TransferTicketModalProps = {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   ticket: {
//     ticketId: string; // ✅ REQUIRED
//     date: { day: string; month: string; weekday: string; time: string };
//     title: string;
//     location: string;
//     type: string;
//     price: string;
//   };
// };

// export function TransferTicketModal({
//   open,
//   onOpenChange,
//   ticket,
// }: TransferTicketModalProps) {
//   const [ticketCount, setTicketCount] = useState(1);
//   const [successOpen, setSuccessOpen] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [formData, setFormData] = useState({
//     fullName: "",
//     phone: "",
//     email: "",
//     message: "",
//   });
//   const [submitted, setSubmitted] = useState(false);

//   const fields = [
//     { label: "Full Name", name: "fullName", required: true },
//     { label: "Phone Number", name: "phone", required: true },
//     { label: "Email", name: "email", required: true },
//   ];

//   const getToken = () =>
//     localStorage.getItem("buyerToken") ||
//     localStorage.getItem("staffToken") ||
//     localStorage.getItem("hostToken") ||
//     localStorage.getItem("token");

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((p) => ({ ...p, [name]: value }));
//   };

//   // ==========================
//   // TRANSFER API INTEGRATION
//   // ==========================
//   const handleTransfer = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitted(true);

//     const allFilled = fields.every(
//       (f) =>
//         !f.required ||
//         (formData[f.name as keyof typeof formData] &&
//           formData[f.name as keyof typeof formData].trim() !== "")
//     );

//     if (!allFilled) return;

//     const token = getToken();
//     if (!token) {
//       alert("You are not authenticated");
//       return;
//     }

//     try {
//       setLoading(true);

//       await axios.post(
//         `${API_BASE_URL}/users/tickets/transfer`,
//         {
//           ticketId: ticket.ticketId, // ✅ FORCE IT
//           quantity: ticketCount,
//           transferTo: {
//             fullName: formData.fullName,
//             phone: formData.phone,
//             email: formData.email,
//             message: formData.message,
//           },
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//             "X-Tenant-ID": HOST_Tenant_ID,
//           },
//         }
//       );

//       console.log("TRANSFER PAYLOAD SENT:", {
//         ticketId: ticket.ticketId,
//         quantity: ticketCount,
//         transferTo: formData,
//       });

//       setSuccessOpen(true);
//       onOpenChange(false);
//     } catch (error: any) {
//       console.error("Ticket transfer failed:", error);
//       alert(
//         error?.response?.data?.message ||
//           "Failed to transfer ticket. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {/* Transfer Ticket Modal */}
//       <Dialog open={open} onOpenChange={onOpenChange}>
//         <DialogContent
//           className="p-0 rounded-[20px] md:rounded-[24px] border-0 shadow-xl w-[90vw] max-w-[420px] md:max-w-[504px] bg-white dark:bg-[#181818]"
//           showCloseButton={false}
//         >
//           {/* Header */}
//           <div className="relative flex items-center justify-center border-b py-3">
//             <DialogTitle className="text-[18px] md:text-[22px] font-semibold">
//               Transfer Ticket
//             </DialogTitle>
//             <button
//               onClick={() => onOpenChange(false)}
//               className="absolute right-3 top-2"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>

//           {/* Content */}
//           <div className="px-4 py-3 space-y-2">
//             <form
//               id="transferForm"
//               onSubmit={handleTransfer}
//               className="space-y-2"
//             >
//               {fields.map((field) => {
//                 const value = formData[field.name as keyof typeof formData];
//                 const isError =
//                   submitted &&
//                   field.required &&
//                   (!value || value.trim() === "");

//                 return (
//                   <div key={field.name}>
//                     <label className="text-[12px] font-medium">
//                       {field.label} *
//                     </label>
//                     <input
//                       name={field.name}
//                       value={value}
//                       onChange={handleChange}
//                       className={`w-full h-9 rounded-lg border px-3 text-sm ${
//                         isError ? "border-red-500" : "border-gray-300"
//                       }`}
//                     />
//                   </div>
//                 );
//               })}

//               <textarea
//                 name="message"
//                 value={formData.message}
//                 onChange={handleChange}
//                 placeholder="Message (optional)"
//                 rows={2}
//                 className="w-full rounded-lg border px-3 py-2 text-sm"
//               />

//               {/* Quantity */}
//               <div className="flex justify-between items-center">
//                 <span className="text-sm font-medium">No of Tickets *</span>
//                 <div className="flex items-center gap-2">
//                   <button
//                     type="button"
//                     onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
//                     className="w-6 h-6 border rounded-full"
//                   >
//                     −
//                   </button>
//                   <span className="w-6 text-center">{ticketCount}</span>
//                   <button
//                     type="button"
//                     onClick={() => setTicketCount(ticketCount + 1)}
//                     className="w-6 h-6 rounded-full bg-[#0077F7] text-white"
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>

//           {/* Footer */}
//           <div className="flex gap-2 border-t px-4 py-3">
//             <button
//               onClick={() => onOpenChange(false)}
//               className="flex-1 h-9 rounded-full bg-black text-white"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               form="transferForm"
//               disabled={loading}
//               className="flex-1 h-9 rounded-full bg-[#0077F7] text-white"
//             >
//               {loading ? "Transferring..." : "Transfer Ticket"}
//             </button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       <TransferSuccessModal open={successOpen} onOpenChange={setSuccessOpen} />
//     </>
//   );
// }

// code before integration

// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
// import { X } from "lucide-react";
// import { TransferSuccessModal } from "../components/transfer-success-modal";

// type TransferTicketModalProps = {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   ticket: {
//     date: { day: string; month: string; weekday: string; time: string };
//     title: string;
//     location: string;
//     type: string;
//     price: string;
//   };
// };

// export function TransferTicketModal({
//   open,
//   onOpenChange,
//   ticket,
// }: TransferTicketModalProps) {
//   const [ticketCount, setTicketCount] = useState(1);
//   const [successOpen, setSuccessOpen] = useState(false);
//   const [isShareModalOpen, setIsShareModalOpen] = useState(false);
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);
//   const [transferModalOpen, setTransferModalOpen] = useState(false);

//   const [formData, setFormData] = useState({
//     fullName: "",
//     phone: "",
//     email: "",
//     message: "",
//   });
//   const [submitted, setSubmitted] = useState(false);

//   const fields = [
//     {
//       label: "Full Name",
//       placeholder: "Enter Your Name",
//       type: "text",
//       name: "fullName",
//       required: true,
//     },
//     {
//       label: "Phone Number",
//       placeholder: "Enter Your Number",
//       type: "tel",
//       name: "phone",
//       required: true,
//     },
//     {
//       label: "Email:",
//       placeholder: "Enter Your Email",
//       type: "email",
//       name: "email",
//       required: true,
//     },
//   ];

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleTransfer = (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitted(true); // triggers validation display

//     // Check all required fields
//     const allFilled = fields.every(
//       (f) =>
//         !f.required ||
//         (formData[f.name as keyof typeof formData] &&
//           formData[f.name as keyof typeof formData].trim() !== "")
//     );

//     if (!allFilled) return; // stop if any required field is empty

//     setSuccessOpen(true);
//     onOpenChange(false);
//   };

//   return (
//     <>
//       {/* Transfer Ticket Modal */}
//       <Dialog open={open} onOpenChange={onOpenChange}>
//         <DialogContent
//           className="p-0 rounded-[20px] md:rounded-[24px] border-0 shadow-xl w-[90vw] max-w-[420px] md:max-w-[504px] bg-white dark:bg-[#181818] text-black dark:text-gray-100 transition-colors duration-300"
//           showCloseButton={false}
//           style={{ height: "auto", maxHeight: "99vh" }}
//         >
//           {/* Header */}
//           <div className="relative flex items-center justify-center border-b border-gray-200 dark:border-gray-700 py-3 md:py-2">
//             <DialogTitle className="text-[18px] md:text-[22px] font-semibold text-black dark:text-white">
//               Transfer Ticket
//             </DialogTitle>
//             <button
//               onClick={() => onOpenChange(false)}
//               className="absolute right-3 top-2 md:right-4 md:top-3 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
//               aria-label="Close"
//             >
//               <X className="h-5 w-5 md:h-6 md:w-6 dark:text-gray-300" />
//             </button>
//           </div>

//           {/* Content */}
//           <div className="px-3 md:px-6 py-2 md:py-1 space-y-1">

//             {/* Form fields */}
//             <form
//               id="transferForm"
//               onSubmit={handleTransfer}
//               className="space-y-2"
//             >
//               {fields.map((field, i) => {
//                 const value = formData[field.name as keyof typeof formData];
//                 const isError =
//                   submitted &&
//                   field.required &&
//                   (!value || value.trim() === "");

//                 return (
//                   <div key={i}>
//                     <label className="block text-[12px] font-medium text-black dark:text-gray-200 mb-1">
//                       {field.label}{" "}
//                       {field.required && (
//                         <span className="text-red-500">*</span>
//                       )}
//                     </label>
//                     <input
//                       type={field.type}
//                       name={field.name}
//                       value={value}
//                       onChange={handleChange}
//                       placeholder={field.placeholder}
//                       className={`w-full h-9 md:h-10 rounded-lg border ${
//                         isError
//                           ? "border-red-500 focus:ring-red-500"
//                           : "border-gray-300 dark:border-gray-700 focus:ring-[#0077F7]"
//                       } dark:border-gray-700 bg-white dark:bg-[#222222] px-4 text-[13px] md:text-[14px] text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2`}
//                     />
//                     {isError && (
//                       <p className="text-[11px] text-red-500 mt-1"></p>
//                     )}
//                   </div>
//                 );
//               })}

//               {/* Optional message */}
//               <div>
//                 <label className="block text-[12px] font-medium text-black dark:text-gray-200 mb-1">
//                   Message (Optional)
//                 </label>
//                 <textarea
//                   name="message"
//                   value={formData.message}
//                   onChange={handleChange}
//                   placeholder="Start Typing Your Message"
//                   rows={2}
//                   className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#222222] px-4 py-3 text-[13px] md:text-[14px] text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0077F7] resize-none"
//                 />
//               </div>

//               {/* Ticket Counter */}
//               <div className="flex items-center justify-between">
//                 <label className="block text-[12px] font-medium text-black dark:text-gray-200">
//                   No of Tickets <span className="text-red-500">*</span>
//                 </label>
//                 <div className="flex items-center gap-1.5">
//                   <button
//                     type="button"
//                     onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
//                     className="flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#222222] hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition"
//                   >
//                     <Image
//                       src="/images/remove-button.png"
//                       width={16}
//                       height={16}
//                       alt=""
//                       className="dark:invert"
//                     />
//                   </button>
//                   <span className="text-[13px] md:text-[14px] font-semibold text-black dark:text-white w-6 text-center">
//                     {ticketCount}
//                   </span>
//                   <button
//                     type="button"
//                     onClick={() => setTicketCount(ticketCount + 1)}
//                     className="flex items-center justify-center w-6 h-6 rounded-full bg-[#0077F7] text-white hover:opacity-90 transition"
//                   >
//                     <Image
//                       src="/images/add-button.png"
//                       width={16}
//                       height={16}
//                       alt=""
//                       className="dark:invert-0"
//                     />
//                   </button>
//                 </div>
//               </div>
//             </form>
//           </div>

//           {/* Footer buttons */}
//           <div className="flex flex-row gap-2 border-t border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3">
//             <button
//               type="button"
//               onClick={() => onOpenChange(false)}
//               className="flex-1 h-9 md:h-10 rounded-full bg-black dark:bg-[#222222] text-white text-[13px] md:text-[14px] font-semibold hover:opacity-90"
//             >
//               Cancel
//             </button>

//             {/* ✅ Use type="submit" so handleTransfer runs */}
//             <button
//               type="submit"
//               form="transferForm" // link to the form id below
//               className="flex-1 h-9 md:h-10 rounded-full bg-[#0077F7] text-white text-[13px] md:text-[14px] font-semibold hover:bg-[#005fe0] transition"
//             >
//               Transfer Ticket
//             </button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Success modal */}
//       <TransferSuccessModal open={successOpen} onOpenChange={setSuccessOpen} />
//     </>
//   );
// }
