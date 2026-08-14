import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { ArrowLeft, Play } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { imageMap } from "@/data/projects";

const VideoCategoryPage = () => {
  const { categoryName } = useParams();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure we start at the top on load
    window.scrollTo(0, 0);

    const fetchProjects = async () => {
      if (!categoryName) return;
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('label', categoryName)
          .order('id', { ascending: false });

        if (!error && data) {
          setProjects(data);
        }
      } catch (err) {
        console.error("Error fetching category projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [categoryName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">No videos found for this category</h1>
            <Link to="/" className="text-primary hover:underline">Go back home</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{categoryName}</h1>
            <p className="text-xl text-muted-foreground">Browse all videos in this category</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => {
              const mainImage = imageMap[project.image_url] || project.image_url;
              return (
                <motion.a
                  key={project.id}
                  href={project.video_url || '#'}
                  target={project.video_url ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative aspect-video bg-card border border-border rounded-lg overflow-hidden cursor-pointer block"
                >
                  <img 
                    src={mainImage} 
                    alt={project.title} 
                    className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center border border-primary/30 group-hover:bg-primary/40 transition-colors">
                      <Play className="w-4 h-4 text-primary fill-primary" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
                    <p className="font-medium text-lg">{project.title}</p>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VideoCategoryPage;
