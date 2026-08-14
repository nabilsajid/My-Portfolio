import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import SectionHeading from "./SectionHeading";
import photo1 from "@/assets/photo-1.jpg";
import photo2 from "@/assets/photo-2.jpg";
import photo3 from "@/assets/photo-3.jpg";

const bgImages = [photo1, photo2, photo3];

const ExperienceSection = () => {
  const [currentBg, setCurrentBg] = useState(0);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('id', { ascending: true });
        
      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error("Error fetching experience:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0">
        {bgImages.map((img, i) => (
          <motion.img
            key={i}
            src={img}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: currentBg === i ? 0.12 : 0 }}
            transition={{ duration: 1.5 }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <SectionHeading title="Experience" />
        <div className="relative border-l border-border pl-8 space-y-8">
          {loading ? (
            <div className="text-muted-foreground animate-pulse py-8">Loading experience...</div>
          ) : experiences.length === 0 ? (
            <div className="text-muted-foreground py-8">No experience listed yet.</div>
          ) : (
            experiences.map((exp, i) => (
              <motion.div
                key={exp.id || exp.role}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 12, transition: { duration: 0.3 } }}
                className="relative group cursor-default"
              >
                <div className="absolute -left-[41px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-background group-hover:scale-[1.8] group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.7),0_0_40px_hsl(var(--primary)/0.3)] transition-all duration-400" />
                <div className="absolute -left-[1px] top-0 w-[2px] h-full bg-transparent group-hover:bg-gradient-to-b group-hover:from-primary/60 group-hover:via-primary/20 group-hover:to-transparent transition-all duration-500" />
                <div className="p-5 -m-5 rounded-2xl transition-all duration-400 border border-transparent group-hover:bg-gradient-to-r group-hover:from-card/80 group-hover:to-card/40 group-hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.25),0_4px_20px_-5px_hsl(var(--primary)/0.1)] group-hover:border-primary/15 group-hover:backdrop-blur-sm">
                  <p className="text-xs text-primary uppercase tracking-widest font-medium group-hover:text-accent transition-colors duration-300">{exp.period}</p>
                  <h3 className="text-lg font-semibold mt-1 group-hover:text-primary transition-colors duration-300">{exp.role}</h3>
                  <p className="text-sm text-muted-foreground group-hover:text-secondary-foreground transition-colors duration-300">{exp.company}</p>
                  <p className="mt-2 text-sm text-secondary-foreground">{exp.description}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
