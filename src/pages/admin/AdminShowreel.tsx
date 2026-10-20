import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Play, Save, RotateCcw, ExternalLink, Film, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VideoModal, { getVideoEmbedInfo } from "@/components/VideoModal";

export default function AdminShowreel() {
  const [showreelUrl, setShowreelUrl] = useState("");
  const [initialUrl, setInitialUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  useEffect(() => {
    fetchShowreel();
  }, []);

  const fetchShowreel = async () => {
    setLoading(true);
    try {
      // 1. Try fetching from site_content (where ShowreelSection looks)
      const { data: siteData, error: siteError } = await supabase
        .from("site_content")
        .select("showreel_url")
        .eq("id", "hero")
        .single();

      if (!siteError && siteData?.showreel_url) {
        setShowreelUrl(siteData.showreel_url);
        setInitialUrl(siteData.showreel_url);
        setLoading(false);
        return;
      }

      // 2. Fallback to home_content if needed
      const { data: homeData } = await supabase
        .from("home_content")
        .select("*")
        .limit(1)
        .single();

      if (homeData && (homeData as any).showreel_url) {
        setShowreelUrl((homeData as any).showreel_url);
        setInitialUrl((homeData as any).showreel_url);
      }
    } catch (err) {
      console.error("Error fetching showreel:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const cleanUrl = showreelUrl.trim();

      // 1. Upsert into site_content (id: 'hero')
      const { error: siteError } = await supabase
        .from("site_content")
        .upsert(
          { id: "hero", showreel_url: cleanUrl },
          { onConflict: "id" }
        );

      if (siteError) {
        console.warn("Could not save to site_content, trying home_content:", siteError);
      }

      // 2. Also attempt to save into home_content as backup
      try {
        await supabase
          .from("home_content")
          .update({ showreel_url: cleanUrl })
          .eq("id", 1);
      } catch (e) {
        // Ignored if column doesn't exist
      }

      setInitialUrl(cleanUrl);
      toast.success("Showreel updated successfully! It will now play on your website.");
    } catch (err) {
      console.error("Failed to save showreel:", err);
      toast.error("Failed to save showreel URL. Please check your connection.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setShowreelUrl(initialUrl);
    toast.info("Changes reset.");
  };

  const embedInfo = getVideoEmbedInfo(showreelUrl, false);
  const hasChanges = showreelUrl !== initialUrl;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Film className="w-8 h-8 text-primary" />
            Showreel Manager
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Configure your main showreel video that plays directly on your homepage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges || saving}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Showreel"}
          </Button>
        </div>
      </div>

      {/* URL Input Form */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          Showreel Video URL
        </h2>
        
        <p className="text-sm text-muted-foreground">
          Paste any YouTube URL, Vimeo link, or direct MP4 video link. When visitors click "Watch Showreel" on your website, it will play directly inside the website without redirecting away.
        </p>

        <div className="space-y-2">
          <Input
            value={showreelUrl}
            onChange={(e) => setShowreelUrl(e.target.value)}
            placeholder="e.g. https://www.youtube.com/watch?v=YOUR_VIDEO_ID or https://vimeo.com/..."
            className="bg-background font-mono text-sm py-2.5"
          />
          <p className="text-xs text-muted-foreground">
            Supported formats: <code className="bg-muted px-1.5 py-0.5 rounded text-[11px]">youtube.com/watch?v=...</code>, <code className="bg-muted px-1.5 py-0.5 rounded text-[11px]">youtu.be/...</code>, <code className="bg-muted px-1.5 py-0.5 rounded text-[11px]">vimeo.com/...</code>, or direct <code className="bg-muted px-1.5 py-0.5 rounded text-[11px]">.mp4</code> files.
          </p>
        </div>

        {/* Action Bar */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsPreviewModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Play className="w-4 h-4 text-primary fill-primary" />
            Test In-Website Playback
          </Button>

          {showreelUrl && showreelUrl.startsWith("http") && (
            <a
              href={showreelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-muted"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Original Link
            </a>
          )}
        </div>
      </div>

      {/* Live In-Page Preview Box */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Play className="w-5 h-5 text-primary" />
          Live Player Preview
        </h2>
        <p className="text-sm text-muted-foreground">
          This preview demonstrates how the embedded player will render inside the website lightbox.
        </p>

        <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10 shadow-lg">
          {embedInfo.type === "youtube" || embedInfo.type === "vimeo" ? (
            <iframe
              src={embedInfo.embedUrl}
              title="Showreel Live Preview"
              className="w-full h-full border-0 absolute inset-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : embedInfo.type === "direct" && embedInfo.embedUrl ? (
            <video
              src={embedInfo.embedUrl}
              controls
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-muted-foreground gap-2">
              <Film className="w-10 h-10 text-muted-foreground/40" />
              <p className="text-sm font-medium">No valid video URL entered</p>
              <p className="text-xs text-muted-foreground/70">
                Paste a YouTube or Vimeo link above to preview your showreel.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Test Modal */}
      <VideoModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        videoUrl={showreelUrl || undefined}
        title="Showreel (Admin Test Preview)"
        vertical={false}
      />
    </div>
  );
}
