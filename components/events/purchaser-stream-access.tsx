"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchBuyerVirtualAccess } from "@/lib/event-access";

type PurchaserStreamAccessProps = {
  eventId?: string;
  title?: string;
  streamUrl?: string;
  attendanceMode?: string;
  opensAtLabel?: string;
};

export function PurchaserStreamAccess({
  eventId,
  title = "Virtual access",
  streamUrl,
  attendanceMode,
  opensAtLabel,
}: PurchaserStreamAccessProps) {
  const [resolvedStreamUrl, setResolvedStreamUrl] = useState(streamUrl || "");
  const [resolvedAttendanceMode, setResolvedAttendanceMode] = useState(
    attendanceMode || ""
  );

  useEffect(() => {
    setResolvedStreamUrl(streamUrl || "");
  }, [streamUrl]);

  useEffect(() => {
    setResolvedAttendanceMode(attendanceMode || "");
  }, [attendanceMode]);

  useEffect(() => {
    let cancelled = false;

    const loadVirtualAccess = async () => {
      if (!eventId || streamUrl || attendanceMode === "in-person") return;

      try {
        const access = await fetchBuyerVirtualAccess(eventId);

        if (!cancelled) {
          setResolvedStreamUrl(access?.streamUrl || "");
          if (access?.attendanceMode) {
            setResolvedAttendanceMode(access.attendanceMode);
          }
        }
      } catch {
        if (!cancelled) {
          setResolvedStreamUrl("");
        }
      }
    };

    loadVirtualAccess();

    return () => {
      cancelled = true;
    };
  }, [attendanceMode, eventId, streamUrl]);

  const effectiveAttendanceMode = resolvedAttendanceMode || attendanceMode || "";
  const effectiveStreamUrl = resolvedStreamUrl || streamUrl || "";

  if (effectiveAttendanceMode === "in-person") return null;
  if (!effectiveStreamUrl) return null;

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-blue-900 dark:text-blue-100">
            <PlayCircle className="h-4 w-4" />
            {title}
          </p>
          <p className="mt-1 text-sm text-blue-800 dark:text-blue-200">
            This watch link is only shown inside your purchaser area.
            {effectiveAttendanceMode ? ` Access type: ${effectiveAttendanceMode}.` : ""}
            {opensAtLabel ? ` Opens ${opensAtLabel}.` : ""}
          </p>
        </div>

        <Button asChild className="bg-[#0077F7] text-white hover:bg-[#0066D6]">
          <Link href={effectiveStreamUrl} target="_blank" rel="noreferrer">
            Open Link
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
