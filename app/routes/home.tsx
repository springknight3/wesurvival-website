import { useEffect, useRef } from "react";
import { Link } from "react-router";
import {
  People24Filled,
  Money24Filled,
  Calendar24Filled,
  Globe24Filled,
  ArrowRight24Filled,
} from "@fluentui/react-icons";
import { animate } from "animejs";
import type { Route } from "./+types/home";
import { ParticleBackground } from "~/components/ParticleBackground";
import { MinecraftButton } from "~/components/MinecraftButton";
import { CopyIP } from "~/components/CopyIP";

function DiscordIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} width="20" height="20">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  );
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "WeSurvival — Community First Minecraft Server" },
    {
      name: "description",
      content:
        "Join WeSurvival, a friendly Minecraft server with no pay-to-win. Cooperative survival, economy play, and regular events. Java & Bedrock editions supported.",
    },
  ];
}

const features = [
  {
    icon: <People24Filled className="text-2xl" />,
    title: "Community First",
    description:
      "A welcoming community of players who look out for each other. New or veteran, you belong here.",
  },
  {
    icon: <Money24Filled className="text-2xl" />,
    title: "No Pay-to-Win",
    description:
      "Progress comes from skill, teamwork, and creativity. No purchased advantages, ever.",
  },
  {
    icon: <Calendar24Filled className="text-2xl" />,
    title: "Regular Events",
    description:
      "Build competitions, PvP tournaments, treasure hunts, and seasonal events for everyone.",
  },
  {
    icon: <Globe24Filled className="text-2xl" />,
    title: "Cross-Play",
    description:
      "Play with friends on Java or Bedrock — PC, PlayStation, Xbox, Nintendo Switch, and mobile.",
  },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    const els = heroRef.current.querySelectorAll("[data-animate]");
    animate(els, {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 800,
      delay: (_el, i) => (i ?? 0) * 150,
      ease: "outQuad",
    });
  }, []);

  useEffect(() => {
    if (!featuresRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = featuresRef.current?.querySelectorAll("[data-feature]");
            if (cards) {
              animate(cards, {
                opacity: [0, 1],
                translateY: [40, 0],
                scale: [0.95, 1],
                duration: 600,
                delay: (_el, i) => (i ?? 0) * 100,
                ease: "outQuad",
              });
            }
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(featuresRef.current);
    return () => observer.disconnect();
  }, []);

  // Logo click easter egg: wave animation on feature cards
  useEffect(() => {
    const handler = () => {
      const cards = featuresRef.current?.querySelectorAll("[data-feature]");
      if (cards && cards.length > 0) {
        animate(cards, {
          rotate: [0, -3, 3, -2, 2, 0],
          scale: [1, 1.05, 0.95, 1.03, 1],
          duration: 600,
          delay: (_el, i) => (i ?? 0) * 80,
          ease: "outQuad",
        });
      }
    };
    window.addEventListener("logo-click-easter-egg", handler);
    return () => window.removeEventListener("logo-click-easter-egg", handler);
  }, []);

  return (
    <>
      <ParticleBackground />

      {/* Hero */}
      <section
        ref={heroRef}
        className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-16"
      >
        <div className="text-center max-w-3xl mx-auto">
          <img
            src="/logo.png"
            alt="WeSurvival Logo"
            className="w-32 h-32 mx-auto mb-8 rounded-2xl shadow-2xl"
            data-animate
          />
          <h1
            className="font-pixel text-5xl md:text-7xl text-[var(--color-accent)] mb-6"
            data-animate
          >
            WeSurvival
          </h1>
          <p
            className="text-xl md:text-2xl text-[var(--color-text-muted)] mb-4"
            data-animate
          >
            Community First. No Pay-to-Win.
          </p>
          <p
            className="text-[var(--color-text-muted)] mb-8 max-w-xl mx-auto"
            data-animate
          >
            A friendly Minecraft server where progress comes from skill,
            teamwork, and creativity. Join cooperative survival, economy play,
            and regular events.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8" data-animate>
            <Link to="/play">
              <MinecraftButton variant="accent">
                Start Playing <ArrowRight24Filled className="inline ml-2" />
              </MinecraftButton>
            </Link>
            <a
              href="https://discord.gg/kRg9dZK9x4"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MinecraftButton variant="secondary">
                <DiscordIcon className="inline mr-2" />
                Join Discord
              </MinecraftButton>
            </a>
          </div>

          <div data-animate className="flex justify-center">
            <CopyIP ip="wesurvival.pixelforge.gg" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-pixel text-3xl md:text-4xl text-center text-[var(--color-accent)] mb-12">
            Why WeSurvival?
          </h2>
          <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                data-feature
                className="bg-[var(--color-surface)] border border-[var(--color-primary-dark)] rounded-xl p-8 hover:border-[var(--color-primary)] transition-all duration-300 hover:shadow-lg hover:shadow-[var(--color-primary)]/10 opacity-0"
              >
                <div className="text-[var(--color-accent)] mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-pixel text-lg text-[var(--color-text)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[var(--color-text-muted)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Discord CTA */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center bg-[var(--color-surface)] border border-[var(--color-primary-dark)] rounded-2xl p-10">
          <DiscordIcon className="text-5xl text-[#5865F2] mb-4 mx-auto" />
          <h2 className="font-pixel text-2xl text-[var(--color-text)] mb-3">
            Join Our Community
          </h2>
          <p className="text-[var(--color-text-muted)] mb-6">
            Get help, chat with players, and stay updated on server events.
          </p>
          <a
            href="https://discord.gg/kRg9dZK9x4"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MinecraftButton variant="primary">
              <DiscordIcon className="inline mr-2" />
              discord.gg/kRg9dZK9x4
            </MinecraftButton>
          </a>
        </div>
      </section>
    </>
  );
}
