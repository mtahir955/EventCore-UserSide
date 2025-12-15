"use client";

import { useMemo, useState } from "react";
import { X, Trash2 } from "lucide-react";

interface UploadReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;

  refundRequestId: string;
  buyerEmail: string;

  onDone: (data: {
    refundRequestId: string;
    buyerEmail: string;
    message: string;
    receiptFileName?: string;
  }) => void;
}

export function UploadReceiptModal({
  isOpen,
  onClose,
  refundRequestId,
  buyerEmail,
  onDone,
}: UploadReceiptModalProps) {
  const [message, setMessage] = useState(
    ""
  );
  const [file, setFile] = useState<File | null>(null);

  const previewUrl = useMemo(() => {
    if (!file) return "";
    return URL.createObjectURL(file);
  }, [file]);

  if (!isOpen) return null;

  const handleDone = () => {
    if (!refundRequestId || !buyerEmail) return;
    if (!file) return;
    if (!message.trim()) return;

    onDone({
      refundRequestId,
      buyerEmail,
      message: message.trim(),
      receiptFileName: file.name,
    });

    setFile(null);
  };

  const handleRemoveImage = () => {
    setFile(null);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-3 sm:px-4">
      {/* Modal Container */}
      <div
        className="
          relative w-full max-w-[640px]
          max-h-[90vh]
          rounded-2xl bg-white dark:bg-[#101010]
          shadow-2xl border border-border dark:border-gray-800
          flex flex-col
        "
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b dark:border-gray-800">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground">
              Upload Payment Receipt
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Upload proof and notify the buyer via email.
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close"
            className="hover:opacity-70"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Upload Area */}
          <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700 p-4">
            <label className="text-sm font-medium text-foreground">
              Receipt Image
            </label>

            {!file && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="mt-2 block w-full text-sm"
              />
            )}

            {file ? (
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="truncate">{file.name}</span>

                  <button
                    onClick={handleRemoveImage}
                    className="flex items-center gap-1 text-red-600 hover:underline"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>

                {/* Image Preview */}
                <div className="relative rounded-lg border border-border dark:border-gray-800 bg-gray-50 dark:bg-[#0b0b0b] h-[180px] sm:h-[220px] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Receipt preview"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            ) : (
              <p className="mt-2 text-xs text-muted-foreground">
                Upload a clear image showing transaction details.
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="text-sm font-medium text-foreground">
              Message to Buyer (Email)
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 w-full rounded-lg border px-3 py-2 text-sm dark:bg-[#101010] dark:border-gray-800"
              placeholder="Write a confirmation message..."
            />
          </div>

          {/* Warning Note */}
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 px-3 py-2 text-[12px] text-red-700 dark:text-red-300">
            <span className="font-semibold">Note:</span> This receipt and
            message will be sent to{" "}
            <span className="font-medium">{buyerEmail}</span>. 
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t dark:border-gray-800 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border text-sm dark:border-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            disabled={!file}
            className="px-4 py-2 rounded-lg text-sm text-white disabled:opacity-50"
            style={{ backgroundColor: "#D19537" }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
