import { useState, useCallback } from "react";
import { Copy24Regular, Checkmark24Filled } from "@fluentui/react-icons";
import { animate } from "animejs";

interface CopyIPProps {
  ip: string;
  port?: number;
  label?: string;
}

export function CopyIP({ ip, port, label }: CopyIPProps) {
  const [copied, setCopied] = useState(false);
  const fullAddress = port ? `${ip}:${port}` : ip;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullAddress);
      setCopied(true);

      // Animate the button
      const btn = document.getElementById(`copy-${ip}-${port ?? "default"}`);
      if (btn) {
        animate(btn, {
          scale: [1, 1.1, 1],
          duration: 300,
          ease: "outQuad",
        });
      }

      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = fullAddress;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [fullAddress, ip, port]);

  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-xs text-[var(--color-text-muted)] uppercase tracking-wider">
          {label}
        </span>
      )}
      <div className="flex items-center bg-[var(--color-bg)] rounded-lg border border-[var(--color-primary-dark)] overflow-hidden">
        <code className="px-4 py-2 text-[var(--color-accent)] font-mono text-sm select-all">
          {fullAddress}
        </code>
        <button
          id={`copy-${ip}-${port ?? "default"}`}
          onClick={handleCopy}
          className="px-3 py-2 bg-[var(--color-primary-dark)] hover:bg-[var(--color-primary)] text-[var(--color-text)] transition-colors"
          title="Copy to clipboard"
        >
          {copied ? (
            <Checkmark24Filled className="text-[var(--color-accent)]" />
          ) : (
            <Copy24Regular />
          )}
        </button>
      </div>
      {copied && (
        <span className="text-xs text-[var(--color-accent)] toast-enter">
          Copied!
        </span>
      )}
    </div>
  );
}
