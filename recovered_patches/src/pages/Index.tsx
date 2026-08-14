import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import useSmoothScroll from "@/hooks/use-smooth-scroll";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ShowreelSection from "@/components/ShowreelSection";
import ClientsSection from "@/components/ClientsSection";
import VideoSection from "@/components/VideoSection";
import GallerySection from "@/components/GallerySection";
import StatsSection from "@/components/StatsSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import AchievementsSection from "@/components/AchievementsSection";
import FAQSection from "@/components/FAQSection";
import PricingSection from "@/components/PricingSection";
import ContactSection from "@/components/ContactSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";

import longform1 from "@/assets/longform-1.jpg";
import longform2 from "@/assets/longform-2.jpg";
import longform3 from "@/assets/longform-3.jpg";
import shortform1 from "@/assets/shortform-1.jpg";
import shortform2 from "@/assets/shortform-2.jpg";
import poster1 from "@/assets/poster-1.jpg";
import poster2 from "@/assets/poster-2.jpg";
import photo1 from "@/assets/photo-1.jpg";
import photo2 from "@/assets/photo-2.jpg";
import photo3 from "@/assets/photo-3.jpg";

import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@/lib/db";

const imageMap: Record<string, string> = {
  '/src/assets/longform-1.jpg': longform1,
  '/src/assets/longform-2.jpg': longform2,
  '/src/assets/longform-3.jpg': longform3,
  '/src/assets/shortform-1.jpg': shortform1,
  '/src/assets/shortform-2.jpg': shortform2,
  '/src/assets/poster-1.jpg': poster1,
  '/src/assets/poster-2.jpg': poster2,
  '/src/assets/photo-1.jpg': photo1,
  '/src/assets/photo-2.jpg': photo2,
  '/src/assets/photo-3.jpg': photo3,
};

const Index = () => {
  useSmoothScroll();

  const [dbProjects, setDbProjects] = useState(projects);

  useEffect(() => {
    // Ensure we always start at the home screen (top) on reload
    window.scrollTo(0, 0);
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    
    // Fetch live projects from Supabase
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: true });
        if (!error && data && data.length > 0) {
          setDbProjects(data);
        }
      } catch (err) {
        console.error("Error fetching live projects:", err);
      }
    };
    fetchProjects();
  }, []);

  const projects = [
    { id: 1, title: 'Cinematic Brand Film', category: 'long-form', image_url: '/src/assets/longform-1.jpg', video_url: 'https://youtube.com' },
    { id: 2, title: 'Documentary Highlight', category: 'long-form', image_url: '/src/assets/longform-2.jpg', video_url: 'https://youtube.com' },
    { id: 3, title: 'Corporate Event Coverage', category: 'long-form', image_url: '/src/assets/longform-3.jpg', video_url: 'https://youtube.com' },
    { id: 11, title: 'Music Video Production', category: 'long-form', image_url: '/src/assets/longform-1.jpg', video_url: 'https://youtube.com' },
    { id: 12, title: 'Travel Vlog Cinematic', category: 'long-form', image_url: '/src/assets/longform-2.jpg', video_url: 'https://youtube.com' },
    { id: 13, title: 'Real Estate Tour', category: 'long-form', image_url: '/src/assets/longform-3.jpg', video_url: 'https://youtube.com' },
    { id: 4, title: 'TikTok Viral Edit', category: 'short-form', image_url: '/src/assets/shortform-1.jpg', video_url: 'https://youtube.com' },
    { id: 5, title: 'Instagram Reel Promo', category: 'short-form', image_url: '/src/assets/shortform-2.jpg', video_url: 'https://youtube.com' },
    { id: 14, title: 'YouTube Shorts Highlight', category: 'short-form', image_url: '/src/assets/shortform-1.jpg', video_url: 'https://youtube.com' },
    { id: 15, title: 'Fitness Promo Reel', category: 'short-form', image_url: '/src/assets/shortform-2.jpg', video_url: 'https://youtube.com' },
    { id: 16, title: 'Travel Montage', category: 'short-form', image_url: '/src/assets/shortform-1.jpg', video_url: 'https://youtube.com' },
    { id: 6, title: 'E-Sports Tournament', category: 'poster', image_url: '/src/assets/poster-1.jpg', label: 'Graphic Design' },
    { id: 7, title: 'University Event', category: 'poster', image_url: '/src/assets/poster-2.jpg', label: 'Key Visual' },
    { id: 8, title: 'Concert Photography', category: 'photography', image_url: '/src/assets/photo-1.jpg', label: 'Live Event' },
    { id: 9, title: 'Product Shoot', category: 'photography', image_url: '/src/assets/photo-2.jpg', label: 'Commercial' },
    { id: 10, title: 'Portrait Series', category: 'photography', image_url: '/src/assets/photo-3.jpg', label: 'Studio' },
    { id: 17, title: 'Wedding Stills', category: 'photography', image_url: '/src/assets/photo-1.jpg', label: 'Event' },
    { id: 18, title: 'Fashion Editorial', category: 'photography', image_url: '/src/assets/photo-2.jpg', label: 'Fashion' },
    { id: 19, title: 'Architectural Shots', category: 'photography', image_url: '/src/assets/photo-3.jpg', label: 'Architecture' }
  ];

  const longFormItems = dbProjects
    .filter((p: any) => p.category === 'long-form')
    .map((p: any) => ({ id: p.id, title: p.title, thumbnail: imageMap[p.image_url] || p.image_url, video_url: p.video_url }));

  const shortFormItems = dbProjects
    .filter((p: any) => p.category === 'short-form')
    .map((p: any) => ({ id: p.id, title: p.title, thumbnail: imageMap[p.image_url] || p.image_url, video_url: p.video_url }));

  const posterItems = dbProjects
    .filter((p: any) => p.category === 'poster')
    .map((p: any) => ({ id: p.id, title: p.title, image: imageMap[p.image_url] || p.image_url }));

  const photoItems = dbProjects
    .filter((p: any) => p.category === 'photography')
    .map((p: any) => ({ 
      id: p.id, 
      title: p.title, 
      image: imageMap[p.image_url] || p.image_url, 
      label: p.label || '',
      gallery_images: p.gallery_images?.map((img: string) => imageMap[img] || img) || [] 
    }));

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-background overflow-hidden"
    >
      <HeroSection />
      <ShowreelSection />
      <ClientsSection />
      <TestimonialsSection />
      <div id="longform">
        <VideoSection
          title="Long Form Content"
          subtitle="Cinematic edits, documentaries, and brand films"
          items={longFormItems}
          moreLink="/long-form"
        />
      </div>
      <VideoSection
        title="Short Form Content"
        subtitle="Scroll-stopping reels and social media edits"
        items={shortFormItems}
        vertical
        moreLink="/short-form"
      />
      <GallerySection title="Photography" subtitle="Stills that tell a story" items={photoItems} />
      <StatsSection />
      <div id="skills">
        <SkillsSection />
      </div>
      <div id="experience">
        <ExperienceSection />
      </div>
      <div id="achievements">
        <AchievementsSection />
      </div>
      <PricingSection />
      <div id="faq">
        <FAQSection />
      </div>
      <ContactSection />
      <Footer />
    </motion.div>
  );
};

export default Index;

// Photography section with hover labels and links to category pages
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SectionHeading from "@/components/SectionHeading";

const bentoPatterns = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-2",
  "md:col-span-1 md:row-span-2",
  "md:col-span-2 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
];

const categorySlugMap: Record<string, string> = {
  "Corporate Event": "corporate-event",
  "Product Photography": "product-photography",
  "Fashion Shoot": "fashion-shoot",
  "Portrait": "portrait",
  "Nature": "nature",
  "Lifestyle": "lifestyle",
};

const PhotographySection = ({ items }: { items: { id: number; title: string; image: string; label: string }[] }) => (
  <section className="section-padding max-w-6xl mx-auto">
    <SectionHeading title="Photography" subtitle="Capturing moments that tell stories" />
    <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[200px] md:auto-rows-[250px] gap-3">
      {items.map((item, i) => (
        <Link
          key={item.id + "-" + i}
          to={`/project/${item.id}`}
          className={`group relative bg-card border border-border rounded-lg overflow-hidden cursor-pointer ${bentoPatterns[i % bentoPatterns.length]}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="w-full h-full"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
              <p className="p-4 text-sm md:text-base font-semibold text-foreground">{item.label || item.title}</p>
            </div>
          </motion.div>
        </Link>
      ))}
    </div>
  </section>
);
