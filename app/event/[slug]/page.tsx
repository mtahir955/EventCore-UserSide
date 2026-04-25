import { PublicEventPage } from "@/components/events/public-event-page";

export default async function TenantEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <PublicEventPage eventSlug={slug} />;
}

