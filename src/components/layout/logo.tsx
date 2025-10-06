import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={cn("text-primary", className)}
      viewBox="0 0 140 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
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
        className="sankat-mochan-flag"
        strokeWidth="2"
      />
    </svg>
  );
}
