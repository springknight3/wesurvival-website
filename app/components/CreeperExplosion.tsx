import { useEffect, useState, useCallback } from "react";
import { animate } from "animejs";

export function CreeperExplosion() {
  const [active, setActive] = useState(false);
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; color: string; size: number }>
  >([]);

  const explode = useCallback(() => {
    setActive(true);

    // Generate explosion particles
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      color: ["#2d6a4f", "#8B6914", "#ff3333", "#fcdb05", "#4aedd9"][
        Math.floor(Math.random() * 5)
      ],
      size: Math.random() * 12 + 4,
    }));
    setParticles(newParticles);

    // Screen shake
    document.body.classList.add("screen-shake");
    setTimeout(() => document.body.classList.remove("screen-shake"), 500);

    // Animate each particle
    requestAnimationFrame(() => {
      newParticles.forEach((p, i) => {
        const el = document.getElementById(`creeper-particle-${i}`);
        if (el) {
          const angle = (Math.PI * 2 * i) / newParticles.length;
          const distance = Math.random() * 300 + 100;
          animate(el, {
            translateX: [0, Math.cos(angle) * distance],
            translateY: [0, Math.sin(angle) * distance - 100],
            scale: [1, 0],
            opacity: [1, 0],
            duration: 1000 + Math.random() * 500,
            ease: "outQuad",
          });
        }
      });
    });

    // Clear after animation
    setTimeout(() => {
      setActive(false);
      setParticles([]);
    }, 2000);
  }, []);

  useEffect(() => {
    const handler = () => explode();
    window.addEventListener("creeper-explode", handler);
    return () => window.removeEventListener("creeper-explode", handler);
  }, [explode]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Flash overlay */}
      <div
        className="absolute inset-0 bg-[var(--color-redstone)]"
        style={{
          animation: "confetti-fall 0.5s ease forwards",
          opacity: 0.3,
        }}
      />

      {/* Creeper face */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-[120px] font-pixel text-[var(--color-primary)] opacity-80 animate-pulse">
          💥
        </div>
      </div>

      {/* Explosion particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          id={`creeper-particle-${p.id}`}
          className="absolute"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
        />
      ))}

      {/* "BOOM" text */}
      <div className="absolute inset-0 flex items-center justify-center mt-32">
        <span
          className="font-pixel text-5xl text-[var(--color-gold)] drop-shadow-lg"
          style={{
            textShadow: "0 0 20px rgba(252, 219, 5, 0.5)",
          }}
        >
          BOOM!
        </span>
      </div>
    </div>
  );
}
