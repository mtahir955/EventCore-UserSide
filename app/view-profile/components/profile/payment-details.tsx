export default function PaymentDetails({ data }: any) {
  if (!data) return null;

  return (
    <div className="space-y-6 text-gray-900 dark:text-gray-100">
      <div className="space-y-2">
        <label className="text-sm">Name On Card:</label>
        <div className="h-12 flex items-center rounded-lg border px-4 bg-gray-50 dark:bg-[#181818]">
          {data.nameOnCard}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm">Card Number:</label>
        <div className="h-12 flex items-center rounded-lg border px-4 bg-gray-50 dark:bg-[#181818]">
          {data.cardNumber}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <label className="text-sm">Expire Date:</label>
          <div className="h-12 flex items-center rounded-lg border px-4 bg-gray-50 dark:bg-[#181818]">
            {data.expireDate}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm">CVC:</label>
          <div className="h-12 flex items-center rounded-lg border px-4 bg-gray-50 dark:bg-[#181818]">
            {data.cvc}
          </div>
        </div>
      </div>

      {/* Default toggle display only */}
      <div className="flex items-center gap-3">
        <div
          className={`relative inline-flex h-6 w-10 items-center rounded-full ${
            data.isDefault ? "bg-[#F97316]" : "bg-gray-300 dark:bg-gray-700"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              data.isDefault ? "translate-x-5" : "translate-x-1"
            }`}
          />
        </div>

        <span className="text-sm">Set as default payment option.</span>
      </div>
    </div>
  );
}

// //code before integartion

// export default function PaymentDetails() {
//   const data = {
//     nameOnCard: "Jasmine Marina",
//     cardNumber: "1253-5594-8845-2777",
//     expireDate: "04/29",
//     cvc: "720",
//     isDefault: true,
//   };

//   return (
//     <div className="space-y-6 transition-colors duration-300 text-gray-900 dark:text-gray-100">
//       {/* Name on Card */}
//       <div className="space-y-2">
//         <label className="text-sm text-gray-700 dark:text-gray-200">
//           Name On Card:
//         </label>
//         <div className="h-12 flex items-center rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#181818] px-4 text-sm font-medium">
//           {data.nameOnCard}
//         </div>
//       </div>

//       {/* Card Number */}
//       <div className="space-y-2">
//         <label className="text-sm text-gray-700 dark:text-gray-200">
//           Card Number:
//         </label>
//         <div className="h-12 flex items-center rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#181818] px-4 text-sm font-medium tracking-wide">
//           {data.cardNumber}
//         </div>
//       </div>

//       {/* Expiry & CVC */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//         <div className="space-y-2">
//           <label className="text-sm text-gray-700 dark:text-gray-200">
//             Expire Date:
//           </label>
//           <div className="h-12 flex items-center rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#181818] px-4 text-sm font-medium">
//             {data.expireDate}
//           </div>
//         </div>

//         <div className="space-y-2">
//           <label className="text-sm text-gray-700 dark:text-gray-200">
//             CVC:
//           </label>
//           <div className="h-12 flex items-center rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#181818] px-4 text-sm font-medium">
//             {data.cvc}
//           </div>
//         </div>
//       </div>

//       {/* Default Payment Toggle (fixed display) */}
//       <div className="flex items-center gap-3">
//         <div
//           className={`relative inline-flex h-6 w-10 items-center rounded-full ${
//             data.isDefault ? "bg-[#F97316]" : "bg-gray-300 dark:bg-gray-700"
//           }`}
//         >
//           <span
//             className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-gray-200 shadow transition-transform ${
//               data.isDefault ? "translate-x-5" : "translate-x-1"
//             }`}
//           />
//         </div>

//         <span className="text-sm text-gray-700 dark:text-gray-300">
//           Set as default payment option to use in future.
//         </span>
//       </div>
//     </div>
//   );
// }
