"use client";

import { useParams, useSearchParams } from "next/navigation";
import TicketManager from "@/app/host-dashboard/components/ticket-manager";

export default function StaffEventTicketsPage() {
  const params = useParams<{ eventId?: string | string[] }>();
  const searchParams = useSearchParams();
  const rawEventId = params?.eventId;
  const eventId = Array.isArray(rawEventId) ? rawEventId[0] : rawEventId;
  const eventTitle = searchParams.get("title") ?? undefined;

  return (
    <TicketManager
      dashboardMode="staff"
      eventId={eventId}
      eventTitle={eventTitle}
      eventScoped={Boolean(eventId)}
    />
  );
}
