"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SquareArrowOutUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type CardStackItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc?: string;
  href?: string;
  ctaLabel?: string;
  tag?: string;
};

export type CardStackProps<T extends CardStackItem = CardStackItem> = {
  items: T[];
  initialIndex?: number;
  maxVisible?: number;
  cardWidth?: number;
  cardHeight?: number;
  overlap?: number;
  spreadDeg?: number;
  perspectivePx?: number;
  depthPx?: number;
  tiltXDeg?: number;
  activeLiftPx?: number;
  activeScale?: number;
  inactiveScale?: number;
  springStiffness?: number;
  springDamping?: number;
  loop?: boolean;
  autoAdvance?: boolean;
  intervalMs?: number;
  pauseOnHover?: boolean;
  showDots?: boolean;
  className?: string;
  onChangeIndex?: (index: number, item: T) => void;
  onActivate?: (item: T) => void;
  renderCard?: (item: T, state: { active: boolean }) => React.ReactNode;
};

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;
  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

export function CardStack<T extends CardStackItem = CardStackItem>({
  items,
  initialIndex = 0,
  maxVisible = 7,
  cardWidth = 520,
  cardHeight = 320,
  overlap = 0.48,
  spreadDeg = 48,
  perspectivePx = 1100,
  depthPx = 140,
  tiltXDeg = 12,
  activeLiftPx = 22,
  activeScale = 1.03,
  inactiveScale = 0.94,
  springStiffness = 280,
  springDamping = 28,
  loop = true,
  autoAdvance = false,
  intervalMs = 2800,
  pauseOnHover = true,
  showDots = true,
  className,
  onChangeIndex,
  onActivate,
  renderCard,
}: CardStackProps<T>) {
  const reduceMotion = useReducedMotion();
  const len = items.length;

  const [active, setActive] = React.useState(() => wrapIndex(initialIndex, len));
  const [hovering, setHovering] = React.useState(false);

  React.useEffect(() => {
    setActive((a) => wrapIndex(a, len));
  }, [len]);

  React.useEffect(() => {
    if (!len) return;
    onChangeIndex?.(active, items[active]!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2));
  const cardSpacing = Math.max(10, Math.round(cardWidth * (1 - overlap)));
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;

  const canGoPrev = loop || active > 0;
  const canGoNext = loop || active < len - 1;

  const prev = React.useCallback(() => {
    if (!len || !canGoPrev) return;
    setActive((a) => wrapIndex(a - 1, len));
  }, [canGoPrev, len]);

  const next = React.useCallback(() => {
    if (!len || !canGoNext) return;
    setActive((a) => wrapIndex(a + 1, len));
  }, [canGoNext, len]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  React.useEffect(() => {
    if (!autoAdvance || reduceMotion || !len) return;
    if (pauseOnHover && hovering) return;
    const id = window.setInterval(() => {
      if (loop || active < len - 1) next();
    }, Math.max(700, intervalMs));
    return () => window.clearInterval(id);
  }, [autoAdvance, intervalMs, hovering, pauseOnHover, reduceMotion, len, loop, active, next]);

  if (!len) return null;

  const activeItem = items[active]!;

  return (
    <div
      className={cn("relative w-full select-none", className)}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Stage */}
      <div
        className="relative mx-auto flex items-center justify-center"
        style={{ height: cardHeight + activeLiftPx + 80, perspective: perspectivePx }}
      >
        {/* spotlight wash */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className="rounded-full bg-primary/20 blur-3xl"
            style={{ width: cardWidth, height: cardHeight }}
          />
        </div>

        <div
          className="relative"
          style={{ width: cardWidth, height: cardHeight, transformStyle: "preserve-3d" }}
        >
          {items.map((item, i) => {
            const off = signedOffset(i, active, len, loop);
            const abs = Math.abs(off);
            if (abs > maxOffset) return null;

            const rotateZ = off * stepDeg;
            const x = off * cardSpacing;
            const y = abs * 10;
            const z = -abs * depthPx;
            const isActive = off === 0;
            const scale = isActive ? activeScale : inactiveScale;
            const lift = isActive ? -activeLiftPx : 0;
            const rotateX = isActive ? 0 : tiltXDeg;
            const zIndex = 100 - abs;

            const dragProps = isActive
              ? {
                  drag: "x" as const,
                  dragConstraints: { left: 0, right: 0 },
                  dragElastic: 0.18,
                  onDragEnd: (
                    _e: unknown,
                    info: { offset: { x: number }; velocity: { x: number } }
                  ) => {
                    if (reduceMotion) return;
                    const travel = info.offset.x;
                    const v = info.velocity.x;
                    const threshold = Math.min(160, cardWidth * 0.22);
                    if (travel > threshold || v > 650) prev();
                    else if (travel < -threshold || v < -650) next();
                  },
                }
              : {};

            return (
              <motion.div
                key={item.id}
                className="absolute left-0 top-0 cursor-pointer"
                style={{ width: cardWidth, height: cardHeight, zIndex }}
                initial={false}
                animate={{ x, y: y + lift, z, rotateZ, rotateX, scale, opacity: 1 }}
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: springStiffness, damping: springDamping }
                }
                onClick={() => {
                  if (isActive) onActivate?.(item);
                  else setActive(i);
                }}
                {...dragProps}
              >
                <div className="h-full w-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl">
                  {renderCard ? (
                    renderCard(item, { active: isActive })
                  ) : (
                    <DefaultFanCard item={item} active={isActive} />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Dots navigation */}
      {showDots ? (
        <div className="mt-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            {items.map((it, idx) => {
              const on = idx === active;
              return (
                <button
                  key={it.id}
                  onClick={() => setActive(idx)}
                  className={cn(
                    "h-2 w-2 rounded-full transition",
                    on ? "bg-foreground" : "bg-foreground/30 hover:bg-foreground/50"
                  )}
                  aria-label={`Go to ${it.title}`}
                />
              );
            })}
          </div>

          {activeItem.href ? (
            <a
              href={activeItem.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition hover:bg-card/70"
            >
              {activeItem.ctaLabel ?? "View project"}
              <SquareArrowOutUpRight className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function DefaultFanCard({ item }: { item: CardStackItem; active: boolean }) {
  return (
    <div className="relative h-full w-full">
      {/* image */}
      <div className="absolute inset-0">
        {item.imageSrc ? (
          <img src={item.imageSrc} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            No image
          </div>
        )}
      </div>

      {/* gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

      {/* content */}
      <div className="absolute inset-x-0 bottom-0 p-5">
        {item.tag ? (
          <span className="mb-2 inline-block rounded-full bg-primary/90 px-2.5 py-1 text-xs font-medium text-primary-foreground">
            {item.tag}
          </span>
        ) : null}
        <h3 className="font-display text-xl font-bold leading-tight md:text-2xl">{item.title}</h3>
        {item.description ? (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
        ) : null}
      </div>
    </div>
  );
}
