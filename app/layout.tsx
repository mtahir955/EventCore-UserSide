import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
import ThemeInitializer from "@/components/ThemeInitializer";

export const metadata: Metadata = {
  title: "Event Core - Good Life Trainings",
  description: "Discover and attend amazing events",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        {/* 🔥 Apply theme BEFORE React loads (no flash) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('adminTheme');
                  if (savedTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else if (savedTheme === 'light') {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />

        <ThemeProvider
          attribute="class"
          defaultTheme="class" // 🔥 Prevents forced light mode
          enableSystem={false}
          storageKey="theme"
        >
          {/* 🔥 Ensures hydration theme matches DOM */}
          <ThemeInitializer />

          <Suspense fallback={<div>Loading...</div>}>
            {children}
            <Analytics />

            {/* Toast container */}
            <Toaster position="bottom-right" reverseOrder={false} />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}

// import type React from "react";
// import type { Metadata } from "next";
// import { GeistSans } from "geist/font/sans";
// import { GeistMono } from "geist/font/mono";
// import { Analytics } from "@vercel/analytics/next";
// import { Suspense } from "react";
// import "./globals.css";
// import { ThemeProvider } from "@/components/theme-provider";
// import { Toaster } from "react-hot-toast"; // ✅ Added Toast import
// import ThemeInitializer from "@/components/ThemeInitializer";

// export const metadata: Metadata = {
//   title: "Event Core - Good Life Trainings",
//   description: "Discover and attend amazing events",
//   generator: "v0.app",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body
//         className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
//       >
//         <ThemeProvider
//           attribute="class"
//           defaultTheme="light"
//           enableSystem={false}
//           storageKey="theme"
//         >
//           <Suspense fallback={<div>Loading...</div>}>
//             {children}
//             <Analytics />
//             {/* ✅ Toast container at bottom-right */}
//             <Toaster position="bottom-right" reverseOrder={false} />
//           </Suspense>
//           <ThemeInitializer />
//         </ThemeProvider>
//       </body>
//     </html>
//   );
// }
