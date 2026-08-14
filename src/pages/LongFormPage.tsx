import { useState, useEffect } from "react";
import ShowcasePage from "./ShowcasePage";
import { supabase } from "@/lib/supabase";
import { imageMap } from "@/data/projects";
import longform1 from "@/assets/longform-1.jpg";
import longform2 from "@/assets/longform-2.jpg";
import longform3 from "@/assets/longform-3.jpg";
import useSmoothScroll from "@/hooks/use-smooth-scroll";

const LongFormPage = () => {
  useSmoothScroll();
  const [dbProjects, setDbProjects] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('category', 'long-form')
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
        { id: 1, title: "Brand Documentary", thumbnail: longform1, video_url: "https://youtube.com", is_external: true },
        { id: 2, title: "Travel Film", thumbnail: longform2, video_url: "https://youtube.com", is_external: true },
        { id: 3, title: "Music Video", thumbnail: longform3, video_url: "https://youtube.com", is_external: true },
        { id: 4, title: "Commercial Edit", thumbnail: longform2, video_url: "https://youtube.com", is_external: true },
        { id: 5, title: "Event Film", thumbnail: longform1, video_url: "https://youtube.com", is_external: true },
        { id: 6, title: "Cinematic Reel", thumbnail: longform3, video_url: "https://youtube.com", is_external: true },
      ];

  return (
    <ShowcasePage 
      title="Long Form Content" 
      subtitle="Cinematic edits, documentaries, and brand films" 
      items={items} 
      type="video" 
    />
  );
};

export default LongFormPage;
