import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSkills, addSkill, updateSkill, deleteSkill } from "@/lib/db";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AdminSkills = () => {
  const queryClient = useQueryClient();
  const { data: skills = [], isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: getSkills
  });

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '', level: 0, details: '' });

  const addMutation = useMutation({
    mutationFn: addSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setIsOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number, payload: any }) => updateSkill(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      setIsOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['skills'] })
  });

  const handleEdit = (s: any) => {
    setEditingId(s.id);
    setFormData({ name: s.name, level: s.level, details: s.details });
    setIsOpen(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ name: '', level: 80, details: '' });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, payload: formData });
    } else {
      addMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
          <p className="text-muted-foreground mt-2">
            Manage your tools, software expertise, and professional skills.
          </p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Skill
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Skill' : 'Add Skill'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Skill Name (e.g. Premiere Pro)</label>
              <input required type="text" className="w-full bg-background border border-border rounded-md px-3 py-2"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Level (0-100)</label>
              <input required type="number" min="0" max="100" className="w-full bg-background border border-border rounded-md px-3 py-2"
                value={formData.level} onChange={e => setFormData({...formData, level: parseInt(e.target.value) || 0})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Details / Description</label>
              <textarea required className="w-full bg-background border border-border rounded-md px-3 py-2 h-24"
                value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} />
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={addMutation.isPending || updateMutation.isPending}>Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Loading skills...</div>
        ) : skills.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No skills found.</div>
        ) : (
          <div className="divide-y divide-border">
            {skills.map((s: any) => (
              <div key={s.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div>
                  <h4 className="font-medium">{s.name}</h4>
                  <p className="text-sm text-muted-foreground">Level: {s.level}%</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(s)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                    if (window.confirm('Are you sure?')) deleteMutation.mutate(s.id);
                  }}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSkills;