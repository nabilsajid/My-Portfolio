import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Briefcase } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ExperienceEditor() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    period: "",
    role: "",
    company: "",
    description: "",
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('experience')
        .select('*')
        .order('id', { ascending: true }); // Order by ID to keep insertion order, or use a sort_order column ideally
        
      if (error) throw error;
      setExperiences(data || []);
    } catch (error) {
      console.error("Error fetching experience:", error);
      toast.error("Failed to load experience");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (exp: any) => {
    setEditingExp(exp);
    setFormData({
      period: exp.period || "",
      role: exp.role || "",
      company: exp.company || "",
      description: exp.description || "",
    });
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingExp(null);
    setFormData({
      period: "",
      role: "",
      company: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.period || !formData.role || !formData.company) {
      toast.error("Period, Role, and Company are required.");
      return;
    }

    try {
      if (editingExp) {
        // Update existing
        const { error } = await supabase
          .from('experience')
          .update(formData)
          .eq('id', editingExp.id);
        
        if (error) throw error;
        toast.success("Experience updated successfully");
      } else {
        // Insert new
        const { error } = await supabase
          .from('experience')
          .insert([formData]);
          
        if (error) throw error;
        toast.success("Experience added successfully");
      }
      
      setIsModalOpen(false);
      fetchExperiences(); // Refresh the list
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Failed to save experience");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this experience?")) return;
    
    try {
      const { error } = await supabase.from('experience').delete().eq('id', id);
      if (error) throw error;
      
      setExperiences(experiences.filter(p => p.id !== id));
      toast.success("Experience deleted successfully");
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete experience");
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border flex justify-between items-center bg-background/50">
        <div>
          <h2 className="text-xl font-semibold">Manage Experience</h2>
          <p className="text-sm text-muted-foreground mt-1">Add, edit, or remove your professional experience.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 glow-button text-white px-4 py-2 rounded-lg font-medium transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Experience
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="p-4 font-medium text-sm text-muted-foreground w-12"></th>
              <th className="p-4 font-medium text-sm text-muted-foreground">Role / Company</th>
              <th className="p-4 font-medium text-sm text-muted-foreground">Period</th>
              <th className="p-4 font-medium text-sm text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {experiences.map((exp) => (
              <tr key={exp.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                <td className="p-4">
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                    <Briefcase className="w-5 h-5" />
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium">{exp.role}</div>
                  <div className="text-sm text-muted-foreground">{exp.company}</div>
                </td>
                <td className="p-4 text-sm whitespace-nowrap">{exp.period}</td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => handleOpenEdit(exp)}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors" 
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(exp.id)}
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
                  Loading experience...
                </td>
              </tr>
            ) : experiences.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  No experience found. Click "Add Experience" to create one.
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
            <DialogTitle>{editingExp ? "Edit Experience" : "Add Experience"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="role">Role / Job Title</Label>
                <Input
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Lead Video Editor"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. TarTar Digital"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="period">Period (Timeframe)</Label>
              <Input
                id="period"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="e.g. JUN 2025 - PRESENT"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your responsibilities and achievements..."
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
