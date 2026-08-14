import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getExperience, addExperience, updateExperience, deleteExperience } from "@/lib/db";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AdminExperience = () => {
  const queryClient = useQueryClient();
  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ['experience'],
    queryFn: getExperience
  });

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ role: '', company: '', period: '', description: '' });

  const addMutation = useMutation({
    mutationFn: addExperience,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
      setIsOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number, payload: any }) => updateExperience(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experience'] });
      setIsOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExperience,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['experience'] })
  });

  const handleEdit = (exp: any) => {
    setEditingId(exp.id);
    setFormData({ role: exp.role, company: exp.company, period: exp.period, description: exp.description });
    setIsOpen(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ role: '', company: '', period: '', description: '' });
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
          <h1 className="text-3xl font-bold tracking-tight">Experience</h1>
          <p className="text-muted-foreground mt-2">
            Add or edit your work history and professional journey.
          </p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Experience
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Role (e.g. Lead Video Editor)</label>
              <input required type="text" className="w-full bg-background border border-border rounded-md px-3 py-2"
                value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Company</label>
              <input required type="text" className="w-full bg-background border border-border rounded-md px-3 py-2"
                value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Period (e.g. Jan 2024 – Present)</label>
              <input required type="text" className="w-full bg-background border border-border rounded-md px-3 py-2"
                value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea required className="w-full bg-background border border-border rounded-md px-3 py-2 h-24"
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
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
          <div className="p-8 text-center text-muted-foreground">Loading experience...</div>
        ) : experiences.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No experience entries found.</div>
        ) : (
          <div className="divide-y divide-border">
            {experiences.map((exp: any) => (
              <div key={exp.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div>
                  <h4 className="font-medium">{exp.role} <span className="text-muted-foreground font-normal">at {exp.company}</span></h4>
                  <p className="text-sm text-muted-foreground">{exp.period}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(exp)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                    if (window.confirm('Are you sure?')) deleteMutation.mutate(exp.id);
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

export default AdminExperience;