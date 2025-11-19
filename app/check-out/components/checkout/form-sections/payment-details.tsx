"use client";

import { useState } from "react";
import SectionShell from "./section-shell";
import Image from "next/image";

export default function PaymentDetails() {
  // Stripe default
  const [paymentMethod, setPaymentMethod] = useState<string>("stripe");

  const [form, setForm] = useState({
    name: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const [isDefault, setIsDefault] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <SectionShell title="Payment Details">
      <div className="grid grid-cols-1 gap-6 text-gray-900 dark:text-gray-100">
        {/* ------------------------------------ */}
        {/* PAYMENT METHOD SELECTION (2 OPTIONS) */}
        {/* ------------------------------------ */}
        <div>
          <h3 className="mb-2 text-sm text-gray-700 dark:text-gray-200">
            Select Payment Method:
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {/* Mastercard */}
            <button
              onClick={() => setPaymentMethod("mastercard")}
              className={`flex flex-col items-center justify-center gap-2 border rounded-xl py-3 
              dark:bg-[#101010]
              ${
                paymentMethod === "mastercard"
                  ? "border-[#0077F7] ring-2 ring-[#0077F7]"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            >
              <Image
                src="/images/mastercard-icon.png"
                width={40}
                height={40}
                alt="Mastercard"
              />
              <span className="text-sm">Mastercard</span>
            </button>

            {/* Stripe (DEFAULT) */}
            <button
              onClick={() => setPaymentMethod("stripe")}
              className={`flex flex-col items-center justify-center gap-2 border rounded-xl py-3 
              dark:bg-[#101010]
              ${
                paymentMethod === "stripe"
                  ? "border-[#0077F7] ring-2 ring-[#0077F7]"
                  : "border-gray-300 dark:border-gray-700"
              }`}
            >
              <Image
                src="/images/stripe.png"
                width={40}
                height={40}
                alt="Stripe"
              />
              <span className="text-sm">Stripe</span>
            </button>
          </div>
        </div>

        {/* ------------------------------------ */}
        {/* CARD FIELDS (Only For Mastercard / Stripe) */}
        {/* ------------------------------------ */}
        {(paymentMethod === "mastercard" || paymentMethod === "stripe") && (
          <>
            {/* Name on Card */}
            <div className="space-y-2">
              <label className="text-sm text-gray-700 dark:text-gray-200">
                Name on Card:
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter Name"
                className="h-11 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] px-3 text-[15px] outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Card Number */}
            <div className="space-y-2">
              <label className="text-sm text-gray-700 dark:text-gray-200">
                Card Number:
              </label>
              <input
                name="cardNumber"
                value={form.cardNumber}
                onChange={handleChange}
                required
                placeholder="0000-0000-0000-0000"
                className="h-11 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] px-3 text-[15px] outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Expiry + CVC */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-700 dark:text-gray-200">
                  Expire Date:
                </label>
                <input
                  name="expiry"
                  value={form.expiry}
                  onChange={handleChange}
                  required
                  placeholder="MM/YY"
                  className="h-11 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] px-3 text-[15px] outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-700 dark:text-gray-200">
                  CVC:
                </label>
                <input
                  name="cvc"
                  value={form.cvc}
                  onChange={handleChange}
                  required
                  placeholder="123"
                  className="h-11 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] px-3 text-[15px] outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </>
        )}

        {/* ------------------------------------ */}
        {/* DEFAULT SWITCH */}
        {/* ------------------------------------ */}
        <label className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          {/* Toggle Switch */}
          <div
            onClick={() => setIsDefault(!isDefault)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 
      ${isDefault ? "bg-[#0077F7]" : "bg-gray-300 dark:bg-gray-700"}
    `}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-gray-200 shadow transition-transform duration-300
        ${isDefault ? "translate-x-5" : "translate-x-1"}
      `}
            />
          </div>

          {/* Responsive text */}
          <span className="text-[13px] sm:text-sm leading-snug max-w-[80%]">
            Set as default payment option for future purchases.
          </span>
        </label>
      </div>
    </SectionShell>
  );
}

// "use client";

// import { useState } from "react";
// import SectionShell from "./section-shell";

// export default function PaymentDetails() {
//   const [form, setForm] = useState({
//     name: "",
//     cardNumber: "",
//     expiry: "",
//     cvc: "",
//   });
//   const [isDefault, setIsDefault] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   return (
//     <SectionShell title="Payment Details">
//       <div className="grid grid-cols-1 gap-4 text-gray-900 dark:text-gray-100">
//         {/* Name on Card */}
//         <div className="space-y-2">
//           <label className="text-sm text-gray-700 dark:text-gray-200">
//             Name on Card:
//           </label>
//           <input
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             required
//             placeholder="Enter Name"
//             className={`h-11 w-full rounded-md border ${
//               !form.name
//                 ? "border-gray-300 dark:border-gray-700"
//                 : "border-gray-300 dark:border-gray-700"
//             } bg-white dark:bg-[#101010] px-3 text-[15px] outline-none focus:ring-2 focus:ring-primary transition-colors`}
//           />
//         </div>

//         {/* Card Number */}
//         <div className="space-y-2">
//           <label className="text-sm text-gray-700 dark:text-gray-200">
//             Card Number:
//           </label>
//           <input
//             name="cardNumber"
//             value={form.cardNumber}
//             onChange={handleChange}
//             required
//             placeholder="0000-0000-0000-0000"
//             className={`h-11 w-full rounded-md border ${
//               !form.cardNumber
//                 ? "border-gray-300 dark:border-gray-700"
//                 : "border-gray-300 dark:border-gray-700"
//             } bg-white dark:bg-[#101010] px-3 text-[15px] outline-none focus:ring-2 focus:ring-primary transition-colors`}
//           />
//         </div>

//         {/* Expiry Date & CVC */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <label className="text-sm text-gray-700 dark:text-gray-200">
//               Expire Date:
//             </label>
//             <input
//               name="expiry"
//               value={form.expiry}
//               onChange={handleChange}
//               required
//               placeholder="MM/YY"
//               className={`h-11 w-full rounded-md border ${
//                 !form.expiry
//                   ? "border-gray-300 dark:border-gray-700"
//                   : "border-gray-300 dark:border-gray-700"
//               } bg-white dark:bg-[#101010] px-3 text-[15px] outline-none focus:ring-2 focus:ring-primary transition-colors`}
//             />
//           </div>

//           <div className="space-y-2">
//             <label className="text-sm text-gray-700 dark:text-gray-200">
//               CVC:
//             </label>
//             <input
//               name="cvc"
//               value={form.cvc}
//               onChange={handleChange}
//               required
//               placeholder="123"
//               className={`h-11 w-full rounded-md border ${
//                 !form.cvc
//                   ? "border-gray-300 dark:border-gray-700"
//                   : "border-gray-300 dark:border-gray-700"
//               } bg-white dark:bg-[#101010] px-3 text-[15px] outline-none focus:ring-2 focus:ring-primary transition-colors`}
//             />
//           </div>
//         </div>

//         {/* Toggle Switch */}
//         <label className="mt-2 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
//           <div
//             onClick={() => setIsDefault(!isDefault)}
//             className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
//               isDefault ? "bg-[#0077F7]" : "bg-gray-300 dark:bg-gray-700"
//             }`}
//           >
//             <span
//               className={`inline-block h-5 w-5 transform rounded-full bg-white dark:bg-gray-200 shadow transition-transform duration-300 ${
//                 isDefault ? "translate-x-5" : "translate-x-1"
//               }`}
//             />
//           </div>
//           Set as default payment option to use in future.
//         </label>
//       </div>
//     </SectionShell>
//   );
// }
