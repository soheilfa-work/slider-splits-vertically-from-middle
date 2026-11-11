"use client";

import { useEffect } from "react";
import { settings, slides } from "./libs/libs";

type Side = "left" | "right";

export default function Home() {
  useEffect(() => {
    const columns: Record<
      Side,
      { el: HTMLElement; visibleSlides: Map<number, HTMLDivElement> }
    > = {
      left: {
        el: document.querySelector(".left") as HTMLElement,
        visibleSlides: new Map(),
      },
      right: {
        el: document.querySelector(".right") as HTMLElement,
        visibleSlides: new Map(),
      },
    };

    if (!columns.left.el || !columns.right.el) return;

    let scrollPosition = 1;
    let scrollTarget = 1;
    let lastTouchY = 0;
    let frame = 0;

    function createSlide(side: Side, index: number) {
      const slideIndex =
        ((index % slides.length) + slides.length) % slides.length;
      const data = slides[slideIndex];

      const el = document.createElement("div");
      el.className = "slide";
      el.style.zIndex = String(index);
      el.innerHTML = `
        <img src="${data.image}" alt="${data.title}" />
        <div class="overlay"></div>
        <div class="copy" style="color: ${data.accent}">
          <div class="slide-tag">${data.tags.join("<br />")}</div>
          <div class="slide-title">${data.title}</div>
          <a href="${data.link}" class="slide-link">View Full Project</a>
        </div>
      `;

      columns[side].el.appendChild(el);
      columns[side].visibleSlides.set(index, el);
    }

    function getRevealShape(side: Side, amount: number) {
      const d = Math.max(0, Math.min(100, amount * 100));
      return side === "left"
        ? `polygon(0% ${100 - d}%, 100% ${100 - d}%, 100% 100%, 0% 100%)`
        : `polygon(0% 0%, 100% 0%, 100% ${d}%, 0% ${d}%)`;
    }

    function getTitlePosition(slideProgress: number) {
      const fromCenter = slideProgress - 1;
      const past = Math.abs(fromCenter) - settings.titleHold;
      if (past <= 0) return 1;

      const t = past / (1 - settings.titleHold);
      return 1 + Math.sign(fromCenter) * t * t * (3 - 2 * t);
    }

    function updateSlider() {
      const first = Math.floor(scrollPosition) - settings.bufferSlides;
      const last = Math.ceil(scrollPosition) + settings.bufferSlides;

      for (const side of ["left", "right"] as const) {
        const visibleSlides = columns[side].visibleSlides;
        const driftDirection = side === "left" ? 1 : -1;

        for (let i = first; i <= last; i++) {
          if (!visibleSlides.has(i)) createSlide(side, i);
        }

        for (const [index, el] of visibleSlides) {
          if (index < first || index > last) {
            el.remove();
            visibleSlides.delete(index);
            continue;
          }

          const revealAmount = scrollPosition - index;
          const slideProgress = Math.max(0, Math.min(2, revealAmount));
          const cover = Math.max(
            0,
            Math.min(1, slideProgress * (1 + settings.revealOverlap / 100)),
          );

          el.style.visibility = cover <= 0 ? "hidden" : "visible";
          el.style.clipPath =
            cover >= 1 ? "none" : getRevealShape(side, cover);

          const imageDrift =
            (1 - cover) * settings.imageShift * driftDirection;
          (el.querySelector("img") as HTMLImageElement).style.transform =
            `translateY(${imageDrift}%) scale(${settings.imageZoom})`;

          const titleDrift =
            (1 - getTitlePosition(cover)) * settings.copyShift * driftDirection;
          (el.querySelector(".copy") as HTMLElement).style.transform =
            `translateY(${titleDrift}%)`;
        }
      }
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      scrollTarget += e.deltaY / settings.scrollSensitivity;
    }

    function onTouchStart(e: TouchEvent) {
      lastTouchY = e.touches[0].clientY;
    }

    function onTouchMove(e: TouchEvent) {
      e.preventDefault();
      const y = e.touches[0].clientY;
      scrollTarget += ((lastTouchY - y) * 8) / settings.scrollSensitivity;
      lastTouchY = y;
    }

    function animateSlider() {
      scrollPosition += (scrollTarget - scrollPosition) * settings.smoothness;
      updateSlider();
      frame = requestAnimationFrame(animateSlider);
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    animateSlider();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      columns.left.visibleSlides.forEach((el) => el.remove());
      columns.right.visibleSlides.forEach((el) => el.remove());
    };
  }, []);

  return (
    <div className="slider">
      <div className="column left"></div>
      <div className="column right"></div>
    </div>
  );
}
