import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { getHomeContent } from "@/lib/db";
import heroDesktop from "@/assets/hero-desktop.png";
import heroMobile from "@/assets/hero-mobile.png";
const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);

  const [content, setContent] = useState({
    title: "Nabil Azmal Sajid",
    tagline: "Creative Director · Editor · Cinematographer · Photographer",
    description: "",
    hero_image_desktop: "",
    hero_image_mobile: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getHomeContent();
        if (data) {
          setContent({
            title: data.name || "Nabil Azmal Sajid",
            tagline: data.tagline || "Creative Director · Editor · Cinematographer · Photographer",
            description: "",
            hero_image_desktop: (!data.hero_image_desktop_url || data.hero_image_desktop_url.includes('src/assets/')) 
              ? heroDesktop 
              : data.hero_image_desktop_url,
            hero_image_mobile: (!data.hero_image_mobile_url || data.hero_image_mobile_url.includes('src/assets/'))
              ? heroMobile
              : data.hero_image_mobile_url
          });
        }
      } catch (error) {
        console.error("Error fetching hero content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const nameParts = content.title.split(" ");
  const lastName = nameParts.pop();
  const firstNames = nameParts.join(" ");

  return (
  <section ref={sectionRef} className="relative min-h-screen flex items-center overflow-hidden">
    {/* Animated gradient background */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-background" />
      <motion.div
        animate={{
          x: [0, 80, -40, 60, 0],
          y: [0, -60, 40, -20, 0],
          scale: [1, 1.2, 0.9, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-primary/15 blur-[180px]"
      />
      <motion.div
        animate={{
          x: [0, -70, 50, -30, 0],
          y: [0, 50, -60, 30, 0],
          scale: [1, 0.85, 1.15, 0.95, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-accent/12 blur-[160px]"
      />
      <motion.div
        animate={{
          x: [0, 40, -60, 20, 0],
          y: [0, -40, 20, -50, 0],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/8 blur-[200px]"
      />
      <motion.div
        animate={{
          x: [0, -50, 30, -20, 0],
          y: [0, 30, -40, 50, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[10%] right-[15%] w-[400px] h-[400px] rounded-full bg-accent/8 blur-[140px]"
      />
      {/* Radial glow behind image area */}
      <motion.div style={{ scale: glowScale }} className="absolute top-1/2 left-[30%] -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-primary/30 blur-[300px]" />
      <motion.div style={{ scale: glowScale }} className="absolute top-[40%] left-[25%] w-[700px] h-[700px] rounded-full bg-accent/25 blur-[250px]" />
      <div className="absolute bottom-[20%] right-[20%] w-[600px] h-[600px] rounded-full bg-primary/15 blur-[220px]" />
      <div className="absolute top-[60%] left-[50%] w-[500px] h-[500px] rounded-full bg-accent/10 blur-[200px]" />
      <div className="absolute inset-0 backdrop-blur-[1px] bg-background/20" />
    </div>

    {/* Content: image left, name+skills right */}
    <motion.div style={{ y: imageY }} className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center gap-10 md:gap-16">
      {/* Portrait image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-[106vw] max-w-[525px] md:w-[650px] md:max-w-none lg:w-[780px] flex-shrink-0"
      >
        <img
          src={content.hero_image_desktop || heroDesktop}
          alt={content.title}
          className="hidden md:block w-full h-auto"
        />
        <img
          src={content.hero_image_mobile || heroMobile}
          alt={content.title}
          className="md:hidden w-full h-auto"
        />
      </motion.div>

      {/* Name and skills */}
      <motion.div
        style={{ y: textY }}
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
        className="text-center md:text-left"
      >
        <motion.h1
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="text-3xl md:text-6xl lg:text-7xl font-bold leading-[0.95] tracking-tight whitespace-nowrap"
        >
          <span className="hidden md:inline">{firstNames}<br /><span className="text-gradient">{lastName}</span></span>
          <span className="md:hidden">{firstNames} <span className="text-gradient">{lastName}</span></span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-5 text-sm md:text-base text-muted-foreground uppercase tracking-[0.25em]"
        >
          {content.tagline}
        </motion.p>

        <motion.a
          href="#about"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          className="inline-flex items-center gap-2 mt-10 text-sm text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
        >
          Scroll to explore
          <motion.span animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ArrowDown className="w-4 h-4" />
          </motion.span>
        </motion.a>
      </motion.div>
    </motion.div>
    </section>
  );
};

export default HeroSection;
