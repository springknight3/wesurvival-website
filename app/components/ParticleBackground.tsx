import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
}

const BLOCK_COLORS = [
  "#2d6a4f", // grass green
  "#8B6914", // dirt
  "#4aedd9", // diamond
  "#fcdb05", // gold
  "#ff3333", // redstone
  "#555555", // stone
  "#1b4332", // dark green
];

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      size: Math.random() * 8 + 4,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: -(Math.random() * 0.8 + 0.2),
      color: BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.4 + 0.1,
    });

    const init = () => {
      resize();
      particles = Array.from({ length: 30 }, createParticle);
    };

    const drawBlock = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;

      // Minecraft-style pixel block
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);

      // Inner highlight
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 3);

      // Inner shadow
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(-p.size / 2, p.size / 6, p.size, p.size / 3);

      ctx.restore();
    };

    const animate_loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Gentle wave motion
        p.x += Math.sin(p.y * 0.01) * 0.3;

        if (p.y < -20) {
          Object.assign(p, createParticle());
        }

        drawBlock(p);
      }

      animationId = requestAnimationFrame(animate_loop);
    };

    init();
    animate_loop();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
