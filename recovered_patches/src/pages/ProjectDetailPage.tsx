import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Play } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LightboxModal from "@/components/LightboxModal";
import { supabase } from "@/lib/supabase";
import { imageMap } from "@/data/projects";

const bentoPatterns = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-2 md:row-span-1",
];

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('id', Number(id))
        .single();
      
      if (data) setProject(data);
      setLoading(false);
    };
    if (id) fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <Link to="/" className="text-primary hover:underline">Go back home</Link>
        </div>
      </div>
    );
  }

  const isLongForm = project.category === "long-form";
  const isShortForm = project.category === "short-form";
  const isPhotoOrPoster = project.category === "photography" || project.category === "poster";

  const mainImage = imageMap[project.image_url] || project.image_url;
  const gallery = project.gallery_images ? project.gallery_images.map((img: string) => imageMap[img] || img) : [];
  const allImages = [mainImage, ...gallery].filter(Boolean);

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{project.title}</h1>
            {project.label && <p className="text-xl text-muted-foreground">{project.label}</p>}
          </motion.div>

          {/* Long Form Cinematic Layout */}
          {isLongForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="w-full aspect-video bg-card rounded-2xl overflow-hidden relative border border-border shadow-2xl mb-12"
            >
              <img src={mainImage} alt={project.title} className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <a href={project.video_url} target="_blank" rel="noreferrer" className="w-20 h-20 rounded-full bg-primary/30 backdrop-blur-md flex items-center justify-center border border-primary/50 hover:bg-primary/50 hover:scale-110 transition-all duration-300">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </a>
              </div>
            </motion.div>
          )}

          {/* Short Form Vertical Layout */}
          {isShortForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-[400px] mx-auto aspect-[9/16] bg-card rounded-2xl overflow-hidden relative border border-border shadow-2xl mb-12"
            >
              <img src={mainImage} alt={project.title} className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 flex items-center justify-center">
                <a href={project.video_url} target="_blank" rel="noreferrer" className="w-16 h-16 rounded-full bg-primary/30 backdrop-blur-md flex items-center justify-center border border-primary/50 hover:bg-primary/50 hover:scale-110 transition-all duration-300">
                  <Play className="w-6 h-6 text-white fill-white ml-1" />
                </a>
              </div>
            </motion.div>
          )}

          {/* Gallery Layout for Photography & Posters (Also used as BTS for videos) */}
          {((isPhotoOrPoster) || (gallery.length > 0)) && (
            <>
              {gallery.length > 0 && (isLongForm || isShortForm) && (
                <h3 className="text-2xl font-display font-semibold mb-6">Behind The Scenes</h3>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] md:auto-rows-[300px] gap-4">
                {(isPhotoOrPoster ? allImages : gallery).map((imgUrl: string, i: number) => (
                  <motion.div
                    key={i}
                    onClick={() => {
                      setLightboxIndex(i);
                      setIsLightboxOpen(true);
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={`relative bg-card border border-border rounded-xl overflow-hidden cursor-pointer ${bentoPatterns[i % bentoPatterns.length]}`}
                  >
                    <img
                      src={imgUrl}
                      alt={`${project.title} image ${i + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />

      <LightboxModal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={isPhotoOrPoster ? allImages : gallery}
        initialIndex={lightboxIndex}
      />
    </div>
  );
};

export default ProjectDetailPage;