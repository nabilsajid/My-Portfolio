import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Home, Briefcase, Zap, Clock, DollarSign, Mail } from "lucide-react";

const links = [
  { label: "Home", href: "#home", id: "home", icon: Home },
  { label: "Work", href: "#longform", id: "longform", icon: Briefcase },
  { label: "Skills", href: "#skills", id: "skills", icon: Zap },
  { label: "Experience", href: "#experience", id: "experience", icon: Clock },
  { label: "Pricing", href: "#pricing", id: "pricing", icon: DollarSign },
  { label: "Contact", href: "#contact", id: "contact", icon: Mail },
];

const Navbar = () => {
  const [active, setActive] = useState<string | null>("home");
  const [isScrolling, setIsScrolling] = useState(false);

  // Scroll spy logic
  useEffect(() => {
    const handler = () => {
      const probe = window.innerHeight * 0.4;
      let current: string | null = null;
      
      if (window.scrollY < 100) {
        current = "home";
      } else if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
        current = "contact";
      } else {
        for (const l of links) {
          if (l.id === "home") continue;
          const sec = document.getElementById(l.id);
          if (sec) {
            const rect = sec.getBoundingClientRect();
            if (rect.top <= probe && rect.bottom >= probe) {
              current = l.id;
              break;
            }
          }
        }
        
        // Fallback: nearest above probe
        if (!current) {
          let minDiff = Infinity;
          for (const l of links) {
            if (l.id === "home") continue;
            const sec = document.getElementById(l.id);
            if (sec) {
              const rect = sec.getBoundingClientRect();
              if (rect.top <= probe && probe - rect.top < minDiff) {
                minDiff = probe - rect.top;
                current = l.id;
              }
            }
          }
        }
      }
      
      setActive(current || "home");
    };

    handler();
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, []);

  // Scrolling state logic
  useEffect(() => {
    let timeout: any;
    const handleScrollState = () => {
      setIsScrolling(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsScrolling(false);
      }, 300); // 300ms after scrolling stops
    };
    
    window.addEventListener("scroll", handleScrollState, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScrollState);
      clearTimeout(timeout);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href === "#home") {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const targetId = href.replace('#', '');
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navContent = (
    <nav className={`fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${
      isScrolling ? 'opacity-20 pointer-events-none scale-95 blur-[1px]' : 'opacity-100 scale-100 blur-none'
    }`}>
      <div className="flex flex-col gap-4 p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full shadow-2xl shadow-primary/20">
        {links.map((l) => {
          const isActive = active === l.id;
          const Icon = l.icon;
          const isPricing = l.id === "pricing";
          
          return (
            <a
              key={l.id}
              href={l.href}
              onClick={(e) => handleNavClick(e, l.href)}
              className="group relative flex items-center justify-center transition-all duration-300 outline-none"
              aria-label={l.label}
            >
              {/* The Icon Container */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${
                isActive 
                  ? "bg-primary text-primary-foreground shadow-[0_0_15px_-3px_hsl(265_90%_60%/0.8)] scale-110" 
                  : "text-muted-foreground hover:text-white hover:bg-white/10"
              }`}>
                <Icon className={`w-5 h-5 ${isPricing && isActive ? "animate-pulse" : ""}`} />
              </div>

              {/* Tooltip Label (Appears on hover) */}
              <div className="absolute right-full mr-4 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/10 text-white text-sm font-medium opacity-0 -translate-x-4 pointer-events-none group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap shadow-xl">
                {isPricing ? (
                  <span className="bg-gradient-to-r from-[hsl(265_85%_70%)] via-[hsl(280_90%_75%)] to-[hsl(210_95%_70%)] bg-clip-text text-transparent font-bold">
                    {l.label}
                  </span>
                ) : (
                  l.label
                )}
                {/* Tooltip triangle */}
                <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 border-y-[6px] border-y-transparent border-l-[6px] border-l-white/10"></div>
                <div className="absolute top-1/2 -right-1 -translate-y-1/2 border-y-[6px] border-y-transparent border-l-[6px] border-l-black/80"></div>
              </div>
            </a>
          );
        })}
      </div>
    </nav>
  );

  return typeof document !== "undefined" ? createPortal(navContent, document.body) : navContent;
};

export default Navbar;
