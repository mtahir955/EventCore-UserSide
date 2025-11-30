"use client";

import type React from "react";
import { useState, useRef, type DragEvent, useEffect } from "react";

type SetImagesPageProps = {
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
};

const STORAGE_KEY = "eventDraft";

export default function SetImagesPage({ setActivePage }: SetImagesPageProps) {
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const saveBannerToLocalStorage = (imageData: string | null) => {
    if (typeof window === "undefined") return;
    try {
      const existing = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "{}"
      ) as any;
      const updated = {
        ...existing,
        bannerImage: imageData,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save banner image to localStorage", e);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setBannerImage(result);
        setError("");
        // ✅ Save immediately to localStorage
        saveBannerToLocalStorage(result);
      };
      reader.readAsDataURL(file);
    } else {
      setError("Please upload a valid image file.");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleGoBack = () => {
    setActivePage("create");
  };

  const handleSaveAndContinue = () => {
    if (!bannerImage) {
      setError("Please upload an image before continuing.");
      return;
    }
    setError("");

    // ✅ Ensure banner saved before moving
    if (bannerImage) {
      saveBannerToLocalStorage(bannerImage);
    }

    setActivePage("set-ticketingdetails");
  };

  // ✅ Hydrate banner image from localStorage if exists
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const data = JSON.parse(saved);
      if (data.bannerImage) {
        setBannerImage(data.bannerImage);
      }
    } catch (e) {
      console.error("Failed to load banner image from localStorage", e);
    }
  }, []);

  return (
    <div className="px-4 sm:px-6 md:px-8 pb-8">
      <div className="rounded-2xl p-4 sm:p-6 md:p-8 bg-white dark:bg-[#101010] dark:border max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold mb-2">
            Upload Banner
          </h3>
          <p className="text-[13px] sm:text-[15px] md:text-[16px] font-medium text-[#666666] dark:text-gray-300">
            Upload a banner to make your event stand out and grab attention
            instantly.
          </p>
        </div>

        {/* Upload Image Section */}
        <div className="mb-10">
          <h4 className="text-[18px] sm:text-[20px] font-bold mb-6">
            Upload Image "1329 * 400 px"
          </h4>

          {/* Upload Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-200 ${
              isDragging ? "bg-[#FFF5E6]" : "bg-[#F6F6F6]/30"
            }`}
            style={{
              borderColor: isDragging ? "#D19537" : "rgba(232, 232, 232, 1)",
              maxHeight: 350,
              padding: "40px 20px",
            }}
          >
            {bannerImage ? (
              <div className="relative w-full flex items-center justify-center">
                <img
                  src={bannerImage || "/placeholder.svg"}
                  alt="Banner preview"
                  className="max-w-full max-h-[300px] sm:max-h-[350px] object-contain rounded-lg"
                />
                <button
                  onClick={() => {
                    setBannerImage(null);
                    saveBannerToLocalStorage(null);
                  }}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ background: "#D6111A" }}
                >
                  ×
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={handleUploadClick}
                  className="h-10 sm:h-12 px-5 sm:px-6 rounded-lg text-[13px] sm:text-[14px] font-semibold flex items-center gap-2 mb-3 sm:mb-4"
                  style={{ background: "#D19537", color: "#FFFFFF" }}
                >
                  <span className="text-[18px] leading-none">+</span>
                  Upload Banner
                </button>
                <p className="text-[13px] sm:text-[14px] text-center text-[#666666] dark:text-gray-300">
                  Drag & drop your image or tap upload to choose a file.
                </p>
              </>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="mt-4 text-[#D6111A] text-[13px] font-medium text-center sm:text-left">
              {error}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-4">
          <button
            onClick={handleGoBack}
            className="h-11 sm:h-12 px-6 sm:px-8 rounded-lg text-[13px] sm:text-[14px] font-semibold bg-[#FFF5E6] text-[#D19537]"
          >
            Go Back
          </button>
          <button
            onClick={handleSaveAndContinue}
            className="h-11 sm:h-12 px-6 sm:px-8 rounded-lg text-[13px] sm:text-[14px] font-semibold bg-[#D19537] text-white"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import type React from "react";
// import { useState, useRef, type DragEvent } from "react";

// type SetImagesPageProps = {
//   setActivePage: React.Dispatch<React.SetStateAction<string>>;
// };

// export default function SetImagesPage({ setActivePage }: SetImagesPageProps) {
//   const [bannerImage, setBannerImage] = useState<string | null>(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [error, setError] = useState("");
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(true);
//   };

//   const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(false);
//   };

//   const handleDrop = (e: DragEvent<HTMLDivElement>) => {
//     e.preventDefault();
//     setIsDragging(false);

//     const files = e.dataTransfer.files;
//     if (files && files[0]) {
//       handleFile(files[0]);
//     }
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files && files[0]) {
//       handleFile(files[0]);
//     }
//   };

//   const handleFile = (file: File) => {
//     if (file.type.startsWith("image/")) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setBannerImage(e.target?.result as string);
//         setError("");
//       };
//       reader.readAsDataURL(file);
//     } else {
//       setError("Please upload a valid image file.");
//     }
//   };

//   const handleUploadClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleGoBack = () => {
//     setActivePage("create");
//   };

//   const handleSaveAndContinue = () => {
//     if (!bannerImage) {
//       setError("Please upload an image before continuing.");
//       return;
//     }
//     setError("");
//     setActivePage("set-ticketingdetails");
//   };

//   return (
//     <div className="px-4 sm:px-6 md:px-8 pb-8">
//       <div className="rounded-2xl p-4 sm:p-6 md:p-8 bg-white dark:bg-[#101010] dark:border max-w-[1200px] mx-auto">
//         {/* Header */}
//         <div className="mb-6 sm:mb-8">
//           <h3 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold mb-2">
//             Upload Banner
//           </h3>
//           <p className="text-[13px] sm:text-[15px] md:text-[16px] font-medium text-[#666666] dark:text-gray-300">
//             Upload a banner to make your event stand out and grab attention
//             instantly.
//           </p>
//         </div>

//         {/* Upload Image Section */}
//         <div className="mb-10">
//           <h4 className="text-[18px] sm:text-[20px] font-bold mb-6">
//             Upload Image "1329 * 400 px"
//           </h4>

//           {/* Upload Area */}
//           <div
//             onDragOver={handleDragOver}
//             onDragLeave={handleDragLeave}
//             onDrop={handleDrop}
//             className={`relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all duration-200 ${
//               isDragging ? "bg-[#FFF5E6]" : "bg-[#F6F6F6]/30"
//             }`}
//             style={{
//               borderColor: isDragging ? "#D19537" : "rgba(232, 232, 232, 1)",
//               maxHeight: 350,
//               padding: "40px 20px",
//             }}
//           >
//             {bannerImage ? (
//               <div className="relative w-full flex items-center justify-center">
//                 <img
//                   src={bannerImage || "/placeholder.svg"}
//                   alt="Banner preview"
//                   className="max-w-full max-h-[300px] sm:max-h-[350px] object-contain rounded-lg"
//                 />
//                 <button
//                   onClick={() => setBannerImage(null)}
//                   className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
//                   style={{ background: "#D6111A" }}
//                 >
//                   ×
//                 </button>
//               </div>
//             ) : (
//               <>
//                 <button
//                   onClick={handleUploadClick}
//                   className="h-10 sm:h-12 px-5 sm:px-6 rounded-lg text-[13px] sm:text-[14px] font-semibold flex items-center gap-2 mb-3 sm:mb-4"
//                   style={{ background: "#D19537", color: "#FFFFFF" }}
//                 >
//                   <span className="text-[18px] leading-none">+</span>
//                   Upload Banner
//                 </button>
//                 <p className="text-[13px] sm:text-[14px] text-center text-[#666666] dark:text-gray-300">
//                   Drag & drop your image or tap upload to choose a file.
//                 </p>
//               </>
//             )}

//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/*"
//               onChange={handleFileSelect}
//               className="hidden"
//             />
//           </div>

//           {/* Error Message */}
//           {error && (
//             <p className="mt-4 text-[#D6111A] text-[13px] font-medium text-center sm:text-left">
//               {error}
//             </p>
//           )}
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-4">
//           <button
//             onClick={handleGoBack}
//             className="h-11 sm:h-12 px-6 sm:px-8 rounded-lg text-[13px] sm:text-[14px] font-semibold bg-[#FFF5E6] text-[#D19537]"
//           >
//             Go Back
//           </button>
//           <button
//             onClick={handleSaveAndContinue}
//             className="h-11 sm:h-12 px-6 sm:px-8 rounded-lg text-[13px] sm:text-[14px] font-semibold bg-[#D19537] text-white"
//           >
//             Save & Continue
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
