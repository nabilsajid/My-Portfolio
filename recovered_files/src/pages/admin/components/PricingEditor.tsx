import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Tag, Check, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function PricingEditor() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    tier_id: "",
    name: "",
    tagline: "",
    base_price: "",
    base_videos: 0,
    base_reels: 0,
    video_max_min: "",
    video_label: "",
    video_style: "", // will parse as JSON
    reel_style: "",
    extra_video_price: 0,
    extra_reel_price: 0,
    extra_minute_price: 0,
    max_reels: "",
    exclusive: false,
    best_for: "",
    reference_url: "",
    featured: false,
    delivery: "",
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('pricing')
        .select('*')
        .order('id', { ascending: true });
        
      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error("Error fetching pricing:", error);
      toast.error("Failed to load pricing packages");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (pkg: any) => {
    setEditingId(pkg.id);
    setFormData({
      tier_id: pkg.tier_id || "",
      name: pkg.name || "",
      tagline: pkg.tagline || "",
      base_price: pkg.base_price !== null ? String(pkg.base_price) : "",
      base_videos: pkg.base_videos || 0,
      base_reels: pkg.base_reels || 0,
      video_max_min: pkg.video_max_min ? String(pkg.video_max_min) : "",
      video_label: pkg.video_label || "",
      video_style: Array.isArray(pkg.video_style) ? pkg.video_style.join(", ") : (pkg.video_style || ""),
      reel_style: pkg.reel_style || "",
      extra_video_price: pkg.extra_video_price || 0,
      extra_reel_price: pkg.extra_reel_price || 0,
      extra_minute_price: pkg.extra_minute_price || 0,
      max_reels: pkg.max_reels ? String(pkg.max_reels) : "",
      exclusive: pkg.exclusive || false,
      best_for: pkg.best_for || "",
      reference_url: pkg.reference_url || "",
      featured: pkg.featured || false,
      delivery: pkg.delivery || "",
    });
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      tier_id: "custom_" + Math.floor(Math.random() * 10000),
      name: "",
      tagline: "",
      base_price: "",
      base_videos: 1,
      base_reels: 0,
      video_max_min: "",
      video_label: "",
      video_style: "",
      reel_style: "",
      extra_video_price: 0,
      extra_reel_price: 0,
      extra_minute_price: 0,
      max_reels: "",
      exclusive: false,
      best_for: "",
      reference_url: "",
      featured: false,
      delivery: "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.tier_id) {
      toast.error("Name and ID are required.");
      return;
    }

    try {
      const payload = {
        ...formData,
        base_price: formData.base_price ? parseInt(formData.base_price) : null,
        video_max_min: formData.video_max_min ? parseInt(formData.video_max_min) : null,
        max_reels: formData.max_reels ? parseInt(formData.max_reels) : null,
        video_style: formData.video_style.split(",").map(s => s.trim()).filter(s => s), // Convert to JSON string array
      };

      if (editingId) {
        // Update existing
        const { error } = await supabase
          .from('pricing')
          .update(payload)
          .eq('id', editingId);
        
        if (error) throw error;
        toast.success("Package updated successfully");
      } else {
        // Insert new
        const { error } = await supabase
          .from('pricing')
          .insert([payload]);
          
        if (error) throw error;
        toast.success("Package added successfully");
      }
      
      setIsModalOpen(false);
      fetchPackages(); // Refresh the list
    } catch (error: any) {
      console.error("Error saving:", error);
      toast.error(error.message || "Failed to save package");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this pricing package?")) return;
    
    try {
      const { error } = await supabase.from('pricing').delete().eq('id', id);
      if (error) throw error;
      
      setPackages(packages.filter(a => a.id !== id));
      toast.success("Package deleted successfully");
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete package");
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border flex justify-between items-center bg-background/50">
        <div>
          <h2 className="text-xl font-semibold">Manage Pricing Packages</h2>
          <p className="text-sm text-muted-foreground mt-1">Configure your services, pricing, and features.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 glow-button text-white px-4 py-2 rounded-lg font-medium transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Package
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="p-4 font-medium text-sm text-muted-foreground">Package Name</th>
              <th className="p-4 font-medium text-sm text-muted-foreground">Base Price</th>
              <th className="p-4 font-medium text-sm text-muted-foreground">Base Included</th>
              <th className="p-4 font-medium text-sm text-muted-foreground">Status</th>
              <th className="p-4 font-medium text-sm text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map((pkg) => (
              <tr key={pkg.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="p-4">
                  <div className="font-medium flex items-center gap-2">
                    {pkg.name}
                    {pkg.featured && <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />}
                  </div>
                  <div className="text-xs text-muted-foreground">{pkg.tagline}</div>
                </td>
                <td className="p-4 text-sm">
                  {pkg.base_price ? `${pkg.base_price.toLocaleString()}tk` : "Custom Quote"}
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  {pkg.base_videos} {pkg.video_label || "Videos"} & {pkg.base_reels} Reels
                </td>
                <td className="p-4 text-sm">
                  <span className="px-2 py-1 bg-muted rounded-md text-xs font-medium tracking-wider">
                    {pkg.tier_id}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleOpenEdit(pkg)}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors" 
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(pkg.id)}
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
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  Loading packages...
                </td>
              </tr>
            ) : packages.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  No packages found. Click "Add Package" to create one.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Pricing Package" : "Add Pricing Package"}</DialogTitle>
            <DialogDescription>
              Configure the details of this package, which appears in the calculator on your website.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4 border-r border-border/50 pr-4">
              <h3 className="font-semibold text-primary mb-2">Basic Info</h3>
              <div className="grid gap-2">
                <Label htmlFor="name">Package Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Starter" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} placeholder="e.g. For standard edits" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="base_price">Base Price (tk)</Label>
                  <Input id="base_price" type="number" value={formData.base_price} onChange={(e) => setFormData({ ...formData, base_price: e.target.value })} placeholder="Leave empty for Custom Quote" />
                </div>
                <div className="grid gap-2 flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} className="rounded border-border bg-background" />
                    Most Popular (Featured)
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="base_videos">Base Videos Included</Label>
                  <Input id="base_videos" type="number" value={formData.base_videos} onChange={(e) => setFormData({ ...formData, base_videos: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="base_reels">Base Reels Included</Label>
                  <Input id="base_reels" type="number" value={formData.base_reels} onChange={(e) => setFormData({ ...formData, base_reels: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="best_for">Best For (Footer Note)</Label>
                <Input id="best_for" value={formData.best_for} onChange={(e) => setFormData({ ...formData, best_for: e.target.value })} placeholder="e.g. Small businesses & personal brands" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reference_url">Reference YouTube Link</Label>
                <Input id="reference_url" value={formData.reference_url} onChange={(e) => setFormData({ ...formData, reference_url: e.target.value })} placeholder="https://youtube.com/embed/..." />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-primary mb-2">Calculator Pricing Options</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="grid gap-2">
                  <Label htmlFor="extra_video_price" className="text-xs">Extra Video (tk)</Label>
                  <Input id="extra_video_price" type="number" value={formData.extra_video_price} onChange={(e) => setFormData({ ...formData, extra_video_price: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="extra_reel_price" className="text-xs">Extra Reel (tk)</Label>
                  <Input id="extra_reel_price" type="number" value={formData.extra_reel_price} onChange={(e) => setFormData({ ...formData, extra_reel_price: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="extra_minute_price" className="text-xs">Extra Min (tk)</Label>
                  <Input id="extra_minute_price" type="number" value={formData.extra_minute_price} onChange={(e) => setFormData({ ...formData, extra_minute_price: parseInt(e.target.value) || 0 })} />
                </div>
              </div>

              <h3 className="font-semibold text-primary mt-6 mb-2">Visual Details</h3>
              <div className="grid gap-2">
                <Label htmlFor="video_style">Video Features (comma separated)</Label>
                <Textarea id="video_style" value={formData.video_style} onChange={(e) => setFormData({ ...formData, video_style: e.target.value })} placeholder="Color grading, Copyright free music, Standard editing" className="h-16" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reel_style">Reel Feature Text</Label>
                <Input id="reel_style" value={formData.reel_style} onChange={(e) => setFormData({ ...formData, reel_style: e.target.value })} placeholder="e.g. Basic social media edit" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="video_max_min" className="text-xs">Video Max Minutes (optional)</Label>
                  <Input id="video_max_min" type="number" value={formData.video_max_min} onChange={(e) => setFormData({ ...formData, video_max_min: e.target.value })} placeholder="e.g. 3" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="delivery" className="text-xs">Delivery Time (optional)</Label>
                  <Input id="delivery" value={formData.delivery} onChange={(e) => setFormData({ ...formData, delivery: e.target.value })} placeholder="e.g. 3 working days" />
                </div>
              </div>
              
              <div className="mt-4 p-4 border border-border/40 rounded-lg bg-muted/20">
                <h4 className="text-sm font-semibold mb-2">Advanced Config</h4>
                <div className="grid gap-2 flex items-center mb-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" checked={formData.exclusive} onChange={(e) => setFormData({ ...formData, exclusive: e.target.checked })} className="rounded border-border bg-background" />
                    Exclusive (Video OR Reels, not both)
                  </label>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="max_reels" className="text-xs">Max Reels Limit (if exclusive)</Label>
                  <Input id="max_reels" type="number" value={formData.max_reels} onChange={(e) => setFormData({ ...formData, max_reels: e.target.value })} placeholder="e.g. 3" />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Package</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
