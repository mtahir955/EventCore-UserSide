import { apiClient } from "@/lib/apiClient";
import { slugifyEventSlug } from "@/lib/event-publishing";

export type EventSlugAvailability = {
  slug: string;
  available: boolean;
  reason?: string;
  suggestedSlug?: string;
};

export const fetchEventSlugAvailability = async (slug: string) => {
  const normalizedSlug = slugifyEventSlug(slug);

  if (!normalizedSlug) {
    return {
      slug: "",
      available: false,
      reason: "INVALID",
    } satisfies EventSlugAvailability;
  }

  const response = await apiClient.get("/events/slug-availability", {
    params: { slug: normalizedSlug },
  });

  return (
    response.data?.data || {
      slug: normalizedSlug,
      available: true,
    }
  ) as EventSlugAvailability;
};
