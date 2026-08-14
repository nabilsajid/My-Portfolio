import { useState, useEffect } from "react";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function TestimonialsEditor() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      toast.error("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!imageFile) {
      toast.error("An image is required for a testimony.");
      return;
    }

    try {
      setIsUploading(true);

      const fileExt = imageFile.name.split('.').pop();
      const fileName = `testimony_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `testimonials/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-media')
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('portfolio-media')
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      // Insert into database
      const { error } = await supabase
        .from('testimonials')
        .insert([{ image_url: imageUrl }]);
        
      if (error) throw error;
      
      toast.success("Testimony added successfully");
      setIsModalOpen(false);
      setImageFile(null);
      fetchTestimonials();
    } catch (error) {
      console.error("Error saving testimony:", error);
      toast.error("Failed to upload testimony");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!window.confirm("Are you sure you want to delete this testimony?")) return;
    
    try {
      // Optional: Delete the image from storage as well to save space
      const urlParts = imageUrl.split('/');
      const fileName = urlParts.pop();
      if (fileName && imageUrl.includes('testimonials/')) {
        await supabase.storage.from('portfolio-media').remove([`testimonials/${fileName}`]);
      }

      // Delete from DB
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      
      setTestimonials(testimonials.filter(t => t.id !== id));
      toast.success("Testimony deleted successfully");
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete testimony");
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border flex justify-between items-center bg-background/50">
        <div>
          <h2 className="text-xl font-semibold">Manage Testimonials</h2>
          <p className="text-sm text-muted-foreground mt-1">Upload client testimony images for the carousel.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 glow-button text-white px-4 py-2 rounded-lg font-medium transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Testimony
        </button>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading testimonials...</div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-xl text-muted-foreground">
            No testimonials found. Click "Add Testimony" to upload your first image.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {testimonials.map((testimony) => (
              <div key={testimony.id} className="group relative aspect-square rounded-xl overflow-hidden border border-border bg-muted">
                <img 
                  src={testimony.image_url} 
                  alt="Testimony" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                  <button 
                    onClick={() => handleDelete(testimony.id, testimony.image_url)}
                    className="p-2.5 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full transition-colors shadow-lg"
                    title="Delete Testimony"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Testimony Image</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Select Image File</Label>
              <div className="flex flex-col gap-3">
                {imageFile ? (
                  <div className="relative w-full aspect-square max-h-[300px] rounded-lg overflow-hidden border border-primary/50">
                    <img src={URL.createObjectURL(imageFile)} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="relative w-full aspect-square max-h-[200px] rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground bg-muted/50">
                    <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                    <span className="text-sm">No image selected</span>
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isUploading}>Cancel</Button>
            <Button onClick={handleSave} disabled={isUploading || !imageFile}>
              {isUploading ? "Uploading..." : "Upload & Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
