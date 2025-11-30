"use client";

import { useState } from "react";
import { ConfirmationModal } from "./confirmation-modal";

type Props = {
  id: string; // ⭐ ADDED
  imageSrc: string;
  price: string;
  isEditEvent: boolean;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
};

export function MyEventsCard({
  id, // ⭐ ACCEPTED
  imageSrc,
  price,
  isEditEvent,
  title,
  description,
  location,
  date,
  time,
}: Props) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleEdit = () => {
    if (!id) {
      console.error("❌ No event ID found");
      return;
    }

    isEditEvent
      ? (window.location.href = `/my-events/edit?id=${id}`) // ⭐ FIXED
      : (window.location.href = `/completed-events/edit?id=${id}`);
  };

  const handleDelete = () => {
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = () => {
    console.log("[v0] Event deleted");
    setShowDeleteConfirmation(false);
  };

  return (
    <>
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{ height: 248 }}
      >
        <img
          src={imageSrc || "/placeholder.svg"}
          alt="event cover"
          className="h-full w-full object-cover"
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.00) 20%, rgba(0,0,0,0.75) 100%)",
          }}
        />

        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={handleEdit}
            aria-label="Edit"
            className="h-7 w-7 rounded-full grid place-items-center bg-white shadow-md hover:cursor-pointer"
          >
            <img
              src="/images/icons/pencil-gold-2.png"
              alt=""
              className="h-3.5 w-3.5"
            />
          </button>

          <button
            onClick={handleDelete}
            aria-label="Delete"
            className="h-7 w-7 rounded-full grid place-items-center bg-white shadow-md hover:cursor-pointer"
          >
            <img
              src="/images/icons/delete-gold.png"
              alt=""
              className="h-3.5 w-3.5"
            />
          </button>

          <div
            className="h-7 px-3 rounded-full text-[12px] grid place-items-center font-semibold"
            style={{
              background: "var(--brand, #D19537)",
              color: "var(--brand-on, #FFFFFF)",
            }}
          >
            ${price}
          </div>
        </div>

        <div className="absolute left-4 right-4 bottom-4 text-white">
          <div className="flex justify-between">
            <div>
              <div className="mt-1 text-[18px] font-semibold">{title}</div>
            </div>
          </div>

          <div className="mt-1 text-[12px] opacity-90">{description}</div>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-[12px]">
            <span className="inline-flex items-center gap-1">
              <img
                src="/images/icons/location-icon-orange.png"
                className="h-3 w-3"
                alt=""
              />
              {location}
            </span>

            <span className="inline-flex items-center gap-1">
              <img
                src="/images/icons/calendar-icon-orange.png"
                className="h-3 w-3"
                alt=""
              />
              {date}
            </span>

            <span className="inline-flex items-center gap-1">
              <img
                src="/images/icons/time-icon-orange.png"
                className="h-3 w-3"
                alt=""
              />
              {time}
            </span>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

// "use client";

// import { useState } from "react";
// import { ConfirmationModal } from "./confirmation-modal";

// type Props = {
//   imageSrc: string;
//   price: string;
//   isEditEvent: boolean;
//   title: string;
//   description: string;
//   location: string;
//   date: string;
//   time: string;
// };

// export function MyEventsCard({
//   imageSrc,
//   price,
//   isEditEvent,
//   title,
//   description,
//   location,
//   date,
//   time,
// }: Props) {
//   const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

//   const handleEdit = () => {
//     isEditEvent
//       ? (window.location.href = "/my-events/edit")
//       : (window.location.href = "/completed-events/edit");
//   };

//   const handleDelete = () => {
//     setShowDeleteConfirmation(true);
//   };

//   const handleConfirmDelete = () => {
//     // TODO: Implement actual delete logic
//     console.log("[v0] Event deleted");
//     setShowDeleteConfirmation(false);
//   };

//   return (
//     <>
//       <div
//         className="relative rounded-2xl overflow-hidden"
//         style={{ height: 248 }}
//       >
//         <img
//           src={imageSrc || "/placeholder.svg"}
//           alt="event cover"
//           className="h-full w-full object-cover"
//         />
//         {/* gradient overlay for legibility */}
//         <div
//           className="absolute inset-0"
//           style={{
//             background:
//               "linear-gradient(180deg, rgba(0,0,0,0.00) 20%, rgba(0,0,0,0.75) 100%)",
//           }}
//         />
//         {/* top-right actions */}
//         <div className="absolute top-3 right-3 flex items-center gap-2">
//           <button
//             onClick={handleEdit}
//             aria-label="Edit"
//             className="h-7 w-7 rounded-full grid place-items-center bg-white shadow-md hover:cursor-pointer"
//           >
//             <img
//               src="/images/icons/pencil-gold-2.png"
//               alt=""
//               className="h-3.5 w-3.5"
//             />
//           </button>
//           <button
//             onClick={handleDelete}
//             aria-label="Delete"
//             className="h-7 w-7 rounded-full grid place-items-center bg-white shadow-md hover:cursor-pointer"
//           >
//             <img
//               src="/images/icons/delete-gold.png"
//               alt=""
//               className="h-3.5 w-3.5"
//             />
//           </button>
//           <div
//             className="h-7 px-3 rounded-full text-[12px] grid place-items-center font-semibold"
//             style={{
//               background: "var(--brand, #D19537)",
//               color: "var(--brand-on, #FFFFFF)",
//             }}
//           >
//             ${price}
//           </div>
//         </div>
//         {/* content bottom-left */}
//         <div className="absolute left-4 right-4 bottom-4 text-white">
//           <div className="flex justify-between">
//             <div>
//               <div className="mt-1 text-[18px] font-semibold">{title}</div>
//             </div>
//           </div>
//           <div className="mt-1 text-[12px] opacity-90">{description}</div>
//           <div className="mt-3 flex flex-wrap items-center gap-4 text-[12px]">
//             <span className="inline-flex items-center gap-1">
//               <img
//                 src="/images/icons/location-icon-orange.png"
//                 className="h-3 w-3"
//                 alt=""
//               />
//               {location}{" "}
//             </span>
//             <span className="inline-flex items-center gap-1">
//               <img
//                 src="/images/icons/calendar-icon-orange.png"
//                 className="h-3 w-3"
//                 alt=""
//               />
//               {date}
//             </span>
//             <span className="inline-flex items-center gap-1">
//               <img
//                 src="/images/icons/time-icon-orange.png"
//                 className="h-3 w-3"
//                 alt=""
//               />
//               {time}
//             </span>
//           </div>
//         </div>
//       </div>

//       <ConfirmationModal
//         isOpen={showDeleteConfirmation}
//         onClose={() => setShowDeleteConfirmation(false)}
//         onConfirm={handleConfirmDelete}
//       />
//     </>
//   );
// }
