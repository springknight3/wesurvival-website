import { useEffect, useRef } from "react";
import {
  Desktop24Filled,
  Games24Filled,
  Info24Filled,
  Warning24Filled,
} from "@fluentui/react-icons";
import { animate } from "animejs";
import type { Route } from "./+types/play";
import { CopyIP } from "~/components/CopyIP";
import { PlatformBadge } from "~/components/PlatformBadge";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Play — WeSurvival" },
    {
      name: "description",
      content:
        "Connect to WeSurvival. Java and Bedrock server IPs, port numbers, and step-by-step connection guide.",
    },
  ];
}

export default function Play() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const items = contentRef.current.querySelectorAll("[data-reveal]");
    animate(items, {
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 600,
      delay: (_el, i) => (i ?? 0) * 100,
      ease: "outQuad",
    });
  }, []);

  return (
    <div className="pt-24 pb-16 px-4">
      <div className="max-w-4xl mx-auto" ref={contentRef}>
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-pixel text-4xl md:text-5xl text-[var(--color-accent)] mb-4" data-reveal>
            Play Now
          </h1>
          <p className="text-[var(--color-text-muted)] text-lg max-w-xl mx-auto" data-reveal>
            Connect on Java or Bedrock. Premium accounts are optional —
            offline (cracked) accounts are fully supported.
          </p>
        </div>

        {/* Server IPs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Java */}
          <div
            data-reveal
            className="bg-[var(--color-surface)] border border-[var(--color-primary-dark)] rounded-2xl p-8 opacity-0"
          >
            <div className="flex items-center gap-3 mb-6">
              <Desktop24Filled className="text-[var(--color-dirt)] text-2xl" />
              <h2 className="font-pixel text-xl text-[var(--color-text)]">
                Java Edition
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
                  Server Address
                </span>
                <div className="mt-1">
                  <CopyIP ip="wesurvival.pixelforge.gg" />
                </div>
              </div>
              <div>
                <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
                  Version
                </span>
                <p className="text-[var(--color-accent)] font-mono mt-1">
                  26.1.2
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <PlatformBadge platform="java" />
                <PlatformBadge platform="pc" />
              </div>
            </div>
          </div>

          {/* Bedrock */}
          <div
            data-reveal
            className="bg-[var(--color-surface)] border border-[var(--color-primary-dark)] rounded-2xl p-8 opacity-0"
          >
            <div className="flex items-center gap-3 mb-6">
              <Games24Filled className="text-[var(--color-diamond)] text-2xl" />
              <h2 className="font-pixel text-xl text-[var(--color-text)]">
                Bedrock Edition
              </h2>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
                  Server Address
                </span>
                <div className="mt-1">
                  <CopyIP ip="wesurvival.pixelforge.gg" />
                </div>
              </div>
              <div>
                <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
                  Port
                </span>
                <div className="mt-1">
                  <CopyIP ip="26955" label="Port" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <PlatformBadge platform="bedrock" />
                <PlatformBadge platform="switch" />
                <PlatformBadge platform="playstation" />
                <PlatformBadge platform="xbox" />
                <PlatformBadge platform="windows" />
              </div>
            </div>
          </div>
        </div>

        {/* Connection Steps */}
        <div
          data-reveal
          className="bg-[var(--color-surface)] border border-[var(--color-primary-dark)] rounded-2xl p-8 mb-8 opacity-0"
        >
          <h2 className="font-pixel text-xl text-[var(--color-accent)] mb-6">
            How to Connect
          </h2>
          <div className="space-y-6">
            {[
              {
                step: 1,
                title: "Open Minecraft",
                desc: "Launch Minecraft Java or Bedrock edition.",
              },
              {
                step: 2,
                title: "Add Server",
                desc: 'Click "Add Server" or "Direct Connect" and enter the server address above.',
              },
              {
                step: 3,
                title: "Join & Register",
                desc: "Once connected, register with /register <password> <password> to secure your account.",
              },
              {
                step: 4,
                title: "Play!",
                desc: "You're in! Explore the world, meet the community, and have fun.",
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center font-pixel text-white shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-[var(--color-text)] font-medium mb-1">
                    {item.title}
                  </h3>
                  <p className="text-[var(--color-text-muted)] text-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Info */}
        <div
          data-reveal
          className="bg-[var(--color-surface)] border border-[var(--color-gold)]/30 rounded-2xl p-8 opacity-0"
        >
          <div className="flex items-start gap-4">
            <Info24Filled className="text-[var(--color-gold)] text-2xl mt-1 shrink-0" />
            <div>
              <h3 className="font-pixel text-lg text-[var(--color-text)] mb-3">
                Account Information
              </h3>
              <div className="space-y-3 text-[var(--color-text-muted)] text-sm leading-relaxed">
                <p>
                  <strong className="text-[var(--color-text)]">
                    Offline (cracked) accounts:
                  </strong>{" "}
                  An official Minecraft account is not required to join
                  WeSurvival. You can play with any username — just register
                  when you join.
                </p>
                <p>
                  <strong className="text-[var(--color-text)]">
                    Premium accounts:
                  </strong>{" "}
                  Once registered, you can connect your premium Minecraft
                  account to your profile.
                </p>
                <div className="flex items-start gap-2 bg-[var(--color-bg)] rounded-lg p-4 mt-4">
                  <Warning24Filled className="text-[var(--color-redstone)] shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-[var(--color-redstone)]">
                      Important:
                    </strong>{" "}
                    If you do not have a premium account and later connect one,
                    you will be unable to log in again using the same username.
                    If this occurs, contact an admin on Discord with proof of
                    your original signup.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
