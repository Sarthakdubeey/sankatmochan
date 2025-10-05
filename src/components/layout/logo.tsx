import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={cn("text-primary", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 22V4"
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="1.5"
      />
      <path
        d="M4 4H18C18.5523 4 19 4.44772 19 5V13C19 13.5523 18.5523 14 18 14H4"
        fill="hsl(var(--accent))"
        stroke="hsl(var(--accent))"
        strokeWidth="1.5"
      />
    </svg>
  );
}
