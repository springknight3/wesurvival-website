interface PlatformBadgeProps {
  platform: "java" | "bedrock" | "switch" | "playstation" | "xbox" | "windows" | "pc";
  className?: string;
}

const platformConfig = {
  java: { label: "Java Edition", color: "bg-[var(--color-dirt)]" },
  bedrock: { label: "Bedrock Edition", color: "bg-[var(--color-primary)]" },
  switch: { label: "Nintendo Switch", color: "bg-[var(--color-redstone)]" },
  playstation: { label: "PlayStation 5", color: "bg-blue-600" },
  xbox: { label: "Xbox", color: "bg-green-600" },
  windows: { label: "Minecraft for Windows", color: "bg-[var(--color-diamond)]" },
  pc: { label: "PC", color: "bg-[var(--color-gold)]" },
} as const;

export function PlatformBadge({ platform, className = "" }: PlatformBadgeProps) {
  const config = platformConfig[platform];

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${config.color} ${className}`}
    >
      {config.label}
    </span>
  );
}
