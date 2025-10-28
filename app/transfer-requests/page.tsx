"use client";

import { Sidebar } from "../host-dashboard/components/sidebar";
import { UserInfoModal } from "../host-dashboard/components/user-info-modal";
import { useState } from "react";
import Image from "next/image";
import { Menu } from "lucide-react"; // for mobile hamburger

type TransferRequest = {
  id: string;
  name: string;
  avatar: string;
  email: string;
  event: string;
  ticketId: string;
  ticketTransfer: number;
  phone: string;
  gender: string;
  address: string;
};

const mockData: TransferRequest[] = [
  {
    id: "1",
    name: "Daniel Carter",
    avatar: "/images/avatars/daniel-carter-large.png",
    email: "info@gmail.com",
    event: "Starry Nights",
    ticketId: "TCK-992134",
    ticketTransfer: 2,
    phone: "+44 7412 558492",
    gender: "Male",
    address: "1234 Sunset Blvd, Los Angeles, CA 90026",
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    avatar: "/placeholder.svg?height=96&width=96",
    email: "info@gmail.com",
    event: "Starry Nights",
    ticketId: "TCK-992134",
    ticketTransfer: 4,
    phone: "+44 7412 558493",
    gender: "Female",
    address: "5678 Ocean Ave, Santa Monica, CA 90401",
  },
  {
    id: "3",
    name: "Emily Carter",
    avatar: "/placeholder.svg?height=96&width=96",
    email: "info@gmail.com",
    event: "Starry Nights",
    ticketId: "TCK-992134",
    ticketTransfer: 1,
    phone: "+44 7412 558494",
    gender: "Female",
    address: "9012 Hollywood Blvd, Hollywood, CA 90028",
  },
  {
    id: "4",
    name: "Nathan Blake",
    avatar: "/placeholder.svg?height=96&width=96",
    email: "info@gmail.com",
    event: "Starry Nights",
    ticketId: "TCK-992134",
    ticketTransfer: 2,
    phone: "+44 7412 558495",
    gender: "Male",
    address: "3456 Venice Blvd, Venice, CA 90291",
  },
  {
    id: "5",
    name: "Taylor Morgan",
    avatar: "/placeholder.svg?height=96&width=96",
    email: "info@gmail.com",
    event: "Starry Nights",
    ticketId: "TCK-992134",
    ticketTransfer: 1,
    phone: "+44 7412 558496",
    gender: "Non-binary",
    address: "7890 Beverly Hills, CA 90210",
  },
];

export default function TransferRequestsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TransferRequest | null>(
    null
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredData = searchQuery
    ? mockData.filter((request) => {
        const query = searchQuery.toLowerCase();
        return (
          request.name.toLowerCase().includes(query) ||
          request.ticketId.toLowerCase().includes(query)
        );
      })
    : mockData;

  const handleAccept = (id: string) => console.log("Accepted:", id);
  const handleReject = (id: string) => console.log("Rejected:", id);

  const handleRowClick = (request: TransferRequest) => {
    setSelectedUser(request);
    setIsModalOpen(true);
  };

  const handleSearch = () => setSearchQuery(searchInput);
  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  return (
    <div className="relative bg-[#FAFAFB] w-full min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar (desktop only) */}
      {/* Sidebar */}
      <Sidebar
        active="Transfer Requests"
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
      />

      {/* Sidebar drawer (mobile/tablet) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-[260px] h-full bg-white shadow-lg z-50">
            <Sidebar active="Transfer Requests" />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-[256px] mt-14 sm:mt-0 h-full">
        {/* Header */}
        <header className="hidden md:flex items-center justify-between px-4 sm:px-6 md:px-8 pt-6 md:pt-8 pb-4 md:pb-6 bg-[#FAFAFB]">
          <div className="flex items-center gap-3">
            {/* Hamburger for mobile */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6 text-gray-800" />
            </button>
            <h1 className="text-[22px] sm:text-[26px] md:text-[28px] font-semibold text-foreground">
              Transfer Requests
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
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
        </header>

        {/* Search Bar */}
        <div className="px-4 sm:px-6 md:px-8 py-4 md:py-6 bg-[#FAFAFB]">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search Name Or ID"
                value={searchInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearchInput(value);
                  if (value === "") setSearchQuery("");
                }}
                className="w-full h-12 pl-12 pr-10 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D19537] focus:border-transparent"
              />
              {searchInput && (
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                  onClick={handleClearSearch}
                >
                  ✕
                </button>
              )}
            </div>
            <button
              onClick={handleSearch}
              className="h-12 px-6 sm:px-8 rounded-xl text-white font-medium text-[14px] transition-colors hover:opacity-90"
              style={{ backgroundColor: "#D19537" }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="px-4 sm:px-6 md:px-8 pb-8">
          <div className="bg-white rounded-xl shadow-sm">
            {/* Scrollable table container */}
            <div className="overflow-x-auto">
              {/* Table Header */}
              <div
                className="min-w-[1050px] grid grid-cols-[160px_150px_150px_150px_150px_1fr] place-items-center gap-4 px-6 py-4 text-[14px] font-semibold text-foreground"
                style={{ backgroundColor: "#F5EDE5" }}
              >
                <div>Name</div>
                <div>Email</div>
                <div>Event</div>
                <div>Ticket ID</div>
                <div>Ticket Transfer</div>
                <div className="text-right">Action</div>
              </div>

              {/* Table Body */}
              <div className="min-w-[800px]">
                {filteredData.map((request) => (
                  <div
                    key={request.id}
                    className="grid grid-cols-[160px_150px_150px_150px_150px_1fr] place-items-center gap-4 px-6 py-4 text-[13px] sm:text-[14px] text-foreground border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => handleRowClick(request)}
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={request.avatar || "/placeholder.svg"}
                        alt={request.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <span className="font-medium whitespace-nowrap">
                        {request.name}
                      </span>
                    </div>
                    <div className="truncate">{request.email}</div>
                    <div className="truncate">{request.event}</div>
                    <div className="truncate">{request.ticketId}</div>
                    <div>{request.ticketTransfer}</div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAccept(request.id);
                        }}
                        className="px-5 sm:px-6 py-2 rounded-full text-white font-medium text-[12px] sm:text-[13px] transition-colors hover:opacity-90"
                        style={{ backgroundColor: "#D19537" }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(request.id);
                        }}
                        className="px-5 sm:px-6 py-2 rounded-full font-medium text-[12px] sm:text-[13px] transition-colors hover:opacity-90"
                        style={{ backgroundColor: "#F5EDE5", color: "#D19537" }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {selectedUser && (
        <UserInfoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          user={{
            name: selectedUser.name,
            email: selectedUser.email,
            phone: selectedUser.phone,
            gender: selectedUser.gender,
            address: selectedUser.address,
            avatar: selectedUser.avatar,
          }}
          onAccept={() => handleAccept(selectedUser.id)}
          onReject={() => handleReject(selectedUser.id)}
        />
      )}
    </div>
  );
}

// "use client";

// import { Sidebar } from "../host-dashboard/components/sidebar";
// import { UserInfoModal } from "../host-dashboard/components/user-info-modal";
// import { useState } from "react";
// import Image from "next/image";

// type TransferRequest = {
//   id: string;
//   name: string;
//   avatar: string;
//   email: string;
//   event: string;
//   ticketId: string;
//   ticketTransfer: number;
//   phone: string;
//   gender: string;
//   address: string;
// };

// const mockData: TransferRequest[] = [
//   {
//     id: "1",
//     name: "Daniel Carter",
//     avatar: "/images/avatars/daniel-carter-large.png",
//     email: "info@gmail.com",
//     event: "Starry Nights",
//     ticketId: "TCK-992134",
//     ticketTransfer: 2,
//     phone: "+44 7412 558492",
//     gender: "Male",
//     address: "1234 Sunset Blvd, Los Angeles, CA 90026",
//   },
//   {
//     id: "2",
//     name: "Sarah Mitchell",
//     avatar: "/placeholder.svg?height=96&width=96",
//     email: "Info@gmail.com",
//     event: "Starry Nights",
//     ticketId: "TCK-992134",
//     ticketTransfer: 4,
//     phone: "+44 7412 558493",
//     gender: "Female",
//     address: "5678 Ocean Ave, Santa Monica, CA 90401",
//   },
//   {
//     id: "3",
//     name: "Emily Carter",
//     avatar: "/placeholder.svg?height=96&width=96",
//     email: "Info@gmail.com",
//     event: "Starry Nights",
//     ticketId: "TCK-992134",
//     ticketTransfer: 1,
//     phone: "+44 7412 558494",
//     gender: "Female",
//     address: "9012 Hollywood Blvd, Hollywood, CA 90028",
//   },
//   {
//     id: "4",
//     name: "Nathan Blake",
//     avatar: "/placeholder.svg?height=96&width=96",
//     email: "Info@gmail.com",
//     event: "Starry Nights",
//     ticketId: "TCK-992134",
//     ticketTransfer: 2,
//     phone: "+44 7412 558495",
//     gender: "Male",
//     address: "3456 Venice Blvd, Venice, CA 90291",
//   },
//   {
//     id: "5",
//     name: "Taylor Morgan",
//     avatar: "/placeholder.svg?height=96&width=96",
//     email: "Info@gmail.com",
//     event: "Starry Nights",
//     ticketId: "TCK-992134",
//     ticketTransfer: 1,
//     phone: "+44 7412 558496",
//     gender: "Non-binary",
//     address: "7890 Beverly Hills, CA 90210",
//   },
//   {
//     id: "6",
//     name: "Daniel Carter",
//     avatar: "/images/avatars/daniel-carter-large.png",
//     email: "Info@gmail.com",
//     event: "Starry Nights",
//     ticketId: "TCK-992134",
//     ticketTransfer: 2,
//     phone: "+44 7412 558492",
//     gender: "Male",
//     address: "1234 Sunset Blvd, Los Angeles, CA 90026",
//   },
//   {
//     id: "7",
//     name: "Sarah Mitchell",
//     avatar: "/placeholder.svg?height=96&width=96",
//     email: "Info@gmail.com",
//     event: "Starry Nights",
//     ticketId: "TCK-992134",
//     ticketTransfer: 4,
//     phone: "+44 7412 558493",
//     gender: "Female",
//     address: "5678 Ocean Ave, Santa Monica, CA 90401",
//   },
//   {
//     id: "8",
//     name: "Emily Carter",
//     avatar: "/placeholder.svg?height=96&width=96",
//     email: "Info@gmail.com",
//     event: "Starry Nights",
//     ticketId: "TCK-992134",
//     ticketTransfer: 1,
//     phone: "+44 7412 558494",
//     gender: "Female",
//     address: "9012 Hollywood Blvd, Hollywood, CA 90028",
//   },
//   {
//     id: "9",
//     name: "Nathan Blake",
//     avatar: "/placeholder.svg?height=96&width=96",
//     email: "Info@gmail.com",
//     event: "Starry Nights",
//     ticketId: "TCK-992134",
//     ticketTransfer: 2,
//     phone: "+44 7412 558495",
//     gender: "Male",
//     address: "3456 Venice Blvd, Venice, CA 90291",
//   },
//   {
//     id: "10",
//     name: "Taylor Morgan",
//     avatar: "/placeholder.svg?height=96&width=96",
//     email: "Info@gmail.com",
//     event: "Starry Nights",
//     ticketId: "TCK-992134",
//     ticketTransfer: 1,
//     phone: "+44 7412 558496",
//     gender: "Non-binary",
//     address: "7890 Beverly Hills, CA 90210",
//   },
// ];

// export default function TransferRequestsPage() {
//   const [searchInput, setSearchInput] = useState(""); // Input value
//   const [searchQuery, setSearchQuery] = useState(""); // Applied search
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<TransferRequest | null>(
//     null
//   );

//   // Filter data only when searchQuery is set
//   const filteredData = searchQuery
//     ? mockData.filter((request) => {
//         const query = searchQuery.toLowerCase();
//         return (
//           request.name.toLowerCase().includes(query) ||
//           request.ticketId.toLowerCase().includes(query)
//         );
//       })
//     : mockData; // show all if no query

//   const handleAccept = (id: string) => {
//     console.log("[v0] Accept transfer request:", id);
//   };

//   const handleReject = (id: string) => {
//     console.log("[v0] Reject transfer request:", id);
//   };

//   const handleRowClick = (request: TransferRequest) => {
//     setSelectedUser(request);
//     setIsModalOpen(true);
//   };

//   const handleSearch = () => {
//     setSearchQuery(searchInput); // Apply the search
//   };

//   const handleClearSearch = () => {
//     setSearchInput("");
//     setSearchQuery(""); // Reset to show all
//   };

//   return (
//     <div className="relative bg-[#FAFAFB] w-full" style={{ height: 960 }}>
//       <Sidebar active="Transfer Requests" />

//       <main className="ml-[256px] h-full">
//         {/* Header */}
//         <header className="flex items-center justify-between px-8 py-6 bg-white border-b">
//           <h1 className="text-[28px] font-semibold text-foreground">
//             Transfer Requests
//           </h1>
//           <div className="flex items-center gap-4">
//             <div className="bg-white border h-10 w-10 flex justify-center items-center rounded-full p-1">
//               <img
//                 src="/images/icons/notification-new.png"
//                 alt="profile"
//                 className="rounded-full"
//               />
//             </div>
//             <div className="bg-black border h-10 w-10 flex justify-center items-center rounded-full p-1">
//               <img
//                 src="/images/icons/profile-user.png"
//                 alt="profile"
//                 className="rounded-full"
//               />
//             </div>
//           </div>
//         </header>

//         {/* Search Bar */}
//         <div className="px-8 py-6 bg-white">
//           <div className="flex items-center gap-4">
//             <div className="flex-1 relative">
//               <div className="absolute left-4 top-1/2 -translate-y-1/2">
//                 <svg
//                   width="20"
//                   height="20"
//                   viewBox="0 0 20 20"
//                   fill="none"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                   />
//                 </svg>
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search Name Or ID"
//                 value={searchInput}
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   setSearchInput(value);
//                   if (value === "") {
//                     setSearchQuery(""); // Clear applied search when input is empty
//                   }
//                 }}
//                 className="w-full h-12 pl-12 pr-10 rounded-xl border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#D19537] focus:border-transparent"
//               />
//               {searchInput && (
//                 <button
//                   className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
//                   onClick={handleClearSearch}
//                 >
//                   ✕
//                 </button>
//               )}
//             </div>
//             <button
//               onClick={handleSearch} // Apply search only on button click
//               className="h-12 px-8 rounded-xl text-white font-medium text-[14px] transition-colors hover:opacity-90"
//               style={{ backgroundColor: "#D19537" }}
//             >
//               Search
//             </button>
//           </div>
//         </div>

//         {/* Table */}
//         <div className="px-8 pb-8">
//           <div className="bg-white rounded-xl overflow-hidden shadow-sm">
//             {/* Table Header */}
//             <div
//               className="grid grid-cols-[160px_150px_150px_150px_150px_1fr] place-items-center gap-4 px-6 py-4 text-[14px] font-semibold text-foreground"
//               style={{ backgroundColor: "#F5EDE5" }}
//             >
//               <div>Name</div>
//               <div>Email</div>
//               <div>Event</div>
//               <div>Ticket ID</div>
//               <div>Ticket Transfer</div>
//               <div className="text-right">Action</div>
//             </div>

//             {/* Table Body */}
//             <div>
//               {filteredData.map((request) => (
//                 <div
//                   key={request.id}
//                   className="grid grid-cols-[160px_150px_150px_150px_150px_1fr] place-items-center gap-4 px-6 py-4 text-[14px] text-foreground border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors cursor-pointer"
//                   onClick={() => handleRowClick(request)}
//                 >
//                   <div className="flex items-center gap-3">
//                     <Image
//                       src={request.avatar || "/placeholder.svg"}
//                       alt={request.name}
//                       width={40}
//                       height={40}
//                       className="rounded-full"
//                     />
//                     <span className="font-medium">{request.name}</span>
//                   </div>
//                   <div className="flex items-center">{request.email}</div>
//                   <div className="flex items-center">{request.event}</div>
//                   <div className="flex items-center">{request.ticketId}</div>
//                   <div className="flex items-center">
//                     {request.ticketTransfer}
//                   </div>
//                   <div className="flex items-center justify-end gap-2">
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleAccept(request.id);
//                       }}
//                       className="px-6 py-2 rounded-full text-white font-medium text-[13px] transition-colors hover:opacity-90"
//                       style={{ backgroundColor: "#D19537" }}
//                     >
//                       Accept
//                     </button>
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleReject(request.id);
//                       }}
//                       className="px-6 py-2 rounded-full font-medium text-[13px] transition-colors hover:opacity-90"
//                       style={{ backgroundColor: "#F5EDE5", color: "#D19537" }}
//                     >
//                       Reject
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </main>

//       {selectedUser && (
//         <UserInfoModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           user={{
//             name: selectedUser.name,
//             email: selectedUser.email,
//             phone: selectedUser.phone,
//             gender: selectedUser.gender,
//             address: selectedUser.address,
//             avatar: selectedUser.avatar,
//           }}
//           onAccept={() => handleAccept(selectedUser.id)}
//           onReject={() => handleReject(selectedUser.id)}
//         />
//       )}
//     </div>
//   );
// }
