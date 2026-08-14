import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import SectionHeading from "./SectionHeading";
import LightboxModal from "./LightboxModal";

interface GallerySectionProps {
  title: string;
  subtitle: string;
  items: { id: number; title: string; image: string; label?: string; gallery_images?: string[] }[];
  moreLink?: string;
}

const bentoPatterns = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-2 row-span-1",
  "col-span-2 row-span-1",
];

const GallerySection = ({ title, subtitle, items, moreLink }: GallerySectionProps) => {
  const visibleItems = items.slice(0, 6);
  const [activeGallery, setActiveGallery] = useState<string[]>([]);
  const [initialIndex, setInitialIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Flatten all main images and gallery images into a single array for the lightbox
  const allImages = items.flatMap(item => {
    const images = [item.image];
    if (item.gallery_images && item.gallery_images.length > 0) {
      images.push(...item.gallery_images);
    }
    return images;
  });

  const handleOpenGallery = (item: any) => {
    // Find the index of the clicked item's main image in the allImages array
    const clickedIndex = allImages.findIndex(img => img === item.image);
    setActiveGallery(allImages);
    setInitialIndex(clickedIndex >= 0 ? clickedIndex : 0);
    setIsModalOpen(true);
  };

  return (
    <section className="section-padding max-w-6xl mx-auto">
      <SectionHeading title={title} subtitle={subtitle} />
      <div className="grid grid-cols-3 auto-rows-[200px] md:auto-rows-[250px] gap-3">
        {visibleItems.map((item, i) => (
          <motion.div
            key={item.id}
            onClick={() => handleOpenGallery(item)}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`group relative bg-card border border-border rounded-lg overflow-hidden cursor-pointer ${bentoPatterns[i % bentoPatterns.length]}`}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="absolute bottom-3 left-3 text-sm font-medium">{item.label || item.title}</p>
            </div>
          </motion.div>
        ))}
      </div>
      {moreLink && (
        <div className="flex justify-center mt-6">
          <Link to={moreLink} className="text-sm text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
            See More
          </Link>
        </div>
      )}

      <LightboxModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={activeGallery}
        initialIndex={initialIndex}
      />
    </section>
  );
};

export default GallerySection;
