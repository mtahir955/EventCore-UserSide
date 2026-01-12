"use client";

import { useEffect, useState } from "react";
// import axios from "axios";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
// import { API_BASE_URL } from "@/config/apiConfig";
// import { HOST_Tenant_ID } from "@/config/hostTenantId";
import { apiClient } from "@/lib/apiClient";

export default function TermsOfService() {
  const [terms, setTerms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        // const res = await axios.get(`${API_BASE_URL}/tenants/public/about`, {
        //   headers: { "X-Tenant-ID": HOST_Tenant_ID },
        // });
        const res = await apiClient.get("/tenants/public/about");

        const data = res?.data?.data?.termsAndConditions || [];
        setTerms(data);
      } catch (error) {
        console.error("Failed to load Terms & Conditions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#101010] transition-colors duration-300">
      <Header />

      <main className="flex-1">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 md:px-12 lg:px-24 py-10 sm:py-14 md:py-16">
          <div className="max-w-7xl mx-auto text-left text-black dark:text-gray-100">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-[40px] font-bold mb-2 leading-tight">
              Terms of{" "}
              <span className="text-[#89FC00] font-passionate font-serif">
                Service
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-8 ml-1">
              Last Updated: {new Date().toLocaleDateString()}
            </p>

            {/* Intro */}
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-8 text-sm sm:text-base">
              Welcome, By accessing or using our application, or services, you
              agree to comply with the following Terms of Service.
            </p>

            {/* ==============================
                DYNAMIC TERMS FROM API
            =============================== */}
            <h2 className="text-2xl font-bold mb-4 mt-10">
              Terms & Conditions
            </h2>

            {loading ? (
              <p className="text-gray-500 dark:text-gray-400">
                Loading terms...
              </p>
            ) : terms.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                No Terms & Conditions defined by tenant.
              </p>
            ) : (
              <div className="space-y-8">
                {terms.map((item, index) => (
                  <Section
                    key={index}
                    number={`${index + 1}.`}
                    title={item.title}
                    content={[item.description]}
                  />
                ))}
              </div>
            )}

            {/* Contact Section */}
            <div className="mb-10 sm:mb-12 mt-12">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 leading-tight">
                Contact Us
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm sm:text-base">
                For any questions about these Terms of Service, please contact
                us:
              </p>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">📧</span>
                  <span>Email: support@eventcore.com</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">📍</span>
                  <span>123 Event Street, Cityville</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* Section Component */
function Section({
  number,
  title,
  content,
  listItems,
  intro,
}: {
  number: string;
  title: string;
  content?: string[];
  listItems?: string[];
  intro?: string;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 leading-tight text-black dark:text-white">
        {number} {title}
      </h2>

      {intro && (
        <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base mb-3">
          {intro}
        </p>
      )}

      {content?.map((paragraph, idx) => (
        <p
          key={idx}
          className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed mb-4 last:mb-0"
        >
          {paragraph}
        </p>
      ))}

      {listItems && (
        <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
          {listItems.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
