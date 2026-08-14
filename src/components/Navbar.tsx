import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Work", href: "#longform", id: "longform" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Pricing", href: "#pricing", id: "pricing" },
  { label: "Contact", href: "#contact", id: "contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    const sections = links
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => !!el);

    const handler = () => {
      const probe = window.innerHeight * 0.4;
      let current: string | null = null;
      for (const sec of sections) {
        const rect = sec.getBoundingClientRect();
        if (rect.top <= probe && rect.bottom >= probe) {
          current = sec.id;
          break;
        }
      }
      // Fallback: pick last section whose top is above probe
      if (!current) {
        for (const sec of sections) {
          const rect = sec.getBoundingClientRect();
          if (rect.top <= probe) current = sec.id;
        }
      }
      setActive(current);
    };

    handler();
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const elem = document.getElementById(targetId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
    setOpen(false);
  };

  const navContent = (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto" ref={menuRef}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 glass-effect rounded-2xl px-4 py-3 space-y-1 min-w-[180px] shadow-lg shadow-primary/10"
          >
            {links.map((l, i) => {
              const isActive = active === l.id;
              const isPricing = l.id === "pricing";
              return (
                <motion.a
                  key={l.label}
                  href={l.href}
                  onClick={(e) => handleNavClick(e, l.href)}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2, ease: "easeOut" }}
                  className={`relative block text-sm transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5 ${
                    isActive ? "text-foreground border border-primary/40 bg-white/5" : "text-muted-foreground hover:text-foreground"
                  } ${isPricing ? "font-semibold" : ""}`}
                >
                  <span className="relative">
                    {isPricing ? (
                      <span className="bg-gradient-to-r from-[hsl(265_85%_70%)] via-[hsl(280_90%_75%)] to-[hsl(210_95%_70%)] bg-clip-text text-transparent">
                        {l.label}
                      </span>
                    ) : (
                      l.label
                    )}
                  </span>
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-effect rounded-full px-3 py-2 flex items-center gap-1 shadow-lg shadow-primary/10">
        <a href="#" className="font-display font-bold text-sm text-gradient px-3 py-1.5">
          Portfolio
        </a>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const isActive = active === l.id;
            const isPricing = l.id === "pricing";
            return (
              <a
                key={l.label}
                href={l.href}
                onClick={(e) => handleNavClick(e, l.href)}
                className={`relative text-sm px-3 py-1.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? "text-foreground bg-white/5 border border-primary/40 shadow-[0_0_20px_-4px_hsl(265_90%_60%/0.6)]"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
                } ${isPricing ? "font-semibold" : ""}`}
              >
                <span className="relative bg-clip-text">
                  {isPricing ? (
                    <span className="bg-gradient-to-r from-[hsl(265_85%_70%)] via-[hsl(280_90%_75%)] to-[hsl(210_95%_70%)] bg-clip-text text-transparent">
                      {l.label}
                    </span>
                  ) : (
                    l.label
                  )}
                </span>
              </a>
            );
          })}
        </div>

        <motion.button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground px-2 py-1.5"
          aria-label="Toggle menu"
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.15 }}
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <X className="w-5 h-5" />
              </motion.span>
            ) : (
              <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Menu className="w-5 h-5" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </nav>
  );

  return typeof document !== "undefined" ? createPortal(navContent, document.body) : navContent;
};

export default Navbar;
