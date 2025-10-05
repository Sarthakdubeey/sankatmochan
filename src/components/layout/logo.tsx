import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={cn("text-primary", className)}
      viewBox="0 0 140 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Text behind the flag */}
      <text
        x="68"
        y="85"
        fontFamily="'PT Sans', sans-serif"
        fontSize="18"
        fontWeight="bold"
        fill="hsl(var(--sidebar-foreground))"
        textAnchor="middle"
        className="opacity-50"
      >
        Sankat Mochan
      </text>

      {/* Flag pole */}
      <path
        d="M20 90V10"
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* Orange Flag */}
      <path
        d="M22 15 H 120 V 65 H 22 Z"
        fill="hsl(var(--accent))"
        stroke="hsl(var(--accent))"
        strokeWidth="2"
      />
    </svg>
  );
}
