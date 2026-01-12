import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
import ThemeInitializer from "@/components/ThemeInitializer";
import GoogleProviderWrapper from "@/components/GoogleProviderWrapper";
import TenantProviderWrapper from "@/components/TenantProviderWrapper";

// ✅ Load local font
const feelingPassionate = localFont({
  src: "/fonts/FeelingPassionate-Regular.otf",
  variable: "--font-feeling-passionate",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Event Core - Good Life Trainings",
  description: "Discover and attend amazing events",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"></script>
      </head>

      <body
        suppressHydrationWarning
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${feelingPassionate.variable} antialiased`}
      >
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

        <TenantProviderWrapper>
          <GoogleProviderWrapper>
            <ThemeProvider
              attribute="class"
              defaultTheme="class"
              enableSystem={false}
              storageKey="theme"
            >
              <ThemeInitializer />

              <Suspense fallback={<div>Loading...</div>}>
                {children}
                <Analytics />
                <Toaster position="bottom-right" reverseOrder={false} />
              </Suspense>
            </ThemeProvider>
          </GoogleProviderWrapper>
        </TenantProviderWrapper>
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
// import { Toaster } from "react-hot-toast";
// import ThemeInitializer from "@/components/ThemeInitializer";

// // ⭐ IMPORT NEW CLIENT WRAPPER
// import GoogleProviderWrapper from "@/components/GoogleProviderWrapper";

// export const metadata: Metadata = {
//   title: "Event Core - Good Life Trainings",
//   description: "Discover and attend amazing events",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <head>
//         {/* Apple Login SDK */}
//         <script src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"></script>
//       </head>

//       <body
//         suppressHydrationWarning
//         className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}
//       >
//         {/* Theme before hydration */}
//         <script
//           dangerouslySetInnerHTML={{
//             __html: `
//               (function() {
//                 try {
//                   const savedTheme = localStorage.getItem('adminTheme');
//                   if (savedTheme === 'dark') {
//                     document.documentElement.classList.add('dark');
//                   } else if (savedTheme === 'light') {
//                     document.documentElement.classList.remove('dark');
//                   }
//                 } catch (e) {}
//               })();
//             `,
//           }}
//         />

//         {/* ⭐ Wrap entire app in GoogleOAuthProvider INSIDE CLIENT COMPONENT */}
//         <GoogleProviderWrapper>
//           <ThemeProvider
//             attribute="class"
//             defaultTheme="class"
//             enableSystem={false}
//             storageKey="theme"
//           >
//             <ThemeInitializer />

//             <Suspense fallback={<div>Loading...</div>}>
//               {children}
//               <Analytics />
//               <Toaster position="bottom-right" reverseOrder={false} />
//             </Suspense>
//           </ThemeProvider>
//         </GoogleProviderWrapper>
//       </body>
//     </html>
//   );
// }

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
