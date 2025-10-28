import Image from "next/image";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: string;
  value: string;
  label: string;
  bgColor: string;
}

export function StatCard({ icon, value, label, bgColor }: StatCardProps) {
  return (
    <div className="bg-background rounded-xl p-6 flex items-center gap-4 shadow-sm">
      <div
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center",
          bgColor
        )}
      >
        <Image
          src={icon || "/placeholder.svg"}
          alt={label}
          width={28}
          height={28}
        />
      </div>
      <div>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
