import { useState, useEffect } from "react";
import { motion, useAnimationFrame, useMotionValue, useTransform, animate } from "framer-motion";
import SectionHeading from "./SectionHeading";

import { supabase } from "@/lib/supabase";

// We will fetch these from Supabase now
// const baseImages = [...]
// const testimonyImages = [...]

const CarouselItem = ({ image, index, total, time, radius, setHovered }: any) => {
  const x = useTransform(time, (t: number) => {
    const angle = t + (index / total) * 2 * Math.PI;
    return Math.sin(-angle) * radius;
  });

  const z = useTransform(time, (t: number) => {
    const angle = t + (index / total) * 2 * Math.PI;
    return Math.cos(-angle);
  });

  const scale = useTransform(z, (zVal: number) => 0.5 + ((zVal + 1) / 2) * 0.5);
  const opacity = useTransform(z, (zVal: number) => {
    if (zVal <= -0.2) return 0;
    return (zVal + 0.2) / 1.2;
  });
  const zIndex = useTransform(z, (zVal: number) => Math.round(zVal * 100));
  const filter = useTransform(z, (zVal: number) => {
    const b = zVal > 0 ? Math.pow(zVal, 2) : 0;
    return `brightness(${0.2 + b * 0.8})`;
  });

  const handleClick = () => {
    const currentT = time.get();
    const offset = (index / total) * 2 * Math.PI;
    const currentAngle = currentT + offset;
    const nearestMultiple = Math.round(currentAngle / (2 * Math.PI)) * 2 * Math.PI;
    const distanceToMove = nearestMultiple - currentAngle;
    const targetT = currentT + distanceToMove;

    animate(time, targetT, { type: "spring", stiffness: 50, damping: 15 });
  };

  return (
    <motion.div
      style={{ x, scale, opacity, zIndex, filter }}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="absolute w-[250px] sm:w-[350px] md:w-[400px] aspect-square rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card cursor-pointer"
    >
      <img 
        src={image} 
        alt={`Testimony ${index + 1}`} 
        className="w-full h-full object-cover pointer-events-none" 
      />
    </motion.div>
  );
};

const TestimonialsSection = () => {
  const time = useMotionValue(0);
  const [radius, setRadius] = useState(400);
  const [isHovered, setIsHovered] = useState(false);
  const [testimonyImages, setTestimonyImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        // Double up images if there are too few to make a nice circle
        const images = data.map(row => row.image_url);
        setTestimonyImages(images.length < 6 ? [...images, ...images] : images);
      } else {
        setTestimonyImages([]);
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    const updateRadius = () => {
      setRadius(Math.min(window.innerWidth * 0.45, 650));
    };
    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, []);

  useAnimationFrame((t, delta) => {
    if (!isHovered) {
      time.set(time.get() + delta * 0.00012);
    }
  });

  return (
    <section className="section-padding max-w-6xl mx-auto overflow-hidden">
      <SectionHeading title="Client Testimonials" subtitle="What people are saying" />
      
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center mt-8 sm:mt-12">
        {testimonyImages.map((image, index) => (
          <CarouselItem 
            key={index} 
            image={image} 
            index={index} 
            total={testimonyImages.length} 
            time={time} 
            radius={radius}
            setHovered={setIsHovered}
          />
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
