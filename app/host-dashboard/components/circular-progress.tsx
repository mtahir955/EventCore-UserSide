"use client"

type Props = {
  value: number
  max: number
  color: string
}

export function CircularProgress({ value, max, color }: Props) {
  const percentage = (value / max) * 100
  const circumference = 2 * Math.PI * 45 // radius = 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="100" height="100" className="transform -rotate-90">
        {/* Background circle */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="#F5EDE5" strokeWidth="8" />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[20px] font-semibold" style={{ color }}>
          {String(value).padStart(3, "0")}
        </span>
      </div>
    </div>
  )
}
