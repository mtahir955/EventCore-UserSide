"use client";

import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function AuthRequiredModal({
  open,
  onOpenChange,
  title = "Login Required",
  message = "You need to log in or create an account to purchase tickets.",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  message?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          {message}
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link href="/sign-up" className="w-full">
            <Button
              variant="outline"
              className="w-full rounded-full border-[#0077F7] text-[#0077F7] hover:bg-[#eef6ff]"
              onClick={() => onOpenChange(false)}
            >
              Sign Up
            </Button>
          </Link>

          <Link href="/login" className="w-full">
            <Button
              className="w-full rounded-full bg-[#0077F7] hover:bg-[#0066D6] text-white"
              onClick={() => onOpenChange(false)}
            >
              Login
            </Button>
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
