import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { LogOut, LayoutDashboard, Image as ImageIcon, Briefcase, Award, MessageSquare, List } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/admin");
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "testimonials", label: "Testimonials", icon: MessageSquare },
    { id: "pricing", label: "Pricing", icon: List },
    { id: "achievements", label: "Achievements", icon: Award },
    { id: "media", label: "Media & Images", icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card p-6 flex flex-col">
        <div className="mb-10 text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          CMS Admin
        </div>

        <nav className="flex-1 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                  activeTab === tab.id ? "bg-primary/20 text-primary" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors mt-auto"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8 capitalize">{activeTab}</h1>
        
        {/* Placeholder for actual CRUD tables */}
        <div className="bg-card border border-border rounded-2xl p-8 min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground text-lg mb-2">The {activeTab} management interface will go here.</p>
            <p className="text-sm opacity-60">Phase 3 of Implementation Plan</p>
          </div>
        </div>
      </main>
    </div>
  );
}
