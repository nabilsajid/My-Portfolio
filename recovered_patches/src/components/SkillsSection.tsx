import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { supabase } from "@/lib/supabase";

const SkillsSection = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .order('order_index', { ascending: true });
        
        if (error) throw error;
        setSkills(data || []);
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  if (loading) {
    return (
      <section className="section-padding max-w-4xl mx-auto">
        <SectionHeading title="Core Skills" subtitle="Tools and software I work with daily" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse flex flex-col gap-2">
              <div className="h-4 bg-secondary/50 rounded w-1/3"></div>
              <div className="h-2 bg-secondary rounded-full w-full"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding max-w-4xl mx-auto">
      <SectionHeading title="Core Skills" subtitle="Tools and software I work with daily" />
      <div className="space-y-4">
        {skills.map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
          >
            <div className="flex justify-between mb-1.5">
              <span className="text-sm font-medium">{skill.name}</span>
              <span className="text-sm text-muted-foreground">{skill.level}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: i * 0.07 + 0.3, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-primary to-teal-glow glow-accent"
              />
            </div>
            <button
              onClick={() => setExpanded(expanded === skill.name ? null : skill.name)}
              className="flex items-center gap-1 mt-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              See more
              <ChevronDown className={`w-3 h-3 transition-transform ${expanded === skill.name ? "rotate-180" : ""}`} />
            </button>
            <motion.div
              initial={false}
              animate={{ height: expanded === skill.name ? "auto" : 0, opacity: expanded === skill.name ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <p className="text-xs text-muted-foreground pt-1 pb-2 leading-relaxed">{skill.details}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SkillsSection;
