import { useEffect, useRef } from "react";
import {
  Person24Filled,
  Info24Filled,
} from "@fluentui/react-icons";
import { animate } from "animejs";
import type { Route } from "./+types/contact";
import { MinecraftButton } from "~/components/MinecraftButton";

const BASE_URL = "https://wesurvival-website.vercel.app";

function DiscordIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} width="20" height="20" aria-hidden="true">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  );
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contact — WeSurvival" },
    {
      name: "description",
      content:
        "Get in touch with the WeSurvival team. Join our Discord for support, feedback, and community.",
    },
    { property: "og:title", content: "Contact — WeSurvival" },
    {
      property: "og:description",
      content:
        "Get in touch with the WeSurvival team. Join our Discord for support, feedback, and community.",
    },
    { property: "og:image", content: `${BASE_URL}/logo.png` },
    { property: "og:url", content: `${BASE_URL}/contact` },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: "Contact — WeSurvival" },
    {
      name: "twitter:description",
      content:
        "Get in touch with the WeSurvival team. Join our Discord for support, feedback, and community.",
    },
    { name: "twitter:image", content: `${BASE_URL}/logo.png` },
    {
      tagName: "link",
      rel: "canonical",
      href: `${BASE_URL}/contact`,
    },
  ] satisfies Route.MetaDescriptors;
}

export default function Contact() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const items = contentRef.current.querySelectorAll("[data-reveal]");
    animate(items, {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 600,
      delay: (_el, i) => (i ?? 0) * 120,
      ease: "outQuad",
    });
  }, []);

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto" ref={contentRef}>
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-pixel text-4xl md:text-5xl text-[var(--color-accent)] mb-4" data-reveal>
            Contact Us
          </h1>
          <p className="text-[var(--color-text-muted)] text-lg max-w-xl mx-auto" data-reveal>
            Have a question, need help, or want to report an issue?
            We're here for you.
          </p>
        </div>

        {/* Discord - Primary Contact */}
        <div
          data-reveal
          className="bg-[var(--color-surface)] border border-[var(--color-primary-dark)] rounded-2xl p-10 text-center mb-8 opacity-0"
        >
          <DiscordIcon className="text-6xl text-[#5865F2] mb-6 mx-auto" />
          <h2 className="font-pixel text-2xl text-[var(--color-text)] mb-3">
            Join Our Discord
          </h2>
          <p className="text-[var(--color-text-muted)] mb-8 max-w-md mx-auto">
            The fastest way to reach us. Get help, chat with the community,
            and stay updated on server events.
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

        {/* Account Recovery */}
        <div
          data-reveal
          className="bg-[var(--color-surface)] border border-[var(--color-primary-dark)] rounded-2xl p-8 opacity-0"
        >
          <div className="flex items-start gap-4">
            <Person24Filled className="text-[var(--color-gold)] text-2xl mt-1 shrink-0" />
            <div>
              <h3 className="font-pixel text-lg text-[var(--color-text)] mb-2">
                Account Recovery
              </h3>
              <p className="text-[var(--color-text-muted)] leading-relaxed">
                If you registered with an offline account and can no longer log
                in with the same username, contact an admin on Discord. Provide
                proof of your original signup (screenshot, date, etc.) and we'll
                help you regain access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
