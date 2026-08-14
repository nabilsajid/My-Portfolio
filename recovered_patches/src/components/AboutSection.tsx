import { motion } from "framer-motion";
import SectionHeading from "./SectionHeading";
import { useQuery } from "@tanstack/react-query";
import { getHomeContent } from "@/lib/db";
import { 
  Video, 
  MonitorPlay, 
  Image as ImageIcon, 
  Camera, 
  Film 
} from "lucide-react";

const skillIcons: Record<string, React.ReactNode> = {
  "Premiere Pro": <Video className="w-12 h-12 text-[#9999FF]" />,
  "After Effects": <MonitorPlay className="w-12 h-12 text-[#9999FF]" />,
  "Photoshop": <ImageIcon className="w-12 h-12 text-[#31A8FF]" />,
  "Lightroom": <Camera className="w-12 h-12 text-[#31A8FF]" />,
  "DaVinci Resolve": <Film className="w-12 h-12 text-[#E55B5B]" />,
  "Video Editing": <Video className="w-12 h-12 text-[#9999FF]" />,
  "Photography": <ImageIcon className="w-12 h-12 text-[#31A8FF]" />
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { scale: 3, y: -200, opacity: 0 },
  visible: { 
    scale: 1, 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 200,
      damping: 12,
      bounce: 0.6, 
      duration: 1.2 
    }
  }
};

const AboutSection = () => {
  const { data: homeContent } = useQuery({
    queryKey: ['homeContent'],
    queryFn: getHomeContent
  });

  const aboutText = homeContent?.about_text || [
    "I'm a multi-disciplinary creative professional with a passion for visual storytelling. With years of experience across video editing and photography, I bring a unique perspective to every project.",
    "My work spans from cinematic long-form content to scroll-stopping short-form edits, paired with photography that captures the moment. Every frame, every pixel, every cut is intentional.",
    "I believe great visuals don't just look good — they communicate, persuade, and inspire action."
  ];

  // Provide a default list of software if the database only has the basic "Video Editing" and "Photography"
  const defaultSkills = ["Premiere Pro", "After Effects", "Photoshop", "Lightroom", "DaVinci Resolve"];
  
  let dbSkills = homeContent?.about_skills || [];
  // In case it's stored as a JSON string instead of an array
  if (typeof dbSkills === 'string') {
    try {
      dbSkills = JSON.parse(dbSkills);
    } catch (e) {
      dbSkills = [];
    }
  }
  
  const isArray = Array.isArray(dbSkills);
  const skills = (isArray && dbSkills.length > 2) ? dbSkills : defaultSkills;

  return (
  <section id="about" className="section-padding max-w-6xl mx-auto">
    <SectionHeading title="About Me" />
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="grid md:grid-cols-2 gap-10 items-center"
    >
      <div className="space-y-5 text-secondary-foreground leading-relaxed">
        {aboutText.map((paragraph: string, index: number) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-2 sm:grid-cols-3 gap-6"
      >
        {skills.map((skill: string) => (
          <motion.div
            key={skill}
            variants={itemVariants}
            whileHover={{ scale: 1.1, y: -5, transition: { type: "spring", stiffness: 300 } }}
            className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-4 cursor-pointer group shadow-lg hover:shadow-primary/20 transition-all duration-300 min-h-[140px]"
          >
            {/* Soft background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            
            {/* The Logo */}
            <div className="relative z-10 drop-shadow-md group-hover:drop-shadow-[0_0_15px_rgba(var(--primary),0.5)] transition-all duration-300">
              {skillIcons[skill] || <div className="w-12 h-12 rounded-full bg-primary/20" />}
            </div>
            
            {/* The Label */}
            <span className="relative z-10 text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-300 text-center">
              {skill}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  </section>
  );
};

export default AboutSection;
