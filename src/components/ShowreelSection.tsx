import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { Play } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import VideoModal from "./VideoModal";
import showreelPoster from "@/assets/longform-1.jpg";

const ShowreelSection = () => {
  const [showreelUrl, setShowreelUrl] = useState<string | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    const fetchShowreel = async () => {
      try {
        const { data, error } = await supabase
          .from("site_content")
          .select("showreel_url")
          .eq("id", "hero")
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
        onClick={() => setIsVideoModalOpen(true)}
        className="relative aspect-video bg-card border border-white/10 rounded-2xl overflow-hidden glow-accent group cursor-pointer shadow-[0_25px_60px_rgba(0,0,0,0.7)] select-none"
      >
        {/* Cinematic Preview Poster */}
        <img
          src={showreelPoster}
          alt="Showreel Preview"
          className="w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-700 ease-out"
        />

        {/* Ambient Dark Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/35 to-background/50 group-hover:from-background/85 transition-colors" />

        {/* Centered Glowing Play Button & Call to Action */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 sm:gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-primary/25 backdrop-blur-md flex items-center justify-center border border-primary/40 group-hover:bg-primary/45 group-hover:scale-110 transition-all duration-300 shadow-[0_0_35px_rgba(168,85,247,0.5)]">
            <Play className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 text-primary fill-primary ml-1" />
          </div>
          <div className="flex flex-col items-center gap-1">
            <p className="text-sm sm:text-base font-semibold text-white tracking-widest uppercase drop-shadow-md">
              Watch Showreel
            </p>
            <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
              Click to play inside website
            </span>
          </div>
        </div>
      </motion.div>

      {/* In-page Video Player Modal */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoUrl={showreelUrl || undefined}
        title="Showreel — Nabil Azmal Sajid"
        vertical={false}
      />
    </section>
  );
};

export default ShowreelSection;
