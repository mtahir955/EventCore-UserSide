"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { FileText, PlusCircle, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

const OtherPagesDataSection = forwardRef(({ tenant }: any, ref) => {
  // ⭐ About
  const [about, setAbout] = useState({
    title: tenant.aboutPage?.title || "",
    subtitle: tenant.aboutPage?.subtitle || "",
    mainHeadline: tenant.aboutPage?.mainHeadline || "",
    description: tenant.aboutPage?.description || "",
  });

  // ⭐ Privacy Policies
  const [privacyPolicies, setPrivacyPolicies] = useState(
    tenant.privacyPolicies || []
  );

  const [privacyForm, setPrivacyForm] = useState({
    title: "",
    description: "",
  });
  const [editingPrivacyIndex, setEditingPrivacyIndex] = useState<number | null>(
    null
  );

  // ⭐ FAQs
  const [faqs, setFaqs] = useState(tenant.faqs || []);

  const [faqForm, setFaqForm] = useState({
    question: "",
    answer: "",
  });
  const [editingFaqIndex, setEditingFaqIndex] = useState<number | null>(null);

  // ⭐ Terms
  const [terms, setTerms] = useState(tenant.termsAndConditions || "");

  // ⭐ Tell parent the output
  useImperativeHandle(ref, () => ({
    getData: () => ({
      aboutPage: {
        title: about.title.trim(),
        subtitle: about.subtitle.trim(),
        mainHeadline: about.mainHeadline.trim(),
        description: about.description.trim(),
      },

      privacyPolicies: privacyPolicies.map((p) => ({
        title: p.title.trim(),
        description: p.description.trim(),
      })),

      faqs: faqs.map((f) => ({
        question: f.question.trim(),
        answer: f.answer.trim(),
      })),

      termsAndConditions: terms.trim(),
    }),
  }));

  // -----------------------
  // 🚀 PRIVACY POLICY HANDLERS
  // -----------------------
  const handleAddPrivacy = () => {
    if (!privacyForm.title.trim() || !privacyForm.description.trim()) return;

    if (editingPrivacyIndex !== null) {
      const updated = [...privacyPolicies];
      updated[editingPrivacyIndex] = { ...privacyForm };
      setPrivacyPolicies(updated);
      setEditingPrivacyIndex(null);
    } else {
      setPrivacyPolicies([...privacyPolicies, { ...privacyForm }]);
    }

    setPrivacyForm({ title: "", description: "" });
  };

  const handleEditPrivacy = (index: number) => {
    setEditingPrivacyIndex(index);
    setPrivacyForm(privacyPolicies[index]);
  };

  const handleRemovePrivacy = (index: number) => {
    setPrivacyPolicies((prev) => prev.filter((_, i) => i !== index));
  };

  // -----------------------
  // 🚀 FAQ HANDLERS
  // -----------------------
  const handleAddFaq = () => {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) return;

    if (editingFaqIndex !== null) {
      const updated = [...faqs];
      updated[editingFaqIndex] = { ...faqForm };
      setFaqs(updated);
      setEditingFaqIndex(null);
    } else {
      setFaqs([...faqs, { ...faqForm }]);
    }

    setFaqForm({ question: "", answer: "" });
  };

  const handleEditFaq = (index: number) => {
    setEditingFaqIndex(index);
    setFaqForm(faqs[index]);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== index));
  };

  // -----------------------
  // 🚀 UI START
  // -----------------------
  return (
    <div className="w-full bg-white dark:bg-[#101010] rounded-2xl border border-gray-300 dark:border-gray-700 p-6 sm:p-8 space-y-8 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FileText size={24} className="text-gray-700 dark:text-white" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Edit Other Pages Data
        </h3>
      </div>

      {/* ================================
         ⭐ ABOUT PAGE
      ================================== */}
      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        About Page
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label>About Title</label>
          <input
            value={about.title}
            onChange={(e) => setAbout({ ...about, title: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#181818]"
          />
        </div>

        <div className="space-y-2">
          <label>About Subtitle</label>
          <input
            value={about.subtitle}
            onChange={(e) => setAbout({ ...about, subtitle: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#181818]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label>Main Headline</label>
        <textarea
          value={about.mainHeadline}
          onChange={(e) => setAbout({ ...about, mainHeadline: e.target.value })}
          rows={2}
          className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#181818]"
        />
      </div>

      <div className="space-y-2">
        <label>Description</label>
        <textarea
          value={about.description}
          onChange={(e) => setAbout({ ...about, description: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#181818]"
        />
      </div>

      {/* ================================
         ⭐ PRIVACY POLICY
      ================================== */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Privacy Policies
        </h4>

        {/* Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            placeholder="Policy Title"
            value={privacyForm.title}
            onChange={(e) =>
              setPrivacyForm({ ...privacyForm, title: e.target.value })
            }
            className="px-4 py-2 border rounded-lg bg-white dark:bg-[#181818]"
          />

          <textarea
            placeholder="Policy Description"
            value={privacyForm.description}
            onChange={(e) =>
              setPrivacyForm({ ...privacyForm, description: e.target.value })
            }
            rows={3}
            className="px-4 py-2 border rounded-lg bg-white dark:bg-[#181818]"
          />
        </div>

        <Button
          onClick={handleAddPrivacy}
          className="bg-[#D19537] hover:bg-[#e59618] text-white flex gap-2"
        >
          <PlusCircle size={18} />
          {editingPrivacyIndex !== null ? "Update Policy" : "Add Policy"}
        </Button>

        {/* LIST */}
        <div className="space-y-3">
          {privacyPolicies.map((p: any, index: number) => (
            <div
              key={index}
              className="flex justify-between items-start bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-lg border"
            >
              <div>
                <h5 className="font-semibold">{p.title}</h5>
                <p className="text-sm mt-1">{p.description}</p>
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
      </div>

      {/* ================================
         ⭐ FAQ SECTION
      ================================== */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          FAQs
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            placeholder="FAQ Question"
            value={faqForm.question}
            onChange={(e) =>
              setFaqForm({ ...faqForm, question: e.target.value })
            }
            className="px-4 py-2 border rounded-lg bg-white dark:bg-[#181818]"
          />

          <textarea
            placeholder="FAQ Answer"
            value={faqForm.answer}
            onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
            rows={3}
            className="px-4 py-2 border rounded-lg bg-white dark:bg-[#181818]"
          />
        </div>

        <Button
          onClick={handleAddFaq}
          className="bg-[#D19537] hover:bg-[#e59618] text-white flex gap-2"
        >
          <PlusCircle size={18} />
          {editingFaqIndex !== null ? "Update FAQ" : "Add FAQ"}
        </Button>

        <div className="space-y-3">
          {faqs.map((f: any, index: number) => (
            <div
              key={index}
              className="flex justify-between items-start bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-lg border"
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
      </div>

      {/* ================================
         ⭐ TERMS & CONDITIONS
      ================================== */}
      <div className="space-y-2">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Terms & Conditions
        </h4>

        <textarea
          value={terms}
          onChange={(e) => setTerms(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border rounded-lg bg-white dark:bg-[#181818]"
        />
      </div>
    </div>
  );
});

OtherPagesDataSection.displayName = "OtherPagesDataSection";

export default OtherPagesDataSection;

// "use client";

// import { forwardRef, useImperativeHandle, useState } from "react";
// import { FileText } from "lucide-react";

// const OtherPagesDataSection = forwardRef(({ tenant }: any, ref) => {
//   const [about, setAbout] = useState({
//     title: tenant.aboutPage?.title || "",
//     subtitle: tenant.aboutPage?.subtitle || "",
//     mainHeadline: tenant.aboutPage?.mainHeadline || "",
//     description: tenant.aboutPage?.description || "",
//   });

//   const [privacyPolicies, setPrivacyPolicies] = useState(
//     tenant.privacyPolicies || []
//   );

//   const [faqs, setFaqs] = useState(tenant.faqs || []);

//   const [terms, setTerms] = useState(tenant.termsAndConditions || "");

//   useImperativeHandle(ref, () => ({
//     getData: () => ({
//       aboutPage: {
//         title: about.title.trim(),
//         subtitle: about.subtitle.trim(),
//         mainHeadline: about.mainHeadline.trim(),
//         description: about.description.trim(),
//       },
//       privacyPolicies: privacyPolicies.map((p: any) => ({
//         title: p.title.trim(),
//         description: p.description.trim(),
//       })),
//       faqs: faqs.map((f: any) => ({
//         question: f.question.trim(),
//         answer: f.answer.trim(),
//       })),
//       termsAndConditions: terms.trim(),
//     }),
//   }));

//   // Add Privacy Policy
//   const addPrivacy = () =>
//     setPrivacyPolicies([...privacyPolicies, { title: "", description: "" }]);

//   // Add FAQ
//   const addFAQ = () => setFaqs([...faqs, { question: "", answer: "" }]);

//   return (
//     <div className="w-full bg-white dark:bg-[#101010] rounded-2xl border p-6 space-y-6">
//       <div className="flex items-center gap-3">
//         <FileText size={24} className="text-gray-700 dark:text-white" />
//         <h3 className="text-xl font-bold">Other Pages Data</h3>
//       </div>

//       {/* ABOUT PAGE */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <input
//           className="px-4 py-2 border rounded-lg"
//           placeholder="About Title"
//           value={about.title}
//           onChange={(e) => setAbout({ ...about, title: e.target.value })}
//         />
//         <input
//           className="px-4 py-2 border rounded-lg"
//           placeholder="Subtitle"
//           value={about.subtitle}
//           onChange={(e) => setAbout({ ...about, subtitle: e.target.value })}
//         />
//       </div>

//       <input
//         className="px-4 py-2 border rounded-lg w-full"
//         placeholder="Main Headline"
//         value={about.mainHeadline}
//         onChange={(e) => setAbout({ ...about, mainHeadline: e.target.value })}
//       />

//       <textarea
//         className="px-4 py-2 border rounded-lg w-full"
//         placeholder="Description"
//         rows={4}
//         value={about.description}
//         onChange={(e) => setAbout({ ...about, description: e.target.value })}
//       />

//       {/* PRIVACY POLICIES */}
//       <div>
//         <div className="flex justify-between mb-2">
//           <label>Privacy Policies</label>
//           <button
//             onClick={addPrivacy}
//             className="px-3 py-1 bg-blue-600 text-white rounded"
//           >
//             + Add
//           </button>
//         </div>

//         {privacyPolicies.map((p: any, index: number) => (
//           <div
//             key={index}
//             className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2"
//           >
//             <input
//               className="px-3 py-2 border rounded"
//               placeholder="Title"
//               value={p.title}
//               onChange={(e) => {
//                 const updated = [...privacyPolicies];
//                 updated[index].title = e.target.value;
//                 setPrivacyPolicies(updated);
//               }}
//             />
//             <input
//               className="px-3 py-2 border rounded"
//               placeholder="Description"
//               value={p.description}
//               onChange={(e) => {
//                 const updated = [...privacyPolicies];
//                 updated[index].description = e.target.value;
//                 setPrivacyPolicies(updated);
//               }}
//             />
//           </div>
//         ))}
//       </div>

//       {/* FAQ */}
//       <div>
//         <div className="flex justify-between mb-2">
//           <label>FAQs</label>
//           <button
//             onClick={addFAQ}
//             className="px-3 py-1 bg-blue-600 text-white rounded"
//           >
//             + Add
//           </button>
//         </div>

//         {faqs.map((f: any, index: number) => (
//           <div
//             key={index}
//             className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2"
//           >
//             <input
//               className="px-3 py-2 border rounded"
//               placeholder="Question"
//               value={f.question}
//               onChange={(e) => {
//                 const updated = [...faqs];
//                 updated[index].question = e.target.value;
//                 setFaqs(updated);
//               }}
//             />

//             <input
//               className="px-3 py-2 border rounded"
//               placeholder="Answer"
//               value={f.answer}
//               onChange={(e) => {
//                 const updated = [...faqs];
//                 updated[index].answer = e.target.value;
//                 setFaqs(updated);
//               }}
//             />
//           </div>
//         ))}
//       </div>

//       {/* TERMS */}
//       <textarea
//         className="px-4 py-2 border rounded-lg w-full"
//         placeholder="Terms & Conditions"
//         rows={4}
//         value={terms}
//         onChange={(e) => setTerms(e.target.value)}
//       />
//     </div>
//   );
// });

// export default OtherPagesDataSection;
