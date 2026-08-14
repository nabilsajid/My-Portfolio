import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, Loader2, Image as ImageIcon, X, Crop, ArrowLeft, ArrowRight } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjects, addProject, updateProject, deleteProject } from "@/lib/db";
import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { useImageCropper } from "@/components/admin/useImageCropper";

const AdminProjects = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryFilter = searchParams.get("category");

  const { data: allProjects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  });

  const projects = allProjects.filter((p: any) => {
    if (!categoryFilter) return true;
    if (categoryFilter === "video") return p.category === "long-form" || p.category === "short-form";
    return p.category === categoryFilter;
  });

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', category: 'long-form', image_url: '', label: '', video_url: '', gallery_images: '' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  
  const { requestCrop, CropperComponent } = useImageCropper();

  const addMutation = useMutation({
    mutationFn: addProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateProject(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] })
  });

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setFormData({ 
      title: p.title, 
      category: p.category, 
      image_url: p.image_url, 
      label: p.label || '', 
      video_url: p.video_url || '', 
      gallery_images: (p.gallery_images || []).join(', ') 
    });
    setIsOpen(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    let defaultCat = 'long-form';
    if (categoryFilter === 'photography') defaultCat = 'photography';
    if (categoryFilter === 'poster') defaultCat = 'poster';
    
    setFormData({ title: '', category: defaultCat, image_url: '', label: '', video_url: '', gallery_images: '' });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { 
      ...formData, 
      gallery_images: formData.gallery_images ? formData.gallery_images.split(',').map(s => s.trim()).filter(Boolean) : null 
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      addMutation.mutate(payload);
    }
  };

  const handleImageUpload = async (fileOrUrl: File | string) => {
    try {
      const croppedFile = await requestCrop(fileOrUrl);
      if (!croppedFile) return;

      setUploadingImage(true);

      const fileExt = croppedFile.name.split('.').pop();
      const fileName = `project_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-media')
        .upload(filePath, croppedFile);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        image_url: publicUrlData.publicUrl
      }));
      toast.success("Image uploaded successfully!");
      
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGalleryUpload = async (files: FileList) => {
    try {
      setUploadingGallery(true);
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const croppedFile = await requestCrop(file);
        if (!croppedFile) continue;

        const fileExt = croppedFile.name.split('.').pop();
        const fileName = `gallery_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `projects/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio-media')
          .upload(filePath, croppedFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('portfolio-media')
          .getPublicUrl(filePath);

        newUrls.push(publicUrlData.publicUrl);
      }

      setFormData(prev => {
        const existing = prev.gallery_images ? prev.gallery_images.split(',').map(s => s.trim()).filter(Boolean) : [];
        return {
          ...prev,
          gallery_images: [...existing, ...newUrls].join(', ')
        };
      });
      toast.success(`${files.length} image(s) uploaded successfully!`);
      
    } catch (error) {
      console.error("Error uploading gallery images:", error);
      toast.error("Failed to upload some images");
    } finally {
      setUploadingGallery(false);
    }
  };

  return (
    <div className="space-y-6">
      {CropperComponent}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight capitalize">
            {categoryFilter ? `${categoryFilter} Projects` : 'All Projects'}
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your {categoryFilter || 'video, poster, and photography'} projects.
          </p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          projects.map((p: any) => (
            <div key={p.id} className="bg-card rounded-xl border border-border overflow-hidden flex flex-col">
              <div className="aspect-video w-full overflow-hidden bg-muted">
                {p.image_url && <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold truncate pr-2">{p.title}</h3>
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full shrink-0">
                    {p.category}
                  </span>
                </div>
                {p.label && <p className="text-sm text-muted-foreground mb-4">{p.label}</p>}
                
                <div className="mt-auto pt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(p)}>
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(p.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input required type="text" className="w-full bg-background border border-border rounded-md px-3 py-2" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select required className="w-full bg-background border border-border rounded-md px-3 py-2" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="long-form">Long Form Video</option>
                <option value="short-form">Short Form Video</option>
                <option value="photography">Photography</option>
                <option value="poster">Poster/Design</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Label (Optional)</label>
              <input type="text" className="w-full bg-background border border-border rounded-md px-3 py-2" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} />
            </div>
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-medium">Image URL (Thumbnail)</h3>
              
              <div className="aspect-video w-full bg-background border-2 border-dashed border-border rounded-lg overflow-hidden relative flex items-center justify-center group/thumb">
                {formData.image_url ? (
                  <>
                    <img src={formData.image_url} alt="Thumbnail Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => handleImageUpload(formData.image_url)}
                      >
                        <Crop className="w-4 h-4 mr-2" />
                        Crop Image
                      </Button>
                    </div>
                  </>
                ) : (
                  <span className="text-muted-foreground text-sm">No image</span>
                )}
                {uploadingImage && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                )}
              </div>
              
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={imageInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="flex gap-2">
                <Button type="button" className="flex-1" variant="outline" onClick={() => imageInputRef.current?.click()} disabled={uploadingImage}>
                  {formData.image_url ? "Change Image" : "Upload Image"}
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground mt-2">
                Or paste a URL directly:
                <input type="text" className="w-full bg-background border border-border rounded-md px-3 py-2 mt-1" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." />
              </div>
            </div>
            
            {['long-form', 'short-form'].includes(formData.category) && (
              <div className="space-y-2">
                <label className="text-sm font-medium">YouTube Video URL</label>
                <input type="text" className="w-full bg-background border border-border rounded-md px-3 py-2" value={formData.video_url} onChange={e => setFormData({...formData, video_url: e.target.value})} />
              </div>
            )}

            {formData.category === 'photography' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Gallery Images</label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => galleryInputRef.current?.click()}
                    disabled={uploadingGallery}
                  >
                    {uploadingGallery ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ImageIcon className="w-4 h-4 mr-2" />}
                    Add Images
                  </Button>
                </div>
                
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple
                  className="hidden" 
                  ref={galleryInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleGalleryUpload(e.target.files);
                    }
                  }}
                />
                
                {/* Visual Preview of Gallery Images */}
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {formData.gallery_images.split(',').map(s => s.trim()).filter(Boolean).map((img, idx, arr) => (
                    <div key={idx} className="relative aspect-square bg-muted rounded-md overflow-hidden group">
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                        
                        {/* Rearrange Buttons */}
                        <div className="flex gap-1">
                          <Button 
                            type="button" 
                            variant="secondary" 
                            size="icon"
                            className="h-7 w-7"
                            disabled={idx === 0}
                            onClick={() => {
                              const newArr = [...arr];
                              const temp = newArr[idx];
                              newArr[idx] = newArr[idx - 1];
                              newArr[idx - 1] = temp;
                              setFormData({...formData, gallery_images: newArr.join(', ')});
                            }}
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </Button>
                          <Button 
                            type="button" 
                            variant="secondary" 
                            size="icon"
                            className="h-7 w-7"
                            disabled={idx === arr.length - 1}
                            onClick={() => {
                              const newArr = [...arr];
                              const temp = newArr[idx];
                              newArr[idx] = newArr[idx + 1];
                              newArr[idx + 1] = temp;
                              setFormData({...formData, gallery_images: newArr.join(', ')});
                            }}
                          >
                            <ArrowRight className="w-3 h-3" />
                          </Button>
                        </div>
                        <Button 
                          type="button" 
                          variant="secondary" 
                          size="sm"
                          className="h-8 text-xs"
                          onClick={async () => {
                            const croppedFile = await requestCrop(img);
                            if (croppedFile) {
                              setUploadingGallery(true);
                              try {
                                const fileExt = croppedFile.name.split('.').pop() || 'jpeg';
                                const fileName = `gallery_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
                                const filePath = `projects/${fileName}`;
                                const { error: uploadError } = await supabase.storage.from('portfolio-media').upload(filePath, croppedFile);
                                if (uploadError) throw uploadError;
                                const { data } = supabase.storage.from('portfolio-media').getPublicUrl(filePath);
                                
                                setFormData(prev => {
                                  const currentImages = prev.gallery_images ? prev.gallery_images.split(',').map(s => s.trim()).filter(Boolean) : [];
                                  const updatedImages = [...currentImages];
                                  updatedImages[idx] = data.publicUrl;
                                  return { ...prev, gallery_images: updatedImages.join(', ') };
                                });
                              } catch (e) {
                                toast.error("Failed to crop gallery image");
                              } finally {
                                setUploadingGallery(false);
                              }
                            }
                          }}
                        >
                          <Crop className="w-3 h-3 mr-1" /> Crop
                        </Button>

                        <Button 
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            const imgs = formData.gallery_images.split(',').map(s => s.trim()).filter(Boolean);
                            imgs.splice(idx, 1);
                            setFormData({...formData, gallery_images: imgs.join(', ')});
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-xs text-muted-foreground mt-2">
                  Or paste URLs directly (comma separated):
                  <textarea className="w-full bg-background border border-border rounded-md px-3 py-2 h-20 mt-1" value={formData.gallery_images} onChange={e => setFormData({...formData, gallery_images: e.target.value})} placeholder="https://..." />
                </div>
              </div>
            )}

            <Button type="submit" className="w-full">
              {editingId ? 'Update Project' : 'Save Project'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProjects;