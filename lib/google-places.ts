export type StructuredEventLocation = {
  placeId: string;
  venueName: string;
  displayLocation: string;
  formattedAddress: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  countryCode: string;
  latitude: string;
  longitude: string;
};

export const EMPTY_STRUCTURED_EVENT_LOCATION: StructuredEventLocation = {
  placeId: "",
  venueName: "",
  displayLocation: "",
  formattedAddress: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
  countryCode: "",
  latitude: "",
  longitude: "",
};

const getComponent = (components: any[] = [], type: string, short = false) =>
  components.find((entry: any) => Array.isArray(entry?.types) && entry.types.includes(type))
    ?.[short ? "short_name" : "long_name"] || "";

export const buildStructuredAddress = (
  location?: Partial<StructuredEventLocation> | null
) =>
  [
    location?.addressLine1,
    location?.addressLine2,
    location?.city,
    location?.state,
    location?.postalCode,
    location?.country,
  ]
    .filter(Boolean)
    .join(", ");

export const buildLocationDisplayLabel = (
  location?: Partial<StructuredEventLocation> | null
) => {
  if (!location) return "";

  return (
    [
      location.venueName,
      location.city,
      location.state,
      location.country,
    ]
      .filter(Boolean)
      .join(", ") ||
    location.formattedAddress ||
    buildStructuredAddress(location)
  );
};

export const normalizeStructuredEventLocation = (
  value?: Partial<StructuredEventLocation> | null
): StructuredEventLocation => {
  const normalized: StructuredEventLocation = {
    ...EMPTY_STRUCTURED_EVENT_LOCATION,
    ...(value || {}),
  };

  if (!normalized.formattedAddress) {
    normalized.formattedAddress = buildStructuredAddress(normalized);
  }

  if (!normalized.displayLocation) {
    normalized.displayLocation = buildLocationDisplayLabel(normalized);
  }

  return normalized;
};

export const extractStructuredLocationFromPlace = (place: any) => {
  const components = Array.isArray(place?.address_components)
    ? place.address_components
    : [];

  const streetNumber = getComponent(components, "street_number");
  const route = getComponent(components, "route");
  const subpremise = getComponent(components, "subpremise");
  const city =
    getComponent(components, "locality") ||
    getComponent(components, "postal_town") ||
    getComponent(components, "administrative_area_level_2");
  const state =
    getComponent(components, "administrative_area_level_1") ||
    getComponent(components, "administrative_area_level_2");
  const postalCode = getComponent(components, "postal_code");
  const country = getComponent(components, "country");
  const countryCode = getComponent(components, "country", true);
  const addressLine1 = [streetNumber, route].filter(Boolean).join(" ").trim();

  const normalized = normalizeStructuredEventLocation({
    placeId: String(place?.place_id || ""),
    venueName:
      place?.name && place.name !== place?.formatted_address ? String(place.name) : "",
    formattedAddress: String(place?.formatted_address || ""),
    addressLine1,
    addressLine2: subpremise,
    city,
    state,
    postalCode,
    country,
    countryCode,
    latitude:
      typeof place?.geometry?.location?.lat === "function"
        ? String(place.geometry.location.lat())
        : "",
    longitude:
      typeof place?.geometry?.location?.lng === "function"
        ? String(place.geometry.location.lng())
        : "",
  });

  return normalized;
};
