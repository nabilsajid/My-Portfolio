import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjects, addProject, updateProject, deleteProject } from "@/lib/db";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { useLocation } from "react-router-dom";

const AdminProjects = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryFilter = searchParams.get("category");

  const { data: allProjects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects
  });

  const projects = allProjects.filter((p: any) => {
    if (!categoryFilter) return true;
    if (categoryFilter === "video") return p.category === "long-form" || p.category === "short-form";
    return p.category === categoryFilter;
  });

  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', category: 'long-form', image_url: '', label: '', video_url: '', gallery_images: '' });

  const addMutation = useMutation({
    mutationFn: addProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsOpen(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateProject(data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsOpen(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] })
  });

  const handleEdit = (p: any) => {
    setEditingId(p.id);
    setFormData({ 
      title: p.title, 
      category: p.category, 
      image_url: p.image_url, 
      label: p.label || '', 
      video_url: p.video_url || '', 
      gallery_images: (p.gallery_images || []).join(', ') 
    });
    setIsOpen(true);
  };

  const handleAdd = () => {
    setEditingId(null);
    let defaultCat = 'long-form';
    if (categoryFilter === 'photography') defaultCat = 'photography';
    if (categoryFilter === 'poster') defaultCat = 'poster';
    
    setFormData({ title: '', category: defaultCat, image_url: '', label: '', video_url: '', gallery_images: '' });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { 
      ...formData, 
      gallery_images: formData.gallery_images ? formData.gallery_images.split(',').map(s => s.trim()).filter(Boolean) : null 
    };
    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      addMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight capitalize">
            {categoryFilter ? `${categoryFilter} Projects` : 'All Projects'}
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your {categoryFilter || 'video, poster, and photography'} projects.
          </p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Project
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          projects.map((p: any) => (
            <div key={p.id} className="bg-card rounded-xl border border-border overflow-hidden flex flex-col">
              <div className="aspect-video w-full overflow-hidden bg-muted">
                {p.image_url && <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold truncate pr-2">{p.title}</h3>
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full shrink-0">
                    {p.category}
                  </span>
                </div>
                {p.label && <p className="text-sm text-muted-foreground mb-4">{p.label}</p>}
                
                <div className="mt-auto pt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(p)}>
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(p.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input required type="text" className="w-full bg-background border border-border rounded-md px-3 py-2" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select required className="w-full bg-background border border-border rounded-md px-3 py-2" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="long-form">Long Form Video</option>
                <option value="short-form">Short Form Video</option>
                <option value="photography">Photography</option>
                <option value="poster">Poster/Design</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Label (Optional)</label>
              <input type="text" className="w-full bg-background border border-border rounded-md px-3 py-2" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image URL (Thumbnail)</label>
              <input required type="text" className="w-full bg-background border border-border rounded-md px-3 py-2" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
            </div>
            
            {['long-form', 'short-form'].includes(formData.category) && (
              <div className="space-y-2">
                <label className="text-sm font-medium">YouTube Video URL</label>
                <input type="text" className="w-full bg-background border border-border rounded-md px-3 py-2" value={formData.video_url} onChange={e => setFormData({...formData, video_url: e.target.value})} />
              </div>
            )}

            {formData.category === 'photography' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Gallery Images (Comma separated URLs)</label>
                <textarea className="w-full bg-background border border-border rounded-md px-3 py-2 h-24" value={formData.gallery_images} onChange={e => setFormData({...formData, gallery_images: e.target.value})} />
              </div>
            )}

            <Button type="submit" className="w-full">
              {editingId ? 'Update Project' : 'Save Project'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProjects;