"use client";

/**
 * ============================================================================
 * TENANT PROVIDER WRAPPER
 * ============================================================================
 * 
 * Client-side wrapper for TenantProvider.
 * Required because layout.tsx is a Server Component.
 * 
 * ============================================================================
 */

import { TenantProvider } from "@/context/TenantContext";
import React from "react";

export default function TenantProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TenantProvider>{children}</TenantProvider>;
}

