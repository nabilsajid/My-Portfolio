import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { Play } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const ShowreelSection = () => {
  const [showreelUrl, setShowreelUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchShowreel = async () => {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('showreel_url')
          .eq('id', 'hero')
          .single();
          
        if (!error && data?.showreel_url) {
          setShowreelUrl(data.showreel_url);
        }
      } catch (err) {
        console.error("Error fetching showreel:", err);
      }
    };
    fetchShowreel();
  }, []);

  return (
    <section id="showreel" className="section-padding max-w-6xl mx-auto">
    <SectionHeading title="Showreel" subtitle="A glimpse into my best work — all in one reel" />
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative aspect-video bg-card border border-border rounded-xl overflow-hidden glow-accent group"
    >
      {showreelUrl ? (
        <iframe 
          src={showreelUrl.includes('watch?v=') ? showreelUrl.replace('watch?v=', 'embed/') : showreelUrl} 
          className="w-full h-full absolute inset-0 z-10" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen 
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-secondary/50">
          <div className="w-20 h-20 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/40 group-hover:bg-primary/30 transition-colors cursor-pointer">
            <Play className="w-8 h-8 text-primary fill-primary" />
          </div>
          <p className="text-sm text-muted-foreground uppercase tracking-widest">Play Showreel</p>
        </div>
      )}
    </motion.div>
  </section>
  );
};

export default ShowreelSection;
