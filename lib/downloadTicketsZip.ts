import axios from "axios";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import QRCode from "qrcode";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";

type IssuedTicket = {
  id: string;
  ticketNumber: number;
};

type DownloadParams = {
  issuedTickets: IssuedTicket[];
  confirmationNumber: string;
  getToken: () => string | null;
};

export async function downloadTicketsZip({
  issuedTickets,
  confirmationNumber,
  getToken,
}: DownloadParams) {
  if (!issuedTickets?.length) {
    alert("Tickets not ready yet");
    return;
  }

  const token = getToken();
  if (!token) {
    alert("Not authenticated");
    return;
  }

  try {
    const zip = new JSZip();
    const folder = zip.folder("tickets");
    let addedCount = 0;

    await Promise.all(
      issuedTickets.map(async (issued) => {
        const res = await axios.get(
          `${API_BASE_URL}/tickets/${issued.id}/qr`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "X-Tenant-ID": HOST_Tenant_ID,
            },
          }
        );

        const qrCodeUrl = res.data?.data?.qrCode;
        const meta = res.data?.data?.metadata;

        if (!qrCodeUrl || !meta) return;

        const qrPng = await QRCode.toDataURL(qrCodeUrl, {
          width: 300,
          margin: 1,
        });

        const canvas = document.createElement("canvas");
        canvas.width = 1000;
        canvas.height = 450;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Background
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 650, canvas.height);

        ctx.fillStyle = "#0f172a";
        ctx.font = "bold 36px Arial";
        ctx.fillText(meta.eventName, 40, 70);

        ctx.font = "18px Arial";
        ctx.fillText(`📍 ${meta.location}`, 40, 120);
        ctx.fillText(`📅 ${meta.date}`, 40, 155);
        ctx.fillText(`⏰ ${meta.time}`, 40, 190);

        ctx.font = "bold 22px Arial";
        ctx.fillText(`🎟 ${meta.ticketName}`, 40, 255);
        ctx.font = "18px Arial";
        ctx.fillText(`Type: ${meta.ticketType}`, 40, 290);
        ctx.fillText(`Price: ${meta.price}`, 40, 325);
        ctx.fillText(`Ticket #: ${issued.ticketNumber}`, 40, 365);

        const img = new Image();
        img.src = qrPng;

        await new Promise((res) => (img.onload = res));

        ctx.drawImage(img, 730, 140, 200, 200);

        const base64 = canvas
          .toDataURL("image/png")
          .replace(/^data:image\/png;base64,/, "");

        folder?.file(`ticket-${issued.ticketNumber}.png`, base64, {
          base64: true,
        });

        addedCount++;
      })
    );

    if (!addedCount) {
      alert("No tickets generated");
      return;
    }

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, `tickets-${confirmationNumber}.zip`);
  } catch (err) {
    console.error("Download failed:", err);
    alert("Failed to download tickets");
  }
}
