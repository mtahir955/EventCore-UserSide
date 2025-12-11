"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";

export default function GoogleProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId="508361169246-npl3l51aefeq83m2iiraesms4nk5k5lo.apps.googleusercontent.com">
      {children}
    </GoogleOAuthProvider>
  );
}
