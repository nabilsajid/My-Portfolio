import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAchievements, addAchievement, updateAchievement, deleteAchievement } from "@/lib/db";
import { Achievement } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Check, X, Database, Terminal, Briefcase } from "lucide-react";

const AdminAchievements = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", role: "", description: "", icon: "Briefcase" });

  const { data: achievements = [], isLoading, isError, error } = useQuery({
    queryKey: ['achievements'],
    queryFn: getAchievements,
    retry: false // Don't retry if table is missing
  });

  const isTableMissing = isError && (error as any)?.message?.includes('does not exist');

  const addMutation = useMutation({
    mutationFn: (newAchievement: Omit<Achievement, 'id'>) => addAchievement(newAchievement),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number, updates: Partial<Achievement> }) => updateAchievement(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAchievement,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['achievements'] }),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, updates: formData });
    } else {
      addMutation.mutate(formData);
    }
  };

  const handleEdit = (achievement: Achievement) => {
    setEditingId(achievement.id!);
    setFormData({
      title: achievement.title,
      role: achievement.role || "",
      description: achievement.description || "",
      icon: achievement.icon || "Briefcase"
    });
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ title: "", role: "", description: "", icon: "Briefcase" });
    setEditingId(null);
    setIsFormOpen(false);
  };

  // Missing Table Error State
  if (isTableMissing || isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-2xl mx-auto space-y-6">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
          <Database className="w-10 h-10 text-red-400" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Database Table Missing</h2>
        <p className="text-muted-foreground text-lg">
          Your admin panel is ready, but the <code className="bg-muted px-2 py-1 rounded text-primary">achievements</code> table hasn't been created in Supabase yet.
        </p>
        
        <div className="w-full bg-black/50 border border-border/50 rounded-xl p-6 text-left shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-500 to-orange-500" />
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <Terminal className="w-4 h-4" />
            <span>Run this in your Supabase SQL Editor:</span>
          </div>
          <pre className="text-sm font-mono text-blue-300 overflow-x-auto p-4 bg-black/50 rounded-lg border border-white/5">
            {`CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  role TEXT,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE achievements DISABLE ROW LEVEL SECURITY;`}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
          <p className="text-muted-foreground mt-1">Manage your job roles, projects, and awards.</p>
        </div>
        
        {!isFormOpen && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add New
          </motion.button>
        )}
      </div>

      {/* Dynamic Form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="bg-card/40 backdrop-blur-md border border-border/50 rounded-2xl p-6 md:p-8 shadow-xl mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  {editingId ? <Edit2 className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-primary" />}
                  {editingId ? 'Edit Achievement' : 'Create Achievement'}
                </h2>
                <button type="button" onClick={resetForm} className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Project Name</label>
                  <input 
                    required type="text" 
                    className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                    placeholder="e.g. BYD Bangladesh"
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/80">Designated Task (Role)</label>
                  <input 
                    type="text" 
                    className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                    placeholder="e.g. Video Content Lead"
                    value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-foreground/80">Description</label>
                  <textarea 
                    className="w-full bg-background/50 border border-border/50 rounded-xl px-4 py-3 min-h-[100px] focus:ring-2 focus:ring-primary/50 transition-all outline-none resize-y"
                    placeholder="Describe your responsibilities..."
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={resetForm} className="px-5 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors font-medium">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={addMutation.isPending || updateMutation.isPending}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 active:scale-95"
                >
                  {(addMutation.isPending || updateMutation.isPending) ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Check className="w-5 h-5" />
                  )}
                  Save Achievement
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* List */}
      <div className="bg-card/30 backdrop-blur-md border border-border/40 rounded-2xl overflow-hidden shadow-xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-muted-foreground">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
            Loading records...
          </div>
        ) : achievements.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center text-muted-foreground border-dashed border-2 border-border/50 m-4 rounded-xl">
            <Briefcase className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium text-foreground/70">No achievements found</p>
            <p className="text-sm mt-1">Click "Add New" to create your first one.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border/30">
            {achievements.map((item: Achievement, index: number) => (
              <motion.li 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                key={item.id} 
                className="p-4 sm:p-6 hover:bg-white/5 transition-colors group flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-lg text-foreground truncate">{item.title}</h3>
                    {item.role && <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20 whitespace-nowrap">{item.role}</span>}
                  </div>
                  <p className="text-muted-foreground text-sm line-clamp-2">{item.description}</p>
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="p-2 rounded-lg bg-white/5 text-foreground/70 hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this?")) {
                        deleteMutation.mutate(item.id!);
                      }
                    }}
                    className="p-2 rounded-lg bg-white/5 text-foreground/70 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminAchievements;