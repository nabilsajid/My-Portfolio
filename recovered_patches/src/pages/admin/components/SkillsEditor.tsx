import { useState, useEffect } from "react";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function SkillsEditor() {
  const [skills, setSkills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  
  // Form State
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    level: 50,
    details: "",
    order_index: 0,
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setSkills(data || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
      toast.error("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingSkill(null);
    setFormData({
      name: "",
      level: 50,
      details: "",
      order_index: skills.length,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (skill: any) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      level: skill.level,
      details: skill.details || "",
      order_index: skill.order_index,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Skill name is required.");
      return;
    }
    
    if (formData.level < 0 || formData.level > 100) {
      toast.error("Skill level must be between 0 and 100.");
      return;
    }

    try {
      setIsSaving(true);

      const payload = { ...formData };

      if (editingSkill) {
        // Update existing
        const { error } = await supabase
          .from('skills')
          .update(payload)
          .eq('id', editingSkill.id);
          
        if (error) throw error;
        toast.success("Skill updated successfully");
      } else {
        // Insert new
        const { error } = await supabase
          .from('skills')
          .insert([payload]);
          
        if (error) throw error;
        toast.success("Skill added successfully");
      }

      setIsModalOpen(false);
      fetchSkills(); // Refresh the list
    } catch (error: any) {
      console.error("Error saving skill:", error);
      toast.error(error.message || "Failed to save skill");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success("Skill deleted");
      fetchSkills();
    } catch (error: any) {
      console.error("Error deleting skill:", error);
      toast.error("Failed to delete skill");
    }
  };

  const moveSkill = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === skills.length - 1)
    ) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const newSkills = [...skills];
    
    // Swap order_index values
    const tempOrder = newSkills[index].order_index;
    newSkills[index].order_index = newSkills[newIndex].order_index;
    newSkills[newIndex].order_index = tempOrder;
    
    // Swap in array for immediate UI feedback
    const temp = newSkills[index];
    newSkills[index] = newSkills[newIndex];
    newSkills[newIndex] = temp;
    
    setSkills(newSkills);

    // Update in database
    try {
      await Promise.all([
        supabase.from('skills').update({ order_index: newSkills[index].order_index }).eq('id', newSkills[index].id),
        supabase.from('skills').update({ order_index: newSkills[newIndex].order_index }).eq('id', newSkills[newIndex].id)
      ]);
    } catch (error) {
      console.error("Error reordering skills:", error);
      toast.error("Failed to save new order");
      fetchSkills(); // Revert to server state on error
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading skills...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Core Skills</h2>
          <p className="text-sm text-muted-foreground">Manage your core skills and proficiency levels.</p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2">
          <Plus className="w-4 h-4" /> Add Skill
        </Button>
      </div>

      <div className="grid gap-3">
        {skills.length === 0 ? (
          <div className="text-center p-8 border border-border/50 rounded-xl bg-secondary/20 text-muted-foreground">
            No skills found. Click "Add Skill" to create one.
          </div>
        ) : (
          skills.map((skill, index) => (
            <div 
              key={skill.id} 
              className="flex items-center justify-between p-4 bg-secondary/30 border border-border/50 rounded-xl transition-colors hover:bg-secondary/50"
            >
              <div 
                className="flex flex-col cursor-pointer flex-1"
                onClick={() => handleOpenEdit(skill)}
              >
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-sm">{skill.name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                    {skill.level}%
                  </span>
                </div>
                {skill.details && (
                  <p className="text-xs text-muted-foreground line-clamp-1">{skill.details}</p>
                )}
              </div>
              
              <div className="flex items-center gap-2 pl-4">
                <div className="flex flex-col gap-1 mr-2">
                  <button 
                    onClick={() => moveSkill(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <button 
                    onClick={() => moveSkill(index, 'down')}
                    disabled={index === skills.length - 1}
                    className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>
                </div>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(skill.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background border-border">
          <DialogHeader>
            <DialogTitle>{editingSkill ? 'Edit Skill' : 'Add New Skill'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Skill Name *</Label>
              <Input 
                id="name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g. Adobe Premiere Pro" 
                className="bg-secondary/50"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="level">Proficiency Level (%) *</Label>
              <div className="flex items-center gap-4">
                <Input 
                  id="level" 
                  type="number" 
                  min="0" 
                  max="100"
                  value={formData.level} 
                  onChange={(e) => setFormData({...formData, level: parseInt(e.target.value) || 0})}
                  className="bg-secondary/50 w-24"
                />
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-primary" 
                    style={{ width: `${Math.min(100, Math.max(0, formData.level))}%` }} 
                  />
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="details">Details / Description</Label>
              <Textarea 
                id="details" 
                value={formData.details} 
                onChange={(e) => setFormData({...formData, details: e.target.value})}
                placeholder="Brief description of what you do with this skill..." 
                className="bg-secondary/50 resize-y"
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : (editingSkill ? "Update Skill" : "Add Skill")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}