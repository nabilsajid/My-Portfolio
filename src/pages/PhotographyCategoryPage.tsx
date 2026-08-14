import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import photo1 from "@/assets/photo-1.jpg";
import photo2 from "@/assets/photo-2.jpg";
import photo3 from "@/assets/photo-3.jpg";

const categoryData: Record<string, { title: string; images: { title: string; image: string }[] }> = {
  "corporate-event": {
    title: "Corporate Event",
    images: [
      { title: "Conference Keynote", image: photo1 },
      { title: "Team Building", image: photo2 },
      { title: "Award Ceremony", image: photo3 },
      { title: "Networking Event", image: photo1 },
      { title: "Panel Discussion", image: photo2 },
      { title: "Product Launch", image: photo3 },
    ],
  },
  "product-photography": {
    title: "Product Photography",
    images: [
      { title: "Flat Lay", image: photo2 },
      { title: "Lifestyle Product", image: photo3 },
      { title: "Studio Shot", image: photo1 },
      { title: "Packshot", image: photo2 },
      { title: "Detail Close-up", image: photo3 },
      { title: "Contextual", image: photo1 },
    ],
  },
  "fashion-shoot": {
    title: "Fashion Shoot",
    images: [
      { title: "Editorial", image: photo3 },
      { title: "Street Style", image: photo1 },
      { title: "Studio Fashion", image: photo2 },
      { title: "Lookbook", image: photo3 },
      { title: "Runway", image: photo1 },
      { title: "Campaign", image: photo2 },
    ],
  },
  portrait: {
    title: "Portrait",
    images: [
      { title: "Environmental Portrait", image: photo1 },
      { title: "Studio Portrait", image: photo2 },
      { title: "Creative Portrait", image: photo3 },
      { title: "Headshot", image: photo1 },
      { title: "Candid", image: photo2 },
      { title: "Fine Art", image: photo3 },
    ],
  },
  nature: {
    title: "Nature",
    images: [
      { title: "Landscape", image: photo3 },
      { title: "Wildlife", image: photo1 },
      { title: "Macro", image: photo2 },
      { title: "Sunset", image: photo3 },
      { title: "Forest", image: photo1 },
      { title: "Ocean", image: photo2 },
    ],
  },
  lifestyle: {
    title: "Lifestyle",
    images: [
      { title: "Cafe Moments", image: photo2 },
      { title: "Travel", image: photo3 },
      { title: "Urban Life", image: photo1 },
      { title: "Wellness", image: photo2 },
      { title: "Food & Drink", image: photo3 },
      { title: "Home Life", image: photo1 },
    ],
  },
};

const bentoPatterns = [
  "col-span-2 row-span-2",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2",
  "col-span-1 row-span-1",
  "col-span-2 row-span-1",
];

const PhotographyCategoryPage = () => {
  const { category } = useParams();
  const data = categoryData[category || ""];

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Category not found</h1>
          <Link to="/" className="text-primary hover:underline">Go back home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="section-padding max-w-6xl mx-auto pt-24">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-bold mb-3"
        >
          {data.title}
        </motion.h1>
        <p className="text-muted-foreground mb-12">A curated collection of {data.title.toLowerCase()} photography</p>

        <div className="grid grid-cols-3 auto-rows-[200px] md:auto-rows-[250px] gap-3">
          {data.images.map((item, i) => (
            <motion.div
              key={item.title + i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`group relative bg-card border border-border rounded-lg overflow-hidden ${bentoPatterns[i % bentoPatterns.length]}`}
            >
              <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="absolute bottom-3 left-3 text-sm font-medium">{item.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PhotographyCategoryPage;
