"use client";

import { useState, useEffect } from "react";
// import axios from "axios";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";
import { apiClient } from "@/lib/apiClient";

interface Ticket {
  id: string;
  name: string;
  price: string;
  type: "general" | "vip";
  transferable: boolean;
}

type SetImagesPageProps = {
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
};

const STORAGE_KEY = "eventDraft";

export default function TicketingDetailsPage({
  setActivePage,
}: SetImagesPageProps) {
  const [eventType, setEventType] = useState<"ticketed" | "free">("ticketed");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentTicket, setCurrentTicket] = useState({
    name: "",
    price: "",
    type: "",
    transferable: false,
  });
  const [error, setError] = useState("");

  /* ===== FEATURE FLAG ===== */
  const [allowTransfers, setAllowTransfers] = useState<boolean>(false);

  /* ================= FETCH FEATURES ================= */
  // useEffect(() => {
  //   const fetchFeatures = async () => {
  //     try {
  //       const token = localStorage.getItem("hostToken");
  //       if (!token) return;

  //       const res = await axios.get(`${API_BASE_URL}/tenants/my/features`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "x-tenant-id": HOST_Tenant_ID,
  //         },
  //       });

  //       setAllowTransfers(
  //         Boolean(res.data?.data?.features?.allowTransfers?.enabled)
  //       );
  //     } catch (err) {
  //       console.error("Failed to load tenant features", err);
  //       setAllowTransfers(false);
  //     }
  //   };

  //   fetchFeatures();
  // }, []);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        // ✅ apiClient auto adds Authorization + X-Tenant-ID
        const res = await apiClient.get(`/tenants/my/features`);

        setAllowTransfers(
          Boolean(res.data?.data?.features?.allowTransfers?.enabled)
        );
      } catch (err) {
        console.error("Failed to load tenant features", err);
        setAllowTransfers(false);
      }
    };

    fetchFeatures();
  }, []);

  const handleGoBack = () => setActivePage("set-images");

  /* ================= LOCAL STORAGE ================= */

  const saveTicketsToLocalStorage = (
    updatedTickets: Ticket[],
    type?: string
  ) => {
    if (typeof window === "undefined") return;
    try {
      const existing = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "{}"
      ) as any;

      const updated: any = {
        ...existing,
        tickets: updatedTickets,
      };

      if (type) updated.eventType = type;

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save tickets to localStorage", e);
    }
  };

  /* ================= ACTIONS ================= */

  const handleSaveAndContinue = () => {
    if (eventType === "ticketed" && tickets.length === 0) {
      setError("Please add at least one ticket before continuing.");
      return;
    }

    setError("");
    saveTicketsToLocalStorage(tickets, eventType);
    setActivePage("preview-event");
  };

  const handleAddTicket = () => {
    if (
      !currentTicket.name.trim() ||
      !currentTicket.price.trim() ||
      !currentTicket.type
    ) {
      setError("Please fill in ticket name, price, and type.");
      return;
    }

    const newTicket: Ticket = {
      id: Date.now().toString(),
      name: currentTicket.name,
      price: currentTicket.price,
      type: currentTicket.type as "general" | "vip",
      transferable: allowTransfers ? currentTicket.transferable : false,
    };

    const updatedTickets = [...tickets, newTicket];

    setTickets(updatedTickets);
    saveTicketsToLocalStorage(updatedTickets, eventType);

    setCurrentTicket({
      name: "",
      price: "",
      type: "",
      transferable: false,
    });

    setError("");
  };

  /* ================= HYDRATE FROM STORAGE ================= */

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const data = JSON.parse(saved);
      if (Array.isArray(data.tickets)) {
        setTickets(data.tickets);
      }
      if (data.eventType === "free" || data.eventType === "ticketed") {
        setEventType(data.eventType);
      }
    } catch (e) {
      console.error("Failed to load tickets from localStorage", e);
    }
  }, []);

  /* ================= UI ================= */

  return (
    <div className="px-4 sm:px-6 md:px-8 pb-8">
      <div className="rounded-2xl p-4 sm:p-6 md:p-8 bg-white dark:bg-[#101010] dark:border max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold mb-2">
            Ticketing Details
          </h3>
          <p className="text-[13px] sm:text-[14px] md:text-[16px] font-medium text-[#666666] dark:text-gray-300">
            View and manage all information about your event tickets, including
            pricing, availability, and attendee info.
          </p>
        </div>

        {/* Event Type */}
        <div className="mb-10">
          <h4 className="text-[18px] sm:text-[20px] font-bold mb-6">
            What type of event are you running?
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Ticketed */}
            <button
              onClick={() => {
                setEventType("ticketed");
                saveTicketsToLocalStorage(tickets, "ticketed");
              }}
              className="rounded-xl border-2 p-6 sm:p-8 flex flex-col items-center bg-white dark:bg-[#101010] justify-center gap-3 sm:gap-4 transition-all"
              style={{
                borderColor: eventType === "ticketed" ? "#D19537" : "#E8E8E8",
                minHeight: 160,
              }}
            >
              <img
                src="/images/icons/ticketed-event-icon.png"
                alt="Ticketed Event"
                className="w-12 h-12 sm:w-16 sm:h-16"
              />
              <div className="text-center">
                <div
                  className="text-[16px] sm:text-[18px] font-bold mb-1"
                  style={{ color: "#D19537" }}
                >
                  Ticketed Event
                </div>
                <div
                  className="text-[13px] sm:text-[14px]"
                  style={{ color: "#D19537" }}
                >
                  My event requires tickets for entry
                </div>
              </div>
            </button>

            {/* Free */}
            <button
              onClick={() => {
                setEventType("free");
                saveTicketsToLocalStorage(tickets, "free");
              }}
              className="rounded-xl border-2 p-6 sm:p-8 flex flex-col items-center bg-white dark:bg-[#101010] justify-center gap-3 sm:gap-4 transition-all"
              style={{
                borderColor: eventType === "free" ? "#D19537" : "#E8E8E8",
                minHeight: 160,
              }}
            >
              <img
                src="/images/icons/free-event-icon.png"
                alt="Free Event"
                className="w-12 h-12 sm:w-16 sm:h-16"
              />
              <div className="text-center">
                <div
                  className="text-[16px] sm:text-[18px] font-bold mb-1"
                  style={{ color: "#666666" }}
                >
                  Free Event
                </div>
                <div
                  className="text-[13px] sm:text-[14px]"
                  style={{ color: "#666666" }}
                >
                  I'm running a free event
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Ticket Form */}
        {eventType === "ticketed" && (
          <div className="mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <input
                type="text"
                placeholder="Ticket Name"
                value={currentTicket.name}
                onChange={(e) =>
                  setCurrentTicket({ ...currentTicket, name: e.target.value })
                }
                className="h-12 px-4 rounded-lg border"
              />

              <input
                type="text"
                placeholder="$00.00"
                value={currentTicket.price ? `$${currentTicket.price}` : ""}
                onChange={(e) =>
                  setCurrentTicket({
                    ...currentTicket,
                    price: e.target.value.replace(/[^0-9.]/g, ""),
                  })
                }
                className="h-12 px-4 rounded-lg border"
              />
            </div>

            <select
              value={currentTicket.type}
              onChange={(e) =>
                setCurrentTicket({ ...currentTicket, type: e.target.value })
              }
              className="w-full h-12 px-4 rounded-lg border mb-6"
            >
              <option value="">Select Ticket Type</option>
              <option value="general">General</option>
              <option value="vip">VIP</option>
            </select>

            {/* TRANSFERABLE TOGGLE (FEATURE CONTROLLED) */}
            {allowTransfers && (
              <div className="mb-6 flex items-center justify-between border px-4 py-3 rounded-lg bg-[#FAFAFB] dark:bg-[#101010]">
                <span className="text-sm font-medium">Transferable Ticket</span>

                <button
                  onClick={() =>
                    setCurrentTicket({
                      ...currentTicket,
                      transferable: !currentTicket.transferable,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    currentTicket.transferable ? "bg-green-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-[22px] w-[22px] transform rounded-full bg-white ${
                      currentTicket.transferable
                        ? "translate-x-[20px]"
                        : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            )}

            {/* Add Ticket Button */}
            <div className="flex justify-end">
              <button
                onClick={handleAddTicket}
                className="h-10 sm:h-12 px-6 sm:px-8 rounded-xl text-[13px] sm:text-[14px] font-semibold flex items-center gap-2 bg-[#D19537] text-white"
              >
                Add
                <img
                  src="/images/icons/plus-icon.png"
                  alt="add"
                  className="w-4 h-4"
                />
              </button>
            </div>

            {/* Ticket List */}
            {tickets.length > 0 && (
              <div className="mt-6 space-y-3">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border bg-[#FAFAFB] dark:bg-[#101010] border-[#E8E8E8]"
                  >
                    {/* LEFT SIDE */}
                    <div className="space-y-1">
                      {/* Ticket Name & Type */}
                      <div className="flex items-center gap-2">
                        <span className="text-[14px] font-semibold">
                          {ticket.name}
                        </span>

                        <span className="px-2 py-1 text-[11px] font-semibold rounded-md bg-[#D19537]/15 text-[#D19537] uppercase">
                          {ticket.type}
                        </span>
                      </div>

                      {/* Price */}
                      <div className="text-[13px] text-[#666666]">
                        Price: {ticket.price}
                      </div>

                      {/* Transferable */}
                      <div className="text-[13px]">
                        Transferable:{" "}
                        {ticket.transferable ? (
                          <span className="text-green-600 font-semibold">
                            YES
                          </span>
                        ) : (
                          <span className="text-red-500 font-semibold">NO</span>
                        )}
                      </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <button
                      onClick={() => {
                        const updatedTickets = tickets.filter(
                          (t) => t.id !== ticket.id
                        );
                        setTickets(updatedTickets);
                        saveTicketsToLocalStorage(updatedTickets, eventType);
                      }}
                      className="text-[13px] sm:text-[14px] font-medium text-[#D6111A] sm:ml-4 mt-3 sm:mt-0"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {error && <div className="text-red-600 text-sm mt-4">{error}</div>}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-6">
        <button
          onClick={handleGoBack}
          className="h-11 px-6 rounded-xl bg-[#FFF5E6] text-[#D19537] font-semibold"
        >
          Go Back
        </button>
        <button
          onClick={handleSaveAndContinue}
          className="h-11 px-6 rounded-xl bg-[#D19537] text-white font-semibold"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from "react";

// interface Ticket {
//   id: string;
//   name: string;
//   price: string;
//   type: "general" | "vip"; // NEW
//   transferable: boolean; // NEW
// }

// type SetImagesPageProps = {
//   setActivePage: React.Dispatch<React.SetStateAction<string>>;
// };

// const STORAGE_KEY = "eventDraft";

// export default function TicketingDetailsPage({
//   setActivePage,
// }: SetImagesPageProps) {
//   const [eventType, setEventType] = useState<"ticketed" | "free">("ticketed");
//   const [tickets, setTickets] = useState<Ticket[]>([]);
//   const [currentTicket, setCurrentTicket] = useState({
//     name: "",
//     price: "",
//     type: "", // NEW
//     transferable: false, // NEW
//   });
//   const [error, setError] = useState("");
//   const handleGoBack = () => setActivePage("set-images");

//   const saveTicketsToLocalStorage = (
//     updatedTickets: Ticket[],
//     type?: string
//   ) => {
//     if (typeof window === "undefined") return;
//     try {
//       const existing = JSON.parse(
//         localStorage.getItem(STORAGE_KEY) || "{}"
//       ) as any;
//       const updated: any = {
//         ...existing,
//         tickets: updatedTickets,
//       };
//       if (type) {
//         updated.eventType = type;
//       }
//       localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
//     } catch (e) {
//       console.error("Failed to save tickets to localStorage", e);
//     }
//   };

//   const handleSaveAndContinue = () => {
//     if (eventType === "ticketed" && tickets.length === 0) {
//       setError("Please add at least one ticket before continuing.");
//       return;
//     }
//     setError("");

//     // ✅ Save tickets + eventType before going to preview
//     saveTicketsToLocalStorage(tickets, eventType);

//     setActivePage("preview-event");
//   };

//   const handleAddTicket = () => {
//     if (
//       !currentTicket.name.trim() ||
//       !currentTicket.price.trim() ||
//       !currentTicket.type
//     ) {
//       setError("Please fill in ticket name, price, and type.");
//       return;
//     }

//     const newTicket: Ticket = {
//       id: Date.now().toString(),
//       name: currentTicket.name,
//       price: currentTicket.price,
//       type: currentTicket.type as "general" | "vip",
//       transferable: currentTicket.transferable,
//     };

//     const updatedTickets = [...tickets, newTicket];

//     setTickets(updatedTickets);
//     saveTicketsToLocalStorage(updatedTickets, eventType);

//     setCurrentTicket({
//       name: "",
//       price: "",
//       type: "",
//       transferable: false,
//     });

//     setError("");
//   };

//   // ✅ Hydrate tickets + eventType from localStorage
//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     try {
//       const saved = localStorage.getItem(STORAGE_KEY);
//       if (!saved) return;

//       const data = JSON.parse(saved);
//       if (Array.isArray(data.tickets)) {
//         setTickets(data.tickets);
//       }
//       if (data.eventType === "free" || data.eventType === "ticketed") {
//         setEventType(data.eventType);
//       }
//     } catch (e) {
//       console.error("Failed to load tickets from localStorage", e);
//     }
//   }, []);

//   return (
//     <div className="px-4 sm:px-6 md:px-8 pb-8">
//       <div className="rounded-2xl p-4 sm:p-6 md:p-8 bg-white dark:bg-[#101010] dark:border max-w-[1200px] mx-auto">
//         {/* Header */}
// <div className="mb-6 sm:mb-8">
//   <h3 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold mb-2">
//     Ticketing Details
//   </h3>
//   <p className="text-[13px] sm:text-[14px] md:text-[16px] font-medium text-[#666666] dark:text-gray-300">
//     View and manage all information about your event tickets, including
//     pricing, availability, and attendee info.
//   </p>
// </div>

// {/* Event Type */}
// <div className="mb-10">
//   <h4 className="text-[18px] sm:text-[20px] font-bold mb-6">
//     What type of event are you running?
//   </h4>

//   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//     {/* Ticketed */}
//     <button
//       onClick={() => {
//         setEventType("ticketed");
//         saveTicketsToLocalStorage(tickets, "ticketed");
//       }}
//       className="rounded-xl border-2 p-6 sm:p-8 flex flex-col items-center bg-white dark:bg-[#101010] justify-center gap-3 sm:gap-4 transition-all"
//       style={{
//         borderColor: eventType === "ticketed" ? "#D19537" : "#E8E8E8",
//         minHeight: 160,
//       }}
//     >
//       <img
//         src="/images/icons/ticketed-event-icon.png"
//         alt="Ticketed Event"
//         className="w-12 h-12 sm:w-16 sm:h-16"
//       />
//       <div className="text-center">
//         <div
//           className="text-[16px] sm:text-[18px] font-bold mb-1"
//           style={{ color: "#D19537" }}
//         >
//           Ticketed Event
//         </div>
//         <div
//           className="text-[13px] sm:text-[14px]"
//           style={{ color: "#D19537" }}
//         >
//           My event requires tickets for entry
//         </div>
//       </div>
//     </button>

//     {/* Free */}
//     <button
//       onClick={() => {
//         setEventType("free");
//         saveTicketsToLocalStorage(tickets, "free");
//       }}
//       className="rounded-xl border-2 p-6 sm:p-8 flex flex-col items-center bg-white dark:bg-[#101010] justify-center gap-3 sm:gap-4 transition-all"
//       style={{
//         borderColor: eventType === "free" ? "#D19537" : "#E8E8E8",
//         minHeight: 160,
//       }}
//     >
//       <img
//         src="/images/icons/free-event-icon.png"
//         alt="Free Event"
//         className="w-12 h-12 sm:w-16 sm:h-16"
//       />
//       <div className="text-center">
//         <div
//           className="text-[16px] sm:text-[18px] font-bold mb-1"
//           style={{ color: "#666666" }}
//         >
//           Free Event
//         </div>
//         <div
//           className="text-[13px] sm:text-[14px]"
//           style={{ color: "#666666" }}
//         >
//           I'm running a free event
//         </div>
//       </div>
//     </button>
//   </div>
// </div>

//         {/* Ticket Form */}
//         {eventType === "ticketed" && (
//           <div className="mb-10">
//             <h4 className="text-[18px] sm:text-[20px] font-bold mb-6">
//               What tickets are you selling?
//             </h4>

//             {/* Ticket Name & Price */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
//               {/* Ticket Name */}
//               <div>
//                 <label className="block text-[14px] font-medium mb-2">
//                   Ticket Name <span className="text-[#D6111A]">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={currentTicket.name}
//                   onChange={(e) =>
//                     setCurrentTicket({ ...currentTicket, name: e.target.value })
//                   }
//                   placeholder="e.g. General Ticket"
//                   className="w-full h-11 sm:h-12 px-4 rounded-lg border"
//                 />
//               </div>

//               {/* Ticket Price */}
//               <div>
//                 <label className="block text-[14px] font-medium mb-2">
//                   Ticket Price <span className="text-[#D6111A]">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={currentTicket.price ? `$${currentTicket.price}` : ""}
//                   onChange={(e) => {
//                     let val = e.target.value.replace(/[^0-9.]/g, ""); // remove everything except digits & dot
//                     setCurrentTicket({
//                       ...currentTicket,
//                       price: val,
//                     });
//                   }}
//                   placeholder="$00.00"
//                   className="w-full h-11 sm:h-12 px-4 rounded-lg border"
//                 />
//               </div>
//             </div>

//             {/* Ticket Type Dropdown */}
//             <div className="mb-6">
//               <label className="block text-[14px] font-medium mb-2">
//                 Ticket Type <span className="text-[#D6111A]">*</span>
//               </label>

//               <select
//                 value={currentTicket.type}
//                 onChange={(e) =>
//                   setCurrentTicket({ ...currentTicket, type: e.target.value })
//                 }
//                 className="w-full h-11 sm:h-12 px-4 rounded-lg border bg-[#FAFAFB] dark:bg-[#101010]"
//               >
//                 <option value="">Select Type</option>
//                 <option value="general">General</option>
//                 <option value="vip">VIP</option>
//               </select>
//             </div>

//             {/* Transferable Toggle */}
//             <div className="mb-6 flex items-center justify-between border px-4 py-3 rounded-lg bg-[#FAFAFB] dark:bg-[#101010]">
//               <span className="text-[14px] font-medium">
//                 Transferable Ticket
//               </span>

//               <button
//                 onClick={() =>
//                   setCurrentTicket({
//                     ...currentTicket,
//                     transferable: !currentTicket.transferable,
//                   })
//                 }
//                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
//                   currentTicket.transferable ? "bg-green-600" : "bg-gray-300"
//                 }`}
//               >
//                 <span
//                   className={`inline-block h-[22px] w-[22px] transform rounded-full bg-white transition-transform ${
//                     currentTicket.transferable
//                       ? "translate-x-[20px]"
//                       : "translate-x-0"
//                   }`}
//                 />
//               </button>
//             </div>

// {/* Add Ticket Button */}
// <div className="flex justify-end">
//   <button
//     onClick={handleAddTicket}
//     className="h-10 sm:h-12 px-6 sm:px-8 rounded-xl text-[13px] sm:text-[14px] font-semibold flex items-center gap-2 bg-[#D19537] text-white"
//   >
//     Add
//     <img
//       src="/images/icons/plus-icon.png"
//       alt="add"
//       className="w-4 h-4"
//     />
//   </button>
// </div>

// {/* Ticket List */}
// {tickets.length > 0 && (
//   <div className="mt-6 space-y-3">
//     {tickets.map((ticket) => (
//       <div
//         key={ticket.id}
//         className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border bg-[#FAFAFB] dark:bg-[#101010] border-[#E8E8E8]"
//       >
//         {/* LEFT SIDE */}
//         <div className="space-y-1">
//           {/* Ticket Name & Type */}
//           <div className="flex items-center gap-2">
//             <span className="text-[14px] font-semibold">
//               {ticket.name}
//             </span>

//             <span className="px-2 py-1 text-[11px] font-semibold rounded-md bg-[#D19537]/15 text-[#D19537] uppercase">
//               {ticket.type}
//             </span>
//           </div>

//           {/* Price */}
//           <div className="text-[13px] text-[#666666]">
//             Price: {ticket.price}
//           </div>

//           {/* Transferable */}
//           <div className="text-[13px]">
//             Transferable:{" "}
//             {ticket.transferable ? (
//               <span className="text-green-600 font-semibold">
//                 YES
//               </span>
//             ) : (
//               <span className="text-red-500 font-semibold">NO</span>
//             )}
//           </div>
//         </div>

//         {/* RIGHT SIDE */}
//         <button
//           onClick={() => {
//             const updatedTickets = tickets.filter(
//               (t) => t.id !== ticket.id
//             );
//             setTickets(updatedTickets);
//             saveTicketsToLocalStorage(updatedTickets, eventType);
//           }}
//           className="text-[13px] sm:text-[14px] font-medium text-[#D6111A] sm:ml-4 mt-3 sm:mt-0"
//         >
//           Remove
//         </button>
//       </div>
//     ))}
//   </div>
// )}
//           </div>
//         )}

//         {error && (
//           <div className="text-[#D6111A] text-[13px] font-medium mt-2 mb-4">
//             {error}
//           </div>
//         )}
//       </div>

//       {/* Buttons */}
//       <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-6">
//         <button
//           onClick={handleGoBack}
//           className="h-11 sm:h-12 px-6 sm:px-8 rounded-xl text-[13px] sm:text-[14px] font-semibold bg-[#FFF5E6] text-[#D19537]"
//         >
//           Go Back
//         </button>
//         <button
//           onClick={handleSaveAndContinue}
//           className="h-11 sm:h-12 px-6 sm:px-8 rounded-xl text-[13px] sm:text-[14px] font-semibold bg-[#D19537] text-white"
//         >
//           Save & Continue
//         </button>
//       </div>
//     </div>
//   );
// }
