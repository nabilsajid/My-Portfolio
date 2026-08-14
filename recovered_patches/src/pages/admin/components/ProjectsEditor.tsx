import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Video, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ProjectsEditor() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  
  // Form State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "long-form",
    image_url: "",
    video_url: "",
    label: "",
    gallery_images: [] as string[],
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('id', { ascending: true }); // Keep them in a consistent order
        
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (project: any) => {
    setEditingProject(project);
    setImageFile(null); // Reset file input
    setGalleryFiles([]);
    setFormData({
      title: project.title || "",
      category: project.category || "long-form",
      image_url: project.image_url || "",
      video_url: project.video_url || "",
      label: project.label || "",
      gallery_images: project.gallery_images || [],
    });
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingProject(null);
    setImageFile(null); // Reset file input
    setGalleryFiles([]);
    setFormData({
      title: "",
      category: "long-form",
      image_url: "",
      video_url: "",
      label: "",
      gallery_images: [],
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast.error("Title is required.");
      return;
    }
    
    if (!formData.image_url && !imageFile) {
      toast.error("An image is required.");
      return;
    }

    try {
      setIsUploading(true);
      let finalImageUrl = formData.image_url;

      // Handle Image Upload if a new file was selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `projects/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio-media')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from('portfolio-media')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrlData.publicUrl;
      }

      // Handle Gallery Uploads
      let uploadedGalleryUrls: string[] = [];
      if (galleryFiles.length > 0) {
        for (const file of galleryFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
          const filePath = `projects/gallery/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('portfolio-media')
            .upload(filePath, file);

          if (!uploadError) {
            const { data } = supabase.storage.from('portfolio-media').getPublicUrl(filePath);
            uploadedGalleryUrls.push(data.publicUrl);
          }
        }
      }

      const finalGalleryImages = [...formData.gallery_images, ...uploadedGalleryUrls];
      const payload = { ...formData, image_url: finalImageUrl, gallery_images: finalGalleryImages };

      if (editingProject) {
        // Update existing
        const { error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', editingProject.id);
        
        if (error) throw error;
        toast.success("Project updated successfully");
      } else {
        // Insert new
        const { error } = await supabase
          .from('projects')
          .insert([payload]);
          
        if (error) throw error;
        toast.success("Project added successfully");
      }
      
      setIsModalOpen(false);
      setImageFile(null);
      setGalleryFiles([]);
      fetchProjects(); // Refresh the list
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Failed to save project");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      
      setProjects(projects.filter(p => p.id !== id));
      toast.success("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete project");
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border flex justify-between items-center bg-background/50">
        <div>
          <h2 className="text-xl font-semibold">Manage Projects</h2>
          <p className="text-sm text-muted-foreground mt-1">Add, edit, or remove your portfolio items.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 glow-button text-white px-4 py-2 rounded-lg font-medium transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="p-4 font-medium text-sm text-muted-foreground w-16">Media</th>
              <th className="p-4 font-medium text-sm text-muted-foreground">Title</th>
              <th className="p-4 font-medium text-sm text-muted-foreground">Category</th>
              <th className="p-4 font-medium text-sm text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="p-4">
                  <div className="w-12 h-12 rounded bg-muted flex items-center justify-center overflow-hidden border border-border">
                    {project.image_url ? (
                      <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </td>
                <td className="p-4 font-medium">{project.title}</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 capitalize">
                    {project.category === 'long-form' || project.category === 'short-form' ? (
                      <Video className="w-3 h-3" />
                    ) : (
                      <ImageIcon className="w-3 h-3" />
                    )}
                    {project.category.replace('-', ' ')}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleOpenEdit(project)}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors" 
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(project.id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors" 
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {loading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  Loading projects...
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  No projects found. Click "Add Project" to create one.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit Project" : "Add Project"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Cinematic Brand Film"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="long-form">Long Form Video</option>
                <option value="short-form">Short Form Video</option>
                <option value="poster">Poster Design</option>
                <option value="photography">Photography</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label>Project Image</Label>
              <div className="flex flex-col gap-3">
                {formData.image_url && !imageFile && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border">
                    <img src={formData.image_url} alt="Current Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                {imageFile && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border border-primary/50">
                    <img src={URL.createObjectURL(imageFile)} alt="New Preview" className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">New Image</div>
                  </div>
                )}
                <Input
                  id="image_file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    }
                  }}
                  className="cursor-pointer file:text-foreground file:bg-muted file:border-0 file:mr-4 file:px-4 file:py-1 file:rounded-md hover:file:bg-muted/80"
                />
              </div>
            </div>

            {formData.category === 'photography' && (
              <div className="grid gap-2">
                <Label>Gallery Images (Optional, for albums)</Label>
                <div className="flex flex-col gap-3">
                  {formData.gallery_images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {formData.gallery_images.map((url, i) => (
                        <div key={i} className="relative w-16 h-16 shrink-0 rounded overflow-hidden border border-border group">
                          <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                          <button
                            onClick={() => setFormData({ ...formData, gallery_images: formData.gallery_images.filter((_, index) => index !== i) })}
                            className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {galleryFiles.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      {galleryFiles.length} new file(s) selected
                    </div>
                  )}
                  <Input
                    id="gallery_files"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        setGalleryFiles(Array.from(e.target.files));
                      }
                    }}
                    className="cursor-pointer file:text-foreground file:bg-muted file:border-0 file:mr-4 file:px-4 file:py-1 file:rounded-md hover:file:bg-muted/80"
                  />
                </div>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="video_url">Video URL (Optional)</Label>
              <Input
                id="video_url"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                placeholder="https://youtube.com/..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="label">Special Label (Optional)</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g. Graphic Design"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isUploading}>Cancel</Button>
            <Button onClick={handleSave} disabled={isUploading}>
              {isUploading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
