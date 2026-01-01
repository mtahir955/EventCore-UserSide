"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Header } from "../../../components/header";
import { Footer } from "../../../components/footer";
import { CalendarModal } from "../components/calendar-modal";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import QRCode from "qrcode";

type TicketQR = {
  ticketId: string;
  ticketNumber: number;
  qrImage: string;
  metadata: {
    eventName: string;
    location: string;
    date: string;
    time: string;
    price: string;
    confirmationNumber: string;
  };
};

export default function PaymentSuccessPage() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [ticketQrs, setTicketQrs] = useState<TicketQR[]>([]);

  const [confirming, setConfirming] = useState(false);

  const ticketMeta = ticketQrs?.[0]?.metadata;

  const generateTicketImage = async (params: {
    qrDataUrl: string;
    eventName: string;
    date: string;
    time: string;
    location: string;
    ticketName: string;
    ticketType: string;
    ticketPrice: string;
    ticketNumber: number;
    ticketCode: string; // ✅ ADD
  }) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 450;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");

    // ======================
    // BACKGROUND
    // ======================
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // LEFT PANEL
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 650, canvas.height);

    // ======================
    // EVENT INFO
    // ======================
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 36px Arial";
    ctx.fillText(params.eventName, 40, 70);

    ctx.font = "18px Arial";
    ctx.fillText(`📍 Location: ${params.location}`, 40, 120);
    ctx.fillText(`📅 Date: ${params.date}`, 40, 155);
    ctx.fillText(`⏰ Time: ${params.time}`, 40, 190);

    // Divider
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 215);
    ctx.lineTo(610, 215);
    ctx.stroke();

    // ======================
    // TICKET INFO
    // ======================
    ctx.font = "bold 22px Arial";
    ctx.fillText(`🎟 Ticket: ${params.ticketName}`, 40, 255);

    ctx.font = "18px Arial";
    ctx.fillText(`Type: ${params.ticketType}`, 40, 290);
    ctx.fillText(`Price: $${params.ticketPrice}`, 40, 325);

    ctx.font = "bold 20px Arial";
    ctx.fillText(`Ticket No: #${params.ticketNumber}`, 40, 365);

    // ======================
    // RIGHT PANEL (QR)
    // ======================
    ctx.strokeStyle = "#e5e7eb";
    ctx.beginPath();
    ctx.moveTo(650, 0);
    ctx.lineTo(650, canvas.height);
    ctx.stroke();

    // ======================
    // TICKET CODE
    // ======================
    ctx.font = "bold 18px Arial";
    ctx.fillStyle = "#0f172a";
    ctx.fillText(`Ticket Code: ${params.ticketCode}`, 40, 400);

    const qrImg = new window.Image();
    qrImg.src = params.qrDataUrl;

    await new Promise<void>((resolve) => {
      qrImg.onload = () => resolve();
      qrImg.onerror = () => resolve();
    });

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(710, 120, 240, 240);
    ctx.drawImage(qrImg, 730, 140, 200, 200);

    ctx.font = "14px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Scan at Entry", 780, 405);

    ctx.font = "bold 14px Arial";
    ctx.fillStyle = "#0f172a";
    ctx.textAlign = "center";
    ctx.fillText(
      params.ticketCode,
      830, // centered under QR
      370
    );
    ctx.textAlign = "left";

    return canvas.toDataURL("image/png");
  };

  const formatDate = (value: string) => {
    try {
      const d = new Date(value);
      return isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
    } catch {
      return "-";
    }
  };

  // =========================
  // LOAD PAYMENT DATA
  // =========================
  useEffect(() => {
    const stored = localStorage.getItem("confirmedPurchase");
    if (stored) {
      setPaymentData(JSON.parse(stored)?.data);
    }
  }, []);

  // =========================
  // AUTH TOKEN
  // =========================
  const getToken = () => {
    if (typeof window === "undefined") return null;

    return (
      localStorage.getItem("buyerToken") ||
      localStorage.getItem("staffToken") ||
      localStorage.getItem("hostToken") ||
      localStorage.getItem("token")
    );
  };

  // =========================
  // FETCH QR FOR EACH TICKET
  // =========================
  useEffect(() => {
    if (!paymentData?.issuedTickets?.length) return;

    const token = getToken();
    if (!token) return;

    const fetchQrs = async () => {
      try {
        const list: TicketQR[] = [];

        for (const issued of paymentData.issuedTickets) {
          const res = await axios.get(
            `${API_BASE_URL}/tickets/${issued.id}/qr`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "X-Tenant-ID": HOST_Tenant_ID,
              },
            }
          );

          list.push({
            ticketId: issued.id,
            ticketNumber: issued.ticketNumber,
            qrImage: res.data?.data?.qrCode,
            metadata: res.data?.data?.metadata, // ✅ ADD THIS
          });
        }

        setTicketQrs(list);
      } catch (error) {
        console.error("QR fetch failed", error);
      }
    };

    fetchQrs();
  }, [paymentData]);

  // =========================
  // DOWNLOAD PDF
  // =========================
  const downloadTicketsZip = async () => {
    try {
      if (!paymentData?.issuedTickets?.length) {
        alert("Tickets not ready yet");
        return;
      }

      const token = getToken();
      if (!token) {
        alert("Not authenticated");
        return;
      }

      const zip = new JSZip();
      const folder = zip.folder("tickets");
      let addedCount = 0;

      // ✅ IMPORTANT: Use Promise.all to ensure ALL QR PNGs are generated BEFORE zipping
      await Promise.all(
        paymentData.issuedTickets.map(async (issued: any) => {
          const res = await axios.get(
            `${API_BASE_URL}/tickets/${issued.id}/qr`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "X-Tenant-ID": HOST_Tenant_ID,
              },
            }
          );

          const qrCodeUrl = res.data?.data?.qrCode; // ✅ correct path (from your JSON)
          if (!qrCodeUrl) {
            console.warn("Missing qrCodeUrl for:", issued.id, res.data);
            return;
          }

          const qrPng = await QRCode.toDataURL(qrCodeUrl, {
            width: 300,
            margin: 1,
          });

          // const ticketImage = await generateTicketImage({
          //   qrDataUrl: qrPng,
          //   eventName: paymentData.event.name,
          //   date: formatDate(paymentData.event.date),
          //   time: paymentData.event.time,
          //   location: paymentData.event.location,
          //   ticketName: paymentData.ticket.name,
          //   ticketType: paymentData.ticket.type,
          //   ticketPrice: paymentData.ticket.price,
          //   ticketNumber: issued.ticketNumber,
          // });

          const meta = res.data.data.metadata;

          const ticketImage = await generateTicketImage({
            qrDataUrl: qrPng,
            eventName: meta.eventName,
            date: formatDate(meta.date),
            time: meta.time,
            location: meta.location,
            ticketName: meta.ticketName,
            ticketType: meta.ticketType,
            ticketPrice: meta.price,
            ticketNumber: issued.ticketNumber,
            ticketCode: meta.ticketCode, // ✅ PASS IT
          });

          const base64 = ticketImage.replace(/^data:image\/png;base64,/, "");

          folder?.file(`ticket-${issued.ticketNumber}.png`, base64, {
            base64: true,
          });

          addedCount += 1;
        })
      );

      if (addedCount === 0) {
        alert("No ticket images were generated. Check qrCode in API response.");
        return;
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, `tickets-${paymentData.confirmationNumber}.zip`);
    } catch (error) {
      console.error("ZIP download failed:", error);
      alert("Failed to download tickets");
    }
  };

  const confirmBnplPayment = async (paymentIntentId: string) => {
    if (confirming) return; // ✅ guard
    setConfirming(true);

    try {
      const token = getToken();
      if (!token) {
        toast.error("Authentication required. Please log in again.");
        setConfirming(false);
        return;
      }

      const res = await axios.post(
        `${API_BASE_URL}/payments/confirm`,
        { paymentIntentId }, // ✅ ONLY this for BNPL
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": HOST_Tenant_ID,
          },
        }
      );

      localStorage.setItem("confirmedPurchase", JSON.stringify(res.data));
      setPaymentData(res.data.data);
      toast.success("Payment confirmed successfully!");
    } catch (err: any) {
      console.error("BNPL confirm failed", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Payment confirmation failed. Please contact support with payment ID: " +
          paymentIntentId;
      toast.error(errorMessage);
      setConfirming(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const paymentIntentId =
      params.get("payment_intent") ||
      params.get("payment_intent_client_secret");

    // ✅ Stripe BNPL ALWAYS returns payment_intent
    if (!paymentIntentId) return;

    confirmBnplPayment(paymentIntentId);
  }, []);

  return (
    <main className="bg-white text-black dark:bg-[#101010] dark:text-gray-100 transition-colors duration-300">
      <Header />

      <section className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-8 py-10 md:py-20">
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

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10">
          {/* LEFT COLUMN */}
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

            <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-700 mb-6" />

            <div className="mb-10">
              <h3 className="text-[16px] sm:text-[18px] font-semibold mb-4">
                Item Details
              </h3>

              <div className="space-y-2 text-[14px] sm:text-[15px]">
                <Line label="Item" value={paymentData?.event?.name || "N/A"} />
                <Line
                  label="Ticket"
                  value={paymentData?.ticket?.name || "N/A"}
                />
                <Line
                  label="Quantity"
                  value={`${paymentData?.ticket?.quantity || 1} Ticket(s)`}
                />
                <Line
                  label="Amount"
                  value={`$${paymentData?.payment?.totalAmount || "0.00"}`}
                />
              </div>
            </div>

            <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-700 mb-6" />

            <div className="mb-12">
              <h3 className="text-[16px] sm:text-[18px] font-semibold mb-4">
                Customer details
              </h3>

              <div className="space-y-2 text-[14px] sm:text-[15px]">
                <Line label="Name" value={paymentData?.buyer?.name || "N/A"} />
                <Line
                  label="Email"
                  value={paymentData?.buyer?.email || "N/A"}
                />
              </div>
            </div>

            <p className="text-[16px] sm:text-[20px]">
              Thank you for choosing us
            </p>
          </div>

          {/* RIGHT COLUMN */}
          <aside className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[380px]">
              <div className="rounded-[18px] bg-[#0077F7] p-5 sm:p-6 text-white shadow-lg">
                <h4 className="text-[16px] sm:text-[18px] font-semibold mb-1">
                  Download Your Tickets!
                </h4>
                <p className="text-xs sm:text-sm text-white/90 mb-3 sm:mb-4">
                  {ticketQrs?.[0]?.metadata?.eventName || "Event"}
                </p>

                <div className="flex flex-col items-center mb-3 sm:mb-4">
                  <Image
                    src="/images/qr.png"
                    alt="QR code"
                    width={180}
                    height={180}
                    className="h-[150px] sm:h-[200px] w-[150px] sm:w-[200px] object-contain"
                  />
                  <p className="mt-2 sm:mt-3 text-center text-[10px] sm:text-[12px] tracking-wider text-white/80">
                    TCK-482917-AB56
                  </p>
                </div>

                <div className="text-[12px] sm:text-[14px] space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Tickets</span>
                    <span className="font-semibold">
                      ${ticketQrs?.[0]?.metadata?.price || "0.00"}
                    </span>
                  </div>

                  <p className="font-semibold">
                    Location:{" "}
                    <span className="font-normal">
                      {ticketQrs?.[0]?.metadata?.location || "—"}
                    </span>
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="font-semibold">
                      Date:{" "}
                      <span className="font-normal">
                        {formatDate(ticketQrs?.[0]?.metadata?.date)}
                      </span>
                    </p>

                    <p className="font-semibold">
                      Time:{" "}
                      <span className="font-normal">
                        {ticketQrs?.[0]?.metadata?.time || "—"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={downloadTicketsZip}
                  className="h-9 sm:h-10 w-full flex-1 rounded-[10px] bg-[#0077F7] sm:text-[12px] text-[10px] font-medium text-white hover:bg-[#0066D6] transition"
                >
                  Download Ticket's
                </button>

                <Link href="/tickets">
                  <button className="h-9 sm:h-10 w-[90px] sm:w-[190px] flex-1 rounded-[10px] bg-black dark:bg-gray-200 sm:text-[12px] text-[10px] font-medium text-white dark:text-black hover:bg-black/90 dark:hover:bg-gray-300 transition">
                    My Tickets
                  </button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* HIDDEN TICKET TEMPLATES */}
      <div style={{ position: "fixed", top: "-9999px" }}>
        {ticketQrs.map((qr) => (
          <div
            id={`ticket-${qr.ticketId}`}
            key={qr.ticketId}
            style={{
              width: "600px",
              height: "300px",
              display: "flex",
              background: "#0f172a",
              color: "#fff",
              borderRadius: "16px",
              overflow: "hidden",
              fontFamily: "Inter, sans-serif",
            }}
          >
            <div style={{ flex: 1, padding: 20 }}>
              <h2>{paymentData?.event?.name}</h2>
              <p>{paymentData?.event?.location}</p>
              <p>
                {formatDate(paymentData.event.date)}
                {paymentData?.event?.time}
              </p>
              <hr />
              <p>Ticket: {paymentData?.ticket?.name}</p>
              <p>Ticket No: #{qr.ticketNumber}</p>
              <p>Buyer: {paymentData?.buyer?.name}</p>
            </div>

            <div
              style={{
                width: 200,
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src={qr.qrImage} width={140} />
            </div>
          </div>
        ))}
      </div>

      <Footer />

      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        eventTitle={paymentData?.event?.name || "Event"}
        eventDescription="Enjoy your event!"
        eventImage="/images/hero-image.png"
        initialDate={new Date()}
      />

      <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogTitle>Share</DialogTitle>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-gray-700 dark:text-gray-300">
      <span className="font-normal">{label}:</span> {value}
    </p>
  );
}

// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { Header } from "../../../components/header";
// import { Footer } from "../../../components/footer";
// import { CalendarModal } from "../components/calendar-modal";
// import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
// import Link from "next/link";
// import axios from "axios";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";

// export default function PaymentSuccessPage() {
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);
//   const [isShareModalOpen, setIsShareModalOpen] = useState(false);
//   const [paymentData, setPaymentData] = useState<any>(null);

//   // 🔥 UPDATED: store ALL ticket QRs
//   const [qrCodes, setQrCodes] = useState<
//     { ticketId: string; qrCode: string }[]
//   >([]);

//   // Load confirmed purchase response from localStorage
//   useEffect(() => {
//     const stored = localStorage.getItem("confirmedPurchase");
//     if (stored) {
//       const parsed = JSON.parse(stored);
//       setPaymentData(parsed?.data);
//     }
//   }, []);

//   const getToken = () => {
//     if (typeof window === "undefined") return null;

//     const raw =
//       localStorage.getItem("buyerToken") ||
//       localStorage.getItem("staffToken") ||
//       localStorage.getItem("hostToken") ||
//       localStorage.getItem("token");

//     return raw || null;
//   };

//   // 🔥 UPDATED: generate QR for EACH issued ticket
//   useEffect(() => {
//     if (!paymentData?.issuedTickets?.length) return;

//     const token = getToken();
//     if (!token) return;

//     const fetchQrs = async () => {
//       try {
//         const results: { ticketId: string; qrCode: string }[] = [];

//         for (const issued of paymentData.issuedTickets) {
//           const res = await axios.get(
//             `${API_BASE_URL}/tickets/${issued.id}/qr?includeImage=true`,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 "X-Tenant-ID": HOST_Tenant_ID,
//               },
//             }
//           );

//           results.push({
//             ticketId: issued.id,
//             qrCode: res.data?.data?.qrCode,
//           });
//         }

//         setQrCodes(results);
//       } catch (err) {
//         console.error("QR Code fetch failed:", err);
//       }
//     };

//     fetchQrs();
//   }, [paymentData]);

//   // 🔥 Keep existing UI behavior: use FIRST ticket QR
//   const primaryQr = qrCodes.length > 0 ? qrCodes[0].qrCode : null;

//   return (
//     <main className="bg-white text-black dark:bg-[#101010] dark:text-gray-100 transition-colors duration-300">
//       <Header />

//       <section className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-8 py-10 md:py-20">
//         <div className="text-center mb-10 sm:mb-14">
//           <h1 className="text-[24px] sm:text-[30px] md:text-[36px] font-semibold text-[#89FC00] italic">
//             Payment Successful!
//           </h1>
//           <p className="mt-2 text-[14px] sm:text-[16px] text-gray-700 dark:text-gray-300">
//             {paymentData?.event?.name
//               ? `You got your ticket for ${paymentData.event.name}. Download it here.`
//               : "You got your ticket. Download it here."}
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10">
//           {/* LEFT COLUMN */}
//           <div className="px-2 sm:px-4 lg:pl-8 lg:pr-4">
//             <h2 className="text-[18px] sm:text-[22px] font-bold mb-2">
//               Congratulations!
//             </h2>

//             <p className="text-[14px] sm:text-[16px] text-gray-700 dark:text-gray-300 leading-relaxed mb-6 sm:mb-8">
//               You’ve successfully purchased the ticket for:
//               <br />
//               <span className="font-medium text-gray-900 dark:text-gray-100">
//                 {paymentData?.event?.name || "Event Name"}
//               </span>
//             </p>

//             <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-700 mb-6" />

//             <div className="mb-10">
//               <h3 className="text-[16px] sm:text-[18px] font-semibold mb-4">
//                 Item Details
//               </h3>

//               <div className="space-y-2 text-[14px] sm:text-[15px]">
//                 <Line label="Item" value={paymentData?.event?.name || "N/A"} />
//                 <Line
//                   label="Ticket"
//                   value={paymentData?.ticket?.name || "N/A"}
//                 />
//                 <Line
//                   label="Quantity"
//                   value={`${paymentData?.ticket?.quantity || 1} Ticket(s)`}
//                 />
//                 <Line
//                   label="Amount"
//                   value={`$${paymentData?.payment?.totalAmount || "0.00"}`}
//                 />
//               </div>
//             </div>

//             <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-700 mb-6" />

//             <div className="mb-12">
//               <h3 className="text-[16px] sm:text-[18px] font-semibold mb-4">
//                 Customer details
//               </h3>

//               <div className="space-y-2 text-[14px] sm:text-[15px]">
//                 <Line label="Name" value={paymentData?.buyer?.name || "N/A"} />
//                 <Line
//                   label="Email"
//                   value={paymentData?.buyer?.email || "N/A"}
//                 />
//               </div>
//             </div>

//             <p className="text-[16px] sm:text-[20px]">
//               Thank you for choosing us
//             </p>
//           </div>

//           {/* RIGHT COLUMN */}
//           <aside className="flex justify-center lg:justify-end">
//             <div className="w-full max-w-[380px]">
//               {/* Ticket Card */}
//               <div className="rounded-[18px] bg-[#0077F7] p-5 sm:p-6 text-white shadow-lg">
//                 <h4 className="text-[16px] sm:text-[18px] font-semibold mb-1">
//                   Download Your Tickets!
//                 </h4>
//                 <p className="text-xs sm:text-sm text-white/90 mb-3 sm:mb-4">
//                   Event Name
//                 </p>

//                 {/* QR */}
//                 <div className="flex flex-col items-center mb-3 sm:mb-4">
//                   <Image
//                     src="/images/qr.png"
//                     alt="QR code"
//                     width={180}
//                     height={180}
//                     className="h-[150px] sm:h-[200px] w-[150px] sm:w-[200px] object-contain"
//                   />
//                   <p className="mt-2 sm:mt-3 text-center text-[10px] sm:text-[12px] tracking-wider text-white/80">
//                     TCK-482917-AB56
//                   </p>
//                 </div>

//                 {/* Ticket Info */}
//                 <div className="text-[12px] sm:text-[14px] space-y-2 sm:space-y-3">
//                   <div className="flex items-center justify-between">
//                     <span className="font-semibold">1 Tickets</span>
//                     <span className="font-semibold">$205.35</span>
//                   </div>
//                   <p className="font-semibold">
//                     Location: <span className="font-normal">California</span>
//                   </p>
//                   <div className="flex items-center justify-between">
//                     <p className="font-semibold">
//                       Date: <span className="font-normal">4 June</span>
//                     </p>
//                     <p className="font-semibold">
//                       Time: <span className="font-normal">8 pm</span>
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex flex-row sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
//                 <button className="h-9 sm:h-10 w-full flex-1 rounded-[10px] bg-[#0077F7] sm:text-[12px] text-[10px] font-medium text-white hover:bg-[#0066D6] transition">
//                   Download Ticket's
//                 </button>
//                 <Link href="/tickets">
//                   <button className="h-9 sm:h-10 w-[90px] sm:w-[190px] flex-1 rounded-[10px] bg-black dark:bg-gray-200 sm:text-[12px] text-[10px] font-medium text-white dark:text-black hover:bg-black/90 dark:hover:bg-gray-300 transition">
//                     My Tickets
//                   </button>
//                 </Link>
//               </div>
//               <div className="mt-4 rounded-[12px] border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 px-4 py-3">
//                 <p className="text-[12px] sm:text-[13px] text-red-700 dark:text-red-300 leading-relaxed">
//                   <span className="font-semibold">Important:</span> If you
//                   request a ticket refund, the service fee and processing fee
//                   will be deducted from the total payable amount. From the
//                   remaining ticket value, a portion will be credited to your
//                   account, and the remaining amount will be transferred to your
//                   provided payment method.
//                 </p>
//               </div>
//             </div>
//           </aside>
//         </div>
//       </section>

//       <Footer />

//       <CalendarModal
//         isOpen={isCalendarOpen}
//         onClose={() => setIsCalendarOpen(false)}
//         eventTitle={paymentData?.event?.name || "Event"}
//         eventDescription="Enjoy your event!"
//         eventImage="/images/hero-image.png"
//         initialDate={new Date()}
//       />

//       <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
//         <DialogContent aria-describedby={undefined}>
//           <DialogTitle>Share</DialogTitle>
//         </DialogContent>
//       </Dialog>
//     </main>
//   );
// }

// function Line({ label, value }: { label: string; value: string }) {
//   return (
//     <p className="text-gray-700 dark:text-gray-300">
//       <span className="font-normal">{label}:</span> {value}
//     </p>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { Header } from "../../../components/header";
// import { Footer } from "../../../components/footer";
// import { CalendarModal } from "../components/calendar-modal";
// import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
// import Link from "next/link";
// import axios from "axios";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";

// export default function PaymentSuccessPage() {
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);
//   const [isShareModalOpen, setIsShareModalOpen] = useState(false);
//   const [paymentData, setPaymentData] = useState<any>(null);

//   const [qrCode, setQrCode] = useState<string | null>(null);

//   // Load confirmed purchase response from localStorage
//   useEffect(() => {
//     const stored = localStorage.getItem("confirmedPurchase");
//     if (stored) {
//       const parsed = JSON.parse(stored);
//       setPaymentData(parsed?.data);
//     }
//   }, []);

//   const getToken = () => {
//     if (typeof window === "undefined") return null;

//     const raw =
//       localStorage.getItem("buyerToken") ||
//       localStorage.getItem("staffToken") ||
//       localStorage.getItem("hostToken") ||
//       localStorage.getItem("token");

//     return raw || null; // 🔥 DO NOT PARSE
//   };

//   useEffect(() => {
//     if (!paymentData) return;

//     const fetchQr = async () => {
//       try {
//         const token = getToken(); // 🔥 Use raw token string

//         const res = await axios.get(
//           `${API_BASE_URL}/payments/purchase/${paymentData.purchaseId}/qrcode`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "X-Tenant-ID": HOST_Tenant_ID,
//             },
//           }
//         );

//         setQrCode(res.data?.data?.qrCode || null);
//       } catch (err) {
//         console.error("QR Code fetch failed:", err);
//       }
//     };

//     fetchQr();
//   }, [paymentData]);

//   return (
//     <main className="bg-white text-black dark:bg-[#101010] dark:text-gray-100 transition-colors duration-300">
//       {/* Header */}
//       <Header />

//       {/* Main section */}
//       <section className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-8 py-10 md:py-20">
//         {/* Success heading */}
//         <div className="text-center mb-10 sm:mb-14">
//           <h1 className="text-[24px] sm:text-[30px] md:text-[36px] font-semibold text-[#89FC00] italic">
//             Payment Successful!
//           </h1>
//           <p className="mt-2 text-[14px] sm:text-[16px] text-gray-700 dark:text-gray-300">
//             {paymentData?.event?.name
//               ? `You got your ticket for ${paymentData.event.name}. Download it here.`
//               : "You got your ticket. Download it here."}
//           </p>
//         </div>

//         {/* Two-column layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10">
//           {/* Left Column */}
//           <div className="px-2 sm:px-4 lg:pl-8 lg:pr-4">
//             <h2 className="text-[18px] sm:text-[22px] font-bold mb-2">
//               Congratulations!
//             </h2>

//             <p className="text-[14px] sm:text-[16px] text-gray-700 dark:text-gray-300 leading-relaxed mb-6 sm:mb-8">
//               You’ve successfully purchased the ticket for:
//               <br />
//               <span className="font-medium text-gray-900 dark:text-gray-100">
//                 {paymentData?.event?.name || "Event Name"}
//               </span>
//             </p>

//             <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-700 mb-4 sm:mb-6" />

//             {/* Item Details */}
//             <div className="mb-6 sm:mb-10">
//               <h3 className="text-[16px] sm:text-[18px] font-semibold mb-3 sm:mb-4">
//                 Item Details
//               </h3>
//               <div className="space-y-1 sm:space-y-2 text-[14px] sm:text-[15px]">
//                 <Line label="Item" value={paymentData?.event?.name || "N/A"} />
//                 <Line
//                   label="Ticket"
//                   value={paymentData?.ticket?.name || "N/A"}
//                 />
//                 <Line
//                   label="Quantity"
//                   value={
//                     paymentData?.ticket?.quantity
//                       ? `${paymentData.ticket.quantity} Ticket(s)`
//                       : "N/A"
//                   }
//                 />
//                 <Line
//                   label="Amount"
//                   value={
//                     paymentData?.payment?.totalAmount
//                       ? `$${paymentData.payment.totalAmount}`
//                       : "$0"
//                   }
//                 />
//               </div>
//             </div>

//             <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-700 mb-4 sm:mb-6" />

//             {/* Customer Details */}
//             <div className="mb-8 sm:mb-12">
//               <h3 className="text-[16px] sm:text-[18px] font-semibold mb-3 sm:mb-4">
//                 Customer details
//               </h3>
//               <div className="space-y-1 sm:space-y-2 text-[14px] sm:text-[15px]">
//                 <Line label="Name" value={paymentData?.buyer?.name || "N/A"} />
//                 <Line
//                   label="Email"
//                   value={paymentData?.buyer?.email || "N/A"}
//                 />
//                 {/* <Line label="Contact Number" value="Not Provided" /> */}
//               </div>
//             </div>

//             <p className="text-[16px] sm:text-[20px] leading-relaxed">
//               Thank you for choosing us
//             </p>
//           </div>

//           {/* Right Column - Ticket Card */}

// <aside className="flex justify-center lg:justify-end">
//   <div className="w-full max-w-[380px]">
//     {/* Ticket Card */}
//     <div className="rounded-[18px] bg-[#0077F7] p-5 sm:p-6 text-white shadow-lg">
//       <h4 className="text-[16px] sm:text-[18px] font-semibold mb-1">
//         Download Your Tickets!
//       </h4>
//       <p className="text-xs sm:text-sm text-white/90 mb-3 sm:mb-4">
//         Event Name
//       </p>

//       {/* QR */}
//       <div className="flex flex-col items-center mb-3 sm:mb-4">
//         <Image
//           src="/images/qr.png"
//           alt="QR code"
//           width={180}
//           height={180}
//           className="h-[150px] sm:h-[200px] w-[150px] sm:w-[200px] object-contain"
//         />
//         <p className="mt-2 sm:mt-3 text-center text-[10px] sm:text-[12px] tracking-wider text-white/80">
//           TCK-482917-AB56
//         </p>
//       </div>

//       {/* Ticket Info */}
//       <div className="text-[12px] sm:text-[14px] space-y-2 sm:space-y-3">
//         <div className="flex items-center justify-between">
//           <span className="font-semibold">1 Tickets</span>
//           <span className="font-semibold">$205.35</span>
//         </div>
//         <p className="font-semibold">
//           Location: <span className="font-normal">California</span>
//         </p>
//         <div className="flex items-center justify-between">
//           <p className="font-semibold">
//             Date: <span className="font-normal">4 June</span>
//           </p>
//           <p className="font-semibold">
//             Time: <span className="font-normal">8 pm</span>
//           </p>
//         </div>
//       </div>
//     </div>

//     {/* Action Buttons */}
//     <div className="flex flex-row sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
//       <button className="h-9 sm:h-10 w-full flex-1 rounded-[10px] bg-[#0077F7] sm:text-[12px] text-[10px] font-medium text-white hover:bg-[#0066D6] transition">
//         Download Ticket's
//       </button>
//       <Link href="/tickets">
//         <button className="h-9 sm:h-10 w-[90px] sm:w-[190px] flex-1 rounded-[10px] bg-black dark:bg-gray-200 sm:text-[12px] text-[10px] font-medium text-white dark:text-black hover:bg-black/90 dark:hover:bg-gray-300 transition">
//           My Tickets
//         </button>
//       </Link>
//     </div>
//     <div className="mt-4 rounded-[12px] border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 px-4 py-3">
//       <p className="text-[12px] sm:text-[13px] text-red-700 dark:text-red-300 leading-relaxed">
//         <span className="font-semibold">Important:</span> If you
//         request a ticket refund, the service fee and processing fee
//         will be deducted from the total payable amount. From the
//         remaining ticket value, a portion will be credited to your
//         account, and the remaining amount will be transferred to your
//         provided payment method.
//       </p>
//     </div>
//   </div>
// </aside>
//         </div>
//       </section>

//       {/* Footer */}
//       <Footer />

//       {/* Calendar Modal */}
//       <CalendarModal
//         isOpen={isCalendarOpen}
//         onClose={() => setIsCalendarOpen(false)}
//         eventTitle={paymentData?.event?.name || "Event"}
//         eventDescription="Enjoy your event!"
//         eventImage="/images/hero-image.png"
//         initialDate={new Date()}
//       />

//       {/* Share Ticket Modal */}
//       <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
//         <DialogContent
//           aria-describedby={undefined}
//           className="p-0 border-0 rounded-[20px] sm:rounded-[24px] shadow-2xl overflow-hidden transition-colors duration-300 bg-white dark:bg-[#1a1a1a]"
//           style={{ width: "95%", maxWidth: 504 }}
//         >
//           <div className="relative py-3">
//             <DialogTitle className="sr-only">Share with friends</DialogTitle>
//             <h2 className="text-center text-[16px] sm:text-[20px] font-semibold text-black dark:text-gray-100">
//               Share with friends
//             </h2>
//           </div>

//           {/* Blue Ticket */}
//           <div className="px-4 sm:px-8 pb-6 sm:pb-8">
//             <div className="rounded-[16px] sm:rounded-[24px] px-5 sm:px-10 pt-2 pb-4 bg-[#0077F7]">
//               <p className="text-[14px] sm:text-[18px] font-semibold text-center text-white">
//                 Download Your Tickets!
//               </p>
//               <p className="mt-1 text-[11px] sm:text-sm text-center text-[#E6F0FF]">
//                 {paymentData?.event?.name || "Event Name"}
//               </p>

//               <div className="mt-3 sm:mt-2 flex items-center justify-center">
//                 <img
//                   src="/images/qr.png"
//                   alt="Ticket QR"
//                   className="h-[120px] sm:h-[160px] w-[150px] sm:w-[200px] object-contain"
//                 />
//               </div>

//               <p className="mt-3 sm:mt-4 text-center text-[9px] sm:text-[10px] text-[#E6F0FF]">
//                 {paymentData?.confirmationNumber || "TCK-XXXXXX"}
//               </p>

//               <div className="mt-2 grid grid-cols-2 gap-y-1 sm:gap-y-2 text-[12px] sm:text-[15px] font-semibold text-white">
//                 <p>{paymentData?.ticket?.quantity || 1} Ticket(s)</p>
//                 <p className="text-right">
//                   ${paymentData?.payment?.totalAmount || "0.00"}
//                 </p>
//                 <p>Event: {paymentData?.event?.name || "N/A"}</p>
//                 <span />
//                 <p>Status: {paymentData?.status || "Succeeded"}</p>
//                 <p className="text-right"></p>
//               </div>
//             </div>

//             {/* Buttons */}
//             <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-4">
//               <button className="h-[36px] sm:h-[38px] rounded-[12px] sm:rounded-[16px] text-[13px] sm:text-[16px] font-medium bg-[#0077F7] text-white hover:bg-[#0066D6] transition">
//                 Download Ticket
//               </button>
//               <button
//                 className="h-[36px] sm:h-[38px] rounded-[12px] sm:rounded-[16px] text-[13px] sm:text-[16px] font-medium bg-black text-white dark:bg-gray-200 dark:text-black"
//                 onClick={() => {
//                   setIsCalendarOpen(true);
//                   setIsShareModalOpen(false);
//                 }}
//               >
//                 Add to Calendar
//               </button>
//             </div>

//             {/* Social Icons */}
//             <div className="mt-3 flex items-center justify-center gap-3 sm:gap-4">
//               {[
//                 {
//                   src: "logos_facebook-Jtw5MId1zN6F2CaO7jdeBLZnsp1Tfo.png",
//                   alt: "Facebook",
//                 },
//                 {
//                   src: "devicon_twitter-XIKmcJqnv48zaeoNmUGkIwXCyqTUUL.png",
//                   alt: "Twitter",
//                 },
//                 {
//                   src: "logos_whatsapp-icon-42dAiekQtKgMVQ4IshlAJYT8fk1Tzj.png",
//                   alt: "WhatsApp",
//                 },
//                 {
//                   src: "devicon_linkedin-M4x4xBEND56ARk8e2Pf80IJKHrpm8C.png",
//                   alt: "LinkedIn",
//                 },
//               ].map((icon, i) => (
//                 <span
//                   key={i}
//                   className="h-[32px] sm:h-[40px] w-[32px] sm:w-[40px] rounded-full grid place-items-center bg-[#F9FAFB]"
//                 >
//                   <img
//                     src={`https://hebbkx1anhila5yf.public.blob.vercel-storage.com/${icon.src}`}
//                     alt={icon.alt}
//                     className="h-[16px] sm:h-[20px] w-[16px] sm:w-[20px] object-contain"
//                   />
//                 </span>
//               ))}
//             </div>

//             {/* Event URL */}
//             <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 rounded-[12px] pl-4 sm:pl-5 pr-3 sm:pr-4 py-3 sm:py-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#101010] shadow-sm transition-colors">
//               <div className="flex-1">
//                 <p className="text-[12px] sm:text-[14px] font-medium text-black dark:text-gray-100">
//                   Event URL
//                 </p>
//                 <p className="mt-[2px] text-[12px] sm:text-[14px] text-black dark:text-gray-300 truncate">
//                   https://event.com/{paymentData?.event?.id || ""}
//                 </p>
//               </div>
//               <button
//                 aria-label="Copy event URL"
//                 onClick={() =>
//                   navigator.clipboard.writeText(
//                     `https://event.com/${paymentData?.event?.id || ""}`
//                   )
//                 }
//                 className="h-[38px] sm:h-[44px] w-[40px] sm:w-[45px] rounded-full grid place-items-center border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
//               >
//                 <img
//                   src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Copy%20icon-hLC2rCxtTJjCbcRBhJtTz8ILcRgA3h.png"
//                   alt="Copy"
//                   className="h-[18px] sm:h-[24px] w-[18px] sm:w-[24px]"
//                 />
//               </button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </main>
//   );
// }

// /* Reusable text line */
// function Line({ label, value }: { label: string; value: string }) {
//   return (
//     <p className="text-gray-700 dark:text-gray-300 text-[14px] sm:text-[15px]">
//       <span className="font-normal">{label}:</span> {value}
//     </p>
//   );
// }

// "use client";

// import { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import { Header } from "../../../components/header";
// import { Footer } from "../../../components/footer";
// import { CalendarModal } from "../components/calendar-modal";
// import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
// import Link from "next/link";
// import axios from "axios";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";

// import QRCode from "qrcode";
// import { toPng } from "html-to-image";
// import { saveAs } from "file-saver";

// export default function PaymentSuccessPage() {
//   const [isCalendarOpen, setIsCalendarOpen] = useState(false);
//   const [isShareModalOpen, setIsShareModalOpen] = useState(false);
//   const [paymentData, setPaymentData] = useState<any>(null);

//   // 🔒 hidden ticket ref (NOT rendered to user)
//   const hiddenTicketRef = useRef<HTMLDivElement>(null);

//   // backend QR json
//   const [qrPayload, setQrPayload] = useState<string | null>(null);

//   /* ───────────────────────── LOAD PAYMENT DATA ───────────────────────── */
//   useEffect(() => {
//     const stored = localStorage.getItem("confirmedPurchase");
//     if (stored) {
//       const parsed = JSON.parse(stored);
//       setPaymentData(parsed?.data);
//     }
//   }, []);

//   /* ───────────────────────── FETCH QR JSON ───────────────────────── */
//   useEffect(() => {
//     if (!paymentData?.ticket?.id) return;

//     const fetchQrJson = async () => {
//       const res = await axios.get(
//         `${API_BASE_URL}/tickets/${paymentData.ticket.id}/qr`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("buyerToken")}`,
//             "X-Tenant-ID": HOST_Tenant_ID,
//           },
//         }
//       );

//       // use URL as QR payload (best practice)
//       setQrPayload(res.data?.data?.qrCodeUrl);
//     };

//     fetchQrJson();
//   }, [paymentData]);

//   /* ───────────────────────── DOWNLOAD HANDLER ───────────────────────── */
//   const handleDownloadTicket = async () => {
//     if (!hiddenTicketRef.current || !qrPayload) return;

//     // 1️⃣ generate QR image
//     const qrImage = await QRCode.toDataURL(qrPayload, {
//       width: 400,
//       margin: 2,
//     });

//     // inject QR into hidden image
//     const img = hiddenTicketRef.current.querySelector(
//       "img"
//     ) as HTMLImageElement;
//     img.src = qrImage;

//     // 2️⃣ convert hidden layout to PNG
//     const png = await toPng(hiddenTicketRef.current, {
//       cacheBust: true,
//       pixelRatio: 2,
//     });

//     // 3️⃣ download
//     saveAs(png, `ticket-${paymentData.ticket.name}.png`);
//   };

//   return (
//     <main className="bg-white text-black dark:bg-[#101010] dark:text-gray-100 transition-colors duration-300">
//       <Header />

//       <section className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 md:px-8 py-10 md:py-20">
//         <div className="text-center mb-10 sm:mb-14">
//           <h1 className="text-[24px] sm:text-[30px] md:text-[36px] font-semibold text-[#89FC00] italic">
//             Payment Successful!
//           </h1>
//           <p className="mt-2 text-[14px] sm:text-[16px] text-gray-700 dark:text-gray-300">
//             {paymentData?.event?.name
//               ? `You got your ticket for ${paymentData.event.name}. Download it here.`
//               : "You got your ticket. Download it here."}
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10">
//           {/* LEFT COLUMN */}
//           <div className="px-2 sm:px-4 lg:pl-8 lg:pr-4">
//             <h2 className="text-[18px] sm:text-[22px] font-bold mb-2">
//               Congratulations!
//             </h2>

//             <p className="text-[14px] sm:text-[16px] text-gray-700 dark:text-gray-300 leading-relaxed mb-6 sm:mb-8">
//               You’ve successfully purchased the ticket for:
//               <br />
//               <span className="font-medium text-gray-900 dark:text-gray-100">
//                 {paymentData?.event?.name || "Event Name"}
//               </span>
//             </p>

//             <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-700 mb-6" />

//             <div className="mb-10">
//               <h3 className="text-[16px] sm:text-[18px] font-semibold mb-4">
//                 Item Details
//               </h3>

//               <div className="space-y-2 text-[14px] sm:text-[15px]">
//                 <Line label="Item" value={paymentData?.event?.name || "N/A"} />
//                 <Line
//                   label="Ticket"
//                   value={paymentData?.ticket?.name || "N/A"}
//                 />
//                 <Line
//                   label="Quantity"
//                   value={`${paymentData?.ticket?.quantity || 1} Ticket(s)`}
//                 />
//                 <Line
//                   label="Amount"
//                   value={`$${paymentData?.payment?.totalAmount || "0.00"}`}
//                 />
//               </div>
//             </div>

//             <div className="h-[1px] w-full bg-gray-300 dark:bg-gray-700 mb-6" />

//             <div className="mb-12">
//               <h3 className="text-[16px] sm:text-[18px] font-semibold mb-4">
//                 Customer details
//               </h3>

//               <div className="space-y-2 text-[14px] sm:text-[15px]">
//                 <Line label="Name" value={paymentData?.buyer?.name || "N/A"} />
//                 <Line
//                   label="Email"
//                   value={paymentData?.buyer?.email || "N/A"}
//                 />
//               </div>
//             </div>

//             <p className="text-[16px] sm:text-[20px]">
//               Thank you for choosing us
//             </p>
//           </div>

//           {/* RIGHT COLUMN */}
//           <aside className="flex justify-center lg:justify-end">
//             <div className="w-full max-w-[380px]">
//               {/* Ticket Card */}
//               <div className="rounded-[18px] bg-[#0077F7] p-5 sm:p-6 text-white shadow-lg">
//                 <h4 className="text-[16px] sm:text-[18px] font-semibold mb-1">
//                   Download Your Tickets!
//                 </h4>
//                 <p className="text-xs sm:text-sm text-white/90 mb-3 sm:mb-4">
//                   Event Name
//                 </p>

//                 {/* QR */}
//                 <div className="flex flex-col items-center mb-3 sm:mb-4">
//                   <Image
//                     src="/images/qr.png"
//                     alt="QR code"
//                     width={180}
//                     height={180}
//                     className="h-[150px] sm:h-[200px] w-[150px] sm:w-[200px] object-contain"
//                   />
//                   <p className="mt-2 sm:mt-3 text-center text-[10px] sm:text-[12px] tracking-wider text-white/80">
//                     TCK-482917-AB56
//                   </p>
//                 </div>

//                 {/* Ticket Info */}
//                 <div className="text-[12px] sm:text-[14px] space-y-2 sm:space-y-3">
//                   <div className="flex items-center justify-between">
//                     <span className="font-semibold">1 Tickets</span>
//                     <span className="font-semibold">$205.35</span>
//                   </div>
//                   <p className="font-semibold">
//                     Location: <span className="font-normal">California</span>
//                   </p>
//                   <div className="flex items-center justify-between">
//                     <p className="font-semibold">
//                       Date: <span className="font-normal">4 June</span>
//                     </p>
//                     <p className="font-semibold">
//                       Time: <span className="font-normal">8 pm</span>
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex flex-row sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
//                 <button
//                   onClick={handleDownloadTicket}
//                   className="h-9 sm:h-10 w-full flex-1 rounded-[10px] bg-[#0077F7] sm:text-[12px] text-[10px] font-medium text-white hover:bg-[#0066D6] transition"
//                 >
//                   Download Ticket's
//                 </button>

//                 <Link href="/tickets">
//                   <button className="h-9 sm:h-10 w-[90px] sm:w-[190px] flex-1 rounded-[10px] bg-black dark:bg-gray-200 sm:text-[12px] text-[10px] font-medium text-white dark:text-black hover:bg-black/90 dark:hover:bg-gray-300 transition">
//                     My Tickets
//                   </button>
//                 </Link>
//               </div>
//               <div className="mt-4 rounded-[12px] border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 px-4 py-3">
//                 <p className="text-[12px] sm:text-[13px] text-red-700 dark:text-red-300 leading-relaxed">
//                   <span className="font-semibold">Important:</span> If you
//                   request a ticket refund, the service fee and processing fee
//                   will be deducted from the total payable amount. From the
//                   remaining ticket value, a portion will be credited to your
//                   account, and the remaining amount will be transferred to your
//                   provided payment method.
//                 </p>
//               </div>
//             </div>
//           </aside>
//         </div>
//       </section>

//       <Footer />

//       {/* ======================== HIDDEN DOWNLOAD LAYOUT ======================== */}
//       <div
//         ref={hiddenTicketRef}
//         className="fixed left-[-9999px] top-0 w-[380px] bg-[#0077F7] p-6 text-white rounded-[18px]"
//       >
//         <h4 className="text-lg font-semibold mb-2">
//           {paymentData?.event?.name}
//         </h4>

//         <img src="" alt="QR" className="w-[200px] h-[200px] mx-auto my-4" />

//         <p className="text-sm text-center">{paymentData?.confirmationNumber}</p>

//         <div className="mt-4 text-sm space-y-1">
//           <p>Ticket: {paymentData?.ticket?.name}</p>
//           <p>Type: {paymentData?.ticket?.type}</p>
//           <p>Price: ${paymentData?.ticket?.price}</p>
//           <p>Status: ACTIVE</p>
//         </div>
//       </div>

//       <CalendarModal
//         isOpen={isCalendarOpen}
//         onClose={() => setIsCalendarOpen(false)}
//         eventTitle={paymentData?.event?.name || "Event"}
//         eventDescription="Enjoy your event!"
//         eventImage="/images/hero-image.png"
//         initialDate={new Date()}
//       />

//       <Dialog open={isShareModalOpen} onOpenChange={setIsShareModalOpen}>
//         <DialogContent aria-describedby={undefined}>
//           <DialogTitle>Share</DialogTitle>
//         </DialogContent>
//       </Dialog>
//     </main>
//   );
// }

// function Line({ label, value }: { label: string; value: string }) {
//   return (
//     <p className="text-gray-700 dark:text-gray-300">
//       <span className="font-normal">{label}:</span> {value}
//     </p>
//   );
// }
