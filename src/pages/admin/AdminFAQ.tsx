import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFaqs, addFaq, updateFaq, deleteFaq } from "@/lib/db";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AdminFAQ = () => {
  const queryClient = useQueryClient();
  const { data: faqs = [], isLoading } = useQuery({
    queryKey: ['faqs'],
    queryFn: getFaqs
  });

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ question: '', answer: '', sort_order: 0 });

  const addMutation = useMutation({
    mutationFn: addFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      setIsOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number, payload: any }) => updateFaq(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faqs'] });
      setIsOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFaq,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['faqs'] })
  });

  const handleEdit = (f: any) => {
    setEditingId(f.id);
    setFormData({ question: f.question, answer: f.answer, sort_order: f.sort_order });
    setIsOpen(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    setFormData({ question: '', answer: '', sort_order: faqs.length + 1 });
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
          <h1 className="text-3xl font-bold tracking-tight">FAQ</h1>
          <p className="text-muted-foreground mt-2">Manage frequently asked questions.</p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add FAQ
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Question</label>
              <input required type="text" className="w-full bg-background border border-border rounded-md px-3 py-2"
                value={formData.question} onChange={e => setFormData({...formData, question: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Answer</label>
              <textarea required className="w-full bg-background border border-border rounded-md px-3 py-2 h-24"
                value={formData.answer} onChange={e => setFormData({...formData, answer: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort Order</label>
              <input required type="number" className="w-full bg-background border border-border rounded-md px-3 py-2"
                value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value) || 0})} />
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
          <div className="p-8 text-center text-muted-foreground">Loading FAQs...</div>
        ) : faqs.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No FAQs found.</div>
        ) : (
          <div className="divide-y divide-border">
            {faqs.map((f: any) => (
              <div key={f.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div>
                  <h4 className="font-medium text-sm">{f.sort_order}. {f.question}</h4>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(f)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => {
                    if (window.confirm('Are you sure?')) deleteMutation.mutate(f.id);
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

export default AdminFAQ;