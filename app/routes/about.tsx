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

const values = [
  {
    icon: <People24Filled className="text-2xl" />,
    title: "Community",
    description:
      "Every player matters. We foster a welcoming environment where friendships are built and everyone has a voice.",
    easterEgg: false,
  },
  {
    icon: <Shield24Filled className="text-2xl" />,
    title: "Fair Play",
    description:
      "Rules apply to everyone equally. No exploits, no griefing, no exceptions.",
    easterEgg: false,
  },
  {
    icon: <Money24Filled className="text-2xl" />,
    title: "No Pay-to-Win",
    description:
      "Your wallet doesn't define your progress. Skill, creativity, and dedication do.",
    easterEgg: true,
  },
  {
    icon: <Lightbulb24Filled className="text-2xl" />,
    title: "Creativity",
    description:
      "Build, design, and express yourself. Our events and world give you the canvas.",
    easterEgg: false,
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

export default function About() {
  const valuesRef = useRef<HTMLDivElement>(null);
  const rulesRef = useRef<HTMLDivElement>(null);

  // Animate on scroll
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

  // Easter egg: confetti on "No Pay-to-Win" card
  const handleP2WClick = useCallback(() => {
    const clicks = incrementP2WClicks();
    if (clicks >= 3) {
      // Create confetti
      const colors = ["#2d6a4f", "#4aedd9", "#fcdb05", "#ff3333", "#95d5b2"];
      for (let i = 0; i < 30; i++) {
        const confetti = document.createElement("div");
        confetti.style.cssText = `
          position: fixed;
          top: -10px;
          left: ${Math.random() * 100}vw;
          width: ${Math.random() * 8 + 4}px;
          height: ${Math.random() * 8 + 4}px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          z-index: 100;
          pointer-events: none;
        `;
        document.body.appendChild(confetti);

        animate(confetti, {
          translateY: [0, window.innerHeight + 20],
          translateX: [(Math.random() - 0.5) * 200],
          rotate: [0, Math.random() * 720],
          opacity: [1, 0],
          duration: 1500 + Math.random() * 1000,
          ease: "inQuad",
        });

        setTimeout(() => confetti.remove(), 3000);
      }
    }
  }, []);

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
                onClick={value.easterEgg ? handleP2WClick : undefined}
                className={`bg-[var(--color-surface)] border border-[var(--color-primary-dark)] rounded-xl p-8 transition-all duration-300 hover:border-[var(--color-primary)] hover:shadow-lg hover:shadow-[var(--color-primary)]/10 opacity-0 ${
                  value.easterEgg
                    ? "cursor-pointer hover:bg-[var(--color-surface-light)]"
                    : ""
                }`}
              >
                <div className="text-[var(--color-accent)] mb-4">
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
