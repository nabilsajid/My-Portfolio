import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
}

const LightboxModal = ({ isOpen, onClose, images, initialIndex = 0 }: LightboxModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Update internal index when opened with a new initialIndex
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialIndex]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setCurrentIndex((prev) => (prev + 1) % images.length);
      if (e.key === "ArrowLeft") setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, images.length, onClose]);

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 p-2 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          {images.length > 1 && (
            <button
              onClick={handlePrev}
              className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-50 p-3 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition-all"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 p-4 md:p-12 pb-16 flex items-center justify-center pointer-events-none"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[currentIndex]}
                alt={`Gallery image ${currentIndex + 1}`}
                className="w-full h-full object-contain pointer-events-auto"
              />
            </motion.div>
          </AnimatePresence>

          {images.length > 1 && (
            <button
              onClick={handleNext}
              className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-50 p-3 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 rounded-full transition-all"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}
          
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 text-white/70 text-sm tracking-widest font-medium bg-black/50 px-4 py-2 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default LightboxModal;