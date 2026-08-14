import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Award } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as Icons from "lucide-react";

export default function AchievementsEditor() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    role: "",
    description: "",
    icon: "Award",
  });

  // Available icons for selection
  const iconOptions = ["Film", "Clapperboard", "Monitor", "Video", "Eye", "Aperture", "Camera", "Award", "Trophy", "Star"];

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('id', { ascending: true });
        
      if (error) throw error;
      setAchievements(data || []);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      toast.error("Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (ach: any) => {
    setEditingId(ach.id);
    setFormData({
      title: ach.title || "",
      role: ach.role || "",
      description: ach.description || "",
      icon: ach.icon || "Award",
    });
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      title: "",
      role: "",
      description: "",
      icon: "Award",
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.role) {
      toast.error("Title and Role are required.");
      return;
    }

    try {
      if (editingId) {
        // Update existing
        const { error } = await supabase
          .from('achievements')
          .update(formData)
          .eq('id', editingId);
        
        if (error) throw error;
        toast.success("Achievement updated successfully");
      } else {
        // Insert new
        const { error } = await supabase
          .from('achievements')
          .insert([formData]);
          
        if (error) throw error;
        toast.success("Achievement added successfully");
      }
      
      setIsModalOpen(false);
      fetchAchievements(); // Refresh the list
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Failed to save achievement");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this achievement?")) return;
    
    try {
      const { error } = await supabase.from('achievements').delete().eq('id', id);
      if (error) throw error;
      
      setAchievements(achievements.filter(a => a.id !== id));
      toast.success("Achievement deleted successfully");
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete achievement");
    }
  };

  // Helper to render icon component
  const renderIcon = (iconName: string, className: string = "w-5 h-5") => {
    const IconComponent = (Icons as any)[iconName] || Icons.Award;
    return <IconComponent className={className} />;
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border flex justify-between items-center bg-background/50">
        <div>
          <h2 className="text-xl font-semibold">Manage Projects & Achievements</h2>
          <p className="text-sm text-muted-foreground mt-1">Add your notable events, milestones, and awards.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 glow-button text-white px-4 py-2 rounded-lg font-medium transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Achievement
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="p-4 font-medium text-sm text-muted-foreground w-12"></th>
              <th className="p-4 font-medium text-sm text-muted-foreground">Title</th>
              <th className="p-4 font-medium text-sm text-muted-foreground">Role</th>
              <th className="p-4 font-medium text-sm text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {achievements.map((ach) => (
              <tr key={ach.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="p-4">
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                    {renderIcon(ach.icon)}
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium">{ach.title}</div>
                </td>
                <td className="p-4 text-sm text-muted-foreground">
                  <span className="px-2 py-1 bg-muted rounded-md text-xs font-medium uppercase tracking-wider">{ach.role}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleOpenEdit(ach)}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors" 
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(ach.id)}
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
                  Loading achievements...
                </td>
              </tr>
            ) : achievements.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  No achievements found. Click "Add Achievement" to create one.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Achievement" : "Add Achievement"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title / Event Name</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. BYD Bangladesh"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Video Content Lead"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="icon">Icon</Label>
                <Select value={formData.icon} onValueChange={(val) => setFormData({ ...formData, icon: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map(iconName => (
                      <SelectItem key={iconName} value={iconName}>
                        <div className="flex items-center gap-2">
                          {renderIcon(iconName, "w-4 h-4")}
                          <span>{iconName}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your role and what you achieved..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
