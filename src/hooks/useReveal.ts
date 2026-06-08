import { useEffect, useRef } from "react";

type RevealVariant = "up" | "left" | "right" | "scale";

/**
 * Attaches a scroll-reveal animation to an element.
 * Add the returned ref to any element; it starts hidden and
 * animates in (using .reveal utilities in index.css) once visible.
 */
export const useReveal = <T extends HTMLElement = HTMLDivElement>(
  variant: RevealVariant = "up",
  options?: { threshold?: number; delay?: number }
) => {
  const ref = useRef<T>(null);
  const { threshold = 0.15, delay = 0 } = options ?? {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.add("reveal", `reveal-${variant}`);
    if (delay) el.style.transitionDelay = `${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [variant, threshold, delay]);

  return ref;
};
