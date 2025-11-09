// Utility for loading Razorpay Checkout SDK once and reusing across app
// Client-side only. Safely checks for window and existing script.

// Augment window type for Razorpay
type RazorpayOptions = Record<string, unknown>;
interface RazorpayInstance { open: () => void }
type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

/**
 * Loads Razorpay checkout script if not already present.
 * Returns true on successful load, false otherwise.
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Convenience helper to ensure SDK is loaded before opening the checkout.
 * Usage:
 *   await ensureRazorpayAndOpen(options)
 */
export async function ensureRazorpayAndOpen(options: RazorpayOptions) {
  const ok = await loadRazorpayScript();
  if (!ok || typeof window === "undefined" || !window.Razorpay) {
    throw new Error("Failed to load Razorpay SDK");
  }
  const rzp = new window.Razorpay(options);
  rzp.open();
  return rzp;
}