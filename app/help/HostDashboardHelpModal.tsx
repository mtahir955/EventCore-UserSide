"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

export default function HostDashboardHelpModal({
  open,
  onClose,
}: HelpModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl w-[90%] max-w-lg p-6 shadow-xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-800 dark:hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4">Tenant Dashboard Help</h2>

        {/* Help Content */}
        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <li>• Update your profile & contact details from the Edit button.</li>
          <li>
            • Keep tenant information accurate for payouts & verification.
          </li>
          <li>• Configure social links to improve brand visibility.</li>
          <li>• Review account settings before publishing events.</li>
          <li>• Contact support if any data appears incorrect.</li>
        </ul>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <Button
            onClick={onClose}
            className="bg-[#D19537] hover:bg-[#e59618] text-white px-6 py-3 rounded-lg"
          >
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
}
