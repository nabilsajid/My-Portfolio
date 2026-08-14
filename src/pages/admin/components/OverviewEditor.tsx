import { useState, useEffect, useRef } from "react";
import { Save, Upload, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useImageCropper } from "@/components/admin/useImageCropper";
import heroDesktopDefault from "@/assets/hero-desktop.png";
import heroMobileDefault from "@/assets/hero-mobile.png";

export default function OverviewEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [title, setTitle] = useState("Nabil Azmal Sajid");
  const [tagline, setTagline] = useState("Creative Director · Editor · Cinematographer · Photographer");
  const [description, setDescription] = useState("Passionate about telling stories through visual media. I specialize in cinematic videography, creative editing, and striking photography that captures the essence of the moment.");
  const [showreelUrl, setShowreelUrl] = useState("");
  const [heroImageDesktop, setHeroImageDesktop] = useState("");
  const [heroImageMobile, setHeroImageMobile] = useState("");

  const desktopFileInputRef = useRef<HTMLInputElement>(null);
  const mobileFileInputRef = useRef<HTMLInputElement>(null);

  const { requestCrop, CropperComponent } = useImageCropper();

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('id', 'hero')
        .single();
        
      if (error && error.code !== 'PGRST116') throw error; // ignore no rows error initially
      
      if (data) {
        setTitle(data.title || "Nabil Azmal Sajid");
        setTagline(data.tagline || "Creative Director · Editor · Cinematographer · Photographer");
        setDescription(data.description || "Passionate about telling stories through visual media. I specialize in cinematic videography, creative editing, and striking photography that captures the essence of the moment.");
        setShowreelUrl(data.showreel_url || "");
        setHeroImageDesktop(data.hero_image_desktop || "");
        setHeroImageMobile(data.hero_image_mobile || "");
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      toast.error("Failed to load overview data");
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file: File, type: 'desktop' | 'mobile') => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `hero/${type}_${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'desktop' | 'mobile') => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    const croppedFile = await requestCrop(file);
    if (!croppedFile) return;
    
    toast.promise(
      uploadImage(croppedFile, type),
      {
        loading: `Uploading ${type} image...`,
        success: (url) => {
          if (type === 'desktop') setHeroImageDesktop(url);
          else setHeroImageMobile(url);
          return "Image uploaded successfully";
        },
        error: "Failed to upload image",
      }
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_content')
        .upsert({ 
          id: 'hero', 
          title, 
          tagline, 
          description,
          showreel_url: showreelUrl,
          hero_image_desktop: heroImageDesktop,
          hero_image_mobile: heroImageMobile
        });
      
      if (error) throw error;
      toast.success("Overview updated successfully!");
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading overview...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {CropperComponent}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Text Content</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Main Title (Your Name)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Tagline (Underneath Title)</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Showreel YouTube Link (Optional)</label>
            <input
              type="text"
              value={showreelUrl}
              onChange={(e) => setShowreelUrl(e.target.value)}
              placeholder="https://www.youtube.com/embed/..."
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Description (Used for SEO or About)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Hero Images</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Desktop Image */}
          <div>
            <label className="block text-sm font-medium mb-3 text-muted-foreground">Desktop Image</label>
            <div className="relative group rounded-lg overflow-hidden border border-border bg-black/20 aspect-[4/3] flex items-center justify-center">
              <img src={heroImageDesktop || heroDesktopDefault} alt="Desktop Hero" className="max-w-full max-h-full object-contain" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => desktopFileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-secondary/80 text-foreground px-4 py-2 rounded-lg font-medium hover:bg-secondary transition-colors"
                >
                  <Upload className="w-4 h-4" /> Change Image
                </button>
              </div>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={desktopFileInputRef}
              onChange={(e) => handleFileChange(e, 'desktop')}
            />
          </div>

          {/* Mobile Image */}
          <div>
            <label className="block text-sm font-medium mb-3 text-muted-foreground">Mobile Image (Vertical)</label>
            <div className="relative group rounded-lg overflow-hidden border border-border bg-black/20 aspect-[3/4] max-w-[280px] mx-auto flex items-center justify-center">
              <img src={heroImageMobile || heroMobileDefault} alt="Mobile Hero" className="max-w-full max-h-full object-contain" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => mobileFileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-secondary/80 text-foreground px-4 py-2 rounded-lg font-medium hover:bg-secondary transition-colors"
                >
                  <Upload className="w-4 h-4" /> Change Image
                </button>
              </div>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={mobileFileInputRef}
              onChange={(e) => handleFileChange(e, 'mobile')}
            />
          </div>

        </div>
      </div>

      <div className="flex justify-end sticky bottom-6 z-10 bg-background/80 backdrop-blur-sm p-4 border border-border rounded-xl">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 glow-button text-white px-8 py-3 rounded-lg font-medium transition-all disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? "Saving Changes..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
