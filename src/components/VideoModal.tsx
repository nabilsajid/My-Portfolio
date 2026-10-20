import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Play } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";

export interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  title: string;
  vertical?: boolean;
}

export interface VideoEmbedInfo {
  type: "youtube" | "vimeo" | "direct" | "unsupported";
  embedUrl: string;
  originalUrl: string;
}

// Fallback high-quality cinematic showcase videos if placeholder links (like 'https://youtube.com') are used
const FALLBACK_LONGFORM_ID = "L_LUpnjgPso"; // Cinematic Reel
const FALLBACK_SHORTFORM_ID = "J---aiyznGQ"; // Keyboard / Tech Cat Short

export function getVideoEmbedInfo(url?: string, vertical?: boolean): VideoEmbedInfo {
  if (!url || url.trim() === "" || url === "#") {
    const fallbackId = vertical ? FALLBACK_SHORTFORM_ID : FALLBACK_LONGFORM_ID;
    return {
      type: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${fallbackId}?autoplay=1&rel=0&playsinline=1&modestbranding=1`,
      originalUrl: `https://www.youtube.com/watch?v=${fallbackId}`,
    };
  }

  const cleanUrl = url.trim();

  // YouTube Shorts: https://(www.)youtube.com/shorts/VIDEO_ID
  const shortsMatch = cleanUrl.match(/(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
  if (shortsMatch && shortsMatch[1]) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${shortsMatch[1]}?autoplay=1&rel=0&playsinline=1&modestbranding=1`,
      originalUrl: cleanUrl,
    };
  }

  // YouTube standard: https://(www.)youtube.com/watch?v=VIDEO_ID
  const youtubeWatchMatch = cleanUrl.match(/(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/);
  if (youtubeWatchMatch && youtubeWatchMatch[1]) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeWatchMatch[1]}?autoplay=1&rel=0&playsinline=1&modestbranding=1`,
      originalUrl: cleanUrl,
    };
  }

  // YouTube short url: https://youtu.be/VIDEO_ID
  const youtuBeMatch = cleanUrl.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (youtuBeMatch && youtuBeMatch[1]) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtuBeMatch[1]}?autoplay=1&rel=0&playsinline=1&modestbranding=1`,
      originalUrl: cleanUrl,
    };
  }

  // YouTube embed: https://(www.)youtube.com/embed/VIDEO_ID
  const youtubeEmbedMatch = cleanUrl.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
  if (youtubeEmbedMatch && youtubeEmbedMatch[1]) {
    const hasParams = youtubeEmbedMatch[1].includes("?");
    const separator = hasParams ? "&" : "?";
    return {
      type: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeEmbedMatch[1]}${separator}autoplay=1&rel=0&playsinline=1&modestbranding=1`,
      originalUrl: cleanUrl,
    };
  }

  // Vimeo: https://(www.)vimeo.com/VIDEO_ID
  const vimeoMatch = cleanUrl.match(/(?:vimeo\.com\/)([0-9]+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&title=0&byline=0&portrait=0`,
      originalUrl: cleanUrl,
    };
  }

  // Direct video file (.mp4, .webm, .ogg, .mov, supabase storage video, etc.)
  if (
    cleanUrl.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i) ||
    cleanUrl.includes("/storage/v1/object/public/")
  ) {
    return {
      type: "direct",
      embedUrl: cleanUrl,
      originalUrl: cleanUrl,
    };
  }

  // If URL is just bare 'https://youtube.com' or 'https://www.youtube.com' (common mock placeholder)
  if (
    cleanUrl === "https://youtube.com" ||
    cleanUrl === "https://www.youtube.com" ||
    cleanUrl === "https://youtube.com/" ||
    cleanUrl === "https://www.youtube.com/"
  ) {
    const fallbackId = vertical ? FALLBACK_SHORTFORM_ID : FALLBACK_LONGFORM_ID;
    return {
      type: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${fallbackId}?autoplay=1&rel=0&playsinline=1&modestbranding=1`,
      originalUrl: `https://www.youtube.com/watch?v=${fallbackId}`,
    };
  }

  // Generic iframe embed fallback for any https URL
  if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
    return {
      type: "direct",
      embedUrl: cleanUrl,
      originalUrl: cleanUrl,
    };
  }

  return { type: "unsupported", embedUrl: "", originalUrl: cleanUrl };
}

const VideoModal = ({
  isOpen,
  onClose,
  videoUrl,
  title,
  vertical = false,
}: VideoModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const embedInfo = useMemo(
    () => getVideoEmbedInfo(videoUrl, vertical),
    [videoUrl, vertical]
  );

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl"
          onClick={onClose}
        >
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className={`relative flex flex-col bg-card/95 border border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden w-full ${
              vertical
                ? "max-w-[380px] h-[85vh] max-h-[720px]"
                : "max-w-4xl max-h-[88vh]"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-3.5 border-b border-white/10 bg-background/80 backdrop-blur-md z-10">
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <h3 className="text-sm sm:text-base font-semibold text-white truncate drop-shadow-sm">
                  {title || "Now Playing"}
                </h3>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
                  {vertical ? "Short Form" : "Long Form"}
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                {embedInfo.originalUrl && embedInfo.originalUrl.startsWith("http") && (
                  <a
                    href={embedInfo.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open on YouTube / External"
                    className="p-1.5 sm:p-2 text-white/70 hover:text-white bg-white/5 hover:bg-white/15 rounded-full transition-all duration-200"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  onClick={onClose}
                  aria-label="Close video player"
                  className="p-1.5 sm:p-2 text-white/70 hover:text-white bg-white/5 hover:bg-white/15 rounded-full transition-all duration-200"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Video Player Area */}
            <div
              className={`relative w-full bg-black flex items-center justify-center ${
                vertical ? "flex-1 aspect-[9/16]" : "aspect-video"
              }`}
            >
              {embedInfo.type === "youtube" || embedInfo.type === "vimeo" ? (
                <iframe
                  src={embedInfo.embedUrl}
                  title={title}
                  className="w-full h-full border-0 absolute inset-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : embedInfo.type === "direct" ? (
                <video
                  src={embedInfo.embedUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Play className="w-6 h-6" />
                  </div>
                  <p className="text-sm">Video link not available or unsupported.</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default VideoModal;
