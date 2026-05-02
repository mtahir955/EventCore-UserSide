"use client";

import Autocomplete from "react-google-autocomplete";
import {
  StructuredEventLocation,
  buildStructuredAddress,
  buildLocationDisplayLabel,
  extractStructuredLocationFromPlace,
  normalizeStructuredEventLocation,
} from "@/lib/google-places";
import { GOOGLE_MAPS_API_KEY, hasGoogleMapsApiKey } from "@/lib/google-maps";

type StructuredLocationEditorProps = {
  label?: string;
  helperText?: string;
  value: StructuredEventLocation;
  required?: boolean;
  onChange: (next: StructuredEventLocation) => void;
};

const inputClassName =
  "h-12 w-full rounded-lg border border-gray-200 bg-white px-4 text-sm dark:border-gray-700 dark:bg-[#181818]";

export function StructuredLocationEditor({
  label = "Search location",
  helperText,
  value,
  required = false,
  onChange,
}: StructuredLocationEditorProps) {
  const normalizedValue = normalizeStructuredEventLocation(value);

  const updateField = (field: keyof StructuredEventLocation, nextValue: string) => {
    const updated = normalizeStructuredEventLocation({
      ...normalizedValue,
      [field]: nextValue,
    });

    if (
      field === "venueName" ||
      field === "city" ||
      field === "state" ||
      field === "country"
    ) {
      updated.displayLocation = buildLocationDisplayLabel(updated);
    }

    if (
      field === "addressLine1" ||
      field === "addressLine2" ||
      field === "city" ||
      field === "state" ||
      field === "postalCode" ||
      field === "country"
    ) {
      updated.formattedAddress = buildStructuredAddress(updated);
    }

    onChange(updated);
  };

  const autocompletePlaceholder = hasGoogleMapsApiKey
    ? "Search venue, address, or city"
    : "Enter venue or city manually";

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">
          {label} {required ? <span className="text-[#D6111A]">*</span> : null}
        </label>
        {hasGoogleMapsApiKey ? (
          <Autocomplete
            key={
              normalizedValue.placeId ||
              normalizedValue.displayLocation ||
              normalizedValue.formattedAddress ||
              "structured-location"
            }
            apiKey={GOOGLE_MAPS_API_KEY}
            options={{
              fields: [
                "address_components",
                "formatted_address",
                "geometry",
                "name",
                "place_id",
              ],
            }}
            defaultValue={normalizedValue.displayLocation || normalizedValue.formattedAddress}
            onPlaceSelected={(place) => onChange(extractStructuredLocationFromPlace(place))}
            placeholder={autocompletePlaceholder}
            className={inputClassName}
          />
        ) : (
          <input
            type="text"
            value={normalizedValue.displayLocation}
            onChange={(e) => updateField("displayLocation", e.target.value)}
            placeholder={autocompletePlaceholder}
            className={inputClassName}
          />
        )}
        {helperText ? (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
        ) : null}
        {!hasGoogleMapsApiKey ? (
          <p className="mt-2 text-xs text-[#D6111A]">
            Google Places is disabled because `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is missing in
            this build.
          </p>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Venue name</label>
          <input
            type="text"
            value={normalizedValue.venueName}
            onChange={(e) => updateField("venueName", e.target.value)}
            placeholder="Convention Center"
            className={inputClassName}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Display location</label>
          <input
            type="text"
            value={normalizedValue.displayLocation}
            onChange={(e) => updateField("displayLocation", e.target.value)}
            placeholder="Shown on listings and tickets"
            className={inputClassName}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Address line 1 {required ? <span className="text-[#D6111A]">*</span> : null}
          </label>
          <input
            type="text"
            value={normalizedValue.addressLine1}
            onChange={(e) => updateField("addressLine1", e.target.value)}
            placeholder="123 Main Street"
            className={inputClassName}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Address line 2</label>
          <input
            type="text"
            value={normalizedValue.addressLine2}
            onChange={(e) => updateField("addressLine2", e.target.value)}
            placeholder="Suite, floor, room"
            className={inputClassName}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            City {required ? <span className="text-[#D6111A]">*</span> : null}
          </label>
          <input
            type="text"
            value={normalizedValue.city}
            onChange={(e) => updateField("city", e.target.value)}
            className={inputClassName}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">State / region</label>
          <input
            type="text"
            value={normalizedValue.state}
            onChange={(e) => updateField("state", e.target.value)}
            className={inputClassName}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Postal code</label>
          <input
            type="text"
            value={normalizedValue.postalCode}
            onChange={(e) => updateField("postalCode", e.target.value)}
            className={inputClassName}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Country {required ? <span className="text-[#D6111A]">*</span> : null}
          </label>
          <input
            type="text"
            value={normalizedValue.country}
            onChange={(e) => updateField("country", e.target.value)}
            className={inputClassName}
          />
        </div>
      </div>
    </div>
  );
}
