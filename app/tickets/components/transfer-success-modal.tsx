"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // ✅ import this

type TransferSuccessModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TransferSuccessModal({
  open,
  onOpenChange,
}: TransferSuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90vw] sm:w-[420px] max-w-[450px] h-auto sm:h-[360px] p-6 sm:p-8 border-0 rounded-[20px] shadow-lg text-center">
        {/* ✅ Hidden title for accessibility (prevents Radix error) */}
        <VisuallyHidden>
          <DialogTitle>Ticket Transfer Success</DialogTitle>
        </VisuallyHidden>

        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4"
          aria-label="Close success modal"
        >
          <Image
            src="/images/close-icon.png"
            alt="Close"
            width={22}
            height={22}
          />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center justify-center space-y-5">
          <Image
            src="/images/success-ticket-icon.png"
            alt=""
            aria-hidden
            width={72}
            height={72}
            className="rounded-full sm:w-[96px] sm:h-[96px]"
          />

          <h2 className="text-[18px] sm:text-[22px] font-bold text-black">
            Ticket Transferred Successfully!
          </h2>
          <p className="text-[13px] sm:text-[14px] leading-relaxed max-w-[320px] text-gray-600">
            Your ticket has been sent to the recipient’s email. They can now
            access and use it for the event.
          </p>

          <button
            onClick={() => onOpenChange(false)}
            className="mt-3 h-10 sm:h-12 w-full rounded-full text-[14px] sm:text-[16px] font-semibold text-white"
            style={{ backgroundColor: "#0077F7" }}
          >
            Done
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
