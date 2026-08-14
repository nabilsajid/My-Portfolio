import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import SectionHeading from "./SectionHeading";
import * as Icons from "lucide-react";
import { supabase } from "@/lib/supabase";

const AchievementsSection = () => {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('id', { ascending: true });
        
      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error("Error fetching achievements:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="achievements" className="section-padding relative overflow-hidden">
    <div className="relative max-w-4xl mx-auto">
      <SectionHeading title="Projects & Achievements" />
      <div className="relative border-l border-border pl-8 space-y-4">
        {loading ? (
          <div className="text-muted-foreground animate-pulse py-8">Loading achievements...</div>
        ) : achievements.length === 0 ? (
          <div className="text-muted-foreground py-8">No achievements listed yet.</div>
        ) : (
          achievements.map((item, i) => {
            const Icon = (Icons as any)[item.icon] || Icons.Award;
            return (
              <motion.div
                key={item.id || item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ x: 12, transition: { duration: 0.3 } }}
                className="relative group cursor-default"
              >
                <div className="absolute -left-[41px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-background group-hover:scale-[1.8] group-hover:shadow-[0_0_20px_hsl(var(--primary)/0.7),0_0_40px_hsl(var(--primary)/0.3)] transition-all duration-400" />
                <div className="absolute -left-[1px] top-0 w-[2px] h-full bg-transparent group-hover:bg-gradient-to-b group-hover:from-primary/60 group-hover:via-primary/20 group-hover:to-transparent transition-all duration-500" />
                <div className="p-5 -m-5 rounded-2xl transition-all duration-400 border border-transparent group-hover:bg-gradient-to-r group-hover:from-card/80 group-hover:to-card/40 group-hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.25),0_4px_20px_-5px_hsl(var(--primary)/0.1)] group-hover:border-primary/15 group-hover:backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-primary opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
                    <p className="text-xs text-primary uppercase tracking-widest font-medium group-hover:text-accent transition-colors duration-300">{item.role}</p>
                  </div>
                  <h3 className="text-lg font-semibold mt-1 group-hover:text-primary transition-colors duration-300">{item.title}</h3>
                  {/* Description: hidden by default, revealed on hover */}
                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] opacity-0 group-hover:opacity-100 transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    <div className="overflow-hidden">
                      <p className="mt-2 text-sm text-secondary-foreground translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">{item.description}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  </section>
  );
};

export default AchievementsSection;