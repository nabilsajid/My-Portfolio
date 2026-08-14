import { useState, useEffect } from "react";
import ShowcasePage from "./ShowcasePage";
import { supabase } from "@/lib/supabase";
import { imageMap } from "@/data/projects";

const LongFormPage = () => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('category', 'long-form')
        .order('id', { ascending: true });
        
      if (data) {
        const grouped: Record<string, any> = {};
        
        data.forEach((p: any) => {
          const catName = p.label ? p.label.trim() : 'Other';
          
          if (!grouped[catName]) {
            grouped[catName] = {
              id: encodeURIComponent(catName) + '-long-form',
              title: catName,
              thumbnail: imageMap[p.image_url] || p.image_url,
              video_url: `/video-category/${encodeURIComponent(catName)}`,
              is_external: false
            };
          }
        });
        
        setItems(Object.values(grouped));
      }
    };
    fetchProjects();
  }, []);

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
