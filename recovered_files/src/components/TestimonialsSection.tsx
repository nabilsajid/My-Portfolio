import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";

// Placeholder images - you can replace these with your actual client images
const testimonyImages = [
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80",
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80",
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonyImages.length);
    }, 3000); // Slides every 3 seconds
    return () => clearInterval(timer);
  }, []);

  const getCardStyles = (index: number) => {
    const diff = (index - currentIndex + testimonyImages.length) % testimonyImages.length;
    
    // Center item
    if (diff === 0) {
      return {
        scale: 1,
        opacity: 1,
        x: "0%",
        zIndex: 30,
        filter: "brightness(1)",
      };
    }
    // Immediate Right
    if (diff === 1) {
      return {
        scale: 0.8,
        opacity: 0.7,
        x: "70%",
        zIndex: 20,
        filter: "brightness(0.4)",
      };
    }
    // Immediate Left
    if (diff === testimonyImages.length - 1) {
      return {
        scale: 0.8,
        opacity: 0.7,
        x: "-70%",
        zIndex: 20,
        filter: "brightness(0.4)",
      };
    }
    // Far Right
    if (diff === 2) {
      return {
        scale: 0.6,
        opacity: 0.3,
        x: "130%",
        zIndex: 10,
        filter: "brightness(0.1)",
      };
    }
    // Far Left
    if (diff === testimonyImages.length - 2) {
      return {
        scale: 0.6,
        opacity: 0.3,
        x: "-130%",
        zIndex: 10,
        filter: "brightness(0.1)",
      };
    }
    // Hidden (if more than 5 images)
    return {
      scale: 0.5,
      opacity: 0,
      x: "0%",
      zIndex: 0,
      filter: "brightness(0)",
    };
  };

  return (
    <section className="section-padding max-w-6xl mx-auto overflow-hidden">
      <SectionHeading title="Client Testimonials" subtitle="What people are saying" />
      
      <div className="relative h-[250px] sm:h-[350px] md:h-[450px] flex items-center justify-center mt-8 sm:mt-12">
        {testimonyImages.map((image, index) => {
          const styles = getCardStyles(index);
          return (
            <motion.div
              key={index}
              initial={false}
              animate={styles}
              transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
              className="absolute w-[65%] sm:w-[50%] md:w-[600px] aspect-video rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card"
            >
              <img 
                src={image} 
                alt={`Testimony ${index + 1}`} 
                className="w-full h-full object-cover pointer-events-none" 
              />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default TestimonialsSection;
