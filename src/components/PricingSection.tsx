import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, Check, PlayCircle } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { getPricingPackets } from "@/lib/db";
import { useQuery } from "@tanstack/react-query";

type Packet = {
  id: string; // was mapped from db id but we'll use tier_id as id in the component state
  tier_id: string;
  name: string;
  tagline: string;
  basePrice: number | null;
  baseVideos: number;
  baseReels: number;
  videoMaxMin?: number;
  videoLabel?: string;
  videoStyle: string | string[];
  reelStyle: string;
  extraVideoPrice: number;
  extraReelPrice: number;
  extraMinutePrice: number;
  maxReels?: number;
  exclusive?: boolean; // true = video OR reels, not both
  best_for: string; // DB uses snake_case
  reference_url: string;
  featured?: boolean;
  delivery?: string;
};

// Database array will map to this type

const Stepper = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max?: number;
  step?: number;
}) => (
  <div className="flex items-center justify-between gap-3 py-2">
    <span className="text-sm text-muted-foreground">{label}</span>
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - step))}
        disabled={value <= min}
        className="w-7 h-7 rounded-md border border-border/60 hover:border-primary/60 hover:bg-primary/10 transition flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label={`Decrease ${label}`}
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-6 text-center font-semibold tabular-nums">{value}</span>
      <button
        type="button"
        onClick={() => onChange(max !== undefined ? Math.min(max, value + step) : value + step)}
        disabled={max !== undefined && value >= max}
        className="w-7 h-7 rounded-md border border-border/60 hover:border-primary/60 hover:bg-primary/10 transition flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label={`Increase ${label}`}
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

const PacketCard = ({ packet, index }: { packet: Packet; index: number }) => {
  const [videos, setVideos] = useState(packet.baseVideos > 0 ? packet.baseVideos : 1);
  const [reels, setReels] = useState(packet.baseReels);
  const [extraMinutes, setExtraMinutes] = useState(0);

  const total = useMemo(() => {
    if (packet.basePrice === null) return null;
    let extraVideoCharge = 0;
    let extraReelCharge = 0;

    if (packet.id === "starter") {
      extraVideoCharge = Math.max(0, videos - packet.baseVideos) * packet.extraVideoPrice;
      extraReelCharge = (reels / 3) * packet.extraReelPrice;
    } else {
      extraVideoCharge = Math.max(0, videos - packet.baseVideos) * packet.extraVideoPrice;
      extraReelCharge = Math.max(0, reels - packet.baseReels) * packet.extraReelPrice;
    }

    const extraMinCharge = (packet.id !== "podcast" && videos > 0) ? extraMinutes * packet.extraMinutePrice : 0;
    return packet.basePrice + extraVideoCharge + extraReelCharge + extraMinCharge;
  }, [packet, videos, reels, extraMinutes]);

  const featured = packet.featured;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] max-w-[380px] ${featured ? "lg:-my-10 lg:scale-[1.15]" : ""} ${index >= 3 ? "lg:mt-5" : ""}`}
    >
      {featured && (
        <>
          {/* Pulsing outer halo */}
          <div className="pointer-events-none absolute -inset-8 rounded-[2.5rem] bg-[radial-gradient(circle_at_center,hsl(265_90%_60%/0.55),transparent_70%)] blur-3xl animate-pricing-pulse" />
          {/* Rotating conic border glow */}
          <div className="pointer-events-none absolute -inset-[2px] rounded-3xl opacity-90 blur-[6px] bg-[conic-gradient(from_var(--glow-angle),hsl(265_90%_60%),hsl(210_95%_60%),hsl(280_90%_65%),hsl(265_90%_60%))] animate-pricing-spin" />
          {/* Drifting accent blob */}
          <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-[radial-gradient(circle_at_30%_20%,hsl(280_90%_65%/0.5),transparent_60%),radial-gradient(circle_at_70%_80%,hsl(210_95%_60%/0.5),transparent_60%)] blur-2xl animate-pricing-drift" />
        </>
      )}

      <div
        className={`relative h-full rounded-3xl border backdrop-blur-xl p-7 md:p-8 flex flex-col ${
          featured
            ? "border-[hsl(260_80%_70%/0.4)] bg-gradient-to-br from-[hsl(265_50%_15%/0.85)] via-[hsl(250_40%_12%/0.85)] to-[hsl(230_50%_10%/0.85)] shadow-[0_30px_80px_-20px_hsl(265_85%_55%/0.6)]"
            : "border-border/50 bg-card/40"
        }`}
      >
        {featured && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-gradient-to-r from-[hsl(265_85%_55%)] to-[hsl(210_90%_60%)] text-white shadow-lg">
            Most Popular
          </div>
        )}

        <div className="mb-5">
          <h3 className={`font-display font-bold ${featured ? "text-3xl md:text-4xl" : "text-2xl md:text-3xl"}`}>
            {packet.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{packet.tagline}</p>
        </div>

        {/* Price */}
        <div className="mb-6">
          {packet.basePrice === null ? (
            <div>
              <div className="text-2xl md:text-3xl font-bold">Custom Quote</div>
              <p className="text-xs text-muted-foreground mt-1">Price will vary from project to project.</p>
            </div>
          ) : (
            <div className="flex items-baseline gap-2">
              <span className={`font-display font-bold ${featured ? "text-5xl" : "text-4xl"}`}>
                {total?.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">tk</span>
              {total !== packet.basePrice && (
                <span className="text-xs text-muted-foreground ml-2">
                  base {packet.basePrice.toLocaleString()}tk
                </span>
              )}
            </div>
          )}
        </div>

        {/* What's included */}
        <ul className="space-y-2.5 mb-5">
          {videos > 0 && (
            <>
              <li className="flex items-start gap-2.5 text-sm">
                <Check className="w-4 h-4 mt-0.5 text-white shrink-0" />
                <span>
                  <strong className="text-foreground">{videos}</strong>{" "}{packet.videoLabel || "full length video"}
                  {videos > 1 ? "s" : ""}
                  {packet.videoMaxMin && ` (${packet.videoMaxMin} min max${extraMinutes > 0 ? ` + ${extraMinutes} min` : ""})`}
                </span>
              </li>
              {Array.isArray(packet.videoStyle) ? (
                packet.videoStyle.map((style, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                    <span>{style}</span>
                  </li>
                ))
              ) : (
                <li className="flex items-start gap-2.5 text-sm">
                  <Check className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                  <span>{packet.videoStyle}</span>
                </li>
              )}
            </>
          )}
          {packet.reelStyle && reels > 0 && (
            <>
              <li className="flex items-start gap-2.5 text-sm">
                <Check className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>
                  <strong className="text-foreground">{reels}</strong> reel{reels !== 1 ? "s" : ""}
                </span>
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <Check className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>{packet.reelStyle}</span>
              </li>
            </>
          )}
          {packet.id === "fullhouse" && (
            <>
              <li className="flex items-start gap-2.5 text-sm">
                <Check className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>Cinematic drone shoot</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <Check className="w-4 h-4 mt-0.5 text-primary shrink-0" />
                <span>Cinema grade production shoot</span>
              </li>
            </>
          )}
        </ul>
        {packet.delivery && (
          <p className="text-xs font-medium text-emerald-400/90 mb-5">
            {(videos !== (packet.baseVideos > 0 ? packet.baseVideos : 1) || reels !== packet.baseReels || extraMinutes > 0)
              ? "Delivery will vary upon customization" 
              : `Delivery within ${packet.delivery.replace(/(\d+)\s+/, "$1\u00A0\u00A0")}`}
          </p>
        )}

        {/* Add-ons */}
        {packet.basePrice !== null && (
          <div className="rounded-xl border border-border/40 bg-background/30 p-4 mb-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Customize
            </p>
            <Stepper
              label="Full length videos"
              value={videos}
              onChange={setVideos}
              min={1}
            />
            {packet.reelStyle && (
              <Stepper
                label="Reels"
                value={reels}
                step={packet.id === "starter" ? 3 : 1}
                onChange={setReels}
                min={0}
                max={packet.id === "starter" ? undefined : packet.exclusive ? packet.maxReels : undefined}
              />
            )}
            {packet.id !== "podcast" && (
              <Stepper
                label={`Extra minutes (+${packet.extraMinutePrice}tk/min)`}
                value={extraMinutes}
                onChange={setExtraMinutes}
                min={0}
              />
            )}
          </div>
        )}

        <p className="text-xs italic text-muted-foreground mb-4">
          {packet.name.toLowerCase().includes('starter') && "Recommended for simple video project"}
          {packet.name.toLowerCase().includes('promotional') && "Recommended for batch production"}
          {(packet.name.toLowerCase().includes('mastercut') || packet.name.toLowerCase().includes('master cut')) && "Recommended for Podcast editing"}
          {packet.name.toLowerCase().includes('full house') && "Recommended for fully customized production"}
        </p>

        <div className="mt-auto flex flex-col gap-2">
          <Button
            asChild
            variant={featured ? "default" : "outline"}
            className={
              featured
                ? "bg-gradient-to-r from-[hsl(265_85%_55%)] to-[hsl(210_90%_60%)] hover:opacity-90 border-0 text-white cursor-pointer"
                : "cursor-pointer"
            }
            onClick={() => {
              let message = "";
              if (packet.id === "fullhouse") {
                message = `Hi Nabil,\n\nI have a large project I'd like to discuss regarding the ${packet.name}.\nPlease let me know your availability for a quick consultation or call to go over the details.\n\nBest,`;
              } else {
                const extraMinutesText = extraMinutes > 0 ? `\n• Extra Minutes: ${extraMinutes}` : '';
                message = `Hi Nabil,\n\nI am interested in booking the ${packet.name} package for my project.\n\nMy required deliverables are:\n• Full-length Videos: ${videos}\n• Reels / Shorts: ${reels}${extraMinutesText}\n\nPlease let me know your availability and the next steps to get started!\n\nBest,`;
              }
              window.dispatchEvent(new CustomEvent('prefill-contact', { detail: message }));
            }}
          >
            <a href="#contact">Book this package</a>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="text-xs text-muted-foreground hover:text-primary inline-flex items-center justify-center gap-1.5 transition"
              >
                <PlayCircle className="w-3.5 h-3.5" /> Watch reference
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-0 overflow-hidden bg-background border-border/60">
              <DialogTitle className="sr-only">{packet.name} reference</DialogTitle>
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={packet.reference_url}
                  title={`${packet.name} reference`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </motion.div>
  );
};

const PricingSection = () => {
  const { data: packets = [], isLoading } = useQuery({
    queryKey: ['pricingPackets'],
    queryFn: async () => {
      const data = await getPricingPackets();
      if (!data || data.length === 0) {
        return [
          {
            id: "starter",
            tier_id: "starter",
            name: "Starter",
            tagline: "For standard edits",
            basePrice: 3500,
            baseVideos: 1,
            baseReels: 0,
            videoMaxMin: 3,
            videoStyle: ["Standard editing", "Color grading", "Copyright free music"],
            reelStyle: "Basic social media edit",
            extraVideoPrice: 3000,
            extraReelPrice: 3000,
            extraMinutePrice: 1000,
            bestFor: "Small businesses & personal brands",
            referenceUrl: "https://youtube.com",
            delivery: "3 working days",
          },
          {
            id: "promotional",
            tier_id: "promotional",
            name: "Promotional",
            tagline: "For serious content",
            basePrice: 8000,
            baseVideos: 1,
            baseReels: 2,
            videoMaxMin: 8,
            videoStyle: ["Semi advance editing", "Copyright free music", "Motion graphics", "Sound design", "Color grading"],
            reelStyle: "high quality reel",
            extraVideoPrice: 5000,
            extraReelPrice: 2000,
            extraMinutePrice: 3000,
            featured: true,
            bestFor: "Brands & serious creators",
            referenceUrl: "https://youtube.com",
            delivery: "7 working days",
          },
          {
            id: "podcast",
            tier_id: "podcast",
            name: "Master Cut",
            tagline: "For standard podcasts",
            basePrice: 7000,
            baseVideos: 1,
            baseReels: 0,
            videoMaxMin: 60,
            videoLabel: "high quality podcast",
            videoStyle: ["25-30s intro", "Motion graphics", "Sound design", "Color correction"],
            reelStyle: "high quality reel",
            extraVideoPrice: 8000,
            extraReelPrice: 2000,
            extraMinutePrice: 0,
            bestFor: "Podcasters & interviewers",
            referenceUrl: "https://youtube.com",
            delivery: "8 working days",
          },
          {
            id: "fullhouse",
            tier_id: "fullhouse",
            name: "Full House",
            tagline: "Total production",
            basePrice: null,
            baseVideos: 1,
            baseReels: 0,
            videoMaxMin: 3,
            videoStyle: "Custom production",
            reelStyle: "",
            extraVideoPrice: 0,
            extraReelPrice: 0,
            extraMinutePrice: 0,
            bestFor: "Agencies & large campaigns",
            referenceUrl: "https://youtube.com",
            delivery: "Custom timeline",
          }
        ];
      }

      // Map the database snake_case structure to the camelCase used in PacketCard
      return data.map((dbPacket: any) => ({
        id: dbPacket.id,
        tier_id: dbPacket.id,
        name: dbPacket.name,
        tagline: dbPacket.tagline,
        basePrice: dbPacket.base_price,
        baseVideos: dbPacket.base_videos,
        baseReels: dbPacket.base_reels,
        videoMaxMin: dbPacket.video_max_min,
        videoStyle: dbPacket.video_style ? (dbPacket.video_style.startsWith('[') ? JSON.parse(dbPacket.video_style) : dbPacket.video_style) : [],
        reelStyle: dbPacket.reel_style,
        extraVideoPrice: dbPacket.extra_video_price,
        extraReelPrice: dbPacket.extra_reel_price,
        extraMinutePrice: dbPacket.extra_minute_price,
        maxReels: dbPacket.max_reels,
        exclusive: dbPacket.exclusive,
        bestFor: dbPacket.best_for,
        referenceUrl: dbPacket.reference_url,
        featured: dbPacket.featured,
        delivery: dbPacket.delivery,
      }));
    }
  });

  return (
    <section id="pricing" className="section-padding max-w-6xl mx-auto">
      <SectionHeading
        title="Pricing"
        subtitle="Transparent packets, fully customizable. Pick a base and dial in the extras."
      />
      <div className="mt-16 md:mt-24 flex flex-wrap justify-center gap-6 lg:gap-8 items-stretch lg:items-center">
        {packets.map((p, i) => (
          <PacketCard key={p.id} packet={p} index={i} />
        ))}
      </div>
    </section>
  );
};

export default PricingSection;
