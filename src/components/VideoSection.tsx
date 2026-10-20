import { motion, useMotionValue, useTransform, animate, MotionValue } from "framer-motion";
import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading";
import { Play, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

export interface VideoItem {
  id: number;
  title: string;
  thumbnail: string;
  video_url?: string;
}

interface VideoSectionProps {
  title: string;
  subtitle: string;
  items: VideoItem[];
  columns?: number;
  vertical?: boolean;
  moreLink?: string;
}

interface CarouselCardProps {
  item: VideoItem;
  index: number;
  total: number;
  time: MotionValue<number>;
  radius: number;
  vertical?: boolean;
  isDragging: React.MutableRefObject<boolean>;
  dragMoved: React.MutableRefObject<number>;
  onCardClick: (item: VideoItem, isFront: boolean, index: number) => void;
  setHovered: (hovered: boolean) => void;
}

const CarouselCard = ({
  item,
  index,
  total,
  time,
  radius,
  vertical,
  isDragging,
  dragMoved,
  onCardClick,
  setHovered,
}: CarouselCardProps) => {
  const angle = useTransform(time, (t: number) => t + (index / total) * 2 * Math.PI);

  const x = useTransform(angle, (a: number) => Math.sin(-a) * radius);
  const z = useTransform(angle, (a: number) => Math.cos(-a));

  // Subtle 3D rotation angle clamped to prevent harsh cutting/overlap
  const rotateY = useTransform(angle, (a: number) => {
    let norm = (-a) % (2 * Math.PI);
    if (norm > Math.PI) norm -= 2 * Math.PI;
    if (norm < -Math.PI) norm -= 2 * Math.PI;
    const factor = vertical ? 0.18 : 0.22;
    const deg = -norm * (180 / Math.PI) * factor;
    const maxRot = vertical ? 15 : 18;
    return Math.max(-maxRot, Math.min(maxRot, deg));
  });

  const scale = useTransform(z, (zVal: number) => {
    const norm = (zVal + 1) / 2;
    const baseScale = vertical ? 0.75 : 0.72;
    return baseScale + norm * (1 - baseScale);
  });

  const opacity = useTransform(z, (zVal: number) => {
    if (zVal <= -0.25) return 0;
    return Math.min(1, (zVal + 0.25) / 0.75);
  });

  // Strict z-index hierarchy ensuring front card is always on top without 3D polygon clipping
  const zIndex = useTransform(z, (zVal: number) => {
    if (zVal > 0.85) return 60;
    if (zVal > 0.25) return 30;
    if (zVal > -0.2) return 10;
    return 1;
  });

  const filter = useTransform(z, (zVal: number) => {
    const b = Math.max(0.4, 0.5 + Math.max(0, zVal) * 0.5);
    const blur = Math.max(0, (0.55 - zVal) * 2.0);
    return `brightness(${b}) blur(${blur}px)`;
  });

  const ringOpacity = useTransform(z, (zVal: number) => {
    return Math.max(0, (zVal - 0.78) / 0.22);
  });

  const pointerEvents = useTransform(z, (zVal: number) => (zVal > -0.2 ? "auto" : "none"));

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDragging.current || Math.abs(dragMoved.current) > 6) {
      return;
    }
    const currentAngle = angle.get();
    let norm = (-currentAngle) % (2 * Math.PI);
    if (norm > Math.PI) norm -= 2 * Math.PI;
    if (norm < -Math.PI) norm += 2 * Math.PI;
    const isFront = Math.abs(norm) < 0.28;
    onCardClick(item, isFront, index);
  };

  return (
    <motion.div
      style={{
        x,
        scale,
        opacity,
        zIndex,
        filter,
        rotateY,
        pointerEvents: pointerEvents as any,
      }}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`absolute select-none cursor-pointer rounded-2xl overflow-hidden bg-card border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7)] group transition-colors duration-300 ${
        vertical
          ? "w-[160px] sm:w-[200px] md:w-[240px] aspect-[9/16]"
          : "w-[270px] sm:w-[350px] md:w-[440px] lg:w-[480px] aspect-video"
      }`}
    >
      <img
        src={item.thumbnail}
        alt={item.title}
        className="w-full h-full object-cover select-none pointer-events-none group-hover:scale-105 transition-transform duration-700 ease-out"
        draggable={false}
      />

      {/* Front active glowing ring */}
      <motion.div
        style={{ opacity: ringOpacity }}
        className="absolute inset-0 rounded-2xl pointer-events-none border-2 border-primary shadow-[0_0_35px_rgba(168,85,247,0.4)]"
      />

      {/* Play button overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`rounded-full bg-primary/25 backdrop-blur-md flex items-center justify-center border border-primary/40 group-hover:bg-primary/45 group-hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.45)] ${
          vertical ? "w-11 h-11 sm:w-13 sm:h-13" : "w-12 h-12 sm:w-14 sm:h-14"
        }`}>
          <Play className={`text-primary fill-primary ml-0.5 ${vertical ? "w-4 h-4 sm:w-5 sm:h-5" : "w-5 h-5"}`} />
        </div>
      </div>

      {/* Bottom Title Bar */}
      <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-background/95 via-background/70 to-transparent pointer-events-none">
        <p className="text-xs sm:text-sm font-semibold text-white truncate drop-shadow-md">
          {item.title}
        </p>
      </div>
    </motion.div>
  );
};

const VideoSection = ({
  title,
  subtitle,
  items,
  vertical = false,
  moreLink,
}: VideoSectionProps) => {
  const time = useMotionValue(0);
  const [radius, setRadius] = useState(() => (vertical ? 340 : 470));
  const [isHovered, setIsHovered] = useState(false);
  const isPointerDown = useRef(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startTime = useRef(0);
  const dragMoved = useRef(0);
  const [activeDot, setActiveDot] = useState(0);

  // If items empty, return null
  if (!items || items.length === 0) return null;

  // Ensure minimum number of cards for a full 3D ring without over-crowding
  const displayItems = useMemo(() => {
    if (items.length >= 4) return items;
    if (items.length === 1) return [items[0], items[0], items[0], items[0], items[0]];
    if (items.length === 2) return [...items, ...items, ...items];
    if (items.length === 3) return [...items, ...items];
    return items;
  }, [items]);

  const total = displayItems.length;
  const originalCount = items.length;

  useEffect(() => {
    const updateRadius = () => {
      const w = window.innerWidth;
      const isMobile = w < 640;
      const isTablet = w < 1024;
      if (vertical) {
        setRadius(isMobile ? Math.min(w * 0.42, 170) : isTablet ? 260 : 340);
      } else {
        setRadius(isMobile ? Math.min(w * 0.44, 230) : isTablet ? 360 : 470);
      }
    };
    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, [vertical]);

  useEffect(() => {
    const step = (2 * Math.PI) / total;
    const unsubscribe = time.on("change", (latest) => {
      const rawIndex = Math.round(-latest / step);
      const normalizedIndex = ((rawIndex % originalCount) + originalCount) % originalCount;
      setActiveDot(normalizedIndex);
    });
    return () => unsubscribe();
  }, [total, originalCount, time]);

  // Smooth auto-advance by 1 card every 4.5 seconds (paused on hover or drag)
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      if (!isDragging.current && !isPointerDown.current) {
        const step = (2 * Math.PI) / total;
        const currentStep = Math.round(time.get() / step);
        const targetT = (currentStep - 1) * step;
        animate(time, targetT, {
          type: "spring",
          stiffness: 55,
          damping: 18,
          mass: 0.8,
        });
      }
    }, 4500);

    return () => clearInterval(interval);
  }, [total, isHovered, time]);

  const rotateToVirtualIndex = (vIndex: number) => {
    const step = (2 * Math.PI) / total;
    const targetT = -vIndex * step;
    animate(time, targetT, {
      type: "spring",
      stiffness: 55,
      damping: 18,
      mass: 0.8,
    });
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const step = (2 * Math.PI) / total;
    const currentStep = Math.round(time.get() / step);
    const targetT = (currentStep + 1) * step;
    animate(time, targetT, {
      type: "spring",
      stiffness: 55,
      damping: 18,
      mass: 0.8,
    });
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const step = (2 * Math.PI) / total;
    const currentStep = Math.round(time.get() / step);
    const targetT = (currentStep - 1) * step;
    animate(time, targetT, {
      type: "spring",
      stiffness: 55,
      damping: 18,
      mass: 0.8,
    });
  };

  const handleDotClick = (targetOriginalIndex: number) => {
    const step = (2 * Math.PI) / total;
    const currentT = time.get();
    const currentVirtualIndex = Math.round(-currentT / step);
    let bestVirtualIndex = targetOriginalIndex;
    let minDiff = Infinity;
    for (let offset = -2; offset <= 2; offset++) {
      const candidate = targetOriginalIndex + offset * originalCount;
      const diff = Math.abs(candidate - currentVirtualIndex);
      if (diff < minDiff) {
        minDiff = diff;
        bestVirtualIndex = candidate;
      }
    }
    rotateToVirtualIndex(bestVirtualIndex);
  };

  const handleCardClick = (item: VideoItem, isFront: boolean, itemIndex: number) => {
    if (isFront) {
      if (item.video_url && item.video_url !== "#") {
        window.open(item.video_url, "_blank", "noopener,noreferrer");
      }
    } else {
      const currentT = time.get();
      const offset = (itemIndex / total) * 2 * Math.PI;
      const currentAngle = currentT + offset;
      const nearestMultiple = Math.round(currentAngle / (2 * Math.PI)) * 2 * Math.PI;
      const delta = nearestMultiple - currentAngle;
      const targetT = currentT + delta;
      animate(time, targetT, {
        type: "spring",
        stiffness: 55,
        damping: 18,
        mass: 0.8,
      });
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    isPointerDown.current = true;
    startX.current = e.clientX;
    startTime.current = time.get();
    dragMoved.current = 0;
    setIsHovered(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDown.current) return;
    const dx = e.clientX - startX.current;
    dragMoved.current = dx;
    if (Math.abs(dx) > 8) {
      isDragging.current = true;
    }
    if (isDragging.current) {
      const sensitivity = 0.0028;
      time.set(startTime.current - dx * sensitivity);
    }
  };

  const handlePointerUp = () => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;

    if (isDragging.current) {
      setTimeout(() => {
        isDragging.current = false;
        dragMoved.current = 0;
      }, 80);

      const step = (2 * Math.PI) / total;
      const currentT = time.get();
      const flickThreshold = 35;
      let snapStep = Math.round(currentT / step);

      if (dragMoved.current > flickThreshold) {
        snapStep = Math.ceil(currentT / step);
      } else if (dragMoved.current < -flickThreshold) {
        snapStep = Math.floor(currentT / step);
      }

      const targetT = snapStep * step;
      animate(time, targetT, {
        type: "spring",
        stiffness: 55,
        damping: 18,
        mass: 0.8,
      });
    } else {
      dragMoved.current = 0;
    }

    setIsHovered(false);
  };

  return (
    <section className="section-padding max-w-6xl mx-auto overflow-hidden">
      <SectionHeading title={title} subtitle={subtitle} />

      <div
        className="relative flex items-center justify-center my-6 sm:my-8 touch-pan-y select-none"
        style={{ perspective: 1200 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous video"
          className="absolute left-2 sm:left-4 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/80 hover:bg-background/95 backdrop-blur-md border border-white/10 hover:border-primary/50 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg group cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5 group-hover:text-primary transition-colors" />
        </button>

        {/* 3D Carousel Stage */}
        <div
          className={`relative w-full flex items-center justify-center ${
            vertical
              ? "h-[340px] sm:h-[420px] md:h-[490px]"
              : "h-[260px] sm:h-[340px] md:h-[420px]"
          }`}
        >
          {displayItems.map((item, index) => (
            <CarouselCard
              key={`${item.id}-${index}`}
              item={item}
              index={index}
              total={total}
              time={time}
              radius={radius}
              vertical={vertical}
              isDragging={isDragging}
              dragMoved={dragMoved}
              onCardClick={handleCardClick}
              setHovered={setIsHovered}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          aria-label="Next video"
          className="absolute right-2 sm:right-4 z-50 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-background/80 hover:bg-background/95 backdrop-blur-md border border-white/10 hover:border-primary/50 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg group cursor-pointer"
        >
          <ChevronRight className="w-5 h-5 group-hover:text-primary transition-colors" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2 mt-2 sm:mt-4">
        {items.map((item, idx) => (
          <button
            key={item.id || idx}
            type="button"
            onClick={() => handleDotClick(idx)}
            aria-label={`Go to slide ${idx + 1}: ${item.title}`}
            className={`transition-all duration-300 rounded-full h-2 cursor-pointer ${
              activeDot === idx
                ? "w-8 bg-primary shadow-[0_0_12px_rgba(168,85,247,0.7)]"
                : "w-2 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* See More Link */}
      {moreLink && (
        <div className="flex justify-center mt-8 md:mt-10">
          <Link
            to={moreLink}
            className="text-sm text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-2 group"
          >
            <span>See More</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      )}
    </section>
  );
};

export default VideoSection;
