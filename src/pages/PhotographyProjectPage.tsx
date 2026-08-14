import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
const projects = [
  { id: 1, title: 'Cinematic Brand Film', category: 'long-form', image_url: '/src/assets/longform-1.jpg', video_url: 'https://youtube.com' },
  { id: 2, title: 'Documentary Highlight', category: 'long-form', image_url: '/src/assets/longform-2.jpg', video_url: 'https://youtube.com' },
  { id: 3, title: 'Corporate Event Coverage', category: 'long-form', image_url: '/src/assets/longform-3.jpg', video_url: 'https://youtube.com' },
  { id: 4, title: 'TikTok Viral Edit', category: 'short-form', image_url: '/src/assets/shortform-1.jpg', video_url: 'https://youtube.com' },
  { id: 5, title: 'Instagram Reel Promo', category: 'short-form', image_url: '/src/assets/shortform-2.jpg', video_url: 'https://youtube.com' },
  { id: 6, title: 'E-Sports Tournament', category: 'poster', image_url: '/src/assets/poster-1.jpg', label: 'Graphic Design' },
  { id: 7, title: 'University Event', category: 'poster', image_url: '/src/assets/poster-2.jpg', label: 'Key Visual' },
  { id: 8, title: 'Concert Photography', category: 'photography', image_url: '/src/assets/photo-1.jpg', label: 'Live Event', gallery_images: ['/src/assets/photo-2.jpg', '/src/assets/photo-3.jpg'] },
  { id: 9, title: 'Product Shoot', category: 'photography', image_url: '/src/assets/photo-2.jpg', label: 'Commercial' },
  { id: 10, title: 'Portrait Series', category: 'photography', image_url: '/src/assets/photo-3.jpg', label: 'Studio' }
];

const bentoPatterns = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-2 md:row-span-1",
];

const PhotographyProjectPage = () => {
  const { id } = useParams();

  const project = projects.find((p: any) => p.id === Number(id));

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

  const gallery = project.gallery_images || [];
  const allImages = [project.image_url, ...gallery].filter(Boolean);

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

          <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] md:auto-rows-[300px] gap-4">
            {allImages.map((imgUrl: string, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-card border border-border rounded-xl overflow-hidden ${bentoPatterns[i % bentoPatterns.length]}`}
              >
                <img
                  src={imgUrl}
                  alt={`${project.title} image ${i + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PhotographyProjectPage;