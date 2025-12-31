import JSZip from "jszip";
import { saveAs } from "file-saver";
import axios from "axios";
import QRCode from "qrcode";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";

type DownloadEventTicketsParams = {
  eventId: string;
  getToken: () => string | null;
  generateTicketImage: (params: any) => Promise<string>;
};

export async function downloadEventTicketsZip({
  eventId,
  getToken,
  generateTicketImage,
}: DownloadEventTicketsParams) {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");

  const res = await axios.get(
    `${API_BASE_URL}/tickets/event/${eventId}/qr`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Tenant-ID": HOST_Tenant_ID,
      },
    }
  );

  const tickets = res.data?.data?.tickets || [];
  if (!tickets.length) {
    throw new Error("No tickets found for this event");
  }

  const zip = new JSZip();
  const folder = zip.folder("tickets");

  await Promise.all(
    tickets.map(async (ticket: any) => {
      const qrPng = await QRCode.toDataURL(ticket.qrCode, {
        width: 300,
        margin: 1,
      });

      const image = await generateTicketImage({
        qrDataUrl: qrPng,
        ...ticket.metadata,
        ticketNumber: ticket.ticketNumber,
      });

      const base64 = image.replace(/^data:image\/png;base64,/, "");

      folder?.file(`ticket-${ticket.ticketNumber}.png`, base64, {
        base64: true,
      });
    })
  );

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `event-${eventId}-tickets.zip`);
}
