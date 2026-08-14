import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import SectionHeading from "./SectionHeading";
import { Play } from "lucide-react";

interface VideoSectionProps {
  title: string;
  subtitle: string;
  items: { id: number; title: string; thumbnail: string; video_url?: string }[];
  columns?: number;
  vertical?: boolean;
  moreLink?: string;
}

const VideoSection = ({ title, subtitle, items, columns = 2, vertical = false, moreLink }: VideoSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);

  if (vertical) {
    return (
      <section className="section-padding max-w-6xl mx-auto">
        <SectionHeading title={title} subtitle={subtitle} />
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {items.slice(0, 4).map((item, i) => (
            <motion.a
              key={item.id}
              href={item.video_url || '#'}
              target={item.video_url ? "_blank" : undefined}
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative aspect-[9/16] w-[200px] md:w-[240px] flex-shrink-0 snap-start bg-card border border-border rounded-lg overflow-hidden cursor-pointer block"
            >
              <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/30 group-hover:bg-primary/40 transition-colors">
                  <Play className="w-4 h-4 text-primary fill-primary" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/90 to-transparent">
                <p className="text-xs font-medium">{item.title}</p>
              </div>
            </motion.a>
          ))}
        </div>
        {moreLink && (
          <div className="flex justify-center mt-10 md:mt-12">
            <Link to={moreLink} className="text-sm text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
              See More
            </Link>
          </div>
        )}
      </section>
    );
  }

  const visibleItems = showAll ? items : items.slice(0, 4);

  return (
    <section className="section-padding max-w-6xl mx-auto">
      <SectionHeading title={title} subtitle={subtitle} />
      <div className={`grid ${columns === 2 ? "md:grid-cols-2" : "grid-cols-2 md:grid-cols-3"} gap-4`}>
        {visibleItems.map((item, i) => (
          <motion.a
            key={item.title + i}
            href={item.video_url || '#'}
            target={item.video_url ? "_blank" : undefined}
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group relative aspect-video bg-card border border-border rounded-lg overflow-hidden cursor-pointer block"
          >
            <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/30 group-hover:bg-primary/40 transition-colors">
                <Play className="w-4 h-4 text-primary fill-primary" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background/90 to-transparent">
              <p className="text-xs font-medium">{item.title}</p>
            </div>
          </motion.a>
        ))}
      </div>
      {moreLink && (
        <div className="flex justify-center mt-10 md:mt-12">
          <Link to={moreLink} className="text-sm text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest">
            See More
          </Link>
        </div>
      )}
    </section>
  );
};

export default VideoSection;
