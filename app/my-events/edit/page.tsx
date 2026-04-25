"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "../../host-dashboard/components/sidebar";
import { StaffInfoModal } from "../../host-dashboard/components/staff-info-modal";
import { Menu } from "lucide-react";
import Link from "next/link";
import { X, LogOut, Moon, Sun, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import LogoutModalHost from "@/components/modals/LogoutModalHost";
// import axios from "axios";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";
// import { API_BASE_URL } from "@/config/apiConfig";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/apiClient";
import React, { useMemo } from "react";
import { City } from "country-state-city";
import { countries as countriesList } from "countries-list";
import { ChevronDown } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  DEFAULT_EVENT_TIMEZONE,
  normalizeEvent,
  slugifyEventSlug,
} from "@/lib/event-publishing";
import { StructuredLocationEditor } from "@/components/events/structured-location-editor";
import {
  EventCategoryOption,
  fetchTenantEventCategories,
} from "@/lib/event-categories";
import {
  EMPTY_STRUCTURED_EVENT_LOCATION,
  StructuredEventLocation,
  buildStructuredAddress,
  normalizeStructuredEventLocation,
} from "@/lib/google-places";
import {
  fetchTrainerLibrary,
  normalizeTrainerRecord,
  serializeEventTrainersForFormData,
  TrainerLibraryRecord,
} from "@/lib/trainer-library";

const getFileUrl = (path?: string | null) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  // if backend ever returns relative paths, keep them relative
  return path.startsWith("/") ? path : `/${path}`;
};

export default function EditEventPage() {
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Dropdowns
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Dummy notifications
  const notifications = [
    { id: 1, message: "Your event 'Tech Summit' was approved!" },
    { id: 2, message: "You sold 3 tickets for 'Lahore Music Fest'." },
    { id: 3, message: "New user message received." },
  ];

  type CountryMeta = {
    iso2: string;
    name: string;
    callingCode: string;
    flag: string;
  };

  type LocationOption = {
    key: string;
    label: string; // "City, Country"
    countryIso2: string;
    callingCode: string;
    flag: string;
  };

  const [openLocation, setOpenLocation] = useState(false);
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState<LocationOption[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // cache cities per country
  const cityCacheRef = useRef<Map<string, string[]>>(new Map());

  const allCountries: CountryMeta[] = useMemo(() => {
    const entries = Object.entries(countriesList) as Array<
      [string, { name: string; phone: string | string[] }]
    >;

    return entries
      .map(([iso2, c]) => {
        const phone = Array.isArray(c.phone) ? c.phone[0] : c.phone;
        const callingCode = phone ? `+${phone}` : "";
        const flag = `https://flagcdn.com/${iso2.toLowerCase()}.svg`;
        return { iso2, name: c.name, callingCode, flag };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  useEffect(() => {
    let cancelled = false;

    const q = locationQuery.trim().toLowerCase();
    if (q.length < 2) {
      setLocationResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const t = setTimeout(() => {
      if (cancelled) return;

      const results: LocationOption[] = [];
      const LIMIT = 200;

      for (const country of allCountries) {
        if (results.length >= LIMIT) break;

        let cities = cityCacheRef.current.get(country.iso2);
        if (!cities) {
          const raw = City.getCitiesOfCountry(country.iso2) ?? [];
          cities = Array.from(new Set(raw.map((c) => c.name))).sort((a, b) =>
            a.localeCompare(b),
          );
          cityCacheRef.current.set(country.iso2, cities);
        }

        // if country matches → show some cities
        if (country.name.toLowerCase().includes(q)) {
          for (const city of cities.slice(0, 20)) {
            if (results.length >= LIMIT) break;
            results.push({
              key: `${city}-${country.iso2}`,
              label: `${city}, ${country.name}`,
              countryIso2: country.iso2,
              callingCode: country.callingCode,
              flag: country.flag,
            });
          }
        }

        // city matches
        const matched = cities
          .filter((c) => c.toLowerCase().includes(q))
          .slice(0, 20);

        for (const city of matched) {
          if (results.length >= LIMIT) break;
          results.push({
            key: `${city}-${country.iso2}`,
            label: `${city}, ${country.name}`,
            countryIso2: country.iso2,
            callingCode: country.callingCode,
            flag: country.flag,
          });
        }
      }

      const uniq = Array.from(new Map(results.map((r) => [r.key, r])).values());

      if (!cancelled) {
        setLocationResults(uniq);
        setIsSearching(false);
      }
    }, 150);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [locationQuery, allCountries]);

  const handleSelectLocation = (opt: LocationOption) => {
    setEventLocation(opt.label); // ✅ saves FULL "City, Country"
    setOpenLocation(false);
  };

  const US_STATES = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { resolvedTheme, theme, setTheme } = useTheme();

  type EventCustomer = {
    id: string; // unique row id
    customerId: string; // real customer id
    name: string;
    email: string;
    ticketId: string;
    quantity: number;
  };

  const [customers, setCustomers] = useState<EventCustomer[]>([]);
  const [customersPage, setCustomersPage] = useState(1);
  const [customersTotalPages, setCustomersTotalPages] = useState(1);
  const customersLimit = 5;
  const [customersLoading, setCustomersLoading] = useState(false);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [hostName, setHostName] = useState("Host");

  useEffect(() => {
    const savedUser = localStorage.getItem("hostUser");

    if (savedUser) {
      const user = JSON.parse(savedUser);

      // Host Name
      setHostName(user.userName || user.fullName || "Host");

      // Subdomain (optional)
      // setHostSubdomain(user.subDomain || "");

      console.log("HOST DASHBOARD USER:", user);
      console.log("HOST SUBDOMAIN:", user?.subDomain);

      // Theme (optional)
      if (user.theme) {
        // syncThemeWithBackend(user);
      }
    } else {
      // Force redirect if no host session found
      window.location.href = "/sign-in-host";
    }
  }, []);

  const searchParams = useSearchParams();
  const eventId = searchParams.get("id");

  const [eventData, setEventData] = useState<any>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<EventCategoryOption[]>([]);
  const [eventLocation, setEventLocation] = useState("");
  const [locationData, setLocationData] = useState<StructuredEventLocation>(
    EMPTY_STRUCTURED_EVENT_LOCATION
  );
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [eventMode, setEventMode] = useState<"in-person" | "virtual" | "hybrid">(
    "in-person"
  );
  const [lifecycleStatus, setLifecycleStatus] = useState("DRAFT");
  const [customSlug, setCustomSlug] = useState("");
  const [goLiveDate, setGoLiveDate] = useState("");
  const [goLiveTime, setGoLiveTime] = useState("");
  const [eventTimezone, setEventTimezone] = useState(DEFAULT_EVENT_TIMEZONE);
  const [isPrivate, setIsPrivate] = useState(false);
  const [privacyType, setPrivacyType] = useState("link-only");
  const [accessPassword, setAccessPassword] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [stateRegion, setStateRegion] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("United States");
  const [streamProvider, setStreamProvider] = useState("Vimeo");
  const [streamUrl, setStreamUrl] = useState("");
  const [requiresTicketToWatch, setRequiresTicketToWatch] = useState(true);
  const [selectedTrainers, setSelectedTrainers] = useState<TrainerLibraryRecord[]>([]);
  const [trainerLibrary, setTrainerLibrary] = useState<TrainerLibraryRecord[]>([]);
  const [sendingVirtualLinks, setSendingVirtualLinks] = useState(false);
  const [showSendVirtualLinksPrompt, setShowSendVirtualLinksPrompt] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTenantEventCategories()
      .then((categories) => setCategoryOptions(categories))
      .catch(() => setCategoryOptions([]));

    fetchTrainerLibrary()
      .then((trainers) => setTrainerLibrary(trainers))
      .catch(() => setTrainerLibrary([]));
  }, []);

  // const getToken = () => {
  //   let rawToken =
  //     localStorage.getItem("hostToken") ||
  //     localStorage.getItem("hostUser") ||
  //     localStorage.getItem("token");

  //   try {
  //     const parsed = JSON.parse(rawToken || "{}");
  //     return parsed?.token || parsed;
  //   } catch {
  //     return rawToken;
  //   }
  // };

  const fetchEventDetails = async () => {
    if (!eventId) {
      console.log("❌ No Event ID provided");
      return;
    }

    try {
      setIsLoading(true);

      // const token = getToken();

      // const response = await axios.get(`${API_BASE_URL}/events/${eventId}`, {
      //   headers: {
      //     "X-Tenant-ID": HOST_Tenant_ID,
      //     Authorization: `Bearer ${token}`,
      //   },
      // });
      const response = await apiClient.get(`/events/${eventId}`);

      const data = response.data?.data || response.data;
      const normalizedEvent = normalizeEvent(data);
      const normalizedLocation = normalizeStructuredEventLocation({
        ...(data.locationData || {}),
        venueName: data.venueName || data.locationData?.venueName,
        displayLocation:
          data.displayLocation ||
          data.eventLocation ||
          data.locationData?.displayLocation,
        addressLine1: data.addressLine1 || data.locationData?.addressLine1,
        addressLine2: data.addressLine2 || data.locationData?.addressLine2,
        city: data.city || data.locationData?.city,
        state: data.state || data.locationData?.state,
        postalCode: data.postalCode || data.zipCode || data.locationData?.postalCode,
        country: data.country || data.locationData?.country,
      });

      console.log("EVENT DETAILS:", data);

      // ⭐ SAVE EVENT ID LOCALLY FOR STAFF MODULE
      localStorage.setItem("editEventId", eventId);

      setEventData(data);

      setEventTitle(data.eventTitle || normalizedEvent.title || "");
      setShortDescription(
        data.shortDescription || data.summary || normalizedEvent.shortDescription || ""
      );
      setEventCategory(data.eventCategory || data.category || normalizedEvent.category || "");
      setEventLocation(data.eventLocation || normalizedEvent.locationLabel || "");
      setLocationData(normalizedLocation);
      setEventDate(normalizedEvent.startDate || data.startDate || "");

      setStartTime(normalizedEvent.startTime || data.startTime?.slice(0, 5) || "");
      setEndTime(normalizedEvent.endTime || data.endTime?.slice(0, 5) || "");
      setEventMode(normalizedEvent.mode || data.eventType || data.mode || "in-person");
      setLifecycleStatus(
        normalizedEvent.lifecycleStatus ||
          data.lifecycleStatus ||
          data.publishStatus ||
          data.status ||
          "DRAFT"
      );
      setCustomSlug(data.slug || data.customSlug || normalizedEvent.slug || slugifyEventSlug(data.eventTitle || ""));
      setGoLiveDate(normalizedEvent.goLiveDate || data.goLiveDate || data.publishDate || "");
      setGoLiveTime(normalizedEvent.goLiveTime || data.goLiveTime || data.publishTime || "");
      setEventTimezone(normalizedEvent.eventTimezone || data.eventTimezone || data.timezone || DEFAULT_EVENT_TIMEZONE);
      setIsPrivate(normalizedEvent.isPrivate);
      setPrivacyType(
        normalizedEvent.privacyType === "public"
          ? "link-only"
          : normalizedEvent.privacyType
      );
      setAccessPassword(data.accessPassword || data.password || "");
      setAddressLine1(normalizedLocation.addressLine1 || "");
      setAddressLine2(normalizedLocation.addressLine2 || "");
      setCity(normalizedLocation.city || "");
      setStateRegion(normalizedLocation.state || "");
      setPostalCode(normalizedLocation.postalCode || "");
      setCountry(normalizedLocation.country || "United States");
      setStreamProvider(data.streamProvider || "Vimeo");
      setStreamUrl(data.streamUrl || data.vimeoUrl || "");
      setRequiresTicketToWatch(
        data.requiresTicketToWatch !== undefined
          ? Boolean(data.requiresTicketToWatch)
          : true
      );
      setSelectedTrainers(
        Array.isArray(data.trainers) ? data.trainers.map(normalizeTrainerRecord) : []
      );

      // if (data?.bannerImage) {
      //   setPreviewImage(data.bannerImage);
      // }
      if (data?.bannerImage) {
        setPreviewImage(getFileUrl(data.bannerImage));
      }
    } catch (err) {
      console.error("Failed to load event", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [eventId]);

  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(
    null,
  );

  const handleUpdateEvent = async () => {
    if (!eventId) return toast.error("Missing Event ID");

    try {
      const normalizedLocation = normalizeStructuredEventLocation({
        ...locationData,
        addressLine1,
        addressLine2,
        city,
        state: stateRegion,
        postalCode,
        country,
        displayLocation: eventLocation || locationData.displayLocation,
      });
      const fullAddress = buildStructuredAddress(normalizedLocation);
      const eventPrivacyType = isPrivate ? privacyType : "public";
      const eventDescription =
        eventData?.eventDescription || eventData?.description || "";
      const eventSettingsPayload = {
        eventTimezone,
        goLiveDate,
        goLiveTime,
        lifecycleStatus,
        isPrivate,
        privateEventType: eventPrivacyType,
        accessPassword,
        venueName: normalizedLocation.venueName || "",
        displayLocation: normalizedLocation.displayLocation || eventLocation || "",
        addressLine1: normalizedLocation.addressLine1 || "",
        addressLine2: normalizedLocation.addressLine2 || "",
        city: normalizedLocation.city || "",
        state: normalizedLocation.state || "",
        postalCode: normalizedLocation.postalCode || "",
        country: normalizedLocation.country || "",
        locationData: normalizedLocation,
        streamProvider,
        streamUrl,
        requiresTicketToWatch,
      };

      // const token = getToken();

      const formData = new FormData();
      formData.append("eventTitle", eventTitle);
      formData.append("shortDescription", shortDescription);
      formData.append("eventDescription", eventDescription);
      formData.append(
        "eventCategory",
        eventCategory
      );
      formData.append(
        "eventLocation",
        eventMode === "virtual"
          ? eventLocation || "Online"
          : normalizedLocation.displayLocation || eventLocation
      );
      formData.append("startDate", eventDate);
      formData.append("endDate", eventDate);
      formData.append("startTime", startTime);
      formData.append("endTime", endTime);
      formData.append("eventType", eventMode);
      formData.append("lifecycleStatus", lifecycleStatus);
      formData.append("customSlug", customSlug);
      formData.append("goLiveDate", goLiveDate);
      formData.append("goLiveTime", goLiveTime);
      formData.append("eventTimezone", eventTimezone);
      formData.append("isPrivate", String(isPrivate));
      formData.append("privateEventType", eventPrivacyType);
      formData.append("accessPassword", accessPassword);
      formData.append("venueName", normalizedLocation.venueName || "");
      formData.append(
        "displayLocation",
        normalizedLocation.displayLocation || eventLocation || ""
      );
      formData.append("addressLine1", normalizedLocation.addressLine1 || "");
      formData.append("addressLine2", normalizedLocation.addressLine2 || "");
      formData.append("city", normalizedLocation.city || "");
      formData.append("state", normalizedLocation.state || "");
      formData.append("postalCode", normalizedLocation.postalCode || "");
      formData.append("country", normalizedLocation.country || "");
      formData.append("fullAddress", fullAddress);
      formData.append("locationData", JSON.stringify(normalizedLocation));
      formData.append("streamProvider", streamProvider);
      formData.append("streamUrl", streamUrl);
      formData.append("requiresTicketToWatch", String(requiresTicketToWatch));
      formData.append("eventSettings", JSON.stringify(eventSettingsPayload));
      serializeEventTrainersForFormData(formData, selectedTrainers);

      if (selectedBannerFile) {
        formData.append("bannerImage", selectedBannerFile);
      }

      // const response = await axios.put(
      //   `${API_BASE_URL}/events/${eventId}`,
      //   formData,
      //   {
      //     headers: {
      //       "X-Tenant-ID": HOST_Tenant_ID,
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // );

      const response = await apiClient.put(`/events/${eventId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("UPDATED SUCCESS:", response.data);
      toast.success("Event updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update event. Try again.");
    }
  };

  const addTrainerToEvent = (trainer: TrainerLibraryRecord) => {
    setSelectedTrainers((current) => {
      if (current.some((entry) => entry.id === trainer.id)) return current;
      return [...current, trainer];
    });
  };

  const removeTrainerFromEvent = (trainerId: string) => {
    setSelectedTrainers((current) => current.filter((trainer) => trainer.id !== trainerId));
  };

  const handleSendVirtualLinks = async () => {
    if (!eventId) return;

    try {
      setSendingVirtualLinks(true);
      const response = await apiClient.post(`/events/${eventId}/virtual-links/send`, {});
      const queued = response.data?.data?.recipientsQueued;
      toast.success(
        queued
          ? `Virtual links queued for ${queued} purchaser(s).`
          : "Virtual link send started for purchasers."
      );
      setShowSendVirtualLinksPrompt(false);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Backend support for sending virtual links is not available yet."
      );
    } finally {
      setSendingVirtualLinks(false);
    }
  };

  const fetchEventCustomers = async () => {
    if (!eventId) return;

    try {
      setCustomersLoading(true);

      // const token = getToken();

      // const res = await axios.get(
      //   `${API_BASE_URL}/events/${eventId}/customers`,
      //   {
      //     params: {
      //       page: customersPage,
      //       limit: customersLimit,
      //     },
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "X-Tenant-ID": HOST_Tenant_ID,
      //     },
      //   }
      // );

      const res = await apiClient.get(`/events/${eventId}/customers`, {
        params: { page: customersPage, limit: customersLimit },
      });

      const customersRaw = res.data?.data?.customers ?? [];
      const totalPages =
        res.data?.data?.pagination?.totalPages ??
        res.data?.pagination?.totalPages ??
        1;

      // const normalizedCustomers = res.data.data.customers.map((c: any) => ({
      //   id: `${c.customerId}-${c.ticketId}`, // ✅ UNIQUE KEY
      //   customerId: c.customerId,
      //   name: c.fullName,
      //   email: c.email,
      //   ticketId: c.ticketId,
      //   quantity: c.quantity,
      // }));
      const normalizedCustomers = customersRaw.map((c: any) => ({
        id: `${c.customerId}-${c.ticketId}`,
        customerId: c.customerId,
        name: c.fullName,
        email: c.email,
        ticketId: c.ticketId,
        quantity: c.quantity,
      }));

      setCustomers(normalizedCustomers);
      setCustomersTotalPages(totalPages);
      // setCustomersTotalPages(res.data.pagination.totalPages);
      // setCustomersTotalPages(res.data.data.pagination.totalPages);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Failed to load event customers",
      );
    } finally {
      setCustomersLoading(false);
    }
  };

  useEffect(() => {
    fetchEventCustomers();
  }, [eventId, customersPage]);

  return (
    <div className="flex min-h-screen bg-[#FAFAFB] relative">
      {/* Sidebar */}
      <Sidebar
        active="My Events"
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
      />

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu size={24} className="text-black" />
          </button>
          <h3 className="text-lg font-semibold text-black">Events</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border h-9 w-9 flex justify-center items-center rounded-full">
            <img
              src="/images/icons/notification-new.png"
              alt="notification"
              className="h-4 w-4"
            />
          </div>
          <div className="bg-black border h-9 w-9 flex justify-center items-center rounded-full">
            <img
              src="/images/icons/profile-user.png"
              alt="profile"
              className="h-4 w-4"
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-[256px] pt-20 md:pt-0 dark:bg-[#101010]">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-6 border-b bg-white dark:bg-[#101010]">
          <h1 className="text-2xl font-semibold">Events</h1>
          {/* Right section */}
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-4 relative">
              {/* Light/Dark toggle */}
              {/* <Button
                onClick={() =>
                  setTheme(resolvedTheme === "light" ? "dark" : "light")
                }
                variant="ghost"
                size="sm"
                className="hidden lg:flex text-gray-600 dark:text-gray-300 gap-2 hover:text-[#0077F7]"
              >
                {theme === "light" ? (
                  <>
                    <Moon className="h-4 w-4" /> Dark Mode
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4" /> Light Mode
                  </>
                )}
              </Button> */}

              {/* Mobile toggle */}
              {/* <button
                onClick={() =>
                  setTheme(resolvedTheme === "light" ? "dark" : "light")
                }
                className="lg:hidden p-1 text-gray-700 dark:text-gray-300 hover:text-[#0077F7] flex-shrink-0"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Sun className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </button> */}
              {/* Notification icon */}
              {/* <div ref={notificationsRef} className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowProfileDropdown(false);
                  }}
                  className="bg-black dark:bg-black border h-9 w-9 flex justify-center items-center rounded-full relative hover:opacity-90"
                >
                  <img
                    src="/icons/Vector.png"
                    alt="notification"
                    className="h-4 w-4"
                  /> */}
              {/* Counter badge */}
              {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-semibold rounded-full h-4 w-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                </button> */}

              {/* Notification popup */}
              {/* {showNotifications && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#101010] shadow-lg border border-gray-200 rounded-xl z-50 p-3">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-white mb-2">
                      Notifications
                    </h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className="text-sm bg-gray-50 dark:bg-[#1f1e1e] rounded-lg p-2 hover:bg-gray-100 transition"
                          >
                            {n.message}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">
                          No new notifications
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div> */}

              {/* Profile Name + Icon + Dropdown */}
              <div
                className="relative flex items-center gap-2"
                ref={profileRef}
              >
                {/* Host Name */}
                <span className="hidden sm:block font-semibold text-black dark:text-white">
                  {hostName}
                </span>

                {/* Profile Icon Wrapper */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setShowProfileDropdown(!showProfileDropdown);
                      setShowNotifications(false);
                    }}
                    className="bg-black border h-9 w-9 flex justify-center items-center rounded-full hover:opacity-90"
                  >
                    <img
                      src="/images/icons/profile-user.png"
                      alt="profile"
                      className="h-4 w-4"
                    />
                  </button>

                  {/* Dropdown */}
                  {showProfileDropdown && (
                    <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-[#101010] shadow-lg border border-gray-200 dark:border-gray-800 rounded-xl z-50 py-2">
                      <Link href="/my-events">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
                          My Events
                        </button>
                      </Link>

                      <Link href="/ticket-manager">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
                          Ticket Manager
                        </button>
                      </Link>

                      <Link href="/host-payments">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
                          Payments
                        </button>
                      </Link>

                      <Link href="/host-settings">
                        <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg">
                          System Settings
                        </button>
                      </Link>

                      <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white dark:hover:bg-gray-900 hover:bg-gray-100 rounded-lg"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Bottom Divider Line */}
        <div className="border-b border-gray-200 dark:border-gray-800"></div>

        {/* Page content */}
        <div className="px-1 md:px-8 py-6">
          {/* Top bar with back button and actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
            <div className="flex items-center gap-4">
              <button
                aria-label="Back"
                onClick={() => window.history.back()}
                className="h-8 w-8 grid place-items-center"
              >
                <img
                  src="/images/icons/back-arrow.png"
                  alt="Back"
                  className="h-6 w-6 sm:h-8 sm:w-8"
                />
              </button>
              <h2 className="text-lg sm:text-xl font-semibold">
                Edit Event Info
              </h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-nowrap justify-start sm:justify-end">
              {eventId && (
                <Link
                  href={`/my-events/${eventId}/tickets?title=${encodeURIComponent(
                    eventTitle || "Event",
                  )}`}
                >
                  <button className="flex-shrink-0 px-4 sm:px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-[#D19537] whitespace-nowrap">
                    View Tickets
                  </button>
                </Link>
              )}
              <button
                onClick={() => setIsStaffModalOpen(true)}
                className="flex-shrink-0 px-4 sm:px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-black whitespace-nowrap"
              >
                Staff Management
              </button>
              <button
                onClick={handleUpdateEvent}
                className="flex-shrink-0 px-4 sm:px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-[#D19537] whitespace-nowrap"
              >
                Save Event Updates
              </button>
            </div>
          </div>

          {/* Hero Image (Editable) */}
          <div className="relative rounded-2xl overflow-hidden mb-6 h-[180px] sm:h-[200px]">
            {/* Event Banner */}
            {/* <img
              src={previewImage || "/images/event-hero-banner.png"}
              alt="Event banner"
              className="h-full w-full object-cover transition-all duration-300"
            />  */}
            <img
              src={previewImage || "/images/event-hero-banner.png"}
              alt="Event banner"
              className="h-full w-full object-cover transition-all duration-300"
              onError={(e) => {
                // fallback if image fails to load
                (e.currentTarget as HTMLImageElement).src =
                  "/images/event-hero-banner.png";
              }}
            />

            {/* Edit Button */}
            <button
              aria-label="Edit banner"
              onClick={() => fileInputRef.current?.click()}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white grid place-items-center shadow-lg hover:scale-105 transition-transform"
            >
              <PencilLine color="#D19537" className="h-6 w-6" />
            </button>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setSelectedBannerFile(file);

                  const reader = new FileReader();
                  reader.onload = (event) => {
                    setPreviewImage(event.target?.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
          </div>

          {/* Event Form */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Event Name
              </label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white dark:bg-[#101010] text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Short Description
              </label>
              <textarea
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value.slice(0, 220))}
                className="w-full min-h-[96px] px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white dark:bg-[#101010] text-sm"
                placeholder="Used for cards, listings, and previews"
              />
              <p className="mt-2 text-xs text-gray-500">{shortDescription.length}/220</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={eventCategory}
                onChange={(e) => setEventCategory(e.target.value)}
                disabled={categoryOptions.length === 0}
                className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white dark:bg-[#101010] text-sm"
              >
                <option value="">
                  {categoryOptions.length === 0
                    ? "No tenant categories available"
                    : "Select category"}
                </option>
                {categoryOptions.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {categoryOptions.length === 0 ? (
                <p className="mt-2 text-xs text-[#D6111A]">
                  No tenant categories are available from `/categories/tenant` yet.
                </p>
              ) : null}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Event Mode</label>
                <select
                  value={eventMode}
                  onChange={(e) =>
                    setEventMode(e.target.value as "in-person" | "virtual" | "hybrid")
                  }
                  className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white dark:bg-[#101010] text-sm"
                >
                  <option value="in-person">In-person</option>
                  <option value="virtual">Virtual</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Lifecycle Status</label>
                <select
                  value={lifecycleStatus}
                  onChange={(e) => setLifecycleStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white dark:bg-[#101010] text-sm"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="UNPUBLISHED">Unpublished</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Timezone</label>
                <input
                  type="text"
                  value={eventTimezone}
                  onChange={(e) => setEventTimezone(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white dark:bg-[#101010] text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-1">
                {eventMode === "virtual" ? (
                  <>
                    <label className="block text-sm font-medium mb-2">
                      Display Location
                    </label>
                    <input
                      type="text"
                      value={eventLocation || "Online"}
                      onChange={(e) => setEventLocation(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white dark:bg-[#101010] text-sm"
                    />
                  </>
                ) : (
                  <StructuredLocationEditor
                    label="Venue and structured address"
                    required
                    value={normalizeStructuredEventLocation({
                      ...locationData,
                      displayLocation: eventLocation || locationData.displayLocation,
                      addressLine1,
                      addressLine2,
                      city,
                      state: stateRegion,
                      postalCode,
                      country,
                    })}
                    onChange={(nextLocation) => {
                      setLocationData(nextLocation);
                      setEventLocation(nextLocation.displayLocation);
                      setAddressLine1(nextLocation.addressLine1);
                      setAddressLine2(nextLocation.addressLine2);
                      setCity(nextLocation.city);
                      setStateRegion(nextLocation.state);
                      setPostalCode(nextLocation.postalCode);
                      setCountry(nextLocation.country);
                    }}
                    helperText="Google Places now drives the edit flow too, with manual overrides for every location field."
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] 
                 bg-white dark:bg-[#101010] text-sm pr-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] 
                 bg-white dark:bg-[#101010] text-sm pr-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  End Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] 
                 bg-white dark:bg-[#101010] text-sm pr-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Custom URL slug</label>
                <input
                  type="text"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(slugifyEventSlug(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white dark:bg-[#101010] text-sm"
                  placeholder="summer-gala-2026"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Go-live Date</label>
                  <input
                    type="date"
                    value={goLiveDate}
                    onChange={(e) => setGoLiveDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white dark:bg-[#101010] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Go-live Time</label>
                  <input
                    type="time"
                    value={goLiveTime}
                    onChange={(e) => setGoLiveTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white dark:bg-[#101010] text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[#F5EDE5] bg-white dark:bg-[#101010] p-4 space-y-4">
              <label className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-sm">Private Event</p>
                  <p className="text-xs text-gray-500">
                    Hidden from public listings when enabled.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="h-5 w-5 accent-[#D19537]"
                />
              </label>

              {isPrivate && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Private Type</label>
                    <select
                      value={privacyType}
                      onChange={(e) => setPrivacyType(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white dark:bg-[#101010] text-sm"
                    >
                      <option value="link-only">Link only</option>
                      <option value="password-protected">Password protected</option>
                      <option value="invite-only">Invite only</option>
                    </select>
                  </div>

                  {privacyType === "password-protected" && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Access Password</label>
                      <input
                        type="text"
                        value={accessPassword}
                        onChange={(e) => setAccessPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white dark:bg-[#101010] text-sm"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {(eventMode === "in-person" || eventMode === "hybrid") && (
              <div className="rounded-xl border border-[#F5EDE5] bg-white dark:bg-[#101010] p-4 space-y-4">
                <h3 className="text-sm font-semibold">Venue Address</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  The structured address above is now the source of truth for venue,
                  address, city, state, postal code, and country.
                </p>
                <div className="rounded-lg bg-[#FAFAFB] p-4 text-sm dark:bg-[#161616]">
                  {buildStructuredAddress(
                    normalizeStructuredEventLocation({
                      ...locationData,
                      addressLine1,
                      addressLine2,
                      city,
                      state: stateRegion,
                      postalCode,
                      country,
                    })
                  ) || "No venue address selected yet."}
                </div>
              </div>
            )}

            {(eventMode === "virtual" || eventMode === "hybrid") && (
              <div className="rounded-xl border border-[#F5EDE5] bg-white dark:bg-[#101010] p-4 space-y-4">
                <h3 className="text-sm font-semibold">Livestream</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Provider</label>
                    <select
                      value={streamProvider}
                      onChange={(e) => setStreamProvider(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white dark:bg-[#101010] text-sm"
                    >
                      <option value="Vimeo">Vimeo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Stream URL</label>
                    <input
                      type="url"
                      value={streamUrl}
                      onChange={(e) => setStreamUrl(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5] bg-white dark:bg-[#101010] text-sm"
                      placeholder="https://vimeo.com/..."
                    />
                  </div>
                </div>

                <label className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-medium text-sm">Require ticket to watch</p>
                    <p className="text-xs text-gray-500">
                      Keeps the stream gated for logged-in ticket holders.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={requiresTicketToWatch}
                    onChange={(e) => setRequiresTicketToWatch(e.target.checked)}
                    className="h-5 w-5 accent-[#D19537]"
                  />
                </label>

                <div className="rounded-lg bg-[#FAFAFB] p-4 dark:bg-[#161616]">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-sm">Send virtual link to purchasers</p>
                      <p className="text-xs text-gray-500">
                        This is a manual host action. The public event page no longer shows the watch link.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSendVirtualLinksPrompt(true)}
                      disabled={!streamUrl}
                      className="h-10 rounded-lg bg-[#D19537] px-4 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      Send Virtual Link
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-xl border border-[#F5EDE5] bg-white dark:bg-[#101010] p-4 space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-semibold">Event Trainers</h3>
                  <p className="text-xs text-gray-500">
                    Select trainers from your library to update the live event page after save.
                  </p>
                </div>
                <Link href="/host-trainers" className="text-sm font-semibold text-[#D19537]">
                  Manage Library
                </Link>
              </div>

              {trainerLibrary.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {trainerLibrary.map((trainer) => {
                    const alreadySelected = selectedTrainers.some(
                      (entry) => entry.id === trainer.id
                    );

                    return (
                      <div
                        key={trainer.id}
                        className="rounded-lg border border-[#F5EDE5] p-3"
                      >
                        <p className="font-medium text-sm">{trainer.name}</p>
                        <p className="text-xs text-[#D19537]">{trainer.title}</p>
                        <button
                          type="button"
                          onClick={() =>
                            alreadySelected
                              ? removeTrainerFromEvent(trainer.id)
                              : addTrainerToEvent(trainer)
                          }
                          className={`mt-3 h-9 rounded-lg px-4 text-xs font-semibold ${
                            alreadySelected
                              ? "bg-red-50 text-[#D6111A]"
                              : "bg-[#FFF5E6] text-[#D19537]"
                          }`}
                        >
                          {alreadySelected ? "Remove" : "Add to Event"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No trainer library entries found yet. Create them from the trainer dashboard first.
                </p>
              )}

              <div className="space-y-3">
                {selectedTrainers.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No trainers selected for this event.
                  </p>
                ) : (
                  selectedTrainers.map((trainer) => (
                    <div
                      key={trainer.id || trainer.name}
                      className="rounded-lg bg-[#FAFAFB] p-4 dark:bg-[#161616]"
                    >
                      <p className="font-medium">{trainer.name}</p>
                      <p className="text-sm text-[#D19537]">{trainer.title}</p>
                      <p className="mt-1 text-sm text-gray-500">{trainer.bio}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Attendees Table */}
          <div className="rounded-xl overflow-hidden border border-[#F5EDE5]">
            {/* Table Header */}
            <div className="flex sm:grid sm:grid-cols-5 px-6 py-4 text-sm font-semibold bg-[#F5EDE5] text-black">
              <div className="flex-1">Name</div>
              <div className="flex-1">Email</div>
              <div className="flex-1">Ticket ID</div>
              <div className="flex-1 text-right sm:text-left">Quantity</div>
              <div className="flex-1 text-right sm:text-left">Actions</div>
            </div>

            {/* Mobile Table Title */}
            <div className="hidden sm:hidden px-4 py-3 text-[15px] font-semibold bg-[#F5EDE5]">
              Attendees
            </div>

            {/* ⭐ PAGINATED DATA */}
            {customersLoading ? (
              <div className="p-6 text-center text-sm text-gray-500">
                Loading attendees...
              </div>
            ) : customers.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">
                No attendees found
              </div>
            ) : (
              customers.map((attendee) => (
                <div
                  key={attendee.id}
                  className="grid grid-cols-5 px-4 sm:px-6 py-4 text-sm border-t border-[#F5EDE5] bg-white dark:bg-[#101010]"
                >
                  {/* Name */}
                  <div className="font-medium">{attendee.name}</div>

                  {/* Email */}
                  <div className="text-gray-700 dark:text-white break-all">
                    {attendee.email}
                  </div>

                  {/* Ticket ID */}
                  <div className="text-gray-700 dark:text-white">
                    {attendee.ticketId}
                  </div>

                  {/* Quantity */}
                  <div className="text-gray-700 dark:text-white">
                    {attendee.quantity}
                  </div>

                  <div>
                    {eventId && (
                      <Link
                        href={`/my-events/${eventId}/tickets?title=${encodeURIComponent(
                          eventTitle || "Event",
                        )}`}
                      >
                        <button className="rounded-lg bg-[#D19537] px-3 py-1.5 text-xs font-semibold text-white">
                          Manage
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {customersTotalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4 mb-6">
              <button
                disabled={customersPage === 1}
                onClick={() => setCustomersPage((p) => p - 1)}
                className="px-4 py-2 border rounded-md disabled:opacity-40"
              >
                Prev
              </button>

              {Array.from({ length: customersTotalPages }, (_, i) => {
                const pageNumber = i + 1;

                return (
                  <button
                    key={`page-${pageNumber}`}
                    onClick={() => setCustomersPage(pageNumber)}
                    className={`px-4 py-2 border rounded-md ${
                      customersPage === pageNumber
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : ""
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button
                disabled={customersPage === customersTotalPages}
                onClick={() => setCustomersPage((p) => p + 1)}
                className="px-4 py-2 border rounded-md disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>

      {showSendVirtualLinksPrompt ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-[#101010]">
            <h3 className="text-lg font-semibold">Send virtual link now?</h3>
            <p className="mt-2 text-sm text-gray-500">
              This manual action will send the current livestream access link to
              purchasers once backend support is available.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowSendVirtualLinksPrompt(false)}
                className="h-10 rounded-lg bg-[#FFF5E6] px-4 text-sm font-semibold text-[#D19537]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendVirtualLinks}
                disabled={sendingVirtualLinks}
                className="h-10 rounded-lg bg-[#D19537] px-4 text-sm font-semibold text-white disabled:opacity-50"
              >
                {sendingVirtualLinks ? "Sending..." : "Send Link"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Logout Modal */}
      <LogoutModalHost
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onLogout={() => {
          localStorage.clear();
          window.location.href = "/sign-in-host";
        }}
      />
      {/* StaffInfo Modal before integration */}
      {/* <StaffInfoModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        staff={staffMembers}
      /> */}

      {/* StaffInfo Modal after integration */}
      <StaffInfoModal
        isOpen={isStaffModalOpen}
        onClose={() => setIsStaffModalOpen(false)}
        eventId={eventId ?? undefined} // ⭐ converts null → undefined
      />
    </div>
  );
}
