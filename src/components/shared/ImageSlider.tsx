"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

type Slide = {
  image: string;
  title: string;
  slug?: string;
  excerpt?: string;
};

export function ImageSlider({ slides }: { slides: Slide[] }) {
  const [current, setCurrent] = useState(0);
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDir(document.documentElement.dir === "rtl" ? "rtl" : "ltr");
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (slides.length === 0) return null;

  const slide = slides[current];

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl group"
      dir={dir}
    >
      {slide.slug ? (
        <Link
          href={`/posts/${slide.slug}`}
          className="relative aspect-[21/9] block"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
            <h3 className="text-xl sm:text-3xl font-bold text-white mb-2">
              {slide.title}
            </h3>
            {slide.excerpt && (
              <p className="text-sm sm:text-base text-white/80 line-clamp-2 max-w-2xl">
                {slide.excerpt}
              </p>
            )}
          </div>
        </Link>
      ) : (
        <div className="relative aspect-[21/9] block">
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
            <h3 className="text-xl sm:text-3xl font-bold text-white mb-2">
              {slide.title}
            </h3>
            {slide.excerpt && (
              <p className="text-sm sm:text-base text-white/80 line-clamp-2 max-w-2xl">
                {slide.excerpt}
              </p>
            )}
          </div>
        </div>
      )}

      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={dir === "rtl" ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
              />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={dir === "rtl" ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
              />
            </svg>
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent(i);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? "bg-white w-6" : "bg-white/50"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
