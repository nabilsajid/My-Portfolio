import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Briefcase, 
  Code, 
  Image as ImageIcon, 
  Settings, 
  LogOut,
  Video,
  Camera,
  Layers,
  HelpCircle,
  BarChart,
  CreditCard,
  Menu,
  X
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem("admin_auth");
    if (!isAuth) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    navigate("/admin");
  };

  const navItems = [
    { name: "Home & About", path: "/admin/dashboard/home", icon: Settings },
    { name: "Video Projects", path: "/admin/dashboard/projects?category=video", icon: Video },
    { name: "Photography", path: "/admin/dashboard/projects?category=photography", icon: Camera },
    { name: "Clients", path: "/admin/dashboard/clients", icon: Layers },
    { name: "Testimonials", path: "/admin/dashboard/testimonials", icon: ImageIcon },
    { name: "Achievements", path: "/admin/dashboard/achievements", icon: Briefcase },
    { name: "Skills", path: "/admin/dashboard/skills", icon: Code },
    { name: "Experience", path: "/admin/dashboard/experience", icon: ImageIcon },
    { name: "Pricing", path: "/admin/dashboard/pricing", icon: CreditCard },
    { name: "Stats Counter", path: "/admin/dashboard/stats", icon: BarChart },
    { name: "FAQ", path: "/admin/dashboard/faq", icon: HelpCircle },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent tracking-tight flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Admin Portal
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        <nav className="px-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path.includes('?') && location.pathname === item.path.split('?')[0] && location.search.includes(item.path.split('?')[1]));
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group ${
                  isActive 
                    ? "text-white font-medium" 
                    : "text-secondary-foreground hover:text-foreground"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_0_20px_hsl(var(--accent)/0.3),inset_0_1px_1px_rgba(255,255,255,0.3)] rounded-xl z-0"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <div className={`relative z-10 p-1.5 rounded-lg transition-colors duration-300 ${isActive ? 'bg-white/20 shadow-[0_0_15px_hsl(var(--accent)/0.5)]' : 'bg-transparent group-hover:bg-card/50'}`}>
                  <Icon className={`w-4 h-4 ${isActive ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" : "text-muted-foreground group-hover:text-foreground"}`} />
                </div>
                <span className="relative z-10 text-sm tracking-wide">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-xl transition-all duration-300 border border-transparent hover:border-red-900/50"
        >
          <div className="p-1.5 rounded-lg bg-red-950/50">
            <LogOut className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium tracking-wide">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground flex relative selection:bg-primary/30">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] bg-accent/5 rounded-full blur-[150px] opacity-30" />
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-3 bg-card/80 backdrop-blur-xl border border-border rounded-xl shadow-2xl text-foreground"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-card/90 backdrop-blur-2xl border-r border-border/50 z-50 flex flex-col shadow-[20px_0_40px_rgba(0,0,0,0.3)] md:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[280px] flex-col fixed inset-y-0 left-0 bg-card/40 backdrop-blur-3xl border-r border-border/30 z-40">
        <SidebarContent />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:pl-[280px] min-w-0 transition-all duration-300 relative z-10">
        <div className="max-w-7xl mx-auto p-4 md:p-8 min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname + location.search}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="h-full bg-card/30 backdrop-blur-2xl border border-border/40 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden"
            >
              {/* Content Panel Glare Effect */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;