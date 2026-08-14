import { useState, useEffect } from "react";
import { Plus, Trash2, ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function StatsEditor() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStat, setEditingStat] = useState<any>(null);
  
  // Form State
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    end_value: 0,
    suffix: "",
    label: "",
    order_index: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('stats')
        .select('*')
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setStats(data || []);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingStat(null);
    setFormData({
      end_value: 0,
      suffix: "+",
      label: "",
      order_index: stats.length,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (stat: any) => {
    setEditingStat(stat);
    setFormData({
      end_value: stat.end_value,
      suffix: stat.suffix || "",
      label: stat.label,
      order_index: stat.order_index,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.label) {
      toast.error("Stat label is required.");
      return;
    }
    
    if (formData.end_value < 0) {
      toast.error("Value must be a positive number.");
      return;
    }

    try {
      setIsSaving(true);

      const payload = { ...formData };

      if (editingStat) {
        const { error } = await supabase
          .from('stats')
          .update(payload)
          .eq('id', editingStat.id);
          
        if (error) throw error;
        toast.success("Stat updated successfully");
      } else {
        const { error } = await supabase
          .from('stats')
          .insert([payload]);
          
        if (error) throw error;
        toast.success("Stat added successfully");
      }

      setIsModalOpen(false);
      fetchStats(); 
    } catch (error: any) {
      console.error("Error saving stat:", error);
      toast.error(error.message || "Failed to save stat");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this stat?")) return;
    
    try {
      const { error } = await supabase
        .from('stats')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success("Stat deleted");
      fetchStats();
    } catch (error: any) {
      console.error("Error deleting stat:", error);
      toast.error("Failed to delete stat");
    }
  };

  const moveStat = async (index: number, direction: 'left' | 'right') => {
    if (
      (direction === 'left' && index === 0) || 
      (direction === 'right' && index === stats.length - 1)
    ) return;

    const newIndex = direction === 'left' ? index - 1 : index + 1;
    const newStats = [...stats];
    
    const tempOrder = newStats[index].order_index;
    newStats[index].order_index = newStats[newIndex].order_index;
    newStats[newIndex].order_index = tempOrder;
    
    const temp = newStats[index];
    newStats[index] = newStats[newIndex];
    newStats[newIndex] = temp;
    
    setStats(newStats);

    try {
      await Promise.all([
        supabase.from('stats').update({ order_index: newStats[index].order_index }).eq('id', newStats[index].id),
        supabase.from('stats').update({ order_index: newStats[newIndex].order_index }).eq('id', newStats[newIndex].id)
      ]);
    } catch (error) {
      console.error("Error reordering stats:", error);
      toast.error("Failed to save new order");
      fetchStats(); 
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading stats...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Counter / Stats</h2>
          <p className="text-sm text-muted-foreground">Manage the statistical counters displayed on your portfolio.</p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2">
          <Plus className="w-4 h-4" /> Add Stat
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.length === 0 ? (
          <div className="col-span-full text-center p-8 border border-border/50 rounded-xl bg-secondary/20 text-muted-foreground">
            No stats found. Click "Add Stat" to create one.
          </div>
        ) : (
          stats.map((stat, index) => (
            <div 
              key={stat.id} 
              className="flex flex-col items-center text-center p-6 bg-secondary/30 border border-border/50 rounded-xl transition-colors hover:bg-secondary/50 group relative"
            >
              <div 
                className="cursor-pointer w-full"
                onClick={() => handleOpenEdit(stat)}
              >
                <div className="text-4xl md:text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2">
                  {stat.end_value}{stat.suffix}
                </div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </div>
              </div>
              
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-8 h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(stat.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={(e) => { e.stopPropagation(); moveStat(index, 'left'); }}
                  disabled={index === 0}
                  className="p-1.5 rounded bg-background/50 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); moveStat(index, 'right'); }}
                  disabled={index === stats.length - 1}
                  className="p-1.5 rounded bg-background/50 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-background border-border">
          <DialogHeader>
            <DialogTitle>{editingStat ? 'Edit Stat' : 'Add New Stat'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="end_value">Number Value *</Label>
                <Input 
                  id="end_value" 
                  type="number"
                  min="0"
                  value={formData.end_value} 
                  onChange={(e) => setFormData({...formData, end_value: parseInt(e.target.value) || 0})}
                  className="bg-secondary/50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="suffix">Suffix (Optional)</Label>
                <Input 
                  id="suffix" 
                  value={formData.suffix} 
                  onChange={(e) => setFormData({...formData, suffix: e.target.value})}
                  placeholder="e.g. +, M+, %" 
                  className="bg-secondary/50"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="label">Label Text *</Label>
              <Input 
                id="label" 
                value={formData.label} 
                onChange={(e) => setFormData({...formData, label: e.target.value})}
                placeholder="e.g. Projects Completed" 
                className="bg-secondary/50"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : (editingStat ? "Update Stat" : "Add Stat")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}