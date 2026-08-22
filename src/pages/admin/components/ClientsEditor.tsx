import { useState, useEffect } from "react";
import { Plus, Trash2, Image as ImageIcon, Crop, ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useImageCropper } from "@/components/admin/useImageCropper";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ClientsEditor() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  
  // Form State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { requestCrop, CropperComponent } = useImageCropper();
  const [formData, setFormData] = useState({
    name: "",
    image_url: "",
    order_index: 0,
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('client_logos')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
      toast.error("Failed to load client logos");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingClient(null);
    setImageFile(null); // Reset file input
    setFormData({
      name: "",
      image_url: "",
      order_index: clients.length,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Client name is required.");
      return;
    }
    
    if (!formData.image_url && !imageFile) {
      toast.error("A logo image is required.");
      return;
    }

    try {
      setIsUploading(true);
      let finalImageUrl = formData.image_url;

      // Handle Image Upload if a new file was selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `clients/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('portfolio-media')
          .upload(filePath, imageFile);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          // If the bucket doesn't exist, we might get an error.
          toast.error(`Upload error: ${uploadError.message || "Failed to upload image"}`);
          throw uploadError;
        }

        // Get the public URL
        const { data: publicUrlData } = supabase.storage
          .from('portfolio-media')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrlData.publicUrl;
      }

      const payload = { ...formData, image_url: finalImageUrl };

      if (editingClient) {
        // Update existing (not heavily used since we mostly add/delete, but here for completeness)
        const { error } = await supabase
          .from('client_logos')
          .update(payload)
          .eq('id', editingClient.id);
        
        if (error) {
          toast.error(`DB Update Error: ${error.message}`);
          throw error;
        }
        toast.success("Client logo updated successfully");
      } else {
        // Insert new
        const { error } = await supabase
          .from('client_logos')
          .insert([payload]);
          
        if (error) {
          toast.error(`DB Insert Error: ${error.message}`);
          throw error;
        }
        toast.success("Client logo added successfully");
      }
      
      setIsModalOpen(false);
      setImageFile(null);
      fetchClients(); // Refresh the list
    } catch (error: any) {
      console.error("Error saving:", error);
      // Don't show generic error if we already showed a specific one
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this client logo?")) return;
    
    try {
      const { error } = await supabase.from('client_logos').delete().eq('id', id);
      if (error) throw error;
      
      setClients(clients.filter(c => c.id !== id));
      toast.success("Client logo removed");
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to remove client logo");
    }
  };


  const handleMove = async (index: number, direction: 'left' | 'right') => {
    if (
      (direction === 'left' && index === 0) ||
      (direction === 'right' && index === clients.length - 1)
    ) return;

    const newIndex = direction === 'left' ? index - 1 : index + 1;
    const currentClient = clients[index];
    const targetClient = clients[newIndex];

    const newClients = [...clients];
    newClients[index] = targetClient;
    newClients[newIndex] = currentClient;

    const currentOrder = currentClient.order_index ?? index;
    const targetOrder = targetClient.order_index ?? newIndex;

    if (currentOrder === targetOrder) {
      newClients.forEach((client, i) => {
        client.order_index = i;
      });
      setClients([...newClients]);

      try {
        const promises = newClients.map((client) =>
          supabase.from('client_logos').update({ order_index: client.order_index }).eq('id', client.id)
        );
        await Promise.all(promises);
      } catch (error) {
        toast.error("Failed to reorder");
        fetchClients();
      }
    } else {
      currentClient.order_index = targetOrder;
      targetClient.order_index = currentOrder;
      setClients([...newClients]);

      try {
        await Promise.all([
          supabase.from('client_logos').update({ order_index: targetOrder }).eq('id', currentClient.id),
          supabase.from('client_logos').update({ order_index: currentOrder }).eq('id', targetClient.id)
        ]);
      } catch (error) {
        toast.error("Failed to reorder");
        fetchClients();
      }
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      {CropperComponent}
      <div className="p-6 border-b border-border flex justify-between items-center bg-background/50">
        <div>
          <h2 className="text-xl font-semibold">Client Logos</h2>
          <p className="text-sm text-muted-foreground mt-1">Upload logos of brands you've worked with.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 glow-button text-white px-4 py-2 rounded-lg font-medium transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Logo
        </button>
      </div>
      
      <div className="overflow-x-auto p-6">
        {loading ? (
          <div className="text-center py-10 text-muted-foreground animate-pulse">Loading logos...</div>
        ) : clients.length === 0 ? (
          <div className="text-center py-10 border-2 border-dashed border-border rounded-xl">
            <ImageIcon className="w-10 h-10 mx-auto text-muted-foreground opacity-50 mb-3" />
            <p className="text-muted-foreground">No client logos found.</p>
            <p className="text-sm text-muted-foreground opacity-70 mt-1">Click Add Logo to upload one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {clients.map((client, index) => (
              <div key={client.id} className="relative group bg-background border border-border rounded-xl p-4 flex flex-col items-center justify-center transition-all hover:border-primary/40">
                <div className="h-16 w-full flex items-center justify-center mb-3">
                  <img src={client.image_url} alt={client.name} className="max-h-full max-w-full object-contain" />
                </div>
                <p className="text-xs font-medium text-center text-muted-foreground truncate w-full">{client.name}</p>
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-xl backdrop-blur-[2px]">
                  {index > 0 && (
                    <button 
                      onClick={() => handleMove(index, 'left')}
                      className="p-1.5 bg-background/20 text-white hover:bg-background/40 rounded-full transition-colors shadow-lg"
                      title="Move Left"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={async () => {
                      const croppedFile = await requestCrop(client.image_url);
                      if (croppedFile) {
                        toast.loading("Cropping logo...");
                        try {
                          const fileExt = croppedFile.name.split('.').pop() || 'png';
                          const fileName = `client_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
                          const filePath = `clients/${fileName}`;
                          
                          const { error: uploadError } = await supabase.storage.from('portfolio-media').upload(filePath, croppedFile);
                          if (uploadError) throw uploadError;
                          
                          const { data: publicUrlData } = supabase.storage.from('portfolio-media').getPublicUrl(filePath);
                          
                          const { error } = await supabase.from('client_logos').update({ image_url: publicUrlData.publicUrl }).eq('id', client.id);
                          if (error) throw error;
                          
                          fetchClients();
                          toast.dismiss();
                          toast.success("Logo cropped successfully!");
                        } catch (error) {
                          toast.dismiss();
                          toast.error("Failed to crop logo");
                        }
                      }
                    }}
                    className="p-1.5 bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-full transition-colors shadow-lg"
                    title="Crop Logo"
                  >
                    <Crop className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="p-1.5 bg-destructive text-white rounded-full transition-colors hover:scale-110 shadow-lg"
                    title="Remove Logo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {index < clients.length - 1 && (
                    <button 
                      onClick={() => handleMove(index, 'right')}
                      className="p-1.5 bg-background/20 text-white hover:bg-background/40 rounded-full transition-colors shadow-lg"
                      title="Move Right"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card border-border">
          <DialogHeader>
            <DialogTitle>Add Client Logo</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Client Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. BYD, Razer, etc."
                className="bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Logo Image</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      const croppedFile = await requestCrop(e.target.files[0]);
                      if (croppedFile) {
                        setImageFile(croppedFile);
                      }
                    }
                  }}
                  className="hidden"
                  id="logo-upload"
                />
                <Label htmlFor="logo-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm font-medium text-primary">Click to upload</span>
                  <span className="text-xs text-muted-foreground">PNG, SVG, or JPG</span>
                </Label>
              </div>
              {imageFile && (
                <p className="text-sm text-emerald-500 mt-2 text-center">Selected: {imageFile.name}</p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isUploading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isUploading} className="glow-button text-white">
              {isUploading ? "Uploading..." : "Save Logo"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
