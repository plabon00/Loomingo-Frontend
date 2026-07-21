import { Send, MessageCircle, MousePointerClick } from "lucide-react";

const stats = [
  {
    label: "DMs sent",
    period: "7d",
    value: "1,248",
    delta: "+12%",
    trend: "up" as const,
    icon: Send,
  },
  {
    label: "Comments replied",
    period: "7d",
    value: "892",
    delta: "+8%",
    trend: "up" as const,
    icon: MessageCircle,
  },
  {
    label: "Link clicks",
    period: "7d",
    value: "435",
    delta: "-3%",
    trend: "down" as const,
    icon: MousePointerClick,
  },
];

export default function MiniAnalytics() {
  return (
    <div
      data-stagger
      className="font-apple w-full grid grid-cols-3 divide-x divide-[var(--apple-hairline)]"
    >
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className={`flex flex-col ${i === 0 ? "pr-4 md:pr-6" : "px-4 md:px-6"}`}
        >
          <div className="flex items-center gap-2">
            <stat.icon className="size-3.5 shrink-0 text-[var(--apple-gray-2)]" aria-hidden="true" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--apple-gray-2)] leading-tight truncate">
              {stat.label}
            </span>
          </div>

          <span className="apple-display text-[28px] md:text-[40px] tabular-nums mt-4">
            {stat.value}
          </span>

          <div className="mt-2 flex items-center gap-1.5">
            <span
              className={`inline-flex items-center gap-1 text-[12px] font-semibold tabular-nums ${
                stat.trend === "up" ? "text-emerald-600" : "text-[var(--apple-gray-2)]"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  stat.trend === "up" ? "bg-emerald-500" : "bg-[var(--apple-gray-2)]"
                }`}
              />
              {stat.delta}
            </span>
            <span className="hidden md:inline text-[12px] font-medium text-[var(--apple-gray-2)]">
              vs last {stat.period}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
