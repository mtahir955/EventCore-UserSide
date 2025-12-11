"use client";

import { useState, useEffect } from "react";
import { X, FileUp } from "lucide-react";

interface Trainer {
  id: string;
  name: string;
  designation: string;
  description: string;
  image: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
}

interface Ticket {
  id: string;
  name: string;
  price: string;
}

type SetImagesPageProps = {
  setActivePage: React.Dispatch<React.SetStateAction<string>>;
};

const STORAGE_KEY = "eventDraft";

export default function AddTrainersSection({
  setActivePage,
}: SetImagesPageProps) {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [currentTrainer, setCurrentTrainer] = useState<Trainer>({
    id: "",
    name: "",
    designation: "",
    description: "",
    image: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
  });
  const [error, setError] = useState("");

  const [eventType, setEventType] = useState<"ticketed" | "free">("ticketed");
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const handleGoBack = () => setActivePage("create");

  const saveTrainersToLocalStorage = (updatedTrainers: Trainer[]) => {
    if (typeof window === "undefined") return;
    try {
      const existing = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "{}"
      ) as any;
      const updated = {
        ...existing,
        trainers: updatedTrainers,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save trainers to localStorage", e);
    }
  };

  const handleSaveAndContinue = () => {
    if (trainers.length === 0) {
      setError("Please add at least one trainer before continuing.");
      return;
    }
    setError("");

    // ✅ Save trainers before moving
    saveTrainersToLocalStorage(trainers);

    setActivePage("set-images"); // or "set-images" depending on your flow
  };

  // 🧩 Handle text changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCurrentTrainer((prev) => ({ ...prev, [name]: value }));
  };

  // 🖼 Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCurrentTrainer((prev) => ({
          ...prev,
          image: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setCurrentTrainer((prev) => ({ ...prev, image: "" }));
  };

  // ➕ Add trainer
  const handleAddTrainer = () => {
    if (!currentTrainer.name.trim() || !currentTrainer.description.trim()) {
      setError("Please fill in at least trainer name and description.");
      return;
    }

    const newTrainer: Trainer = {
      ...currentTrainer,
      id: Date.now().toString(),
    };

    const updatedTrainers = [...trainers, newTrainer];

    setTrainers(updatedTrainers);
    saveTrainersToLocalStorage(updatedTrainers);

    // reset current trainer form
    setCurrentTrainer({
      id: "",
      name: "",
      designation: "",
      description: "",
      image: "",
      facebook: "",
      instagram: "",
      linkedin: "",
      twitter: "",
    });
    setError("");
  };

  // ❌ Remove trainer
  const handleRemoveTrainer = (id: string) => {
    const updatedTrainers = trainers.filter((t) => t.id !== id);
    setTrainers(updatedTrainers);
    saveTrainersToLocalStorage(updatedTrainers);
  };

  // ✅ Hydrate trainers from localStorage if they exist
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const data = JSON.parse(saved);
      if (Array.isArray(data.trainers)) {
        setTrainers(data.trainers);
      }
    } catch (e) {
      console.error("Failed to load trainers from localStorage", e);
    }
  }, []);

  return (
    <div className="px-4 sm:px-6 md:px-8 pb-8">
      <div className="rounded-2xl p-4 sm:p-6 md:p-8 bg-white dark:bg-[#101010] dark:border border-[#E8E8E8] max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold mb-2">
            Add Trainers
          </h3>
          <p className="text-[13px] sm:text-[14px] md:text-[16px] font-medium text-[#666666] dark:text-gray-300">
            Add details of trainers or speakers associated with this event.
          </p>
        </div>

        {/* Trainer Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Upload Image */}
          <div className="space-y-2">
            <label className="block text-[14px] font-medium mb-2">
              Upload Trainer Image "192 * 256 px"{" "}
              <span className="text-[#D6111A]">*</span>
            </label>

            {currentTrainer.image ? (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
                <img
                  src={currentTrainer.image}
                  alt="Trainer Preview"
                  className="object-cover w-full h-full"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-black transition"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="relative w-full sm:w-3/4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-[#222] cursor-pointer transition">
                  <FileUp
                    size={18}
                    className="text-gray-600 dark:text-gray-300 mr-2"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Upload trainer image
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-[14px] font-medium mb-2">
              Trainer Name <span className="text-[#D6111A]">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={currentTrainer.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full h-11 sm:h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] dark:bg-[#101010] border-[#E8E8E8]"
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-[14px] font-medium mb-2">
              Designation <span className="text-[#D6111A]">*</span>
            </label>
            <input
              type="text"
              name="designation"
              value={currentTrainer.designation}
              onChange={handleChange}
              placeholder="e.g. Motivational Coach, Fitness Trainer"
              className="w-full h-11 sm:h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] dark:bg-[#101010] border-[#E8E8E8]"
            />
          </div>

          {/* Short Description */}
          <div className="sm:col-span-2">
            <label className="block text-[14px] font-medium mb-2">
              Short Description <span className="text-[#D6111A]">*</span>
            </label>
            <textarea
              name="description"
              value={currentTrainer.description}
              onChange={handleChange}
              rows={3}
              placeholder="Brief about the trainer or speaker..."
              className="w-full px-4 py-2 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] dark:bg-[#101010] border-[#E8E8E8] resize-none"
            />
          </div>

          {/* Social Media Links */}
          <div>
            <label className="block text-[14px] font-medium mb-2">
              Facebook
            </label>
            <input
              type="text"
              name="facebook"
              value={currentTrainer.facebook}
              onChange={handleChange}
              placeholder="https://facebook.com/trainer"
              className="w-full h-11 sm:h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] dark:bg-[#101010] border-[#E8E8E8]"
            />
          </div>
          <div>
            <label className="block text-[14px] font-medium mb-2">
              Instagram
            </label>
            <input
              type="text"
              name="instagram"
              value={currentTrainer.instagram}
              onChange={handleChange}
              placeholder="https://instagram.com/trainer"
              className="w-full h-11 sm:h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] dark:bg-[#101010] border-[#E8E8E8]"
            />
          </div>
          <div>
            <label className="block text-[14px] font-medium mb-2">
              LinkedIn
            </label>
            <input
              type="text"
              name="linkedin"
              value={currentTrainer.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/trainer"
              className="w-full h-11 sm:h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] dark:bg-[#101010] border-[#E8E8E8]"
            />
          </div>
          <div>
            <label className="block text-[14px] font-medium mb-2">
              Twitter
            </label>
            <input
              type="text"
              name="twitter"
              value={currentTrainer.twitter}
              onChange={handleChange}
              placeholder="https://twitter.com/trainer"
              className="w-full h-11 sm:h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] dark:bg-[#101010] border-[#E8E8E8]"
            />
          </div>
        </div>

        {/* Add Button */}
        <div className="flex justify-end">
          <button
            onClick={handleAddTrainer}
            className="h-10 sm:h-12 px-6 sm:px-8 rounded-xl text-[13px] sm:text-[14px] font-semibold flex items-center gap-2 bg-[#D19537] text-white"
          >
            Add Trainer
            <img
              src="/images/icons/plus-icon.png"
              alt="add"
              className="w-4 h-4"
            />
          </button>
        </div>

        {trainers.length > 0 && (
          <div className="mt-6 space-y-3 w-full overflow-hidden">
            {trainers.map((trainer) => (
              <div
                key={trainer.id}
                className="
          flex flex-col sm:flex-row 
          sm:items-center sm:justify-between 
          p-3 sm:p-4 rounded-lg border 
          bg-[#FAFAFB] dark:bg-[#101010] 
          border-[#E8E8E8]
          gap-3
          w-full
          overflow-hidden
        "
              >
                <div className="flex items-start sm:items-center gap-3 sm:gap-4 w-full overflow-hidden">
                  {trainer.image && (
                    <img
                      src={trainer.image}
                      alt={trainer.name}
                      className="
                w-12 h-12 rounded-full object-cover 
                border border-gray-300 dark:border-gray-600 
                flex-shrink-0
              "
                    />
                  )}

                  <div className="flex-1 w-full break-words whitespace-normal overflow-hidden">
                    <div className="text-[14px] font-semibold break-words whitespace-normal">
                      {trainer.name}
                    </div>

                    <div className="text-[13px] text-[#D19537] dark:text-[#e2b85b] break-words whitespace-normal">
                      {trainer.designation}
                    </div>

                    <div className="text-[13px] text-[#666666] dark:text-gray-400 break-words whitespace-normal leading-relaxed">
                      {trainer.description}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRemoveTrainer(trainer.id)}
                  className="text-[13px] sm:text-[14px] font-medium text-[#D6111A] self-end sm:self-center"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-[#D6111A] text-[13px] font-medium mt-2 mb-4">
            {error}
          </div>
        )}
      </div>
      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-6">
        <button
          onClick={handleGoBack}
          className="h-11 sm:h-12 px-6 sm:px-8 rounded-xl text-[13px] sm:text-[14px] font-semibold bg-[#FFF5E6] text-[#D19537]"
        >
          Go Back
        </button>
        <button
          onClick={handleSaveAndContinue}
          className="h-11 sm:h-12 px-6 sm:px-8 rounded-xl text-[13px] sm:text-[14px] font-semibold bg-[#D19537] text-white"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { X, FileUp } from "lucide-react";

// interface Trainer {
//   id: string;
//   name: string;
//   designation: string;
//   description: string;
//   image: string;
//   facebook: string;
//   instagram: string;
//   linkedin: string;
//   twitter: string;
// }

// interface Ticket {
//   id: string;
//   name: string;
//   price: string;
// }

// type SetImagesPageProps = {
//   setActivePage: React.Dispatch<React.SetStateAction<string>>;
// };

// export default function AddTrainersSection({
//   setActivePage,
// }: SetImagesPageProps) {
//   const [trainers, setTrainers] = useState<Trainer[]>([]);
//   const [currentTrainer, setCurrentTrainer] = useState<Trainer>({
//     id: "",
//     name: "",
//     designation: "",
//     description: "",
//     image: "",
//     facebook: "",
//     instagram: "",
//     linkedin: "",
//     twitter: "",
//   });
//   const [error, setError] = useState("");

//   const [eventType, setEventType] = useState<"ticketed" | "free">("ticketed");
//   const [tickets, setTickets] = useState<Ticket[]>([]);

//   const handleGoBack = () => setActivePage("create");

//   const handleSaveAndContinue = () => {
//     if (trainers.length === 0) {
//       setError("Please add at least one trainer before continuing.");
//       return;
//     }
//     setError("");
//     setActivePage("set-images"); // or "set-images" depending on your flow
//   };

//   // 🧩 Handle text changes
//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setCurrentTrainer((prev) => ({ ...prev, [name]: value }));
//   };

//   // 🖼 Handle image upload
//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setCurrentTrainer((prev) => ({
//           ...prev,
//           image: event.target?.result as string,
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleRemoveImage = () => {
//     setCurrentTrainer((prev) => ({ ...prev, image: "" }));
//   };

//   // ➕ Add trainer
//   const handleAddTrainer = () => {
//     if (!currentTrainer.name.trim() || !currentTrainer.description.trim()) {
//       setError("Please fill in at least trainer name and description.");
//       return;
//     }

//     setTrainers([
//       ...trainers,
//       { ...currentTrainer, id: Date.now().toString() },
//     ]);

//     // reset current trainer form
//     setCurrentTrainer({
//       id: "",
//       name: "",
//       designation: "",
//       description: "",
//       image: "",
//       facebook: "",
//       instagram: "",
//       linkedin: "",
//       twitter: "",
//     });
//     setError("");
//   };

//   // ❌ Remove trainer
//   const handleRemoveTrainer = (id: string) => {
//     setTrainers(trainers.filter((t) => t.id !== id));
//   };

//   return (
//     <div className="px-4 sm:px-6 md:px-8 pb-8">
//       <div className="rounded-2xl p-4 sm:p-6 md:p-8 bg-white dark:bg-[#101010] dark:border border-[#E8E8E8] max-w-[1200px] mx-auto">
//         {/* Header */}
//         <div className="mb-6 sm:mb-8">
//           <h3 className="text-[22px] sm:text-[26px] md:text-[28px] font-bold mb-2">
//             Add Trainers
//           </h3>
//           <p className="text-[13px] sm:text-[14px] md:text-[16px] font-medium text-[#666666] dark:text-gray-300">
//             Add details of trainers or speakers associated with this event.
//           </p>
//         </div>

//         {/* Trainer Form */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
//           {/* Upload Image */}
//           <div className="space-y-2">
//             <label className="block text-[14px] font-medium mb-2">
//               Upload Trainer Image "192 * 256 px" <span className="text-[#D6111A]">*</span>
//             </label>

//             {currentTrainer.image ? (
//               <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
//                 <img
//                   src={currentTrainer.image}
//                   alt="Trainer Preview"
//                   className="object-cover w-full h-full"
//                 />
//                 <button
//                   type="button"
//                   onClick={handleRemoveImage}
//                   className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full hover:bg-black transition"
//                 >
//                   <X size={14} />
//                 </button>
//               </div>
//             ) : (
//               <div className="relative w-full sm:w-3/4">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   className="absolute inset-0 opacity-0 cursor-pointer"
//                 />
//                 <div className="flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-[#222] cursor-pointer transition">
//                   <FileUp
//                     size={18}
//                     className="text-gray-600 dark:text-gray-300 mr-2"
//                   />
//                   <span className="text-sm text-gray-700 dark:text-gray-300">
//                     Upload trainer image
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Name */}
//           <div>
//             <label className="block text-[14px] font-medium mb-2">
//               Trainer Name <span className="text-[#D6111A]">*</span>
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={currentTrainer.name}
//               onChange={handleChange}
//               placeholder="John Doe"
//               className="w-full h-11 sm:h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] dark:bg-[#101010] border-[#E8E8E8]"
//             />
//           </div>

//           {/* Designation */}
//           <div>
//             <label className="block text-[14px] font-medium mb-2">
//               Designation <span className="text-[#D6111A]">*</span>
//             </label>
//             <input
//               type="text"
//               name="designation"
//               value={currentTrainer.designation}
//               onChange={handleChange}
//               placeholder="e.g. Motivational Coach, Fitness Trainer"
//               className="w-full h-11 sm:h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] dark:bg-[#101010] border-[#E8E8E8]"
//             />
//           </div>

//           {/* Short Description */}
//           <div className="sm:col-span-2">
//             <label className="block text-[14px] font-medium mb-2">
//               Short Description <span className="text-[#D6111A]">*</span>
//             </label>
//             <textarea
//               name="description"
//               value={currentTrainer.description}
//               onChange={handleChange}
//               rows={3}
//               placeholder="Brief about the trainer or speaker..."
//               className="w-full px-4 py-2 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] dark:bg-[#101010] border-[#E8E8E8] resize-none"
//             />
//           </div>

//           {/* Social Media Links */}
//           <div>
//             <label className="block text-[14px] font-medium mb-2">
//               Facebook
//             </label>
//             <input
//               type="text"
//               name="facebook"
//               value={currentTrainer.facebook}
//               onChange={handleChange}
//               placeholder="https://facebook.com/trainer"
//               className="w-full h-11 sm:h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] dark:bg-[#101010] border-[#E8E8E8]"
//             />
//           </div>
//           <div>
//             <label className="block text-[14px] font-medium mb-2">
//               Instagram
//             </label>
//             <input
//               type="text"
//               name="instagram"
//               value={currentTrainer.instagram}
//               onChange={handleChange}
//               placeholder="https://instagram.com/trainer"
//               className="w-full h-11 sm:h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] dark:bg-[#101010] border-[#E8E8E8]"
//             />
//           </div>
//           <div>
//             <label className="block text-[14px] font-medium mb-2">
//               LinkedIn
//             </label>
//             <input
//               type="text"
//               name="linkedin"
//               value={currentTrainer.linkedin}
//               onChange={handleChange}
//               placeholder="https://linkedin.com/in/trainer"
//               className="w-full h-11 sm:h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] dark:bg-[#101010] border-[#E8E8E8]"
//             />
//           </div>
//           <div>
//             <label className="block text-[14px] font-medium mb-2">
//               Twitter
//             </label>
//             <input
//               type="text"
//               name="twitter"
//               value={currentTrainer.twitter}
//               onChange={handleChange}
//               placeholder="https://twitter.com/trainer"
//               className="w-full h-11 sm:h-12 px-4 rounded-lg border text-[14px] outline-none bg-[#FAFAFB] dark:bg-[#101010] border-[#E8E8E8]"
//             />
//           </div>
//         </div>

//         {/* Add Button */}
//         <div className="flex justify-end">
//           <button
//             onClick={handleAddTrainer}
//             className="h-10 sm:h-12 px-6 sm:px-8 rounded-xl text-[13px] sm:text-[14px] font-semibold flex items-center gap-2 bg-[#D19537] text-white"
//           >
//             Add Trainer
//             <img
//               src="/images/icons/plus-icon.png"
//               alt="add"
//               className="w-4 h-4"
//             />
//           </button>
//         </div>

//         {/* Trainer List */}
//         {trainers.length > 0 && (
//           <div className="mt-6 space-y-3">
//             {trainers.map((trainer) => (
//               <div
//                 key={trainer.id}
//                 className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg border bg-[#FAFAFB] dark:bg-[#101010] border-[#E8E8E8]"
//               >
//                 <div className="flex items-center gap-4 mb-2 sm:mb-0">
//                   {trainer.image && (
//                     <img
//                       src={trainer.image}
//                       alt={trainer.name}
//                       className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-600"
//                     />
//                   )}
//                   <div>
//                     <div className="text-[14px] font-semibold">
//                       {trainer.name}
//                     </div>
//                     <div className="text-[13px] text-[#D19537] dark:text-[#e2b85b]">
//                       {trainer.designation}
//                     </div>
//                     <div className="text-[13px] text-[#666666] dark:text-gray-400">
//                       {trainer.description}
//                     </div>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => handleRemoveTrainer(trainer.id)}
//                   className="text-[13px] sm:text-[14px] font-medium text-[#D6111A]"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
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
