import { motion } from "framer-motion";
import { ArrowLeft, Play } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ShowcasePageProps {
  title: string;
  subtitle: string;
  items: { id: number; title: string; thumbnail?: string; image?: string; video_url?: string }[];
  type?: "video" | "gallery";
  vertical?: boolean;
}

const bentoPatterns = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
];

const ShowcasePage = ({ title, subtitle, items, type = "video", vertical = false }: ShowcasePageProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="section-padding max-w-6xl mx-auto pt-24">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold mb-3"
        >
          {title}
        </motion.h1>
        <p className="text-muted-foreground mb-12">{subtitle}</p>

        {type === "gallery" ? (
          <div className="grid grid-cols-3 auto-rows-[200px] md:auto-rows-[250px] gap-3">
            {items.map((item, i) => (
              <motion.div
                key={item.title + i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`group relative bg-card border border-border rounded-lg overflow-hidden ${bentoPatterns[i % bentoPatterns.length]}`}
              >
                <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="absolute bottom-3 left-3 text-sm font-medium">{item.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ) : vertical ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item, i) => (
              <motion.a
                key={item.id + "-" + i}
                href={item.video_url || '#'}
                target={item.video_url ? "_blank" : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative aspect-[9/16] bg-card border border-border rounded-lg overflow-hidden cursor-pointer block"
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
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {items.map((item, i) => (
              <motion.a
                key={item.id + "-" + i}
                href={item.video_url || '#'}
                target={item.video_url ? "_blank" : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
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
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ShowcasePage;
