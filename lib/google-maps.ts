export const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() || "";

export const hasGoogleMapsApiKey = GOOGLE_MAPS_API_KEY.length > 0;
