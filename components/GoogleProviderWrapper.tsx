"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

export default function GoogleProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const clientId = "508361169246-npl3l51aefeq83m2iiraesms4nk5k5lo.apps.googleusercontent.com";

  if (!clientId) {
    console.error("❌ NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing");
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
  );
}
