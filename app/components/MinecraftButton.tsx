import { useRef, useCallback, type ReactNode } from "react";
import { animate } from "animejs";

interface MinecraftButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "accent";
  className?: string;
}

export function MinecraftButton({
  children,
  onClick,
  variant = "primary",
  className = "",
}: MinecraftButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleHover = useCallback(() => {
    if (!ref.current) return;
    animate(ref.current, {
      scale: [1, 1.05, 1.02],
      duration: 200,
      ease: "outQuad",
    });
  }, []);

  const handleLeave = useCallback(() => {
    if (!ref.current) return;
    animate(ref.current, {
      scale: 1,
      duration: 150,
      ease: "inQuad",
    });
  }, []);

  const handleClick = useCallback(() => {
    if (!ref.current) return;
    animate(ref.current, {
      scale: [1, 0.95, 1.02, 1],
      duration: 300,
      ease: "outElastic(1, .6)",
    });
    onClick?.();
  }, [onClick]);

  const variants = {
    primary:
      "bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white",
    secondary:
      "bg-[var(--color-surface)] hover:bg-[var(--color-surface-light)] text-[var(--color-text)] border border-[var(--color-primary-dark)]",
    accent:
      "bg-[var(--color-accent)] hover:bg-[var(--color-accent-bright)] text-[var(--color-bg)]",
  };

  return (
    <button
      ref={ref}
      onClick={handleClick}
      onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
      className={`mc-btn px-6 py-3 rounded-lg font-pixel text-sm transition-colors duration-200 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
