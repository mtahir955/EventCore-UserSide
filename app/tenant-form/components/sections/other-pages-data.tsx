"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { FileText, PlusCircle, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

const OtherPagesDataSection = forwardRef((props, ref) => {
  // ⭐ Privacy Policies (NO IDs)
  const [privacyPolicies, setPrivacyPolicies] = useState<
    { title: string; description: string }[]
  >([]);

  // ⭐ FAQs (NO IDs)
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);

  // Temporary forms
  const [privacyForm, setPrivacyForm] = useState({
    title: "",
    description: "",
  });

  const [faqForm, setFaqForm] = useState({
    question: "",
    answer: "",
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [editingPrivacyIndex, setEditingPrivacyIndex] = useState<number | null>(
    null
  );
  const [editingFaqIndex, setEditingFaqIndex] = useState<number | null>(null);

  // ⭐ About page + Terms page main form data
  const [formData, setFormData] = useState({
    tenantName: "",
    email: "",
    description: "",
    subdomain: "",
    logo: "",
    banner: "",
    aboutTitle: "",
    aboutSubtitle: "",
    mainHeadline: "",
    termsAndConditions: "",
  });

  // ⭐ Emit data + validator to parent component
  useImperativeHandle(ref, () => ({
    validate: () => {
      const privacyError = privacyPolicies.some(
        (p) => !p.title.trim() || !p.description.trim()
      );
      const faqError = faqs.some((f) => !f.question.trim() || !f.answer.trim());

      if (privacyError || faqError) {
        console.log("⚠️ Invalid privacy policy or FAQ");
        return false;
      }

      return true;
    },

    // ⭐ Return clean arrays (no IDs)
    getData: () => ({
      privacyPolicies: privacyPolicies.map((p) => ({
        title: p.title,
        description: p.description,
      })),
      faqs: faqs.map((f) => ({
        question: f.question,
        answer: f.answer,
      })),
      formData,
    }),
  }));

  // ⭐ Add / Update Privacy Policy
  const handleAddPrivacy = () => {
    const newErrors: Record<string, boolean> = {};
    if (!privacyForm.title.trim()) newErrors.title = true;
    if (!privacyForm.description.trim()) newErrors.description = true;
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    if (editingPrivacyIndex !== null) {
      // Update existing
      setPrivacyPolicies((prev) =>
        prev.map((p, i) => (i === editingPrivacyIndex ? { ...privacyForm } : p))
      );
      setEditingPrivacyIndex(null);
    } else {
      // Add new item
      setPrivacyPolicies((prev) => [...prev, { ...privacyForm }]);
    }

    setPrivacyForm({ title: "", description: "" });
  };

  // ⭐ Add / Update FAQ
  const handleAddFaq = () => {
    const newErrors: Record<string, boolean> = {};
    if (!faqForm.question.trim()) newErrors.question = true;
    if (!faqForm.answer.trim()) newErrors.answer = true;
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    if (editingFaqIndex !== null) {
      setFaqs((prev) =>
        prev.map((f, i) => (i === editingFaqIndex ? { ...faqForm } : f))
      );
      setEditingFaqIndex(null);
    } else {
      setFaqs((prev) => [...prev, { ...faqForm }]);
    }

    setFaqForm({ question: "", answer: "" });
  };

  // ⭐ Edit privacy (index-based)
  const handleEditPrivacy = (index: number) => {
    const p = privacyPolicies[index];
    setPrivacyForm({ title: p.title, description: p.description });
    setEditingPrivacyIndex(index);
  };

  // ⭐ Edit FAQ (index-based)
  const handleEditFaq = (index: number) => {
    const f = faqs[index];
    setFaqForm({ question: f.question, answer: f.answer });
    setEditingFaqIndex(index);
  };

  // ⭐ Remove Privacy
  const handleRemovePrivacy = (index: number) => {
    setPrivacyPolicies((prev) => prev.filter((_, i) => i !== index));
  };

  // ⭐ Remove FAQ
  const handleRemoveFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  // ⭐ Save button (local only)
  const handleSaveAll = () => {
    console.log("Saved data:", { privacyPolicies, faqs, formData });
  };

  // ⭐ Text inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  return (
    <div className="w-full bg-white dark:bg-[#101010] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-8 shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FileText size={24} className="text-gray-700 dark:text-white" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Other Pages Data
        </h3>
      </div>

      {/* ABOUT PAGE */}
      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        About Page
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* About Title */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            About Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="aboutTitle"
            value={formData.aboutTitle}
            onChange={handleChange}
            placeholder="Enter About page title"
            className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#101010]`}
          />
        </div>

        {/* About Subtitle */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            About Subtitle <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="aboutSubtitle"
            value={formData.aboutSubtitle}
            onChange={handleChange}
            placeholder="Enter subtitle"
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#101010]"
          />
        </div>
      </div>

      {/* Main Headline */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Main Headline <span className="text-red-500">*</span>
        </label>
        <textarea
          name="mainHeadline"
          value={formData.mainHeadline}
          onChange={handleChange}
          rows={2}
          placeholder="Write your about page headline..."
          className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#101010] resize-none"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Short description about tenant"
          className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#101010] resize-none"
        />
      </div>

      {/* PRIVACY POLICY */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Privacy Policy
        </h4>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={privacyForm.title}
              onChange={(e) =>
                setPrivacyForm((p) => ({ ...p, title: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#101010]"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={privacyForm.description}
              onChange={(e) =>
                setPrivacyForm((p) => ({
                  ...p,
                  description: e.target.value,
                }))
              }
              rows={3}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#101010] resize-none"
            />
          </div>
        </div>

        <Button
          onClick={handleAddPrivacy}
          className="bg-[#D19537] hover:bg-[#e59618] text-white flex gap-2 items-center"
        >
          <PlusCircle size={16} />
          {editingPrivacyIndex !== null ? "Update Policy" : "Add Policy"}
        </Button>

        {/* List */}
        {privacyPolicies.length > 0 && (
          <div className="space-y-3 mt-3">
            {privacyPolicies.map((p, index) => (
              <div
                key={index}
                className="p-3 border rounded-lg flex justify-between bg-gray-50 dark:bg-[#1a1a1a]"
              >
                <div>
                  <h5 className="font-semibold">{p.title}</h5>
                  <p className="text-sm">{p.description}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditPrivacy(index)}
                    className="text-blue-500"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleRemovePrivacy(index)}
                    className="text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold">FAQs</h4>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">
              Question <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={faqForm.question}
              onChange={(e) =>
                setFaqForm((f) => ({ ...f, question: e.target.value }))
              }
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#101010]"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Answer <span className="text-red-500">*</span>
            </label>
            <textarea
              value={faqForm.answer}
              onChange={(e) =>
                setFaqForm((f) => ({ ...f, answer: e.target.value }))
              }
              rows={3}
              className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#101010] resize-none"
            />
          </div>
        </div>

        <Button
          onClick={handleAddFaq}
          className="bg-[#D19537] hover:bg-[#e59618] text-white flex gap-2 items-center"
        >
          <PlusCircle size={16} />
          {editingFaqIndex !== null ? "Update FAQ" : "Add FAQ"}
        </Button>

        {/* List */}
        {faqs.length > 0 && (
          <div className="space-y-3 mt-3">
            {faqs.map((f, index) => (
              <div
                key={index}
                className="p-3 border rounded-lg flex justify-between bg-gray-50 dark:bg-[#1a1a1a]"
              >
                <div>
                  <h5 className="font-semibold">Q: {f.question}</h5>
                  <p className="text-sm mt-1">A: {f.answer}</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEditFaq(index)}
                    className="text-blue-500"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleRemoveFaq(index)}
                    className="text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Terms & Conditions */}
      <div className="space-y-2">
        <h4 className="text-lg font-semibold">Terms & Conditions</h4>
        <label className="block text-sm mb-1">
          Terms & Conditions <span className="text-red-500">*</span>
        </label>

        <textarea
          name="termsAndConditions"
          value={formData.termsAndConditions}
          onChange={handleChange}
          placeholder="Enter terms & conditions"
          rows={3}
          className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#101010] resize-none"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button
          onClick={handleSaveAll}
          className="bg-[#D19537] hover:bg-[#e59618] text-white px-6 py-2 rounded-lg"
        >
          Save
        </Button>
      </div>
    </div>
  );
});

OtherPagesDataSection.displayName = "OtherPagesDataSection";
export default OtherPagesDataSection;

// "use client";

// import { forwardRef, useImperativeHandle, useState } from "react";
// import { FileText, PlusCircle, Trash2, Pencil } from "lucide-react";
// import { Button } from "@/components/ui/button";

// const OtherPagesDataSection = forwardRef((props, ref) => {
//   const [privacyPolicies, setPrivacyPolicies] = useState<
//     { id: number; title: string; description: string }[]
//   >([]);
//   const [faqs, setFaqs] = useState<
//     { id: number; question: string; answer: string }[]
//   >([]);

//   const [privacyForm, setPrivacyForm] = useState({
//     title: "",
//     description: "",
//   });
//   const [faqForm, setFaqForm] = useState({ question: "", answer: "" });
//   const [errors, setErrors] = useState<Record<string, boolean>>({});

//   const [editingPrivacyId, setEditingPrivacyId] = useState<number | null>(null);
//   const [editingFaqId, setEditingFaqId] = useState<number | null>(null);

//   // 🧠 Expose validate + getData to parent
//   // useImperativeHandle(ref, () => ({
//   //   validate: () => {
//   //     const hasError =
//   //       (privacyPolicies.length === 0 && faqs.length === 0) ||
//   //       privacyPolicies.some((p) => !p.title || !p.description) ||
//   //       faqs.some((f) => !f.question || !f.answer);
//   //     if (hasError) console.log("⚠️ Please fill required fields");
//   //     return !hasError;
//   //   },
//   //   getData: () => ({
//   //     privacyPolicies,
//   //     faqs,
//   //   }),
//   // }));

//   useImperativeHandle(ref, () => ({
//     validate: () => {
//       const newErrors: Record<string, boolean> = {};

//       // Validate only if fields exist
//       const privacyError = privacyPolicies.some(
//         (p) => !p.title.trim() || !p.description.trim()
//       );

//       const faqError = faqs.some((f) => !f.question.trim() || !f.answer.trim());

//       if (privacyError || faqError) {
//         console.log("⚠️ Invalid privacy policy or FAQ");
//         return false;
//       }

//       return true; // Everything is valid
//     },

//     getData: () => ({
//       privacyPolicies,
//       faqs,
//       formData, // your about + terms data
//     }),
//   }));

//   // ➕ Add / Update Privacy
//   const handleAddPrivacy = () => {
//     const newErrors: Record<string, boolean> = {};
//     if (!privacyForm.title) newErrors.title = true;
//     if (!privacyForm.description) newErrors.description = true;
//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//       if (editingPrivacyId) {
//         setPrivacyPolicies((prev) =>
//           prev.map((p) =>
//             p.id === editingPrivacyId ? { ...p, ...privacyForm } : p
//           )
//         );
//         setEditingPrivacyId(null);
//       } else {
//         setPrivacyPolicies((prev) => [
//           ...prev,
//           { id: Date.now(), ...privacyForm },
//         ]);
//       }
//       setPrivacyForm({ title: "", description: "" });
//     }
//   };

//   // ➕ Add / Update FAQ
//   const handleAddFaq = () => {
//     const newErrors: Record<string, boolean> = {};
//     if (!faqForm.question) newErrors.question = true;
//     if (!faqForm.answer) newErrors.answer = true;
//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//       if (editingFaqId) {
//         setFaqs((prev) =>
//           prev.map((f) => (f.id === editingFaqId ? { ...f, ...faqForm } : f))
//         );
//         setEditingFaqId(null);
//       } else {
//         setFaqs((prev) => [...prev, { id: Date.now(), ...faqForm }]);
//       }
//       setFaqForm({ question: "", answer: "" });
//     }
//   };

//   // ✏️ Edit
//   const handleEditPrivacy = (p) => {
//     setPrivacyForm({ title: p.title, description: p.description });
//     setEditingPrivacyId(p.id);
//   };
//   const handleEditFaq = (f) => {
//     setFaqForm({ question: f.question, answer: f.answer });
//     setEditingFaqId(f.id);
//   };

//   // ❌ Remove
//   const handleRemovePrivacy = (id: number) =>
//     setPrivacyPolicies((prev) => prev.filter((p) => p.id !== id));
//   const handleRemoveFaq = (id: number) =>
//     setFaqs((prev) => prev.filter((f) => f.id !== id));

//   // 💾 Save all
//   const handleSaveAll = () => {
//     console.log("✅ Saved Data:", { privacyPolicies, faqs });
//   };

//   const [formData, setFormData] = useState({
//     tenantName: "",
//     email: "",
//     description: "",
//     subdomain: "",
//     logo: "",
//     banner: "",
//     aboutTitle: "",
//     aboutSubtitle: "",
//     mainHeadline: "",
//     termsAndConditions: "",
//   });
//   // 🧩 Handle text & textarea inputs
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//     setErrors((prev) => ({ ...prev, [name]: false }));
//   };

//   return (
//     <div className="w-full bg-white dark:bg-[#101010] rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-8 shadow-sm transition-all">
//       {/* Header */}
//       <div className="flex items-center gap-3">
//         <FileText size={24} className="text-gray-700 dark:text-white" />
//         <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//           Other Pages Data
//         </h3>
//       </div>

//       <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
//         About page
//       </h4>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//         {/* About Title */}
//         <div className="space-y-2">
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//             About Title <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             name="aboutTitle"
//             placeholder="Enter main about title"
//             value={formData.aboutTitle}
//             onChange={handleChange}
//             className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]
//         ${
//           errors.aboutTitle
//             ? "border-red-500"
//             : "border-gray-300 dark:border-gray-700"
//         } bg-white dark:bg-[#101010] text-gray-900 dark:text-white`}
//           />
//         </div>

//         {/* About Subtitle */}
//         <div className="space-y-2">
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//             About Subtitle <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             name="aboutSubtitle"
//             placeholder="Enter a short subtitle"
//             value={formData.aboutSubtitle}
//             onChange={handleChange}
//             className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537]
//         ${
//           errors.aboutSubtitle
//             ? "border-red-500"
//             : "border-gray-300 dark:border-gray-700"
//         } bg-white dark:bg-[#101010] text-gray-900 dark:text-white`}
//           />
//         </div>
//       </div>

//       {/* Main Headline */}
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//           Main Headline <span className="text-red-500">*</span>
//         </label>
//         <textarea
//           name="mainHeadline"
//           placeholder="Write your about page headline"
//           value={formData.mainHeadline}
//           onChange={handleChange}
//           rows={2}
//           className={`w-full px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#D19537]
//       ${
//         errors.mainHeadline
//           ? "border-red-500"
//           : "border-gray-300 dark:border-gray-700"
//       } bg-white dark:bg-[#101010] text-gray-900 dark:text-white`}
//         />
//       </div>

//       {/* Description */}
//       <div className="space-y-2">
//         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//           Description <span className="text-red-500">*</span>
//         </label>
//         <textarea
//           name="description"
//           placeholder="Write a short description about the tenant"
//           value={formData.description}
//           onChange={handleChange}
//           rows={3}
//           className={`w-full px-4 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#D19537]
//             ${
//               errors.description
//                 ? "border-red-500"
//                 : "border-gray-300 dark:border-gray-700"
//             } bg-white dark:bg-[#101010] text-gray-900 dark:text-white`}
//         />
//       </div>

//       {/* 📜 Privacy Policy */}
//       <div className="space-y-4">
//         <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
//           Privacy Policy
//         </h4>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
//               Title <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               placeholder="Enter policy title"
//               value={privacyForm.title}
//               onChange={(e) =>
//                 setPrivacyForm({ ...privacyForm, title: e.target.value })
//               }
//               className={`w-full rounded-lg px-4 py-2 border ${
//                 errors.title
//                   ? "border-red-500"
//                   : "border-gray-300 dark:border-gray-700"
//               } bg-white dark:bg-[#101010] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#D19537] outline-none`}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
//               Description <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               placeholder="Enter policy description"
//               value={privacyForm.description}
//               onChange={(e) =>
//                 setPrivacyForm({ ...privacyForm, description: e.target.value })
//               }
//               rows={3}
//               className={`w-full rounded-lg px-4 py-2 border ${
//                 errors.description
//                   ? "border-red-500"
//                   : "border-gray-300 dark:border-gray-700"
//               } bg-white dark:bg-[#101010] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#D19537] resize-none`}
//             />
//           </div>
//         </div>

//         <Button
//           onClick={handleAddPrivacy}
//           className="flex items-center gap-2 bg-[#D19537] hover:bg-[#e59618] text-white font-medium px-4 py-2 rounded-lg transition"
//         >
//           <PlusCircle size={16} />{" "}
//           {editingPrivacyId ? "Update Policy" : "Add Policy"}
//         </Button>

//         {privacyPolicies.length > 0 && (
//           <div className="mt-4 space-y-3">
//             {privacyPolicies.map((p) => (
//               <div
//                 key={p.id}
//                 className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a1a] flex justify-between items-start"
//               >
//                 <div>
//                   <h5 className="font-semibold text-gray-800 dark:text-white">
//                     {p.title}
//                   </h5>
//                   <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//                     {p.description}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={() => handleEditPrivacy(p)}
//                     className="text-blue-500 hover:text-blue-600"
//                     title="Edit"
//                   >
//                     <Pencil size={18} />
//                   </button>
//                   <button
//                     onClick={() => handleRemovePrivacy(p.id)}
//                     className="text-red-500 hover:text-red-700"
//                     title="Delete"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* ❓ FAQ Section */}
//       <div className="space-y-4">
//         <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
//           FAQs
//         </h4>

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
//               Question <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               placeholder="Enter question"
//               value={faqForm.question}
//               onChange={(e) =>
//                 setFaqForm({ ...faqForm, question: e.target.value })
//               }
//               className={`w-full rounded-lg px-4 py-2 border ${
//                 errors.question
//                   ? "border-red-500"
//                   : "border-gray-300 dark:border-gray-700"
//               } bg-white dark:bg-[#101010] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#D19537] outline-none`}
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
//               Answer <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               placeholder="Enter answer"
//               value={faqForm.answer}
//               onChange={(e) =>
//                 setFaqForm({ ...faqForm, answer: e.target.value })
//               }
//               rows={3}
//               className={`w-full rounded-lg px-4 py-2 border ${
//                 errors.answer
//                   ? "border-red-500"
//                   : "border-gray-300 dark:border-gray-700"
//               } bg-white dark:bg-[#101010] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#D19537] resize-none`}
//             />
//           </div>
//         </div>

//         <Button
//           onClick={handleAddFaq}
//           className="flex items-center gap-2 bg-[#D19537] hover:bg-[#e59618] text-white font-medium px-4 py-2 rounded-lg transition"
//         >
//           <PlusCircle size={16} /> {editingFaqId ? "Update FAQ" : "Add FAQ"}
//         </Button>

//         {faqs.length > 0 && (
//           <div className="mt-4 space-y-3">
//             {faqs.map((f) => (
//               <div
//                 key={f.id}
//                 className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#1a1a1a] flex justify-between items-start"
//               >
//                 <div>
//                   <h5 className="font-semibold text-gray-800 dark:text-white">
//                     Q: {f.question}
//                   </h5>
//                   <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
//                     A: {f.answer}
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <button
//                     onClick={() => handleEditFaq(f)}
//                     className="text-blue-500 hover:text-blue-600"
//                     title="Edit"
//                   >
//                     <Pencil size={18} />
//                   </button>
//                   <button
//                     onClick={() => handleRemoveFaq(f.id)}
//                     className="text-red-500 hover:text-red-700"
//                     title="Delete"
//                   >
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//       {/* Terms & Conditions (Optional) */}
//       <div className="space-y-2">
//         <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
//           Terms & Conditions
//         </h4>
//         <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
//           Enter Terms & Conditions <span className="text-red-500">*</span>
//         </label>
//         <textarea
//           name="termsAndConditions"
//           placeholder="Enter or link terms & conditions"
//           value={formData.termsAndConditions}
//           onChange={handleChange}
//           rows={3}
//           className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#101010] text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D19537] resize-none"
//         />
//       </div>

//       {/* 💾 Save Button */}
//       <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
//         <Button
//           onClick={handleSaveAll}
//           className="bg-[#D19537] hover:bg-[#e59618] text-white font-medium px-6 py-2 rounded-lg transition"
//         >
//           Save
//         </Button>
//       </div>
//     </div>
//   );
// });

// OtherPagesDataSection.displayName = "OtherPagesDataSection";
// export default OtherPagesDataSection;
