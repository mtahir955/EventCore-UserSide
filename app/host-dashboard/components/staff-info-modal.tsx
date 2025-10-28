"use client"

import { useState } from "react"
import { EditStaffModal } from "./edit-staff-modal"

interface StaffMember {
  fullName: string
  email: string
  phoneNumber: string
  role: string
}

interface StaffInfoModalProps {
  isOpen: boolean
  onClose: () => void
  staff: StaffMember[]
}

export function StaffInfoModal({ isOpen, onClose, staff }: StaffInfoModalProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 grid place-items-center bg-black/40">
        <div
          className="relative rounded-2xl shadow-2xl bg-[#FBFBF9] w-[300px] h-[550px] sm:w-[400px]"
          // style={{
          //   width: 420,
          //   height: 509,
          //   background: "#FBFBF9",
          // }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <h2 className="text-[20px] font-bold">Staff Information</h2>
            <button onClick={onClose} aria-label="Close" className="h-6 w-6 grid place-items-center">
              <img src="/images/icons/close-button.png" alt="" className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6 space-y-6" style={{ maxHeight: 380 }}>
            {staff.map((person, idx) => (
              <div key={idx}>
                <h3 className="text-[16px] font-bold mb-3">Person {idx + 1}</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-[120px_1fr] gap-4 text-[14px]">
                    <span className="text-[#666666]">Full Name</span>
                    <span className="font-medium">{person.fullName}</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-4 text-[14px]">
                    <span className="text-[#666666]">Email</span>
                    <span className="font-medium">{person.email}</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-4 text-[14px]">
                    <span className="text-[#666666]">Phone Number</span>
                    <span className="font-medium">{person.phoneNumber}</span>
                  </div>
                  <div className="grid grid-cols-[120px_1fr] gap-4 text-[14px]">
                    <span className="text-[#666666]">Role</span>
                    <span className="font-medium">{person.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer buttons */}
          <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-lg text-[14px] font-semibold"
              style={{ background: "#F5EDE5", color: "#D19537" }}
            >
              Go Back
            </button>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex-1 py-3 rounded-lg text-[14px] font-semibold text-white"
              style={{ background: "#D19537" }}
            >
              Edit Staff
            </button>
          </div>
        </div>
      </div>

      <EditStaffModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(updatedStaff) => {
          console.log("[v0] Updated staff:", updatedStaff)
        }}
      />
    </>
  )
}
