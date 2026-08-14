import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getHomeContent, updateHomeContent } from "@/lib/db";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useImageCropper } from "@/components/admin/useImageCropper";
import { Image as ImageIcon, Loader2, RotateCcw, Undo2, Crop } from "lucide-react";
import heroDesktop from "@/assets/hero-desktop.png";
import heroMobile from "@/assets/hero-mobile.png";

const DEFAULT_CONTENT = {
  name: "Nabil Azmal Sajid",
  tagline: "Creative Director · Editor · Cinematographer · Photographer",
  hero_image_mobile_url: "/src/assets/hero-mobile.png"
};

const AdminHomeContent = () => {
  const queryClient = useQueryClient();
  const { data: homeContent, isLoading } = useQuery({
    queryKey: ['homeContent'],
    queryFn: getHomeContent
  });

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    hero_image_desktop_url: '',
    hero_image_mobile_url: ''
  });

  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);

  const { requestCrop, CropperComponent } = useImageCropper();

  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const populateFromDB = (data: any) => {
    if (data && data.name) {
      setFormData({
        name: data.name,
        tagline: data.tagline,
        hero_image_desktop_url: data.hero_image_desktop_url || DEFAULT_CONTENT.hero_image_desktop_url,
        hero_image_mobile_url: data.hero_image_mobile_url || DEFAULT_CONTENT.hero_image_mobile_url
      });
    } else {
      setFormData(DEFAULT_CONTENT);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      populateFromDB(homeContent);
    }
  }, [homeContent, isLoading]);

  const handleDiscardChanges = () => {
    if (window.confirm("Are you sure you want to discard your unsaved changes?")) {
      populateFromDB(homeContent);
      toast.info("Changes discarded.");
    }
  };

  const handleRestoreTemplate = () => {
    if (window.confirm("Are you sure you want to completely restore the default template? This will overwrite your text!")) {
      setFormData(DEFAULT_CONTENT);
      toast.success("Default template loaded. Click Save to apply.");
    }
  };

  const mutation = useMutation({
    mutationFn: (updatedData: any) => updateHomeContent(homeContent?.id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homeContent'] });
      toast.success("Home content updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update content.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleImageUpload = async (fileOrUrl: File | string, type: 'desktop' | 'mobile') => {
    try {
      const croppedFile = await requestCrop(fileOrUrl);
      if (!croppedFile) return;

      if (type === 'desktop') setUploadingDesktop(true);
      else setUploadingMobile(true);

      const fileExt = croppedFile.name.split('.').pop();
      const fileName = `hero_${type}_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `hero/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-media')
        .upload(filePath, croppedFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      setFormData(prev => ({
        ...prev,
        [type === 'desktop' ? 'hero_image_desktop_url' : 'hero_image_mobile_url']: imageUrl
      }));
      toast.success(`${type === 'desktop' ? 'Desktop' : 'Mobile'} image uploaded successfully!`);
      
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
      toast.error("Failed to upload image");
    } finally {
      if (type === 'desktop') setUploadingDesktop(false);
      else setUploadingMobile(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center flex items-center justify-center h-40"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      {CropperComponent}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Home & About Content</h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal details, tagline, and hero images.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleDiscardChanges} type="button" size="sm">
            <Undo2 className="w-4 h-4 mr-2" />
            Discard
          </Button>
          <Button variant="destructive" onClick={handleRestoreTemplate} type="button" size="sm">
            <RotateCcw className="w-4 h-4 mr-2" />
            Restore Template
          </Button>
          <Button onClick={handleSubmit} disabled={mutation.isPending} size="sm">
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="space-y-6 xl:col-span-2 bg-card p-6 rounded-xl border border-border">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <input 
              type="text" 
              className="w-full bg-background border border-border rounded-md px-3 py-2"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Tagline</label>
            <input 
              type="text" 
              className="w-full bg-background border border-border rounded-md px-3 py-2"
              value={formData.tagline}
              onChange={e => setFormData({...formData, tagline: e.target.value})}
            />
          </div>
        </form>

        <div className="space-y-6">
          <div className="bg-card p-6 rounded-xl border border-border space-y-4">
            <h3 className="font-medium flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Hero Image (Desktop)</h3>
            <p className="text-xs text-muted-foreground">This image is displayed on larger screens.</p>
            
            <div className="aspect-video bg-background border-2 border-dashed border-border rounded-lg overflow-hidden relative flex items-center justify-center group/hero">
              {formData.hero_image_desktop_url ? (
                <>
                  <img src={formData.hero_image_desktop_url.includes('src/assets') ? heroDesktop : formData.hero_image_desktop_url} alt="Desktop Hero Preview" className="w-full h-full object-cover" />
                  {!formData.hero_image_desktop_url.includes('src/assets') && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/hero:opacity-100 transition-opacity flex items-center justify-center">
                      <Button type="button" variant="secondary" size="sm" onClick={() => handleImageUpload(formData.hero_image_desktop_url, 'desktop')}>
                        <Crop className="w-4 h-4 mr-2" />
                        Crop Image
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <span className="text-muted-foreground text-sm">No image</span>
              )}
              {uploadingDesktop && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}
            </div>
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={desktopInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleImageUpload(e.target.files[0], 'desktop');
                }
              }}
            />
            <Button className="w-full" variant="outline" onClick={() => desktopInputRef.current?.click()} disabled={uploadingDesktop}>
              {formData.hero_image_desktop_url ? "Change Desktop Image" : "Upload Desktop Image"}
            </Button>
          </div>

          <div className="bg-card p-6 rounded-xl border border-border space-y-4">
            <h3 className="font-medium flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Hero Image (Mobile)</h3>
            <p className="text-xs text-muted-foreground">This image is displayed on mobile devices (portrait).</p>
            
            <div className="aspect-[3/4] w-48 mx-auto bg-background border-2 border-dashed border-border rounded-lg overflow-hidden relative flex items-center justify-center group/hero">
              {formData.hero_image_mobile_url ? (
                <>
                  <img src={formData.hero_image_mobile_url.includes('src/assets') ? heroMobile : formData.hero_image_mobile_url} alt="Mobile Hero Preview" className="w-full h-full object-cover" />
                  {!formData.hero_image_mobile_url.includes('src/assets') && (
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/hero:opacity-100 transition-opacity flex items-center justify-center">
                      <Button type="button" variant="secondary" size="sm" onClick={() => handleImageUpload(formData.hero_image_mobile_url, 'mobile')}>
                        <Crop className="w-4 h-4 mr-2" />
                        Crop
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <span className="text-muted-foreground text-sm">No image</span>
              )}
              {uploadingMobile && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}
            </div>
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={mobileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleImageUpload(e.target.files[0], 'mobile');
                }
              }}
            />
            <Button className="w-full" variant="outline" onClick={() => mobileInputRef.current?.click()} disabled={uploadingMobile}>
              {formData.hero_image_mobile_url ? "Change Mobile Image" : "Upload Mobile Image"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomeContent;