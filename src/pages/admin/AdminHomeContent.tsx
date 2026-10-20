import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getHomeContent, updateHomeContent } from "@/lib/db";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useImageCropper } from "@/components/admin/useImageCropper";
import { 
  Image as ImageIcon, 
  Loader2, 
  RotateCcw, 
  Undo2, 
  Crop, 
  Film, 
  ArrowRight, 
  Upload, 
  Link as LinkIcon, 
  Copy,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";
import heroDesktop from "@/assets/hero-desktop.png";
import heroMobile from "@/assets/hero-mobile.png";
import { Input } from "@/components/ui/input";

const DEFAULT_CONTENT = {
  name: "Nabil Azmal Sajid",
  tagline: "Creative Director · Editor · Cinematographer · Photographer",
  hero_image_desktop_url: "/src/assets/hero-desktop.png",
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
  const [desktopUrlInput, setDesktopUrlInput] = useState('');
  const [mobileUrlInput, setMobileUrlInput] = useState('');

  const { requestCrop, CropperComponent } = useImageCropper();

  const desktopInputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const populateFromDB = (data: any) => {
    if (data && (data.name || data.hero_image_desktop_url)) {
      setFormData({
        name: data.name || DEFAULT_CONTENT.name,
        tagline: data.tagline || DEFAULT_CONTENT.tagline,
        hero_image_desktop_url: data.hero_image_desktop_url || DEFAULT_CONTENT.hero_image_desktop_url,
        hero_image_mobile_url: data.hero_image_mobile_url || DEFAULT_CONTENT.hero_image_mobile_url
      });
      setDesktopUrlInput(data.hero_image_desktop_url || '');
      setMobileUrlInput(data.hero_image_mobile_url || '');
    } else {
      setFormData(DEFAULT_CONTENT);
      setDesktopUrlInput(DEFAULT_CONTENT.hero_image_desktop_url);
      setMobileUrlInput(DEFAULT_CONTENT.hero_image_mobile_url);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      populateFromDB(homeContent);
    }
  }, [homeContent, isLoading]);

  const handleDiscardChanges = () => {
    if (window.confirm("Are you sure you want to discard your unsaved text changes?")) {
      populateFromDB(homeContent);
      toast.info("Changes discarded.");
    }
  };

  const handleRestoreTemplate = () => {
    if (window.confirm("Are you sure you want to restore the default name and hero images?")) {
      setFormData(DEFAULT_CONTENT);
      setDesktopUrlInput(DEFAULT_CONTENT.hero_image_desktop_url);
      setMobileUrlInput(DEFAULT_CONTENT.hero_image_mobile_url);
      toast.success("Default template loaded. Click 'Save Changes' to apply.");
    }
  };

  const mutation = useMutation({
    mutationFn: (updatedData: any) => updateHomeContent(homeContent?.id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homeContent'] });
      toast.success("Home & Hero content updated successfully!");
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update content.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  // Upload a file and automatically save directly into the database
  const uploadAndSaveImage = async (file: File, type: 'desktop' | 'mobile') => {
    try {
      if (type === 'desktop') setUploadingDesktop(true);
      else setUploadingMobile(true);

      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `hero_${type}_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `hero/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      const updatedFormData = {
        ...formData,
        [type === 'desktop' ? 'hero_image_desktop_url' : 'hero_image_mobile_url']: imageUrl
      };

      setFormData(updatedFormData);
      if (type === 'desktop') setDesktopUrlInput(imageUrl);
      else setMobileUrlInput(imageUrl);

      // Auto-save to Supabase immediately so the upload is never lost
      await updateHomeContent(homeContent?.id || 1, updatedFormData);
      queryClient.invalidateQueries({ queryKey: ['homeContent'] });

      toast.success(`${type === 'desktop' ? 'Desktop' : 'Mobile'} hero image uploaded and saved to website!`);
    } catch (error: any) {
      console.error(`Error uploading ${type} image:`, error);
      toast.error(error.message || "Failed to upload image. Please check your connection.");
    } finally {
      if (type === 'desktop') setUploadingDesktop(false);
      else setUploadingMobile(false);
    }
  };

  // Optional crop tool
  const handleCropImage = async (type: 'desktop' | 'mobile') => {
    const currentImg = type === 'desktop' ? formData.hero_image_desktop_url : formData.hero_image_mobile_url;
    const resolvedImg = (!currentImg || currentImg.includes('src/assets/'))
      ? (type === 'desktop' ? heroDesktop : heroMobile)
      : currentImg;

    try {
      const croppedFile = await requestCrop(resolvedImg);
      if (!croppedFile) return;
      await uploadAndSaveImage(croppedFile, type);
    } catch (err: any) {
      console.error("Crop error:", err);
    }
  };

  // Manual URL apply
  const handleApplyUrl = async (type: 'desktop' | 'mobile') => {
    const targetUrl = type === 'desktop' ? desktopUrlInput.trim() : mobileUrlInput.trim();
    if (!targetUrl) {
      toast.error("Please enter a valid image URL");
      return;
    }

    const updatedFormData = {
      ...formData,
      [type === 'desktop' ? 'hero_image_desktop_url' : 'hero_image_mobile_url']: targetUrl
    };

    setFormData(updatedFormData);

    try {
      await updateHomeContent(homeContent?.id || 1, updatedFormData);
      queryClient.invalidateQueries({ queryKey: ['homeContent'] });
      toast.success(`${type === 'desktop' ? 'Desktop' : 'Mobile'} hero image updated!`);
    } catch (err: any) {
      toast.error("Failed to save image URL");
    }
  };

  // Copy desktop image to mobile image
  const handleCopyToMobile = async () => {
    if (!formData.hero_image_desktop_url) return;
    const updatedFormData = {
      ...formData,
      hero_image_mobile_url: formData.hero_image_desktop_url
    };
    setFormData(updatedFormData);
    setMobileUrlInput(formData.hero_image_desktop_url);
    try {
      await updateHomeContent(homeContent?.id || 1, updatedFormData);
      queryClient.invalidateQueries({ queryKey: ['homeContent'] });
      toast.success("Desktop image applied to Mobile view as well!");
    } catch (err) {
      toast.error("Failed to update mobile image");
    }
  };

  // Reset image to default template image
  const handleResetImage = async (type: 'desktop' | 'mobile') => {
    const defaultUrl = type === 'desktop' ? DEFAULT_CONTENT.hero_image_desktop_url : DEFAULT_CONTENT.hero_image_mobile_url;
    const updatedFormData = {
      ...formData,
      [type === 'desktop' ? 'hero_image_desktop_url' : 'hero_image_mobile_url']: defaultUrl
    };
    setFormData(updatedFormData);
    if (type === 'desktop') setDesktopUrlInput(defaultUrl);
    else setMobileUrlInput(defaultUrl);

    try {
      await updateHomeContent(homeContent?.id || 1, updatedFormData);
      queryClient.invalidateQueries({ queryKey: ['homeContent'] });
      toast.success(`${type === 'desktop' ? 'Desktop' : 'Mobile'} hero image reset to default!`);
    } catch (err) {
      toast.error("Failed to reset image");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center flex items-center justify-center h-40">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const desktopPreviewSrc = (!formData.hero_image_desktop_url || formData.hero_image_desktop_url.includes('src/assets/'))
    ? heroDesktop
    : formData.hero_image_desktop_url;

  const mobilePreviewSrc = (!formData.hero_image_mobile_url || formData.hero_image_mobile_url.includes('src/assets/'))
    ? heroMobile
    : formData.hero_image_mobile_url;

  return (
    <div className="space-y-6 pb-12">
      {CropperComponent}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-primary" />
            Hero Section & Profile
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Update your main hero character cutouts, headline, and showcase tagline.
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
          <Button onClick={handleSubmit} disabled={mutation.isPending} size="sm" className="bg-primary hover:bg-primary/90 text-white">
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Showreel Quick Access Card */}
      <div className="bg-card p-5 sm:p-6 rounded-xl border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-base">Showreel Video</h3>
            <p className="text-xs text-muted-foreground">Manage the video that plays when visitors click "Watch Showreel"</p>
          </div>
        </div>
        <Link to="/admin/dashboard/showreel">
          <Button variant="outline" className="flex items-center gap-2 border-primary/30 hover:border-primary">
            Open Showreel Manager <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>

      {/* Main Grid: Text on Left, Hero Image Management on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Text Info Form */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleSubmit} className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-5">
            <h2 className="text-lg font-semibold flex items-center gap-2 pb-2 border-b border-border">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Headline & Tagline
            </h2>

            <div className="space-y-2">
              <label className="text-sm font-medium">Main Name / Title</label>
              <input 
                type="text" 
                className="w-full bg-background border border-border rounded-md px-3.5 py-2.5 font-medium text-sm focus:outline-none focus:border-primary transition-colors"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Nabil Azmal Sajid"
              />
              <p className="text-xs text-muted-foreground">
                Your last name is styled with the glowing accent gradient on the homepage.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sub-headline / Tagline</label>
              <textarea 
                rows={3}
                className="w-full bg-background border border-border rounded-md px-3.5 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors resize-none"
                value={formData.tagline}
                onChange={e => setFormData({...formData, tagline: e.target.value})}
                placeholder="e.g. Creative Director · Editor · Cinematographer · Photographer"
              />
              <p className="text-xs text-muted-foreground">
                Displayed underneath your name with uppercase letter-spacing.
              </p>
            </div>

            <Button type="submit" disabled={mutation.isPending} className="w-full">
              {mutation.isPending ? "Saving..." : "Save Text Details"}
            </Button>
          </form>
        </div>

        {/* Right: Hero Images (Desktop + Mobile) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Desktop Hero Image Card */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  Hero Image (Desktop View)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Featured on laptops and desktop screens. Transparent PNG cutouts look best.
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleResetImage('desktop')}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Reset Default
              </Button>
            </div>

            {/* Preview Area */}
            <div className="aspect-[4/3] max-w-[440px] mx-auto bg-background/60 border-2 border-dashed border-border rounded-xl overflow-hidden relative flex items-center justify-center p-4 group shadow-inner">
              <img
                src={desktopPreviewSrc}
                alt="Desktop Hero Preview"
                className="w-full h-full object-contain pointer-events-none drop-shadow-xl"
              />

              {uploadingDesktop && (
                <div className="absolute inset-0 bg-background/85 flex flex-col items-center justify-center gap-2 backdrop-blur-sm z-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="text-xs font-medium">Uploading & Saving...</span>
                </div>
              )}
            </div>

            {/* Upload & Crop Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={desktopInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    uploadAndSaveImage(e.target.files[0], 'desktop');
                  }
                }}
              />

              <Button 
                onClick={() => desktopInputRef.current?.click()} 
                disabled={uploadingDesktop}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white"
              >
                <Upload className="w-4 h-4" />
                Upload Desktop Image
              </Button>

              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => handleCropImage('desktop')}
                disabled={uploadingDesktop}
                className="flex items-center gap-2"
              >
                <Crop className="w-4 h-4" />
                Crop
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleCopyToMobile}
                title="Use this desktop image for mobile view as well"
                className="flex items-center gap-1.5 text-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                Use for Mobile
              </Button>
            </div>

            {/* Optional URL input */}
            <div className="pt-2 border-t border-border/60 flex items-center gap-2">
              <Input
                value={desktopUrlInput}
                onChange={(e) => setDesktopUrlInput(e.target.value)}
                placeholder="Or paste an image URL..."
                className="text-xs bg-background h-9"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleApplyUrl('desktop')}
                className="text-xs shrink-0"
              >
                <LinkIcon className="w-3.5 h-3.5 mr-1" />
                Apply URL
              </Button>
            </div>
          </div>

          {/* Mobile Hero Image Card */}
          <div className="bg-card p-6 rounded-xl border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-base flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  Hero Image (Mobile View)
                </h3>
                <p className="text-xs text-muted-foreground">
                  Displayed on smartphones and mobile screens in portrait view.
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleResetImage('mobile')}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Reset Default
              </Button>
            </div>

            {/* Preview Area */}
            <div className="aspect-[3/4] max-w-[310px] mx-auto bg-background/60 border-2 border-dashed border-border rounded-xl overflow-hidden relative flex items-center justify-center p-3 group shadow-inner">
              <img
                src={mobilePreviewSrc}
                alt="Mobile Hero Preview"
                className="w-full h-full object-contain pointer-events-none drop-shadow-xl"
              />

              {uploadingMobile && (
                <div className="absolute inset-0 bg-background/85 flex flex-col items-center justify-center gap-2 backdrop-blur-sm z-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="text-xs font-medium">Uploading & Saving...</span>
                </div>
              )}
            </div>

            {/* Upload & Crop Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={mobileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    uploadAndSaveImage(e.target.files[0], 'mobile');
                  }
                }}
              />

              <Button 
                onClick={() => mobileInputRef.current?.click()} 
                disabled={uploadingMobile}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white"
              >
                <Upload className="w-4 h-4" />
                Upload Mobile Image
              </Button>

              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => handleCropImage('mobile')}
                disabled={uploadingMobile}
                className="flex items-center gap-2"
              >
                <Crop className="w-4 h-4" />
                Crop
              </Button>
            </div>

            {/* Optional URL input */}
            <div className="pt-2 border-t border-border/60 flex items-center gap-2">
              <Input
                value={mobileUrlInput}
                onChange={(e) => setMobileUrlInput(e.target.value)}
                placeholder="Or paste an image URL..."
                className="text-xs bg-background h-9"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleApplyUrl('mobile')}
                className="text-xs shrink-0"
              >
                <LinkIcon className="w-3.5 h-3.5 mr-1" />
                Apply URL
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHomeContent;
