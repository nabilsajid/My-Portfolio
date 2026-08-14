import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getHomeContent, updateHomeContent } from "@/lib/db";
import { useState, useEffect } from "react";

const AdminStats = () => {
  const queryClient = useQueryClient();
  const { data: homeContent, isLoading } = useQuery({
    queryKey: ['homeContent'],
    queryFn: getHomeContent
  });

  const [formData, setFormData] = useState({
    projects_completed: 80,
    happy_clients: 30,
    years_experience: 3,
    views_generated: 5
  });

  useEffect(() => {
    if (homeContent) {
      setFormData({
        projects_completed: homeContent.projects_completed ?? 80,
        happy_clients: homeContent.happy_clients ?? 30,
        years_experience: homeContent.years_experience ?? 3,
        views_generated: homeContent.views_generated ?? 5
      });
    }
  }, [homeContent]);

  const mutation = useMutation({
    mutationFn: (updatedData: any) => {
      // We must merge with existing homeContent so we don't overwrite text with nulls
      const payload = { ...homeContent, ...updatedData };
      return updateHomeContent(homeContent.id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homeContent'] });
      alert("Stats updated successfully!");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Stats Counter</h1>
        <p className="text-muted-foreground mt-2">
          Manage the animated numbers displayed in the Stats section.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl bg-card p-6 rounded-xl border border-border">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Projects Completed</label>
            <input 
              type="number" 
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-xl font-bold"
              value={formData.projects_completed}
              onChange={e => setFormData({...formData, projects_completed: parseInt(e.target.value) || 0})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Happy Clients</label>
            <input 
              type="number" 
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-xl font-bold"
              value={formData.happy_clients}
              onChange={e => setFormData({...formData, happy_clients: parseInt(e.target.value) || 0})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Years Experience</label>
            <input 
              type="number" 
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-xl font-bold"
              value={formData.years_experience}
              onChange={e => setFormData({...formData, years_experience: parseInt(e.target.value) || 0})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Views Generated (in Millions)</label>
            <input 
              type="number" 
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-xl font-bold"
              value={formData.views_generated}
              onChange={e => setFormData({...formData, views_generated: parseInt(e.target.value) || 0})}
            />
          </div>
        </div>
        <div className="pt-4">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminStats;