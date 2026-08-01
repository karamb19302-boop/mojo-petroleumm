"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import mojoSite from "../mojosite.png";
import mojoTruck from "../mojotruck.png";
import mojoStaff from "../mojostaff.png";
import mojoPump from "../mojopump.png";
import mojoPipes from "../mojopipes.png";

const backgroundImages = [
  mojoSite,
  mojoTruck,
  mojoStaff,
  mojoPump,
  mojoPipes,
];

export function AnimatedBackground() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    function scheduleNext() {
      const delay = 2000 + Math.round(Math.random() * 2000);
      timeoutId = setTimeout(() => {
        setActiveIndex((current) => (current + 1) % backgroundImages.length);
        scheduleNext();
      }, delay);
    }

    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="page-bg" aria-hidden="true">
      {backgroundImages.map((src, index) => (
        <div
          key={src.src}
          className={`bg-image ${index === activeIndex ? "active" : ""}`}
        >
          <Image src={src} alt="" fill sizes="100vw" style={{ objectFit: "cover" }} priority={false} />
        </div>
      ))}
    </div>
  );
}
