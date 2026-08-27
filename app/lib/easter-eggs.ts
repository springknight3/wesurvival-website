const LOGO_CLICK_KEY = "wesurvival_logo_clicks";
const LOGO_TIMEOUT_KEY = "wesurvival_logo_timeout";
const ABOUT_CLICK_KEY = "wesurvival_about_p2w";

export function getLogoClicks(): number {
  if (typeof window === "undefined") return 0;
  const stored = sessionStorage.getItem(LOGO_CLICK_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

export function incrementLogoClicks(): number {
  if (typeof window === "undefined") return 0;
  const current = getLogoClicks();
  const next = current + 1;
  sessionStorage.setItem(LOGO_CLICK_KEY, String(next));

  // Reset after 5 seconds of inactivity
  const existing = sessionStorage.getItem(LOGO_TIMEOUT_KEY);
  if (existing) clearTimeout(parseInt(existing, 10));
  const timeout = window.setTimeout(() => {
    sessionStorage.setItem(LOGO_CLICK_KEY, "0");
  }, 5000);
  sessionStorage.setItem(LOGO_TIMEOUT_KEY, String(timeout));

  return next;
}

export function resetLogoClicks(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(LOGO_CLICK_KEY, "0");
}

export function getP2WClicks(): number {
  if (typeof window === "undefined") return 0;
  const stored = sessionStorage.getItem(ABOUT_CLICK_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

export function incrementP2WClicks(): number {
  if (typeof window === "undefined") return 0;
  const current = getP2WClicks();
  const next = current + 1;
  sessionStorage.setItem(ABOUT_CLICK_KEY, String(next));
  return next;
}
