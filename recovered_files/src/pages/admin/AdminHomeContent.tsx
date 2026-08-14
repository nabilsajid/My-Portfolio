import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getHomeContent, updateHomeContent } from "@/lib/db";
import { useState, useEffect } from "react";

const AdminHomeContent = () => {
  const queryClient = useQueryClient();
  const { data: homeContent, isLoading } = useQuery({
    queryKey: ['homeContent'],
    queryFn: getHomeContent
  });

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    about_text: '[]',
    about_skills: '[]',
    hero_image_desktop_url: '',
    hero_image_mobile_url: ''
  });

  useEffect(() => {
    if (homeContent) {
      setFormData({
        name: homeContent.name,
        tagline: homeContent.tagline,
        about_text: JSON.stringify(homeContent.about_text, null, 2),
        about_skills: JSON.stringify(homeContent.about_skills, null, 2),
        hero_image_desktop_url: homeContent.hero_image_desktop_url,
        hero_image_mobile_url: homeContent.hero_image_mobile_url
      });
    }
  }, [homeContent]);

  const mutation = useMutation({
    mutationFn: (updatedData: any) => updateHomeContent(homeContent.id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homeContent'] });
      alert("Home content updated successfully!");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        about_text: JSON.parse(formData.about_text),
        about_skills: JSON.parse(formData.about_skills)
      };
      mutation.mutate(payload);
    } catch (err) {
      alert("Invalid JSON format for about_text or about_skills");
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Home & About Content</h1>
        <p className="text-muted-foreground mt-2">
          Manage your personal details, tagline, and about me paragraphs.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl bg-card p-6 rounded-xl border border-border">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name</label>
          <input 
            type="text" 
            className="w-full bg-background border border-border rounded-md px-3 py-2"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Tagline</label>
          <input 
            type="text" 
            className="w-full bg-background border border-border rounded-md px-3 py-2"
            value={formData.tagline}
            onChange={e => setFormData({...formData, tagline: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">About Paragraphs (JSON array of strings)</label>
          <textarea 
            className="w-full bg-background border border-border rounded-md px-3 py-2 h-40 font-mono text-sm"
            value={formData.about_text}
            onChange={e => setFormData({...formData, about_text: e.target.value})}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">About Skills (JSON array of strings)</label>
          <input 
            type="text" 
            className="w-full bg-background border border-border rounded-md px-3 py-2 font-mono text-sm"
            value={formData.about_skills}
            onChange={e => setFormData({...formData, about_skills: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Desktop Hero Image URL</label>
            <input 
              type="text" 
              className="w-full bg-background border border-border rounded-md px-3 py-2"
              value={formData.hero_image_desktop_url}
              onChange={e => setFormData({...formData, hero_image_desktop_url: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Mobile Hero Image URL</label>
            <input 
              type="text" 
              className="w-full bg-background border border-border rounded-md px-3 py-2"
              value={formData.hero_image_mobile_url}
              onChange={e => setFormData({...formData, hero_image_mobile_url: e.target.value})}
            />
          </div>
        </div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  );
};

export default AdminHomeContent;