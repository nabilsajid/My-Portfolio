import { useState, useEffect } from "react";
import ShowcasePage from "./ShowcasePage";
import { supabase } from "@/lib/supabase";
import { imageMap } from "@/data/projects";

const CreativeVisualsPage = () => {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('category', 'poster')
        .order('id', { ascending: true });
        
      if (data) {
        setItems(data.map((p: any) => ({
          id: p.id,
          title: p.title,
          image: imageMap[p.image_url] || p.image_url
        })));
      }
    };
    fetchProjects();
  }, []);

  return (
    <ShowcasePage 
      title="Creative Visuals" 
      subtitle="Bold visual designs that command attention" 
      items={items} 
      type="gallery" 
    />
  );
};

export default CreativeVisualsPage;
