import { useEffect, useRef, useCallback } from "react";
import {
  People24Filled,
  Shield24Filled,
  Money24Filled,
  Lightbulb24Filled,
  Warning24Filled,
} from "@fluentui/react-icons";
import { animate } from "animejs";
import type { Route } from "./+types/about";
import { incrementP2WClicks } from "~/lib/easter-eggs";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About — WeSurvival" },
    {
      name: "description",
      content:
        "Learn about WeSurvival's mission, values, and community guidelines. A fair, no-pay-to-win Minecraft server.",
    },
  ];
}

const CARD_EFFECTS = ["wave", "shield", "confetti", "glow"] as const;

const values = [
  {
    icon: <People24Filled className="text-2xl" />,
    title: "Community",
    description:
      "Every player matters. We foster a welcoming environment where friendships are built and everyone has a voice.",
    effect: CARD_EFFECTS[0],
  },
  {
    icon: <Shield24Filled className="text-2xl" />,
    title: "Fair Play",
    description:
      "Rules apply to everyone equally. No exploits, no griefing, no exceptions.",
    effect: CARD_EFFECTS[1],
  },
  {
    icon: <Money24Filled className="text-2xl" />,
    title: "No Pay-to-Win",
    description:
      "Your wallet doesn't define your progress. Skill, creativity, and dedication do.",
    effect: CARD_EFFECTS[2],
  },
  {
    icon: <Lightbulb24Filled className="text-2xl" />,
    title: "Creativity",
    description:
      "Build, design, and express yourself. Our events and world give you the canvas.",
    effect: CARD_EFFECTS[3],
  },
];

const rules = [
  "Be respectful to all players",
  "No griefing or stealing",
  "No hacking, cheating, or exploits",
  "No advertising other servers",
  "Keep chat clean and friendly",
  "Follow staff instructions",
  "Have fun!",
];

function spawnConfetti(cx: number, cy: number) {
  const colors = ["#2d6a4f", "#4aedd9", "#fcdb05", "#ff3333", "#95d5b2", "#8B6914", "#d8f3dc"];
  const pieceCount = 12 + Math.floor(Math.random() * 8);

  for (let i = 0; i < pieceCount; i++) {
    const piece = document.createElement("div");
    const size = Math.random() * 8 + 4;
    const angle = (Math.PI * 2 * i) / pieceCount + (Math.random() - 0.5) * 0.5;
    const distance = 100 + Math.random() * 180;
    piece.style.cssText = `
      position: fixed;
      left: ${cx}px;
      top: ${cy}px;
      width: ${size}px;
      height: ${size * (0.4 + Math.random() * 0.6)}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      z-index: 100;
      pointer-events: none;
      transform-style: preserve-3d;
    `;
    document.body.appendChild(piece);

    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    animate(piece, {
      translateX: [0, dx],
      translateY: [0, dy],
      rotateX: [0, 360 + Math.random() * 360],
      rotateY: [0, 360 + Math.random() * 360],
      rotateZ: [0, (Math.random() - 0.5) * 720],
      scale: [0.2, 1.4, 1],
      duration: 1400 + Math.random() * 600,
      ease: "outQuad",
    });

      setTimeout(() => {
        animate(piece, {
          translateY: [dy, dy + window.innerHeight * 3.5],
          rotateX: ["+2880"],
          rotateY: ["+2880"],
          rotateZ: ["+4320"],
          opacity: [1, 0],
          duration: 9500,
          ease: "inQuad",
        });
        setTimeout(() => piece.remove(), 5000);
      }, 1400);
  }
}

export default function About() {
  const valuesRef = useRef<HTMLDivElement>(null);
  const rulesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll("[data-reveal]");
            animate(items, {
              opacity: [0, 1],
              translateY: [30, 0],
              duration: 600,
              delay: (_el, i) => (i ?? 0) * 100,
              ease: "outQuad",
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (valuesRef.current) observer.observe(valuesRef.current);
    if (rulesRef.current) observer.observe(rulesRef.current);

    return () => observer.disconnect();
  }, []);

  const handleCardClick = useCallback(
    (effect: string, e: React.MouseEvent<HTMLDivElement>) => {
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      switch (effect) {
        case "wave": {
          const cards = valuesRef.current?.querySelectorAll("[data-card]");
          if (cards) {
            animate(cards, {
              rotate: [0, -18, 18, -12, 12, -5, 5, 0],
              translateY: [0, -6, 6, -3, 3, 0],
              duration: 800,
              delay: (_el, i) => (i ?? 0) * 70,
              ease: "outBack(1.5)",
            });
          }
          break;
        }
        case "shield": {
          const icon = card.querySelector("[data-icon]");
          if (icon) {
            animate(icon, {
              rotateY: [0, 360],
              scale: [1, 1.3, 1],
              duration: 600,
              ease: "outBack(1.4)",
            });
          }
          animate(card, {
            boxShadow: [
              "0 0 0 0px rgba(45, 106, 79, 0)",
              "0 0 0 6px rgba(45, 106, 79, 0.5)",
              "0 0 0 0px rgba(45, 106, 79, 0)",
            ],
            duration: 700,
            ease: "outQuad",
          });
          break;
        }
        case "confetti": {
          const clicks = incrementP2WClicks();
          if (clicks >= 3) {
            for (let b = 0; b < 6; b++) {
              setTimeout(() => {
                const bx = Math.random() * window.innerWidth * 0.8 + window.innerWidth * 0.1;
                const by = Math.random() * window.innerHeight * 0.6 + window.innerHeight * 0.1;
                spawnConfetti(bx, by);
              }, b * 150);
            }
          } else {
            animate(card, {
              scale: [1, 0.95, 1.05, 1],
              duration: 300,
              ease: "outQuad",
            });
          }
          break;
        }
        case "glow": {
          const icon = card.querySelector("[data-icon]") as HTMLElement | null;
          if (icon) {
            animate(icon, {
              scale: [1, 1.4, 1],
              rotate: [0, 10, -10, 0],
              duration: 800,
              ease: "inOutBack",
            });
            // Pulsing lightbulb glow
            icon.style.filter = "drop-shadow(0 0 0px rgba(74, 237, 217, 0))";
            animate(icon, {
              filter: [
                "drop-shadow(0 0 0px rgba(74, 237, 217, 0))",
                "drop-shadow(0 0 20px rgba(74, 237, 217, 0.9)) drop-shadow(0 0 40px rgba(74, 237, 217, 0.5))",
                "drop-shadow(0 0 8px rgba(74, 237, 217, 0.4))",
                "drop-shadow(0 0 16px rgba(74, 237, 217, 0.7)) drop-shadow(0 0 30px rgba(74, 237, 217, 0.3))",
                "drop-shadow(0 0 0px rgba(74, 237, 217, 0))",
              ],
              duration: 1200,
              ease: "inOutSine",
            });
            setTimeout(() => {
              icon.style.filter = "";
            }, 1300);
          }
          break;
        }
      }
    },
    []
  );

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-pixel text-4xl md:text-5xl text-[var(--color-accent)] mb-4">
            About WeSurvival
          </h1>
          <p className="text-[var(--color-text-muted)] text-lg max-w-2xl mx-auto leading-relaxed">
            WeSurvival is a friendly Minecraft server that puts community first
            and keeps gameplay fair. We support both Java and Bedrock editions,
            including offline (cracked) accounts — because everyone deserves a
            place to play.
          </p>
        </div>

        {/* Values */}
        <section className="mb-20">
          <h2 className="font-pixel text-2xl text-center text-[var(--color-accent)] mb-10">
            Our Values
          </h2>
          <div ref={valuesRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                data-reveal
                data-card
                onClick={(e) => handleCardClick(value.effect, e)}
                className="bg-[var(--color-surface)] border border-[var(--color-primary-dark)] rounded-xl p-8 transition-all duration-300 hover:border-[var(--color-primary)] hover:shadow-lg hover:shadow-[var(--color-primary)]/10 opacity-0 cursor-pointer select-none"
              >
                <div data-icon className="text-[var(--color-accent)] mb-4 inline-block">
                  {value.icon}
                </div>
                <h3 className="font-pixel text-lg text-[var(--color-text)] mb-2">
                  {value.title}
                </h3>
                <p className="text-[var(--color-text-muted)] leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Server Rules */}
        <section>
          <h2 className="font-pixel text-2xl text-center text-[var(--color-accent)] mb-10">
            Server Rules
          </h2>
          <div
            ref={rulesRef}
            className="bg-[var(--color-surface)] border border-[var(--color-primary-dark)] rounded-xl p-8 max-w-2xl mx-auto"
          >
            <ul className="space-y-4">
              {rules.map((rule, i) => (
                <li
                  key={i}
                  data-reveal
                  className="flex items-start gap-3 text-[var(--color-text-muted)] opacity-0"
                >
                  <Warning24Filled className="text-[var(--color-gold)] mt-0.5 shrink-0" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
