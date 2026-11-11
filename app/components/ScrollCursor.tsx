"use client";

import { useEffect, useRef } from "react";

export default function ScrollCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    const move = (event: MouseEvent) => {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      cursor.classList.add("is-visible");
    };

    const hide = () => cursor.classList.remove("is-visible");

    window.addEventListener("mousemove", move);
    root.addEventListener("mouseleave", hide);

    return () => {
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", move);
      root.removeEventListener("mouseleave", hide);
    };
  }, []);

  return (
    <div ref={cursorRef} className="scroll-cursor" aria-hidden="true">
      <svg viewBox="0 0 64 64" fill="none">
        <circle
          cx="32"
          cy="32"
          r="22"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <g className="scroll-cursor-up">
          <path
            d="M32 17.5 L26.5 23 M32 17.5 L37.5 23"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </g>
        <path
          d="M32 24.5 V39.5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <g className="scroll-cursor-down">
          <path
            d="M32 46.5 L26.5 41 M32 46.5 L37.5 41"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}
