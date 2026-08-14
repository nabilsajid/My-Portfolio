import { useState, useEffect } from "react";
import ShowcasePage from "./ShowcasePage";
import { supabase } from "@/lib/supabase";
import { imageMap } from "@/data/projects";
import shortform1 from "@/assets/shortform-1.jpg";
import shortform2 from "@/assets/shortform-2.jpg";
import useSmoothScroll from "@/hooks/use-smooth-scroll";

const ShortFormPage = () => {
  useSmoothScroll();
  const [dbProjects, setDbProjects] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('category', 'short-form')
          .order('id', { ascending: true });
          
        if (!error && data) {
          setDbProjects(data);
        }
      } catch (err) {
        console.error("Error fetching live projects:", err);
      }
    };
    fetchProjects();
  }, []);

  const items = dbProjects.length > 0 
    ? dbProjects.map((p: any) => ({
        id: p.id,
        title: p.title,
        thumbnail: imageMap[p.image_url] || p.image_url,
        video_url: p.video_url || '#',
        is_external: !!p.video_url
      }))
    : [
        { id: 1, title: "Product Reel", thumbnail: shortform1, video_url: "https://youtube.com", is_external: true },
        { id: 2, title: "Event Highlights", thumbnail: shortform2, video_url: "https://youtube.com", is_external: true },
        { id: 3, title: "Behind The Scenes", thumbnail: shortform1, video_url: "https://youtube.com", is_external: true },
        { id: 4, title: "Social Edit", thumbnail: shortform1, video_url: "https://youtube.com", is_external: true },
        { id: 5, title: "Brand Story", thumbnail: shortform2, video_url: "https://youtube.com", is_external: true },
        { id: 6, title: "Tutorial Clip", thumbnail: shortform2, video_url: "https://youtube.com", is_external: true },
        { id: 7, title: "Promo Video", thumbnail: shortform1, video_url: "https://youtube.com", is_external: true },
      ];

  return (
    <ShowcasePage 
      title="Short Form Content" 
      subtitle="Scroll-stopping reels and social media edits" 
      items={items} 
      type="video" 
      vertical
    />
  );
};

export default ShortFormPage;
