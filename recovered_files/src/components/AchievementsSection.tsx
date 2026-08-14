import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { Film, Camera, Clapperboard, Video, Eye, Aperture, Monitor } from "lucide-react";

const achievements = [
  { title: "BYD Bangladesh", role: "Video Content Lead", description: "Led video content creation for BYD Bangladesh, overseeing video direction and editing. Directed video shoots, captured high-quality visuals, and produced engaging content.", icon: Film },
  { title: "MARICO Over the Wall", role: "Video Content Lead", description: "Managed the full process from concept development to final delivery, including video editing and color grading.", icon: Clapperboard },
  { title: "BFF eGames National Qualifier", role: "Media Content Lead", description: "Led content creation for the BFF eGames National Qualifier, overseeing photography, video direction, and editing. Produced a cohesive visual narrative that showcased the event's dynamic atmosphere.", icon: Monitor },
  { title: "EWU National Robofest", role: "Production Lead", description: "Led media production for East West University National Robofest 2025, overseeing photography, video direction, and editing.", icon: Video },
  { title: "EWU Research Day", role: "Visual Director", description: "Led the visual production for EWU Research Day. Directed video shoots, captured high-quality visuals, and delivered a polished and engaging final output.", icon: Eye },
  { title: "Airtel Mobile Mania", role: "Director of Photography", description: "Served as Director of Photography and oversaw visual direction, ensured high-quality footage, and managed the cinematography team.", icon: Aperture },
  { title: "EBlaze Championship Women's Series Valorant S02 & S03", role: "Media Content Lead", description: "Led content creation for the EBlaze Championship Women's Series Valorant Season 02 and 03, powered by EMK Center.", icon: Camera },
];

const AchievementsSection = () => (
  <section id="achievements" className="section-padding relative overflow-hidden">
    <div className="relative max-w-4xl mx-auto">
      <SectionHeading title="Projects & Achievements" />
      <div className="relative border-l border-border pl-8 space-y-4">
        {achievements.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
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
        })}
      </div>
    </div>
  </section>
);

export default AchievementsSection;