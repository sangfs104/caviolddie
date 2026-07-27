// app/components/HeroBanner.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  image: string;
  href: string;
}

const slides: Slide[] = [
  {
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1920&auto=format&fit=crop",
    href: "/products",
  },
  {
    image:
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1920&auto=format&fit=crop",
    href: "/products",
  },
  {
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1920&auto=format&fit=crop",
    href: "/products",
  },
  {
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1920&auto=format&fit=crop",
    href: "/products",
  },
];

const AUTOPLAY_MS = 3000;

export default function HeroBanner() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((index: number) => {
    setActive((index + slides.length) % slides.length);
    setProgressKey((k) => k + 1);
  }, []);

  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1), [active, goTo]);

  // Autoplay 3 giây
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [active, paused, next, progressKey]);

  // Điều hướng bằng bàn phím
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Vuốt trên mobile
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 50) (delta > 0 ? prev : next)();
    touchStartX.current = null;
  };

  return (
    <section
      className="relative w-full h-[48vh] min-h-[320px] max-h-[520px] overflow-hidden bg-[#111110]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-roledescription="carousel"
    >
      {/* Lớp ảnh — crossfade + ken burns zoom */}
      {slides.map((slide, i) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${
            i === active ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          aria-hidden={i !== active}
        >
          <Image
            src={slide.image}
            alt={`Slide ${i + 1}`}
            fill
            priority={i === 0}
            sizes="100vw"
            className={`object-cover motion-safe:transition-transform motion-safe:duration-[7000ms] motion-safe:ease-out ${
              i === active ? "scale-105" : "scale-100"
            }`}
          />
        </div>
      ))}

      {/* Gradient nhẹ phía dưới */}
      <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

      {/* Mũi tên điều hướng */}
      <button
        type="button"
        onClick={prev}
        aria-label="Ảnh trước"
        className="absolute z-30 left-3 sm:left-6 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full border border-white/40 text-white hover:bg-white hover:text-black transition-colors"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Ảnh sau"
        className="absolute z-30 right-3 sm:right-6 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full border border-white/40 text-white hover:bg-white hover:text-black transition-colors"
      >
        <ChevronRight size={16} />
      </button>

      {/* Timeline progress */}
      <div className="absolute z-30 bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((slide, i) => (
          <button
            key={slide.image}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Đi tới ảnh ${i + 1}`}
            aria-current={i === active}
            className="relative h-[3px] w-8 sm:w-10 bg-white/25 overflow-hidden"
          >
            {i === active && (
              <span
                key={progressKey}
                className="absolute inset-0 bg-white origin-left motion-safe:animate-[fillbar_3s_linear_forwards] motion-reduce:w-full"
                style={{
                  animationPlayState: paused ? "paused" : "running",
                }}
              />
            )}
            {i < active && <span className="absolute inset-0 bg-white/70" />}
          </button>
        ))}
      </div>

      <style jsx global>{`
        @keyframes fillbar {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </section>
  );
}
