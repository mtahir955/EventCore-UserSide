"use client";

import { useSearchParams } from "next/navigation";
import { PublicEventPage } from "@/components/events/public-event-page";

export default function EventDetailPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("id");
  const eventSlug = searchParams.get("slug");

  return <PublicEventPage eventId={eventId} eventSlug={eventSlug} />;
}

