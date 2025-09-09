import { useEffect, useRef, useState } from "react";

type InfiniteCarouselProps = {
  imageURLs: string[];
  speed?: number; // normal speed (px/sec)
  hoverSpeed?: number; // speed when hovered
};

export function InfiniteCarousel({
  imageURLs,
  speed = 50,
  hoverSpeed = 10,
}: InfiniteCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const offsetRef = useRef(0); // keeps track of total scroll distance

  // Duplicate images so it looks seamless
  const images = [...imageURLs, ...imageURLs];

  useEffect(() => {
    let lastTimestamp: number | null = null;
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (lastTimestamp == null) lastTimestamp = timestamp;
      const delta = (timestamp - lastTimestamp) / 2000; // seconds since last frame
      lastTimestamp = timestamp;

      const currentSpeed = isHovered ? hoverSpeed : speed;
      offsetRef.current += delta * currentSpeed;

      if (containerRef.current) {
        const halfWidth = containerRef.current.scrollWidth / 2;
        containerRef.current.scrollLeft = offsetRef.current % halfWidth;
      }

      animationFrame = requestAnimationFrame(step);
    };

    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [speed, hoverSpeed, isHovered]);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden whitespace-nowrap"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex">
        {images.map((url, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 w-72 h-48 mx-2 rounded-lg overflow-hidden group"
          >
            <img
              src={url}
              alt={`Slide ${i}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-75"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 flex items-center justify-center text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition">
              {/* Optional overlay content */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InfiniteCarousel;
