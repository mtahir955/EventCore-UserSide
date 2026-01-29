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
  const [eventLocation, setEventLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [isLoading, setIsLoading] = useState(false);

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

      console.log("EVENT DETAILS:", data);

      // ⭐ SAVE EVENT ID LOCALLY FOR STAFF MODULE
      localStorage.setItem("editEventId", eventId);

      setEventData(data);

      setEventTitle(data.eventTitle || "");
      setEventLocation(data.eventLocation || "");
      setEventDate(data.startDate || "");

      setStartTime(data.startTime?.slice(0, 5) || "");
      setEndTime(data.endTime?.slice(0, 5) || "");

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
      // const token = getToken();

      const formData = new FormData();
      formData.append("eventTitle", eventTitle);
      formData.append("eventLocation", eventLocation);
      formData.append("startDate", eventDate);
      formData.append("endDate", eventDate);
      formData.append("startTime", startTime);
      formData.append("endTime", endTime);

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
                Mark as Complete
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

            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Location
                </label>

                <Popover open={openLocation} onOpenChange={setOpenLocation}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="w-full px-4 py-3 rounded-lg border border-[#F5EDE5]
      bg-white dark:bg-[#101010] text-sm flex items-center justify-between"
                    >
                      <span className={eventLocation ? "" : "text-gray-400"}>
                        {eventLocation
                          ? eventLocation
                          : "Search city or country..."}
                      </span>
                      <ChevronDown size={16} className="opacity-70" />
                    </button>
                  </PopoverTrigger>

                  <PopoverContent className="p-0 w-[--radix-popover-trigger-width]">
                    <Command>
                      <CommandInput
                        placeholder="Type: lahore / pakistan / london..."
                        value={locationQuery}
                        onValueChange={setLocationQuery}
                      />

                      <CommandEmpty>
                        {isSearching
                          ? "Searching..."
                          : "No results found (type 2+ letters)."}
                      </CommandEmpty>

                      <CommandGroup className="max-h-64 overflow-y-auto">
                        {locationResults.map((opt) => (
                          <CommandItem
                            key={opt.key}
                            value={opt.label}
                            onSelect={() => handleSelectLocation(opt)}
                            className="flex items-center gap-2"
                          >
                            <img
                              src={opt.flag}
                              alt="flag"
                              className="h-4 w-6 object-cover rounded-sm"
                            />
                            <span>{opt.label}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
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
          </div>

          {/* Attendees Table */}
          <div className="rounded-xl overflow-hidden border border-[#F5EDE5]">
            {/* Table Header */}
            <div className="flex sm:grid sm:grid-cols-4 px-6 py-4 text-sm font-semibold bg-[#F5EDE5] text-black">
              <div className="flex-1">Name</div>
              <div className="flex-1">Email</div>
              <div className="flex-1">Ticket ID</div>
              <div className="flex-1 text-right sm:text-left">Quantity</div>
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
                  className="grid grid-cols-4 px-4 sm:px-6 py-4 text-sm border-t border-[#F5EDE5] bg-white dark:bg-[#101010]"
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
