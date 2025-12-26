"use client";

import { Header } from "../../components/header";
import { TicketCard } from "../tickets/components/ticket-card";
import { EventCard } from "../tickets/components/event-card";
import { Footer } from "../../components/footer";
import { useState, useEffect, useMemo } from "react";
import { useTicketsStore } from "@/store/ticketsStore";
import axios from "axios";
import { API_BASE_URL } from "@/config/apiConfig";
import { HOST_Tenant_ID } from "@/config/hostTenantId";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type TicketCardUI = {
  userTicketId: string;
  purchaseId: string;
  date: { day: string; month: string; weekday: string; time: string };
  title: string;
  location: string;
  type: string;
  quantity: number;
  originalQuantity: number;
  price: string;
  highlight: boolean;
  ended: boolean;
  // 🔥 NEW
  status: "ACTIVE" | "USED";
  verifiedAt?: string;
  isReceived: boolean;
  canTransfer: boolean;
  badge?: {
    variant: "IN" | "OUT";
    label: "Transferred From" | "Transferred To";
    fullName: string;
    email?: string;
  };
  transferredOut: boolean;
};

type RefundRequestListItem = {
  refundRequestId: string;
  eventName: string;
  ticketId: string;
  ticketType: string;
  refundQuantity: number;
  price: string;
  paymentMethod: string;
  refundMedium: string;
  status: string;
  requestedAt: string; // YYYY-MM-DD per README
};

export default function Page() {
  const { tickets, setTickets } = useTicketsStore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState("Active");
  const [currentPage, setCurrentPage] = useState(1);

  const [transferredCards, setTransferredCards] = useState<TicketCardUI[]>([]);
  const [exploreEvents, setExploreEvents] = useState<
    { image: string; title: string; subtitle: string; price: string }[]
  >([]);

  const [refundRequests, setRefundRequests] = useState<RefundRequestListItem[]>(
    []
  );

  const ticketsPerPage = 4;

  const DUMMY_TICKET: TicketCardUI = {
    userTicketId: "demo-userTicketId",
    purchaseId: "demo-purchaseId",
    date: {
      day: "12",
      month: "December",
      weekday: "FRI",
      time: "07:00 PM",
    },
    title: "Demo Event Ticket",
    location: "Lahore, Pakistan",
    type: "General",
    quantity: 1,
    originalQuantity: 1,
    price: "$49.99",
    highlight: true,
    ended: false,
    isReceived: false,
    canTransfer: true,
    transferredOut: false,
  };

  const DUMMY_REFUND_REQUESTS: RefundRequestListItem[] = [
    {
      refundRequestId: "RF-001",
      eventName: "Starry Nights Music Fest",
      ticketId: "TCK-482917",
      ticketType: "General",
      refundQuantity: 2,
      paymentMethod: "Full Payment",
      price: "$205.35",
      requestedAt: "2025-12-10",
      refundMedium: "PK92SCBL0000001234567890",
      status: "Pending",
    },
    {
      refundRequestId: "RF-002",
      eventName: "Summer Beats Festival",
      ticketId: "TCK-781245",
      ticketType: "VIP",
      refundQuantity: 1,
      paymentMethod: "Full Payment",
      price: "$99.99",
      requestedAt: "2025-12-08",
      refundMedium: "PK15HBL0000009876543210",
      status: "Successful",
    },
  ];

  const formatEventDate = (iso: string) => {
    const d = new Date(iso);
    const safe = isNaN(d.getTime()) ? new Date() : d;

    return {
      day: safe.getDate().toString(),
      month: safe.toLocaleString("en-US", { month: "long" }),
      weekday: safe.toLocaleString("en-US", { weekday: "short" }),
      time: safe.toLocaleString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const getToken = () =>
    localStorage.getItem("buyerToken") ||
    localStorage.getItem("staffToken") ||
    localStorage.getItem("hostToken") ||
    localStorage.getItem("token");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("buyerToken");

        if (!token) {
          toast({
            title: "Guest mode",
            description:
              "Showing demo tickets. Please log in to see your tickets.",
          });

          setTickets([DUMMY_TICKET] as any);
          setTransferredCards([]);
          setExploreEvents([]);
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/users/tickets/mine`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": HOST_Tenant_ID,
          },
        });

        const ownedTickets = res.data?.data?.ownedTickets || [];
        const transferredTickets = res.data?.data?.transferredTickets || [];
        const exploreMoreEvents = res.data?.data?.exploreMoreEvents || [];

        if (!ownedTickets.length && !transferredTickets.length) {
          setTickets([DUMMY_TICKET] as any);
          setTransferredCards([]);
          setExploreEvents([]);
          return;
        }

        const mappedOwned: TicketCardUI[] = ownedTickets.map((item: any) => {
          const purchaseId = String(item?.purchaseId || "");
          const userTicketId = String(
            item?.userTicketId || purchaseId || crypto.randomUUID()
          );

          const ev = item?.event || {};
          const tk = item?.ticket || {};

          const isReceived = !!tk.isReceived;
          const canTransfer = !!tk.canTransfer;

          const transferMeta = tk.transferMetadata || null;
          const from = transferMeta?.transferredFrom || null;

          const fullTickets = tk.fullTicketNumbers || [];

          const usedCount = fullTickets.filter(
            (t: any) => t.used === true
          ).length;

          const totalCount = fullTickets.length;

          // ✅ Decide ticket status
          let status: "ACTIVE" | "USED" = "ACTIVE";

          if (usedCount === totalCount && totalCount > 0) {
            status = "USED";
          }

          const verifiedAt =
            status === "USED" ? new Date().toISOString() : undefined;

          const badge =
            isReceived && from
              ? {
                  variant: "IN" as const,
                  label: "Transferred From" as const,
                  fullName: from.fullName,
                  email: from.email,
                }
              : undefined;

          return {
            userTicketId,
            purchaseId,
            date: formatEventDate(ev.startDateTime),
            title: ev.title,
            location: ev.location,
            type: tk.type,
            quantity: Number(tk.quantity || 0),
            originalQuantity: Number(tk.originalQuantity ?? tk.quantity ?? 0),
            price: tk.price,
            highlight: !ev.ended,
            ended: !!ev.ended,

            // 🔥 CORRECT STATUS
            status,
            verifiedAt,

            isReceived,
            canTransfer,
            badge,
            transferredOut: false,
          };
        });

        const mappedTransferred: TicketCardUI[] = transferredTickets.map(
          (tr: any) => {
            const ev = tr?.event || {};
            const tk = tr?.ticket || {};
            const to = tr?.transferredTo || {};

            const purchaseId = String(tr?.ticketId || "");
            const userTicketId = String(tr?.transferId || crypto.randomUUID());

            return {
              userTicketId,
              purchaseId,
              date: formatEventDate(ev.startDateTime),
              title: ev.title,
              location: ev.location,
              type: tk.type,
              quantity: Number(tk.quantity || 0),
              originalQuantity: Number(tk.quantity || 0),
              price: tk.price,
              highlight: !ev.ended,
              ended: !!ev.ended,
              isReceived: false,
              canTransfer: false,
              badge: {
                variant: "OUT",
                label: "Transferred To",
                fullName: to.fullName,
                email: to.email,
              },
              transferredOut: true,
            };
          }
        );

        setTickets(mappedOwned as any);
        setTransferredCards(mappedTransferred);
        setExploreEvents(exploreMoreEvents);
      } catch (error) {
        console.error("❌ Error fetching tickets:", error);

        toast({
          variant: "destructive",
          title: "Failed to load tickets",
          description:
            "We couldn't fetch your tickets right now. Showing demo data.",
        });

        setTickets([DUMMY_TICKET] as any);
        setTransferredCards([]);
        setExploreEvents([]);
      }
    };

    fetchTickets();
  }, [setTickets]);

  // ✅ Fetch refund requests (per README)
  useEffect(() => {
    const fetchRefundRequests = async () => {
      try {
        const token = getToken();
        if (!token) {
          toast({
            title: "Guest mode",
            description:
              "Login required to view refund requests. Showing demo data.",
          });
          setRefundRequests(DUMMY_REFUND_REQUESTS);
          return;
        }

        const res = await axios.get(`${API_BASE_URL}/tickets/refund-requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Tenant-ID": HOST_Tenant_ID,
          },
        });

        const list = res.data?.data;
        if (Array.isArray(list) && list.length) {
          setRefundRequests(list);
        } else {
          setRefundRequests([]);
        }
      } catch (error) {
        console.error("❌ Error fetching refund requests:", error);

        toast({
          variant: "destructive",
          title: "Failed to load refund requests",
          description:
            "We couldn't fetch refund requests. Showing previous data.",
        });
        setRefundRequests(DUMMY_REFUND_REQUESTS);
      }
    };

    fetchRefundRequests();
    // we fetch once on load (no UI change)
  }, []);

  const listForTab: TicketCardUI[] = useMemo(() => {
    if (activeTab === "Active")
      return (tickets as any[]).filter(
        (t) => t.status === "ACTIVE" && !t.ended
      );

    if (activeTab === "Used")
      return (tickets as any[]).filter((t) => t.status === "USED");

    if (activeTab === "Ended") return (tickets as any[]).filter((t) => t.ended);

    if (activeTab === "Transferred") return transferredCards;

    return [];
  }, [activeTab, tickets, transferredCards]);

  const totalPages = Math.ceil(listForTab.length / ticketsPerPage);

  const currentTickets = listForTab.slice(
    (currentPage - 1) * ticketsPerPage,
    currentPage * ticketsPerPage
  );

  return (
    <main className="bg-background text-foreground dark:bg-[#101010] transition-colors">
      <Header />

      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 min-h-screen">
        {/* Heading */}
        <section className="mt-6 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
            Tickets
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">
            View and manage all your event tickets in one place.
          </p>
        </section>

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-2">
          {["Active", "Used", "Ended", "Transferred", "Refunded Requests"].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition
                ${
                  activeTab === tab
                    ? "bg-[#0077F7] text-white"
                    : "bg-gray-100 dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Content */}
        <section className="mt-8">
          {activeTab === "Refunded Requests" ? (
            <div className="overflow-x-auto rounded-xl border dark:border-gray-700">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-100 dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="px-4 py-3">Event Name</th>
                    <th className="px-4 py-3">Ticket ID</th>
                    <th className="px-4 py-3">Ticket Type</th>
                    <th className="px-4 py-3">Qty</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Request Date</th>
                    <th className="px-4 py-3">Payment Method</th>
                    <th className="px-4 py-3">Medium for Refund</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y dark:divide-gray-700">
                  {(refundRequests?.length ? refundRequests : []).map((r) => (
                    <tr
                      key={r.refundRequestId}
                      className="bg-white dark:bg-[#181818]"
                    >
                      <td className="px-4 py-3 font-medium">{r.eventName}</td>
                      <td className="px-4 py-3">{r.ticketId}</td>

                      <td className="px-4 py-3">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {r.ticketType}
                        </span>
                      </td>

                      <td className="px-4 py-3 font-semibold text-center">
                        {r.refundQuantity}
                      </td>

                      <td className="px-4 py-3">{r.price}</td>
                      <td className="px-4 py-3">{r.requestedAt}</td>

                      <td className="px-4 py-3">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                          {r.paymentMethod}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-xs break-all">
                        {r.refundMedium}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            r.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                              : r.status === "Rejected"
                              ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                              : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {!refundRequests?.length && (
                    <tr className="bg-white dark:bg-[#181818]">
                      <td
                        className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
                        colSpan={9}
                      >
                        No refund requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {currentTickets.map((t) => (
                <TicketCard
                  key={t.userTicketId}
                  userTicketId={t.userTicketId}
                  purchaseId={t.purchaseId}
                  date={t.date}
                  title={t.title}
                  location={t.location}
                  type={t.type}
                  quantity={t.quantity}
                  originalQuantity={t.originalQuantity}
                  price={t.price}
                  highlight={t.highlight}
                  ended={t.ended}
                  isReceived={t.isReceived}
                  canTransfer={t.canTransfer}
                  badge={t.badge}
                  transferredOut={t.transferredOut}
                  /* 🔥 NEW */
                  status={t.status} // "ACTIVE" | "USED"
                  verifiedAt={t.verifiedAt} // optional ISO string
                />
              ))}
            </div>
          )}
        </section>

        {/* Pagination */}
        {activeTab !== "Refunded Requests" && totalPages > 1 && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : ""
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}

        {/* Explore */}
        <section className="mt-12 mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">
            Explore More Events
          </h2>

          {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {exploreEvents?.length ? (
              exploreEvents
                .slice(0, 2)
                .map((e, idx) => (
                  <EventCard
                    key={idx}
                    image={e.image}
                    title={e.title}
                    subtitle={e.subtitle}
                    price={e.price}
                  />
                ))
            ) : (
              <>
                <EventCard
                  image="/images/event-1.png"
                  title="Starry Nights Music Fest"
                  subtitle="A magical evening under the stars."
                  price="$99.99"
                />
                <EventCard
                  image="/images/event-2.png"
                  title="Summer Beats Festival"
                  subtitle="Feel the rhythm of summer."
                  price="$99.99"
                />
              </>
            )}
          </div> */}

          <Link href="/events">
            <Button
              className="
      rounded-full
      px-7 py-3
      text-sm font-semibold
      bg-[#0077F7]
      text-white
      hover:bg-[#0077F7]/90
      active:scale-95
      transition-all
      shadow-md
    "
            >
              Explore Events
            </Button>
          </Link>
        </section>
      </div>

      <Footer />
    </main>
  );
}

// "use client";

// import { Header } from "../../components/header";
// import { TicketCard } from "../tickets/components/ticket-card";
// import { EventCard } from "../tickets/components/event-card";
// import { Footer } from "../../components/footer";
// import { useState, useEffect, useMemo } from "react";
// import { useTicketsStore } from "@/store/ticketsStore";
// import axios from "axios";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";

// type TicketCardUI = {
//   // identity
//   userTicketId: string; // ownership identity (use as React key)
//   purchaseId: string; // IMPORTANT: used for transfer request (sent as "ticketId")
//   // UI basics
//   date: { day: string; month: string; weekday: string; time: string };
//   title: string;
//   location: string;
//   type: string;
//   quantity: number;
//   originalQuantity: number;
//   price: string;
//   highlight: boolean;
//   ended: boolean;

//   // transfer state
//   isReceived: boolean; // received via transfer
//   canTransfer: boolean;

//   // badges
//   badge?: {
//     variant: "IN" | "OUT";
//     label: "Transferred From" | "Transferred To";
//     fullName: string;
//     email?: string;
//   };

//   // for transferred tab
//   transferredOut: boolean;
// };

// export default function Page() {
//   // Keep existing store usage (no UI change), but now store only owned ticket cards
//   const { tickets, setTickets } = useTicketsStore();

//   const [activeTab, setActiveTab] = useState("Active");
//   const [currentPage, setCurrentPage] = useState(1);

//   const [transferredCards, setTransferredCards] = useState<TicketCardUI[]>([]);
//   const [exploreEvents, setExploreEvents] = useState<
//     { image: string; title: string; subtitle: string; price: string }[]
//   >([]);

//   const ticketsPerPage = 4;

//   const DUMMY_TICKET: TicketCardUI = {
//     userTicketId: "demo-userTicketId",
//     purchaseId: "demo-purchaseId",
//     date: {
//       day: "12",
//       month: "December",
//       weekday: "FRI",
//       time: "07:00 PM",
//     },
//     title: "Demo Event Ticket",
//     location: "Lahore, Pakistan",
//     type: "General",
//     quantity: 1,
//     originalQuantity: 1,
//     price: "$49.99",
//     highlight: true,
//     ended: false,
//     isReceived: false,
//     canTransfer: true,
//     transferredOut: false,
//   };

//   const DUMMY_REFUND_REQUESTS = [
//     {
//       id: "RF-001",
//       eventName: "Starry Nights Music Fest",
//       ticketId: "TCK-482917",
//       ticketType: "General",
//       refundQuantity: 2, // ✅ NEW
//       paymentMethod: "Full Payment",
//       price: "$205.35",
//       requestDate: "2025-12-10",
//       accountNumber: "PK92SCBL0000001234567890",
//       status: "Pending",
//     },
//     {
//       id: "RF-002",
//       eventName: "Summer Beats Festival",
//       ticketId: "TCK-781245",
//       ticketType: "VIP",
//       refundQuantity: 1, // ✅ NEW
//       paymentMethod: "Installments",
//       price: "$99.99",
//       requestDate: "2025-12-08",
//       accountNumber: "PK15HBL0000009876543210",
//       status: "Successful",
//     },
//   ];

//   const formatEventDate = (iso: string) => {
//     const d = new Date(iso);
//     const safe = isNaN(d.getTime()) ? new Date() : d;

//     return {
//       day: safe.getDate().toString(),
//       month: safe.toLocaleString("en-US", { month: "long" }),
//       weekday: safe.toLocaleString("en-US", { weekday: "short" }),
//       time: safe.toLocaleString("en-US", {
//         hour: "2-digit",
//         minute: "2-digit",
//       }),
//     };
//   };

//   useEffect(() => {
//     const fetchTickets = async () => {
//       try {
//         const token = localStorage.getItem("buyerToken");

//         if (!token) {
//           setTickets([DUMMY_TICKET] as any);
//           setTransferredCards([]);
//           setExploreEvents([]);
//           return;
//         }

//         const res = await axios.get(`${API_BASE_URL}/users/tickets/mine`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "X-Tenant-ID": HOST_Tenant_ID,
//           },
//         });

//         const ownedTickets = res.data?.data?.ownedTickets || [];
//         const transferredTickets = res.data?.data?.transferredTickets || [];
//         const exploreMoreEvents = res.data?.data?.exploreMoreEvents || [];

//         if (!ownedTickets.length && !transferredTickets.length) {
//           setTickets([DUMMY_TICKET] as any);
//           setTransferredCards([]);
//           setExploreEvents([]);
//           return;
//         }

//         // ✅ Map Owned Tickets to UI
//         const mappedOwned: TicketCardUI[] = ownedTickets.map((item: any) => {
//           const purchaseId = String(item?.purchaseId || "");
//           const userTicketId = String(
//             item?.userTicketId || purchaseId || crypto.randomUUID()
//           );

//           const ev = item?.event || {};
//           const tk = item?.ticket || {};

//           const isReceived = !!tk.isReceived;
//           const canTransfer = !!tk.canTransfer;

//           const transferMeta = tk.transferMetadata || null;
//           const from = transferMeta?.transferredFrom || null;

//           const badge =
//             isReceived && from
//               ? {
//                   variant: "IN" as const,
//                   label: "Transferred From" as const,
//                   fullName: from.fullName,
//                   email: from.email,
//                 }
//               : undefined;

//           return {
//             userTicketId,
//             purchaseId,
//             date: formatEventDate(ev.startDateTime),
//             title: ev.title,
//             location: ev.location,
//             type: tk.type,
//             quantity: Number(tk.quantity || 0),
//             originalQuantity: Number(tk.originalQuantity ?? tk.quantity ?? 0),
//             price: tk.price,
//             highlight: !ev.ended,
//             ended: !!ev.ended,
//             isReceived,
//             canTransfer,
//             badge,
//             transferredOut: false,
//           };
//         });

//         // ✅ Map Transferred Tickets (Sent) to UI
//         const mappedTransferred: TicketCardUI[] = transferredTickets.map(
//           (tr: any) => {
//             const ev = tr?.event || {};
//             const tk = tr?.ticket || {};
//             const to = tr?.transferredTo || {};

//             // backend doc: transferredTickets.ticketId = original purchaseId
//             const purchaseId = String(tr?.ticketId || "");
//             const userTicketId = String(tr?.transferId || crypto.randomUUID());

//             return {
//               userTicketId,
//               purchaseId,
//               date: formatEventDate(ev.startDateTime),
//               title: ev.title,
//               location: ev.location,
//               type: tk.type,
//               quantity: Number(tk.quantity || 0),
//               originalQuantity: Number(tk.quantity || 0),
//               price: tk.price,
//               highlight: !ev.ended,
//               ended: !!ev.ended,
//               isReceived: false,
//               canTransfer: false,
//               badge: {
//                 variant: "OUT",
//                 label: "Transferred To",
//                 fullName: to.fullName,
//                 email: to.email,
//               },
//               transferredOut: true,
//             };
//           }
//         );

//         setTickets(mappedOwned as any);
//         setTransferredCards(mappedTransferred);
//         setExploreEvents(exploreMoreEvents);
//       } catch (error) {
//         console.error("❌ Error fetching tickets:", error);
//         setTickets([DUMMY_TICKET] as any);
//         setTransferredCards([]);
//         setExploreEvents([]);
//       }
//     };

//     fetchTickets();
//   }, [setTickets]);

//   // ✅ Tab filtering aligned with backend contract
//   const listForTab: TicketCardUI[] = useMemo(() => {
//     if (activeTab === "Transferred") return transferredCards;
//     if (activeTab === "Ended") return (tickets as any[]).filter((t) => t.ended);
//     if (activeTab === "Active")
//       return (tickets as any[]).filter((t) => !t.ended);
//     return tickets as any[];
//   }, [activeTab, tickets, transferredCards]);

//   const totalPages = Math.ceil(listForTab.length / ticketsPerPage);

//   const currentTickets = listForTab.slice(
//     (currentPage - 1) * ticketsPerPage,
//     currentPage * ticketsPerPage
//   );

//   return (
//     <main className="bg-background text-foreground dark:bg-[#101010] transition-colors">
//       <Header />

//       <div className="mx-auto max-w-[1400px] px-4 sm:px-6 min-h-screen">
//         {/* Heading */}
//         <section className="mt-6 text-center">
//           <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
//             Tickets
//           </h1>
//           <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">
//             View and manage all your event tickets in one place.
//           </p>
//         </section>

//         {/* Tabs */}
//         <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-2">
//           {["Active", "Ended", "Transferred", "Refunded Requests"].map(
//             (tab) => (
//               <button
//                 key={tab}
//                 onClick={() => {
//                   setActiveTab(tab);
//                   setCurrentPage(1);
//                 }}
//                 className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition
//                 ${
//                   activeTab === tab
//                     ? "bg-[#0077F7] text-white"
//                     : "bg-gray-100 dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300"
//                 }`}
//               >
//                 {tab}
//               </button>
//             )
//           )}
//         </div>

//         {/* Content */}
//         <section className="mt-8">
//           {activeTab === "Refunded Requests" ? (
//             <div className="overflow-x-auto rounded-xl border dark:border-gray-700">
//               <table className="w-full text-sm text-left">
//                 <thead className="bg-gray-100 dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300">
//                   <tr>
//                     <th className="px-4 py-3">Event Name</th>
//                     <th className="px-4 py-3">Ticket ID</th>
//                     <th className="px-4 py-3">Ticket Type</th>
//                     <th className="px-4 py-3">Qty</th>
//                     <th className="px-4 py-3">Price</th>
//                     <th className="px-4 py-3">Request Date</th>
//                     <th className="px-4 py-3">Payment Method</th>
//                     <th className="px-4 py-3">Medium for Refund</th>
//                     <th className="px-4 py-3">Status</th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y dark:divide-gray-700">
//                   {DUMMY_REFUND_REQUESTS.map((r) => (
//                     <tr key={r.id} className="bg-white dark:bg-[#181818]">
//                       <td className="px-4 py-3 font-medium">{r.eventName}</td>
//                       <td className="px-4 py-3">{r.ticketId}</td>

//                       <td className="px-4 py-3">
//                         <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
//                           {r.ticketType}
//                         </span>
//                       </td>

//                       <td className="px-4 py-3 font-semibold text-center">
//                         {r.refundQuantity}
//                       </td>

//                       <td className="px-4 py-3">{r.price}</td>
//                       <td className="px-4 py-3">{r.requestDate}</td>

//                       <td className="px-4 py-3">
//                         <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
//                           {r.paymentMethod}
//                         </span>
//                       </td>

//                       <td className="px-4 py-3 text-xs break-all">
//                         {r.accountNumber}
//                       </td>

//                       <td className="px-4 py-3">
//                         <span
//                           className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                             r.status === "Pending"
//                               ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
//                               : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
//                           }`}
//                         >
//                           {r.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//               {currentTickets.map((t) => (
//                 <TicketCard
//                   key={t.userTicketId}
//                   userTicketId={t.userTicketId}
//                   purchaseId={t.purchaseId}
//                   date={t.date}
//                   title={t.title}
//                   location={t.location}
//                   type={t.type}
//                   quantity={t.quantity}
//                   originalQuantity={t.originalQuantity}
//                   price={t.price}
//                   highlight={t.highlight}
//                   ended={t.ended}
//                   isReceived={t.isReceived}
//                   canTransfer={t.canTransfer}
//                   badge={t.badge}
//                   transferredOut={t.transferredOut}
//                 />
//               ))}
//             </div>
//           )}
//         </section>

//         {/* Pagination */}
//         {activeTab !== "Refunded Requests" && totalPages > 1 && (
//           <div className="mt-8 flex flex-wrap justify-center gap-2">
//             <button
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((p) => p - 1)}
//               className="px-3 py-1 border rounded disabled:opacity-40"
//             >
//               Prev
//             </button>

//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setCurrentPage(i + 1)}
//                 className={`px-3 py-1 border rounded ${
//                   currentPage === i + 1
//                     ? "bg-black text-white dark:bg-white dark:text-black"
//                     : ""
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}

//             <button
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage((p) => p + 1)}
//               className="px-3 py-1 border rounded disabled:opacity-40"
//             >
//               Next
//             </button>
//           </div>
//         )}

//         {/* Explore */}
//         <section className="mt-12 mb-6">
//           <h2 className="text-xl sm:text-2xl font-semibold mb-4">
//             Explore More Events
//           </h2>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//             {exploreEvents?.length ? (
//               exploreEvents
//                 .slice(0, 2)
//                 .map((e, idx) => (
//                   <EventCard
//                     key={idx}
//                     image={e.image}
//                     title={e.title}
//                     subtitle={e.subtitle}
//                     price={e.price}
//                   />
//                 ))
//             ) : (
//               <>
//                 <EventCard
//                   image="/images/event-1.png"
//                   title="Starry Nights Music Fest"
//                   subtitle="A magical evening under the stars."
//                   price="$99.99"
//                 />
//                 <EventCard
//                   image="/images/event-2.png"
//                   title="Summer Beats Festival"
//                   subtitle="Feel the rhythm of summer."
//                   price="$99.99"
//                 />
//               </>
//             )}
//           </div>
//         </section>
//       </div>

//       <Footer />
//     </main>
//   );
// }

// "use client";

// import { Header } from "../../components/header";
// import { TicketCard } from "../tickets/components/ticket-card";
// import { EventCard } from "../tickets/components/event-card";
// import { Footer } from "../../components/footer";
// import { useState, useEffect } from "react";
// import { useTicketsStore } from "@/store/ticketsStore";
// import axios from "axios";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";

// export default function Page() {
//   const { tickets, setTickets } = useTicketsStore();
//   const [activeTab, setActiveTab] = useState("Active");
//   const [currentPage, setCurrentPage] = useState(1);

//   const ticketsPerPage = 4;

//   const DUMMY_TICKET = {
//     date: {
//       day: "12",
//       month: "December",
//       weekday: "FRI",
//       time: "07:00 PM",
//     },
//     title: "Demo Event Ticket",
//     location: "Lahore, Pakistan",
//     type: "General",
//     quantity: 1,
//     price: "$49.99",
//     highlight: true,
//     ended: false,
//     transferred: false,
//   };

//   const DUMMY_REFUND_REQUESTS = [
//     {
//       id: "RF-001",
//       eventName: "Starry Nights Music Fest",
//       ticketId: "TCK-482917",
//       ticketType: "General",
//       paymentMethod: "Full Payment",
//       price: "$205.35",
//       requestDate: "2025-12-10",
//       accountNumber: "PK92SCBL0000001234567890",
//       status: "Pending",
//     },
//     {
//       id: "RF-002",
//       eventName: "Summer Beats Festival",
//       ticketId: "TCK-781245",
//       ticketType: "VIP",
//       paymentMethod: "Installments",
//       price: "$99.99",
//       requestDate: "2025-12-08",
//       accountNumber: "PK15HBL0000009876543210",
//       status: "Successful",
//     },
//   ];

//   useEffect(() => {
//     const fetchTickets = async () => {
//       try {
//         const token = localStorage.getItem("buyerToken");

//         if (!token) {
//           setTickets([DUMMY_TICKET]);
//           return;
//         }

//         const res = await axios.get(`${API_BASE_URL}/users/tickets/mine`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "X-Tenant-ID": HOST_Tenant_ID,
//           },
//         });

//         const apiTickets = res.data?.data?.tickets || [];

//         if (!apiTickets.length) {
//           setTickets([DUMMY_TICKET]);
//           return;
//         }

//         // const mappedTickets = apiTickets.map((item: any) => {
//         //   const rawDate = item.event.startDateTime;

//         //   let dateObj: Date;

//         //   if (rawDate.includes("Z")) {
//         //     const isoPart = rawDate.substring(rawDate.indexOf("T") - 10);
//         //     dateObj = new Date(isoPart);
//         //   } else {
//         //     dateObj = new Date(rawDate);
//         //   }

//         //   if (isNaN(dateObj.getTime())) {
//         //     dateObj = new Date();
//         //   }

//         //   return {
//         //     date: {
//         //       day: dateObj.getDate().toString(),
//         //       month: dateObj.toLocaleString("en-US", { month: "long" }),
//         //       weekday: dateObj.toLocaleString("en-US", { weekday: "short" }),
//         //       time: dateObj.toLocaleString("en-US", {
//         //         hour: "2-digit",
//         //         minute: "2-digit",
//         //       }),
//         //     },
//         //     title: item.event.title,
//         //     location: item.event.location,
//         //     type: item.ticket.type,
//         //     quantity: item.ticket.quantity,
//         //     price: item.ticket.price,
//         //     ended: item.event.ended,
//         //     transferred: item.ticket.transferred,
//         //     highlight: !item.event.ended,
//         //   };
//         // });

//         const mappedTickets = apiTickets.map((item: any) => {
//           const raw = item.event.startDateTime;

//           const readablePart = raw.split("GMT")[0].trim();
//           const isoTimeMatch = raw.match(/T(\d{2}:\d{2}:\d{2})/);
//           const timePart = isoTimeMatch ? isoTimeMatch[1] : "00:00:00";

//           const combinedDateString = `${readablePart.split(" ")[0]} ${
//             readablePart.split(" ")[1]
//           } ${readablePart.split(" ")[2]} ${
//             readablePart.split(" ")[3]
//           } ${timePart}`;

//           const dateObj = new Date(combinedDateString);

//           return {
//             ticketId: item.ticketId, // ✅ THIS WAS MISSING

//             date: {
//               day: dateObj.getDate().toString(),
//               month: dateObj.toLocaleString("en-US", { month: "long" }),
//               weekday: dateObj.toLocaleString("en-US", { weekday: "short" }),
//               time: dateObj.toLocaleString("en-US", {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               }),
//             },

//             title: item.event.title,
//             location: item.event.location,
//             type: item.ticket.type,
//             quantity: item.ticket.quantity,
//             price: item.ticket.price,
//             ended: item.event.ended,
//             transferred: item.ticket.transferred,
//             highlight: !item.event.ended,
//           };
//         });

//         setTickets(mappedTickets);
//       } catch (error) {
//         console.error("❌ Error fetching tickets:", error);
//         setTickets([DUMMY_TICKET]);
//       }
//     };

//     fetchTickets();
//   }, []);

//   const filteredTickets = tickets.filter((ticket: any) => {
//     if (activeTab === "Active") return !ticket.ended && !ticket.transferred;
//     if (activeTab === "Ended") return ticket.ended;
//     if (activeTab === "Transferred") return ticket.transferred;
//     return true;
//   });

//   const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

//   const currentTickets = filteredTickets.slice(
//     (currentPage - 1) * ticketsPerPage,
//     currentPage * ticketsPerPage
//   );

//   return (
//     <main className="bg-background text-foreground dark:bg-[#101010] transition-colors">
//       <Header />

//       <div className="mx-auto max-w-[1400px] px-4 sm:px-6 min-h-screen">
//         {/* Heading */}
//         <section className="mt-6 text-center">
//           <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
//             Tickets
//           </h1>
//           <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">
//             View and manage all your event tickets in one place.
//           </p>
//         </section>

//         {/* Tabs */}
//         <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-2">
//           {["Active", "Ended", "Transferred", "Refunded Requests"].map(
//             (tab) => (
//               <button
//                 key={tab}
//                 onClick={() => {
//                   setActiveTab(tab);
//                   setCurrentPage(1);
//                 }}
//                 className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition
//                 ${
//                   activeTab === tab
//                     ? "bg-[#0077F7] text-white"
//                     : "bg-gray-100 dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300"
//                 }`}
//               >
//                 {tab}
//               </button>
//             )
//           )}
//         </div>

//         {/* Content */}
//         {/* Tickets / Refund Requests Section */}
//         <section className="mt-8">
//           {activeTab === "Refunded Requests" ? (
//             /* 🔁 Refunded Requests Table */
//             <div className="overflow-x-auto rounded-xl border dark:border-gray-700">
//               <table className="w-full text-sm text-left">
//                 <thead className="bg-gray-100 dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300">
//                   <tr>
//                     <th className="px-4 py-3">Event Name</th>
//                     <th className="px-4 py-3">Ticket ID</th>
//                     <th className="px-4 py-3">Ticket Type</th>

//                     <th className="px-4 py-3">Price</th>
//                     <th className="px-4 py-3">Request Date</th>
//                     <th className="px-4 py-3">Payment Method</th>
//                     <th className="px-4 py-3">Medium for Refund</th>
//                     <th className="px-4 py-3">Status</th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y dark:divide-gray-700">
//                   {DUMMY_REFUND_REQUESTS.map((r) => (
//                     <tr key={r.id} className="bg-white dark:bg-[#181818]">
//                       <td className="px-4 py-3 font-medium">{r.eventName}</td>
//                       <td className="px-4 py-3">{r.ticketId}</td>

//                       {/* Ticket Type */}
//                       <td className="px-4 py-3">
//                         <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
//                           {r.ticketType}
//                         </span>
//                       </td>

//                       <td className="px-4 py-3">{r.price}</td>
//                       <td className="px-4 py-3">{r.requestDate}</td>

//                       {/* Payment Method */}
//                       <td className="px-4 py-3">
//                         <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
//                           {r.paymentMethod}
//                         </span>
//                       </td>

//                       <td className="px-4 py-3 text-xs break-all">
//                         {r.accountNumber}
//                       </td>

//                       {/* Status */}
//                       <td className="px-4 py-3">
//                         <span
//                           className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                             r.status === "Pending"
//                               ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
//                               : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
//                           }`}
//                         >
//                           {r.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           ) : (
//             /* 🎟️ Normal Tickets Grid */
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//               {currentTickets.map((t, index) => (
//                 <TicketCard
//                   key={index}
//                   ticketId={t.ticketId} // ✅ THIS WAS MISSING
//                   date={t.date}
//                   title={t.title}
//                   location={t.location}
//                   type={t.type}
//                   quantity={t.quantity}
//                   price={t.price}
//                   highlight={t.highlight}
//                   ended={t.ended}
//                   transferred={t.transferred}
//                 />
//               ))}
//             </div>
//           )}
//         </section>

//         {/* Pagination */}
//         {activeTab !== "Refunded Requests" && totalPages > 1 && (
//           <div className="mt-8 flex flex-wrap justify-center gap-2">
//             <button
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((p) => p - 1)}
//               className="px-3 py-1 border rounded disabled:opacity-40"
//             >
//               Prev
//             </button>

//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setCurrentPage(i + 1)}
//                 className={`px-3 py-1 border rounded ${
//                   currentPage === i + 1
//                     ? "bg-black text-white dark:bg-white dark:text-black"
//                     : ""
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}

//             <button
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage((p) => p + 1)}
//               className="px-3 py-1 border rounded disabled:opacity-40"
//             >
//               Next
//             </button>
//           </div>
//         )}

//         {/* Explore */}
//         <section className="mt-12 mb-6">
//           <h2 className="text-xl sm:text-2xl font-semibold mb-4">
//             Explore More Events
//           </h2>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//             <EventCard
//               image="/images/event-1.png"
//               title="Starry Nights Music Fest"
//               subtitle="A magical evening under the stars."
//               price="$99.99"
//             />
//             <EventCard
//               image="/images/event-2.png"
//               title="Summer Beats Festival"
//               subtitle="Feel the rhythm of summer."
//               price="$99.99"
//             />
//           </div>
//         </section>
//       </div>

//       <Footer />
//     </main>
//   );
// }

// "use client";

// import { Header } from "../../components/header";
// import { TicketCard } from "../tickets/components/ticket-card";
// import { EventCard } from "../tickets/components/event-card";
// import { Footer } from "../../components/footer";
// import { useState, useEffect } from "react";
// import { useTicketsStore } from "@/store/ticketsStore";
// import axios from "axios";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";

// export default function Page() {
//   const { tickets, setTickets } = useTicketsStore();
//   const [activeTab, setActiveTab] = useState("Active");

//   const DUMMY_TICKET = {
//     date: {
//       day: "12",
//       month: "December",
//       weekday: "FRI",
//       time: "07:00 PM",
//     },
//     title: "Demo Event Ticket",
//     location: "Lahore, Pakistan",
//     type: "General",
//     quantity: 1,
//     price: "$49.99",
//     highlight: true,
//     ended: false,
//     transferred: false,
//   };

//   const DUMMY_REFUND_REQUESTS = [
//     {
//       id: "RF-001",
//       eventName: "Starry Nights Music Fest",
//       ticketId: "TCK-482917",
//       ticketType: "General",
//       paymentMethod: "Full Payment",
//       price: "$205.35",
//       requestDate: "2025-12-10",
//       accountNumber: "PK92SCBL0000001234567890",
//       status: "Pending",
//     },
//     {
//       id: "RF-002",
//       eventName: "Summer Beats Festival",
//       ticketId: "TCK-781245",
//       ticketType: "VIP",
//       paymentMethod: "Installments",
//       price: "$99.99",
//       requestDate: "2025-12-08",
//       accountNumber: "PK15HBL0000009876543210",
//       status: "Successful",
//     },
//   ];

//   useEffect(() => {
//     const fetchTickets = async () => {
//       try {
//         const token = localStorage.getItem("buyerToken");

//         if (!token) {
//           setTickets([DUMMY_TICKET]);
//           return;
//         }

//         const res = await axios.get(`${API_BASE_URL}/users/tickets/mine`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "X-Tenant-ID": HOST_Tenant_ID,
//           },
//         });

//         if (res.data?.tickets?.length) {
//           setTickets(res.data.tickets);
//         } else {
//           setTickets([DUMMY_TICKET]);
//         }
//       } catch (error) {
//         setTickets([DUMMY_TICKET]);
//       }
//     };

//     fetchTickets();
//   }, []);

//   const filteredTickets = tickets.filter((ticket) => {
//     if (activeTab === "Active") return !ticket.ended && !ticket.transferred;
//     if (activeTab === "Ended") return ticket.ended;
//     if (activeTab === "Transferred") return ticket.transferred;
//     return true;
//   });

//   const [currentPage, setCurrentPage] = useState(1);
//   const ticketsPerPage = 4;
//   const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

//   const currentTickets = filteredTickets.slice(
//     (currentPage - 1) * ticketsPerPage,
//     currentPage * ticketsPerPage
//   );

//   return (
//     <main className="bg-background text-foreground dark:bg-[#101010] transition-colors">
//       <Header />

//       <div className="mx-auto max-w-[1400px] px-4 sm:px-6 min-h-screen">
//         {/* Heading */}
//         <section className="mt-6 text-center">
//           <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
//             Tickets
//           </h1>
//           <p className="mt-2 text-sm sm:text-base text-gray-500 dark:text-gray-400">
//             View and manage all your event tickets in one place.
//           </p>
//         </section>

//         {/* Tabs */}
//         <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-2">
//           {["Active", "Ended", "Transferred", "Refunded Requests"].map(
//             (tab) => (
//               <button
//                 key={tab}
//                 onClick={() => {
//                   setActiveTab(tab);
//                   setCurrentPage(1);
//                 }}
//                 className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition
//                 ${
//                   activeTab === tab
//                     ? "bg-[#0077F7] text-white"
//                     : "bg-gray-100 dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300"
//                 }`}
//               >
//                 {tab}
//               </button>
//             )
//           )}
//         </div>

//         {/* Content */}
// {/* Tickets / Refund Requests Section */}
// <section className="mt-8">
//   {activeTab === "Refunded Requests" ? (
//     /* 🔁 Refunded Requests Table */
//     <div className="overflow-x-auto rounded-xl border dark:border-gray-700">
//       <table className="w-full text-sm text-left">
//         <thead className="bg-gray-100 dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300">
//           <tr>
//             <th className="px-4 py-3">Event Name</th>
//             <th className="px-4 py-3">Ticket ID</th>
//             <th className="px-4 py-3">Ticket Type</th>

//             <th className="px-4 py-3">Price</th>
//             <th className="px-4 py-3">Request Date</th>
//             <th className="px-4 py-3">Payment Method</th>
//             <th className="px-4 py-3">Medium for Refund</th>
//             <th className="px-4 py-3">Status</th>
//           </tr>
//         </thead>

//         <tbody className="divide-y dark:divide-gray-700">
//           {DUMMY_REFUND_REQUESTS.map((r) => (
//             <tr key={r.id} className="bg-white dark:bg-[#181818]">
//               <td className="px-4 py-3 font-medium">{r.eventName}</td>
//               <td className="px-4 py-3">{r.ticketId}</td>

//               {/* Ticket Type */}
//               <td className="px-4 py-3">
//                 <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
//                   {r.ticketType}
//                 </span>
//               </td>

//               <td className="px-4 py-3">{r.price}</td>
//               <td className="px-4 py-3">{r.requestDate}</td>

//               {/* Payment Method */}
//               <td className="px-4 py-3">
//                 <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
//                   {r.paymentMethod}
//                 </span>
//               </td>

//               <td className="px-4 py-3 text-xs break-all">
//                 {r.accountNumber}
//               </td>

//               {/* Status */}
//               <td className="px-4 py-3">
//                 <span
//                   className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                     r.status === "Pending"
//                       ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
//                       : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
//                   }`}
//                 >
//                   {r.status}
//                 </span>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   ) : (
//     /* 🎟️ Normal Tickets Grid */
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//       {currentTickets.map((t, index) => (
//         <TicketCard
//           key={index}
//           date={t.date}
//           title={t.title}
//           location={t.location}
//           type={t.type}
//           quantity={t.quantity} // ✅ REQUIRED
//           price={t.price}
//           highlight={t.highlight}
//           ended={t.ended}
//           transferred={t.transferred}
//         />
//       ))}
//     </div>
//   )}
// </section>

//         {/* Pagination */}
//         {activeTab !== "Refunded Requests" && totalPages > 1 && (
//           <div className="mt-8 flex flex-wrap justify-center gap-2">
//             <button
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((p) => p - 1)}
//               className="px-3 py-1 border rounded disabled:opacity-40"
//             >
//               Prev
//             </button>

//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setCurrentPage(i + 1)}
//                 className={`px-3 py-1 border rounded ${
//                   currentPage === i + 1
//                     ? "bg-black text-white dark:bg-white dark:text-black"
//                     : ""
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}

//             <button
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage((p) => p + 1)}
//               className="px-3 py-1 border rounded disabled:opacity-40"
//             >
//               Next
//             </button>
//           </div>
//         )}

//         {/* Explore */}
//         {/* Explore More Events Section */}
//         <section className="mt-12 mb-6 px-2 sm:px-4 md:px-6">
//           <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-semibold mb-6 text-center md:text-left text-gray-900 dark:text-white">
//             Explore More Events
//           </h2>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//             <EventCard
//               image="/images/event-1.png"
//               title="Starry Nights Music Fest"
//               subtitle="A magical evening under the stars with live bands, food stalls, and an electric crowd that will amaze."
//               price="$99.99"
//             />
//             <EventCard
//               image="/images/event-2.png"
//               title="Starry Nights Music Fest"
//               subtitle="A magical evening under the stars with live bands, food stalls, and an electric crowd that will amaze."
//               price="$99.99"
//             />
//           </div>
//         </section>
//       </div>

//       <Footer />
//     </main>
//   );
// }

// "use client";

// import { Header } from "../../components/header";
// import { TicketCard } from "../tickets/components/ticket-card";
// import { EventCard } from "../tickets/components/event-card";
// import { Footer } from "../../components/footer";
// import { useState, useEffect } from "react";
// import { useTicketsStore } from "@/store/ticketsStore";
// import axios from "axios";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";

// export default function Page() {
//   const { tickets, setTickets } = useTicketsStore();
//   const [activeTab, setActiveTab] = useState("Active");

//   const DUMMY_TICKET = {
//     date: {
//       day: "12",
//       month: "December",
//       weekday: "FRI",
//       time: "07:00 PM",
//     },
//     title: "Demo Event Ticket",
//     location: "Lahore, Pakistan",
//     type: "General", // 👈 ticket category ONLY
//     quantity: 1, // ✅ NEW
//     price: "$49.99",
//     highlight: true,
//     ended: false,
//     transferred: false,
//   };

//   const DUMMY_REFUND_REQUESTS = [
//     {
//       id: "RF-001",
//       eventName: "Starry Nights Music Fest",
//       ticketId: "TCK-482917",
//       ticketType: "General",
//       paymentMethod: "Full Payment",
//       price: "$205.35",
//       requestDate: "2025-12-10",
//       accountNumber: "PK92SCBL0000001234567890",
//       status: "Pending",
//     },
//     {
//       id: "RF-002",
//       eventName: "Summer Beats Festival",
//       ticketId: "TCK-781245",
//       ticketType: "VIP",
//       paymentMethod: "Installments",
//       price: "$99.99",
//       requestDate: "2025-12-08",
//       accountNumber: "PK15HBL0000009876543210",
//       status: "Successful",
//     },
//   ];

//   // ⭐ FETCH REAL TICKETS FROM BACKEND

//   useEffect(() => {
//     const fetchTickets = async () => {
//       try {
//         const token = localStorage.getItem("buyerToken");
//         if (!token) {
//           console.log("❌ No buyer token found");

//           // 👉 Show dummy ticket if not logged in
//           setTickets([DUMMY_TICKET]);
//           return;
//         }

//         const res = await axios.get(`${API_BASE_URL}/users/tickets/mine`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "X-Tenant-ID": HOST_Tenant_ID,
//           },
//         });

//         // ✅ If backend returns tickets
//         if (res.data?.tickets && res.data.tickets.length > 0) {
//           setTickets(res.data.tickets);
//         } else {
//           // ⚠️ No tickets from backend → show dummy
//           setTickets([DUMMY_TICKET]);
//         }
//       } catch (err) {
//         console.log("❌ Error fetching tickets:", err);

//         // ⚠️ API error → still show dummy ticket
//         setTickets([DUMMY_TICKET]);
//       }
//     };

//     fetchTickets();
//   }, []);

//   const filteredTickets = tickets.filter((ticket) => {
//     if (activeTab === "Active") return !ticket.ended && !ticket.transferred;
//     if (activeTab === "Ended") return ticket.ended;
//     if (activeTab === "Transferred") return ticket.transferred;
//     return true;
//   });

//   // 🔹 Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const ticketsPerPage = 4;

//   const indexOfLast = currentPage * ticketsPerPage;
//   const indexOfFirst = indexOfLast - ticketsPerPage;
//   const currentTickets = filteredTickets.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

//   return (
//     <main className="bg-background text-foreground dark:bg-[#101010] dark:text-gray-100 transition-colors duration-300">
//       <Header />

//       <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8 min-h-[1065px]">
//         {/* Page heading */}
//         <section className="px-4 sm:px-6 mt-6 text-center">
//           <h1 className="text-[28px] sm:text-[36px] md:text-[44px] font-semibold text-gray-900 dark:text-white">
//             Tickets
//           </h1>
//           <p className="mt-2 text-[14px] sm:text-[15px] md:text-[16px] text-muted-foreground dark:text-gray-400">
//             All your event memories start here — see your tickets, times, and
//             details at a glance.
//           </p>
//         </section>

//         {/* Ticket Categories */}
//         <div className="mt-6 flex justify-center sm:justify-start gap-3">
//           {["Active", "Ended", "Transferred", "Refunded Requests"].map(
//             (tab) => (
//               <button
//                 key={tab}
//                 onClick={() => {
//                   setActiveTab(tab);
//                   setCurrentPage(1); // Reset pagination
//                 }}
//                 className={`
//                 px-5 py-2 rounded-full text-sm font-medium transition-all
//                 ${
//                   activeTab === tab
//                     ? "bg-[#0077F7] text-white shadow-md"
//                     : "bg-gray-100 dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2a2a2a]"
//                 }
//               `}
//               >
//                 {tab}
//               </button>
//             )
//           )}
//         </div>

//         {/* Tickets Grid */}
//         {/* <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//           {currentTickets.map((t, index) => (
//             <TicketCard
//               key={index}
//               date={t.date}
//               title={t.title}
//               location={t.location}
//               type={t.type}
//               price={t.price}
//               highlight={t.highlight}
//               ended={t.ended}
//               transferred={t.transferred}
//             />
//           ))}
//         </section> */}

// {/* Tickets / Refund Requests Section */}
// <section className="mt-8">
//   {activeTab === "Refunded Requests" ? (
//     /* 🔁 Refunded Requests Table */
//     <div className="overflow-x-auto rounded-xl border dark:border-gray-700">
//       <table className="w-full text-sm text-left">
//         <thead className="bg-gray-100 dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300">
//           <tr>
//             <th className="px-4 py-3">Event Name</th>
//             <th className="px-4 py-3">Ticket ID</th>
//             <th className="px-4 py-3">Ticket Type</th>

//             <th className="px-4 py-3">Price</th>
//             <th className="px-4 py-3">Request Date</th>
//             <th className="px-4 py-3">Payment Method</th>
//             <th className="px-4 py-3">Medium for Refund</th>
//             <th className="px-4 py-3">Status</th>
//           </tr>
//         </thead>

//         <tbody className="divide-y dark:divide-gray-700">
//           {DUMMY_REFUND_REQUESTS.map((r) => (
//             <tr key={r.id} className="bg-white dark:bg-[#181818]">
//               <td className="px-4 py-3 font-medium">{r.eventName}</td>
//               <td className="px-4 py-3">{r.ticketId}</td>

//               {/* Ticket Type */}
//               <td className="px-4 py-3">
//                 <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
//                   {r.ticketType}
//                 </span>
//               </td>

//               <td className="px-4 py-3">{r.price}</td>
//               <td className="px-4 py-3">{r.requestDate}</td>

//               {/* Payment Method */}
//               <td className="px-4 py-3">
//                 <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
//                   {r.paymentMethod}
//                 </span>
//               </td>

//               <td className="px-4 py-3 text-xs break-all">
//                 {r.accountNumber}
//               </td>

//               {/* Status */}
//               <td className="px-4 py-3">
//                 <span
//                   className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                     r.status === "Pending"
//                       ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
//                       : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
//                   }`}
//                 >
//                   {r.status}
//                 </span>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   ) : (
//     /* 🎟️ Normal Tickets Grid */
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//       {currentTickets.map((t, index) => (
//         <TicketCard
//           key={index}
//           date={t.date}
//           title={t.title}
//           location={t.location}
//           type={t.type}
//           quantity={t.quantity} // ✅ REQUIRED
//           price={t.price}
//           highlight={t.highlight}
//           ended={t.ended}
//           transferred={t.transferred}
//         />
//       ))}
//     </div>
//   )}
// </section>

//         {/* ⭐ Pagination */}
//         {activeTab !== "Refunded Requests" && totalPages > 1 && (
//           <div className="flex justify-center mt-8 space-x-2">
//             <button
//               onClick={() => setCurrentPage((p) => p - 1)}
//               disabled={currentPage === 1}
//               className="px-4 py-2 border rounded-md disabled:opacity-40 dark:border-gray-600 dark:bg-[#181818]"
//             >
//               Prev
//             </button>

//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setCurrentPage(i + 1)}
//                 className={`px-4 py-2 border rounded-md ${
//                   currentPage === i + 1
//                     ? "bg-black dark:bg-white text-white dark:text-black"
//                     : "dark:border-gray-700 dark:bg-[#181818]"
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}

//             <button
//               onClick={() => setCurrentPage((p) => p + 1)}
//               disabled={currentPage === totalPages}
//               className="px-4 py-2 border rounded-md disabled:opacity-40 dark:border-gray-600 dark:bg-[#181818]"
//             >
//               Next
//             </button>
//           </div>
//         )}

// {/* Explore More Events Section */}
// <section className="mt-12 px-2 sm:px-4 md:px-6">
//   <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-semibold mb-6 text-center md:text-left text-gray-900 dark:text-white">
//     Explore More Events
//   </h2>

//   <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//     <EventCard
//       image="/images/event-1.png"
//       title="Starry Nights Music Fest"
//       subtitle="A magical evening under the stars with live bands, food stalls, and an electric crowd that will amaze."
//       price="$99.99"
//     />
//     <EventCard
//       image="/images/event-2.png"
//       title="Starry Nights Music Fest"
//       subtitle="A magical evening under the stars with live bands, food stalls, and an electric crowd that will amaze."
//       price="$99.99"
//     />
//   </div>

//   <div className="relative mt-6 flex items-center justify-center md:justify-between px-2">
//     <button
//       aria-label="Previous"
//       className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border dark:border-gray-700 bg-white dark:bg-[#181818] text-lg text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
//     >
//       ‹
//     </button>
//     <button
//       aria-label="Next"
//       className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border dark:border-gray-700 bg-white dark:bg-[#181818] text-lg text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
//     >
//       ›
//     </button>
//   </div>
// </section>
//       </div>

//       <Footer />
//     </main>
//   );
// }

// //code before integartion

// "use client";

// import { Header } from "../../components/header";
// import { TicketCard } from "../tickets/components/ticket-card";
// import { EventCard } from "../tickets/components/event-card";
// import { Footer } from "../../components/footer";
// import { useState, useEffect } from "react";
// import { useTicketsStore } from "@/store/ticketsStore";

// export default function Page() {
//   // 🔹 Ticket Data (same as you already have)
//   const { tickets, setTickets } = useTicketsStore();

//   useEffect(() => {
//     setTickets([
//       // ⭐ ACTIVE TICKETS
//       {
//         date: { day: "03", month: "June", weekday: "SUN", time: "08:00 PM" },
//         title: "Starry Nights Music Fest",
//         location: "California",
//         type: "1 General Ticket",
//         price: "$205.35",
//         highlight: true,
//       },
//       {
//         date: { day: "12", month: "July", weekday: "FRI", time: "09:30 PM" },
//         title: "Summer Beats Festival",
//         location: "Miami",
//         type: "2 VIP Tickets",
//         price: "$350.00",
//         highlight: true,
//       },
//       {
//         date: { day: "03", month: "June", weekday: "SUN", time: "08:00 PM" },
//         title: "Starry Nights Music Fest",
//         location: "California",
//         type: "1 General Ticket",
//         price: "$205.35",
//         highlight: true,
//       },
//       {
//         date: { day: "12", month: "July", weekday: "FRI", time: "09:30 PM" },
//         title: "Summer Beats Festival",
//         location: "Miami",
//         type: "2 VIP Tickets",
//         price: "$350.00",
//         highlight: true,
//       },
//       {
//         date: { day: "03", month: "June", weekday: "SUN", time: "08:00 PM" },
//         title: "Starry Nights Music Fest",
//         location: "California",
//         type: "1 General Ticket",
//         price: "$205.35",
//         highlight: true,
//       },
//       {
//         date: { day: "12", month: "July", weekday: "FRI", time: "09:30 PM" },
//         title: "Summer Beats Festival",
//         location: "Miami",
//         type: "2 VIP Tickets",
//         price: "$350.00",
//         highlight: true,
//       },

//       // ⭐ ACTIVE + TRANSFERRED
//       {
//         date: { day: "19", month: "August", weekday: "MON", time: "07:00 PM" },
//         title: "Beach Glow Party",
//         location: "Santa Monica",
//         type: "1 VIP Ticket",
//         price: "$150.00",
//         highlight: true,
//         transferred: true, // 🔥 added
//       },
//       {
//         date: { day: "27", month: "June", weekday: "THU", time: "06:00 PM" },
//         title: "Food Carnival Special",
//         location: "New York",
//         type: "1 General Ticket",
//         price: "$60.00",
//         highlight: true,
//         transferred: true, // 🔥 added
//       },
//       {
//         date: { day: "19", month: "August", weekday: "MON", time: "07:00 PM" },
//         title: "Beach Glow Party",
//         location: "Santa Monica",
//         type: "1 VIP Ticket",
//         price: "$150.00",
//         highlight: true,
//         transferred: true, // 🔥 added
//       },
//       {
//         date: { day: "27", month: "June", weekday: "THU", time: "06:00 PM" },
//         title: "Food Carnival Special",
//         location: "New York",
//         type: "1 General Ticket",
//         price: "$60.00",
//         highlight: true,
//         transferred: true, // 🔥 added
//       },

//       // ⭐ ENDED TICKETS
//       {
//         date: { day: "03", month: "June", weekday: "SUN", time: "08:00 PM" },
//         title: "Starry Nights Music Fest",
//         location: "California",
//         type: "1 General Ticket",
//         price: "$205.35",
//         ended: true,
//       },
//       {
//         date: { day: "11", month: "May", weekday: "SAT", time: "05:00 PM" },
//         title: "Old Memories Live Concert",
//         location: "Chicago",
//         type: "1 General Entry",
//         price: "$90.00",
//         ended: true,
//       },
//       {
//         date: { day: "03", month: "June", weekday: "SUN", time: "08:00 PM" },
//         title: "Starry Nights Music Fest",
//         location: "California",
//         type: "1 General Ticket",
//         price: "$205.35",
//         ended: true,
//       },
//       {
//         date: { day: "11", month: "May", weekday: "SAT", time: "05:00 PM" },
//         title: "Old Memories Live Concert",
//         location: "Chicago",
//         type: "1 General Entry",
//         price: "$90.00",
//         ended: true,
//       },
//       {
//         date: { day: "03", month: "June", weekday: "SUN", time: "08:00 PM" },
//         title: "Starry Nights Music Fest",
//         location: "California",
//         type: "1 General Ticket",
//         price: "$205.35",
//         ended: true,
//       },
//       {
//         date: { day: "11", month: "May", weekday: "SAT", time: "05:00 PM" },
//         title: "Old Memories Live Concert",
//         location: "Chicago",
//         type: "1 General Entry",
//         price: "$90.00",
//         ended: true,
//       },

//       // ⭐ ENDED + TRANSFERRED
//       {
//         date: { day: "22", month: "April", weekday: "MON", time: "07:45 PM" },
//         title: "Night Jazz Festival",
//         location: "Los Angeles",
//         type: "1 VIP Ticket",
//         price: "$180.00",
//         ended: true,
//         transferred: true, // 🔥 added
//       },
//       {
//         date: { day: "05", month: "March", weekday: "TUE", time: "09:15 PM" },
//         title: "Music Under The Stars",
//         location: "Houston",
//         type: "1 General Ticket",
//         price: "$89.00",
//         ended: true,
//         transferred: true, // 🔥 added
//       },
//       {
//         date: { day: "22", month: "April", weekday: "MON", time: "07:45 PM" },
//         title: "Night Jazz Festival",
//         location: "Los Angeles",
//         type: "1 VIP Ticket",
//         price: "$180.00",
//         ended: true,
//         transferred: true, // 🔥 added
//       },
//       {
//         date: { day: "05", month: "March", weekday: "TUE", time: "09:15 PM" },
//         title: "Music Under The Stars",
//         location: "Houston",
//         type: "1 General Ticket",
//         price: "$89.00",
//         ended: true,
//         transferred: true, // 🔥 added
//       },
//     ]);
//   }, []);

//   const [activeTab, setActiveTab] = useState("Active");

//   const filteredTickets = tickets.filter((ticket) => {
//     if (activeTab === "Active") return !ticket.ended && !ticket.transferred;
//     if (activeTab === "Ended") return ticket.ended;
//     if (activeTab === "Transferred") return ticket.transferred;
//     return true;
//   });

//   // 🔹 Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const ticketsPerPage = 4;

//   const indexOfLast = currentPage * ticketsPerPage;
//   const indexOfFirst = indexOfLast - ticketsPerPage;
//   const currentTickets = filteredTickets.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

//   return (
//     <main className="bg-background text-foreground dark:bg-[#101010] dark:text-gray-100 transition-colors duration-300">
//       <Header />

//       <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-8 min-h-[1065px]">
//         {/* Page heading */}
//         <section className="px-4 sm:px-6 mt-6 text-center">
//           <h1 className="text-[28px] sm:text-[36px] md:text-[44px] font-semibold text-gray-900 dark:text-white">
//             Tickets
//           </h1>
//           <p className="mt-2 text-[14px] sm:text-[15px] md:text-[16px] text-muted-foreground dark:text-gray-400">
//             All your event memories start here — see your tickets, times, and
//             details at a glance.
//           </p>
//         </section>

//         {/* Ticket Categories */}
//         <div className="mt-6 flex justify-center sm:justify-start gap-3">
//           {["Active", "Ended", "Transferred"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`
//         px-5 py-2 rounded-full text-sm font-medium transition-all
//         ${
//           activeTab === tab
//             ? "bg-[#0077F7] text-white shadow-md"
//             : "bg-gray-100 dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2a2a2a]"
//         }
//       `}
//             >
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* Tickets Grid (Paginated) */}
//         <section className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//           {currentTickets.map((t, index) => (
//             <TicketCard
//               key={index}
//               date={t.date}
//               title={t.title}
//               location={t.location}
//               type={t.type}
//               price={t.price}
//               highlight={t.highlight}
//               ended={t.ended}
//               transferred={t.transferred}
//             />
//           ))}
//         </section>

//         {/* ⭐ PAGINATION BEFORE EXPLORE MORE SECTION */}
//         {totalPages > 1 && (
//           <div className="flex justify-center mt-8 space-x-2">
//             {/* Prev */}
//             <button
//               onClick={() => setCurrentPage((p) => p - 1)}
//               disabled={currentPage === 1}
//               className="px-4 py-2 border rounded-md disabled:opacity-40 dark:border-gray-600 dark:bg-[#181818]"
//             >
//               Prev
//             </button>

//             {/* Page Numbers */}
//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => setCurrentPage(i + 1)}
//                 className={`px-4 py-2 border rounded-md ${
//                   currentPage === i + 1
//                     ? "bg-black dark:bg-white text-white dark:text-black"
//                     : "dark:border-gray-700 dark:bg-[#181818]"
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}

//             {/* Next */}
//             <button
//               onClick={() => setCurrentPage((p) => p + 1)}
//               disabled={currentPage === totalPages}
//               className="px-4 py-2 border rounded-md disabled:opacity-40 dark:border-gray-600 dark:bg-[#181818]"
//             >
//               Next
//             </button>
//           </div>
//         )}

//         {/* ------------------------------ */}
//         {/* ⭐ Explore More Events Section */}
//         {/* ------------------------------ */}

//         <section className="mt-12 px-2 sm:px-4 md:px-6">
//           <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-semibold mb-6 text-center md:text-left text-gray-900 dark:text-white">
//             Explore More Events
//           </h2>

//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
//             <EventCard
//               image="/images/event-1.png"
//               title="Starry Nights Music Fest"
//               subtitle="A magical evening under the stars with live bands, food stalls, and an electric crowd that will amaze."
//               price="$99.99"
//             />
//             <EventCard
//               image="/images/event-2.png"
//               title="Starry Nights Music Fest"
//               subtitle="A magical evening under the stars with live bands, food stalls, and an electric crowd that will amaze."
//               price="$99.99"
//             />
//           </div>

//           <div className="relative mt-6 flex items-center justify-center md:justify-between px-2">
//             <button
//               aria-label="Previous"
//               className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border dark:border-gray-700 bg-white dark:bg-[#181818] text-lg text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
//             >
//               ‹
//             </button>
//             <button
//               aria-label="Next"
//               className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border dark:border-gray-700 bg-white dark:bg-[#181818] text-lg text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
//             >
//               ›
//             </button>
//           </div>
//         </section>
//       </div>

//       <Footer />
//     </main>
//   );
// }
