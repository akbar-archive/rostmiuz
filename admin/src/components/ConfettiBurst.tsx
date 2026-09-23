"use client";

import { useEffect, useState } from "react";

const COLORS = ["#e11d48", "#f59e0b", "#8b5cf6", "#10b981", "#3b82f6"];
const PARTICLE_COUNT = 14;

type Particle = { id: number; color: string; dx: number; dy: number; delay: number };

// Bump `triggerKey` (e.g. a counter incremented on success) to fire a new
// burst. Render this inside a `relative` (or `relative inline-block`)
// wrapper around whatever the burst should radiate from.
export default function ConfettiBurst({ triggerKey }: { triggerKey: number }) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (triggerKey === 0) return;
    // Math.random() belongs in an effect, not render/useMemo — this is the
    // one-shot "roll the dice" side effect for this burst.
    const next = Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + Math.random() * 0.4;
      const distance = 36 + Math.random() * 36;
      return {
        id: i,
        color: COLORS[i % COLORS.length],
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance,
        delay: Math.random() * 60,
      };
    });
    // Deferred rather than called synchronously in the effect body itself
    // — avoids triggering a same-tick cascading render.
    const showTimer = setTimeout(() => setParticles(next), 0);
    const hideTimer = setTimeout(() => setParticles([]), 900);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [triggerKey]);

  if (particles.length === 0) return null;

  return (
    <span className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={`${triggerKey}-${p.id}`}
          className="confetti-particle absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full"
          style={{
            backgroundColor: p.color,
            "--dx": `${p.dx}px`,
            "--dy": `${p.dy}px`,
            animationDelay: `${p.delay}ms`,
          } as React.CSSProperties}
        />
      ))}
    </span>
  );
}
