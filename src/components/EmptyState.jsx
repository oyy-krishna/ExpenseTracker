import { cn } from "@/lib/utils";

export default function EmptyState({ emoji = "🌸", title, description, children, className }) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-12 text-center", className)}>
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-pink-100 to-violet-100 text-3xl dark:from-pink-500/15 dark:to-violet-500/15">
        {emoji}
      </div>
      <h3 className="text-base font-bold">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {children && <div className="mt-5 flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  );
}
