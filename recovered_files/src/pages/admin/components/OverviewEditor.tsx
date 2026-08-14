import { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function OverviewEditor() {
  const [loading, setLoading] = useState(false);
  
  // These will eventually be fetched from Supabase, but we use local state for now
  const [title, setTitle] = useState("Hi, I'm Nabil");
  const [tagline, setTagline] = useState("Creative Director · Editor · Cinematographer · Photographer");
  const [description, setDescription] = useState("Passionate about telling stories through visual media. I specialize in cinematic videography, creative editing, and striking photography that captures the essence of the moment.");

  const handleSave = async () => {
    setLoading(true);
    // Simulate a database save
    try {
      // In Phase 3, this will be:
      // await supabase.from('site_content').upsert({ id: 'hero', title, tagline, description });
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success("Overview texts saved successfully!");
    } catch (error) {
      toast.error("Failed to save changes.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm max-w-2xl">
      <h2 className="text-xl font-semibold mb-6">Edit Hero Section (Home Page)</h2>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Main Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors font-medium"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Tagline (Underneath Title)</label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 text-muted-foreground">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary transition-colors resize-none"
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 glow-button text-white px-6 py-2.5 rounded-lg font-medium transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
